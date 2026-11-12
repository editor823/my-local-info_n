import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardGorillaHome from "@/components/CardGorillaHome";
import localInfoData from "../../public/data/local-info.json";
import { findPostSlug } from "@/lib/legacyRedirect";
import { buildDateKST } from "@/lib/dates";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "우리 동네 이야기 | 강북·도봉·노원 지원금·복지혜택 & 축제 정보" },
  description: "강북구, 도봉구, 노원구 등 서울 동북권 구민을 위한 지원금·복지 혜택과 지역 축제 정보를 공공데이터를 바탕으로 정리합니다.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  // [애드센스 재심사 대응] 실제 글이 있는 항목만 노출하고, 글(/blog/)로 바로 연결합니다.
  // 행사는 빌드 시점 기준으로 종료 여부를 표시합니다.
  const today = buildDateKST();
  const withPost = <T extends { id: string; slug?: string; endDate?: string }>(list: T[]) =>
    list
      .map((item) => ({
        ...item,
        postSlug: findPostSlug(item.id) || (item.slug ? findPostSlug(item.slug) : null),
        isEnded: Boolean(item.endDate && /^\d{4}-\d{2}-\d{2}$/.test(item.endDate) && item.endDate < today),
      }))
      .filter((item): item is T & { postSlug: string; isEnded: boolean } => Boolean(item.postSlug));
  const events = withPost(localInfoData.events || []);
  const benefits = withPost(localInfoData.benefits || []);
  const lastUpdated = localInfoData.lastUpdated;

  // 핵심 상위 하이라이트 4개만 홈 화면 스키마로 제공 (HTML 용량 80% 절감으로 모바일 FCP 대폭 단축)
  const eventSchemas = events.slice(0, 4).map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name || event.title,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location || "행사장",
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location?.includes("도봉") ? "도봉구" : event.location?.includes("노원") ? "노원구" : "강북구",
        addressRegion: "서울특별시",
        addressCountry: "KR",
      },
    },
    description: event.summary || event.title,
  }));

  const benefitSchemas = benefits.slice(0, 4).map((benefit) => ({
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: benefit.name || benefit.title,
    description: benefit.summary || benefit.name || benefit.title,
    provider: {
      "@type": "GovernmentOrganization",
      name: benefit.location || "서울특별시",
    },
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 구조화 데이터 (JSON-LD) */}
      {eventSchemas.map((schema, idx) => (
        <script
          key={`event-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {benefitSchemas.map((schema, idx) => (
        <script
          key={`benefit-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* 1. 카드고릴라 스타일 상단 글로벌 내비게이션 */}
      <Header />

      {/* 2. 메인 바디 (카드고릴라 테마 레이아웃) */}
      <main className="flex-1">
        <CardGorillaHome
          events={events}
          benefits={benefits}
          lastUpdated={lastUpdated}
        />
      </main>

      {/* 3. 하단 신뢰도 푸터 및 정책 메뉴 */}
      <Footer />
    </div>
  );
}
