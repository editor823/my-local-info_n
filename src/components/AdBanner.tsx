"use client";

import { useEffect } from "react";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  responsive?: boolean;
  className?: string;
}

export default function AdBanner({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-5767039912569697";

  const isAdsenseActive = Boolean(
    adsenseId && adsenseId.trim() !== "" && adsenseId.trim() !== "나중에_입력"
  );

  // 애드센스 승인 완료 전(NEXT_PUBLIC_ADSENSE_APPROVED === "true"가 아닐 때)에는
  // 심사 기간 동안 빈 상자 노출 및 403 에러를 방지하기 위해 개별 광고 단위를 렌더링하지 않음
  const isApproved = process.env.NEXT_PUBLIC_ADSENSE_APPROVED === "true";

  useEffect(() => {
    if (isAdsenseActive && isApproved) {
      try {
        const win = window as unknown as { adsbygoogle?: unknown[] };
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
      } catch {
        // 중복 로드 또는 차단 시 무시
      }
    }
  }, [isAdsenseActive, isApproved]);

  if (!isAdsenseActive || !isApproved) {
    return null;
  }

  return (
    <div className={`my-6 text-center overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot || "auto"}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
