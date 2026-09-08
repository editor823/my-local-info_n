import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  if (posts.length === 0) {
    return [{ slug: "_empty" }];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 | 우리 동네 소식통",
    };
  }

  return {
    title: `${post.title} | 우리 동네 소식통 블로그`,
    description: post.summary || `${post.title} 상세 내용입니다.`,
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#222222] flex flex-col justify-between font-sans">
      {/* 상단 네비게이션 헤더 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors"
          >
            <span>←</span>
            <span>블로그 목록으로</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors"
            >
              생활정보 홈
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-sky-600">블로그</span>
          </div>
        </div>
      </header>

      {/* 포스트 본문 영역 */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-12 w-full flex-1">
        <article className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* 포스트 상단 헤더 */}
          <div className="p-6 sm:p-10 border-b border-slate-100 bg-gradient-to-b from-sky-50/40 to-white">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {post.category && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800">
                  {post.category}
                </span>
              )}
              {post.date && (
                <time className="text-xs font-medium text-slate-400">
                  {post.date}
                </time>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
              {post.title}
            </h1>

            {post.summary && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {post.summary}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 마크다운 본문 렌더링 */}
          <div className="p-6 sm:p-10">
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-sky-600 prose-img:rounded-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>←</span>
              <span>목록으로 돌아가기</span>
            </Link>
            <Link
              href="/"
              className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
            >
              우리 동네 행사·혜택 보러가기 &gt;
            </Link>
          </div>
        </article>
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
