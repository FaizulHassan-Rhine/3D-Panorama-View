import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PanoramaScene from "../PanoramaScene/PanoramaScene";
import CameraControls from "../CameraControls/CameraControls";
import Hotspot from "../Hotspot/Hotspot";
import ControlsPanel from "../ControlsPanel/ControlsPanel";

const PanoramaViewer = () => {
  const orbitRef = useRef();
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(75);
  const [loading, setLoading] = useState(true);

  const zoomIn = () => {
    if (zoomLevel > 20) setZoomLevel((prev) => prev - 5);
  };

  const zoomOut = () => {
    if (zoomLevel < 90) setZoomLevel((prev) => prev + 5);
  };

  const toggleAutoRotate = () => {
    setAutoRotate((prev) => !prev);
    if (orbitRef.current) {
      orbitRef.current.autoRotate = !orbitRef.current.autoRotate;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleWheelZoom = useCallback((event) => {
    event.deltaY > 0 ? zoomOut() : zoomIn();
  }, [zoomIn, zoomOut]);

  useEffect(() => {
    window.addEventListener("wheel", handleWheelZoom);
    return () => {
      window.removeEventListener("wheel", handleWheelZoom);
    };
  }, [handleWheelZoom]);

  return (
    <div className="fixed inset-0 w-full h-full bg-gray-100">
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 bg-opacity-50 z-20">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-black mt-3">Loading...</p>
        </div>
      )}

      {/* Fullscreen 3D Canvas */}
      <div className="relative w-full h-full">
        <Canvas
          camera={{ fov: 75, position: [0, 0, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <ambientLight intensity={1.5} />
          <PanoramaScene onLoad={() => setLoading(false)} scale={[5, 5, 5]} />
          <CameraControls zoomLevel={zoomLevel} />
          <Hotspot  position={[2, -3, -8]} />

          <OrbitControls
            ref={orbitRef}
            enableZoom={false}
            enablePan={false}
            autoRotate={autoRotate}
            rotateSpeed={-1}
          />
        </Canvas>
      </div>

      {/* Floating Controls Panel - Positioned at bottom center of the image */}
      {!loading && (
  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50">
    <ControlsPanel
      zoomIn={zoomIn}
      zoomOut={zoomOut}
      toggleAutoRotate={toggleAutoRotate}
      autoRotate={autoRotate}
      toggleFullscreen={toggleFullscreen}
    />
  </div>
)}
    </div>
  );
};

export default PanoramaViewer;
