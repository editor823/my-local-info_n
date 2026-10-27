"use client";

import React, { useState, useEffect } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleTocAndShareProps {
  title: string;
  url?: string;
  headings?: TocItem[];
}

export default function ArticleTocAndShare({
  title,
  url,
  headings = [],
}: ArticleTocAndShareProps) {
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // 현재 화면에 보이는 헤딩 감지
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const handleCopyLink = async () => {
    try {
      const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // 복사 실패 시 fallback
      setCopied(false);
    }
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 1. 본문 상단 목차(Table of Contents) 네비게이션 박스 */}
      {headings.length > 0 && (
        <nav
          aria-label="아티클 목차"
          className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 my-6 shadow-xs"
        >
          <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-emerald-200/60">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                📑
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                {title ? `${title} 핵심 가이드 목차` : "핵심 가이드 목차 (Table of Contents)"}
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
              총 {headings.length}개 소주제
            </span>
          </div>

          <ul className="space-y-1.5 text-xs sm:text-sm">
            {headings.map((item, idx) => (
              <li
                key={`${item.id}-${idx}`}
                className={`${item.level === 3 ? "pl-4 text-xs" : "font-medium"}`}
              >
                <button
                  type="button"
                  onClick={() => scrollToHeading(item.id)}
                  className={`text-left w-full py-1 px-2 rounded-lg transition-all hover:bg-emerald-100/70 flex items-center gap-1.5 cursor-pointer ${
                    activeId === item.id
                      ? "text-emerald-800 font-bold bg-emerald-100/90 shadow-2xs"
                      : "text-slate-700 hover:text-emerald-800"
                  }`}
                >
                  <span className="text-emerald-500 text-[10px] shrink-0">
                    {item.level === 3 ? "└" : "•"}
                  </span>
                  <span className="truncate">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* 2. 공유 바 (소셜 / URL 복사) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl my-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span className="text-base">📢</span>
          <span>이 유용한 복지 혜택, 이웃 및 가족에게 공유하기</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200"
            }`}
          >
            <span>{copied ? "✓ 링크 복사 완료!" : "🔗 링크 복사"}</span>
          </button>
        </div>
      </div>

      {/* 3. 우측 하단 플로팅 맨 위로 가기 버튼 */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="맨 위로 이동"
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg shadow-emerald-700/30 transition-all hover:-translate-y-1 cursor-pointer flex items-center justify-center group"
        >
          <span className="text-base font-bold leading-none">↑</span>
          <span className="sr-only">맨 위로 이동</span>
        </button>
      )}
    </>
  );
}
