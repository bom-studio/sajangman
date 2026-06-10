import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "사장만 | 사장님, 장사만 하세요.",
  description:
    "견적서 작성부터 계산기까지, 소상공인과 자영업자를 위한 무료 업무 도구 플랫폼.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={cn("h-full antialiased", inter.variable)}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
