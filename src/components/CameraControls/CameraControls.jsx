import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";

const CameraControls = ({ zoomLevel }) => {
  const { camera } = useThree();

  useEffect(() => {
    gsap.to(camera, {
      fov: zoomLevel,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }, [zoomLevel, camera]);

  return null;
};

export default CameraControls;
