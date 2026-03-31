"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Link } from 'react-router'
import { Model } from './model'
import { Eye, Zap, MapPin, Shield, Radar, Wind, Wifi, ChevronDown, ArrowRight, Mouse } from 'lucide-react'


function FloatingParticle({ delay = 0, top, left }: { delay?: number; top: number; left: number }) {
  return (
    <div
      className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animation: `pulse 3s ease-in-out infinite`,
      }}
    />
  )
}

export default function HeroSection() {
  const subTitleLines = [
    '基于多模态AI驱动的校园无人机协同作业系统',
    '融合计算机视觉与自然语言处理的智能巡检平台',
    '校园智能安防的未来已来，天枢灵犀引领创新',
  ]
  const TYPE_SPEED = 62
  const DELETE_SPEED = 34
  const PUNCTUATION_PAUSE = 260
  const LINE_HOLD = 1700
  const SWITCH_HOLD = 240

  const [typedSubTitle, setTypedSubTitle] = useState('')
  const [activeLineIndex, setActiveLineIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const particlePositions = useMemo(
    () => [...Array(8)].map(() => ({ top: Math.random() * 60 + 20, left: Math.random() * 80 + 10 })),
    []
  )
  const featurePills = [
    {
      icon: Eye,
      label: '人脸识别',
      className: 'from-fuchsia-300/30 to-rose-400/25 border-fuchsia-200/60 text-fuchsia-100 shadow-[0_0_24px_rgba(236,72,153,0.28)]',
    },
    {
      icon: Zap,
      label: '异常检测',
      className: 'from-amber-300/25 to-orange-400/25 border-orange-200/60 text-amber-100 shadow-[0_0_24px_rgba(251,146,60,0.28)]',
    },
    {
      icon: MapPin,
      label: '航线规划',
      className: 'from-cyan-300/30 to-blue-400/25 border-cyan-200/60 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.25)]',
    },
    {
      icon: Radar,
      label: '多机协同',
      className: 'from-violet-300/30 to-indigo-400/25 border-violet-200/60 text-violet-100 shadow-[0_0_24px_rgba(167,139,250,0.28)]',
    },
    {
      icon: Wind,
      label: '环境监测',
      className: 'from-emerald-300/30 to-lime-400/25 border-emerald-200/60 text-emerald-100 shadow-[0_0_24px_rgba(74,222,128,0.28)]',
    },
  ]
  const metricCards = [
    {
      icon: Shield,
      label: '核心功能',
      value: 'P0',
      positionClass: 'top-[12%] right-[10%]',
      borderClass: 'border-cyan-300/80 text-cyan-100 shadow-[0_14px_30px_rgba(14,116,144,0.28)]',
    },
    {
      icon: Wifi,
      label: '图传延迟',
      value: '<200ms',
      positionClass: 'top-[22%] left-[56%]',
      borderClass: 'border-orange-300/80 text-orange-100 shadow-[0_14px_30px_rgba(249,115,22,0.28)]',
    },
    {
      icon: Eye,
      label: '识别精度',
      value: '98%+',
      positionClass: 'bottom-[32%] left-[58%]',
      borderClass: 'border-pink-300/80 text-pink-100 shadow-[0_14px_30px_rgba(244,114,182,0.28)]',
    },
    {
      icon: Wind,
      label: '飞行时间',
      value: '25+ min',
      positionClass: 'bottom-[20%] right-[18%]',
      borderClass: 'border-emerald-300/80 text-emerald-100 shadow-[0_14px_30px_rgba(74,222,128,0.28)]',
    },
  ]

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const currentLine = subTitleLines[activeLineIndex] ?? ''
    const nextChar = currentLine[typedSubTitle.length]

    if (!isDeleting && typedSubTitle.length < currentLine.length) {
      const delay = nextChar === '，' || nextChar === '。' ? PUNCTUATION_PAUSE : TYPE_SPEED

      timeoutId = setTimeout(() => {
        setTypedSubTitle(currentLine.slice(0, typedSubTitle.length + 1))
      }, delay + (isDeleting ? 200 : 0))
    } else if (!isDeleting && typedSubTitle.length === currentLine.length) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true)
      }, LINE_HOLD)
    } else if (isDeleting && typedSubTitle.length > 0) {
      timeoutId = setTimeout(() => {
        setTypedSubTitle((prev) => prev.slice(0, -1))
      }, DELETE_SPEED)
    } else if (isDeleting && typedSubTitle.length === 0) {
      timeoutId = setTimeout(() => {
        setIsDeleting(false)
        setActiveLineIndex((prev) => (prev + 1) % subTitleLines.length)
      }, SWITCH_HOLD)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [activeLineIndex, isDeleting, subTitleLines, typedSubTitle])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img
        className="absolute inset-0 h-full w-full object-cover select-none"
        src="/school.png"
        alt="校园俯视图"
        draggable={false}
        aria-hidden="true"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/47" />

      {/* Animated Particles */}
      {particlePositions.map((position, i) => (
        <FloatingParticle key={i} delay={i * 0.4} top={position.top} left={position.left} />
      ))}

      {/* 3D Canvas - Right side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 z-10">
        <Canvas camera={{ position: [0, 0.5, 3], fov: 45 }} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            intensity={1}
            position={[2, 4, 3]}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Suspense fallback={null}>
            <Model position={[0, -0.06, 0]} rotation={[0.2, 0, 0.1]} scale={1.8} />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Logo - Absolute Top Left */}
      <div className="absolute top-8 left-8 z-30 flex items-center gap-4">
        <img
          src="/logo.svg"
          alt="天枢灵犀 Logo"
          className="w-16 h-16 md:w-20 md:h-20 drop-shadow-xl brightness-0 invert"
        />
        <span className="text-2xl md:text-3xl font-bold text-white tracking-wide">SkyBrain</span>
      </div>

      {/* Orbiting Metric Cards (Desktop) */}
      <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
        {metricCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className={`hero-orbit-card absolute rounded-3xl border bg-white/8 px-5 py-4 backdrop-blur-md ${card.positionClass} ${card.borderClass}`}
              style={{ animationDelay: `${index * 0.8}s` }}
            >
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white/85">
                <Icon className="h-4 w-4" />
                <span>{card.label}</span>
              </div>
              <div className="text-4xl font-extrabold tracking-tight">{card.value}</div>
            </div>
          )
        })}
      </div>

      {/* Content Layer - Left aligned */}
      <div className="relative z-20 h-full flex items-center">
        <div className="w-1/2 pl-8 md:pl-16 lg:pl-24 pr-8">
          {/* Main Headline */}
          <h1 className="">
            {/* Status Bar */}
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-300 tracking-wide">智能校园无人机系统</span>
            </div>

            <span
              className="block text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-[linear-gradient(120deg,#67e8f9_0%,#60a5fa_28%,#c084fc_54%,#fb7185_76%,#67e8_100%)] bg-[length:220%_220%]"
              style={{ animation: 'titleGradientShift 7s ease-in-out infinite' }}
            >
              天枢灵犀
            </span>
            <span className="block text-lg md:text-xl lg:text-2xl font-light text-sky-200 mt-3 tracking-wide min-h-[2.2rem] md:min-h-[2.4rem] lg:min-h-[2.8rem]">
              {typedSubTitle}
              <span className="ml-0.5 inline-block h-[1em] w-[2px] bg-sky-200 align-[-0.1em] animate-pulse" aria-hidden="true" />
            </span>
          </h1>

          {/* Rich Description */}
          <div className="max-w-xl mb-8">
            <p className="text-base md:text-lg text-white leading-relaxed">
              融合人工智能与计算机视觉技术，集成 OpenClaw 自然语言控制，实现多无人机协同的校园智能安防巡检
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mb-6">
            {featurePills.map((pill) => {
              const Icon = pill.icon
              return (
                <div
                  key={pill.label}
                  className={`group flex items-center gap-2 rounded-full border bg-gradient-to-br px-4 py-2 text-sm font-medium backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 ${pill.className}`}
                >
                  <Icon className="h-4 w-4 text-white" />
                  <span className="text-white">{pill.label}</span>
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/monitor/multi"
              className="group relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-500/30 hover:scale-105"
            >
              <span>进入系统</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              onClick={() => {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
              }}
              className="group relative inline-flex items-center gap-3 rounded-full border-2 border-white/50 bg-transparent px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              <span>了解更多</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards (Mobile) */}
      <div className="absolute inset-x-4 bottom-12 z-20 grid grid-cols-2 gap-3 md:hidden">
        {metricCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`rounded-2xl border bg-white/10 px-4 py-3 backdrop-blur-md ${card.borderClass}`}>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-white/80">
                <Icon className="h-3.5 w-3.5" />
                <span>{card.label}</span>
              </div>
              <div className="text-xl font-extrabold tracking-tight">{card.value}</div>
            </div>
          )
        })}
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Scrolling Notice */}
      <div className="absolute bottom-4 left-0 right-0 z-30">
        <div className="overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap justify-center">
            <span className="mx-6 text-sm text-white/80">📢 系统公告：校园无人机巡检系统已上线试运行，欢迎各位老师同学提出宝贵意见！</span>
            <span className="mx-6 text-sm text-amber-300">⚡ 今日任务：教学楼区域巡检已调度完成，预计 14:00 起飞</span>
            <span className="mx-6 text-sm text-emerald-300">✅ 设备状态：8 架无人机在线，2 架正在进行充电</span>
            <span className="mx-6 text-sm text-sky-300">🛸 新增功能：支持 3D 模型查看，点击无人机详情页即可体验</span>
            <span className="mx-6 text-sm text-rose-300">🔧 维护提醒：无人机-03 需要进行例行维护，请及时处理</span>
            <span className="mx-6 text-sm text-white/80">📢 系统公告：校园无人机巡检系统已上线试运行，欢迎各位老师同学提出宝贵意见！</span>
            <span className="mx-6 text-sm text-amber-300">⚡ 今日任务：教学楼区域巡检已调度完成，预计 14:00 起飞</span>
            <span className="mx-6 text-sm text-emerald-300">✅ 设备状态：8 架无人机在线，2 架正在进行充电</span>
            <span className="mx-6 text-sm text-sky-300">🛸 新增功能：支持 3D 模型查看，点击无人机详情页即可体验</span>
            <span className="mx-6 text-sm text-rose-300">🔧 维护提醒：无人机-03 需要进行例行维护，请及时处理</span>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 animate-bounce hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <Mouse className="h-5 w-5" />
          <span className="text-xs">向下滚动</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      <style>{`
        @keyframes titleGradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes orbitFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -8px, 0);
          }
        }

        .hero-orbit-card {
          animation: orbitFloat 5.8s ease-in-out infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
