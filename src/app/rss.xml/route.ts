import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goodkey-info.com";
  const posts = getAllPosts();

  const rssItems = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}/</link>
      <guid>${siteUrl}/blog/${post.slug}/</guid>
      <description><![CDATA[${post.summary || post.title}]]></description>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()}</pubDate>
      <category><![CDATA[${post.category}]]></category>
    </item>`
    )
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>성남시 생활 정보 | 행사·혜택·지원금 안내</title>
    <link>${siteUrl}</link>
    <description>성남시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.</description>
    <language>ko</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
