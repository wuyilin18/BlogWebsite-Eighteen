"use client";

import React, { useEffect } from "react";
import Script from "next/script";
import { AlgoliaScript } from "./AlgoliaScript";

interface AlgoliaProviderProps {
  children: React.ReactNode;
}

// Type definitions for the window object
type WindowWithAlgolia = typeof window & {
  algoliasearch?: (
    appId: string,
    apiKey: string
  ) => {
    initIndex: (indexName: string) => unknown;
  };
  algoliaIndex?: unknown;
};

export function AlgoliaProvider({ children }: AlgoliaProviderProps) {
  // Algolia credentials
  const appId = "4KSBT528TD";
  const apiKey = "4c5827731a6ad8b7bc3063c61916c372";
  const indexName = "development_blog_posts";

  // Add debug logging to help diagnose issues
  useEffect(() => {
    if (typeof window !== "undefined") {
      // console.log("AlgoliaProvider mounted");
      const win = window as WindowWithAlgolia;

      // Check if window globals are defined after a short delay
      const checkInitialization = () => {
        const algoliaInitialized =
          typeof win.algoliasearch === "function" &&
          win.algoliaIndex !== undefined;

        // console.log("Algolia initialized check:", algoliaInitialized);
        // console.log(
        //   "Algolia client available:",
        //   typeof win.algoliasearch === "function"
        // );
        // console.log("Algolia index available:", win.algoliaIndex !== undefined);

        if (!algoliaInitialized) {
          // Try manual initialization if script loaded but index wasn't initialized
          if (typeof win.algoliasearch === "function" && !win.algoliaIndex) {
            // console.log("Attempting manual Algolia initialization");
            try {
              const searchClient = win.algoliasearch(appId, apiKey);
              win.algoliaIndex = searchClient.initIndex(indexName);
              // console.log("Manual Algolia initialization successful");
            } catch (error) {
              console.error("Manual Algolia initialization failed:", error);
            }
          }
        }
      };

      // Initial check
      checkInitialization();

      // Delayed check to allow for script loading
      const timer = setTimeout(checkInitialization, 2000);

      return () => clearTimeout(timer);
    }
  }, [appId, apiKey, indexName]);

  return (
    <>
      {/* 修复：将 beforeInteractive 改为 afterInteractive */}
      <Script
        src="https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          // console.log("Algolia script loaded via Next.js Script");
          const win = window as WindowWithAlgolia;
          if (
            typeof win !== "undefined" &&
            win.algoliasearch &&
            !win.algoliaIndex
          ) {
            const searchClient = win.algoliasearch(appId, apiKey);
            win.algoliaIndex = searchClient.initIndex(indexName);
            // console.log("Algolia initialized via Next.js Script onLoad");
          }
        }}
      />

      {/* Backup initialization method */}
      <AlgoliaScript appId={appId} apiKey={apiKey} indexName={indexName} />

      {children}
    </>
  );
}
