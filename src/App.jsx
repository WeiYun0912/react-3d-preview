import { Suspense, useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, Html, PresentationControls, TransformControls } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { ModelViewer, clearCache } from "./components/ModelViewer";
import { OrbitControlsWrapper } from "./components/OrbitControlsWrapper";

function Loader() {
    return (
        <Html center>
            <div className="flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
        </Html>
    );
}

export default function App() {
    const [modelUrl, setModelUrl] = useState(null);
    const [transformMode, setTransformMode] = useState(null);
    const [lightIntensity, setLightIntensity] = useState(0.5);
    const [backgroundColor, setBackgroundColor] = useState("#f0f0f0");
    const [autoRotate, setAutoRotate] = useState(false);
    const [isModelVisible, setIsModelVisible] = useState(true);
    const [modelScale, setModelScale] = useState(1);

    const fileInputRef = useRef(null);
    const modelRef = useRef(null);

    // 重置模型URL時清理舊的緩存
    useEffect(() => {
        return () => {
            if (modelUrl) {
                clearCache(modelUrl);
            }
        };
    }, [modelUrl]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // 清理之前的模型URL（如果有）
            if (modelUrl) {
                URL.revokeObjectURL(modelUrl);
                clearCache(modelUrl);
            }

            // 創建新的URL並設置
            const url = URL.createObjectURL(file);
            setIsModelVisible(false); // 先隱藏模型

            // 給瀏覽器一點時間處理
            setTimeout(() => {
                setModelUrl(url);
                setIsModelVisible(true); // 再顯示模型
            }, 100);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const resetView = () => {
        // 重置模型設定
        setTransformMode(null);
        setLightIntensity(0.5);
        setAutoRotate(false);
        setModelScale(1);
    };

    const adjustScale = (amount) => {
        setModelScale((prev) => Math.max(0.1, prev + amount));
    };

    return (
        <div className="relative w-full h-screen" style={{ backgroundColor }}>
            {/* 控制面板 CSS 添加touch-action none */}
            <div
                className="absolute top-4 left-4 z-10 p-4 bg-white rounded-lg shadow-md w-64"
                style={{ touchAction: "none" }}
            >
                <h2 className="text-xl font-bold mb-3">3D 模型檢視器</h2>

                <div className="space-y-4">
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".glb,.gltf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={triggerFileInput}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            上傳模型 (.glb/.gltf)
                        </button>
                    </div>

                    {modelUrl && (
                        <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                            >
                                <div>
                                    <label className="block text-sm font-medium mb-1">背景顏色</label>
                                    <input
                                        type="color"
                                        value={backgroundColor}
                                        onChange={(e) => setBackgroundColor(e.target.value)}
                                        className="w-full h-8 rounded border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        燈光強度: {lightIntensity.toFixed(1)}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={lightIntensity}
                                        onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        模型大小: {modelScale.toFixed(1)}
                                    </label>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => adjustScale(-0.1)}
                                            className="px-3 py-1 bg-gray-200 rounded"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="5"
                                            step="0.1"
                                            value={modelScale}
                                            onChange={(e) => setModelScale(parseFloat(e.target.value))}
                                            className="flex-1"
                                        />
                                        <button
                                            onClick={() => adjustScale(0.1)}
                                            className="px-3 py-1 bg-gray-200 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="autoRotate"
                                        checked={autoRotate}
                                        onChange={(e) => setAutoRotate(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="autoRotate" className="text-sm">
                                        自動旋轉
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">變形控制</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                setTransformMode((prev) => (prev === "translate" ? null : "translate"))
                                            }
                                            className={`px-2 py-1 text-sm rounded ${
                                                transformMode === "translate" ? "bg-blue-500 text-white" : "bg-gray-200"
                                            }`}
                                        >
                                            移動
                                        </button>
                                        <button
                                            onClick={() =>
                                                setTransformMode((prev) => (prev === "rotate" ? null : "rotate"))
                                            }
                                            className={`px-2 py-1 text-sm rounded ${
                                                transformMode === "rotate" ? "bg-blue-500 text-white" : "bg-gray-200"
                                            }`}
                                        >
                                            旋轉
                                        </button>
                                        <button
                                            onClick={() =>
                                                setTransformMode((prev) => (prev === "scale" ? null : "scale"))
                                            }
                                            className={`px-2 py-1 text-sm rounded ${
                                                transformMode === "scale" ? "bg-blue-500 text-white" : "bg-gray-200"
                                            }`}
                                        >
                                            縮放
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={resetView}
                                    className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                >
                                    重置模型設定
                                </button>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* 3D 畫布 - 添加touch-action樣式 */}
            <div className="w-full h-full" style={{ touchAction: "none" }}>
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    style={{ touchAction: "none" }} // 關鍵修復
                    dpr={[1, 2]} // 優化高DPI設備的性能
                >
                    <color attach="background" args={[backgroundColor]} />
                    <ambientLight intensity={lightIntensity} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.15}
                        penumbra={1}
                        intensity={lightIntensity * 2}
                        castShadow
                    />

                    <Suspense fallback={<Loader />}>
                        {modelUrl && isModelVisible && (
                            <>
                                {/* 模型容器，用於變形控制 */}
                                <group ref={modelRef}>
                                    <ModelViewer
                                        url={modelUrl}
                                        autoRotate={autoRotate && !transformMode}
                                        scale={modelScale}
                                    />
                                </group>

                                {/* 條件性渲染變形控制元件 */}
                                {transformMode && modelRef.current && (
                                    <TransformControls
                                        object={modelRef.current}
                                        mode={transformMode}
                                        size={0.7}
                                        onMouseDown={() => setAutoRotate(false)}
                                    />
                                )}
                            </>
                        )}

                        <Environment preset="city" />
                        <ContactShadows
                            position={[0, -1, 0]}
                            opacity={0.4}
                            scale={10}
                            blur={1.5}
                            far={2}
                            resolution={256}
                        />
                    </Suspense>

                    {/* 使用修復版的軌道控制 */}
                    <OrbitControlsWrapper />
                </Canvas>
            </div>
        </div>
    );
}
