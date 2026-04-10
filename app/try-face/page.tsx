"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const GLB_MODEL_PATH = "/models/glasses_1.glb";

// ==========================================
// 1. 3D Glasses Component (Optimized)
// ==========================================
function GlassesModel({ trackingData }: { trackingData: TrackingResult | null }) {
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    if (!trackingData || !trackingData.detected) {
      groupRef.current.visible = false;
      return;
    }

    const landmarks = trackingData.landmarks;
    const group = groupRef.current;
    group.visible = true;

    // Mapping logic for a standard overlay
    const noseBridge = landmarks[168];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    
    // Scale tracking to Canvas units (approximate)
    const x = (noseBridge.x - 0.5) * 8; 
    const y = (0.5 - noseBridge.y) * 6;

    group.position.set(
      THREE.MathUtils.lerp(group.position.x, x, 0.8),
      THREE.MathUtils.lerp(group.position.y, y, 0.8),
      2 // Move closer to camera to be visible
    );

    // Rotation
    const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    group.rotation.z = -roll;

    // Distance/Scale
    const dist = Math.sqrt(Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2));
    const s = dist * 10;
    group.scale.set(s, s, s);
  });

  return (
    <group ref={groupRef} visible={false}>
      <primitive object={scene} />
    </group>
  );
}

// ==========================================
// 2. Main Page & Viewport Logic
// ==========================================
export default function VirtualTryOn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tracking, setTracking] = useState<TrackingResult | null>(null);
  const [isAiLoaded, setIsAiLoaded] = useState(false);
  const [webglError, setWebglError] = useState<string | null>(null);

  // Setup Camera & AI
  useEffect(() => {
    let landmarker: FaceLandmarker;
    let animationFrame: number;
    let stream: MediaStream;

    async function setup() {
      try {
        // 1. Init AI
        const fileset = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
        landmarker = await FaceLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });
        setIsAiLoaded(true);

        // 2. Init Camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, facingMode: "user" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            startDetection();
          };
        }
      } catch (err) {
        console.error("Setup failed", err);
      }
    }

    function startDetection() {
      if (videoRef.current && landmarker) {
        const results = landmarker.detectForVideo(videoRef.current, performance.now());
        if (results.faceLandmarks.length > 0) {
          setTracking({ detected: true, landmarks: results.faceLandmarks[0] });
        } else {
          setTracking({ detected: false, landmarks: [] });
        }
      }
      animationFrame = requestAnimationFrame(startDetection);
    }

    setup();
    return () => {
      cancelAnimationFrame(animationFrame);
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-600 p-4 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border-b-8 border-orange-800">
        
        <header className="bg-orange-600 p-6 flex justify-between items-center text-white">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">AR Vision 3D</h1>
          <div className="text-xs font-bold bg-yellow-400 text-orange-950 px-3 py-1 rounded-full">
            {tracking?.detected ? "FACE ACTIVE" : "SCANNING..."}
          </div>
        </header>

        <div className="p-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200 text-sm">
                <p className="font-bold text-orange-800">Note for Intel Graphics:</p>
                <p className="text-orange-900/70 italic mt-2">If glasses don't appear, your browser might have disabled 3D for your graphics card.</p>
            </div>
            {!isAiLoaded && <div className="p-4 bg-yellow-100 text-orange-800 font-bold animate-pulse rounded-xl text-center">Loading AI...</div>}
          </div>

          {/* VIEWPORT AREA */}
          <div className="lg:col-span-8 relative aspect-video bg-black rounded-3xl overflow-hidden shadow-inner border-4 border-white">
            
            {/* LAYER 1: Standard Video Background (Mirror mode) */}
            <video 
              ref={videoRef} 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover -scale-x-100" 
            />

            {/* LAYER 2: Three.js AR Overlay */}
            <div className="absolute inset-0 z-10 -scale-x-100 pointer-events-none">
              <Canvas 
                gl={{ antialias: false, alpha: true }} // Alpha:true allows seeing the video through the canvas
                onCreated={({ gl }) => {
                   // Check if WebGL actually works
                   if (!gl.getContext()) setWebglError("WebGL Failed");
                }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={1} />
                  <pointLight position={[5, 5, 5]} />
                  <GlassesModel trackingData={tracking} />
                </Suspense>
              </Canvas>
            </div>

            {webglError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-10 text-center z-20">
                <p className="font-bold">Hardware Error: Your computer's graphics card (Intel HD 3000) is too old to render 3D in this browser.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

type TrackingResult = { detected: boolean; landmarks: any[] };











// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// export default function VirtualTryOn() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
//     null,
//   );
//   const [glassesImage, setGlassesImage] = useState<HTMLImageElement | null>(
//     null,
//   );
//   const [isLoading, setIsLoading] = useState(true);

//   // Initialize MediaPipe
//   useEffect(() => {
//     const initMediaPipe = async () => {
//       const filesetResolver = await FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
//       );
//       const landmarker = await FaceLandmarker.createFromOptions(
//         filesetResolver,
//         {
//           baseOptions: {
//             modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
//             delegate: "GPU",
//           },
//           runningMode: "VIDEO",
//           numFaces: 1,
//         },
//       );
//       setFaceLandmarker(landmarker);
//       setIsLoading(false);
//     };
//     initMediaPipe();
//   }, []);

//   // Handle Image Upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const img = new Image();
//       img.src = URL.createObjectURL(file);
//       img.onload = () => setGlassesImage(img);
//     }
//   };

//   // Start Camera
//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.addEventListener("loadeddata", predictWebcam);
//         }
//       });
//     }
//   }, [faceLandmarker, glassesImage]);

//   const predictWebcam = async () => {
//     if (
//       !videoRef.current ||
//       !canvasRef.current ||
//       !faceLandmarker ||
//       !glassesImage
//     ) {
//       requestAnimationFrame(predictWebcam);
//       return;
//     }

//     const startTimeMs = performance.now();
//     const results = faceLandmarker.detectForVideo(
//       videoRef.current,
//       startTimeMs,
//     );

//     const ctx = canvasRef.current.getContext("2d");
//     if (ctx && results.faceLandmarks.length > 0) {
//       const landmarks = results.faceLandmarks[0];

//       // Clear canvas
//       ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//       // 1. Get Key Points (Indices based on MediaPipe Face Mesh)
//       const leftEye = landmarks[33]; // Left eye outer corner
//       const rightEye = landmarks[263]; // Right eye outer corner
//       const noseBridge = landmarks[168]; // Bridge of nose

//       // 2. Calculate coordinates
//       const width =
//         Math.abs(rightEye.x - leftEye.x) * canvasRef.current.width * 2.5; // Scale multiplier
//       const height = (width * glassesImage.height) / glassesImage.width;
//       const x = noseBridge.x * canvasRef.current.width;
//       const y = noseBridge.y * canvasRef.current.height;

//       // 3. Calculate Rotation (Roll)
//       const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

//       // 4. Draw Glasses
//       ctx.save();
//       ctx.translate(x, y);
//       ctx.rotate(angle);

//       // Perspective simulation: adjust width if head turns (Yaw)
//       const yawFactor = Math.abs(landmarks[1].x - noseBridge.x) * 10;
//       const displayWidth = width * (1 - yawFactor);

//       ctx.drawImage(
//         glassesImage,
//         -displayWidth / 2,
//         -height / 2,
//         displayWidth,
//         height,
//       );
//       ctx.restore();
//     }

//     requestAnimationFrame(predictWebcam);
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-8 flex flex-col items-center font-sans">
//       <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-200">
//         {/* Header */}
//         <div className="bg-orange-600 p-6 text-center">
//           <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
//             Virtual Glass Try-On
//           </h1>
//           <p className="text-orange-100 text-sm mt-1">Powered by AI Tracking</p>
//         </div>

//         <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
//           {/* Controls */}
//           <div className="w-full md:w-1/3 space-y-6">
//             <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200">
//               <label className="block text-orange-800 font-bold mb-2 uppercase text-xs">
//                 1. Upload Glasses (PNG)
//               </label>
//               <input
//                 type="file"
//                 accept="image/png"
//                 onChange={handleImageUpload}
//                 className="w-full text-sm text-orange-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
//               />
//             </div>

//             <div className="text-orange-900 text-sm space-y-2 italic bg-orange-100/50 p-4 rounded-xl">
//               <p>• Move your head to see it follow.</p>
//               <p>• Tilt left and right to see rotation.</p>
//               {!glassesImage && (
//                 <p className="text-red-500 font-bold">
//                   Please upload a PNG to start!
//                 </p>
//               )}
//             </div>

//             {isLoading && (
//               <div className="flex items-center justify-center space-x-2 text-orange-600 font-bold animate-pulse">
//                 <span>Loading AI Model...</span>
//               </div>
//             )}
//           </div>

//           {/* Camera View */}
//           <div className="relative w-full aspect-video bg-black rounded-2xl border-8 border-white shadow-inner overflow-hidden">
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               className="absolute inset-0 w-full h-full object-cover -scale-x-100"
//             />
//             <canvas
//               ref={canvasRef}
//               width={640}
//               height={480}
//               className="absolute inset-0 w-full h-full object-cover -scale-x-100"
//             />
//             {!isLoading && !glassesImage && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
//                 <p className="text-white font-bold text-lg bg-orange-600 px-6 py-2 rounded-full">
//                   Waiting for PNG...
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <footer className="mt-8 text-orange-900/70 text-sm font-medium">
//         Built with Next.js & MediaPipe
//       </footer>
//     </main>
//   );
// }
