import { motion } from "framer-motion";

const colors = {
  green: "#7ddf7d",
  greenDark: "#1a3d1a",
  orange: "#ff8c42",
  pink: "#ff7eb3",
};

export default function CtaSection() {
  return (
    <section
      className="relative py-24 px-4 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.greenDark} 0%, #2d4a2d 100%)`,
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(#7ddf7d 1px, transparent 1px),
              linear-gradient(90deg, #7ddf7d 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.green}20 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 6 }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.orange}20 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 7 }}
        />

        <motion.div
          className="absolute top-1/2 right-1/3 w-60 h-60 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.pink}15 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          准备好体验未来了吗？
        </motion.h2>

        <motion.p
          className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          立即开始使用天枢灵犀，让AI驱动的无人机系统为您的校园安全保驾护航
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="/monitor/live"
            className="px-10 py-4 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.green} 0%, ${colors.orange} 100%)`,
              boxShadow: `0 8px 30px ${colors.green}40`,
            }}
          >
            立即体验
          </a>
          <a
            href="/tasks"
            className="px-10 py-4 bg-white/10 text-white font-bold rounded-xl border-2 border-white/30 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50"
          >
            查看任务
          </a>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="mt-16 flex justify-center gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {["🚀", "🎯", "💡", "⚡"].map((emoji, index) => (
            <motion.div
              key={emoji}
              className="text-4xl"
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: index * 0.2,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>

        {/* Footer links */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/60">
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              文档
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              API
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              关于我们
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
            >
              联系方式
            </a>
          </div>

          <p className="mt-6 text-sm text-white/40">
            © 2026 天枢灵犀 · 基于多模态AI驱动的校园无人机协同作业系统
          </p>
        </motion.div>
      </div>
    </section>
  );
}