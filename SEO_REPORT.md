# SEO Report — sajangman

작성일: 2026-09-18  
범위: 기존 인기 URL 유지 + 우선 클러스터(원가율·객단가·배달/수수료·세금) 강화  
신규 저품질 페이지 대량 생성: 없음

---

## 0. Audit 요약 (수정 전)

| 영역 | 상태 |
|------|------|
| Calculator | 20개 페이지. FAQ accordion + Related는 있음. 공개 H2(방법/예시/활용) 섹션 미사용(`CalculatorSeoSection` 미연결) |
| Resource | 30개 가이드, calculatorHref·내부링크 매핑 존재 |
| Document | 8개 도구. FAQ/설명 본문·canonical 일부 부재 |
| Canonical | 홈/자료/요청 일부만 absolute. 개별 계산기·다수 문서 누락 |
| Breadcrumb UI | 없음 (계산기/자료는 JSON-LD만) |
| Sitemap | 포함 범위 OK. `lastModified` 고정값 오래됨(2026-06-23) |
| 사업소득세(3.3%) 계산기 | **별도 URL 없음**. `/calculators/income-tax`는 종합소득세 |

---

## 1. 수정한 URL (주요)

### 계산기 (메타 + breadcrumb + 가이드 본문)
- `/calculators/cost-rate`
- `/calculators/customer-unit-price`
- `/calculators/delivery-margin`
- `/calculators/vat`
- `/calculators/income-tax`
- `/calculators/break-even`
- `/calculators/card-fee`
- `/calculators/inventory-turnover`
- `/calculators/payback-period`

### 계산기 (canonical + breadcrumb)
- `/calculators/weekly-pay`, `minimum-wage`, `vat-type-compare`, `delivery-coupon-profit`, `sales-goal`, `severance-pay`, `unemployment-benefit`, `net-salary`, `social-insurance`, `annual-leave-pay`, `menu-price`

### 문서
- `/documents/estimate`, `statement`, `quote-request`, `purchase-order`, `supply-contract`, `delivery-note`, `receipt`, `transaction-confirmation`

### 기타
- `/calculators` (허브 메타)
- `/` (홈 description)
- `/sitemap.xml` (lastModified 기준일)

**URL slug 변경: 없음** (인기 페이지 보호)

---

## 2. Title 변경 (우선 클러스터)

| URL | 기존 title | 변경 title |
|-----|-----------|-----------|
| `/calculators/cost-rate` | 원가율 계산기 \| 사장만 | 원가율 계산기 \| 원가율 계산 방법·공식 - 사장만 |
| `/calculators/customer-unit-price` | 객단가 계산기 \| 사장만 | 객단가 계산기 \| 평균 객단가 계산 방법 - 사장만 |
| `/calculators/delivery-margin` | 배달 수수료·순이익 비교 계산기 \| 사장만 | 배달 마진 계산기 \| 배달앱 수수료·순이익 계산 - 사장만 |
| `/calculators/vat` | 부가세 계산기 \| 사장만 | 부가세 계산기 \| 공급가액·부가가치세 계산 - 사장만 |
| `/calculators/income-tax` | 종합소득세 계산기 \| 사장만 | 종합소득세 계산기 \| 개인사업자 예상 세금 계산 - 사장만 |
| `/calculators/break-even` | 손익분기점 계산기 \| 사장만 | 손익분기점 계산기 \| BEP 계산 방법·공식 - 사장만 |
| `/calculators/card-fee` | 카드 수수료 계산기 \| 사장만 | 카드 수수료 계산기 \| 가맹점 카드수수료·정산금액 - 사장만 |
| `/calculators/inventory-turnover` | 재고 회전율 계산기 \| 사장만 | 재고회전율 계산기 \| 재고회전율 개념·계산 방법 - 사장만 |
| `/calculators/payback-period` | 투자금 회수기간 계산기 \| 사장만 | 투자금 회수기간 계산기 \| 투자금회수기간 계산 - 사장만 |
| `/documents/supply-contract` | 물품공급계약서 생성기 \| … | 물품공급계약서 \| 물품공급계약서 작성·PDF - 사장만 |
| `/calculators` | …부가세·주휴수당·배달마진… | …원가율·객단가·배달마진·부가세… |

**사업소득세:** 검색 노출은 있으나 전용 계산기가 없어 title에 3.3% 사업소득세를 넣지 않음(의도 불일치 방지). 종합소득세 페이지·3.3% 구분 가이드로 internal link.

---

## 3. Description 변경 (요약)

우선 페이지 description을 **검색 의도 + 계산 가능 내용 + 부가 정보** 형태로 개별 재작성.
예: 원가율 — 공식·음식점/카페 원가 관리 안내 / 객단가 — 공식·매출 분석 / 배달 — 앱 수수료·순이익 비교 / 종합소득세 — 개인사업자 예상 세금·참고용 명시.

---

## 4. 추가한 H1/H2 구조

계산기 상단: **H1 = 도구명** (계산기 UI 우선 유지)

하단 SEO 본문 (SSR, FAQ 앞):
- H2 원가율/객단가/배달/부가세/종합소득세/손익분기점/카드수수료/재고/회수기간 — **계산 방법**
- H2 **계산 예시** (해당 시)
- H2 **활용 방법** + 관련 계산기·자료 앵커 링크

문서 하단:
- H2 언제 사용하나요? / 작성에 필요한 항목 / 작성 시 참고 / 관련 문서

UI breadcrumb: `홈 > 계산기|문서작성 > 상세`

---

## 5. Internal link

- `RELATED_CALCULATOR_HREFS`: 원가율 → 메뉴가격·손익분기·**배달마진**·객단가·목표매출
- 종합소득세 → 부가세·**간이/일반 비교**·원가율·손익분기·목표매출
- Related 섹션 제목: **함께 사용하면 좋은 계산기**
- SEO 본문 앵커: 계산기명·자료실 글 제목 명시 (`원가율 계산기`, `배달앱 수수료 비교` 등)
- 문서: 같은 그룹 관련 문서 링크

---

## 6. Structured data

- 기존 유지: WebSite/Organization(홈), FAQPage(+HowTo 일부), Article+BreadcrumbList(자료)
- 계산기 BreadcrumbList 이름: 배달 마진 계산기로 정합
- **가짜 review/rating 추가 없음**
- 문서: 과도한 SoftwareApplication/FAQ schema 남발 없음 (콘텐츠 보강 우선)

---

## 7. Sitemap

- `SITEMAP_LAST_MODIFIED`: `2026-06-23` → **`2026-09-18`**
- 매 요청 `new Date()` 전체 갱신 방식 유지 안 함
- 포함: 계산기·문서·자료·requests·정책 페이지 / 제외: AI, requests/new, API

---

## 8. Canonical

- `buildCalculatorMetadata` / `buildDocumentMetadata` → `${SITE_URL}{path}` absolute canonical
- 모든 개별 계산기·문서 도구 페이지에 적용
- query(`?category=`)는 허브 canonical `/calculators` 유지(페이지 자체)

---

## 9. SEO 콘텐츠가 추가된 계산기

`src/lib/calculators/seo/article-content.tsx` →  
cost-rate, customer-unit-price, delivery-margin, vat, income-tax, break-even, card-fee, inventory-turnover, payback-period

---

## 10. 추가로 만들면 좋은 콘텐츠 후보 (미구현)

우선순위 후보 URL 제안 (기존 slug 충돌 없음):

| 후보 | 추천 path | 연결 계산기 |
|------|-----------|------------|
| 원가율 계산 방법 (심화) | `/resources/cost-rate-calculation-guide` | cost-rate |
| 원가율과 마진율 차이 | `/resources/cost-rate-vs-margin` | cost-rate, menu-price |
| 객단가 계산·올리는 방법 | `/resources/customer-unit-price-guide` | customer-unit-price |
| 배민·배달앱 수수료 계산 방법 | `/resources/baemin-fee-guide` (기존 비교 글 보강 가능) | delivery-margin |
| 카드 가맹점 수수료 계산 방법 | `/resources/card-fee-guide` | card-fee |
| 음식점 순이익 계산 방법 | `/resources/restaurant-net-profit-guide` | delivery-margin, cost-rate |
| 카페 마진율 | `/resources/cafe-margin-guide` | cost-rate |
| **사업소득세(3.3%) 계산기** | `/calculators/business-income-tax` (신규) | income-tax, net-salary |
| 개인사업자 종합소득세 계산 방법 | 기존 `income-tax-filing-guide` 보강 | income-tax |
| 재고회전율이란 | `/resources/inventory-turnover-guide` | inventory-turnover |
| 투자금 회수기간 계산 방법 | `/resources/payback-period-guide` | payback-period |

**권장:** 사업소득세 3.3%는 종합소득세와 검색 의도가 다르므로 **별도 계산기**를 검토. 이번 작업에서는 미구현.

---

## 검증

- `npm run build`: **성공** (TypeScript 포함)
- `npm run lint`: 기존 document generator 등 **pre-existing** `react-hooks/set-state-in-effect` 오류 존재 (이번 SEO 변경과 무관)
- `npm run typecheck`: package.json에 스크립트 없음 → build의 TS 체크로 대체
- 인기 URL slug 변경 없음
- 가짜 review/rating/키워드 스터핑 없음
- 계산기 상단 긴 SEO 글 배치 없음 (본문은 계산기 아래)

## 핵심 파일

- `src/lib/calculators/seo/article-content.tsx`
- `src/lib/seo/metadata.ts`
- `src/components/page-breadcrumb.tsx`
- `src/components/documents/document-tool-seo.tsx`
- `src/lib/calculators/registry.ts`
- `src/app/sitemap.ts`
- `SEO_REPORT.md` (본 파일)
