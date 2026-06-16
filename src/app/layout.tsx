import type { Metadata } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Inter } from "next/font/google"
import Script from "next/script"

import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

/** GA4 측정 ID — .env.local 또는 Vercel Environment Variables에 설정 */
const gaId = process.env.NEXT_PUBLIC_GA_ID

const ADSENSE_CLIENT_ID = "ca-pub-2530285890343256"

export const metadata: Metadata = {
  title: "사장만 | 사장님, 장사만 하세요.",
  description:
    "견적서 작성부터 계산기까지, 소상공인과 자영업자를 위한 무료 업무 도구 플랫폼.",
  verification: {
    google: "g3IcuYRLD4JvvFva4DST6uZWnEfn_dpQUy2npAgbauE",
    other: {
      "naver-site-verification" : "ea4551a9c514254aafde69a55dd79fb2b698b480",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={cn("h-full antialiased", inter.variable)}>
      <head>
        <Script
          id="adsense-init"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  )
}
