import type { LegalSection } from "@/lib/legal/types"

export const PRIVACY_EFFECTIVE_DATE = "2026-09-18"

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "service-intro",
    title: "1. 사장만 서비스 소개",
    paragraphs: [
      "사장만(이하 \"서비스\")은 자영업자·소상공인을 위한 무료 업무 도구 플랫폼입니다. 현재는 회원가입·로그인·결제 기능을 필수로 요구하지 않으며, 이용자가 별도 문의 양식으로 개인정보를 제출하지 않는 한 이름·연락처·이메일 등을 직접 수집하지 않습니다.",
      "서비스는 계산기, 문서작성, 자료실 기능을 무료로 제공합니다. 사이트 이용 통계 분석과 광고 운영을 위해 Google Analytics 및 Google AdSense를 사용할 수 있습니다.",
    ],
  },
  {
    id: "collected-info",
    title: "2. 수집하는 정보",
    paragraphs: [
      "사장만은 회원가입 양식 등으로 이름, 연락처, 이메일을 직접 수집하지 않습니다. 다만 서비스 이용 과정에서 아래 정보가 자동으로 수집·처리될 수 있습니다.",
    ],
    listItems: [
      "Google Analytics를 통한 방문 기록(페이지 조회, 체류 시간, 유입 경로 등)",
      "접속 기기 정보(기기 유형, 운영체제 등)",
      "브라우저 정보(브라우저 종류, 언어 설정 등)",
      "IP 정보(통계·분석 및 광고 목적의 처리)",
      "Google AdSense 운영에 필요한 쿠키 및 광고 식별 관련 정보",
    ],
  },
  {
    id: "purpose",
    title: "3. 개인정보 이용 목적",
    paragraphs: ["수집·처리되는 정보는 다음 목적에 한하여 이용됩니다."],
    listItems: [
      "서비스 품질 개선 및 이용 환경 최적화",
      "방문자 통계 분석 및 이용 패턴 파악",
      "Google AdSense를 통한 광고 게재 및 광고 성과 측정",
    ],
  },
  {
    id: "adsense",
    title: "4. Google AdSense 사용 안내",
    paragraphs: [
      "사장만은 Google AdSense를 통해 광고를 게재할 수 있습니다. Google 및 광고 파트너는 쿠키를 사용하여 관심사에 맞는 광고를 표시할 수 있으며, 이 과정에서 브라우저 정보, IP 주소, 방문 기록 등이 처리될 수 있습니다.",
      "Google의 광고 쿠키 사용에 대한 자세한 내용은 Google 광고 정책 및 Google 개인정보처리방침을 참고해 주시기 바랍니다. 이용자는 Google 광고 설정 페이지에서 맞춤 광고를 비활성화할 수 있습니다.",
    ],
  },
  {
    id: "cookies",
    title: "5. 쿠키 사용 안내",
    paragraphs: [
      "서비스는 Google Analytics 및 Google AdSense 운영을 위해 쿠키를 사용할 수 있습니다. 쿠키는 웹사이트가 이용자의 브라우저에 저장하는 소량의 정보로, 방문 통계 수집 및 광고 제공에 활용됩니다.",
      "또한 일부 문서작성 도구는 이용 편의를 위해 공급자 정보·직인 이미지 등을 이용자 기기(localStorage)에 저장할 수 있습니다. 이 정보는 사장만 서버로 전송되지 않으며, 브라우저 저장 공간을 삭제하면 제거할 수 있습니다.",
      "이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. 다만 쿠키 저장을 거부할 경우 일부 서비스 이용에 제한이 있을 수 있습니다.",
    ],
  },
  {
    id: "retention",
    title: "6. 개인정보 보관 및 파기",
    paragraphs: [
      "Google Analytics 및 Google AdSense를 통해 수집되는 정보의 보관 기간과 처리 방식은 각 서비스 제공자(Google)의 정책에 따릅니다.",
      "사장만은 자체적으로 이용자의 개인정보를 별도 서버에 저장·보관하지 않으며, 서비스 종료 또는 수집 목적 달성 시 관련 데이터 처리를 중단합니다.",
    ],
  },
  {
    id: "officer",
    title: "7. 개인정보 보호책임자 및 문의",
    paragraphs: [
      "개인정보 처리와 관련한 문의사항이 있으시면 문의 페이지를 통해 연락해 주시기 바랍니다.",
      "문의: 사장만 문의 페이지(/contact)",
    ],
  },
  {
    id: "effective-date",
    title: "8. 시행일",
    paragraphs: ["본 개인정보처리방침은 2026년 9월 18일부터 시행됩니다."],
  },
]
