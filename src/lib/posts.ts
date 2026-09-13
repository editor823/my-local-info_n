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

// 글 제목/카테고리에 맞는 아름다운 Unsplash 고화질 무료 이미지 매칭 헬퍼
export function getPostFeaturedImage(post: { title: string; category: string; image?: string }): string {
  if (post.image && post.image.trim() !== "") {
    return post.image;
  }

  const titleLower = post.title.toLowerCase();

  if (titleLower.includes("축제") || titleLower.includes("페스티벌") || titleLower.includes("문화제")) {
    return "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"; // 페스티벌 / 불빛
  }
  if (titleLower.includes("교육") || titleLower.includes("장학") || titleLower.includes("학습") || titleLower.includes("학교")) {
    return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"; // 교육 / 학생 / 책
  }
  if (titleLower.includes("보험") || titleLower.includes("안심") || titleLower.includes("안전") || titleLower.includes("의료")) {
    return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"; // 의료 / 안심케어
  }
  if (titleLower.includes("출산") || titleLower.includes("육아") || titleLower.includes("아동") || titleLower.includes("아이")) {
    return "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80"; // 가족 / 아이
  }
  if (titleLower.includes("화폐") || titleLower.includes("지원금") || titleLower.includes("수당") || titleLower.includes("환급")) {
    return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"; // 금융 / 지원금
  }
  if (titleLower.includes("산책") || titleLower.includes("벚꽃") || titleLower.includes("공원") || titleLower.includes("숲")) {
    return "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80"; // 숲 / 자연
  }

  // 기본 공공/생활 복지 테마
  return "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80";
}

// 본문 중간에 들어갈 2번째 서브 이미지 매칭 헬퍼
export function getPostSecondaryImage(post: { title: string; category: string }): string {
  const titleLower = post.title.toLowerCase();

  if (titleLower.includes("축제") || titleLower.includes("페스티벌") || titleLower.includes("문화제")) {
    return "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80"; // 축제 거리 / 즐거운 군중
  }
  if (titleLower.includes("교육") || titleLower.includes("장학") || titleLower.includes("학습") || titleLower.includes("학교")) {
    return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80"; // 필기 / 열공 / 배움
  }
  if (titleLower.includes("보험") || titleLower.includes("안심") || titleLower.includes("안전") || titleLower.includes("의료")) {
    return "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80"; // 청진기 / 든든한 의료
  }
  if (titleLower.includes("출산") || titleLower.includes("육아") || titleLower.includes("아동") || titleLower.includes("아이")) {
    return "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80"; // 행복한 아이 미소
  }
  if (titleLower.includes("화폐") || titleLower.includes("지원금") || titleLower.includes("수당") || titleLower.includes("환급")) {
    return "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80"; // 혜택 계산 / 서류 검토
  }
  if (titleLower.includes("산책") || titleLower.includes("벚꽃") || titleLower.includes("공원") || titleLower.includes("숲")) {
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"; // 힐링 자연 산책
  }

  // 기본 서브 이미지 (따뜻한 생활 / 커뮤니티)
  return "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80";
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
