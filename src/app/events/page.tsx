import Header from "@/components/Header";
import Footer from "@/components/Footer";
import localInfoData from "../../../public/data/local-info.json";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "축제 & 문화행사 소식 | 우리 동네 이야기",
  description: "강북구·도봉구·노원구에서 열리는 주요 축제, 문화 공연, 플리마켓, 가족 체험 행사 일정을 한눈에 모아보세요.",
};

export default function EventsPage() {
  const events = localInfoData.events || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <Header />

      {/* 1. 상단 배너: 딥 그린 & 에메랄드 */}
      <section className="bg-gradient-to-br from-[#062c1e] via-[#0d3d2a] to-[#124d38] text-white py-16 px-4 border-b border-emerald-900/50 shadow-md">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <span className="inline-block bg-emerald-500/20 text-emerald-200 text-xs font-bold px-3.5 py-1 rounded-full border border-emerald-400/30">
            FESTIVAL & CULTURE CALENDAR
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            강북 · 도봉 · 노원 축제 & 문화행사
          </h1>
          <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            북한산과 도봉산 자락, 화랑대 숲길에서 펼쳐지는 자연 친화적인 문화 축제와 공연 소식을 만나보세요.
          </p>
        </div>
      </section>

      {/* 2. 2열 반응형 카드 그리드 (기존 1열에서 2열 그리드로 차별화) */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 flex-1 space-y-8">
        <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-600">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>🎪</span> 진행 예정 축제 & 문화행사
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              총 {events.length}건
            </span>
          </h2>
          <span className="text-xs text-slate-400">기준: 2026년 최신 데이터</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const detailHref = event.slug ? `/blog/${event.slug}` : "#";
            return (
              <article
                key={event.id}
                className="bg-white rounded-2xl p-6 border border-emerald-100/80 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* 상단 날짜 및 뱃지 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                      {event.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      🗓️ {event.startDate} ~ {event.endDate}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                    <Link href={detailHref}>{event.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {event.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-semibold text-slate-400">장소</span>
                      <strong className="text-slate-800 truncate max-w-[220px]">{event.location}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-semibold text-slate-400">대상</span>
                      <span className="text-slate-700 truncate max-w-[220px]">{event.target}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {event.slug ? (
                      <Link
                        href={detailHref}
                        className="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm shadow-emerald-600/20"
                      >
                        축제 상세 가이드 &rarr;
                      </Link>
                    ) : (
                      <span className="flex-1 text-center py-2.5 bg-slate-100 text-slate-400 font-medium text-xs rounded-xl">
                        상세 준비중
                      </span>
                    )}
                    {event.link && event.link !== "#" && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs rounded-xl transition-all"
                      >
                        공식 웹사이트 ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
