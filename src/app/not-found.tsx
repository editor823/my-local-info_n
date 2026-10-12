import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-4xl shadow-inner">
          🔍
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            404 Page Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            원하시는 페이지를 찾을 수 없습니다
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto pt-1">
            주소가 잘못 입력되었거나 변경·삭제되어 페이지를 표시할 수 없습니다.
            아래 주요 페이지를 통해 필요한 구민 혜택과 정보를 확인해보세요.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md shadow-emerald-600/20"
          >
            홈으로 이동
          </Link>
          <Link
            href="/blog/"
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl border border-slate-200 transition-colors"
          >
            혜택 매거진 보기
          </Link>
          <Link
            href="/events/"
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl border border-slate-200 transition-colors"
          >
            축제 캘린더 보기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
