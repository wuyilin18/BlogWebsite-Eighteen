"use client";

import { useEffect, useState } from "react";

interface AlgoliaPreloaderProps {
  appId: string;
  apiKey: string;
  indexName: string;
  onReady?: () => void;
}

export function AlgoliaPreloader({
  appId,
  apiKey,
  indexName,
  onReady,
}: AlgoliaPreloaderProps) {
  const [, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // console.log("AlgoliaPreloader initializing...");

    const loadAlgolia = async () => {
      // Check if already loaded
      if (window.algoliasearch && window.algoliaIndex) {
        // console.log("Algolia already initialized, index available");
        setStatus("ready");
        onReady?.();
        return;
      }

      try {
        // If Algolia client is available but no index
        if (window.algoliasearch && !window.algoliaIndex) {
          // console.log("Algolia client available, initializing index");
          const client = window.algoliasearch(appId, apiKey);
          window.algoliaIndex = client.initIndex(indexName);
          // console.log("Algolia index initialized successfully");
          setStatus("ready");
          onReady?.();
          return;
        }

        // Need to load the script
        // console.log("Loading Algolia script from CDN");
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/algoliasearch@4/dist/algoliasearch-lite.umd.js";
        script.async = true;

        // Handle script loaded event
        script.onload = () => {
          // console.log("Algolia script loaded, initializing client");
          if (window.algoliasearch) {
            try {
              const client = window.algoliasearch(appId, apiKey);
              window.algoliaIndex = client.initIndex(indexName);
              // console.log("Algolia index initialized successfully");
              setStatus("ready");
              onReady?.();
            } catch (error) {
              console.error("Failed to initialize Algolia:", error);
              setStatus("error");
            }
          } else {
            console.error(
              "Algolia script loaded but algoliasearch not available"
            );
            setStatus("error");
          }
        };

        // Handle script error
        script.onerror = () => {
          console.error("Failed to load Algolia script");
          setStatus("error");
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error("Error loading Algolia:", error);
        setStatus("error");
      }
    };

    loadAlgolia();

    // Log the window.algoliasearch in 3 seconds to debug
    setTimeout(() => {
      console.log(
        "Debug - window.algoliasearch exists:",
        !!window.algoliasearch
      );
      console.log("Debug - window.algoliaIndex exists:", !!window.algoliaIndex);
    }, 3000);
  }, [appId, apiKey, indexName, onReady]);

  return null;
}
