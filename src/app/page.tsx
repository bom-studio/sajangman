import { CtaSection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { BomStudioCtaSection } from "@/components/home/bom-studio-cta-section"
import { HomeLatestResourcesSection } from "@/components/home/home-latest-resources-section"
import { HomePopularAiSection } from "@/components/home/home-popular-ai-section"
import { HomePopularCalculatorsSection } from "@/components/home/home-popular-calculators-section"
import { HomeRequestsCtaSection } from "@/components/home/home-requests-cta-section"
import { HomeSchemas } from "@/components/home/home-schemas"
import { QuickStartSection } from "@/components/home/quick-start-section"
import { ServiceCategoriesSection } from "@/components/home/service-categories-section"
import { SiteLayout } from "@/components/site-layout"
import { AI_FEATURES_ENABLED } from "@/lib/features"
import { HOME_METADATA } from "@/lib/home/metadata"

export const metadata = HOME_METADATA

export default function HomePage() {
  return (
    <SiteLayout>
      <HomeSchemas />
      <HeroSection />
      <QuickStartSection />
      <ServiceCategoriesSection />
      <HomePopularCalculatorsSection />
      <BomStudioCtaSection />
      {AI_FEATURES_ENABLED ? <HomePopularAiSection /> : null}
      <HomeLatestResourcesSection />
      <HomeRequestsCtaSection />
      <CtaSection />
    </SiteLayout>
  )
}
