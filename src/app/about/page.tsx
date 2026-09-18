import type { Metadata } from "next"
import Link from "next/link"
import { Calculator, FileText, BookOpen } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import {
  BOM_STUDIO_URL,
  OPERATOR_NAME,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-config"

export const metadata: Metadata = {
  title: `서비스 소개 | ${SITE_NAME}`,
  description:
    "사장만은 자영업자·소상공인을 위한 무료 계산기, 문서작성, 운영 가이드를 한곳에서 제공하는 실무 도구입니다.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: `서비스 소개 | ${SITE_NAME}`,
    description:
      "계산기·문서작성·자료실로 사업 운영에 필요한 숫자와 정보를 빠르게 확인하세요.",
    url: `${SITE_URL}/about`,
    type: "website",
    siteName: SITE_NAME,
  },
}

const offerings = [
  {
    title: "계산기",
    description:
      "부가세, 주휴수당, 배달 마진, 손익분기점, 원가율 등 운영에 자주 쓰는 계산을 바로 확인합니다.",
    href: "/calculators",
    icon: Calculator,
  },
  {
    title: "문서작성",
    description:
      "견적서, 거래명세서, 발주서, 영수증 등 업무 문서를 작성하고 PDF로 저장합니다.",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "자료실",
    description:
      "세금·노무·배달·창업·매출관리 등 사장님이 참고할 수 있는 운영 가이드를 제공합니다.",
    href: "/resources",
    icon: BookOpen,
  },
]

export default function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="서비스 소개"
        description="사장만이 무엇을 제공하는지, 누구를 위한 서비스인지 안내합니다."
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            사장만이란?
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {SITE_NAME}은 자영업자·소상공인이 사업 운영에 필요한 숫자와 정보를
            빠르게 확인할 수 있도록 돕는 무료 실무 도구입니다. 회원가입 없이
            계산기, 문서작성, 자료실을 바로 이용할 수 있습니다.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            계산 결과와 문서 초안은 참고용입니다. 세무·노무·계약 등 중요한
            결정은 관련 전문가나 공식 기관의 확인을 권장합니다.
          </p>
        </section>

        <section className="mt-12 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            제공하는 기능
          </h2>
          <ul className="space-y-5">
            {offerings.map((item) => {
              const Icon = item.icon
              return (
                <li
                  key={item.href}
                  className="flex gap-4 rounded-xl border border-border/70 p-5"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      {item.title} 바로가기
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            운영 주체
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {SITE_NAME}은 {OPERATOR_NAME}에서 제작·운영합니다.
            {BOM_STUDIO_URL ? (
              <>
                {" "}
                <a
                  href={BOM_STUDIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {OPERATOR_NAME} 홈페이지
                </a>
                에서 더 알아볼 수 있습니다.
              </>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href="/contact">문의하기</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/calculators">계산기 둘러보기</Link>
            </Button>
          </div>
        </section>
      </div>
    </SiteLayout>
  )
}
