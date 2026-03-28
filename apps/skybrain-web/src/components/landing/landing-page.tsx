import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "./hero-section";
import TechSection from "./tech-section";
import ShowcaseSection from "./showcase-section";
import FeaturesSection from "./features-section";
import CtaSection from "./cta-section";
import ParticleBackground from "./particle-background";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle parallax and fade effects only
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("section").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.95 },
          {
            opacity: 1,
            duration: 0.3,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 95%",
              end: "top 30%",
              scrub: false,
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <ParticleBackground />
      <HeroSection />
      <TechSection />
      <ShowcaseSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}