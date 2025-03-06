import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const PanoramaScene = ({ onLoad, scale = [5, 5, 5] }) => {
  const texture = useLoader(TextureLoader, "./images/Feedback_04.webp"); // Ensure correct path
  
  useEffect(() => {
    if (texture) onLoad();
  }, [texture, onLoad]);

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[5, 64, 64]} /> {/* Ensures full sphere */}
      <meshBasicMaterial map={texture} side={2} /> {/* Ensures texture is visible */}
    </mesh>
  );
};

export default PanoramaScene;
