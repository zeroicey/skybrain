import React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { DroneModel } from "./drone-model"

interface ModelCanvasProps {
  scale?: number
  className?: string
}

export function ModelCanvas({ scale = 3, className = "" }: ModelCanvasProps) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fff5f0" />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#ff8c42" />
        <pointLight position={[0, 2, 0]} intensity={0.5} color="#ff7eb3" />
        <DroneModel scale={scale} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}