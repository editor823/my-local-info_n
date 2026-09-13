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

  // adsenseId가 없거나 "나중에_입력"인 경우 광고 영역을 아예 렌더링하지 않음
  const isAdsenseActive = Boolean(
    adsenseId && adsenseId.trim() !== "" && adsenseId.trim() !== "나중에_입력"
  );

  useEffect(() => {
    if (isAdsenseActive) {
      try {
        // @ts-ignore
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        // 중복 로드 또는 차단 시 무시
      }
    }
  }, [isAdsenseActive]);

  if (!isAdsenseActive) {
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
