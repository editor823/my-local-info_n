"use client";

import { useEffect } from "react";

interface Props {
  adsenseId?: string;
  gaId?: string;
}

export default function SmartAnalyticsAndAds({ adsenseId, gaId }: Props) {
  useEffect(() => {
    let isLoaded = false;

    const loadScripts = () => {
      if (isLoaded) return;
      isLoaded = true;

      // 1. Google Analytics 4 (초기 렌더링 후 사용자 인터랙션 또는 지연 로드)
      if (gaId) {
        const gaScript = document.createElement("script");
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        gaScript.async = true;
        document.head.appendChild(gaScript);

        const gaInitScript = document.createElement("script");
        gaInitScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(gaInitScript);
      }

      // 2. Google AdSense (284KB 무거운 메인스레드 차단 방지)
      if (adsenseId) {
        const adsScript = document.createElement("script");
        adsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
        adsScript.async = true;
        adsScript.crossOrigin = "anonymous";
        document.head.appendChild(adsScript);
      }

      // 이벤트 리스너 해제
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("scroll", loadScripts);
      window.removeEventListener("touchstart", loadScripts);
      window.removeEventListener("mousemove", loadScripts);
      window.removeEventListener("keydown", loadScripts);
    };

    // 사용자의 첫 동작(스크롤, 터치, 키입력) 시 즉시 실행
    window.addEventListener("scroll", loadScripts, { passive: true, once: true });
    window.addEventListener("touchstart", loadScripts, { passive: true, once: true });
    window.addEventListener("mousemove", loadScripts, { passive: true, once: true });
    window.addEventListener("keydown", loadScripts, { passive: true, once: true });

    // 사용자 동작이 없더라도 3.5초 뒤 자동 로드 (안전장치)
    const fallbackTimer = setTimeout(loadScripts, 3500);

    return () => {
      clearTimeout(fallbackTimer);
      cleanup();
    };
  }, [adsenseId, gaId]);

  return null;
}
