"use client";

import { useState } from "react";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";

interface InfoItem {
  id: string;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
  slug?: string;
  name?: string;
}

interface Props {
  events: InfoItem[];
  benefits: InfoItem[];
  lastUpdated: string;
}

export default function CardGorillaHome({ events, benefits, lastUpdated }: Props) {
  const [activeDistrict, setActiveDistrict] = useState<"all" | "강북구" | "도봉구" | "노원구">("all");
  const [activeTab, setActiveTab] = useState<"all" | "benefit" | "event">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const allItems = [
    ...benefits.map((b) => ({ ...b, type: "benefit" as const })),
    ...events.map((e) => ({ ...e, type: "event" as const })),
  ];

  const term = searchTerm.trim().toLowerCase();

  // 구 구분 헬퍼
  const getDistrictBadge = (loc: string) => {
    if (loc.includes("강북")) return { name: "강북구", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    if (loc.includes("도봉")) return { name: "도봉구", color: "bg-teal-100 text-teal-800 border-teal-200" };
    if (loc.includes("노원")) return { name: "노원구", color: "bg-green-100 text-green-800 border-green-200" };
    return { name: "서울시", color: "bg-slate-100 text-slate-700 border-slate-200" };
  };

  // 선택된 자치구에 맞는 상단 TOP 4 하이라이트 아이템
  const districtFilteredBenefits = benefits.filter((item) => {
    if (activeDistrict === "all") return true;
    const text = `${item.location || ""} ${item.target || ""} ${item.title || ""}`;
    return text.includes(activeDistrict);
  });
  const topHighlights = districtFilteredBenefits.slice(0, 4);

  // 본문 리스트 필터링
  const filteredItems = allItems.filter((item) => {
    // 1. 구 필터
    if (activeDistrict !== "all") {
      const text = `${item.location || ""} ${item.target || ""} ${item.title || ""}`;
      if (!text.includes(activeDistrict)) return false;
    }

    // 2. 탭 필터 (혜택 / 축제)
    if (activeTab === "benefit" && item.type !== "benefit") return false;
    if (activeTab === "event" && item.type !== "event") return false;

    // 3. 검색어 필터
    if (!term) return true;
    const combined = `${item.title || ""} ${item.name || ""} ${item.summary || ""} ${item.target || ""} ${item.location || ""}`.toLowerCase();
    return combined.includes(term);
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  };

  const handleTagClick = (tag: string) => {
    if (tag === "강북구" || tag === "도봉구" || tag === "노원구") {
      setActiveDistrict(tag);
      setSearchTerm("");
    } else {
      setSearchTerm(tag);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. 히어로 섹션: 포레스트 그린 & 틸 그라디언트 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#062c1e] via-[#0d3d2a] to-[#124d38] text-white py-14 sm:py-20 px-4 sm:px-6 shadow-xl">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-[140px]"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-teal-300 rounded-full blur-[140px]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold px-4 py-1.5 rounded-full shadow-inner backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>2026 강북 · 도봉 · 노원 구민을 위한 실시간 생활 혜택 차트</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight sm:leading-snug">
            <span>우리 동네에서 누리는</span>
            <span className="block mt-2 sm:mt-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300">
              알짜 복지 & 축제 혜택
            </span>
          </h1>

          <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            강북구·도봉구·노원구 주민을 위한 맞춤형 장학금, 출산지원금, 안심보험부터 지역 축제까지! <br className="hidden sm:inline" />
            열린 공공데이터를 기반으로 실시간 알찬 혜택을 큐레이션해 드립니다.
          </p>

          {/* 통합 검색창 */}
          <div className="max-w-2xl mx-auto pt-2">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 sm:p-2.5 border border-emerald-100"
            >
              <span className="text-xl sm:text-2xl px-3 text-emerald-600">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="관심 혜택, 행사, 대상(강북구, 도봉구, 노원구, 장학금, 안심보험) 검색"
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold cursor-pointer"
                >
                  지우기
                </button>
              )}
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors shrink-0 shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                검색
              </button>
            </form>

            {/* 빠른 추천 태그 버튼 */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-emerald-200/90">
              <span className="font-bold text-emerald-300">지역 / 혜택 키워드:</span>
              {["강북구", "도봉구", "노원구", "장학금", "출산지원금", "지역사랑상품권", "안심보험"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="bg-emerald-950/60 hover:bg-emerald-800/70 hover:border-emerald-400 text-emerald-100 px-3 py-1 rounded-lg border border-emerald-800/70 transition-all cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 자치구별 원클릭 퀵 브라우징 바 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-100/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-extrabold text-sm text-slate-800">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>관심 자치구 선택:</span>
            {activeDistrict !== "all" && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold ml-1">
                현재: {activeDistrict}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "전체 3개구 (강북·도봉·노원)" },
              { id: "강북구", label: "🌳 강북구" },
              { id: "도봉구", label: "⛰️ 도봉구" },
              { id: "노원구", label: "🌸 노원구" },
            ].map((dist) => {
              const isSelected = activeDistrict === dist.id;
              return (
                <button
                  key={dist.id}
                  type="button"
                  onClick={() => setActiveDistrict(dist.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105 ring-2 ring-emerald-500 ring-offset-2"
                      : "bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700"
                  }`}
                >
                  <span>{dist.label}</span>
                  {isSelected && <span className="text-[10px]">✔</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 선택된 자치구 주목도 TOP 4 카드 덱 */}
      <section id="rankings" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-emerald-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-wider">
              <span>FEATURED HIGHLIGHTS</span>
              <span className="w-1 h-1 rounded-full bg-emerald-300"></span>
              <span className="text-slate-400 font-normal">기준: {lastUpdated}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
              🌿 {activeDistrict === "all" ? "강북·도봉·노원" : activeDistrict} 구민 추천 TOP 혜택
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {activeDistrict === "all" ? "3개 자치구" : activeDistrict} 주민들이 가장 많이 조회하고 혜택을 받는 핵심 복지 지원입니다.
          </p>
        </div>

        {/* 4열 와이드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topHighlights.map((item, idx) => {
            const detailHref = item.slug ? `/blog/${item.slug}` : "/blog";
            const districtInfo = getDistrictBadge(item.location);
            const rankBadges = [
              "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white",
              "bg-gradient-to-tr from-teal-600 to-emerald-400 text-white",
              "bg-gradient-to-tr from-green-600 to-emerald-400 text-white",
              "bg-gradient-to-tr from-emerald-800 to-teal-600 text-white",
            ];

            return (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* 상단 랭킹 및 지역 배지 */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-8 h-8 rounded-xl ${rankBadges[idx % 4]} font-black text-sm flex items-center justify-center shadow-md`}
                    >
                      0{idx + 1}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${districtInfo.color}`}>
                      {districtInfo.name}
                    </span>
                  </div>

                  {/* 제목 및 내용 */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug mb-2">
                    <Link href={detailHref}>{item.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {item.summary}
                  </p>
                </div>

                {/* 하단 세부 정보 및 버튼 */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>접수/소관</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[120px]">{item.location}</span>
                    </div>
                  </div>

                  <Link
                    href={detailHref}
                    className="block text-center w-full py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs rounded-xl transition-all"
                  >
                    상세 혜택 분석 보기 →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 행사 섹션과 혜택 섹션 사이 애드센스 광고 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AdBanner className="my-6" />
      </div>

      {/* 4. 메인 콘텐츠 리스트 (2열 카드 그리드 레이아웃) */}
      <section id="content-list" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        {/* 필터 탭 바 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📋</span> {activeDistrict === "all" ? "강북·도봉·노원 전체" : activeDistrict} 생활 정보 목록
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                총 {filteredItems.length}건
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              선택한 {activeDistrict === "all" ? "3개 자치구" : activeDistrict}의 복지 지원 및 축제·행사 데이터입니다.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl font-bold text-xs shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              전체 ({filteredItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("benefit")}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "benefit"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              복지 & 혜택
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("event")}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === "event"
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              축제 & 행사
            </button>
          </div>
        </div>

        {/* 2열 카드 그리드 */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-emerald-100 p-12 text-center text-slate-400 space-y-3 shadow-sm">
            <span className="text-4xl">🔎</span>
            <p className="font-bold text-slate-700">선택하신 조건에 해당하는 정보가 없습니다.</p>
            <p className="text-xs">다른 검색어나 지역 필터를 변경해 보세요.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setActiveDistrict("all");
                setActiveTab("all");
              }}
              className="inline-block mt-2 bg-emerald-50 text-emerald-600 font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              전체 조건 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredItems.map((item, index) => {
              const detailHref = item.slug ? `/blog/${item.slug}` : "/blog";
              const isEvent = item.type === "event";
              const districtInfo = getDistrictBadge(item.location);

              return (
                <article
                  key={`${item.id}-${index}`}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-100/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* 상단 뱃지 라인 */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${districtInfo.color}`}>
                          {districtInfo.name}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                            isEvent
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {item.endDate === "상시" ? "상시 운영" : `${item.startDate} ~ ${item.endDate}`}
                      </span>
                    </div>

                    {/* 제목 */}
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                      <Link href={detailHref}>{item.title}</Link>
                    </h3>

                    {/* 요약 */}
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* 하단 대상 및 액션 버튼 */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-slate-400 block font-medium">지원 대상</span>
                      <p className="text-xs font-semibold text-slate-700 truncate">
                        {item.target}
                      </p>
                    </div>

                    <Link
                      href={detailHref}
                      className="inline-flex items-center gap-1 bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shrink-0"
                    >
                      <span>자세히 보기</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
