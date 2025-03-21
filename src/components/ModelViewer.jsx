import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

export function ModelViewer({ url, autoRotate = false, position = [0, 0, 0], scale = 1 }) {
    const modelRef = useRef();
    const { scene } = useGLTF(url);

    // 使用useMemo來複製場景，避免每次渲染時都重新複製
    const copiedScene = useMemo(() => {
        // 深度複製場景
        const clonedScene = scene.clone(true);

        // 為所有網格添加默認材質屬性，使之能夠接收陰影
        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // 確保材質正確複製
                if (child.material) {
                    child.material = child.material.clone();
                }
            }
        });

        return clonedScene;
    }, [scene]);

    // 自動旋轉模型
    useFrame((state, delta) => {
        if (autoRotate && modelRef.current) {
            modelRef.current.rotation.y += delta * 0.5;
        }
    });

    // 確保在組件卸載時清理資源
    useEffect(() => {
        return () => {
            // 清理複製的場景資源
            if (copiedScene) {
                copiedScene.traverse((object) => {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach((material) => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }
        };
    }, [copiedScene]);

    // 調整模型位置與大小
    return (
        <primitive
            ref={modelRef}
            object={copiedScene}
            position={position}
            scale={typeof scale === "number" ? [scale, scale, scale] : scale}
            // 添加觸控事件屬性，解決touch-action警告
            onClick={(e) => {
                // 防止事件冒泡
                e.stopPropagation();
            }}
        />
    );
}

// 清理預加載資源
export function clearCache(url) {
    if (url) useGLTF.dispose(url);
}
