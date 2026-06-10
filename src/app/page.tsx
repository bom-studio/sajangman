import { CtaSection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { PopularTools } from "@/components/popular-tools"
import { SiteLayout } from "@/components/site-layout"

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <PopularTools />
      <CtaSection />
    </SiteLayout>
  )
}
