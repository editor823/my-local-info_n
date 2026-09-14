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
export function getPostFeaturedImage(post: { title: string; category: string; image?: string }): string {
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
  // 수산, 어업
  if (titleLower.includes("수산") || titleLower.includes("어업") || titleLower.includes("선박") || titleLower.includes("바다")) {
    return "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1200"; // 바다 / 어선
  }

  // 기본 공공/생활 복지 테마 (서울 도시 풍경)
  return "https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg?auto=compress&cs=tinysrgb&w=1200";
}

// 본문 중간에 들어갈 2번째 서브 이미지 매칭 헬퍼
export function getPostSecondaryImage(post: { title: string; category: string }): string {
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

export function getAllPosts(): PostData[] {
  // src/content/posts 폴더가 없으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      const postItem = {
        slug,
        title: data.title || slug,
        date: formatPostDate(data.date),
        summary: data.summary || "",
        category: data.category || "일반",
        tags: Array.isArray(data.tags) ? data.tags : [],
        content,
        image: data.image || "",
      };

      // 썸네일/대표 이미지가 없으면 글 주제에 맞는 Pexels 고화질 이미지 매칭
      postItem.image = getPostFeaturedImage(postItem);

      return postItem;
    });

  // 날짜 기준 최신순 정렬
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): PostData | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    date: formatPostDate(data.date),
    summary: data.summary || "",
    category: data.category || "일반",
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
    image: data.image || "",
  };
}
