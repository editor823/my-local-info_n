import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-[0_2px_15px_-3px_rgba(16,185,129,0.06)]">
      {/* 1. 최상단 서브 바: 딥 에메랄드/그린 톤 */}
      <div className="bg-[#0f291e] text-emerald-100 text-[11px] py-1.5 px-4 hidden sm:block border-b border-emerald-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-emerald-200">
              서울 강북구 · 도봉구 · 노원구 열린 공공데이터 & 생활 복지 아카이브
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-300/80">
            <Link href="/about" className="hover:text-emerald-100 transition-colors">
              서비스 소개
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-emerald-100 transition-colors">
              개인정보처리방침
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-emerald-100 transition-colors">
              문의/제보
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 메인 로고 및 GNB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              🌿
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                우리 동네 <span className="text-emerald-600">이야기</span>
                <span className="text-[10px] uppercase font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  강북·도봉·노원
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                지역 구민을 위한 똑똑한 혜택 & 축제 가이드
              </p>
            </div>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-bold text-slate-700">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl hover:text-emerald-600 hover:bg-emerald-50/80 transition-colors"
            >
              종합 홈
            </Link>
            <Link
              href="/#rankings"
              className="px-3.5 py-2 rounded-xl hover:text-emerald-600 hover:bg-emerald-50/80 transition-colors flex items-center gap-1.5"
            >
              <span className="text-emerald-600">🌿</span> 구민 인기 혜택
            </Link>
            <Link
              href="/events"
              className="px-3.5 py-2 rounded-xl hover:text-emerald-600 hover:bg-emerald-50/80 transition-colors flex items-center gap-1.5"
            >
              <span className="text-teal-600">🎪</span> 축제 캘린더
            </Link>
            <Link
              href="/blog"
              className="px-3.5 py-2 rounded-xl hover:text-emerald-600 hover:bg-emerald-50/80 transition-colors flex items-center gap-1.5"
            >
              <span className="text-emerald-500">✍️</span> 혜택 매거진
            </Link>
            <Link
              href="/about"
              className="px-3.5 py-2 rounded-xl hover:text-emerald-600 hover:bg-emerald-50/80 transition-colors flex items-center gap-1.5"
            >
              <span className="text-emerald-600">ℹ️</span> 소개
            </Link>
          </nav>
        </div>

        {/* 우측 바로가기 버튼 */}
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            className="text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <span>전체 혜택 보기</span>
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
