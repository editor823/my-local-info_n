import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardGorillaHome from "@/components/CardGorillaHome";
import localInfoData from "../../public/data/local-info.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "우리 동네 이야기 | 강북·도봉·노원 지원금·복지혜택 비교 & 축제 순위",
  description: "강북구, 도봉구, 노원구 구민을 위한 맞춤형 지원금, 복지 혜택 비교 및 실시간 인기 순위와 축제 정보 아카이브!",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const events = localInfoData.events || [];
  const benefits = localInfoData.benefits || [];
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
