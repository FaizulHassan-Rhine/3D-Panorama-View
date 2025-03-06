import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";

const Hotspot = ({ position }) => {
  const navigate = useNavigate();
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  // Handle click event
  const handleClick = () => {
    navigate("/product-one");
  };

  // Animation logic
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Create a blinking effect by modulating the scale
      const scale = Math.sin(clock.getElapsedTime() * 3) * 0.1 + 1; // Adjust the multiplier for speed
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh
    ref={meshRef}
    position={position}
    onClick={handleClick}
    onPointerOver={(event) => {
      event.stopPropagation(); // Prevent event bubbling
      setIsHovered(true);
      document.body.style.cursor = "pointer"; // Change cursor to pointer
    }}
    onPointerOut={(event) => {
      event.stopPropagation(); // Prevent event bubbling
      setIsHovered(false);
      document.body.style.cursor = "auto"; // Reset cursor to default
    }}
  >
    <sphereGeometry args={[0.2, 30, 30]} />
    <meshBasicMaterial color={ "red"} transparent opacity={0.8} />
  </mesh>
  );
};

export default Hotspot;