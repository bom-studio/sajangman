import Link from "next/link"
import { ArrowRight, BookOpen, Calculator, FileText } from "lucide-react"

const COLUMNS = [
  {
    title: "계산",
    description: "세금 · 급여 · 마진 · 4대보험\n각종 계산을 빠르게",
    href: "/calculators",
    linkLabel: "계산기 보기",
    icon: Calculator,
  },
  {
    title: "문서작성",
    description: "견적서 · 거래명세서 · 발주서\n업무 문서 간편 작성",
    href: "/documents",
    linkLabel: "문서작성 보기",
    icon: FileText,
  },
  {
    title: "운영정보",
    description: "세금 · 노무 · 배달 · 창업 가이드\n사장님을 위한 실무 정보",
    href: "/resources",
    linkLabel: "자료실 보기",
    icon: BookOpen,
  },
] as const

export function ServiceCategoriesSection() {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[24px] bg-[#0F2346] px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.7fr] lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-[28px] font-black leading-[1.2] tracking-[-0.03em] sm:text-[34px]">
                계산부터 문서 작성까지,
                <br />
                <span className="text-[#93C5FD]">사장님 업무를 한곳에서.</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/70 sm:text-base">
                복잡한 업무는 사장만에서 간단하게.
                <br />
                사장님의 시간을 아껴드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0">
              {COLUMNS.map((column, index) => {
                const Icon = column.icon
                return (
                  <div
                    key={column.href}
                    className={
                      index === 0
                        ? "sm:pr-6"
                        : index === COLUMNS.length - 1
                          ? "sm:border-l sm:border-white/15 sm:pl-6"
                          : "sm:border-l sm:border-white/15 sm:px-6"
                    }
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-[#93C5FD]">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{column.title}</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/65">
                      {column.description}
                    </p>
                    <Link
                      href={column.href}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#93C5FD] hover:text-white"
                    >
                      {column.linkLabel}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
