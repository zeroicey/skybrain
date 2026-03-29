import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";

// Color palette
const colors = {
  green: "#7ddf7d",
  greenDark: "#1a3d1a",
  orange: "#ff8c42",
  orangeLight: "#ffb366",
  pink: "#ff7eb3",
  pinkLight: "#ff9eca",
};

import { useGLTF } from "@react-three/drei";

function DroneModel() {
  const { nodes, materials } = useGLTF("/drone3d.glb");

  return (
    <group dispose={null} scale={4}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes[Object.keys(nodes)[0]]?.geometry}
        material={materials[Object.keys(materials)[0]]}
      />
    </group>
  );
}

useGLTF.preload("/drone3d.glb");

function ParticleRing() {
  const points = useRef<THREE.Points>(null);

  const particleCount = 300;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 1.5;
    positions[i] = Math.cos(angle) * radius;
    positions[i + 1] = (Math.random() - 0.5) * 0.3;
    positions[i + 2] = Math.sin(angle) * radius;
  }

  useFrame((state) => {
    if (points.current) points.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color={colors.green} transparent opacity={0.6} />
    </points>
  );
}

function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#fff5f0" />
      <pointLight position={[0, 2, 0]} intensity={0.8} color="#ffffff" />
      <DroneModel />
      <ParticleRing />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} />
    </Canvas>
  );
}


// Cycling typewriter effect - shows multiple texts in rotation
function CyclingTypewriter({ texts, delay = 0 }: { texts: string[]; delay?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor((prev) => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!started) return;

    const currentText = texts[currentIndex];

    if (isDeleting) {
      // Deleting animation
      const deleteInterval = setInterval(() => {
        setDisplayedText((prev) => {
          if (prev.length === 0) {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
            return "";
          }
          return prev.slice(0, -1);
        });
      }, 30);
      return () => clearInterval(deleteInterval);
    } else {
      // Typing animation
      const typeInterval = setInterval(() => {
        setDisplayedText((prev) => {
          if (prev.length >= currentText.length) {
            // Wait before starting to delete
            setTimeout(() => setIsDeleting(true), 2000);
            return prev;
          }
          return currentText.slice(0, prev.length + 1);
        });
      }, 80);
      return () => clearInterval(typeInterval);
    }
  }, [started, currentIndex, isDeleting, texts]);

  return (
    <span className="inline-block">
      {displayedText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        style={{
          display: "inline-block",
          width: "3px",
          height: "1.2em",
          background: colors.green,
          marginLeft: "2px",
          verticalAlign: "text-bottom",
        }}
      />
    </span>
  );
}

// Gradient text component
function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(90deg, ${colors.green}, ${colors.orange}, ${colors.pink}, ${colors.green})`,
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "gradient-flow 3s ease infinite",
      }}
    >
      {children}
    </span>
  );
}

// FloatingOrb component
function FloatingOrb({ className, color, delay = 0, style }: { className?: string; color: string; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      style={{ background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`, ...style }}
      animate={{
        x: [0, 50, 0],
        y: [0, 30, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 6,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse position for cursor effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* CSS keyframes for gradient animation */}
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* Dynamic cursor follower */}
      <motion.div
        className="fixed w-64 h-64 rounded-full pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${colors.green}15 0%, transparent 70%)`,
          left: mousePos.x - 128,
          top: mousePos.y - 128,
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      />

      {/* Colorful gradient background */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg,
          #e8f5e9 0%,
          #fff8e8 20%,
          #ffe8d6 40%,
          #ffe8f0 60%,
          #f8e8f8 80%,
          #e8f5e9 100%)`
      }} />

      {/* Floating orbs */}
      <FloatingOrb className="w-96 h-96" color={colors.green} delay={0} style={{ top: "5%", left: "0%" }} />
      <FloatingOrb className="w-80 h-80" color={colors.orange} delay={2} style={{ top: "15%", right: "5%" }} />
      <FloatingOrb className="w-72 h-72" color={colors.pink} delay={4} style={{ bottom: "20%", left: "15%" }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-8" style={{
        backgroundImage: `
          linear-gradient(${colors.greenDark}08 1px, transparent 1px),
          linear-gradient(90deg, ${colors.greenDark}08 1px, transparent 1px)
        `,
        backgroundSize: "30px 30px",
        animation: "gradient-flow 10s ease infinite",
        backgroundPosition: "0 0",
      }} />

      {/* Scanning line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(transparent 50%, rgba(125, 223, 125, 0.03) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Main content */}
      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left - Text */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: `linear-gradient(90deg, ${colors.green}15, ${colors.orange}15, ${colors.pink}15)`,
                color: colors.greenDark,
                border: `1px solid ${colors.green}30`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: colors.green }}
                animate={{ scale: [1, 1.3, 1], boxShadow: `0 0 10px ${colors.green}` }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              智能校园无人机系统
            </motion.div>

            {/* Main title with typewriter */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              style={{ color: "#1a2e1a" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              天枢灵犀
              <br />
              <GradientText>校园无人机协同</GradientText>
            </motion.h1>

            {/* Subtitle with cycling typewriter */}
            <motion.div
              className="text-lg md:text-xl max-w-lg min-h-[2.5rem] flex items-center"
              style={{ color: "#3d5c3d" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <CyclingTypewriter
                texts={[
                  "基于多模态AI驱动的智能巡检系统",
                  "多架无人机同时作业的协同调度",
                  "24小时全天候校园安防监控",
                  "突发事件应急响应与快速部署",
                  "空气质量与环境的实时监测",
                  "自然语言交互控制无人机作业",
                  "校园重点区域人流密度分析",
                  "建筑物与设施的智能故障检测",
                  "高空抛物行为的智能识别监测",
                  "夜间红外热成像巡逻功能",
                  "自动规划最优飞行航线",
                  "高清视频实时回传与存储",
                  "可疑人员与异常行为预警",
                ]}
                delay={500}
              />
            </motion.div>

            {/* Feature tags */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {[
                { icon: "👁️", text: "AI视觉识别", color: colors.green },
                { icon: "🗣️", text: "自然语言控制", color: colors.orange },
                { icon: "🛸", text: "多机协同", color: colors.pink },
                { icon: "📡", text: "实时图传", color: colors.green },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm"
                  style={{
                    border: `1px solid ${item.color}30`,
                    boxShadow: `0 4px 15px ${item.color}10`,
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    borderColor: item.color,
                    boxShadow: `0 8px 25px ${item.color}20`,
                  }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: colors.greenDark }}>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-wrap gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <motion.a
                href="/monitor/live"
                className="px-8 py-4 rounded-xl font-bold text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.green}, ${colors.orange})`,
                  boxShadow: `0 8px 30px ${colors.green}40`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">进入系统</span>
                <motion.div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)` }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </motion.a>
              <motion.a
                href="#features"
                className="px-8 py-4 rounded-xl font-semibold bg-white"
                style={{
                  border: `2px solid ${colors.pink}`,
                  color: colors.greenDark,
                  boxShadow: `0 4px 15px ${colors.pink}15`,
                }}
                whileHover={{ scale: 1.05, borderColor: colors.orange }}
                whileTap={{ scale: 0.98 }}
              >
                了解更多
              </motion.a>
            </motion.div>
          </div>

          {/* Right - 3D Model */}
          <motion.div
            className="relative h-[400px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Glowing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-72 h-72 rounded-full border-2"
                style={{ borderColor: `${colors.green}30` }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              />
              <motion.div
                className="absolute w-60 h-60 rounded-full border-2"
                style={{ borderColor: `${colors.orange}30` }}
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              />
              <motion.div
                className="w-96 h-96 rounded-full"
                style={{ background: `radial-gradient(circle, ${colors.pink}10 0%, transparent 70%)` }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
            </div>

            <HeroScene />

            {/* Floating stats */}
            <motion.div
              className="absolute bottom-8 left-4 p-5 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl"
              style={{ border: `2px solid ${colors.green}` }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <div className="text-xs uppercase tracking-wider" style={{ color: colors.greenDark }}>飞行时间</div>
              <div className="text-3xl font-bold" style={{ color: colors.green }}>25+ min</div>
            </motion.div>

            <motion.div
              className="absolute top-8 right-4 p-5 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl"
              style={{ border: `2px solid ${colors.orange}` }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
            >
              <div className="text-xs uppercase tracking-wider" style={{ color: colors.greenDark }}>图传延迟</div>
              <div className="text-3xl font-bold" style={{ color: colors.orange }}>&lt;200ms</div>
            </motion.div>

            <motion.div
              className="absolute top-1/2 -left-4 p-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl"
              style={{ border: `2px solid ${colors.pink}` }}
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <div className="text-xs uppercase tracking-wider" style={{ color: colors.greenDark }}>识别精度</div>
              <div className="text-2xl font-bold" style={{ color: colors.pink }}>98%+</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest" style={{ color: colors.greenDark }}>Scroll</span>
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
            <rect x="2" y="2" width="20" height="36" rx="10" stroke={colors.greenDark} strokeWidth="2" />
            <motion.circle
              cx="12"
              cy="12"
              r="4"
              fill={colors.pink}
              animate={{ cy: [12, 22, 12] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}