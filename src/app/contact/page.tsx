import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import {
  BOM_STUDIO_URL,
  CONTACT_EMAIL,
  OPERATOR_NAME,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-config"

export const metadata: Metadata = {
  title: `문의 | ${SITE_NAME}`,
  description:
    "사장만 서비스 이용, 개인정보, 오류 제보 등 문의 방법을 안내합니다.",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: `문의 | ${SITE_NAME}`,
    description: "사장만 서비스 관련 문의 안내입니다.",
    url: `${SITE_URL}/contact`,
    type: "website",
    siteName: SITE_NAME,
  },
}

export default function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="문의"
        description="서비스 이용, 개인정보, 오류 제보와 관련한 연락 방법을 안내합니다."
      />
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            연락처
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {SITE_NAME}은 {OPERATOR_NAME}에서 운영합니다.
          </p>
          {CONTACT_EMAIL ? (
            <p className="text-base leading-relaxed text-muted-foreground">
              이메일:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          ) : (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
              문의용 이메일은 운영자가 확인 후 이 페이지에 등록합니다. 등록
              전까지는{" "}
              <Link href="/privacy" className="font-medium underline">
                개인정보처리방침
              </Link>
              ·
              <Link href="/terms" className="font-medium underline">
                이용약관
              </Link>
              페이지의 안내를 참고해 주세요.
            </p>
          )}
          {BOM_STUDIO_URL ? (
            <p className="text-sm text-muted-foreground">
              운영사:{" "}
              <a
                href={BOM_STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {OPERATOR_NAME}
              </a>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              운영사: {OPERATOR_NAME}
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            이런 내용을 문의할 수 있어요
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground">
            <li>계산기·문서작성 도구 사용 중 발견한 오류</li>
            <li>개인정보 처리·쿠키·광고 관련 문의</li>
            <li>서비스 개선 제안</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            참고
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            세금·노무·계약에 대한 법률 자문은 제공하지 않습니다. 계산 결과와
            문서 초안은 참고용이며, 중요한 결정은 세무사·노무사 등 전문가와
            확인해 주세요.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link href="/about" className="text-primary hover:underline">
              서비스 소개
            </Link>
            <Link href="/privacy" className="text-primary hover:underline">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-primary hover:underline">
              이용약관
            </Link>
          </div>
        </section>
      </div>
    </SiteLayout>
  )
}
