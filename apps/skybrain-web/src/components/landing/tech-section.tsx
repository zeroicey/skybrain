import { motion } from "framer-motion";

const colors = {
  green: "#7ddf7d",
  greenDark: "#1a3d1a",
  orange: "#ff8c42",
  orangeLight: "#ffb366",
  pink: "#ff7eb3",
  pinkLight: "#ff9eca",
};

const techItems = [
  {
    icon: "👁️",
    title: "AI视觉识别",
    desc: "人脸检测、物体识别、异常行为分析",
    tags: ["人脸识别", "行人检测", "异常检测"],
    color: colors.green,
  },
  {
    icon: "🗣️",
    title: "自然语言交互",
    desc: "语音/文字指令控制无人机作业",
    tags: ["语音指令", "智能问答", "任务创建"],
    color: colors.orange,
  },
  {
    icon: "🛸",
    title: "多机协同",
    desc: "多架无人机同时作业，智能调度",
    tags: ["航线规划", "任务调度", "风险评估"],
    color: colors.pink,
  },
  {
    icon: "📡",
    title: "实时图传",
    desc: "低延迟高清画面回传与分析",
    tags: ["<200ms延迟", "多路同显", "云端存储"],
    color: colors.green,
  },
];

function TechCard({
  item,
  index,
}: {
  item: (typeof techItems)[0];
  index: number;
}) {
  return (
    <motion.div
      className="stagger-card relative bg-white p-6 rounded-2xl shadow-lg group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -8 }}
      style={{
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
      }}
    >
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
        }}
      />

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
          border: `1px solid ${item.color}20`,
        }}
      >
        {item.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-2" style={{ color: colors.greenDark }}>
        {item.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 mb-4 text-sm leading-relaxed">{item.desc}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              background: `${item.color}12`,
              color: item.color,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Hover effect - colored line */}
      <div
        className="absolute bottom-0 left-0 h-1 transition-all duration-300 rounded-b-2xl"
        style={{
          width: "0px",
          background: item.color,
        }}
      />
    </motion.div>
  );
}

export default function TechSection() {
  return (
    <section
      id="tech"
      className="relative py-24 px-4"
      style={{
        background: `linear-gradient(180deg, #f8faf8 0%, #fff8f0 50%, #fff0f5 100%)`
      }}
    >
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
            核心技术能力
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            集成多模态AI技术，实现智能化、自动化、可视化的无人机作业
          </motion.p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#7ddf7d]" />
            <div className="w-3 h-3 rotate-45" style={{ background: `linear-gradient(135deg, ${colors.green}, ${colors.orange})` }} />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#ff7eb3]" />
          </div>
        </div>

        {/* Tech cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techItems.map((item, index) => (
            <TechCard key={item.title} item={item} index={index} />
          ))}
        </div>

        {/* AI interaction demo */}
        <motion.div
          className="mt-16 p-8 bg-white rounded-2xl shadow-xl relative overflow-hidden"
          style={{
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(#2d4a2d 1px, transparent 1px),
                linear-gradient(90deg, #2d4a2d 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Colorful accent */}
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{
              background: `linear-gradient(90deg, ${colors.green}, ${colors.orange}, ${colors.pink})`,
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4" style={{ color: colors.greenDark }}>
                🤖 自然语言控制演示
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span
                    className="px-4 py-2 text-white text-sm rounded-xl font-medium shadow-md"
                    style={{ background: colors.orange }}
                  >
                    用户
                  </span>
                  <p className="text-gray-600 pt-2">
                    "让2号无人机去教学楼A巡逻一下"
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span
                    className="px-4 py-2 text-white text-sm rounded-xl font-medium shadow-md"
                    style={{ background: colors.pink }}
                  >
                    AI
                  </span>
                  <p className="text-gray-600 pt-2">
                    已理解指令，正在规划航线...航线规划完成，2号无人机起飞，预计12分钟完成巡逻
                  </p>
                </div>
              </div>
            </div>

            {/* Animated robot icon */}
            <motion.div
              className="text-9xl"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              🚁
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}