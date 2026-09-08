import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category?: string;
  tags?: string[];
  content: string;
}

// Date 객체이거나 임의의 형식일 때 YYYY-MM-DD 문자열로 변환해주는 헬퍼 함수
function formatDateString(rawDate: unknown): string {
  if (!rawDate) return "";

  if (rawDate instanceof Date) {
    const year = rawDate.getFullYear();
    const month = String(rawDate.getMonth() + 1).padStart(2, "0");
    const day = String(rawDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const str = String(rawDate).trim();
  // "2026-09-08T00:00:00.000Z" 형태 등 ISO 문자열인 경우 처리
  if (str.includes("T")) {
    return str.split("T")[0];
  }

  return str;
}

// 모든 포스트 목록을 가져와서 최신 날짜순으로 정렬하는 함수
export function getAllPosts(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: formatDateString(data.date),
        summary: data.summary || "",
        category: data.category || "일반",
        tags: Array.isArray(data.tags) ? data.tags : [],
        content,
      };
    });

  // 날짜 기준 내림차순(최신순) 정렬
  return allPosts.sort((a, b) => b.date.localeCompare(a.date));
}

// 특정 slug를 가진 포스트의 상세 정보를 가져오는 함수
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
    date: formatDateString(data.date),
    summary: data.summary || "",
    category: data.category || "일반",
    tags: Array.isArray(data.tags) ? data.tags : [],
    content,
  };
}
