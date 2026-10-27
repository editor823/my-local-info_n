import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import BenefitCalculatorWidget from "@/components/BenefitCalculatorWidget";
import PostFaqSection from "@/components/PostFaqSection";
import ArticleTocAndShare from "@/components/ArticleTocAndShare";
import InteractiveChecklist from "@/components/InteractiveChecklist";
import { getPostPexelsImages } from "@/lib/pexels";
import {
  BenefitItem,
  getBenefitHighlights,
  getBenefitArticleData,
  slugifyHeading,
} from "@/lib/benefitArticleGenerator";
import localInfoData from "../../../../public/data/local-info.json";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 혜택 데이터 목록 검색 헬퍼 (id 또는 slug로 일치하는 항목 검색)
function findBenefit(idOrSlug: string): BenefitItem | null {
  const allItems: BenefitItem[] = [
    ...((localInfoData.benefits || []) as BenefitItem[]),
    ...((localInfoData.events || []).map((e) => ({
      ...e,
      type: "event" as const,
    })) as BenefitItem[]),
  ];

  return (
    allItems.find(
      (item) =>
        item.id === idOrSlug ||
        item.slug === idOrSlug ||
        decodeURIComponent(idOrSlug) === item.id ||
        decodeURIComponent(idOrSlug) === item.slug
    ) || null
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const benefit = findBenefit(id);

  if (!benefit) {
    return {
      title: "혜택 정보를 찾을 수 없습니다 | 우리 동네 이야기",
      description: "요청하신 자치구 복지 및 행사 정보를 찾을 수 없습니다.",
    };
  }

  const { district, amountBadge } = getBenefitHighlights(benefit);
  const title = `${benefit.name || benefit.title} [${district}] ${amountBadge} | 우리 동네 이야기`;
  const description =
    benefit.summary ||
    `${district} 주민을 위한 2026년 맞춤형 복지 혜택 및 신청 자격 상세 안내`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goodkey-info.com";

  return {
    title,
    description,
    alternates: {
      canonical: `/benefit/${benefit.id}/`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/benefit/${benefit.id}/`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateStaticParams() {
  const allItems = [
    ...(localInfoData.benefits || []),
    ...(localInfoData.events || []),
  ];

  const params: { id: string }[] = [];
  for (const item of allItems) {
    if (item.id) {
      params.push({ id: item.id });
    }
    if (item.slug && item.slug !== item.id) {
      params.push({ id: item.slug });
    }
  }

  return params;
}

export default async function BenefitDetailPage({ params }: PageProps) {
  const { id } = await params;
  const benefit = findBenefit(id);

  if (!benefit) {
    notFound();
  }

  const { district, amountBadge, period, targetSummary } =
    getBenefitHighlights(benefit);
  const { markdown, headings, post } = getBenefitArticleData(benefit);
  const mainTitle = benefit.name || benefit.title || "구민 복지 혜택";

  // Pexels 고화질 큐레이션 이미지 매칭
  const imgData = await getPostPexelsImages({
    title: mainTitle,
    category: benefit.category || "혜택",
    image: post?.image,
  });
  const featuredImage = imgData.featured.url;
  const secondaryImage = imgData.secondary.url;

  // 관련 자치구 다른 혜택 추천 3개 추출 (현재 아이템 제외)
  const allBenefits = (localInfoData.benefits || []) as BenefitItem[];
  const sameDistrictBenefits = allBenefits
    .filter(
      (b) =>
        b.id !== benefit.id &&
        (b.location.includes(district) || district === "서울시")
    )
    .slice(0, 3);

  // 만약 같은 자치구 글이 부족하면 전체에서 보충
  const relatedBenefits =
    sameDistrictBenefits.length >= 3
      ? sameDistrictBenefits
      : [
          ...sameDistrictBenefits,
          ...allBenefits
            .filter(
              (b) =>
                b.id !== benefit.id &&
                !sameDistrictBenefits.some((sb) => sb.id === b.id)
            )
            .slice(0, 3 - sameDistrictBenefits.length),
        ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://goodkey-info.com";

  // Schema.org 구조화 데이터
  const governmentServiceSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: mainTitle,
    description: benefit.summary,
    provider: {
      "@type": "GovernmentOrganization",
      name: benefit.location,
    },
    serviceOperator: {
      "@type": "GovernmentOrganization",
      name: benefit.location,
    },
    url: `${siteUrl}/benefit/${benefit.id}/`,
  };

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
        name: `${district} 생활 혜택`,
        item: `${siteUrl}/#content-list`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: mainTitle,
        item: `${siteUrl}/benefit/${benefit.id}/`,
      },
    ],
  };

  // 마크다운 커스텀 컴포넌트 (H2, H3에 고유 id 부여하여 목차 스크롤 연동)
  const markdownComponents = {
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = String(children).replace(/[*_`]/g, "");
      const anchorId = slugifyHeading(text);
      return (
        <h2
          id={anchorId}
          className="text-xl sm:text-2xl font-black text-slate-900 mt-10 mb-4 pt-4 border-t border-slate-100 flex items-center gap-2 scroll-mt-24"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = String(children).replace(/[*_`]/g, "");
      const anchorId = slugifyHeading(text);
      return (
        <h3
          id={anchorId}
          className="text-base sm:text-lg font-bold text-emerald-950 mt-6 mb-3 scroll-mt-24"
          {...props}
        >
          {children}
        </h3>
      );
    },
    table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="w-full max-w-full overflow-x-auto my-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <table className="min-w-full text-xs sm:text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
      <pre
        className="max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm text-slate-800 my-4"
        {...props}
      >
        {children}
      </pre>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed my-3 break-words" {...props}>
        {children}
      </p>
    ),
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 구조화 데이터 (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 1. 글로벌 헤더 */}
      <Header />

      {/* 2. 상단 브레드크럼(Breadcrumb) 네비게이션 */}
      <nav aria-label="브레드크럼" className="bg-white border-b border-emerald-100/60 py-3 px-4 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-600 transition-colors">홈</Link>
          <span>&gt;</span>
          <Link href="/blog/" className="hover:text-emerald-600 transition-colors">혜택 매거진</Link>
          <span>&gt;</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {district}
          </span>
          <span>&gt;</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{mainTitle}</span>
        </div>
      </nav>

      {/* 3. 메인 상세 아티클 바디 */}
      <main className="max-w-4xl w-full mx-auto px-3 sm:px-4 py-6 sm:py-10 flex-1 space-y-10 min-w-0 overflow-hidden">
        <article className="bg-white rounded-3xl p-5 sm:p-10 border border-emerald-100/90 shadow-sm space-y-8 max-w-full overflow-hidden break-words">
          
          {/* 머리글 정보 및 뱃지 영역 */}
          <header className="space-y-4 pb-6 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="bg-emerald-700 text-white px-3 py-1 rounded-full shadow-2xs">
                {district} 지원 사업
              </span>
              <span className="bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full">
                {benefit.category || "혜택"}
              </span>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                <span>⚡</span> {amountBadge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {mainTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {benefit.summary}
            </p>
          </header>

          {/* [핵심 요약 상단 3대 박스: 지원 대상 요약, 신청 기간, 지급 금액] */}
          <section className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border-2 border-emerald-200/80 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h2 className="text-base sm:text-lg font-black text-emerald-950">
                  핵심 수혜 정보 요약 카드
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                2026 최신 공고 기준
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* 박스 1: 지원 대상 */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                    <span>🎯</span> 지원 대상 요약
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {targetSummary}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  * 관할 자치구 주민등록 기준
                </span>
              </div>

              {/* 박스 2: 신청 기간 */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-teal-100 shadow-2xs space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 mb-1">
                    <span>📅</span> 신청 접수 기간
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {period}
                  </p>
                </div>
                <span className="text-[11px] text-teal-600 font-bold mt-2 block">
                  예산 소진 시 조기 마감
                </span>
              </div>

              {/* 박스 3: 지급 금액 뱃지 */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                    <span>💰</span> 지급 금액 / 혜택 형태
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-emerald-700 leading-snug">
                    {amountBadge}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  현금 수당 / 바우처 / 실비 지원
                </span>
              </div>
            </div>

            {/* 공식 원본 신청 링크 버튼 */}
            {benefit.link && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-100">
                <span className="text-xs text-emerald-900 font-medium">
                  공식 출처: 대한민국 정부24(gov.kr) 또는 자치구 공식 고시
                </span>
                <a
                  href={benefit.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-700/20"
                >
                  <span>공식 신청 창구 바로가기</span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </section>

          {/* 대표 시각 이미지 (Pexels) */}
          <figure className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-xs border border-slate-100 bg-slate-100">
            <img
              src={featuredImage}
              alt={`${mainTitle} 혜택 안내 이미지`}
              className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-medium">
              <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px]">
                🌿 {district} 생활 복지 아카이브
              </span>
              <a
                href={imgData.featured.photographerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-white/80 hover:text-white underline decoration-dotted"
              >
                Photo by {imgData.featured.photographer} (Pexels)
              </a>
            </div>
          </figure>

          {/* 목차 (Table of Contents) & 공유 컴포넌트 */}
          <ArticleTocAndShare
            title={mainTitle}
            headings={headings}
          />

          {/* 인터랙티브 신청 자격 자가진단 체크리스트 */}
          <InteractiveChecklist
            district={district}
            benefitTitle={mainTitle}
          />

          {/* 대화형 모의 진단 및 혜택 계산기 위젯 */}
          <BenefitCalculatorWidget
            defaultDistrict={district}
            category={benefit.category || "혜택"}
            postTitle={mainTitle}
          />

          {/* 1,500~2,000자 심층 마크다운 본문 (중간 서브 이미지 분할 삽입) */}
          {(() => {
            const sections = markdown.split("\n## ");
            if (sections.length > 2) {
              const midIndex = Math.floor(sections.length / 2);
              const part1 = sections.slice(0, midIndex).join("\n## ");
              const part2 = "## " + sections.slice(midIndex).join("\n## ");

              return (
                <>
                  <div className="article-content max-w-none overflow-hidden break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {part1}
                    </ReactMarkdown>
                  </div>

                  {/* 본문 중간 2번째 고화질 관련 이미지 */}
                  <figure className="my-8 space-y-2">
                    <div className="relative w-full h-60 sm:h-72 md:h-80 rounded-3xl overflow-hidden shadow-xs border border-slate-100 bg-slate-100">
                      <img
                        src={secondaryImage}
                        alt={`${benefit.name || benefit.title} 상세 안내 서브 이미지`}
                        className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-medium">
                        <span className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[11px]">
                          💡 핵심 복지 신청 노하우
                        </span>
                        <a
                          href={imgData.secondary.photographerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-white/80 hover:text-white underline decoration-dotted"
                        >
                          Photo by {imgData.secondary.photographer} (Pexels)
                        </a>
                      </div>
                    </div>
                  </figure>

                  <div className="article-content max-w-none overflow-hidden break-words">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {part2}
                    </ReactMarkdown>
                  </div>
                </>
              );
            }

            return (
              <div className="article-content max-w-none overflow-hidden break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {markdown}
                </ReactMarkdown>
              </div>
            );
          })()}

          {/* 에디터 체크포인트 박스 (행정복지센터 방문 전 유의사항) */}
          <section className="bg-emerald-50/70 border border-emerald-200/90 rounded-3xl p-6 sm:p-7 space-y-4 my-8">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
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

          {/* 자주 묻는 질문 FAQ 아코디언 */}
          <PostFaqSection
            postTitle={mainTitle}
            category={benefit.category || "혜택"}
          />

          {/* 광고 배너 영역 */}
          <AdBanner className="my-8" />
          <CoupangBanner className="my-6" />

          {/* 공식 외부 링크 및 정부24 바로가기 박스 */}
          <div className="p-6 bg-slate-50 border border-slate-200/90 rounded-3xl space-y-3">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>🏛️</span> 공식 출처 원천 고지 및 신청 접수 링크
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              본 안내문은 대한민국 행정안전부 공공데이터포털(data.go.kr) 및 {benefit.location}의 공식 공개 자료를 바탕으로 주민의 편의를 위해 작성되었습니다. 세부 사항 및 서식 다운로드는 아래 공식 창구에서 확인하실 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={benefit.link || "https://www.gov.kr"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                <span>정부24 공식 신청 페이지</span>
                <span>↗</span>
              </a>
              <a
                href="https://www.bokjiro.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs px-4 py-2 rounded-xl border border-slate-200 transition-all"
              >
                <span>복지로 포털 바로가기</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </article>

        {/* [본문 하단: 관련 자치구 다른 혜택 추천 카드 3개] */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {district} 구민이 함께 신청하는 추천 혜택 3선
              </h2>
            </div>
            <Link
              href="/#content-list"
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              전체 혜택 보기 &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedBenefits.map((item, idx) => {
              const relHigh = getBenefitHighlights(item);
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="bg-white rounded-2xl p-5 border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {relHigh.district}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {item.endDate === "상시" ? "상시 접수" : item.endDate}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      <Link href={`/benefit/${item.id}/`}>
                        {item.name || item.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700">
                      {relHigh.amountBadge}
                    </span>
                    <Link
                      href={`/benefit/${item.id}/`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>자세히 보기</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 4. 글로벌 푸터 */}
      <Footer />
    </div>
  );
}
