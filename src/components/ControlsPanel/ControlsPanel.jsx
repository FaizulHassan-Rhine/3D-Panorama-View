import React from "react";
import { FaExpand, FaCompress, FaSync, FaSearchPlus, FaSearchMinus } from "react-icons/fa";

const ControlsPanel = ({ zoomIn, zoomOut, toggleAutoRotate, autoRotate, toggleFullscreen }) => {
  return (
    <div className="flex items-center space-x-6 p-4 bg-gray-400 rounded-lg shadow-2xl">
      {/* Zoom In Button */}
      <button
        onClick={zoomIn}
        className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
        title="Zoom In"
      >
        <FaSearchPlus className=" text-xl" />
      </button>

      {/* Zoom Out Button */}
      <button
        onClick={zoomOut}
        className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
        title="Zoom Out"
      >
        <FaSearchMinus className=" text-xl" />
      </button>

      {/* Auto Rotate Toggle Button */}
      <button
        onClick={toggleAutoRotate}
        className={`p-2 rounded-full transition-all duration-200 ${
          autoRotate ? "bg-green-500" : "bg-white bg-opacity-20 hover:bg-opacity-30"
        }`}
        title={autoRotate ? "Stop Auto Rotate" : "Start Auto Rotate"}
      >
        <FaSync className={` text-xl ${autoRotate ? "animate-spin-slow" : ""}`} />
      </button>

      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
        title="Toggle Fullscreen"
      >
        {document.fullscreenElement ? (
          <FaCompress className=" text-xl" />
        ) : (
          <FaExpand className=" text-xl" />
        )}
      </button>
    </div>
  );
};

export default ControlsPanel;