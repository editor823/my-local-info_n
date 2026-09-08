import localData from "../../public/data/local-info.json";
import Link from "next/link";

interface InfoItem {
  id: string;
  name: string;
  category: "행사" | "혜택";
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  url: string;
}

// 날짜를 보기 좋게 파싱하는 작은 헬퍼 함수
function parseDateParts(dateStr: string) {
  const parts = dateStr.split("-");
  return {
    month: parts[1] ? `${parseInt(parts[1], 10)}월` : "",
    day: parts[2] ? `${parseInt(parts[2], 10)}일` : "",
  };
}

// 2025년 이전 시작일이거나 상시 접수인 경우 친절하게 표시해주는 스마트 날짜 함수
function formatDisplayPeriod(startDate: string, endDate: string) {
  if (endDate === "상시" || endDate === "2026-12-31" || endDate === "연중") {
    return "연중 상시 신청 가능";
  }
  if (startDate === endDate) {
    return startDate;
  }
  return `${startDate} ~ ${endDate}`;
}

export default function Home() {
  // 최신순(시작일 또는 종료일 기준 내림차순) 정렬
  const festivals = (localData.items.filter(
    (item) => item.category === "행사"
  ) as InfoItem[]).sort((a, b) => b.startDate.localeCompare(a.startDate));
  
  const benefits = (localData.items.filter(
    (item) => item.category === "혜택"
  ) as InfoItem[]).sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#222222] flex flex-col justify-between font-sans">
      {/* 상단 네비게이션 바 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-extrabold text-slate-800 hover:text-sky-600 transition-colors flex items-center gap-1.5"
          >
            <span>📢</span>
            <span>우리 동네 소식통</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs sm:text-sm font-bold text-sky-600 border-b-2 border-sky-600 pb-0.5"
            >
              생활정보
            </Link>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors"
            >
              블로그
            </Link>
          </nav>
        </div>
      </header>

      {/* 1. 맨 위 큰 배너: 하늘색 배경의 네이버 블로그 스타일 상단 배너 */}
      <section className="bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd] to-[#93c5fd] border-b border-sky-300/60 py-12 sm:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-block px-3.5 py-1 bg-white/80 rounded-full text-xs font-bold text-sky-800 mb-3 shadow-xs">
            📍 경기도 성남시 공식 소식 & 복지 정보
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            우리 동네 소식통
          </h1>
          <p className="text-slate-700 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            성남 주민을 위한 이번 달 문화 축제와 알짜배기 정부·지자체 지원금 정보를 한곳에서 만나보세요.
          </p>
        </div>
      </section>

      {/* 메인 콘텐츠 영역 (블로그형 피드 레이아웃) */}
      <main className="max-w-4xl mx-auto px-4 py-10 w-full flex-1 space-y-12">
        
        {/* 2. 이번 달 행사/축제 섹션 (왼쪽: 큰 날짜, 오른쪽: 제목 및 장소) */}
        <section aria-labelledby="festivals-heading">
          <div className="flex items-center justify-between pb-3 border-b-2 border-sky-500 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-sky-600">■</span>
              <h2 id="festivals-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                이번 달 축제 & 행사
              </h2>
            </div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-md">
              총 {festivals.length}개의 행사
            </span>
          </div>

          <div className="space-y-4">
            {festivals.map((item) => {
              const start = parseDateParts(item.startDate);
              const end = parseDateParts(item.endDate);
              const isSameDate = item.startDate === item.endDate;

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between"
                >
                  {/* 왼쪽: 큰 날짜 배지 (네이버 캘린더 스타일) */}
                  <div className="flex sm:flex-col items-center justify-center bg-sky-50 text-sky-800 rounded-xl px-4 py-3 sm:w-28 sm:h-28 text-center border border-sky-200 shrink-0 w-full sm:w-auto">
                    <span className="text-xs font-bold text-sky-600 sm:mb-0.5 mr-2 sm:mr-0">
                      {start.month}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-sky-900 tracking-tight">
                      {start.day}
                    </span>
                    {!isSameDate && (
                      <span className="text-[11px] font-medium text-sky-700 ml-2 sm:ml-0 sm:mt-1 bg-sky-100 px-1.5 py-0.5 rounded">
                        ~ {end.month !== start.month ? end.month + " " : ""}{end.day}
                      </span>
                    )}
                  </div>

                  {/* 오른쪽: 제목과 장소, 상세 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-sky-700 bg-sky-100/60 px-2 py-0.5 rounded">
                        축제/문화
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.startDate} ~ {item.endDate}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 hover:text-sky-600 transition-colors">
                      <Link href={`/blog/${item.id}`}>
                        {item.name}
                      </Link>
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">📍 장소:</span>
                        <span className="text-slate-700">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">👥 대상:</span>
                        <span>{item.target}</span>
                      </div>
                    </div>
                  </div>

                  {/* 상세 버튼 */}
                  <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                    <Link
                      href={`/blog/${item.id}`}
                      className="block text-center sm:inline-block px-4 py-2.5 bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      상세보기 &gt;
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 3. 지원금/혜택 정보 섹션 (초록색 테두리 + 대상자 강조) */}
        <section aria-labelledby="benefits-heading">
          <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-500 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-emerald-600">■</span>
              <h2 id="benefits-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                지원금 & 시민 혜택 정보
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
              총 {benefits.length}개의 혜택
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {benefits.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl border-2 border-emerald-400/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded">
                      복지·지원금
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50/60 px-2 py-0.5 rounded border border-emerald-100">
                      ● {formatDisplayPeriod(item.startDate, item.endDate)}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 hover:text-emerald-700 transition-colors">
                    <Link href={`/blog/${item.id}`}>
                      {item.name}
                    </Link>
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* 대상자가 확 눈에 띄는 하이라이트 박스 */}
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5 mb-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shrink-0">
                        지원 대상
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-950 leading-snug">
                        {item.target}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 pt-1.5 border-t border-emerald-100 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700 shrink-0">신청처:</span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/blog/${item.id}`}
                  className="w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-xs"
                >
                  신청 방법 및 상세 내용 확인 &gt;
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* 4. 네이버 블로그 스타일의 깔끔한 하단 푸터 */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-700">우리 동네 소식통 | 성남시 생활 정보</p>
            <p className="mt-1 text-slate-400">데이터 제공: {localData.source}</p>
          </div>
          <div className="text-slate-400 sm:text-right">
            <p>최근 업데이트: {localData.updatedAt}</p>
            <p className="mt-0.5">© 2026 my-local-info_n. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
