import Link from "next/link"

import {
  CalculatorSeoArticle,
  CalculatorSeoSection,
} from "@/components/calculators/calculator-seo-section"

function Formula({ children }: { children: string }) {
  return (
    <p className="my-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-foreground">
      {children}
    </p>
  )
}

function InlineCalcLink({
  href,
  children,
}: {
  href: string
  children: string
}) {
  return (
    <Link href={href} className="font-medium text-primary underline-offset-2 hover:underline">
      {children}
    </Link>
  )
}

/** SSR-friendly SEO articles rendered below the calculator UI (before FAQ). */
export function CalculatorGuideArticles({ href }: { href: string }) {
  switch (href) {
    case "/calculators/cost-rate":
      return (
        <CalculatorSeoSection>
          <CalculatorSeoArticle title="원가율 계산 방법">
            <p>
              원가율 계산기는 판매가와 원가를 이용해 원가율을 계산하는 도구입니다.
              원가율은 판매가 대비 원재료비(또는 원가)가 차지하는 비율로, 음식점·카페·소매
              메뉴의 수익성을 파악할 때 가장 먼저 보는 지표입니다.
            </p>
            <Formula>원가율(%) = 원가 ÷ 판매가 × 100</Formula>
            <p>
              같은 값으로 마진율도 함께 확인할 수 있습니다. 마진율 = (판매가 − 원가) ÷ 판매가 × 100이며,
              원가율과 마진율을 더하면 100%가 됩니다.
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="원가율 계산 예시">
            <p>
              판매가 10,000원, 원가 3,500원인 메뉴라면 원가율은 35%, 마진율은 65%입니다.
              판매가 12,000원으로 올리고 원가가 같다면 원가율은 약 29.2%로 낮아져 같은 원가에서도
              여유 마진이 커집니다.
            </p>
            <p className="mt-3">
              배달 메뉴는 플랫폼 수수료·포장비가 추가되므로, 홀 판매와 같은 판매가라도 실질 마진이
              달라집니다. 배달 정산·순이익은{" "}
              <InlineCalcLink href="/calculators/delivery-margin">배달 마진 계산기</InlineCalcLink>로
              함께 확인하는 것이 좋습니다.
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="원가율은 어떻게 활용하나요?">
            <p>
              음식점은 보통 원가율 25~35%, 카페 음료는 20~30%대를 참고 목표로 삼는 경우가 많습니다.
              목표 원가율(또는 목표 마진율)을 정한 뒤{" "}
              <InlineCalcLink href="/calculators/menu-price">메뉴 가격 계산기</InlineCalcLink>로
              권장 판매가를 산출하고, 고정비까지 반영하려면{" "}
              <InlineCalcLink href="/calculators/break-even">손익분기점 계산기</InlineCalcLink>를
              함께 쓰면 됩니다.
            </p>
            <p className="mt-3">
              원가율 관리 실무는{" "}
              <Link
                href="/resources/restaurant-cost-rate-management"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                음식점 원가율 관리법
              </Link>
              가이드에서도 확인할 수 있습니다.
            </p>
          </CalculatorSeoArticle>
        </CalculatorSeoSection>
      )

    case "/calculators/customer-unit-price":
      return (
        <CalculatorSeoSection>
          <CalculatorSeoArticle title="객단가 계산 방법">
            <p>
              객단가(평균 객단가)는 고객 한 명이 한 번 방문(또는 주문)할 때 남기는 평균 매출입니다.
              매출 규모와 방문 고객 수를 알면 객단가를 바로 계산할 수 있습니다.
            </p>
            <Formula>객단가 = 매출액 ÷ 고객 수</Formula>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="객단가 계산 예시">
            <p>
              하루 매출 800,000원, 고객 100명이면 객단가는 8,000원입니다. 같은 고객 수에서
              객단가가 9,000원으로 오르면 하루 매출은 900,000원이 됩니다.
            </p>
            <p className="mt-3">
              목표 매출을 정했다면 필요한 고객 수도 함께 확인할 수 있습니다. 목표 매출·순이익 계획은{" "}
              <InlineCalcLink href="/calculators/sales-goal">목표 매출 계산기</InlineCalcLink>와
              함께 보면 도움이 됩니다.
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="객단가는 어떻게 활용하나요?">
            <p>
              객단가는 세트 메뉴, 사이드 추천, 업셀링 효과를 숫자로 확인하는 데 쓰입니다.
              메뉴 구성을 바꿀 때는{" "}
              <InlineCalcLink href="/calculators/cost-rate">원가율 계산기</InlineCalcLink>로
              원가 부담도 같이 점검하세요.
            </p>
          </CalculatorSeoArticle>
        </CalculatorSeoSection>
      )

    case "/calculators/delivery-margin":
      return (
        <CalculatorSeoSection>
          <CalculatorSeoArticle title="배달 마진·수수료 계산 방법">
            <p>
              배달 마진 계산기는 배달의민족·쿠팡이츠·요기요·땡겨요 등 배달앱 주문 한 건 기준으로
              예상 정산금액, 수수료, 순이익·마진율을 비교하는 도구입니다. 배민 수수료·배달 수수료
              계산이 필요할 때 주문 금액을 입력해 바로 확인할 수 있습니다.
            </p>
            <p className="mt-3">
              대략적인 흐름은 「주문 금액 − 중개(배달) 수수료 − PG 등 결제 수수료 − 포장·기타 비용」으로
              남는 금액을 순이익으로 보는 것입니다. 앱·요금제마다 수수료율이 다르므로 실제 사장님
              센터 고지를 기준으로 입력값을 맞추는 것이 중요합니다.
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="배달 마진 계산 예시">
            <p>
              주문 금액 20,000원 기준으로 중개 수수료·결제 수수료·포장비를 반영하면 앱마다 남는
              금액이 달라집니다. 같은 메뉴라도 홀 판매 대비 배달은 수수료 부담이 커서 실질 마진이
              낮아지는 경우가 많습니다.
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="배달 마진은 어떻게 활용하나요?">
            <p>
              배달 전용 가격·쿠폰 정책을 정할 때 사용하세요. 재료 원가는{" "}
              <InlineCalcLink href="/calculators/cost-rate">원가율 계산기</InlineCalcLink>,
              쿠폰 손익은{" "}
              <InlineCalcLink href="/calculators/delivery-coupon-profit">
                배달 쿠폰 손익 계산기
              </InlineCalcLink>
              , 앱별 수수료 비교 설명은{" "}
              <Link
                href="/resources/delivery-app-fees-comparison"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                배달앱 수수료 비교
              </Link>
              가이드를 참고할 수 있습니다.
            </p>
          </CalculatorSeoArticle>
        </CalculatorSeoSection>
      )

    case "/calculators/vat":
      return (
        <CalculatorSeoSection>
          <CalculatorSeoArticle title="부가세 계산 방법">
            <p>
              부가세(부가가치세) 계산기는 공급가액 또는 합계 금액(부가세 포함)을 기준으로
              부가세 10%를 계산합니다. 세금계산서·영수증 금액을 확인할 때 자주 쓰입니다.
            </p>
            <Formula>부가세 = 공급가액 × 10%</Formula>
            <p>합계 금액만 있을 때는 공급가액 = 합계 ÷ 1.1, 부가세 = 합계 − 공급가액으로 계산합니다.</p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="부가세 계산 예시">
            <p>
              공급가액 100,000원이면 부가세 10,000원, 합계 110,000원입니다. 합계 110,000원만
              알고 있어도 공급가액 100,000원·부가세 10,000원으로 역산할 수 있습니다.
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="부가세는 어떻게 활용하나요?">
            <p>
              간이과세·일반과세 선택이 고민이면{" "}
              <InlineCalcLink href="/calculators/vat-type-compare">
                간이·일반과세 비교 계산기
              </InlineCalcLink>
              와{" "}
              <Link
                href="/resources/simplified-vs-general-vat"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                간이과세자 vs 일반과세자
              </Link>
              ,{" "}
              <Link
                href="/resources/vat-filing-guide"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                부가세 신고 방법
              </Link>
              가이드를 함께 보세요. 세무 판단은 세무사·홈택스 안내를 기준으로 하세요.
            </p>
          </CalculatorSeoArticle>
        </CalculatorSeoSection>
      )

    case "/calculators/income-tax":
      return (
        <CalculatorSeoSection>
          <CalculatorSeoArticle title="종합소득세 계산 방법">
            <p>
              종합소득세 계산기는 개인사업자가 연간 매출·필요경비·공제 등을 입력해 예상
              종합소득세를 참고용으로 계산하는 도구입니다. 사업소득을 포함한 종합소득 과세표준에
              누진세율을 적용하는 구조를 단순화해 보여 줍니다.
            </p>
            <p className="mt-3">
              실제 신고액은 소득공제·세액공제·기납부세액(중간예납·원천징수) 등에 따라 달라지므로,
              본 결과는 의사결정용 추정치로만 사용하세요.
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="종합소득세 계산 예시">
            <p>
              연 매출에서 필요경비를 뺀 소득에 공제를 반영하면 과세표준이 정해지고, 구간에 따라
              세율이 달라집니다. 숫자가 크더라도 공제·기납부액에 따라 추가 납부액은 달라질 수 있습니다.
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="종합소득세는 어떻게 활용하나요?">
            <p>
              매년 5월 신고 전 대략적인 세 부담을 가늠할 때 사용합니다. 부가세·과세유형은{" "}
              <InlineCalcLink href="/calculators/vat">부가세 계산기</InlineCalcLink>·{" "}
              <InlineCalcLink href="/calculators/vat-type-compare">
                간이·일반과세 비교
              </InlineCalcLink>
              , 신고 절차는{" "}
              <Link
                href="/resources/income-tax-filing-guide"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                종합소득세 신고 방법
              </Link>
              가이드를 참고하세요. 3.3% 원천징수(사업소득 지급)와 근로소득 구분은{" "}
              <Link
                href="/resources/employee-vs-freelancer-tax"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                근로자 vs 사업소득자(3.3%) 구분
              </Link>
              자료를 확인하세요.
            </p>
          </CalculatorSeoArticle>
        </CalculatorSeoSection>
      )

    case "/calculators/break-even":
      return (
        <CalculatorSeoSection>
          <CalculatorSeoArticle title="손익분기점 계산 방법">
            <p>
              손익분기점(BEP)은 매출이 고정비와 변동비를 모두 회수해 이익이 0이 되는 지점입니다.
              고정비·판매가·변동비를 알면 손익분기 판매 수량과 매출을 계산할 수 있습니다.
            </p>
            <Formula>손익분기 수량 = 고정비 ÷ (판매가 − 개당 변동비)</Formula>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="손익분기점 계산 예시">
            <p>
              월 고정비 3,000,000원, 판매가 10,000원, 개당 변동비 4,000원이면 개당 공헌이익은
              6,000원이고, 손익분기 수량은 500개(매출 5,000,000원)입니다.
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="손익분기점은 어떻게 활용하나요?">
            <p>
              창업·임대료 인상·인력 충원 전에 「최소 몇 개를 팔아야 하는지」를 확인할 때 씁니다.
              원가 구조는{" "}
              <InlineCalcLink href="/calculators/cost-rate">원가율 계산기</InlineCalcLink>,
              투자 회수는{" "}
              <InlineCalcLink href="/calculators/payback-period">
                투자금 회수기간 계산기
              </InlineCalcLink>
              , 설명 글은{" "}
              <Link
                href="/resources/break-even-calculation-guide"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                손익분기점 계산 방법
              </Link>
              을 참고하세요.
            </p>
          </CalculatorSeoArticle>
        </CalculatorSeoSection>
      )

    case "/calculators/card-fee":
      return (
        <CalculatorSeoSection>
          <CalculatorSeoArticle title="카드 가맹점 수수료 계산 방법">
            <p>
              카드 수수료 계산기는 카드 매출액과 수수료율을 입력해 수수료와 실제 정산(입금) 금액을
              계산합니다. 영세·중소 가맹점 수수료율은 매출 구간·카드사 고지에 따라 달라질 수 있습니다.
            </p>
            <Formula>정산금액 ≈ 카드 매출 − (카드 매출 × 수수료율)</Formula>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="카드 수수료 계산 예시">
            <p>
              카드 매출 1,000,000원, 수수료율 1.5%이면 수수료 약 15,000원, 정산금액 약 985,000원
              수준입니다. (부가세 포함 여부 등 계약 조건에 따라 달라질 수 있습니다.)
            </p>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="카드 수수료는 어떻게 활용하나요?">
            <p>
              현금·카드 비중을 바꿀 때, 배달·홀 매출의 실입금 차이를 볼 때 참고하세요. 부가세 포함
              금액 확인은{" "}
              <InlineCalcLink href="/calculators/vat">부가세 계산기</InlineCalcLink>, 배달 정산은{" "}
              <InlineCalcLink href="/calculators/delivery-margin">배달 마진 계산기</InlineCalcLink>와
              함께 쓰면 좋습니다.
            </p>
          </CalculatorSeoArticle>
        </CalculatorSeoSection>
      )

    case "/calculators/inventory-turnover":
      return (
        <CalculatorSeoSection>
          <CalculatorSeoArticle title="재고회전율 계산 방법">
            <p>
              재고회전율은 일정 기간 동안 재고가 몇 번 소진·교체되었는지 보여주는 지표입니다.
              매출원가와 평균 재고액을 알면 계산할 수 있습니다.
            </p>
            <Formula>재고회전율 = 매출원가 ÷ 평균 재고액</Formula>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="재고회전율 활용">
            <p>
              회전율이 낮으면 재고가 오래 묶여 있다는 신호일 수 있습니다. 원가·폐기 관리는{" "}
              <InlineCalcLink href="/calculators/cost-rate">원가율 계산기</InlineCalcLink>와{" "}
              <Link
                href="/resources/inventory-ordering-guide"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                음식점 재고·발주 관리법
              </Link>
              을 함께 참고하세요.
            </p>
          </CalculatorSeoArticle>
        </CalculatorSeoSection>
      )

    case "/calculators/payback-period":
      return (
        <CalculatorSeoSection>
          <CalculatorSeoArticle title="투자금 회수기간 계산 방법">
            <p>
              투자금 회수기간은 창업·시설 투자에 들어간 돈이 월 순이익으로 회수되기까지 걸리는
              기간을 가늠하는 지표입니다.
            </p>
            <Formula>회수기간(개월) ≈ 초기 투자금 ÷ 월 순이익</Formula>
          </CalculatorSeoArticle>
          <CalculatorSeoArticle title="투자금 회수기간 활용">
            <p>
              임대료·인테리어 규모를 정할 때 참고하세요. 손익 구조는{" "}
              <InlineCalcLink href="/calculators/break-even">손익분기점 계산기</InlineCalcLink>와
              함께 보면 이해가 쉽습니다.
            </p>
          </CalculatorSeoArticle>
        </CalculatorSeoSection>
      )

    default:
      return null
  }
}
