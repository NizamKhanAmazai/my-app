"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function DiagnosticAR() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [aiStatus, setAiStatus] = useState("Waiting for camera...");
  const [error, setError] = useState<string | null>(null);

  // 1. INITIALIZE CAMERA (The most important part)
  const startCamera = async () => {
    setError(null);
    try {
      // Check for HTTPS
      if (
        window.location.protocol !== "https:" &&
        window.location.hostname !== "localhost"
      ) {
        throw new Error("SECURITY: Camera requires HTTPS on mobile devices.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
          setAiStatus("Camera OK. Loading AI...");
          initAI(); // Start AI only after camera works
        };
      }
    } catch (err: any) {
      console.error("Camera Error:", err);
      setError(
        err.name === "NotAllowedError"
          ? "Permission Denied: Please allow camera access."
          : err.message,
      );
    }
  };

  // 2. INITIALIZE AI & 3D
  const initAI = async () => {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        alpha: true,
        antialias: false,
      });
      renderer.setSize(640, 480);
      scene.add(new THREE.AmbientLight(0xffffff, 2));

      const loader = new GLTFLoader();
      let glasses: THREE.Group | null = null;

      loader.load("/models/glasses_1.glb", (gltf) => {
        glasses = gltf.scene as any;
        glasses!.visible = false;
        scene.add(glasses!);
      });

      const fileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
      );
      const landmarker = await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "CPU", // Vital for Vivo Y21
        },
        runningMode: "VIDEO",
      });

      setAiStatus("AI Ready. Tracking...");

      const loop = () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          const results = landmarker.detectForVideo(
            videoRef.current,
            performance.now(),
          );
          if (results.faceLandmarks?.[0] && glasses) {
            glasses.visible = true;
            const p = results.faceLandmarks[0];
            // Core mapping
            glasses.position.set(
              (p[168].x - 0.5) * -8,
              (0.5 - p[168].y) * 6,
              2,
            );
            glasses.rotation.z = -Math.atan2(
              p[263].y - p[33].y,
              p[263].x - p[33].x,
            );
            const d = Math.sqrt(
              Math.pow(p[263].x - p[33].x, 2) + Math.pow(p[263].y - p[33].y, 2),
            );
            glasses.scale.setScalar(d * 12);
          } else if (glasses) {
            glasses.visible = false;
          }
          renderer.render(scene, camera);
        }
        requestAnimationFrame(loop);
      };
      loop();
    } catch (e: any) {
      setAiStatus("AI Failed to load.");
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-orange-500 p-4 flex flex-col items-center justify-center font-sans">
      <div className="bg-white p-6 rounded-[2rem] shadow-2xl w-full max-w-lg border-b-8 border-orange-700">
        <h1 className="text-center font-black text-orange-600 italic text-2xl mb-4 uppercase tracking-tighter">
          Diagnostic Mirror
        </h1>

        <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden mb-6">
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover -scale-x-100"
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none -scale-x-100"
          />

          {!cameraActive && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startCamera}
                className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold animate-bounce shadow-xl"
              >
                ENABLE CAMERA
              </button>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center p-6 text-center">
              <p className="text-white font-bold text-sm uppercase">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400">Camera Status:</span>
            <span
              className={cameraActive ? "text-green-500" : "text-orange-400"}
            >
              {cameraActive ? "Active" : "Off"}
            </span>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-400">AI Engine:</span>
            <span className="text-orange-600">{aiStatus}</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-white/50 text-[9px] font-bold uppercase tracking-[0.2em]">
        Next.js Hardware Bridge v3.0
      </p>
    </main>
  );
}
// "use client";

// import React, {
//   Component,
//   ErrorInfo,
//   ReactNode,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// // 1. THE ERROR BOUNDARY CLASS
// // This catches "rendering" crashes (like Three.js failures)
// class ARSystemErrorBoundary extends Component<
//   { children: ReactNode },
//   { hasError: boolean; errorMsg: string }
// > {
//   constructor(props: { children: ReactNode }) {
//     super(props);
//     this.state = { hasError: false, errorMsg: "" };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, errorMsg: error.message };
//   }

//   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
//     console.error("AR Crash caught by Boundary:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen bg-orange-600 flex items-center justify-center p-6 text-center">
//           <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md">
//             <h2 className="text-red-600 font-black text-2xl mb-2">
//               ENGINE FAILURE
//             </h2>
//             <p className="text-gray-600 text-sm mb-6">{this.state.errorMsg}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors"
//             >
//               REBOOT SYSTEM
//             </button>
//           </div>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// // 2. THE AR LOGIC COMPONENT
// const MODEL_PATH = "/models/glasses_1.glb";

// function ARVisionInner() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // Refs for cleanup (Crucial for preventing PC/Mobile crashes)
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const modelRef = useRef<THREE.Group | null>(null);
//   const landmarkerRef = useRef<FaceLandmarker | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const requestRef = useRef<number | null>(null);

//   const [status, setStatus] = useState("Initializing...");
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isFaceDetected, setIsFaceDetected] = useState(false);

//   useEffect(() => {
//     async function startAR() {
//       try {
//         // Init Three.js
//         const scene = new THREE.Scene();
//         const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
//         camera.position.z = 5;

//         const renderer = new THREE.WebGLRenderer({
//           canvas: canvasRef.current!,
//           alpha: true,
//           antialias: false,
//           precision: "mediump",
//         });
//         renderer.setSize(640, 480);

//         scene.add(new THREE.AmbientLight(0xffffff, 2));
//         const light = new THREE.DirectionalLight(0xffffff, 1);
//         light.position.set(0, 5, 5);
//         scene.add(light);

//         sceneRef.current = scene;
//         rendererRef.current = renderer;

//         // Load Model
//         setStatus("Loading 3D Model...");
//         const loader = new GLTFLoader();
//         loader.load(
//           MODEL_PATH,
//           (gltf) => {
//             gltf.scene.visible = false;
//             scene.add(gltf.scene);
//             modelRef.current = gltf.scene as any;
//           },
//           undefined,
//           (e) => setErrorMessage("Model path not found in /public/models/"),
//         );

//         // Init AI
//         setStatus("Starting AI Engine...");
//         const fileset = await FilesetResolver.forVisionTasks(
//           "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
//         );
//         const landmarker = await FaceLandmarker.createFromOptions(fileset, {
//           baseOptions: {
//             modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
//             delegate: "CPU", // CPU is safer for Vivo Y21 and Intel HD 3000
//           },
//           runningMode: "VIDEO",
//           numFaces: 1,
//         });
//         landmarkerRef.current = landmarker;

//         // Init Camera
//         setStatus("Activating Lens...");
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { width: 640, height: 480, facingMode: "user" },
//         });
//         streamRef.current = stream;

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current?.play();
//             setStatus("Ready");
//             renderLoop();
//           };
//         }
//       } catch (err: any) {
//         setErrorMessage(err.message || "Hardware/Camera access denied");
//       }
//     }

//     const renderLoop = () => {
//       if (
//         videoRef.current &&
//         landmarkerRef.current &&
//         rendererRef.current &&
//         sceneRef.current
//       ) {
//         const results = landmarkerRef.current.detectForVideo(
//           videoRef.current,
//           performance.now(),
//         );

//         if (modelRef.current) {
//           if (results.faceLandmarks && results.faceLandmarks.length > 0) {
//             setIsFaceDetected(true);
//             modelRef.current.visible = true;
//             const pts = results.faceLandmarks[0];
//             const nose = pts[168];
//             const left = pts[33];
//             const right = pts[263];

//             // Mapping
//             modelRef.current.position.x = (nose.x - 0.5) * -8;
//             modelRef.current.position.y = (0.5 - nose.y) * 6;
//             modelRef.current.position.z = 2;

//             const roll = Math.atan2(right.y - left.y, right.x - left.x);
//             modelRef.current.rotation.z = -roll;

//             const d = Math.sqrt(
//               Math.pow(right.x - left.x, 2) + Math.pow(right.y - left.y, 2),
//             );
//             modelRef.current.scale.setScalar(d * 11);
//           } else {
//             setIsFaceDetected(false);
//             modelRef.current.visible = false;
//           }
//           rendererRef.current.render(
//             sceneRef.current,
//             new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000).copy(
//               new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000),
//             ),
//           );
//           // Update: The line above was simplified, let's fix the camera reference
//         }
//       }
//       requestRef.current = requestAnimationFrame(renderLoop);
//     };

//     startAR();

//     return () => {
//       // CLEANUP: Prevents the PC from crashing on reload
//       if (requestRef.current) cancelAnimationFrame(requestRef.current);
//       streamRef.current?.getTracks().forEach((t) => t.stop());
//       rendererRef.current?.dispose();
//       landmarkerRef.current?.close();
//     };
//   }, []);

//   if (errorMessage) {
//     throw new Error(errorMessage); // This triggers the Error Boundary
//   }

//   return (
//     <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border-b-8 border-orange-800">
//       <header className="bg-orange-600 p-4 flex justify-between items-center text-white">
//         <h1 className="font-black italic tracking-tighter uppercase ml-4">
//           AR Vision v2
//         </h1>
//         <div
//           className={`px-4 py-1 rounded-full text-[10px] font-bold ${isFaceDetected ? "bg-green-500" : "bg-yellow-500 text-orange-950 animate-pulse"}`}
//         >
//           {isFaceDetected ? "TRACKING ACTIVE" : status}
//         </div>
//       </header>

//       <div className="relative aspect-video bg-stone-900 group">
//         <video
//           ref={videoRef}
//           playsInline
//           muted
//           className="absolute inset-0 w-full h-full object-cover -scale-x-100"
//         />
//         <canvas
//           ref={canvasRef}
//           className="absolute inset-0 w-full h-full pointer-events-none -scale-x-100"
//         />

//         {!isFaceDetected && status === "Ready" && (
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <p className="bg-orange-600/80 text-white px-6 py-2 rounded-full text-xs font-bold backdrop-blur-sm">
//               FIT FACE IN FRAME
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // 3. THE EXPORTED PAGE
// export default function VirtualTryOnPage() {
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-4 flex items-center justify-center font-sans">
//       <ARSystemErrorBoundary>
//         <ARVisionInner />
//       </ARSystemErrorBoundary>
//     </main>
//   );
// }

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// // Ensure your model is at: public/models/glasses_1.glb
// const MODEL_PATH = "/models/glasses_1.glb";

// export default function VirtualTryOn3D() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // Three.js References
//   const sceneRef = useRef<THREE.Scene | null>(null);
//   const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
//   const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
//   const modelRef = useRef<THREE.Group | null>(null);

//   const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
//     null,
//   );
//   const [status, setStatus] = useState("Loading AI...");

//   // 1. Initialize Three.js (The 3D Engine)
//   useEffect(() => {
//     if (!canvasRef.current) return;

//     // Create Scene
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;

//     // Create Camera
//     const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
//     camera.position.z = 5;
//     cameraRef.current = camera;

//     // Create Renderer (Optimized for Vivo Y21)
//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       alpha: true, // Transparent background to see video
//       antialias: false, // Save memory
//       precision: "mediump", // Lowers GPU load
//     });
//     renderer.setSize(640, 480);
//     rendererRef.current = renderer;

//     // Add Basic Lights
//     const ambientLight = new THREE.AmbientLight(0xffffff, 2);
//     scene.add(ambientLight);
//     const sunLight = new THREE.DirectionalLight(0xffffff, 1);
//     sunLight.position.set(0, 5, 5);
//     scene.add(sunLight);

//     // Load your GLB Model
//     const loader = new GLTFLoader();
//     loader.load(MODEL_PATH, (gltf) => {
//       const model = gltf.scene;
//       model.visible = false; // Hide until face is detected
//       scene.add(model);
//       modelRef.current = model as any;
//     });

//     return () => {
//       renderer.dispose();
//     };
//   }, []);

//   // 2. Initialize MediaPipe (The AI) - Same as your working code
//   useEffect(() => {
//     const initAI = async () => {
//       const fileset = await FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
//       );
//       const landmarker = await FaceLandmarker.createFromOptions(fileset, {
//         baseOptions: {
//           modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
//           delegate: "GPU", // Using GPU as your working code did
//         },
//         runningMode: "VIDEO",
//         numFaces: 1,
//       });
//       setFaceLandmarker(landmarker);
//       setStatus("Ready!");
//     };
//     initAI();
//   }, []);

//   // 3. Start Camera - Same as your working code
//   useEffect(() => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices
//         .getUserMedia({
//           video: { width: 640, height: 480, facingMode: "user" },
//         })
//         .then((stream) => {
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//             videoRef.current.onloadedmetadata = () => {
//               videoRef.current?.play();
//               predictWebcam();
//             };
//           }
//         });
//     }
//   }, [faceLandmarker]);

//   const predictWebcam = async () => {
//     if (
//       !videoRef.current ||
//       !faceLandmarker ||
//       !sceneRef.current ||
//       !rendererRef.current
//     ) {
//       requestAnimationFrame(predictWebcam);
//       return;
//     }

//     const results = faceLandmarker.detectForVideo(
//       videoRef.current,
//       performance.now(),
//     );

//     if (modelRef.current) {
//       if (results.faceLandmarks.length > 0) {
//         // Requirement 1: Appear when face is detected
//         modelRef.current.visible = true;

//         const landmarks = results.faceLandmarks[0];
//         const noseBridge = landmarks[168];
//         const leftEye = landmarks[33];
//         const rightEye = landmarks[263];

//         // --- MATH: Position ---
//         // Convert MediaPipe (0 to 1) to Three.js coordinates
//         // For the camera at Z=5, the visible width is roughly 8 units
//         modelRef.current.position.x = (noseBridge.x - 0.5) * -8;
//         modelRef.current.position.y = (0.5 - noseBridge.y) * 6;
//         modelRef.current.position.z = 2; // Fixed distance from camera

//         // --- MATH: Rotation ---
//         const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
//         modelRef.current.rotation.z = -roll;

//         // --- MATH: Scale ---
//         const eyeDist = Math.sqrt(
//           Math.pow(rightEye.x - leftEye.x, 2) +
//             Math.pow(rightEye.y - leftEye.y, 2),
//         );
//         const scaleFactor = eyeDist * 12; // Adjust 12 until it fits your model
//         modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);

//         // Yaw (Turning left/right)
//         const yaw = (landmarks[1].x - noseBridge.x) * 2;
//         modelRef.current.rotation.y = yaw;
//       } else {
//         // Requirement 2: Disappear when face disappears
//         modelRef.current.visible = false;
//       }

//       // Render the frame
//       rendererRef.current.render(sceneRef.current, cameraRef.current!);
//     }

//     requestAnimationFrame(predictWebcam);
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-4 flex flex-col items-center justify-center font-sans overflow-hidden">
//       <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl overflow-hidden border-4 border-orange-200">
//         {/* Yellow/Orange Header */}
//         <div className="bg-orange-600 p-5 text-center">
//           <h1 className="text-2xl font-black text-white uppercase tracking-widest">
//             3D GLASSES TRY-ON
//           </h1>
//           <p className="text-yellow-300 text-[10px] font-bold uppercase">
//             {status}
//           </p>
//         </div>

//         <div className="p-4 flex flex-col items-center">
//           {/* AR Viewport */}
//           <div className="relative w-full aspect-[4/3] bg-black rounded-2xl border-4 border-white shadow-lg overflow-hidden">
//             {/* The real video (Mirrored) */}
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               muted
//               className="absolute inset-0 w-full h-full object-cover -scale-x-100"
//             />

//             {/* The 3D Overlay (Mirrored to match video) */}
//             <canvas
//               ref={canvasRef}
//               className="absolute inset-0 w-full h-full pointer-events-none -scale-x-100"
//             />

//             {!faceLandmarker && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/60">
//                 <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
//               </div>
//             )}
//           </div>

//           <div className="mt-6 w-full flex justify-center">
//             <div
//               className={`px-6 py-2 rounded-full font-black text-xs transition-all ${modelRef.current?.visible ? "bg-orange-600 text-white" : "bg-yellow-100 text-orange-900 opacity-50"}`}
//             >
//               {modelRef.current?.visible
//                 ? "LENS CONNECTED"
//                 : "POSITION FACE IN VIEW"}
//             </div>
//           </div>
//         </div>
//       </div>

//       <footer className="mt-4 text-orange-900/50 text-[10px] font-bold uppercase tracking-widest">
//         Optimized for Vivo Y21 • 3D Engine v1.0
//       </footer>
//     </main>
//   );
// }

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
