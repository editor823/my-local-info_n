import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "서비스 소개 및 E-E-A-T 편집 원칙 | 우리 동네 이야기 (강북·도봉·노원)",
  description: "서울 강북구·도봉구·노원구 주민을 위한 생활 혜택 정보 큐레이션 포털 '우리 동네 이야기'의 운영 목적, 운영 주체, E-E-A-T 기반 데이터 검증 원칙 및 고유 가치를 소개합니다.",
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
            서울 동북권(강북구·도봉구·노원구) 115만 구민의 더 나은 일상을 위해, 복잡한 정부·지자체 복지 공고와 문화 축제 소식을 가장 쉽고 명쾌하게 해설하는 <strong>지역 맞춤형 생활 복지 아카이브</strong>입니다.
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

        {/* 4. 데이터 검증 방식 및 E-E-A-T 원칙 체계 */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
              ⚖️
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">E-E-A-T 기반 데이터 검증 및 신뢰 체계</h2>
              <p className="text-xs text-slate-500">구글의 고품질 콘텐츠 평가 기준(경험, 전문성, 권위, 신뢰)을 충실히 따릅니다</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <strong className="text-slate-900 flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">E</span>
                Experience (경험 기반의 실전 가이드)
              </strong>
              <p className="text-slate-600 leading-relaxed pl-8">
                단순 텍스트 복사가 아닌, 실제 관할 동 주민센터를 방문하여 신청할 때 필요한 구비서류 체크리스트와 놓치기 쉬운 필수 유의사항(소득 인정액 계산 팁 등)을 실무 경험에 입각해 설명합니다.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <strong className="text-slate-900 flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs flex items-center justify-center font-bold">E</span>
                Expertise (공식 데이터 분석 전문성)
              </strong>
              <p className="text-slate-600 leading-relaxed pl-8">
                대한민국 행정안전부 <strong>공공데이터포털(data.go.kr)</strong>의 공식 오픈 API 및 강북구청, 도봉구청, 노원구청의 최신 고시·공고 원본 문서를 바탕으로 전담 에디터가 항목을 정밀 대조·분석합니다.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <strong className="text-slate-900 flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-bold">A</span>
                Authoritativeness (투명한 권위성 및 원천 링크)
              </strong>
              <p className="text-slate-600 leading-relaxed pl-8">
                게재된 모든 글의 하단에 정부 공식 출처(정부24, 지자체 공식 웹사이트 링크)를 명시하여 독자가 언제든지 1차 원문을 재확인할 수 있도록 완전한 투명성을 보장합니다.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <strong className="text-slate-900 flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">T</span>
                Trustworthiness (정기 검수 및 책임 있는 정정)
              </strong>
              <p className="text-slate-600 leading-relaxed pl-8">
                예산 조기 소진이나 조례 개정 등으로 변동 사항이 발생할 경우, 주기적인 데이터 점검과 독자 제보 시스템을 통해 <strong>24~48시간 이내에 최신 상태로 정정·업데이트</strong>합니다.
              </p>
            </div>
          </div>
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
              <span className="text-xs text-slate-400 font-bold block">에디토리얼 &amp; 운영팀</span>
              <strong className="text-slate-900 text-sm">우리 동네 이야기 콘텐츠 랩</strong>
              <p className="text-slate-500 text-xs">공공데이터 정제 및 지역 생활 복지 가이드 기획·검수팀</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-bold block">공식 문의 &amp; 제보 창구</span>
              <a href="mailto:tkdgus8231@gmail.com" className="text-emerald-600 font-extrabold hover:underline">
                tkdgus8231@gmail.com
              </a>
              <p className="text-slate-500 text-xs">운영시간: 평일 10:00 ~ 18:00 (회신: 24~48시간 이내)</p>
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
          <span>최종 정책 업데이트: 2026년 9월 30일</span>
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
