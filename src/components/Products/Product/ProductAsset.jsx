import { useState, useEffect, useRef } from "react";

const ProductAsset = ({ imagePath, imageCount = 91 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
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
  const updateFrame = (movement) => {
    const frameWidth = 5;
    let newFrame = Math.round(currentFrame + movement / frameWidth);
    newFrame = (newFrame + imageCount) % imageCount;
    setCurrentFrame(newFrame);
  };

  const handleDrag = (clientX) => {
    if (dragging && imagesLoaded) {
      const movement = startX - clientX;
      updateFrame(movement);
      setStartX(clientX);
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => handleDrag(e.clientX);
  const handleMouseUp = () => setDragging(false);

  const handleTouchStart = (e) => {
    setDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => handleDrag(e.touches[0].clientX);
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
  }, [dragging, startX, imagesLoaded]);

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
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 1));

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
            className="relative w-[400px] h-[400px] 2xl:w-[600px] 2xl:h-[600px] overflow-hidden border rounded-md shadow-md cursor-grab flex items-center justify-center"
          >
            <img
              src={imagesRef.current[currentFrame]?.src}
              alt={`Product View ${currentFrame + 1}`}
              className="object-cover transition-transform duration-100 ease-out"
              draggable="false"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="mt-4 flex space-x-4">
            {/* Auto Rotate Button */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="px-4 py-2 bg-sky-400 text-white rounded-sm shadow hover:bg-sky-600"
            >
              {isAutoRotating ? "Stop Auto Rotate" : "Start Auto Rotate"}
            </button>

            {/* Zoom In/Out Buttons */}
            <button
              onClick={handleZoomIn}
              className="w-10 bg-sky-400 text-white rounded-sm shadow hover:bg-sky-600"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 bg-sky-400 text-white rounded-sm shadow hover:bg-sky-600"
            >
              -
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAsset;
