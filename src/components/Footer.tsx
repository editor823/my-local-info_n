import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-emerald-100/90 text-slate-600 pt-14 pb-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 상단: 로고 및 주요 페이지 네비게이션 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-base shadow-sm">
              🌿
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight flex items-center gap-1.5">
                우리 동네 이야기
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  강북 · 도봉 · 노원
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">
                지역 구민을 위한 똑똑한 생활 복지 &amp; 문화 축제 아카이브
              </p>
            </div>
          </div>

          {/* 구글 애드센스 필수 3대 페이지 + 약관 메뉴 (가독성 높은 탭 디자인) */}
          <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-600">
            <Link
              href="/about/"
              className="px-3 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              서비스 소개 (About)
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              href="/contact/"
              className="px-3 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              문의 및 제보 (Contact)
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              href="/privacy/"
              className="px-3 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              개인정보처리방침 (Privacy)
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              href="/terms/"
              className="px-3 py-1.5 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              이용약관 (Terms)
            </Link>
          </nav>
        </div>

        {/* 하단: 데이터 출처, 연락처 및 저작권 정보 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-slate-400 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-semibold text-slate-600">
              우리 동네 이야기 · 공공데이터 기반 비영리 생활 정보 큐레이션 포털
            </p>
            <p>
              데이터 원천: 행정안전부 공공데이터포털(data.go.kr), 정부24, 서울시 열린데이터광장 및 각 자치구 공식 고시 자료
            </p>
            <p>
              공식 문의 및 정정 요청:{" "}
              <a href="mailto:tkdgus8231@gmail.com" className="text-emerald-600 font-semibold hover:underline">
                tkdgus8231@gmail.com
              </a>{" "}
              (에디토리얼팀)
            </p>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p>© 2026 우리 동네 이야기 (GoodKey-Info). All rights reserved.</p>
            <p className="text-[10px] text-slate-400">
              본 사이트는 구글 애드센스 게시자 운영 정책 및 개인정보 보호 규정을 철저히 준수합니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
