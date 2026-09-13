import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  const posts = getAllPosts();
  if (posts.length === 0) {
    return [{ slug: "_placeholder" }];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-emerald-100 text-center max-w-md w-full shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            게시글을 찾을 수 없습니다 🌿
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            요청하신 블로그 포스트가 존재하지 않거나 삭제되었습니다.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-emerald-600/20"
          >
            ← 매거진 목록으로
          </Link>
        </div>
      </div>
    );
  }

  // 관련 추천 글 3편 추출 (현재 글 제외)
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. 글로벌 헤더 */}
      <Header />

      {/* 2. 상단 빵부스러기(Breadcrumb) 바 */}
      <div className="bg-white border-b border-emerald-100/60 py-3 px-4 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-600">홈</Link>
          <span>&gt;</span>
          <Link href="/blog" className="hover:text-emerald-600">혜택 매거진</Link>
          <span>&gt;</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      {/* 3. 메인 상세 본문 */}
      <main className="max-w-4xl w-full mx-auto px-4 py-10 flex-1 space-y-10">
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100/80 shadow-sm space-y-6">
          {/* 머리글 정보 */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                {post.category}
              </span>
              <time className="text-xs text-slate-400 font-medium">📅 발행일: {post.date}</time>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 마크다운 렌더링 본문 */}
          <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline leading-relaxed text-sm sm:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 정보 확인 안내 박스 */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 leading-relaxed space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-emerald-800">
              <span>🌿</span> 열린 공공데이터 안내
            </p>
            <p>
              본 글은 행정안전부 공공데이터포털(data.go.kr) 및 서울시 강북구·도봉구·노원구 자치단체 공식 고시 자료를 바탕으로 알기 쉽게 재구성한 생활 정보입니다. 주관 기관의 사정 및 예산 소진 상황에 따라 신청 조건이 변동될 수 있으니 신청 전 해당 기관의 최종 공고문을 꼭 확인해 주세요.
            </p>
          </div>

          {/* 하단 네비게이션 버튼 */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              ← 목록으로 돌아가기
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors shadow-sm shadow-emerald-600/20"
            >
              홈(종합 정보)으로 이동
            </Link>
          </div>
        </article>

        {/* 4. 구글 애드센스 체류 시간 증가를 위한 추천 섹션 */}
        {relatedPosts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="text-emerald-600">🌿</span> 함께 읽으면 도움되는 지역 이야기
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="bg-white p-5 rounded-2xl border border-emerald-100/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                      {related.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                      {related.title}
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold pt-3 mt-2 border-t border-slate-50 flex items-center gap-1">
                    읽어보기 &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 5. 푸터 */}
      <Footer />
    </div>
  );
}
