import { motion } from "framer-motion";

const colors = {
  green: "#7ddf7d",
  greenDark: "#1a3d1a",
  orange: "#ff8c42",
  orangeLight: "#ffb366",
  pink: "#ff7eb3",
  pinkLight: "#ff9eca",
};

const features = [
  {
    icon: "🛡️",
    title: "校园安保",
    description: "周界巡逻、入侵检测、应急响应、交通管理",
    status: "P0 核心功能",
    color: colors.green,
  },
  {
    icon: "🔧",
    title: "设施巡检",
    description: "建筑检测、设施检查、施工监控、高空抛物监测",
    status: "P1 重要功能",
    color: colors.orange,
  },
  {
    icon: "🎪",
    title: "活动保障",
    description: "人流监测、拥挤预警、全景拍摄、区域监控",
    status: "P1 重要功能",
    color: colors.pink,
  },
  {
    icon: "🌿",
    title: "环境监测",
    description: "空气质量、绿化监测、水体监测、噪音监测",
    status: "P2 增强功能",
    color: colors.green,
  },
  {
    icon: "📦",
    title: "物流配送",
    description: "快递配送、预约配送、应急配送、签收确认",
    status: "P2 增强功能",
    color: colors.orange,
  },
  {
    icon: "🚨",
    title: "搜索救援",
    description: "物品查找、走失搜寻、热成像搜寻、区域排查",
    status: "P1 重要功能",
    color: colors.pink,
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="relative bg-white rounded-2xl p-6 shadow-md group cursor-pointer overflow-hidden"
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${feature.color}, ${feature.color}80)`,
        }}
      />

      {/* Background glow on hover */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex items-start gap-5">
        {/* Icon with gradient background */}
        <div
          className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md"
          style={{
            background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`,
            border: `1px solid ${feature.color}30`,
          }}
        >
          {feature.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3
              className="text-xl font-bold group-hover:text-transparent group-hover:bg-clip-group"
              style={{
                background: `linear-gradient(90deg, ${feature.color}, ${feature.color})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {feature.title}
            </h3>
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: `${feature.color}15`,
                color: feature.color,
              }}
            >
              {feature.status}
            </span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
        </div>
      </div>

      {/* Arrow with animation */}
      <motion.div
        className="absolute bottom-6 right-6 text-lg font-bold"
        style={{ color: feature.color }}
        animate={{ x: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        →
      </motion.div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-24 px-4"
      style={{
        background: `linear-gradient(180deg, #fff0f5 0%, #f8faf8 100%)`
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(#2d4a2d 1px, transparent 1px),
          linear-gradient(90deg, #2d4a2d 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
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
            功能模块
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            六大核心模块，全方位覆盖校园无人机应用场景
          </motion.p>

          {/* Priority legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: colors.green }} />
              <span className="text-gray-600">P0 核心功能</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: colors.orange }} />
              <span className="text-gray-600">P1 重要功能</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: colors.pink }} />
              <span className="text-gray-600">P2 增强功能</span>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Statistics */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { value: "6+", label: "核心模块", color: colors.green },
            { value: "50+", label: "AI识别能力", color: colors.orange },
            { value: "99.5%", label: "系统可用性", color: colors.pink },
            { value: "<200ms", label: "图传延迟", color: colors.green },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-white rounded-2xl shadow-lg"
              style={{
                borderTop: `3px solid ${stat.color}`,
                boxShadow: `0 4px 20px ${stat.color}15`,
              }}
            >
              <div
                className="text-4xl font-bold mb-2"
                style={{
                  background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}