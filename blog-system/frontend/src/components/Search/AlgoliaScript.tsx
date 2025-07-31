"use client";

import { useEffect } from "react";

interface AlgoliaScriptProps {
  appId: string;
  apiKey: string;
  indexName: string;
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

export function AlgoliaScript({
  appId,
  apiKey,
  indexName,
}: AlgoliaScriptProps) {
  useEffect(() => {
    // Safety check for server-side rendering
    if (typeof window === "undefined") {
      return;
    }

    const win = window as WindowWithAlgolia;

    // Check if Algolia is already loaded and initialized
    if (win.algoliasearch && win.algoliaIndex) {
      // console.log("Algolia already initialized, skipping");
      return;
    }

    const initAlgolia = () => {
      if (win.algoliasearch) {
        try {
          const searchClient = win.algoliasearch(appId, apiKey);
          win.algoliaIndex = searchClient.initIndex(indexName);
          // console.log("Algolia index initialized successfully");
        } catch (error) {
          console.error("Failed to initialize Algolia:", error);
        }
      } else {
        console.error("Algolia search library not loaded properly");
      }
    };

    // Add inline Algolia script
    const inlineScript = document.createElement("script");
    inlineScript.textContent = `
      // Inline Algolia initialization to ensure it's loaded directly
      (function(e,a,t,n,s,i,c){
        e.AlgoliaAnalyticsObject=s,e[s]=e[s]||function(){(e[s].queue=e[s].queue||[]).push(arguments)},
        i=a.createElement(t),c=a.getElementsByTagName(t)[0],
        i.async=1,i.src=n,c.parentNode.insertBefore(i,c)
      })(window,document,"script","https://cdn.staticfile.org/algoliasearch/4.20.0/algoliasearch-lite.umd.js","aa");
    `;
    document.head.appendChild(inlineScript);

    // Check if the script is already loaded
    if (win.algoliasearch) {
      initAlgolia();
      return;
    }

    // Load Algolia script
    const script = document.createElement("script");
    script.src =
      "https://cdn.staticfile.org/algoliasearch/4.20.0/algoliasearch-lite.umd.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // console.log("Algolia search script loaded");
      initAlgolia();
    };
    script.onerror = (error) => {
      console.error("Failed to load Algolia script:", error);
    };

    document.body.appendChild(script);

    return () => {
      // Clean up if needed
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(inlineScript)) {
        document.head.removeChild(inlineScript);
      }
    };
  }, [appId, apiKey, indexName]);

  return null;
}
