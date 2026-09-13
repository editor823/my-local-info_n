import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CardGorillaHome from "@/components/CardGorillaHome";
import localInfoData from "../../public/data/local-info.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "우리 동네 이야기 | 강북·도봉·노원 지원금·복지혜택 비교 & 축제 순위",
  description: "강북구, 도봉구, 노원구 구민을 위한 맞춤형 지원금, 복지 혜택 비교 및 실시간 인기 순위와 축제 정보 아카이브!",
};

export default function Home() {
  const events = localInfoData.events;
  const benefits = localInfoData.benefits;
  const lastUpdated = localInfoData.lastUpdated;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
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
