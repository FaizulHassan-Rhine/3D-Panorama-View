import { useState, useEffect, useRef } from "react";

const ProductAssetV2 = ({ imagePath, imageCount = 91 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const autoRotateIntervalRef = useRef(null);

  // Preload images
  useEffect(() => {
    let loadedImages = 0;

    const loadImage = (index) => {
      const img = new Image();
      img.src = `${imagePath}${index + 1}.webp`;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === imageCount) {
          setImagesLoaded(true);
        }
      };
      imagesRef.current[index] = img;
    };

    for (let i = 0; i < imageCount; i++) {
      loadImage(i);
    }
  }, [imagePath, imageCount]);

  // Dragging logic
  const updateFrame = (movementX) => {
    if (zoomLevel === 1) {
      // Normal rotation
      const frameWidth = 5;
      let newFrame = Math.round(currentFrame + movementX / frameWidth);
      newFrame = (newFrame + imageCount) % imageCount;
      setCurrentFrame(newFrame);
    }
  };

  const handleDrag = (clientX, clientY) => {
    if (dragging && imagesLoaded) {
      if (zoomLevel === 1) {
        // Rotate the product if not zoomed in
        updateFrame(startX - clientX);
      } else {
        // Move the image when zoomed in
        setOffsetX((prev) => Math.min(Math.max(prev - (startX - clientX), -100), 100));
        setOffsetY((prev) => Math.min(Math.max(prev - (startY - clientY), -100), 100));
      }
      setStartX(clientX);
      setStartY(clientY);
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e) => handleDrag(e.clientX, e.clientY);
  const handleMouseUp = () => setDragging(false);

  const handleTouchStart = (e) => {
    setDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => handleDrag(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchEnd = () => setDragging(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, startX, startY, imagesLoaded]);

  // Auto Rotate Functionality
  useEffect(() => {
    if (isAutoRotating) {
      autoRotateIntervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % imageCount);
      }, 100);
    } else {
      clearInterval(autoRotateIntervalRef.current);
    }
    return () => clearInterval(autoRotateIntervalRef.current);
  }, [isAutoRotating, imageCount]);

  // Zoom In/Out Handlers
  const handleZoomIn = () => {
    if (zoomLevel < 2) {
      setZoomLevel(zoomLevel + 0.2);
      setOffsetX(0);
      setOffsetY(0);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 0.2);
      if (zoomLevel <= 1.2) {
        setOffsetX(0);
        setOffsetY(0);
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      {!imagesLoaded ? (
        // Loader while images are loading
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading Product...</p>
        </div>
      ) : (
        // Product Viewer
        <>
          <div
            ref={containerRef}
            className="relative w-[600px] h-[600px] overflow-hidden cursor-grab flex items-center justify-center bg-gray-200"
          >
            <img
              src={imagesRef.current[currentFrame]?.src}
              alt={`Product View ${currentFrame + 1}`}
              className="transition-transform duration-100 ease-out"
              draggable="false"
              style={{
                transform: `scale(${zoomLevel}) translate(${offsetX}px, ${offsetY}px)`,
                cursor: zoomLevel > 1 ? "grab" : "default",
              }}
            />
          </div>

          {/* Control Buttons */}
          <div className="mt-4 flex space-x-4">
            {/* Auto Rotate Button */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            >
              {isAutoRotating ? "Stop Auto Rotate" : "Start Auto Rotate"}
            </button>

            {/* Zoom In/Out Buttons */}
            <button
              onClick={handleZoomIn}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="px-3 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
            >
              -
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAssetV2;
