import { CtaSection } from "@/components/cta-section"
import { HeroSection } from "@/components/hero-section"
import { HomeStatsBar } from "@/components/home-stats-bar"
import { BomStudioCtaSection } from "@/components/home/bom-studio-cta-section"
import { HomeLatestResourcesSection } from "@/components/home/home-latest-resources-section"
import { HomePopularCalculatorsSection } from "@/components/home/home-popular-calculators-section"
import { HomeRequestsCtaSection } from "@/components/home/home-requests-cta-section"
import { HomeSchemas } from "@/components/home/home-schemas"
import { QuickStartSection } from "@/components/home/quick-start-section"
import { ServiceCategoriesSection } from "@/components/home/service-categories-section"
import { SiteLayout } from "@/components/site-layout"
import { HOME_METADATA } from "@/lib/home/metadata"
import { getDisplayVisitCount } from "@/lib/site-config"
import { getTotalVisitCount } from "@/lib/visitors/queries"

export const metadata = HOME_METADATA

export default async function HomePage() {
  const totalVisitCount = await getTotalVisitCount()
  const visitCount =
    typeof totalVisitCount === "number"
      ? getDisplayVisitCount(totalVisitCount)
      : null

  return (
    <SiteLayout>
      <HomeSchemas />
      <HeroSection />
      <HomeStatsBar visitCount={visitCount} />
      <QuickStartSection />
      <ServiceCategoriesSection />
      <HomePopularCalculatorsSection />
      <BomStudioCtaSection />
      <HomeLatestResourcesSection />
      <HomeRequestsCtaSection />
      <CtaSection />
    </SiteLayout>
  )
}
