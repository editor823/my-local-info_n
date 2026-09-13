import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-emerald-100 text-slate-600 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            🌿
          </div>
          <span className="font-extrabold text-slate-800 text-base tracking-tight">
            우리 동네 이야기 <span className="text-emerald-600 font-semibold text-xs ml-1">강북 · 도봉 · 노원</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <Link href="/about" className="hover:text-emerald-600 transition-colors">
            서비스 소개
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
            개인정보처리방침
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/terms" className="hover:text-emerald-600 transition-colors">
            이용약관
          </Link>
          <span className="text-slate-300">|</span>
          <Link href="/contact" className="hover:text-emerald-600 transition-colors">
            문의하기
          </Link>
        </nav>

        <div className="space-y-1 text-slate-400 text-[11px] sm:text-xs text-center md:text-right">
          <p className="font-bold text-slate-700">우리 동네 이야기 · 강북구·도봉구·노원구 생활 정보 큐레이션</p>
          <p>데이터 출처: 행정안전부 공공데이터포털(data.go.kr) 및 정부 공식 고시 자료</p>
          <p>© 2026 우리 동네 이야기. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
