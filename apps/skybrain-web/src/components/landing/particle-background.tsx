import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const colors = {
  green: "125, 223, 125",
  orange: "255, 140, 66",
  pink: "255, 126, 179",
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];
    const gridLines: { y: number; speed: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = (): Particle => {
      const colorKeys = Object.keys(colors);
      const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)] as keyof typeof colors;

      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 1.5 - 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[randomColor],
      };
    };

    // Initialize grid lines
    for (let i = 0; i < 8; i++) {
      gridLines.push({
        y: Math.random() * canvas.height,
        speed: 0.3 + Math.random() * 0.5,
        opacity: 0.03 + Math.random() * 0.05,
      });
    }

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      p.vy = -Math.random() * 1 - 0.3;
      particles.push(p);
    }

    const drawGridLines = () => {
      gridLines.forEach((line) => {
        // Update
        line.y += line.speed;
        if (line.y > canvas.height) line.y = 0;

        // Draw
        ctx.beginPath();
        ctx.moveTo(0, line.y);
        ctx.lineTo(canvas.width, line.y);
        ctx.strokeStyle = `rgba(125, 223, 125, ${line.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Glow effect
        const gradient = ctx.createLinearGradient(0, line.y - 2, 0, line.y + 2);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, `rgba(125, 223, 125, ${line.opacity * 0.5})`);
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.moveTo(0, line.y);
        ctx.lineTo(canvas.width, line.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.stroke();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines first (background)
      drawGridLines();

      // Add new particles occasionally
      if (Math.random() < 0.08) {
        particles.push(createParticle());
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.002;

        if (p.opacity <= 0 || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();

        // Draw glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(${p.color}, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw trail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 10, p.y - p.vy * 10);
        const trailGradient = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 10, p.y - p.vy * 10);
        trailGradient.addColorStop(0, `rgba(${p.color}, ${p.opacity * 0.3})`);
        trailGradient.addColorStop(1, "transparent");
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = p.size;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}