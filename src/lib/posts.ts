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
안녕하세요, 지역 구민 여러분! 우리 동네의 꼭 필요한 실속 지원 사업과 맞춤형 복지 정책을 알기 쉽게 정리해 드리는 전문 에디터입니다.

오늘 소개해 드릴 지원 제도는 **‘${title}’**입니다. 본 사업은 **${item.location || "서울특별시"}** 주민들의 복지 증진과 실질적인 생활 안정을 지원하기 위해 마련되었습니다.

아래에서 **지원 대상 자격, 신청 기간, 지원 내용, 신청 방법**을 꼼꼼히 확인해 보시고 꼭 혜택을 챙겨가시기 바랍니다!

---

### 💡 이 혜택, 왜 꼭 챙겨야 할까요? (핵심 포인트 3가지)

**1. 구민 맞춤형 든든한 생활 지원 혜택**  
어려운 시기 가계 부담을 덜어드리고 취약계층 및 대상 주민분들의 삶의 질을 높여드리기 위해 관할 지자체에서 책임지고 지원하는 공식 복지 사업입니다.

**2. 투명하고 간편한 공공 서비스 연계**  
정부24 및 관할 동 주민센터(행정복지센터)와 연계되어 안전하고 신속하게 접수 및 혜택 지원이 이루어집니다.

**3. 놓치기 쉬운 지역 밀착형 틈새 복지**  
우리 동네 주민이라면 누릴 수 있는 고유한 혜택으로, 신청 자격에 해당되는지 미리 확인하시면 큰 혜택을 누리실 수 있습니다.

---

### 📋 지원 대상 및 지원 내용

*   **사업명**: ${title}
*   **관할 및 접수처**: ${item.location || "관할 자치구"}
*   **운영 및 신청 기간**: ${item.endDate === "상시" ? "연중 상시 운영 (예산 소진 시까지)" : `${item.startDate || "시작일"} ~ ${item.endDate || "마감일"}`}
*   **지원 대상**:
${item.target ? item.target.split("\n").map((line: string) => `    ${line}`).join("\n") : "    관내 거주 구민 및 기준 요건 충족 대상자"}
*   **주요 혜택 및 내용**:
    ${item.summary || "상세 지원 기준 및 신청 절차에 따라 맞춤형 복지 혜택 제공"}

---

### 📝 신청 방법 및 필수 안내 사항

본 혜택은 관할 주민센터 방문 접수 또는 정부24(보조금24) 온라인 공식 신청처를 통해 접수하실 수 있습니다.

1. **신청 자격 확인**: 위 지원 대상 기준(연령, 소득, 거주지 등)을 꼼꼼하게 확인합니다.
2. **구비 서류 준비**: 신분증 및 주민등록등본, 필요 증빙 서류(해당자)를 준비합니다.
3. **접수 및 신청**: 아래의 [원문 출처 바로가기 ↗] 버튼을 클릭하시거나 관할 동 주민센터를 방문하여 신청서를 제출합니다.
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

