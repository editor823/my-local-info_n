import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "서비스 소개 및 편집 원칙",
  description: "서울 강북구·도봉구·노원구 주민을 위한 생활 혜택 정보 사이트 '우리 동네 이야기'의 운영 목적, 운영 주체, 글을 만드는 방식을 소개합니다.",
  alternates: {
    canonical: "/about/",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-12">
        {/* 1. 상단 인트로 헤더 */}
        <div className="border-b border-slate-200 pb-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              About Our Service & Editorial Policy
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            우리 동네 이야기 소개
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
            서울 동북권(강북구·도봉구·노원구) 구민의 더 나은 일상을 위해, 복잡한 정부·지자체 복지 공고와 문화 축제 소식을 가장 쉽고 명쾌하게 해설하는 <strong>지역 맞춤형 생활 복지 아카이브</strong>입니다.
          </p>
        </div>

        {/* 2. 핵심 운영 목적 및 고유 가치 (Unique Value Proposition) */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">운영 목적 및 독자 제공 가치</h2>
              <p className="text-xs text-slate-500">우리가 왜 이 서비스를 시작했고, 구민 여러분께 어떤 혜택을 드리는가</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-2xl">📑</span>
              <h3 className="font-bold text-slate-900 text-sm">3분 핵심 요약 카드</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                40페이지가 넘는 어려운 행정 고시문 대신, 지원 대상·지급 금액·신청 기한 3가지를 한눈에 확인하는 카드형 콘텐츠로 재구성합니다.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-2xl">🔍</span>
              <h3 className="font-bold text-slate-900 text-sm">내 지역 맞춤 필터링</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                강북구·도봉구·노원구 자치구별 전용 필터와 카테고리 태그로 내가 사는 동네의 혜택만 골라서 1초 만에 검색할 수 있습니다.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-2xl">🔗</span>
              <h3 className="font-bold text-slate-900 text-sm">공식 출처 원클릭 연결</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                정부24, 복지로, 구청 공식 신청 페이지 직통 링크를 전면에 제공하여 허위 정보나 피싱 위험 없는 안전한 접수를 지원합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 전문 큐레이션 분야 (Specialized Areas) */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              📚
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">다루는 전문 큐레이션 분야</h2>
              <p className="text-xs text-slate-500">실생활에 직접 와닿는 4대 핵심 테마에 집중합니다</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-1.5">
              <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                <span>🍼</span> 출산 · 육아 · 아동 복지
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                첫만남이용권, 부모급여, 다자녀 축하금, 한부모가정 자녀 학습비 및 유치원·어린이집 지원 정책 총정리
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50/40 space-y-1.5">
              <h3 className="font-bold text-teal-950 text-sm flex items-center gap-1.5">
                <span>🧓</span> 시니어 · 장애인 · 보훈 가족 케어
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                어르신 기초연금, 노인 일자리 사업, 장애인 보조기기 수리비 지원, 국가유공자 보훈예우수당 및 위문금 안내
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 space-y-1.5">
              <h3 className="font-bold text-sky-950 text-sm flex items-center gap-1.5">
                <span>🏠</span> 청년 · 신혼부부 주거 &amp; 안심보험
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                청년 월세 특별지원, 전세보증금 반환보증료 지원, 자치구 구민안전보험 보장 항목 및 실생활 생활비 환급 정책
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-1.5">
              <h3 className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                <span>🎪</span> 지역 축제 · 문화 공연 · 플리마켓
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                4·19 국민문화제, 도봉산 페스티벌, 노원 탈축제 &amp; 불빛정원 산책 등 주말에 가족과 함께 즐길 수 있는 문화 캘린더
              </p>
            </div>
          </div>
        </section>

        {/* 4. 글을 만드는 방식 (AI 사용과 검토 범위를 있는 그대로 공개) */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
              ⚖️
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">글을 만드는 방식</h2>
              <p className="text-xs text-slate-500">어디서 정보를 가져오고, 누가 어떻게 정리하는지 밝힙니다</p>
            </div>
          </div>

          <ol className="space-y-3 text-xs sm:text-sm text-slate-700 list-decimal pl-5">
            <li>
              <strong>출처:</strong> 행정안전부 공공데이터포털(data.go.kr)의 정부24 공공서비스 정보와 각 구청이 공개한 공고를 기본 자료로 씁니다.
            </li>
            <li>
              <strong>초안:</strong> 공공데이터 원문을 바탕으로 AI 도구가 읽기 쉬운 초안을 만듭니다. 작성자 경험담이나 현장 방문기를 지어내지 않습니다.
            </li>
            <li>
              <strong>검토:</strong> 운영자가 초안을 관할 기관 공고와 대조해 고친 뒤 게시합니다. 확인하지 못한 부분은 글에 그렇다고 적습니다.
            </li>
            <li>
              <strong>정정:</strong> 지원 조건은 예산과 조례에 따라 바뀝니다. 오류 제보를 받으면 확인 후 수정하며, 신청 전에는 반드시 공식 공고를 확인해 주세요.
            </li>
          </ol>
        </section>

        {/* 5. 운영 주체 및 투명성 정보 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🏢</span> 운영 주체 및 문의 창구
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-bold block">서비스 명칭</span>
              <strong className="text-slate-900 text-sm">우리 동네 이야기 (GoodKey-Info)</strong>
              <p className="text-slate-500 text-xs">서울 강북구 · 도봉구 · 노원구 생활 정보 독립 큐레이션 포털</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-bold block">운영</span>
              <strong className="text-slate-900 text-sm">우리 동네 이야기 운영자</strong>
              <p className="text-slate-500 text-xs">공공데이터 정리, 글 검토와 정정을 맡습니다</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-bold block">공식 문의 &amp; 제보 창구</span>
              <a href="mailto:tkdgus8231@gmail.com" className="text-emerald-600 font-extrabold hover:underline">
                tkdgus8231@gmail.com
              </a>
              <p className="text-slate-500 text-xs">메일을 확인하는 대로 답장드립니다</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-bold block">데이터 원천</span>
              <strong className="text-slate-900">행정안전부 공공데이터포털(data.go.kr)</strong>
              <p className="text-slate-500 text-xs">서울시 열린데이터광장 및 관할 자치구 고시자료</p>
            </div>
          </div>
        </section>

        {/* 6. 하단 바로가기 링크 */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>최종 수정: 2026년 11월 12일</span>
          <div className="flex items-center gap-4">
            <Link href="/contact/" className="text-slate-700 font-bold hover:text-emerald-600 transition-colors">
              문의/오류 제보 창구 →
            </Link>
            <Link href="/blog/" className="text-emerald-600 font-bold hover:underline">
              혜택 매거진 읽기 →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
