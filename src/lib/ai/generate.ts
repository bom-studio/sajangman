/**
 * AI 콘텐츠 생성 레이어.
 * 향후 OpenAI API 등으로 교체할 때 이 파일만 수정하면 됩니다.
 */

const MOCK_DELAY_MS = 900

function buildMockReviewReply(input: string): string {
  return `안녕하세요, 고객님. 소중한 리뷰 남겨주셔서 진심으로 감사합니다.

말씀해 주신 "${input.slice(0, 40)}${input.length > 40 ? "…" : ""}" 부분을 꼼꼼히 확인했습니다. 좋은 점은 앞으로도 유지하고, 아쉬웠던 부분은 바로 개선하겠습니다.

다음에도 만족하실 수 있도록 더 신경 쓰는 저희 가게가 되겠습니다. 다시 찾아주시면 감사하겠습니다.`
}

function buildMockNotice(input: string): string {
  return `[공지사항]

안녕하세요, 사장만 카페입니다.

${input}

변경·적용 사항은 매장 운영 상황에 따라 조정될 수 있습니다. 이용에 불편을 드려 죄송하며, 양해 부탁드립니다.

문의사항은 매장으로 연락 주시면 친절히 안내해 드리겠습니다.
감사합니다.`
}

function buildMockEventCopy(input: string): string {
  return `🎉 지금이 기회!

${input}

맛과 정성은 그대로, 혜택만 드려요.
매장 방문·배달 주문 모두 환영합니다.

※ 행사 기간 및 조건은 매장 안내를 확인해 주세요.
지금 바로 주문해 보세요!`
}

function buildMockMenuDescription(input: string): string {
  return `✨ 시그니처 메뉴 소개

${input}

한 번 맛보면 다시 찾게 되는 우리 가게의 자신 있는 한 끼입니다.
신선한 재료와 정성을 담아 매일 준비합니다.

지금 주문하시고 특별한 맛을 경험해 보세요.`
}

function buildMockApology(input: string): string {
  return `안녕하세요, 고객님.

먼저 ${input.slice(0, 30)}${input.length > 30 ? "…" : ""} 로 불편을 드린 점 진심으로 사과드립니다.

고객님께서 겪으신 불편은 전적으로 저희 책임이며, 동일한 문제가 반복되지 않도록 내부 점검과 재발 방지 조치를 즉시 진행하겠습니다.

필요하시면 담당자가 직접 연락드려 상세히 안내드리겠습니다. 소중한 의견에 다시 한번 감사드립니다.`
}

function buildMockHolidayNotice(input: string): string {
  return `[휴무 안내]

안녕하세요.

${input}

휴무 기간에는 매장 방문 및 주문 접수가 어려운 점 양해 부탁드립니다.
영업 재개 후 더 좋은 서비스로 찾아뵙겠습니다.

감사합니다.`
}

const MOCK_BUILDERS: Record<string, (input: string) => string> = {
  "review-reply": buildMockReviewReply,
  "notice-generator": buildMockNotice,
  "event-copy": buildMockEventCopy,
  "menu-description": buildMockMenuDescription,
  apology: buildMockApology,
  "holiday-notice": buildMockHolidayNotice,
}

export async function generateAiContent(
  toolId: string,
  input: string
): Promise<string> {
  const trimmed = input.trim()

  if (!trimmed) {
    throw new Error("입력 내용을 작성해 주세요.")
  }

  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))

  const builder = MOCK_BUILDERS[toolId]

  if (!builder) {
    throw new Error("지원하지 않는 AI 도구입니다.")
  }

  return builder(trimmed)
}
