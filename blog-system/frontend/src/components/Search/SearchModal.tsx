"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiSearch } from "react-icons/fi";
import Link from "next/link";
import { SearchResultItem } from "./SearchResults";
import { cn } from "@/lib/utils";

// Define proper types for Algolia
interface AlgoliaHighlightResult {
  value: string;
  matchLevel: "none" | "partial" | "full";
  matchedWords: string[];
}

interface AlgoliaHit {
  objectID: string;
  title?: string;
  summary?: string;
  Summary?: string; // Keep for compatibility
  slug?: string;
  Slug?: string; // Keep for compatibility
  imageUrl?: string;
  coverImage?: string; // Keep for compatibility
  _highlightResult?: {
    title?: AlgoliaHighlightResult;
    summary?: AlgoliaHighlightResult;
    content?: AlgoliaHighlightResult;
    slug?: AlgoliaHighlightResult;
  };
  [key: string]: unknown;
}

interface AlgoliaSearchResponse {
  hits: AlgoliaHit[];
}

interface AlgoliaIndex {
  search: (
    query: string,
    options?: Record<string, unknown>
  ) => Promise<AlgoliaSearchResponse>;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const placeholders = [
  "搜索文章标题...",
  "尝试搜索: React",
  "搜索关键词...",
  "查找博客内容...",
];

// Safely access window with Algolia properties
const getAlgoliaFromWindow = (): {
  algoliaIndex?: AlgoliaIndex;
  isAvailable: boolean;
} => {
  if (typeof window === "undefined") {
    return { isAvailable: false };
  }

  // Define an interface for the window with Algolia properties
  interface WindowWithAlgolia {
    algoliaIndex?: AlgoliaIndex;
    // Using a more specific type for algoliasearch
    algoliasearch?: (
      appId: string,
      apiKey: string
    ) => {
      initIndex: (indexName: string) => AlgoliaIndex;
    };
  }

  // Cast window to our custom interface
  const customWindow = window as unknown as WindowWithAlgolia;

  // Check if Algolia is properly initialized
  const isAvailable =
    !!customWindow.algoliaIndex && !!customWindow.algoliasearch;

  return {
    algoliaIndex: customWindow.algoliaIndex,
    isAvailable,
  };
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6; // Maximum 6 items per page
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Animation related states and refs
  const [animating, setAnimating] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Define types for animation data
  interface PixelPoint {
    x: number;
    y: number;
    color: number[];
  }

  interface AnimationPoint {
    x: number;
    y: number;
    r: number;
    color: string;
  }

  const newDataRef = useRef<AnimationPoint[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const startAnimation = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        if (!intervalRef.current) {
          startAnimation();
        }
      }
    };

    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isOpen]);

  // Calculate total pages
  const totalPages = Math.max(
    1,
    Math.ceil(searchResults.length / resultsPerPage)
  );

  // Get current page results
  const getCurrentPageResults = () => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return searchResults.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Check Algolia availability on mount
  useEffect(() => {
    const checkAlgoliaAvailability = () => {
      const { isAvailable } = getAlgoliaFromWindow();
      // console.log("Algolia availability check:", isAvailable);
      return isAvailable;
    };

    // If not available immediately, check again after a delay
    if (!checkAlgoliaAvailability()) {
      const checkTimer = setTimeout(() => {
        checkAlgoliaAvailability();
      }, 2000);

      return () => clearTimeout(checkTimer);
    }
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchText("");
      setSearchResults([]);
      setHasSearched(false);
      setAnimating(false);
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Draw text to canvas for animation
  const draw = useCallback(() => {
    if (!searchInputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(searchInputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(searchText, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: PixelPoint[] = [];

    for (let t = 0; t < 800; t++) {
      const i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        const e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [searchText]);

  useEffect(() => {
    if (isOpen) {
      draw();
    }
  }, [searchText, draw, isOpen]);

  // Animation function
  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setAnimating(false);
        }
      });
    };
    animateFrame(start);
  };

  // Handle vanish animation and search
  const vanishAndSearch = () => {
    if (!searchText.trim() || animating) return;

    setAnimating(true);
    draw();

    if (searchText && searchInputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);

      // Perform search after animation starts
      handleSearch(searchText.trim());
    }
  };

  // Search function - only triggered when search button is clicked
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Get Algolia client and check availability
      const { algoliaIndex, isAvailable } = getAlgoliaFromWindow();

      if (isAvailable && algoliaIndex) {
        // console.log("Using Algolia for search");
        const { hits } = await algoliaIndex.search(query, {
          hitsPerPage: 10,
          attributesToRetrieve: [
            "objectID",
            "title",
            "summary", // 小写
            "slug", // 小写
            "content",
            "imageUrl",
          ],
          attributesToHighlight: ["title", "summary", "content", "slug"],
        });

        // Format results
        const formattedResults: SearchResultItem[] = hits.map(
          (hit: AlgoliaHit) => ({
            objectID: hit.objectID,
            title:
              hit._highlightResult?.title?.value || hit.title || "No title",
            summary:
              hit._highlightResult?.summary?.value ||
              hit.summary ||
              hit.Summary ||
              "摘要不可用",
            Slug: `/posts/${hit.slug || hit.Slug || hit.objectID}`,
            imageUrl: hit.imageUrl || hit.coverImage || undefined,
          })
        );

        setSearchResults(formattedResults);
      } else {
        // Fallback to mock results when Algolia isn't available
        console.warn("Algolia search client not available, using mock data");

        // Simple client-side search simulation for development
        const mockResults: SearchResultItem[] = [
          {
            objectID: "mock-1",
            title: `开发环境搜索示例 - "${query}"`,
            summary: `这是一个开发环境的搜索结果示例，当前搜索词: "${query}"。Algolia搜索服务未连接，请检查配置。`,
            Slug: "blog/development",
          },
        ];

        setTimeout(() => {
          setSearchResults(mockResults);
        }, 500);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([
        {
          objectID: "error",
          title: "搜索出错",
          summary: "搜索过程中发生错误，请稍后再试。",
          Slug: "#",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    vanishAndSearch();
  };

  // Handle key down for search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      vanishAndSearch();
    }
  };

  // Updated pagination section - now dynamically generates page numbers
  const renderPagination = () => {
    if (searchResults.length === 0) return null;

    // Create array of page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center py-3 bg-white/80 dark:bg-[#0e0e0e]/80 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
        <div className="flex gap-4">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded ${
                page === currentPage
                  ? "bg-teal-500 text-white"
                  : "text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              } text-base font-medium transition-colors`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="w-full max-w-2xl bg-white/80 dark:bg-[#0e0e0e]/80 rounded-lg overflow-hidden shadow-2xl relative backdrop-blur-md border border-gray-200 dark:border-gray-700"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.25 }}
          >
            {/* Electronic circuit background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Cloud/ink effect elements */}
              <div className="absolute inset-0">
                <div className="absolute top-[15%] left-[10%] w-[180px] h-[40px] bg-teal-500/20 dark:bg-teal-400/20 rounded-full filter blur-xl opacity-40 animate-cloud-float"></div>
                <div
                  className="absolute bottom-[20%] right-[10%] w-[150px] h-[35px] bg-teal-400/30 dark:bg-teal-300/30 rounded-full filter blur-xl opacity-30 animate-cloud-float"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div
                  className="absolute top-[40%] right-[15%] w-[100px] h-[100px] bg-teal-500/10 dark:bg-teal-400/10 rounded-full filter blur-xl opacity-20 animate-cloud-float"
                  style={{ animationDelay: "2.2s" }}
                ></div>
                <div
                  className="absolute bottom-[40%] left-[15%] w-[120px] h-[30px] bg-teal-400/20 dark:bg-teal-300/20 rounded-full filter blur-xl opacity-20 animate-cloud-float"
                  style={{ animationDelay: "3s" }}
                ></div>
              </div>

              {/* Circuit grid */}
              <div className="absolute inset-0">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 600"
                  className="opacity-10 dark:opacity-20"
                >
                  {/* Circuit paths */}
                  <path
                    d="M0,100 H150 C160,100 160,150 170,150 H300 C310,150 310,80 320,80 H450 C460,80 460,120 470,120 H600"
                    stroke="#56CFE1"
                    strokeWidth="1"
                    fill="none"
                    className="animate-data-flow"
                    style={{ strokeDasharray: "4, 2", animationDuration: "5s" }}
                  />
                  <path
                    d="M800,200 H650 C640,200 640,250 630,250 H500 C490,250 490,180 480,180 H350 C340,180 340,220 330,220 H200"
                    stroke="#56CFE1"
                    strokeWidth="0.8"
                    fill="none"
                    className="animate-data-flow"
                    style={{
                      strokeDasharray: "3, 3",
                      animationDuration: "7s",
                      animationDelay: "0.5s",
                    }}
                  />
                  <path
                    d="M150,400 V100 M350,400 V150 M550,400 V200"
                    stroke="#56CFE1"
                    strokeWidth="0.5"
                    fill="none"
                    className="animate-data-flow"
                    style={{ strokeDasharray: "2, 4", animationDuration: "6s" }}
                  />

                  {/* New circuit elements */}
                  <path
                    d="M50,300 H250 C260,300 260,350 270,350 H400"
                    stroke="#56CFE1"
                    strokeWidth="0.6"
                    fill="none"
                    className="animate-data-flow"
                    style={{ strokeDasharray: "3, 2", animationDuration: "8s" }}
                  />
                  <path
                    d="M700,350 H500 C490,350 490,300 480,300 H400"
                    stroke="#56CFE1"
                    strokeWidth="0.6"
                    fill="none"
                    className="animate-data-flow"
                    style={{
                      strokeDasharray: "3, 2",
                      animationDuration: "8s",
                      animationDelay: "1s",
                    }}
                  />

                  {/* Circuit nodes */}
                  <circle
                    cx="150"
                    cy="100"
                    r="3"
                    fill="#56CFE1"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <circle
                    cx="320"
                    cy="80"
                    r="3"
                    fill="#56CFE1"
                    className="animate-led-blink"
                    style={{ animationDelay: "1.2s" }}
                  />
                  <circle
                    cx="470"
                    cy="120"
                    r="3"
                    fill="#56CFE1"
                    className="animate-led-blink"
                    style={{ animationDelay: "1.8s" }}
                  />
                  <circle
                    cx="400"
                    cy="350"
                    r="3"
                    fill="#56CFE1"
                    className="animate-led-blink"
                    style={{ animationDelay: "2.5s" }}
                  />

                  {/* Microchip element */}
                  <g
                    transform="translate(650, 150)"
                    className="animate-circuit-pulse"
                    style={{ animationDelay: "1s", transformOrigin: "center" }}
                  >
                    <rect
                      x="-20"
                      y="-15"
                      width="40"
                      height="30"
                      rx="2"
                      stroke="#56CFE1"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <line
                      x1="-12"
                      y1="-15"
                      x2="-12"
                      y2="15"
                      stroke="#56CFE1"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="-4"
                      y1="-15"
                      x2="-4"
                      y2="15"
                      stroke="#56CFE1"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="4"
                      y1="-15"
                      x2="4"
                      y2="15"
                      stroke="#56CFE1"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="12"
                      y1="-15"
                      x2="12"
                      y2="15"
                      stroke="#56CFE1"
                      strokeWidth="0.5"
                    />
                  </g>

                  {/* Second microchip element */}
                  <g
                    transform="translate(250, 250)"
                    className="animate-circuit-pulse"
                    style={{ animationDelay: "2s", transformOrigin: "center" }}
                  >
                    <rect
                      x="-15"
                      y="-10"
                      width="30"
                      height="20"
                      rx="2"
                      stroke="#56CFE1"
                      strokeWidth="0.8"
                      fill="none"
                    />
                    <line
                      x1="-9"
                      y1="-10"
                      x2="-9"
                      y2="10"
                      stroke="#56CFE1"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="-3"
                      y1="-10"
                      x2="-3"
                      y2="10"
                      stroke="#56CFE1"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="3"
                      y1="-10"
                      x2="3"
                      y2="10"
                      stroke="#56CFE1"
                      strokeWidth="0.5"
                    />
                    <line
                      x1="9"
                      y1="-10"
                      x2="9"
                      y2="10"
                      stroke="#56CFE1"
                      strokeWidth="0.5"
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* Search header */}
            <div className="px-6 py-4 flex items-center justify-between relative z-10 bg-transparent">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] bg-clip-text text-transparent dark:from-[#56CFE1] dark:to-[#FF9470]">
                搜索
                <div className="absolute -right-1 -top-1 w-1.5 h-1.5 rounded-full bg-[#56CFE1] animate-led-blink led-chip"></div>
              </h2>
              <button
                onClick={onClose}
                className="cursor-target p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400"
                aria-label="Close search"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Search input - updated with animation effect */}
            <form
              onSubmit={handleSubmit}
              className="px-6 py-4 relative z-10 bg-transparent"
            >
              <div className="relative flex items-center w-full">
                <canvas
                  className={cn(
                    "absolute pointer-events-none text-base transform scale-50 top-[35%] left-6 origin-top-left filter invert dark:invert-0 pr-16 z-20",
                    !animating ? "opacity-0" : "opacity-100"
                  )}
                  ref={canvasRef}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchText}
                  onChange={(e) => !animating && setSearchText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "cursor-target w-full h-16 py-3 px-6 pr-16 bg-gray-100 dark:bg-gray-800 border-0 outline-none focus:ring-0 text-gray-800 dark:text-white placeholder-gray-600 text-xl font-medium rounded-full",
                    animating && "text-transparent dark:text-transparent"
                  )}
                  autoComplete="off"
                />

                {/* Placeholder animation */}
                <div className="absolute inset-0 flex items-center rounded-full pointer-events-none pl-6">
                  <AnimatePresence mode="wait">
                    {!searchText && !animating && (
                      <motion.p
                        initial={{
                          y: 5,
                          opacity: 0,
                        }}
                        key={`current-placeholder-${currentPlaceholder}`}
                        animate={{
                          y: 0,
                          opacity: 1,
                        }}
                        exit={{
                          y: -15,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "linear",
                        }}
                        className="dark:text-gray-500 text-gray-500 text-xl font-normal"
                      >
                        {placeholders[currentPlaceholder]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={!searchText.trim() || animating}
                  className={cn(
                    "cursor-target absolute right-2 w-12 h-12 flex items-center justify-center rounded-full transition-colors z-30",
                    searchText.trim() && !animating
                      ? "bg-teal-400 hover:bg-teal-500 text-white"
                      : "bg-teal-400/70 text-white"
                  )}
                  aria-label="Search"
                >
                  <FiSearch className="w-6 h-6" />
                </button>
              </div>
            </form>

            {/* Content area */}
            <div
              className={cn(
                "max-h-[60vh] overflow-y-auto transition-all relative z-10 bg-transparent",
                hasSearched ? "opacity-100" : "opacity-0 h-0"
              )}
            >
              {/* Search results */}
              {isLoading ? (
                <div className="flex justify-center items-center py-8 ">
                  <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin "></div>
                </div>
              ) : (
                <>
                  {searchResults.length > 0 ? (
                    <div className="px-6 py-4">
                      {getCurrentPageResults().map((result, index) => (
                        <div
                          key={result.objectID}
                          className={cn(
                            "cursor-target py-4",
                            index !== getCurrentPageResults().length - 1 &&
                              "border-b border-gray-200/50 dark:border-gray-700/50"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-teal-500 mt-2"></div>
                            <div className="flex-1">
                              <Link
                                href={`${result.Slug}`}
                                className="block"
                                onClick={onClose}
                              >
                                <h3
                                  className="text-lg font-medium text-gray-900 dark:text-white mb-1"
                                  dangerouslySetInnerHTML={{
                                    __html: result.title,
                                  }}
                                />
                                {result.summary && (
                                  <p
                                    className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line"
                                    dangerouslySetInnerHTML={{
                                      __html: result.summary,
                                    }}
                                  />
                                )}
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    hasSearched && (
                      <div className="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                        没有找到与 &quot;{searchText}&quot; 相关的结果
                      </div>
                    )
                  )}

                  {/* Render pagination */}
                  {renderPagination()}

                  {/* Search stats and Algolia logo - now comes second */}
                  {searchResults.length > 0 && (
                    <div className="px-6 py-3 flex justify-between items-center bg-white/80 dark:bg-[#0e0e0e]/80 backdrop-blur-sm">
                      <div className="text-sm text-gray-500 dark:text-gray-400 ">
                        找到 {searchResults.length} 条结果，用时 1 毫秒
                      </div>

                      {/* Algolia attribution */}
                      <div className="flex items-center ">
                        <svg
                          height="1.2em"
                          className="ais-PoweredBy-logo"
                          viewBox="0 0 572 64"
                          style={{ width: "auto" }}
                        >
                          <defs>
                            <linearGradient
                              id="algolia-gradient-light"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#56CFE1" />
                              <stop offset="100%" stopColor="#9D4EDD" />
                            </linearGradient>
                            <linearGradient
                              id="algolia-gradient-dark"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#56CFE1" />
                              <stop offset="100%" stopColor="#FF9470" />
                            </linearGradient>
                          </defs>
                          <path
                            className="dark:hidden"
                            fill="url(#algolia-gradient-light)"
                            d="M534.4 9.1H528a.8.8 0 0 1-.7-.7V1.8c0-.4.2-.7.6-.8l6.5-1c.4 0 .8.2.9.6v7.8c0 .4-.4.7-.8.7zM428 35.2V.8c0-.5-.3-.8-.7-.8h-.2l-6.4 1c-.4 0-.7.4-.7.8v35c0 1.6 0 11.8 12.3 12.2.5 0 .8-.4.8-.8V43c0-.4-.3-.7-.6-.8-4.5-.5-4.5-6-4.5-7zm106.5-21.8H528c-.4 0-.7.4-.7.8v34c0 .4.3.8.7.8h6.5c.4 0 .8-.4.8-.8v-34c0-.5-.4-.8-.8-.8zm-17.7 21.8V.8c0-.5-.3-.8-.8-.8l-6.5 1c-.4 0-.7.4-.7.8v35c0 1.6 0 11.8 12.3 12.2.4 0 .8-.4.8-.8V43c0-.4-.3-.7-.7-.8-4.4-.5-4.4-6-4.4-7zm-22.2-20.6a16.5 16.5 0 0 1 8.6 9.3c.8 2.2 1.3 4.8 1.3 7.5a19.4 19.4 0 0 1-4.6 12.6 14.8 14.8 0 0 1-5.2 3.6c-2 .9-5.2 1.4-6.8 1.4a21 21 0 0 1-6.7-1.4 15.4 15.4 0 0 1-8.6-9.3 21.3 21.3 0 0 1 0-14.4 15.2 15.2 0 0 1 8.6-9.3c2-.8 4.3-1.2 6.7-1.2s4.6.4 6.7 1.2zm-6.7 27.6c2.7 0 4.7-1 6.2-3s2.2-4.3 2.2-7.8-.7-6.3-2.2-8.3-3.5-3-6.2-3-4.7 1-6.1 3c-1.5 2-2.2 4.8-2.2 8.3s.7 5.8 2.2 7.8 3.5 3 6.2 3zm-88.8-28.8c-6.2 0-11.7 3.3-14.8 8.2a18.6 18.6 0 0 0 4.8 25.2c1.8 1.2 4 1.8 6.2 1.7s.1 0 .1 0h.9c4.2-.7 8-4 9.1-8.1v7.4c0 .4.3.7.8.7h6.4a.7.7 0 0 0 .7-.7V14.2c0-.5-.3-.8-.7-.8h-13.5zm6.3 26.5a9.8 9.8 0 0 1-5.7 2h-.5a10 10 0 0 1-9.2-14c1.4-3.7 5-6.3 9-6.3h6.4v18.3zm152.3-26.5h13.5c.5 0 .8.3.8.7v33.7c0 .4-.3.7-.8.7h-6.4a.7.7 0 0 1-.8-.7v-7.4c-1.2 4-4.8 7.4-9 8h-.1a4.2 4.2 0 0 1-.5.1h-.9a10.3 10.3 0 0 1-7-2.6c-4-3.3-6.5-8.4-6.5-14.2 0-3.7 1-7.2 3-10 3-5 8.5-8.3 14.7-8.3zm.6 28.4c2.2-.1 4.2-.6 5.7-2V21.7h-6.3a9.8 9.8 0 0 0-9 6.4 10.2 10.2 0 0 0 9.1 13.9h.5zM452.8 13.4c-6.2 0-11.7 3.3-14.8 8.2a18.5 18.5 0 0 0 3.6 24.3 10.4 10.4 0 0 0 13 .6c2.2-1.5 3.8-3.7 4.5-6.1v7.8c0 2.8-.8 5-2.2 6.3-1.5 1.5-4 2.2-7.5 2.2l-6-.3c-.3 0-.7.2-.8.5l-1.6 5.5c-.1.4.1.8.5 1h.1c2.8.4 5.5.6 7 .6 6.3 0 11-1.4 14-4.1 2.7-2.5 4.2-6.3 4.5-11.4V14.2c0-.5-.4-.8-.8-.8h-13.5zm6.3 8.2v18.3a9.6 9.6 0 0 1-5.6 2h-1a10.3 10.3 0 0 1-8.8-14c1.4-3.7 5-6.3 9-6.3h6.4zM291 31.5A32 32 0 0 1 322.8 0h30.8c.6 0 1.2.5 1.2 1.2v61.5c0 1.1-1.3 1.7-2.2 1l-19.2-17a18 18 0 0 1-11 3.4 18.1 18.1 0 1 1 18.2-14.8c-.1.4-.5.7-.9.6-.1 0-.3 0-.4-.2l-3.8-3.4c-.4-.3-.6-.8-.7-1.4a12 12 0 1 0-2.4 8.3c.4-.4 1-.5 1.6-.2l14.7 13.1v-46H323a26 26 0 1 0 10 49.7c.8-.4 1.6-.2 2.3.3l3 2.7c.3.2.3.7 0 1l-.2.2a32 32 0 0 1-47.2-28.6z"
                          ></path>
                          <path
                            className="hidden dark:block"
                            fill="url(#algolia-gradient-dark)"
                            d="M534.4 9.1H528a.8.8 0 0 1-.7-.7V1.8c0-.4.2-.7.6-.8l6.5-1c.4 0 .8.2.9.6v7.8c0 .4-.4.7-.8.7zM428 35.2V.8c0-.5-.3-.8-.7-.8h-.2l-6.4 1c-.4 0-.7.4-.7.8v35c0 1.6 0 11.8 12.3 12.2.5 0 .8-.4.8-.8V43c0-.4-.3-.7-.6-.8-4.5-.5-4.5-6-4.5-7zm106.5-21.8H528c-.4 0-.7.4-.7.8v34c0 .4.3.8.7.8h6.5c.4 0 .8-.4.8-.8v-34c0-.5-.4-.8-.8-.8zm-17.7 21.8V.8c0-.5-.3-.8-.8-.8l-6.5 1c-.4 0-.7.4-.7.8v35c0 1.6 0 11.8 12.3 12.2.4 0 .8-.4.8-.8V43c0-.4-.3-.7-.7-.8-4.4-.5-4.4-6-4.4-7zm-22.2-20.6a16.5 16.5 0 0 1 8.6 9.3c.8 2.2 1.3 4.8 1.3 7.5a19.4 19.4 0 0 1-4.6 12.6 14.8 14.8 0 0 1-5.2 3.6c-2 .9-5.2 1.4-6.8 1.4a21 21 0 0 1-6.7-1.4 15.4 15.4 0 0 1-8.6-9.3 21.3 21.3 0 0 1 0-14.4 15.2 15.2 0 0 1 8.6-9.3c2-.8 4.3-1.2 6.7-1.2s4.6.4 6.7 1.2zm-6.7 27.6c2.7 0 4.7-1 6.2-3s2.2-4.3 2.2-7.8-.7-6.3-2.2-8.3-3.5-3-6.2-3-4.7 1-6.1 3c-1.5 2-2.2 4.8-2.2 8.3s.7 5.8 2.2 7.8 3.5 3 6.2 3zm-88.8-28.8c-6.2 0-11.7 3.3-14.8 8.2a18.6 18.6 0 0 0 4.8 25.2c1.8 1.2 4 1.8 6.2 1.7s.1 0 .1 0h.9c4.2-.7 8-4 9.1-8.1v7.4c0 .4.3.7.8.7h6.4a.7.7 0 0 0 .7-.7V14.2c0-.5-.3-.8-.7-.8h-13.5zm6.3 26.5a9.8 9.8 0 0 1-5.7 2h-.5a10 10 0 0 1-9.2-14c1.4-3.7 5-6.3 9-6.3h6.4v18.3zm152.3-26.5h13.5c.5 0 .8.3.8.7v33.7c0 .4-.3.7-.8.7h-6.4a.7.7 0 0 1-.8-.7v-7.4c-1.2 4-4.8 7.4-9 8h-.1a4.2 4.2 0 0 1-.5.1h-.9a10.3 10.3 0 0 1-7-2.6c-4-3.3-6.5-8.4-6.5-14.2 0-3.7 1-7.2 3-10 3-5 8.5-8.3 14.7-8.3zm.6 28.4c2.2-.1 4.2-.6 5.7-2V21.7h-6.3a9.8 9.8 0 0 0-9 6.4 10.2 10.2 0 0 0 9.1 13.9h.5zM452.8 13.4c-6.2 0-11.7 3.3-14.8 8.2a18.5 18.5 0 0 0 3.6 24.3 10.4 10.4 0 0 0 13 .6c2.2-1.5 3.8-3.7 4.5-6.1v7.8c0 2.8-.8 5-2.2 6.3-1.5 1.5-4 2.2-7.5 2.2l-6-.3c-.3 0-.7.2-.8.5l-1.6 5.5c-.1.4.1.8.5 1h.1c2.8.4 5.5.6 7 .6 6.3 0 11-1.4 14-4.1 2.7-2.5 4.2-6.3 4.5-11.4V14.2c0-.5-.4-.8-.8-.8h-13.5zm6.3 8.2v18.3a9.6 9.6 0 0 1-5.6 2h-1a10.3 10.3 0 0 1-8.8-14c1.4-3.7 5-6.3 9-6.3h6.4zM291 31.5A32 32 0 0 1 322.8 0h30.8c.6 0 1.2.5 1.2 1.2v61.5c0 1.1-1.3 1.7-2.2 1l-19.2-17a18 18 0 0 1-11 3.4 18.1 18.1 0 1 1 18.2-14.8c-.1.4-.5.7-.9.6-.1 0-.3 0-.4-.2l-3.8-3.4c-.4-.3-.6-.8-.7-1.4a12 12 0 1 0-2.4 8.3c.4-.4 1-.5 1.6-.2l14.7 13.1v-46H323a26 26 0 1 0 10 49.7c.8-.4 1.6-.2 2.3.3l3 2.7c.3.2.3.7 0 1l-.2.2a32 32 0 0 1-47.2-28.6z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
