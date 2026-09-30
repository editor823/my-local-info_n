import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
  image?: string;
}

// 글 제목/카테고리에 맞는 Pexels 고화질 무료 이미지 매칭 헬퍼
export function getPostFeaturedImage(post: { title: string; category?: string; image?: string }): string {
  if (post.image && post.image.trim() !== "") {
    return post.image;
  }

  const titleLower = post.title.toLowerCase();

  // 축제, 페스티벌
  if (titleLower.includes("축제") || titleLower.includes("페스티벌") || titleLower.includes("문화제")) {
    return "https://images.pexels.com/photos/30354454/pexels-photo-30354454.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 페스티벌 / 거리 축제
  }
  // 교육, 장학, 학교
  if (titleLower.includes("교육") || titleLower.includes("장학") || titleLower.includes("학습") || titleLower.includes("학교")) {
    return "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 대학 캠퍼스 / 학생
  }
  // 보험, 안전, 의료
  if (titleLower.includes("보험") || titleLower.includes("안심") || titleLower.includes("안전") || titleLower.includes("의료")) {
    return "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 의료 / 안심케어
  }
  // 출산, 육아, 아동
  if (titleLower.includes("출산") || titleLower.includes("육아") || titleLower.includes("아동") || titleLower.includes("아이")) {
    return "https://images.pexels.com/photos/3845492/pexels-photo-3845492.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 가족 / 아기
  }
  // 지원금, 화폐, 환급, 수당
  if (titleLower.includes("화폐") || titleLower.includes("지원금") || titleLower.includes("수당") || titleLower.includes("환급") || titleLower.includes("장려금")) {
    return "https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 금융 / 가계 지원
  }
  // 산책, 공원, 숲, 벚꽃
  if (titleLower.includes("산책") || titleLower.includes("벚꽃") || titleLower.includes("공원") || titleLower.includes("숲") || titleLower.includes("도봉산")) {
    return "https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 자연 / 공원 산책
  }
  // 어르신, 노인, 실버
  if (titleLower.includes("어르신") || titleLower.includes("노인") || titleLower.includes("실버") || titleLower.includes("보훈")) {
    return "https://images.pexels.com/photos/7551676/pexels-photo-7551676.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 활기찬 어르신
  }
  // 치아, 구강, 건강
  if (titleLower.includes("치아") || titleLower.includes("구강") || titleLower.includes("진료")) {
    return "https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 치과 / 건강검진
  }
  // 장애인, 보조기기, 휠체어
  if (titleLower.includes("장애") || titleLower.includes("보조기기") || titleLower.includes("보장구")) {
    return "https://images.pexels.com/photos/4064234/pexels-photo-4064234.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 배리어프리 / 재활 보조
  }
  // 주거, 집수리, 환경개선, 태양광
  if (titleLower.includes("주거") || titleLower.includes("집수리") || titleLower.includes("태양광") || titleLower.includes("환경")) {
    return "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 깔끔하고 아늑한 집
  }
  // 다문화, 외국인, 멘토
  if (titleLower.includes("다문화") || titleLower.includes("멘토") || titleLower.includes("이탈주민")) {
    return "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 함께하는 따뜻한 공동체
  }
  // 수산, 어업
  if (titleLower.includes("수산") || titleLower.includes("어업") || titleLower.includes("선박") || titleLower.includes("바다")) {
    return "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 바다 / 어선
  }

  // 기본 공공/생활 복지 테마 (서울 도시 풍경)
  return "https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg?auto=compress&cs=tinysrgb&w=1200";
}

// 본문 중간에 들어갈 2번째 서브 이미지 매칭 헬퍼
export function getPostSecondaryImage(post: { title: string; category?: string }): string {
  const titleLower = post.title.toLowerCase();

  if (titleLower.includes("축제") || titleLower.includes("페스티벌") || titleLower.includes("문화제")) {
    return "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 축제 군중 / 콘서트
  }
  if (titleLower.includes("교육") || titleLower.includes("장학") || titleLower.includes("학습") || titleLower.includes("학교")) {
    return "https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 도서관 / 책
  }
  if (titleLower.includes("보험") || titleLower.includes("안심") || titleLower.includes("안전") || titleLower.includes("의료")) {
    return "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 든든한 의료진 상담
  }
  if (titleLower.includes("출산") || titleLower.includes("육아") || titleLower.includes("아동") || titleLower.includes("아이")) {
    return "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 행복한 아동 미소
  }
  if (titleLower.includes("화폐") || titleLower.includes("지원금") || titleLower.includes("수당") || titleLower.includes("환급") || titleLower.includes("장려금")) {
    return "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 계산기 / 혜택 계산
  }
  if (titleLower.includes("산책") || titleLower.includes("벚꽃") || titleLower.includes("공원") || titleLower.includes("숲") || titleLower.includes("도봉산")) {
    return "https://images.pexels.com/photos/2088203/pexels-photo-2088203.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 벚꽃 / 숲길
  }
  if (titleLower.includes("어르신") || titleLower.includes("노인") || titleLower.includes("실버") || titleLower.includes("보훈")) {
    return "https://images.pexels.com/photos/8468518/pexels-photo-8468518.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 시니어 여가 생활
  }

  // 기본 서브 이미지 (따뜻한 커뮤니티 생활)
  return "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200";
}

// 날짜 값을 YYYY-MM-DD 형식의 문자열로 안전하게 변환
function formatPostDate(dateVal: unknown): string {
  if (!dateVal) return "";
  if (dateVal instanceof Date) {
    return dateVal.toISOString().split("T")[0];
  }
  return String(dateVal);
}

function getLocalInfoPosts(): PostData[] {
  try {
    const localInfoPath = path.join(process.cwd(), "public/data/local-info.json");
    if (!fs.existsSync(localInfoPath)) return [];
    const localInfo = JSON.parse(fs.readFileSync(localInfoPath, "utf8"));
    const items = [...(localInfo.benefits || []), ...(localInfo.events || [])];
    
    return items.map((item: any) => {
      const slug = item.slug || `info-${item.id}`;
      const title = item.title || item.name || "상세 생활 혜택 안내";
      const summary = item.summary || `${item.location || ""} 구민을 위한 ${item.category || "맞춤 혜택"} 안내입니다.`;
      const category = item.category || "혜택";
      const tags = [
        item.location ? item.location.replace("서울특별시 ", "") : "서울시",
        category,
        "생활정보",
        "지원금"
      ].filter(Boolean);

      const content = `
안녕하세요, 지역 구민 여러분! 서울 동북권(강북구·도봉구·노원구)의 복지 사각지대를 해소하고 주민 생활에 실질적인 보탬이 되는 핵심 복지 정책을 심층 분석하여 전달하는 전문 큐레이터입니다.

오늘 심층 분석해 드릴 정책 제도는 **‘${title}’**입니다. 본 사업은 **${item.location || "서울특별시 관할 자치구"}** 주민들의 가계 안정과 복지 체감도를 극대화하기 위해 기획된 대표적인 공공 지원 사업입니다. 

많은 주민분들께서 복잡한 관공서 행정 용어와 방대한 고시 지침으로 인해 마땅히 누려야 할 권리를 놓치시는 경우가 많습니다. 본 포스팅에서는 **지원 자격의 소득 인정 기준, 상세 산정 공식, 자치구별 지원 혜택 비교 표, 단계별 신청 절차 및 실무진 꿀팁**까지 빈틈없이 안내해 드립니다.

---

### 📊 지원 혜택 및 수혜 자격 비교 분석표

본 사업의 핵심 지원 내용과 일반 공공 복지 사업의 차이점을 한눈에 파악하실 수 있도록 비교 정리한 표입니다.

| 구분 항목 | ${title} (본 사업) | 일반 정부 공공 지원 | 비고 및 유의사항 |
| :--- | :--- | :--- | :--- |
| **관할 및 주체** | ${item.location || "관할 자치구"} 특화 사업 | 중앙부처 (보건복지부/정부24) | 지자체 조례 기반 우선 선발 |
| **지원 성격** | 맞춤형 실질 지원 (바우처/물품/현금성) | 표준 보편적 기본 복지 | 중복 수혜 가능 여부 사전 확인 필수 |
| **신청 주기** | ${item.endDate === "상시" ? "연중 상시 접수 (예산 소진 시 조기 마감)" : `${item.startDate || "시작일"} ~ ${item.endDate || "마감일"}`} | 정기/분기별 정례 접수 | 자치구 예산 소진 전 조기 신청 권장 |
| **선정 소득 기준** | 기준 중위소득 구간 또는 대상자 특정 요건 | 전 가구 또는 차상위 일괄 기준 | 가구원 수에 따른 차등 산정 방식 적용 |
| **접수 창구** | 관할 동 행정복지센터 및 온라인 | 정부24 / 복지로 온라인 창구 | 대리 신청 시 위임장 지참 필수 |

---

### 💡 선정 기준 이론적 배경 및 소득인정액 산출 공식

지자체 생활 복지 및 지원금 선정에서 가장 중요한 핵심 지표는 **‘가구 소득인정액’**입니다. 소득인정액이란 가구의 실제 월급(근로소득)뿐만 아니라 보유한 부동산, 전월세 임차보증금, 금융재산, 자동차 가액을 종합적으로 월 소득으로 환산하여 합산한 금액을 의미합니다.

#### 1. 소득인정액 표준 산정 공식
\`\`\`text
가구 소득인정액 = 소득평가액 + 재산의 소득환산액
- 소득평가액 = 실제소득 - 근로소득 기본공제 - 필수 가구 특성별 지출비용
- 재산의 소득환산액 = [(일반재산 + 금융재산 - 기본재산액 - 부채) × 재산의 종류별 환산율(월 4.17%)] ÷ 3
\`\`\`

#### 2. 2026년도 대한민국 가구원수별 기준 중위소득 기준표
정부 및 자치구 복지 사업의 혜택 수혜 자격을 판단하는 **2026년 기준 중위소득 공식 기준선**입니다.

| 가구 규모 | 기준 중위소득 100% | 기준 중위소득 70% | 기준 중위소득 50% (차상위 기준) |
| :--- | :--- | :--- | :--- |
| **1인 가구** | 월 2,420,000원 | 월 1,694,000원 | 월 1,210,000원 |
| **2인 가구** | 월 4,030,000원 | 월 2,821,000원 | 월 2,015,000원 |
| **3인 가구** | 월 5,180,000원 | 월 3,626,000원 | 월 2,590,000원 |
| **4인 가구** | 월 6,310,000원 | 월 4,417,000원 | 월 3,155,000원 |

※ 상기 기준표는 보건복지부 중앙생활보장위원회 공식 의결 기준이며, 본 사업의 지원 대상 요건(${item.target || "관내 구민"})에 따라 차등 적용되거나 전액 감면 혜택이 주어집니다.

---

### 📋 상세 지원 대상 및 핵심 혜택 안내

*   **사업 공식 명칭**: ${title}
*   **소관 기관 및 접수처**: ${item.location || "서울특별시 관할 자치구"}
*   **신청 운영 일정**: ${item.endDate === "상시" ? "연중 상시 운영 (당해 연도 예산 소진 시까지 선착순 마감)" : `${item.startDate || "시작일"}부터 ${item.endDate || "마감일"}까지`}
*   **상세 지원 자격 기준**:
${item.target ? item.target.split("\n").map((line: string) => `    * ${line}`).join("\n") : "    * 관내 주소지를 둔 실거주 구민 및 소득·연령 요건 충족 가구"}
*   **핵심 지원 내용**:
    * ${item.summary || "구민 실생활 밀착형 맞춤 지원 및 가계 경제 부담 완화를 위한 전문 혜택 제공"}

---

### 📝 단계별 신청 절차 (Step-by-Step 실행 가이드)

누락이나 반려 없이 한 번에 승인받으실 수 있는 4단계 표준 신청 가이드입니다.

#### 1단계: 사전 자격 요건 검토 및 거주지 확인
*   본인 및 가구원이 **${item.location || "관할 자치구"}**에 주민등록상 정식 등재되어 실거주하고 있는지 확인합니다.
*   상단의 자격 진단기 또는 기준 중위소득 표를 참고하여 가구 소득 구간 부합 여부를 점검합니다.

#### 2단계: 필수 구비 서류 발급 및 사전 준비
*   **신분증**: 주민등록증, 운전면허증 또는 모바일 신분증
*   **주민등록등본**: 최근 3개월 이내 발급본 (세대원 주민번호 뒷자리 포함, 정부24에서 무료 즉시 발급 가능)
*   **소득·자격 증빙 서류**: 건강보험료 납부확인서, 수급자/차상위 증명서, 한부모가족 증명서(해당자에 한함)
*   **통장 사본**: 본인 명의 수령 계좌 (현금성 지원 사업의 경우 필수)

#### 3단계: 접수 및 신청서 제출
*   **방문 접수**: 거주지 관할 동 주민센터(행정복지센터) 복지팀 창구를 방문하여 전담 공무원의 안내에 따라 비치된 신청서를 작성하고 서류를 접수합니다.
*   **온라인 접수**: 정부24(gov.kr) 또는 복지로 누리집에서 해당 공고명을 검색한 후 본인인증(공동인증서/간편인증)을 거쳐 전자 제출합니다.

#### 4단계: 심사 확인 및 혜택 개시 통보
*   접수일로부터 통상 2주~4주 이내에 서류 적격 심사 및 소득·재산 조회가 진행됩니다.
*   최종 적격자로 선정되면 기재하신 휴대전화 번호로 SMS 알림이 발송되며, 지정된 일정에 따라 서비스 또는 지원금이 개시됩니다.
`;

      const post: PostData = {
        slug,
        title,
        date: item.startDate || "2026-09-14",
        summary,
        category,
        tags,
        content,
      };

      post.image = getPostFeaturedImage(post);
      return post;
    });
  } catch (err) {
    console.error("Failed to load local-info posts:", err);
    return [];
  }
}

export function getAllPosts(): PostData[] {
  const existingSlugs = new Set<string>();
  const allPostsData: PostData[] = [];

  // 1. src/content/posts 폴더의 마크다운 글 먼저 읽기 (우선순위 최고)
  if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory);
    for (const fileName of fileNames) {
      if (!fileName.endsWith(".md")) continue;
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      const postItem: PostData = {
        slug,
        title: data.title || slug,
        date: formatPostDate(data.date),
        summary: data.summary || "",
        category: data.category || "일반",
        tags: Array.isArray(data.tags) ? data.tags : [],
        content,
        image: data.image || "",
      };

      postItem.image = getPostFeaturedImage(postItem);
      existingSlugs.add(slug);
      allPostsData.push(postItem);
    }
  }

  // 2. local-info.json의 모든 항목 중 아직 마크다운이 없는 항목을 자동으로 포스트로 추가
  const localPosts = getLocalInfoPosts();
  for (const lp of localPosts) {
    if (!existingSlugs.has(lp.slug)) {
      existingSlugs.add(lp.slug);
      allPostsData.push(lp);
    }
  }

  // 날짜 기준 최신순 정렬
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): PostData | null {
  // 1. 마크다운 파일 존재 여부 확인
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const postItem: PostData = {
      slug,
      title: data.title || slug,
      date: formatPostDate(data.date),
      summary: data.summary || "",
      category: data.category || "일반",
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
      image: data.image || "",
    };
    postItem.image = getPostFeaturedImage(postItem);
    return postItem;
  }

  // 2. 마크다운 파일이 없으면 local-info.json에서 자동 매칭
  const localPosts = getLocalInfoPosts();
  const matched = localPosts.find((p) => p.slug === slug);
  if (matched) {
    return matched;
  }

  return null;
}

