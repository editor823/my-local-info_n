import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goodkey-info.com";

  // 기본 정적 페이지 목록 (구글 애드센스 심사 필수 페이지 포함)
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/events/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/terms/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/disclaimer/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // src/content/posts/ 폴더의 모든 오리지널 고품질 마크다운 글만 사이트맵에 등록
  // (구글 애드센스 가치없는 콘텐츠 방지: 템플릿 양산형 /benefit/ 페이지 제외)
  const posts = getAllPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    let date = new Date();
    if (post.date) {
      const parsed = new Date(post.date);
      if (!isNaN(parsed.getTime())) {
        date = parsed;
      }
    }
    return {
      url: `${siteUrl}/blog/${post.slug}/`,
      lastModified: date,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  return [...routes, ...postRoutes];
}
