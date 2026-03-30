import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { InfoCard } from "./info-card"
import { FeatureList } from "./feature-list"
import { FeatureCards } from "./feature-cards"
import { ModelCanvas } from "./model-canvas"
import {
  Eye,
  MessageSquare,
  Wifi,
  Map,
  Shield,
  Activity,
  Zap,
  Target,
  Cpu,
  Clock,
  Bell
} from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

// Background gradient
const gradientBg = "linear-gradient(135deg, #e8f5e9 0%, #fff8e8 20%, #ffe8d6 40%, #ffe8f0 60%, #f8e8f8 80%, #e8f5e9 100%)"

const initialFeatures = [
  { text: "AI 视觉识别与目标追踪" },
  { text: "自然语言交互控制" },
  { text: "4G/5G 低延迟图传" },
  { text: "智能航线规划" },
]

const techAdvantages = [
  { text: "多模态AI大模型驱动" },
  { text: "实时异常检测与预警" },
  { text: "高精度障碍物识别" },
  { text: "24h全天候自主巡逻" },
  { text: "可疑行为智能分析" },
  { text: "高清视频实时回传" },
]

const featureCards = [
  { icon: Eye, title: "智能识别", description: "目标检测与追踪" },
  { icon: MessageSquare, title: "语音交互", description: "自然语言控制" },
  { icon: Wifi, title: "实时图传", description: "低延迟视频流" },
  { icon: Map, title: "航线规划", description: "AI最优路径" },
  { icon: Shield, title: "安防监控", description: "24h不间断" },
  { icon: Activity, title: "异常检测", description: "实时预警" },
  { icon: Zap, title: "快速响应", description: "应急部署" },
  { icon: Target, title: "精准定位", description: "高精度GPS" },
  { icon: Cpu, title: "边缘计算", description: "本地AI处理" },
  { icon: Clock, title: "持久续航", description: "长时间巡逻" },
  { icon: Bell, title: "智能告警", description: "异常即时通知" },
  { icon: Target, title: "行为分析", description: "AI行为识别" },
]

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          pin: true,
          scrub: 1,
        },
      })

      // Fade out initial content
      tl.to(".text-left-top", { opacity: 0, duration: 1 })
        .to(".text-right-bottom", { opacity: 0, duration: 1 }, "<")

      // Move model to bottom-left
      tl.to(
        ".model-container",
        { x: "-55vw", y: "40vh", duration: 2 },
        "<"
      )

      // Fade in new content
      tl.to(".text-left-new", { opacity: 1, y: 0, duration: 1 }, "-=1")
        .to(".text-right-top-new", { opacity: 1, y: 0, duration: 1 }, "-=1")
        .to(".text-right-bottom-new", { opacity: 1, y: 0, duration: 1 }, "-=1")
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: gradientBg }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(#1a3d1a08 1px, transparent 1px),
            linear-gradient(90deg, #1a3d1a08 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(transparent 50%, rgba(125, 223, 125, 0.03) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* 3D Model - top-right initially */}
      <div
        className="model-container absolute right-[5vw] top-[5vh] w-[550px] h-[550px] z-20"
        style={{ transform: "rotate(-15deg)" }}
      >
        <ModelCanvas scale={3} />
      </div>

      {/* Initial Left-Top: 天枢灵犀 */}
      <div className="text-left-top absolute left-[5vw] top-[15vh] w-[40vw] z-10">
        <InfoCard title="天枢灵犀" description="基于多模态AI驱动的智能巡检系统，多架无人机同时作业的协同调度，24小时全天候校园安防监控。" className="p-8" />
      </div>

      {/* Initial Right-Bottom: 核心功能 */}
      <div className="text-right-bottom absolute right-[5vw] bottom-[15vh] w-[40vw] z-10">
        <InfoCard title="核心功能">
          <FeatureList items={initialFeatures} />
        </InfoCard>
      </div>

      {/* New Left: 智能协作 (appears after scroll) */}
      <div className="text-left-new absolute left-[5vw] top-[15vh] w-[40vw] opacity-0 translate-y-10 z-10">
        <InfoCard title="智能协作" description="突发事件应急响应与快速部署，空气质量与环境的实时监测，自然语言交互控制无人机作业。" className="p-8" />
      </div>

      {/* New Right-Top: 技术优势 (appears after scroll) */}
      <div className="text-right-top-new absolute right-[5vw] top-[15vh] w-[40vw] opacity-0 translate-y-10 z-10">
        <InfoCard title="技术优势">
          <FeatureList items={techAdvantages} />
        </InfoCard>
      </div>

      {/* New Right-Bottom: 功能卡片 (appears after scroll) */}
      <div className="text-right-bottom-new absolute right-[5vw] bottom-[5vh] w-[45vw] opacity-0 translate-y-10 z-10">
        <FeatureCards cards={featureCards} />
      </div>
    </section>
  )
}