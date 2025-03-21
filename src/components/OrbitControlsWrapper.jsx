import { useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export function OrbitControlsWrapper({
    enableDamping = true,
    dampingFactor = 0.25,
    rotateSpeed = 0.5,
    maxPolarAngle = Math.PI / 1.5,
    minPolarAngle = 0,
}) {
    const { gl } = useThree();

    useEffect(() => {
        // 設置touch-action樣式到畫布元素
        if (gl.domElement) {
            gl.domElement.style.touchAction = "none";

            // 這會為畫布添加一個專注的樣式，幫助用戶理解互動區域
            gl.domElement.style.outline = "none";

            // 添加事件監聽器
            const preventDefault = (e) => e.preventDefault();
            gl.domElement.addEventListener("touchstart", preventDefault, { passive: false });

            return () => {
                gl.domElement.removeEventListener("touchstart", preventDefault);
            };
        }
    }, [gl]);

    return (
        <OrbitControls
            enableDamping={enableDamping}
            dampingFactor={dampingFactor}
            rotateSpeed={rotateSpeed}
            maxPolarAngle={maxPolarAngle}
            minPolarAngle={minPolarAngle}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            makeDefault
        />
    );
}
