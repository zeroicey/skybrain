import HeroSection from '@/components/landing/hero-section'
import TechSection from '@/components/landing/tech-section'
import ShowcaseSection from '@/components/landing/showcase-section'
import FeaturesSection from '@/components/landing/features-section'
import CtaSection from '@/components/landing/cta-section'

export default function LandingPage() {
  return (
    <div className="w-full h-full overflow-auto no-scrollbar">
      <HeroSection />
      <TechSection />
      <ShowcaseSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  )
}
