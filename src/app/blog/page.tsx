import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "블로그 | 우리 동네 소식통",
  description: "성남시의 유용한 생활 정보와 팁을 전해드리는 블로그입니다.",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#222222] flex flex-col justify-between font-sans">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors"
          >
            <span>←</span>
            <span>홈으로</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors"
            >
              생활정보
            </Link>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-bold text-sky-600 border-b-2 border-sky-600 pb-0.5"
            >
              블로그
            </Link>
          </nav>
        </div>
      </header>

      {/* 블로그 상단 타이틀 배너 */}
      <section className="bg-gradient-to-b from-sky-50 via-white to-[#f7f9fa] border-b border-slate-200/80 py-10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-block px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold mb-3">
            📝 로컬 라이프 & 유용한 팁
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            동네 블로그
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
            놓치기 쉬운 혜택부터 생활 속 꿀팁까지 차근차근 전해드려요.
          </p>
        </div>
      </section>

      {/* 포스트 목록 영역 */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-10 w-full flex-1">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="text-4xl mb-3">✍️</div>
            <h2 className="text-lg font-bold text-slate-700 mb-1">
              아직 등록된 글이 없습니다
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              새로운 글이 곧 업데이트될 예정입니다. 조금만 기다려주세요!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {post.category && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        {post.category}
                      </span>
                    )}
                    {post.date && (
                      <time className="text-xs font-medium text-slate-400">
                        {post.date}
                      </time>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2.5 hover:text-sky-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {post.summary && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {post.summary}
                    </p>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>자세히 읽기</span>
                    <span>&gt;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-700">우리 동네 소식통 | 블로그</p>
            <p className="mt-1 text-slate-400">성남시 주민을 위한 생활 정보</p>
          </div>
          <div className="text-slate-400 sm:text-right">
            <p>© 2026 my-local-info_n. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
