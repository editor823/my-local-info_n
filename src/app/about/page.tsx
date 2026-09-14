import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "서비스 소개 | 우리 동네 이야기 (강북·도봉·노원)",
  description: "서울 강북구, 도봉구, 노원구 구민을 위한 생활 정보 제공 목적, 공공데이터포털 데이터 출처, 콘텐츠 큐레이션 및 검수 방식에 대해 안내합니다.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] flex flex-col font-sans">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            About Us
          </span>
          <h1 className="text-3xl font-extrabold text-[#0f172a] mt-3">
            서비스 소개
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            지역 주민을 위한 맞춤형 생활 정보, 문화 행사, 복지 지원금 혜택을 빠르고 알기 쉽게 전해드립니다.
          </p>
        </div>

        {/* 1. 사이트 운영 목적 */}
        <section className="space-y-3 text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
            <span>🎯</span> 사이트 운영 목적
          </h2>
          <p className="text-slate-600">
            본 사이트는 <strong>지역 주민을 위한 실생활 밀착형 정보 제공</strong>을 목적으로 운영됩니다. 각 지자체 및 정부 기관에서 제공하는 다양한 복지 혜택, 보조금, 생활 지원금, 그리고 다채로운 문화 행사와 축제 소식을 주민 여러분이 놓치지 않고 편리하게 누리실 수 있도록 돕습니다.
          </p>
        </section>

        {/* 2. 데이터 출처 */}
        <section className="space-y-3 text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
            <span>🏛️</span> 데이터 출처
          </h2>
          <p className="text-slate-600">
            본 서비스의 모든 정보는 대한민국 행정안전부 <strong>공공데이터포털(<a href="https://www.data.go.kr" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline font-semibold hover:text-emerald-700">data.go.kr</a>)</strong> 및 각 지방자치단체, 정부24 등 공공기관의 공식 개방 데이터를 바탕으로 수집·활용하고 있습니다.
          </p>
        </section>

        {/* 3. 콘텐츠 수집 및 큐레이션 방식 */}
        <section className="space-y-3 text-sm sm:text-base leading-relaxed bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
            <span>✍️</span> 전문 에디터 검수 및 콘텐츠 큐레이션 방식
          </h2>
          <p className="text-slate-600">
            복잡하고 어려운 공고문이나 방대한 지침을 주민분들의 눈높이에 맞추어 보다 쉽고 친절하게 전달하기 위해, 공공데이터 원본을 기반으로 <strong>핵심 혜택, 신청 대상 요건, 구비 서류, 신청 팁</strong>을 전문 에디터가 체계적으로 분석·정리하여 제공합니다.
          </p>
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs sm:text-sm text-emerald-900 space-y-1 mt-2">
            <p className="font-bold">💡 이용 안내 및 신뢰성 고지</p>
            <p>
              본 사이트의 모든 안내 글은 구민의 알 권리와 편의를 돕기 위한 정보 제공 목적이며, 기관의 정책 개정이나 예산 소진 등으로 세부 일정이나 지원 기준이 변동될 수 있습니다. 신청 전 반드시 각 글 하단에 첨부된 <strong>공식 원문 출처(정부24, 지자체 홈페이지) 링크</strong>를 통해 최신 공고를 확인하시기 바랍니다.
            </p>
          </div>
        </section>

        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>최종 수정일: 2026년 9월 13일</span>
          <Link href="/blog" className="text-emerald-600 font-bold hover:underline">
            혜택 매거진 읽기 →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
