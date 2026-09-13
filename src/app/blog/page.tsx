import { getAllPosts } from "@/lib/posts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogListClient from "@/components/BlogListClient";

export const metadata = {
  title: "혜택 매거진 & 블로그 | 우리 동네 이야기",
  description: "강북구·도봉구·노원구 지원금 신청 가이드, 축제 후기 및 알짜 생활 팁을 전해드리는 정보 매거진입니다.",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. 글로벌 헤더 */}
      <Header />

      {/* 2. 상단 배너 */}
      <div className="bg-gradient-to-br from-[#062c1e] via-[#0d3d2a] to-[#124d38] text-white py-14 px-4 border-b border-emerald-900/50 shadow-md">
        <div className="max-w-5xl mx-auto text-center space-y-2">
          <span className="inline-block bg-emerald-500/20 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
            STORY & MAGAZINE
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            강북 · 도봉 · 노원 생활 혜택 매거진
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            복잡한 공고문 대신 실생활에 꼭 필요한 핵심 포인트와 신청 꿀팁을 친절하게 전달합니다.
          </p>
        </div>
      </div>

      {/* 3. 본문 목록 클라이언트 컴포넌트 */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        <BlogListClient posts={posts} />
      </main>

      {/* 4. 글로벌 푸터 */}
      <Footer />
    </div>
  );
}
