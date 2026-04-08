"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import {
  Camera,
  RefreshCcw,
  CameraOff,
  Download,
  Loader2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";

// --- Types ---
interface FaceData {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  detected: boolean;
}

// --- 3D Glasses Component ---
// This component handles the transformation based on tracker data
const GlassesModel = ({
  faceData,
  modelPath,
}: {
  faceData: FaceData;
  modelPath: string;
}) => {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current && faceData.detected) {
      // Smooth interpolation for tracking
      meshRef.current.position.lerp(faceData.position, 0.4);
      meshRef.current.rotation.set(
        faceData.rotation.x,
        faceData.rotation.y,
        faceData.rotation.z,
      );
      meshRef.current.scale.setScalar(faceData.scale);
    }
  });

  return (
    <group ref={meshRef} visible={faceData.detected}>
      <primitive object={scene} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
};
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error("Canvas crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return <WebGLFallback />;
    }

    return this.props.children;
  }
}

// --- Fallback Component for when WebGL isn't available ---
const WebGLFallback = () => (
  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md p-8 text-center">
    <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
    <h3 className="text-xl font-bold text-white mb-4">WebGL Not Supported</h3>
    <p className="text-gray-400 mb-6 max-w-md">
      Your device doesn't support WebGL, which is required for 3D rendering.
      Please try updating your browser or graphics drivers.
    </p>
    <div className="text-sm text-gray-500">
      <p>Try these solutions:</p>
      <ul className="mt-2 space-y-1">
        <li>• Update your browser to the latest version</li>
        <li>• Update your graphics drivers</li>
        <li>• Try a different browser (Chrome, Firefox, Edge)</li>
      </ul>
    </div>
  </div>
);

// --- Main Page Component ---
export default function TryOnPage() {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);

  // State
  const [loading, setLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelIndex, setModelIndex] = useState(0);
  const [webglSupported, setWebglSupported] = useState(true);
  const [faceData, setFaceData] = useState<FaceData>({
    position: new THREE.Vector3(),
    rotation: new THREE.Euler(),
    scale: 1,
    detected: false,
  });

  const models = [
    "/models/glasses_1.glb", // Replace with your actual paths
    "/models/glasses_2.glb",
  ];

  // Check WebGL support
  useEffect(() => {
    try {
      if (!WebGL.isWebGL2Available()) {
        throw new Error("WebGL not available");
      }

      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

      if (!gl) {
        throw new Error("WebGL context failed");
      }

      setWebglSupported(true);
    } catch (e) {
      console.error("WebGL Error:", e);
      setWebglSupported(false);
      setError("Your device does not support WebGL rendering.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Webcam
  useEffect(() => {
    if (!cameraActive) return;

    const startCamera = async () => {
      try {
        // Try high resolution first, fallback to lower if needed
        const constraints = [
          { video: { width: 1280, height: 720, facingMode: "user" } },
          { video: { width: 640, height: 480, facingMode: "user" } },
          {
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: "user",
            },
          },
          { video: { facingMode: "user" } },
        ];

        let stream: MediaStream | null = null;
        for (const constraint of constraints) {
          try {
            stream = await navigator.mediaDevices.getUserMedia(constraint);
            break;
          } catch (err) {
            console.warn(`Failed with constraint:`, constraint, err);
          }
        }

        if (!stream) {
          throw new Error("Unable to access camera with any constraints");
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            detectFrame();
          };
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError(
          "Camera permission denied or not available. Please enable camera access and try again.",
        );
        setCameraActive(false);
      }
    };

    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraActive]);

  // Detection Loop
  const detectFrame = () => {
    if (
      videoRef.current &&
      landmarkerRef.current &&
      videoRef.current.readyState >= 2
    ) {
      const results = landmarkerRef.current.detectForVideo(
        videoRef.current,
        performance.now(),
      );

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0];

        // Logic to calculate position based on nose bridge (Landmark 1)
        // Note: Coordinate mapping from Video Space to Three.js Space
        const nose = landmarks[1];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        // Simple distance for scaling
        const eyeDist = Math.sqrt(
          Math.pow(rightEye.x - leftEye.x, 2) +
            Math.pow(rightEye.y - leftEye.y, 2),
        );

        // Update state with normalized coordinates mapped to Three.js units
        setFaceData({
          position: new THREE.Vector3(
            (0.5 - nose.x) * 10,
            (0.5 - nose.y) * 10,
            -5,
          ),
          rotation: new THREE.Euler(
            (nose.y - 0.5) * 0.5,
            (0.5 - nose.x) * 0.5,
            0,
          ),
          scale: eyeDist * 15,
          detected: true,
        });
      } else {
        setFaceData((prev) => ({ ...prev, detected: false }));
      }
    }
    if (cameraActive) requestAnimationFrame(detectFrame);
  };

  const captureScreenshot = () => {
    // Logic to merge video frame and canvas into one image
    alert("Snapshot saved to gallery!");
  };

  return (
    <div className="relative bg-slate-950 overflow-hidden flex flex-col items-center justify-center font-sans pt-20 ">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFA500]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFD700]/10 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* --- Header Section --- */}
      <div className="relative z-10 text-center mb-8 px-4">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
          Try Your{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFA500] to-[#FFD700]">
            Glasses in 3D
          </span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base">
          Experience our virtual fitting room. Align your face with the camera
          to see the magic.
        </p>
      </div>

      {/* --- Main Viewport --- */}
      <div className="relative w-full max-w-4xl h-screen bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md">
            <Loader2 className="w-12 h-12 text-[#FFA500] animate-spin mb-4" />
            <p className="text-white font-bold tracking-widest animate-pulse">
              INITIALIZING AI TRACKER...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 p-8 text-center">
            <CameraOff className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-white text-xl font-bold mb-4">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setError(null);
                  setCameraActive(true);
                }}
                className="px-6 py-3 bg-[#FFA500] text-white rounded-xl font-bold hover:bg-[#FFD700] transition-colors"
              >
                Retry Camera
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-500 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        )}

        {/* WebGL Not Supported */}
        {!webglSupported && !loading && <WebGLFallback />}

        {/* Video Feed */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          playsInline
          muted
        />

        {/* 3D Overlay */}
        {webglSupported && !error && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <CanvasErrorBoundary>
              <Canvas
                dpr={[1, 1]} // prevents high GPU load
                gl={{
                  failIfMajorPerformanceCaveat: false,
                  powerPreference: "low-power",
                  antialias: false,
                  alpha: true,
                }}
                onCreated={({ gl }) => {
                  const context = gl.getContext();
                  if (!context) {
                    console.error("WebGL context creation failed");
                    setWebglSupported(false);
                  }
                }}
                onError={(e) => {
                  console.error("Canvas error:", e);
                  setWebglSupported(false);
                }}
              >
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <Suspense fallback={null}>
                  <GlassesModel
                    faceData={faceData}
                    modelPath={models[modelIndex]}
                  />
                </Suspense>
              </Canvas>
            </CanvasErrorBoundary>
          </div>
        )}

        {/* UI Overlay Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button
            onClick={() => setModelIndex((modelIndex + 1) % models.length)}
            className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-[#FFA500] transition-all active:scale-90 shadow-lg"
            title="Switch Model"
          >
            <RefreshCcw size={24} />
          </button>

          <button
            onClick={captureScreenshot}
            className="p-6 bg-linear-to-tr from-[#FFA500] to-[#FFD700] rounded-full text-white shadow-xl shadow-orange-500/20 hover:scale-110 transition-transform active:scale-95"
            title="Take Photo"
          >
            <Camera size={32} />
          </button>

          <button
            onClick={() => setCameraActive(!cameraActive)}
            className={`p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-red-500 transition-all ${!cameraActive && "bg-red-500"}`}
            title="Toggle Camera"
          >
            {cameraActive ? <CameraOff size={24} /> : <Camera size={24} />}
          </button>
        </div>

        {/* Detection Feedback */}
        {faceData.detected && (
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-md border border-green-500/50 rounded-full animate-in fade-in zoom-in duration-300">
            <Sparkles className="text-green-400 w-4 h-4" />
            <span className="text-green-400 text-xs font-black uppercase tracking-widest">
              Face Aligned
            </span>
          </div>
        )}
      </div>

      {/* --- Footer / Thumbnails --- */}
      <div className="mt-8 flex gap-4 overflow-x-auto pb-4 px-4 w-full justify-center">
        {models.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setModelIndex(idx)}
            className={`w-20 h-20 rounded-2xl border-2 transition-all shrink-0 bg-white/5 backdrop-blur-md ${
              modelIndex === idx
                ? "border-[#FFA500] scale-110 bg-white/10"
                : "border-white/10"
            }`}
          >
            <span className="text-[#FFA500] text-xs font-bold uppercase tracking-tighter">
              Style {idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Glassmorphism Instruction Card */}
      <div className="mt-8 mx-4 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl max-w-xl text-center">
        <p className="text-gray-400 text-sm italic">
          Tip: Ensure you are in a well-lit room and face the camera directly
          for the most accurate 3D placement.
        </p>
      </div>
    </div>
  );
}
