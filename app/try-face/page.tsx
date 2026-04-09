"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function VirtualTryOn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null,
  );
  const [glassesImage, setGlassesImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Initialize MediaPipe
  useEffect(() => {
    const initMediaPipe = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
      );
      const landmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        },
      );
      setFaceLandmarker(landmarker);
      setIsLoading(false);
    };
    initMediaPipe();
  }, []);

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => setGlassesImage(img);
    }
  };

  // Start Camera
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
      });
    }
  }, [faceLandmarker, glassesImage]);

  const predictWebcam = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !faceLandmarker ||
      !glassesImage
    ) {
      requestAnimationFrame(predictWebcam);
      return;
    }

    const startTimeMs = performance.now();
    const results = faceLandmarker.detectForVideo(
      videoRef.current,
      startTimeMs,
    );

    const ctx = canvasRef.current.getContext("2d");
    if (ctx && results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // 1. Get Key Points (Indices based on MediaPipe Face Mesh)
      const leftEye = landmarks[33]; // Left eye outer corner
      const rightEye = landmarks[263]; // Right eye outer corner
      const noseBridge = landmarks[168]; // Bridge of nose

      // 2. Calculate coordinates
      const width =
        Math.abs(rightEye.x - leftEye.x) * canvasRef.current.width * 2.5; // Scale multiplier
      const height = (width * glassesImage.height) / glassesImage.width;
      const x = noseBridge.x * canvasRef.current.width;
      const y = noseBridge.y * canvasRef.current.height;

      // 3. Calculate Rotation (Roll)
      const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

      // 4. Draw Glasses
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Perspective simulation: adjust width if head turns (Yaw)
      const yawFactor = Math.abs(landmarks[1].x - noseBridge.x) * 10;
      const displayWidth = width * (1 - yawFactor);

      ctx.drawImage(
        glassesImage,
        -displayWidth / 2,
        -height / 2,
        displayWidth,
        height,
      );
      ctx.restore();
    }

    requestAnimationFrame(predictWebcam);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 p-8 flex flex-col items-center font-sans">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-200">
        {/* Header */}
        <div className="bg-orange-600 p-6 text-center">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Virtual Glass Try-On
          </h1>
          <p className="text-orange-100 text-sm mt-1">Powered by AI Tracking</p>
        </div>

        <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
          {/* Controls */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200">
              <label className="block text-orange-800 font-bold mb-2 uppercase text-xs">
                1. Upload Glasses (PNG)
              </label>
              <input
                type="file"
                accept="image/png"
                onChange={handleImageUpload}
                className="w-full text-sm text-orange-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
              />
            </div>

            <div className="text-orange-900 text-sm space-y-2 italic bg-orange-100/50 p-4 rounded-xl">
              <p>• Move your head to see it follow.</p>
              <p>• Tilt left and right to see rotation.</p>
              {!glassesImage && (
                <p className="text-red-500 font-bold">
                  Please upload a PNG to start!
                </p>
              )}
            </div>

            {isLoading && (
              <div className="flex items-center justify-center space-x-2 text-orange-600 font-bold animate-pulse">
                <span>Loading AI Model...</span>
              </div>
            )}
          </div>

          {/* Camera View */}
          <div className="relative w-full aspect-video bg-black rounded-2xl border-8 border-white shadow-inner overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover -scale-x-100"
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full object-cover -scale-x-100"
            />
            {!isLoading && !glassesImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <p className="text-white font-bold text-lg bg-orange-600 px-6 py-2 rounded-full">
                  Waiting for PNG...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-8 text-orange-900/70 text-sm font-medium">
        Built with Next.js & MediaPipe
      </footer>
    </main>
  );
}
