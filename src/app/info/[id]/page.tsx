import localData from "../../../../public/data/local-info.json";
import Link from "next/link";
import { notFound } from "next/navigation";

// 정적 배포(output: "export")를 위해 Next.js에게 어떤 상세 페이지들이 있는지 미리 알려주는 함수
export async function generateStaticParams() {
  return localData.items.map((item) => ({
    id: item.id,
  }));
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const item = localData.items.find((entry) => entry.id === resolvedParams.id);

  if (!item) {
    notFound();
  }

  const isFestival = item.category === "행사";

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#222222] flex flex-col justify-between font-sans">
      {/* 상단 얇은 네비게이션 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors"
          >
            <span>←</span>
            <span>우리 동네 소식통 홈으로</span>
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-600">
            성남시 생활정보
          </span>
        </div>
      </header>

      {/* 메인 상세 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full flex-1">
        <article className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          {/* 상세 페이지 헤더 영역 (카테고리에 맞춘 테마 색상) */}
          <div
            className={`p-6 sm:p-10 border-b ${
              isFestival
                ? "bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-sky-100"
                : "bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-emerald-100"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                  isFestival
                    ? "bg-sky-600 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {isFestival ? "🌸 축제 & 행사" : "💰 지원금 & 혜택"}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200/60">
                {isFestival ? "진행 행사" : "상시 혜택 안내"}
              </span>
            </div>

            {/* 행사/혜택 이름 (크게) */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug mb-4">
              {item.name}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {item.summary}
            </p>
          </div>

          {/* 핵심 정보 요약 테이블 박스 */}
          <div className="p-6 sm:p-10 space-y-8">
            <section aria-labelledby="summary-info">
              <h2 id="summary-info" className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className={isFestival ? "text-sky-600" : "text-emerald-600"}>■</span>
                핵심 안내 요약
              </h2>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {/* 1. 기간 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <dt className="text-xs font-semibold text-slate-400 mb-1">
                    {isFestival ? "행사 기간" : "신청 / 접수 기간"}
                  </dt>
                  <dd className="font-extrabold text-slate-800 text-base">
                    {item.startDate === item.endDate
                      ? item.startDate
                      : `${item.startDate} ~ ${item.endDate}`}
                  </dd>
                </div>

                {/* 2. 장소/신청처 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <dt className="text-xs font-semibold text-slate-400 mb-1">
                    {isFestival ? "행사 장소" : "신청처 / 접수 장소"}
                  </dt>
                  <dd className="font-bold text-slate-800 break-keep">
                    {item.location}
                  </dd>
                </div>

                {/* 3. 대상 (2칸 차지) */}
                <div
                  className={`sm:col-span-2 p-4 rounded-xl border ${
                    isFestival
                      ? "bg-sky-50/50 border-sky-100"
                      : "bg-emerald-50/70 border-emerald-200"
                  }`}
                >
                  <dt
                    className={`text-xs font-bold mb-1 ${
                      isFestival ? "text-sky-800" : "text-emerald-800"
                    }`}
                  >
                    지원 및 참여 대상
                  </dt>
                  <dd className="font-extrabold text-slate-900 text-base sm:text-lg break-keep">
                    {item.target}
                  </dd>
                </div>
              </dl>
            </section>

            {/* 상세 설명 전문 */}
            <section aria-labelledby="detail-desc" className="space-y-4">
              <h2 id="detail-desc" className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <span className={isFestival ? "text-sky-600" : "text-emerald-600"}>■</span>
                상세 안내 내용
              </h2>

              <div className="text-slate-700 leading-loose text-sm sm:text-base space-y-4 bg-slate-50/40 p-5 sm:p-6 rounded-xl border border-slate-100">
                <p>{item.summary}</p>
                <p className="text-xs sm:text-sm text-slate-500 bg-white p-4 rounded-lg border border-slate-200/80">
                  💡 <strong>안내 사항:</strong> 세부 일정이나 지원 자격 서류 제출 등은 주최 기관 사정에 따라 변경될 수 있으니, 아래 원본 사이트 링크를 통해 최종 공고를 꼭 확인해 주시기 바랍니다.
                </p>
              </div>
            </section>

            {/* 하단 버튼 영역 */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* 목록으로 돌아가기 버튼 */}
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-sm text-center transition-colors"
              >
                ← 목록으로 돌아가기
              </Link>

              {/* 원본 사이트 링크 버튼 */}
              <a
                href={item.url}
                target={item.url === "#" ? "_self" : "_blank"}
                rel="noreferrer"
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-extrabold text-sm sm:text-base text-center shadow-md transition-all flex items-center justify-center gap-2 ${
                  isFestival
                    ? "bg-sky-600 hover:bg-sky-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                <span>공식 원본 사이트 자세히 보기</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </article>
      </main>

      {/* 하단 푸터 */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 text-center">
        <p>우리 동네 소식통 | 출처: {localData.source}</p>
        <p className="mt-1">© 2026 my-local-info_n. All rights reserved.</p>
      </footer>
    </div>
  );
}
