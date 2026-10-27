import { getPostBySlug, PostData } from "@/lib/posts";

export interface BenefitItem {
  id: string;
  name: string;
  title?: string;
  category: string;
  startDate?: string;
  endDate?: string;
  location: string;
  target: string;
  summary: string;
  link?: string;
  slug?: string;
  type?: "benefit" | "event";
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

// 제목 텍스트를 안전한 HTML 앵커 ID로 변환
export function slugifyHeading(text: string): string {
  return text
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

// 마크다운 텍스트에서 H2, H3 헤딩 목록 추출
export function extractHeadings(markdown: string): HeadingItem[] {
  const lines = markdown.split("\n");
  const headings: HeadingItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      const text = trimmed.replace(/^##\s+/, "").replace(/[*_`]/g, "").trim();
      if (text) {
        headings.push({
          id: slugifyHeading(text),
          text,
          level: 2,
        });
      }
    } else if (trimmed.startsWith("### ")) {
      const text = trimmed.replace(/^###\s+/, "").replace(/[*_`]/g, "").trim();
      if (text) {
        headings.push({
          id: slugifyHeading(text),
          text,
          level: 3,
        });
      }
    }
  }

  return headings;
}

// 지원 대상에서 소득 조건/연령 조건 요약 추출 헬퍼
export function getBenefitHighlights(benefit: BenefitItem) {
  const target = benefit.target || "";
  const location = benefit.location || "서울특별시";
  const district = location.includes("강북")
    ? "강북구"
    : location.includes("도봉")
    ? "도봉구"
    : location.includes("노원")
    ? "노원구"
    : location.includes("중랑")
    ? "중랑구"
    : "서울시";

  let amountBadge = "맞춤형 실비/수당 지원";
  const textToScan = `${benefit.name} ${benefit.summary} ${target}`;

  if (textToScan.includes("100만")) amountBadge = "최대 100만 원 상당";
  else if (textToScan.includes("200만")) amountBadge = "최대 200만 원 상당";
  else if (textToScan.includes("300만")) amountBadge = "최대 300만 원 상당";
  else if (textToScan.includes("50만")) amountBadge = "50만 원 지원";
  else if (textToScan.includes("월 70천원") || textToScan.includes("7만")) amountBadge = "월 7만 원 정기 지급";
  else if (textToScan.includes("전액") || textToScan.includes("무료")) amountBadge = "비용 전액(100%) 무료 지원";
  else if (textToScan.includes("수리비")) amountBadge = "연간 수리 실비 전액 지원";

  return {
    district,
    amountBadge,
    period: benefit.endDate === "상시" ? "2026년 연중 상시 접수" : `${benefit.startDate || "2026-01-01"} ~ ${benefit.endDate || "상시"}`,
    targetSummary: target.length > 90 ? target.slice(0, 90) + "..." : target,
  };
}

// 마크다운 파일이 없는 혜택에 대해 1,800자 이상의 고품질 심층 해설 아티클 동적 생성
export function generateBenefitDeepArticle(benefit: BenefitItem): string {
  const district = benefit.location.includes("강북")
    ? "강북구"
    : benefit.location.includes("도봉")
    ? "도봉구"
    : benefit.location.includes("노원")
    ? "노원구"
    : "서울시 자치구";

  const title = benefit.name || benefit.title || "구민 생활 복지 지원 사업";
  const summary = benefit.summary || "지역 주민의 생활 안정을 위한 공공 복지 서비스";
  const target = benefit.target || "관내 주민등록을 둔 구민";
  const link = benefit.link || "https://www.gov.kr";

  return `
# ${title} 2026년 신청 자격 요건 및 심층 이용 가이드

안녕하세요, 서울 ${district} 주민 여러분의 알뜰하고 실속 있는 생활을 돕는 공공 복지 전문 에디터입니다.

지자체와 정부 부처에서는 주민들의 복지 증진과 삶의 질 향상을 위해 다양한 생활 밀착형 지원 사업을 펼치고 있습니다. 하지만 정작 혜택을 받을 수 있는 조건에 해당하면서도 공고를 제때 확인하지 못하거나 복잡한 행정 서류 절차 때문에 소중한 지원금을 놓치는 사례가 여전히 적지 않습니다.

이번에 소개해 드리는 **‘${title}’** 사업은 ${district}에 터전을 둔 구민들의 가계 부담을 덜고 실질적인 생활 안정을 지원하기 위해 마련된 대표적인 핵심 복지 정책입니다.

본 심층 가이드에서는 **지원 대상 자격 요건, 지원 금액 및 주요 혜택 내용, 신청 자격 자가진단 체크리스트, 필수 구비 서류 목록, 그리고 신청 시 탈락을 방지하는 실전 팁**까지 한눈에 알기 쉽게 상세히 안내해 드립니다.

---

## 📌 1. 핵심 지원 정보 한눈에 요약

| 구분 | 주요 상세 내용 |
| :--- | :--- |
| **사업 명칭** | ${title} |
| **관할 기관** | ${benefit.location} 및 관할 행정복지센터 |
| **지원 대상** | ${target} |
| **신청 기간** | ${benefit.endDate === "상시" ? "2026년 연중 상시 접수 (예산 소진 시 조기 마감 가능)" : `${benefit.startDate} ~ ${benefit.endDate}`} |
| **혜택 내용** | ${summary} |
| **신청 방식** | 관할 동 주민센터 방문 접수 또는 정부24 온라인 신청 |
| **공식 출처** | 정부24 / ${district}청 공식 복지 알리미 |

---

## 💡 2. 이 혜택을 반드시 챙겨야 하는 3가지 이유

### 1) 주민의 직접적인 경제적 부담 완화
해당 사업은 대상 가구에 직접적인 재정적 지원 또는 필수 서비스(의료, 생활, 돌봄)를 무상·감면 제공함으로써 고물가 시대 가계의 실질적인 지출 비용을 절감해 드립니다.

### 2) 엄선된 공공 안전망 혜택
행정안전부 공공데이터포털 및 지자체 조례에 근거하여 운영되는 공식 제도이므로 허위 정보나 사설 서비스의 수수료 부담 없이 100% 안전하게 신뢰할 수 있습니다.

### 3) 선제적 권리 찾기
복지 혜택은 본인이 직접 신청해야 지급되는 **‘신청주의’** 원칙이 적용됩니다. 자격 조건에 부합한다면 미루지 마시고 조기에 신청하여 혜택을 온전히 누리시기 바랍니다.

---

## 📋 3. 신청 자격 자가진단 체크리스트

신청 전 본인이 지원 대상 요건을 충족하는지 아래 체크리스트를 통해 스스로 점검해 보세요.

- [ ] **1. 거주 요건 확인:** 주민등록등본상 주소지가 **${district}** 관내로 정상 등재되어 있나요?
- [ ] **2. 대상 적격성 확인:** 지원 대상 기준(${target.slice(0, 40)} 등)에 부합하시나요?
- [ ] **3. 소득 및 자산 요건 확인:** 기준중위소득 또는 취약계층(기초생활수급, 차상위, 한부모, 장애인 등) 해당 여부를 확인하셨나요?
- [ ] **4. 중복 수혜 제한 확인:** 동일 목적의 타 유사 국비/시비 지원 사업을 이미 수혜 중이지 않으신가요?
- [ ] **5. 접수 기한 확인:** 신청 접수 기간 내에 필수 증빙 서류를 제출하실 수 있나요?

---

## 📑 4. 필수 구비 서류 및 단계별 신청 방법

정확하고 신속한 심사를 위해 접수 전 구비 서류를 꼼꼼하게 지참하시기 바랍니다.

### 필수 제출 서류 목록
1. **사회보장급여(복지서비스) 제공 신청서** (주민센터 비치 또는 온라인 서식)
2. **신청인 신분증** (주민등록증, 운전면허증 또는 모바일 신분증)
3. **주민등록등본 1부** (최근 3개월 이내 발급분, 세대원 전원 주민번호 표기)
4. **본인 명의 통장 사본** (현금 또는 수당 입금 대상 사업인 경우)
5. **자격 증빙 서류** (해당자에 한함: 수급자 증명서, 장애인등록증, 진단서 등)

### 단계별 신청 절차
1. **사전 유선 문의:** 관할 동 주민센터 복지팀에 전화하여 당해 연도 사업 예산 잔여 현황 및 추가 지참 서류를 확인합니다.
2. **서류 준비 및 작성:** 안내받은 서류를 누락 없이 구비합니다.
3. **접수 신청:** 주소지 관할 행정복지센터를 방문하거나 정부24([gov.kr](${link}))에서 온라인 접수를 완료합니다.
4. **자격 심사 및 통보:** 담당 부서에서 서류 및 소득·재산 조사를 거쳐 최종 선정 여부를 문자(SMS)로 개별 안내합니다.

---

## ⚠️ 5. 신청 시 반드시 유의해야 할 사항

- **방문 전 예산 소진 여부 확인:** 자치구 특화 복지 사업은 배정된 연간 예산이 조기 소진될 경우 신청 접수가 조기 마감될 수 있습니다.
- **서류 유효기간 3개월 준수:** 발급일로부터 3개월이 지난 주민등록등본이나 가족관계증명서는 심사 시 반려될 수 있습니다.
- **대리 신청 시 위임장 필수:** 거동이 불편하여 가족이 대리 신청하는 경우 위임인 도장 날인 위임장과 대리인 신분증, 가족관계증명서를 반드시 지참하셔야 합니다.

---

## ❓ 6. 자주 묻는 질문 (FAQ)

**Q1. 신청 후 지원금이나 서비스는 언제부터 지급되나요?**  
A. 통상 서류 접수일로부터 2주~4주 이내에 자격 심사가 완료되며, 결과 통보와 함께 다음 달 지정 계좌로 입금되거나 서비스가 개시됩니다.

**Q2. 타 자치구로 이사를 가게 되면 어떻게 되나요?**  
A. 본 사업은 ${district} 거주 구민을 위한 고유 사업이므로, 타 지역으로 주민등록을 이전할 경우 자격이 상실될 수 있으니 전출 전 담당 부서에 문의하시기 바랍니다.

**Q3. 온라인 신청이 어려운 어르신은 어떻게 해야 하나요?**  
A. 신분증과 통장 사본을 지참하시고 거주지 관할 동 주민센터 복지 창구를 방문하시면 담당 공무원의 친절한 안내를 받아 현장에서 즉시 신청하실 수 있습니다.
`;
}

// 혜택에 맞는 마크다운 본문 및 메타데이터 통합 반환
export function getBenefitArticleData(benefit: BenefitItem): {
  markdown: string;
  headings: HeadingItem[];
  post?: PostData;
} {
  // 1. slug 또는 id로 기존 작성된 고품질 마크다운 검색
  let post: PostData | null = null;
  if (benefit.slug) {
    post = getPostBySlug(benefit.slug);
  }
  if (!post && benefit.id) {
    post = getPostBySlug(benefit.id);
  }

  let markdownContent = "";
  if (post && post.content && post.content.trim().length > 300) {
    markdownContent = post.content;
  } else {
    // 2. 마크다운 파일이 아직 없는 경우 1,800자 이상 심층 가이드 자동 생성
    markdownContent = generateBenefitDeepArticle(benefit);
  }

  const headings = extractHeadings(markdownContent);

  return {
    markdown: markdownContent,
    headings,
    post: post || undefined,
  };
}
