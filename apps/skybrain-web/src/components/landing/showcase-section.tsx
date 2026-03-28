import { motion } from "framer-motion";

const colors = {
  green: "#7ddf7d",
  greenDark: "#1a3d1a",
  orange: "#ff8c42",
  orangeLight: "#ffb366",
  pink: "#ff7eb3",
  pinkLight: "#ff9eca",
};

const showcaseItems = [
  {
    id: 1,
    title: "校园全景航拍",
    desc: "无人机俯瞰整个校园，实时监测各个区域",
    icon: "🏫",
    stats: ["覆盖率 100%", "巡查效率 5x"],
    color: colors.green,
    gradient: "from-green-100 to-green-200",
  },
  {
    id: 2,
    title: "人流密集监测",
    desc: "AI识别校园重点区域人流密度，防止拥挤",
    icon: "👥",
    stats: ["识别准确率 98%", "预警响应 <3s"],
    color: colors.orange,
    gradient: "from-orange-100 to-orange-200",
  },
  {
    id: 3,
    title: "设施巡检",
    desc: "自动检测建筑设施安全隐患，及时预警",
    icon: "🏢",
    stats: ["检测项 50+", "漏检率 <1%"],
    color: colors.pink,
    gradient: "from-pink-100 to-pink-200",
  },
  {
    id: 4,
    title: "夜间安防",
    desc: "红外夜视功能，24小时不间断安保巡逻",
    icon: "🌙",
    stats: ["夜视距离 200m", "持续飞行 25min"],
    color: colors.greenDark,
    gradient: "from-slate-100 to-slate-200",
  },
];

function ShowcaseCard({ item, index }: { item: typeof showcaseItems[0]; index: number }) {
  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      {/* Card */}
      <div
        className="relative bg-white rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500"
        style={{
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* Top gradient bar */}
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}80)` }}
        />

        {/* Image area */}
        <div className="relative h-56 overflow-hidden">
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
          />

          {/* Animated grid lines */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(${item.color} 1px, transparent 1px),
                  linear-gradient(90deg, ${item.color} 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Main icon with glow */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              delay: index * 0.5,
            }}
          >
            <div
              className="text-8xl drop-shadow-2xl"
              style={{
                filter: `drop-shadow(0 0 30px ${item.color}50)`,
              }}
            >
              {item.icon}
            </div>
          </motion.div>

          {/* Scan line effect */}
          <motion.div
            className="absolute inset-0 h-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)`,
            }}
            animate={{
              y: [0, 224, 224],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              delay: index * 0.3,
              ease: "linear",
            }}
          />

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2" style={{ borderColor: item.color }} />
          <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2" style={{ borderColor: item.color }} />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2" style={{ borderColor: item.color }} />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2" style={{ borderColor: item.color }} />

          {/* AI Badge */}
          <motion.div
            className="absolute top-4 right-12 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold shadow-lg"
            style={{ color: item.color }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            🤖 AI 实时分析
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-xl font-bold"
              style={{ color: colors.greenDark }}
            >
              {item.title}
            </h3>
            <motion.span
              className="text-2xl"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
            >
              →
            </motion.span>
          </div>

          <p className="text-gray-500 text-sm mb-4">{item.desc}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-2">
            {item.stats.map((stat) => (
              <span
                key={stat}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl"
                style={{
                  background: `${item.color}15`,
                  color: item.color,
                }}
              >
                {stat}
              </span>
            ))}
          </div>
        </div>

        {/* Hover glow effect */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 60px ${item.color}20`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function ShowcaseSection() {
  return (
    <section
      className="relative py-24 px-4"
      style={{
        background: `linear-gradient(180deg, #f8faf8 0%, #fff 50%, #fff8f0 100%)`,
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(#2d4a2d 1px, transparent 1px),
          linear-gradient(90deg, #2d4a2d 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.greenDark }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            实景展示
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            无人机实际作业场景，AI实时分析与识别
          </motion.p>

          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {[colors.green, colors.orange, colors.pink].map((color, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ background: color }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseItems.map((item, index) => (
            <ShowcaseCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Bottom info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-500 text-sm">
            📷 点击卡片可查看详情，上传您的无人机实拍图片
          </p>
        </motion.div>
      </div>
    </section>
  );
}