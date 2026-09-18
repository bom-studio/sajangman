import { BomStudioFloatingAd } from "@/components/bom-studio-floating-ad"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { VisitorTracker } from "@/components/visitor-tracker"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <VisitorTracker />
      <BomStudioFloatingAd />
    </div>
  )
}
