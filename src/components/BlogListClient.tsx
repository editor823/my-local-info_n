"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostData } from "@/lib/posts";

interface Props {
  posts: PostData[];
}

export default function BlogListClient({ posts }: Props) {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("" );

  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || []))
  ).slice(0, 10);

  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag === "all" || (post.tags && post.tags.includes(selectedTag));
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. 검색 및 필터 바 */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-emerald-600">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="찾으시는 혜택 주제나 구(강북구, 도봉구, 노원구, 장학금, 안심보험)를 검색하세요"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              지우기
            </button>
          )}
        </div>

        {/* 태그 칩스 */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-bold text-slate-400 mr-1">태그 필터:</span>
          <button
            onClick={() => setSelectedTag("all")}
            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedTag === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            전체 ({posts.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? "all" : tag)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-emerald-600 text-white font-bold shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 결과 개수 */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs text-slate-500">
        <span>
          발행된 이야기: <strong className="text-emerald-600 font-bold">{filteredPosts.length}</strong>편
        </span>
        {(selectedTag !== "all" || searchQuery !== "") && (
          <button
            onClick={() => {
              setSelectedTag("all");
              setSearchQuery("");
            }}
            className="text-emerald-600 hover:underline font-bold"
          >
            필터 초기화 ↺
          </button>
        )}
      </div>

      {/* 3. 2열 반응형 그리드 레이아웃 (기존 1열에서 2열 그리드로 차별화) */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-emerald-100 text-center shadow-sm space-y-2">
          <p className="text-4xl">🔎</p>
          <h3 className="text-base font-bold text-slate-800">일치하는 포스트가 없습니다.</h3>
          <p className="text-xs text-slate-500">다른 키워드나 태그를 선택해 보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl p-6 border border-emerald-100/90 shadow-sm hover:shadow-md hover:border-emerald-300 hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-emerald-50 text-emerald-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {post.category}
                  </span>
                  <time className="text-xs text-slate-400 font-medium">📅 {post.date}</time>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-2 leading-snug line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {post.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  상세 읽기 &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
