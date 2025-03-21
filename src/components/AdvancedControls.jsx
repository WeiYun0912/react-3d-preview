import { useState } from "react";

import { Html, OrbitControls, TransformControls, GizmoHelper, GizmoViewport } from "@react-three/drei";

export function AdvancedControls({ target, transformMode = null, onModeChange }) {
    const [showControls, setShowControls] = useState(false);

    // 設定控制模式 (translate, rotate, scale)
    const handleModeChange = (mode) => {
        if (onModeChange) onModeChange(mode);
    };

    return (
        <>
            {/* 基本軌道控制 */}
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

            {/* 變形控制工具 - 在選擇特定物件時顯示 */}
            {target && transformMode && <TransformControls object={target} mode={transformMode} />}

            {/* 3D 空間導航幫助工具 */}
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>

            {/* 控制面板 UI */}
            <Html position={[-1, -1, 0]} center>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white bg-opacity-80 p-3 rounded-lg shadow-lg"
                >
                    {showControls ? (
                        <>
                            <div className="flex space-x-2 mb-2">
                                <button
                                    onClick={() => handleModeChange("translate")}
                                    className={`px-2 py-1 rounded ${
                                        transformMode === "translate" ? "bg-blue-500 text-white" : "bg-gray-200"
                                    }`}
                                >
                                    移動
                                </button>
                                <button
                                    onClick={() => handleModeChange("rotate")}
                                    className={`px-2 py-1 rounded ${
                                        transformMode === "rotate" ? "bg-blue-500 text-white" : "bg-gray-200"
                                    }`}
                                >
                                    旋轉
                                </button>
                                <button
                                    onClick={() => handleModeChange("scale")}
                                    className={`px-2 py-1 rounded ${
                                        transformMode === "scale" ? "bg-blue-500 text-white" : "bg-gray-200"
                                    }`}
                                >
                                    縮放
                                </button>
                            </div>
                            <button
                                onClick={() => setShowControls(false)}
                                className="w-full px-2 py-1 bg-gray-300 rounded"
                            >
                                隱藏控制項
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setShowControls(true)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            顯示控制項
                        </button>
                    )}
                </motion.div>
            </Html>
        </>
    );
}
