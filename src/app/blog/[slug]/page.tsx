import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import BenefitCalculatorWidget from "@/components/BenefitCalculatorWidget";
import PostFaqSection from "@/components/PostFaqSection";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getPostPexelsImages } from "@/lib/pexels";
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
      title: "게시글을 찾을 수 없습니다 | 강북·도봉·노원 생활 혜택",
      description: "요청하신 블로그 포스트를 찾을 수 없습니다.",
    };
  }

  const { featured } = await getPostPexelsImages(post);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goodkey-info.com";

  return {
    title: `${post.title} | 강북·도봉·노원 생활 혜택`,
    description: post.summary || post.title,
    alternates: {
      canonical: `/blog/${slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      url: `${siteUrl}/blog/${slug}/`,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: featured.url,
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
      images: [featured.url],
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
            href="/blog/"
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

  // local-info.json에서 원문 출처 링크 검색 (slug 또는 id 또는 제목 매칭)
  const allLocalItems = [
    ...(localInfoData.events || []),
    ...(localInfoData.benefits || []),
  ];
  const matchedItem = allLocalItems.find(
    (item: { id?: string; slug?: string; title?: string; name?: string; link?: string }) =>
      (item.slug && item.slug === slug) ||
      (item.id && `info-${item.id}` === slug) ||
      (item.title && post.title.includes(item.title)) ||
      (item.name && post.title.includes(item.name))
  );
  const sourceLink = matchedItem?.link || "https://www.data.go.kr";

  const { featured: featuredImgData, secondary: secondaryImgData } = await getPostPexelsImages(post);
  const featuredImage = featuredImgData.url;
  const secondaryImage = secondaryImgData.url;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goodkey-info.com";

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
      name: "우리 동네 이야기",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "우리 동네 이야기",
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
          <Link href="/blog/" className="hover:text-emerald-600">혜택 매거진</Link>
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

          {/* 대표 시각 이미지 (Pexels 고화질 맞춤형 배너) */}
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
              <a
                href={featuredImgData.photographerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-white/80 hover:text-white underline decoration-dotted"
              >
                Photo by {featuredImgData.photographer} (Pexels)
              </a>
            </div>
          </div>

          {/* [하이브리드 상단 Top UI] 대화형 모의 진단 및 계산 도구 */}
          <BenefitCalculatorWidget
            defaultDistrict={post.tags.find((t) => t.includes("구")) || "강북구"}
            category={post.category}
            postTitle={post.title}
          />

          {/* [하이브리드 중단 Middle] 마크다운 렌더링 본문 (중간에 2번째 사진 자동 삽입) */}
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
                        <a
                          href={secondaryImgData.photographerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-white/80 hover:text-white underline decoration-dotted"
                        >
                          Photo by {secondaryImgData.photographer} (Pexels)
                        </a>
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

          {/* [하이브리드 하단 Bottom - 1] 작성자 관점 실전 팁 & 주의사항 (Experience 기반) */}
          <section className="bg-emerald-50/70 border border-emerald-200/90 rounded-3xl p-6 sm:p-7 space-y-4 my-8">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                💡
              </span>
              <div>
                <h3 className="text-base font-black text-emerald-950">
                  현장 큐레이터의 실전 신청 팁 &amp; 주의사항 (Editor&apos;s Checklist)
                </h3>
                <p className="text-xs text-emerald-800">
                  행정복지센터 방문 전 꼭 챙겨야 할 3대 필수 사전 체크포인트
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-950 pt-1">
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1">
                <strong className="block text-emerald-900 font-bold">1. 방문 전 유선 확인</strong>
                <p className="text-slate-600 leading-relaxed">
                  자치구 예산 소진 여부 및 당일 담당자 근무 여부를 동 주민센터 복지팀에 전화로 먼저 확인하세요.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1">
                <strong className="block text-emerald-900 font-bold">2. 서류 유효기간 3개월</strong>
                <p className="text-slate-600 leading-relaxed">
                  주민등록등본 및 소득 증빙 서류는 접수일 기준 3개월 이내 발급본이어야 반려되지 않습니다.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-1">
                <strong className="block text-emerald-900 font-bold">3. 대리 신청 시 위임장</strong>
                <p className="text-slate-600 leading-relaxed">
                  가족이 대리 접수할 경우 위임인 도장 날인 위임장, 가족관계증명서, 대리인 신분증을 반드시 지참하세요.
                </p>
              </div>
            </div>
          </section>

          {/* [하이브리드 하단 Bottom - 2] 자주 묻는 질문 FAQ 아코디언 */}
          <PostFaqSection
            postTitle={post.title}
            category={post.category}
          />

          {/* 본문 하단 애드센스 광고 영역 */}
          <AdBanner className="my-8" />

          {/* 본문 하단 쿠팡 파트너스 배너 영역 */}
          <CoupangBanner className="my-6" />

          {/* [하이브리드 하단 Bottom - 3] 공식 외부 링크 & 내부 관련 문서 교차 링크 */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            {/* 공식 원문 출처 외부 링크 (Outbound Link) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🏛️</span> 공식 기관 원문 출처 (공식 공고 확인)
                </span>
                <p className="text-xs text-slate-500">
                  신청 자격 심사, 공고 원문 고시문 및 서식 다운로드는 공식 출처에서 가능합니다.
                </p>
              </div>
              <a
                href={sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap"
              >
                <span>정부 공식 출처 바로가기</span>
                <span className="text-xs">↗</span>
              </a>
            </div>

            {/* 신뢰도 및 내부 문서 교차 링크 (Inbound Cross-Links) */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-xs text-emerald-950 leading-relaxed space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                <span>📋</span> 정보 신뢰성 고지 및 편집 정책
              </p>
              <p>
                본 가이드는 대한민국 행정안전부 <strong>공공데이터포털(data.go.kr)</strong> 및 서울시 각 자치구 공식 고시 정보를 기반으로 전문 에디터가 체계적으로 분석·정리한 자료입니다. 보다 상세한 데이터 검증 정책은{" "}
                <Link href="/about/" className="font-bold underline text-emerald-800 hover:text-emerald-950">
                  서비스 소개 및 E-E-A-T 원칙
                </Link>
                에서 확인하실 수 있으며, 정보에 오류가 있거나 변경 사항이 있다면{" "}
                <Link href="/contact/" className="font-bold underline text-emerald-800 hover:text-emerald-950">
                  문의 및 제보 창구
                </Link>
                를 통해 알려주시면 24~48시간 이내에 반영됩니다.
              </p>
            </div>
          </div>

          {/* 하단 네비게이션 버튼 */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/blog/"
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
                  href={`/blog/${related.slug}/`}
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
