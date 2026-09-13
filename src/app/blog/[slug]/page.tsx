import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import { getAllPosts, getPostBySlug, getPostFeaturedImage, getPostSecondaryImage } from "@/lib/posts";
import localInfoData from "../../../../public/data/local-info.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다 | 성남시 생활 정보",
      description: "요청하신 블로그 포스트를 찾을 수 없습니다.",
    };
  }

  const featuredImage = getPostFeaturedImage(post);

  return {
    title: `${post.title} | 성남시 생활 정보`,
    description: post.summary || post.title,
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || post.title,
      images: [featuredImage],
    },
  };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  if (posts.length === 0) {
    return [{ slug: "_placeholder" }];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-emerald-100 text-center max-w-md w-full shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            게시글을 찾을 수 없습니다 🌿
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            요청하신 블로그 포스트가 존재하지 않거나 삭제되었습니다.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-emerald-600/20"
          >
            ← 매거진 목록으로
          </Link>
        </div>
      </div>
    );
  }

  // 관련 추천 글 3편 추출 (현재 글 제외)
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  // local-info.json에서 원문 출처 링크 검색 (slug 또는 제목 매칭)
  const allLocalItems = [
    ...(localInfoData.events || []),
    ...(localInfoData.benefits || []),
  ];
  const matchedItem = allLocalItems.find(
    (item: { slug?: string; title?: string; name?: string; link?: string }) =>
      (item.slug && item.slug === slug) ||
      (item.title && post.title.includes(item.title)) ||
      (item.name && post.title.includes(item.name))
  );
  const sourceLink = matchedItem?.link || "https://www.data.go.kr";

  const featuredImage = getPostFeaturedImage(post);
  const secondaryImage = getPostSecondaryImage(post);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://my-local-info-n.pages.dev";

  // BlogPosting JSON-LD 스키마
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary || post.title,
    image: featuredImage,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}/`,
    },
    author: {
      "@type": "Organization",
      name: "성남시 생활 정보",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "성남시 생활 정보",
      url: siteUrl,
    },
  };

  // BreadcrumbList JSON-LD 스키마 (홈 > 블로그 > 글 제목)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "블로그",
        item: `${siteUrl}/blog/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${slug}/`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 구조화 데이터 (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 1. 글로벌 헤더 */}
      <Header />

      {/* 2. 상단 빵부스러기(Breadcrumb) 바 */}
      <div className="bg-white border-b border-emerald-100/60 py-3 px-4 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-600">홈</Link>
          <span>&gt;</span>
          <Link href="/blog" className="hover:text-emerald-600">혜택 매거진</Link>
          <span>&gt;</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      {/* 3. 메인 상세 본문 */}
      <main className="max-w-4xl w-full mx-auto px-4 py-10 flex-1 space-y-10">
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100/80 shadow-sm space-y-6">
          {/* 머리글 정보 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200">
                {post.category}
              </span>
              <time>📅 발행일: {post.date}</time>
              <span>·</span>
              <time className="text-emerald-700 font-semibold">
                최종 업데이트: {post.date}
              </time>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 대표 시각 이미지 (고화질 맞춤형 배너) */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-100">
            <img
              src={featuredImage}
              alt={post.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-medium">
              <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px]">
                🌿 {post.category} 이야기
              </span>
              <span className="text-[10px] text-white/70">
                Photo by Unsplash
              </span>
            </div>
          </div>

          {/* 마크다운 렌더링 본문 (중간에 2번째 사진 자동 삽입) */}
          {(() => {
            const sections = post.content.split("\n### ");
            if (sections.length > 2) {
              const midIndex = Math.floor(sections.length / 2);
              const part1 = sections.slice(0, midIndex).join("\n### ");
              const part2 = "### " + sections.slice(midIndex).join("\n### ");

              return (
                <>
                  <div className="article-content max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {part1}
                    </ReactMarkdown>
                  </div>

                  {/* 본문 중간 2번째 고화질 관련 이미지 */}
                  <figure className="my-8 space-y-2">
                    <div className="relative w-full h-60 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-100">
                      <img
                        src={secondaryImage}
                        alt={`${post.title} 상세 안내 이미지`}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-medium">
                        <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px]">
                          💡 핵심 안내 & 상세 팁
                        </span>
                        <span className="text-[10px] text-white/70">
                          Photo by Unsplash
                        </span>
                      </div>
                    </div>
                  </figure>

                  <div className="article-content max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {part2}
                    </ReactMarkdown>
                  </div>
                </>
              );
            }

            return (
              <div className="article-content max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            );
          })()}

          {/* 본문 하단 애드센스 광고 영역 */}
          <AdBanner className="my-8" />

          {/* 본문 하단 쿠팡 파트너스 배너 영역 */}
          <CoupangBanner className="my-6" />

          {/* 원문 출처 링크 및 AI 생성 정보 공개 영역 */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {/* 원문 출처 링크 표시 영역 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>🏛️</span> 원문 출처 안내
                </span>
                <p className="text-xs text-slate-500">
                  신청 자격, 필요 서류 및 상세 공고는 공식 출처 웹사이트에서 확인하실 수 있습니다.
                </p>
              </div>
              <a
                href={sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap"
              >
                <span>원문 출처 바로가기</span>
                <span className="text-xs">↗</span>
              </a>
            </div>

            {/* AI 생성 정보 공개 안내 문구 */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 leading-relaxed space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <span>🤖</span> AI 생성 정보 공개
              </p>
              <p>
                이 글은 공공데이터포털(
                <a
                  href="https://www.data.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold text-emerald-800 hover:text-emerald-950"
                >
                  data.go.kr
                </a>
                )의 정보를 바탕으로 AI가 작성하였습니다. 정확한 내용은 원문 링크를 통해 확인해주세요.
              </p>
            </div>
          </div>

          {/* 하단 네비게이션 버튼 */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              ← 목록으로 돌아가기
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors shadow-sm shadow-emerald-600/20"
            >
              홈(종합 정보)으로 이동
            </Link>
          </div>
        </article>

        {/* 4. 구글 애드센스 체류 시간 증가를 위한 추천 섹션 */}
        {relatedPosts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="text-emerald-600">🌿</span> 함께 읽으면 도움되는 지역 이야기
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="bg-white p-5 rounded-2xl border border-emerald-100/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                      {related.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                      {related.title}
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold pt-3 mt-2 border-t border-slate-50 flex items-center gap-1">
                    읽어보기 &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 5. 푸터 */}
      <Footer />
    </div>
  );
}
