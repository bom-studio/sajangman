import { SiteLayout } from "@/components/site-layout"

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </div>
    </SiteLayout>
  )
}
