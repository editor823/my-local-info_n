import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import localInfoData from "../../public/data/local-info.json";

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
  ];

  // src/content/posts/ 폴더의 모든 마크다운 글 자동 포함
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
      priority: 0.7,
    };
  });

  // 모든 자치구 혜택/행사 상세 아티클 (/benefit/[id]/) 사이트맵 자동 등록
  const localItems = [
    ...(localInfoData.benefits || []),
    ...(localInfoData.events || []),
  ];
  const benefitRoutes: MetadataRoute.Sitemap = localItems.map((item) => ({
    url: `${siteUrl}/benefit/${item.id}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...routes, ...benefitRoutes, ...postRoutes];
}
