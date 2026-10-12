import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goodkey-info.com";

  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "Google-Display-Ads-Bot",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Yeti",
        allow: "/",
      },
      {
        userAgent: "bingbot",
        allow: "/",
      },
      {
        userAgent: ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot"],
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
