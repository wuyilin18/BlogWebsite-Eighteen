"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

interface TwikooProps {
  // 我们不再需要 vercelUrl prop 了，但为了保持接口不变，可以留着
  vercelUrl?: string;
  title?: string;
  className?: string;
}

let isTwikooScriptLoaded = false;

export const TwikooComments: React.FC<TwikooProps> = ({
  title,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const initTwikoo = () => {
    if (containerRef.current && window.twikoo) {
      // console.log(`[Twikoo] Initializing for path: ${pathname}`);
      try {
        containerRef.current.innerHTML = "";

        const NEXT_PUBLIC_TWIKOO_URL = "process.env.NEXT_PUBLIC_TWIKOO_URL";
        // console.log(`[Twikoo] Using hardcoded envId: ${NEXT_PUBLIC_TWIKOO_URL}`);

        window.twikoo.init({
          envId: NEXT_PUBLIC_TWIKOO_URL,
          el: "#twikoo-comments-container",
          path: pathname,
          lang: "zh-CN",
          provider: "vercel",
        });
        // console.log("[Twikoo] Init function called successfully.");
      } catch (e) {
        console.error("[Twikoo] Error during init:", e);
      }
    }
  };

  useEffect(() => {
    if (isTwikooScriptLoaded) {
      initTwikoo();
    }
  }, [pathname]);

  return (
    <div className={`twikoo-container ${className}`}>
      {title && (
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      )}
      <Script
        src="https://cdn.staticfile.org/twikoo/1.6.44/twikoo.all.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // console.log("[Twikoo] Script loaded.");
          isTwikooScriptLoaded = true;
          initTwikoo();
        }}
      />
      <div id="twikoo-comments-container" ref={containerRef} />
    </div>
  );
};

// 全局类型声明是正确的
declare global {
  interface Window {
    twikoo: {
      init: (config: {
        envId: string;
        el: string;
        path?: string;
        region?: string;
        lang?: string;
        visitor?: boolean;
        [key: string]: string | boolean | undefined;
      }) => void;
    };
  }
}
