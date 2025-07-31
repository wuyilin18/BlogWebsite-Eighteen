"use client";

import React, { useState, useMemo, useEffect } from "react";
import Masonry from "@/components/reactbits/Masonry";
import { imageData } from "./image-data";
import { motion } from "framer-motion";

const SiliconIcon = () => (
  <div className="relative w-12 h-12 mr-6">
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-float"
    >
      {/* 图库元素 - 堆叠的画廊/照片 */}
      <g transform="rotate(-5 24 24)">
        <rect
          x="8"
          y="12"
          width="32"
          height="24"
          rx="2"
          fill="#a0a0a0"
          stroke="#808080"
          strokeWidth="1.5"
        />
        <rect x="12" y="15" width="24" height="15" fill="#c0c0c0" />
      </g>
      <g transform="rotate(5 24 24)">
        <rect
          x="10"
          y="10"
          width="32"
          height="24"
          rx="2"
          fill="#b0b0b0"
          stroke="#909090"
          strokeWidth="1.5"
        />
        <rect x="14" y="13" width="24" height="15" fill="#d0d0d0" />
      </g>
      <g>
        <rect
          x="12"
          y="14"
          width="32"
          height="24"
          rx="2"
          fill="#f0f0f0"
          stroke="#d0d0d0"
          strokeWidth="1.5"
        />
        <rect x="16" y="17" width="24" height="15" fill="#ffffff" />
        <path
          d="M18 30 l6 -8 l4 4 l6 -6 l4 8"
          stroke="#a0a0a0"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="28" cy="21" r="2" fill="#FFD700" />
      </g>
    </svg>
  </div>
);

const CloudFluteIcon = () => (
  <div className="relative w-16 h-12 ml-6 animate-cloud">
    <svg
      width="72"
      height="56"
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 云端背景 */}
      <path
        d="M20,32 C12,32 8,26 8,20 C8,14 14,10 20,12 C22,6 30,6 34,10 C38,4 50,8 48,16 C54,18 56,28 50,32 C46,38 28,36 20,32 Z"
        fill="url(#cloud-gradient)"
        style={{ filter: "blur(1px)" }}
      />

      {/* 竹笛元素 - 绿色竹萧 */}
      <rect
        x="31.5"
        y="16"
        width="3.5"
        height="26"
        rx="1.75"
        fill="url(#flute-gradient)"
        className="animate-bamboo-sway"
        style={{
          transformOrigin: "center bottom",
          animationDuration: "8s",
        }}
      />

      {/* 竹节 */}
      <rect x="31.5" y="21" width="3.5" height="1" fill="#3a5a40" />
      <rect x="31.5" y="28" width="3.5" height="1" fill="#3a5a40" />
      <rect x="31.5" y="35" width="3.5" height="1" fill="#3a5a40" />

      {/* 吹奏口 */}
      <circle cx="33.25" cy="16" r="2" fill="#3a5a40" />

      {/* API和界面编织的数字史诗 - 音符和代码片段 */}
      <path
        d="M26,19 L23,21 L26,23"
        stroke="#4a7856"
        strokeWidth="1"
        className="animate-float"
        style={{ animationDelay: "0.2s" }}
      />
      <path
        d="M40,18 L43,20 L40,22"
        stroke="#4a7856"
        strokeWidth="1"
        className="animate-float"
        style={{ animationDelay: "0.5s" }}
      />
      <path
        d="M27,27 C24,27 24,30 27,30"
        stroke="#4a7856"
        strokeWidth="1"
        className="animate-float"
        style={{ animationDelay: "0.3s" }}
      />
      <path
        d="M39,26 L42,26 L42,29"
        stroke="#4a7856"
        strokeWidth="1"
        className="animate-float"
        style={{ animationDelay: "0.7s" }}
      />

      {/* 流动的音乐线条 */}
      <path
        d="M20,10 C25,8 30,12 35,9"
        stroke="#4a7856"
        strokeWidth="0.75"
        strokeDasharray="2 1"
        className="animate-circuit"
        style={{ animationDelay: "0.1s" }}
      />
      <path
        d="M15,16 C20,14 25,18 30,15"
        stroke="#4a7856"
        strokeWidth="0.75"
        strokeDasharray="2 1"
        className="animate-circuit"
        style={{ animationDelay: "0.4s" }}
      />

      <defs>
        <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#808080" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a0a0a0" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="flute-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#588157" />
          <stop offset="100%" stopColor="#a3b18a" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

interface ImageItem {
  id: string;
  img: string;
  url: string;
  height: number;
  category: string;
}

const GalleryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // 启动进场动画
    setTimeout(() => {
      setAnimate(true);
    }, 300);
  }, []);

  const allItems: ImageItem[] = imageData;

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") {
      return allItems;
    }
    return allItems.filter((item) => item.category === activeFilter);
  }, [activeFilter, allItems]);

  const categories = useMemo(() => {
    const cats = new Set(allItems.map((item) => item.category));
    return ["all", ...Array.from(cats)];
  }, [allItems]);

  return (
    <div className="min-h-screen w-full pt-28 md:pt-32 pb-20 px-4 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translate3d(0, 10px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes floatUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes rotateIn {
          0% { transform: rotate(-5deg) scale(0.95); opacity: 0; }
          100% { transform: rotate(0) scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes circuitFlow {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(10px) translateY(-5px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes circuitBlink {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes circuitPulse {
          0% { stroke-width: 1; opacity: 0.7; }
          50% { stroke-width: 1.5; opacity: 1; }
          100% { stroke-width: 1; opacity: 0.7; }
        }
        @keyframes ledBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
        @keyframes dataFlow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-float-up {
          animation: floatUp 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }
        .animate-rotate-in {
          animation: rotateIn 0.8s ease-out forwards;
        }
        .animate-spin {
          animation: spin 8s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-circuit {
          stroke-dasharray: 100;
          animation: circuitFlow 3s linear infinite;
        }
        .animate-cloud {
          animation: cloudDrift 8s ease-in-out infinite;
        }
        .animate-circuit-blink {
          animation: circuitBlink 4s ease-in-out infinite;
        }
        .animate-circuit-pulse {
          animation: circuitPulse 3s ease-in-out infinite;
        }
        .animate-led-blink {
          animation: ledBlink 2s ease-in-out infinite;
        }
        .animate-data-flow {
          stroke-dasharray: 4, 2;
          animation: dataFlow 2s linear infinite;
        }
        
        /* 粒子效果 - 硅路云融合 */
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: screen;
          z-index: 1;
        }
        .particle:nth-child(1) {
          width: 35px;
          height: 35px;
          top: 15%;
          left: 12%;
          background: radial-gradient(circle at center, rgba(86, 207, 225, 0.3), rgba(20, 20, 20, 0.01));
          filter: blur(8px);
          animation: float 7s ease-in-out infinite;
        }
        .particle:nth-child(2) {
          width: 25px;
          height: 25px;
          top: 25%;
          right: 15%;
          background: radial-gradient(circle at center, rgba(157, 78, 221, 0.4), rgba(20, 20, 20, 0.01));
          filter: blur(6px);
          animation: float 8s ease-in-out infinite reverse;
        }
        .particle:nth-child(3) {
          width: 40px;
          height: 40px;
          bottom: 20%;
          right: 25%;
          background: radial-gradient(circle at center, rgba(255, 148, 112, 0.2), rgba(20, 20, 20, 0.01));
          filter: blur(10px);
          animation: float 9s ease-in-out infinite;
        }
        .particle:nth-child(4) {
          width: 30px;
          height: 30px;
          bottom: 30%;
          left: 20%;
          background: radial-gradient(circle at center, rgba(86, 207, 225, 0.4), rgba(20, 20, 20, 0.01));
          filter: blur(8px);
          animation: float 6s ease-in-out infinite reverse;
        }
      `,
        }}
      />

      <div className="mx-auto max-w-screen-xl px-6 sm:px-10 md:px-16 lg:px-20">
        <div
          className={`text-center mb-12 opacity-0 ${
            animate ? "animate-float-up" : ""
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-center mb-3">
            <SiliconIcon />
            <h1
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] inline-block relative"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            >
              拾光集
              <span className="absolute -top-4 -right-6 text-sm font-normal text-[#9D4EDD] dark:text-[#b0b0b0]">
                于光影间，定格诗篇
              </span>
            </h1>
            <CloudFluteIcon />
          </div>
          <p className="text-[#606060] dark:text-[#b0b0b0] mt-2 max-w-lg mx-auto relative z-10 font-medium text-sm">
            当流动画卷凝于一瞬，便化作无声的诗。<br></br>
            在此收藏的，是触动心弦的色彩，是跨越次元的低语，是永不落幕的梦。
          </p>
        </div>

        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-6 md:p-8 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 ${
            animate ? "animate-scale-in" : ""
          }`}
          style={{
            animationDelay: "0.3s",
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.03)",
            border: "1px solid rgba(150, 150, 150, 0.1)",
          }}
        >
          {/* 硅路云融合背景 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>

            <svg
              width="100%"
              height="100%"
              className="absolute inset-0 pointer-events-none"
            >
              <path
                d="M0,100 H300 V250 H150 V350 H400 V200 H600"
                stroke="#56CFE1"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "0.5s", opacity: 0.1 }}
              />
              <path
                d="M0,300 H100 V150 H200 V50 H450 V150 H600"
                stroke="#9D4EDD"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "1s", opacity: 0.1 }}
              />
              <path
                d="M50,0 V150 H250 V300 H400 V200 H600"
                stroke="#FF9470"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "1.5s", opacity: 0.1 }}
              />

              <circle
                cx="250"
                cy="300"
                r="3"
                fill="#56CFE1"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "0.2s" }}
              />
              <circle
                cx="200"
                cy="50"
                r="3"
                fill="#9D4EDD"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "0.8s" }}
              />
              <circle
                cx="400"
                cy="200"
                r="3"
                fill="#FF9470"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "1.2s" }}
              />
            </svg>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mb-12 relative z-10">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`cursor-target px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeFilter === category
                    ? "bg-gray-800 text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>

          <div className="relative z-10">
            <Masonry
              items={filteredItems}
              animateFrom="bottom"
              duration={0.8}
              stagger={0.05}
              ease="power4.out"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
