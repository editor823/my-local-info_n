"use client";

interface CoupangBannerProps {
  className?: string;
}

export default function CoupangBanner({ className = "" }: CoupangBannerProps) {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID || "g0wjZqcMNM";

  // partnerId가 없거나 "나중에_입력" 또는 빈 문자열이면 렌더링하지 않음
  if (!partnerId || partnerId.trim() === "" || partnerId.trim() === "나중에_입력") {
    return null;
  }

  return (
    <aside
      aria-label="쿠팡 파트너스 추천 상품 안내"
      className={`my-6 p-4 rounded-2xl border border-amber-200/80 bg-amber-50/40 text-center ${className}`}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <a
          href={`https://link.coupang.com/a/${partnerId}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 hover:brightness-105 transition-all"
        >
          <span>🛒 로켓배송 실시간 특가 상품 확인하기</span>
          <span>&rarr;</span>
        </a>
        <p className="text-[11px] text-slate-400">
          이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
        </p>
      </div>
    </aside>
  );
}
