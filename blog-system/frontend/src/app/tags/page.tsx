"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getTags } from "@/lib/strapi";

// 使用与 strapi.ts 兼容的类型定义
interface ProcessedTag {
  name: string;
  count: number;
}

const Tags: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [tags, setTags] = useState<ProcessedTag[]>([]);

  // 获取标签数据
  useEffect(() => {
    async function fetchTags() {
      try {
        const tagsData = await getTags();

        // 简化数据处理，因为 fetchAPI 确保了数据结构的一致性
        const tagList: ProcessedTag[] = (tagsData?.data || []).map((tag) => {
          const name = tag.attributes?.name ?? "未命名";
          const count = tag.attributes?.posts?.data?.length ?? 0;
          return { name, count };
        });

        setTags(tagList);
        setVisibleTags(tagList.map((tag) => tag.name));
      } catch (error) {
        console.error("获取标签失败:", error);
        setTags([]);
        setVisibleTags([]);
      }
    }
    fetchTags();

    // 启动进场动画
    setTimeout(() => {
      setAnimate(true);
    }, 300);
  }, []);

  // 计算标签权重 - 用于字体大小
  const maxCount =
    tags.length > 0 ? Math.max(...tags.map((tag) => tag.count)) : 1;
  const minCount =
    tags.length > 0 ? Math.min(...tags.map((tag) => tag.count)) : 0;
  const range = maxCount - minCount || 1;

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
        @keyframes inkSpread {
          0% { transform: scale(0.95); opacity: 0.7; filter: blur(2px); }
          50% { transform: scale(1.02); opacity: 0.9; filter: blur(1px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes inkDrop {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        @keyframes inkStroke {
          0% { stroke-dashoffset: 1000; opacity: 0.3; }
          100% { stroke-dashoffset: 0; opacity: 0.7; }
        }
        @keyframes bambooSway {
          0% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
          100% { transform: rotate(-1deg); }
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
        .animate-ink-spread {
          animation: inkSpread 3s ease-in-out infinite;
        }
        .animate-ink-drop {
          animation: inkDrop 2s ease-out forwards;
        }
        .animate-ink-stroke {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: inkStroke 2s ease-out forwards;
        }
        .animate-bamboo-sway {
          animation: bambooSway 5s ease-in-out infinite;
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
        
        /* 粒子效果 - 硅原风 */
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: overlay;
          z-index: 1;
        }
        .particle:nth-child(1) {
          width: 35px;
          height: 35px;
          top: 15%;
          left: 12%;
          background: radial-gradient(circle at center, rgba(80, 120, 86, 0.3), rgba(20, 20, 20, 0.01));
          filter: blur(8px);
          animation: float 7s ease-in-out infinite;
        }
        .particle:nth-child(2) {
          width: 25px;
          height: 25px;
          top: 25%;
          right: 15%;
          background: radial-gradient(circle at center, rgba(20, 20, 20, 0.4), rgba(20, 20, 20, 0.01));
          filter: blur(6px);
          animation: float 8s ease-in-out infinite reverse;
        }
        .particle:nth-child(3) {
          width: 40px;
          height: 40px;
          bottom: 20%;
          right: 25%;
          background: radial-gradient(circle at center, rgba(80, 120, 86, 0.2), rgba(20, 20, 20, 0.01));
          filter: blur(10px);
          animation: float 9s ease-in-out infinite;
        }
        .particle:nth-child(4) {
          width: 30px;
          height: 30px;
          bottom: 30%;
          left: 20%;
          background: radial-gradient(circle at center, rgba(20, 20, 20, 0.4), rgba(20, 20, 20, 0.01));
          filter: blur(8px);
          animation: float 6s ease-in-out infinite reverse;
        }
        .particle:nth-child(5) {
          width: 20px;
          height: 20px;
          top: 40%;
          right: 10%;
          background: radial-gradient(circle at center, rgba(80, 120, 86, 0.3), rgba(20, 20, 20, 0.01));
          filter: blur(5px);
          animation: float 7s ease-in-out infinite;
        }
        .particle:nth-child(6) {
          width: 45px;
          height: 45px;
          top: 70%;
          left: 15%;
          background: radial-gradient(circle at center, rgba(20, 20, 20, 0.3), rgba(20, 20, 20, 0.01));
          filter: blur(12px);
          animation: float 8s ease-in-out infinite reverse;
        }
        
        /* 二进制风沙效果 */
        .binary-sand {
          position: absolute;
          font-family: monospace;
          font-size: 10px;
          color: rgba(20, 20, 20, 0.15);
          pointer-events: none;
          z-index: 0;
          white-space: nowrap;
        }
        .binary-sand:nth-child(1) {
          top: 15%;
          left: 5%;
          animation: dataFlow 8s ease-in-out infinite;
        }
        .binary-sand:nth-child(2) {
          top: 35%;
          right: 7%;
          animation: dataFlow 7s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .binary-sand:nth-child(3) {
          bottom: 20%;
          left: 10%;
          animation: dataFlow 9s ease-in-out infinite;
          animation-delay: 1s;
        }
        .binary-sand:nth-child(4) {
          bottom: 35%;
          right: 15%;
          animation: dataFlow 6s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        
        /* 墨水滴落效果 */
        .ink-drop {
          position: absolute;
          transform-origin: center;
          z-index: 0;
        }
        .ink-drop:nth-child(1) {
          width: 250px;
          height: 250px;
          top: 5%;
          right: 2%;
          background-image: url("data:image/svg+xml,%3Csvg width='250' height='250' viewBox='0 0 250 250' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M125,10 C160,10 200,50 230,100 C240,150 200,220 125,230 C50,240 10,190 20,125 C30,60 90,10 125,10 Z' fill='rgba(80, 120, 86, 0.03)' /%3E%3C/svg%3E");
          animation-delay: 0.2s;
          opacity: 0;
          animation: inkDrop 3s ease-out forwards;
        }
        .ink-drop:nth-child(2) {
          width: 200px;
          height: 200px;
          bottom: 10%;
          left: 5%;
          background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100,20 C150,20 170,60 180,100 C190,140 170,170 110,180 C50,190 20,150 20,100 C20,50 50,20 100,20 Z' fill='rgba(70, 70, 70, 0.02)' /%3E%3C/svg%3E");
          animation-delay: 0.5s;
          opacity: 0;
          animation: inkDrop 3s ease-out forwards;
        }
        .ink-drop:nth-child(3) {
          width: 300px;
          height: 300px;
          top: 40%;
          left: -5%;
          background-image: url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M150,30 C200,30 250,80 270,150 C280,220 250,260 150,270 C50,280 20,220 30,150 C40,80 100,30 150,30 Z' fill='rgba(80, 120, 86, 0.015)' /%3E%3C/svg%3E");
          animation-delay: 0.8s;
          opacity: 0;
          animation: inkDrop 3s ease-out forwards;
        }
        
        /* 墨迹笔触 */
        .ink-stroke {
          position: absolute;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          stroke: rgba(20, 20, 20, 0.1);
          fill: none;
          z-index: 0;
        }
        
        /* 标签样式 */
        .tag-item {
          transition: all 0.3s ease;
          position: relative;
          backface-visibility: hidden;
        }
        .tag-item:hover {
          transform: translateY(-3px);
          z-index: 5;
        }
        .tag-appear {
          opacity: 0;
          transform: translateY(20px);
          animation: floatUp 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
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
            {/* 左侧硅原元素 - 电路板样式 */}
            <div className="relative w-12 h-12 mr-6">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-circuit-blink"
              >
                {/* 电路板轮廓 */}
                <rect
                  x="4"
                  y="4"
                  width="40"
                  height="40"
                  rx="2"
                  stroke="#505050"
                  strokeWidth="1.5"
                  fill="none"
                  className="animate-circuit-pulse"
                  style={{ animationDelay: "0.2s" }}
                />

                {/* CPU/芯片 */}
                <rect
                  x="16"
                  y="16"
                  width="16"
                  height="16"
                  rx="1"
                  stroke="#606060"
                  strokeWidth="1"
                  fill="none"
                />

                {/* 芯片引脚 */}
                <line
                  x1="16"
                  y1="20"
                  x2="12"
                  y2="20"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                />
                <line
                  x1="16"
                  y1="24"
                  x2="12"
                  y2="24"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.2s" }}
                />
                <line
                  x1="16"
                  y1="28"
                  x2="12"
                  y2="28"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.4s" }}
                />

                <line
                  x1="32"
                  y1="20"
                  x2="36"
                  y2="20"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.3s" }}
                />
                <line
                  x1="32"
                  y1="24"
                  x2="36"
                  y2="24"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.5s" }}
                />
                <line
                  x1="32"
                  y1="28"
                  x2="36"
                  y2="28"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.7s" }}
                />

                <line
                  x1="20"
                  y1="16"
                  x2="20"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.1s" }}
                />
                <line
                  x1="24"
                  y1="16"
                  x2="24"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.6s" }}
                />
                <line
                  x1="28"
                  y1="16"
                  x2="28"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.3s" }}
                />

                <line
                  x1="20"
                  y1="32"
                  x2="20"
                  y2="36"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.5s" }}
                />
                <line
                  x1="24"
                  y1="32"
                  x2="24"
                  y2="36"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.2s" }}
                />
                <line
                  x1="28"
                  y1="32"
                  x2="28"
                  y2="36"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.4s" }}
                />

                {/* LED灯 */}
                <circle
                  cx="8"
                  cy="8"
                  r="2"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.2s" }}
                />
                <circle
                  cx="40"
                  cy="8"
                  r="2"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.8s" }}
                />
                <circle
                  cx="40"
                  cy="40"
                  r="2"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.5s" }}
                />
                <circle
                  cx="8"
                  cy="40"
                  r="2"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "1s" }}
                />

                {/* 数据流位置标记 */}
                <text
                  x="23"
                  y="24"
                  fill="#505050"
                  fontSize="4"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  Si
                </text>
              </svg>
            </div>
            {/* <h1
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#505050] to-[#808080] dark:from-[#a0a0a0] dark:to-[#d0d0d0] inline-block relative"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            > */}
            <h1
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] inline-block relative"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            >
              标签云
              {/* <span className="absolute -top-4 -right-4 text-sm font-normal text-[#5a5a5a] dark:text-[#b0b0b0]"> */}
              <span className="absolute -top-4 -right-6 text-sm font-normal text-[#9D4EDD] dark:text-[#b0b0b0]">
                硅原游牧
              </span>
            </h1>

            {/* 右侧云端元素 - 云朵和竹笛组合 */}
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
                  <linearGradient
                    id="cloud-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#808080" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a0a0a0" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient
                    id="flute-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#588157" />
                    <stop offset="100%" stopColor="#a3b18a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-[#606060] dark:text-[#b0b0b0] mt-2 max-w-lg mx-auto relative z-10 font-medium text-sm">
              在硅原的二进制风沙中逐水草而居，用API和界面编织云端数字史诗
            </p>
            <div
              className="relative ml-2 animate-bamboo-sway"
              style={{ transformOrigin: "bottom center" }}
            >
              <svg
                width="42"
                height="42"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 竹萧主体 - 绿色渐变 */}
                <rect
                  x="14"
                  y="4"
                  width="4"
                  height="24"
                  rx="2"
                  fill="url(#bamboo-gradient)"
                />

                {/* 竹节 */}
                <rect x="14" y="8" width="4" height="1" fill="#3a5a40" />
                <rect x="14" y="14" width="4" height="1" fill="#3a5a40" />
                <rect x="14" y="20" width="4" height="1" fill="#3a5a40" />

                {/* 吹奏口 */}
                <circle cx="16" cy="4" r="2" fill="#3a5a40" />

                {/* 代码音符 - API调用 */}
                <path
                  d="M10,10 C8,10 8,12 8,12 L8,13"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.1s" }}
                />
                <path
                  d="M10,14 C8,14 8,16 8,16 L8,17"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.3s" }}
                />

                {/* 代码音符 - 界面元素 */}
                <path
                  d="M22,8 L22,10 L24,10"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.5s" }}
                />
                <path
                  d="M22,12 L22,14 L24,14"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.7s" }}
                />

                {/* 代码音符 - 数字史诗 */}
                <path
                  d="M11,18 L9,20 L11,22"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.2s" }}
                />
                <path
                  d="M21,18 L23,20 L21,22"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.4s" }}
                />

                {/* 渐变定义 */}
                <defs>
                  <linearGradient
                    id="bamboo-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#588157" />
                    <stop offset="100%" stopColor="#a3b18a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
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
          {/* 电路板背景元素 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 墨点和墨痕 */}
            <div className="ink-drop"></div>
            <div className="ink-drop"></div>
            <div className="ink-drop"></div>

            {/* 电路板图案元素 */}
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0 pointer-events-none"
            >
              {/* 电路轨道 */}
              <path
                d="M0,100 H300 M300,100 V250 M300,250 H150 M150,250 V350 M150,350 H400 M400,350 V200 M400,200 H600"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "0.5s", opacity: 0.2 }}
              />
              <path
                d="M0,300 H100 M100,300 V150 M100,150 H200 M200,150 V50 M200,50 H450 M450,50 V150 M450,150 H600"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "1s", opacity: 0.2 }}
              />
              <path
                d="M50,0 V150 M50,150 H250 M250,150 V300 M250,300 H400 M400,300 V200 M400,200 H600"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "1.5s", opacity: 0.2 }}
              />

              {/* 电阻元件 */}
              <rect
                x="175"
                y="98"
                width="25"
                height="8"
                fill="#505050"
                fillOpacity="0.2"
              />
              <rect
                x="375"
                y="348"
                width="25"
                height="8"
                fill="#505050"
                fillOpacity="0.2"
                transform="rotate(-90 375 348)"
              />

              {/* 电容元件 */}
              <line
                x1="98"
                y1="275"
                x2="98"
                y2="285"
                stroke="#505050"
                strokeWidth="3"
                strokeOpacity="0.2"
              />
              <line
                x1="102"
                y1="275"
                x2="102"
                y2="285"
                stroke="#505050"
                strokeWidth="3"
                strokeOpacity="0.2"
              />
              <line
                x1="248"
                y1="175"
                x2="258"
                y2="175"
                stroke="#505050"
                strokeWidth="3"
                strokeOpacity="0.2"
              />
              <line
                x1="248"
                y1="179"
                x2="258"
                y2="179"
                stroke="#505050"
                strokeWidth="3"
                strokeOpacity="0.2"
              />

              {/* 集成电路/芯片 */}
              <rect
                x="425"
                y="75"
                width="50"
                height="30"
                rx="2"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeOpacity="0.2"
              />
              <line
                x1="435"
                y1="75"
                x2="435"
                y2="105"
                stroke="#505050"
                strokeWidth="1"
                strokeOpacity="0.2"
              />
              <line
                x1="445"
                y1="75"
                x2="445"
                y2="105"
                stroke="#505050"
                strokeWidth="1"
                strokeOpacity="0.2"
              />
              <line
                x1="455"
                y1="75"
                x2="455"
                y2="105"
                stroke="#505050"
                strokeWidth="1"
                strokeOpacity="0.2"
              />
              <line
                x1="465"
                y1="75"
                x2="465"
                y2="105"
                stroke="#505050"
                strokeWidth="1"
                strokeOpacity="0.2"
              />

              {/* LED指示灯 */}
              <circle
                cx="250"
                cy="300"
                r="4"
                fill="#4a7856"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "0.2s" }}
              />
              <circle
                cx="200"
                cy="50"
                r="4"
                fill="#4a7856"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "0.8s" }}
              />
              <circle
                cx="400"
                cy="200"
                r="4"
                fill="#4a7856"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "1.2s" }}
              />
              <circle
                cx="150"
                cy="350"
                r="4"
                fill="#4a7856"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "1.6s" }}
              />
            </svg>

            {/* 墨笔触 */}
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0 pointer-events-none"
            >
              {/* 电路路径 - 硅原 */}
              <path
                d="M50,50 C100,20 200,80 300,40 C400,10 500,50 600,30"
                stroke="#505050"
                strokeWidth="0.75"
                strokeDasharray="4 2"
                className="ink-stroke animate-circuit"
                style={{ animationDelay: "0.5s" }}
              />
              <path
                d="M10,200 C150,150 250,250 350,180 C450,120 550,180 650,150"
                stroke="#505050"
                strokeWidth="0.75"
                strokeDasharray="4 2"
                className="ink-stroke animate-circuit"
                style={{ animationDelay: "1s" }}
              />

              {/* 竹笛音符路径 - 云端 */}
              <path
                d="M700,350 C600,300 500,400 400,350 C300,300 200,380 100,320"
                stroke="#4a7856"
                strokeWidth="0.75"
                className="ink-stroke"
                style={{ animationDelay: "1.5s" }}
              />
              <path
                d="M650,120 C550,150 450,80 350,130 C250,180 150,120 50,160"
                stroke="#4a7856"
                strokeWidth="0.75"
                className="ink-stroke"
                style={{ animationDelay: "2s" }}
              />

              {/* 代码临时帐篷 - 硅原 */}
              <path
                d="M100,250 L150,200 L200,250"
                stroke="#505050"
                strokeWidth="0.75"
                className="ink-stroke animate-tent-sway"
                style={{
                  transformOrigin: "center bottom",
                  animationDelay: "0.3s",
                }}
              />
              <path
                d="M400,100 L450,50 L500,100"
                stroke="#505050"
                strokeWidth="0.75"
                className="ink-stroke animate-tent-sway"
                style={{
                  transformOrigin: "center bottom",
                  animationDelay: "0.7s",
                }}
              />
            </svg>

            {/* 墨滴粒子 */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>

          {/* 装饰性线条 - 硅原电路风格 */}
          <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>

          {/* 标签云 */}
          <div className="flex flex-wrap justify-center gap-3 relative z-10 py-8">
            {tags.map((tag, index) => {
              // 计算字体大小权重 (0.9-1.5之间)
              const fontWeight =
                tag.count === minCount
                  ? 0.9
                  : 0.9 + ((tag.count - minCount) / range) * 0.6;

              // 计算颜色深浅 (30-70之间)
              const colorDepth = Math.floor(
                30 + ((tag.count - minCount) / range) * 40
              );

              // 硅原与云端色彩混合
              const isGreen = index % 3 === 0; // 每三个标签一个绿色调

              // 计算是否为活跃标签
              const isActive = hoveredTag === tag.name;
              const isVisible = visibleTags.includes(tag.name);

              return (
                <Link
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  key={tag.name}
                  className="tag-appear cursor-target"
                  style={
                    {
                      "--delay": `${0.1 + index * 0.03}s`,
                    } as React.CSSProperties
                  }
                  onMouseEnter={() => setHoveredTag(tag.name)}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                  <div
                    className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-all duration-300 transform ${
                      isActive ? "scale-110 translate-y-[-2px]" : ""
                    }`}
                    style={{
                      background: isGreen
                        ? `rgba(${colorDepth}, ${
                            colorDepth + 30
                          }, ${colorDepth}, 0.05)`
                        : `rgba(${colorDepth}, ${colorDepth}, ${colorDepth}, 0.05)`,
                      border: isGreen
                        ? `1px solid rgba(${colorDepth}, ${
                            colorDepth + 30
                          }, ${colorDepth}, 0.2)`
                        : `1px solid rgba(${colorDepth}, ${colorDepth}, ${colorDepth}, 0.2)`,
                      boxShadow: isActive
                        ? `0 4px 15px rgba(0, 0, 0, 0.1)`
                        : isVisible
                        ? `0 2px 8px rgba(0, 0, 0, 0.05)`
                        : "none",
                      fontSize: `${fontWeight}rem`,
                    }}
                  >
                    <span
                      className={`mr-1.5 ${
                        isGreen
                          ? "text-green-700/40 dark:text-green-500/40"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      #
                    </span>
                    <span
                      className={`mr-2 ${
                        isGreen
                          ? "text-green-800 dark:text-green-300"
                          : "text-gray-700 dark:text-gray-200"
                      } group-hover:text-gray-900 dark:group-hover:text-white transition-colors`}
                    >
                      {tag.name}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full transition-colors"
                      style={{
                        backgroundColor: isGreen
                          ? `rgba(${colorDepth}, ${
                              colorDepth + 30
                            }, ${colorDepth}, ${isActive ? 0.2 : 0.1})`
                          : `rgba(${colorDepth + 10}, ${colorDepth + 10}, ${
                              colorDepth + 10
                            }, ${isActive ? 0.2 : 0.1})`,
                        color: isGreen
                          ? `rgb(${colorDepth}, ${
                              colorDepth + 30
                            }, ${colorDepth})`
                          : `rgb(${colorDepth + 20}, ${colorDepth + 20}, ${
                              colorDepth + 20
                            })`,
                      }}
                    >
                      {tag.count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 中央装饰图案 - 电路板与云的融合 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none w-64 h-64">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full animate-spin"
              style={{ animationDuration: "60s" }}
            >
              <defs>
                <linearGradient
                  id="center-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#505050" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#4a7856" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#808080" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* 集成电路图案 */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="url(#center-gradient)"
                strokeWidth="0.5"
                strokeDasharray="5,5"
              />
              <circle
                cx="100"
                cy="100"
                r="40"
                stroke="#606060"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="3,3"
              />

              {/* CPU芯片中心 */}
              <rect
                x="80"
                y="80"
                width="40"
                height="40"
                rx="2"
                stroke="#606060"
                strokeWidth="0.5"
                fill="none"
              />

              {/* 电路连接路径 */}
              <path
                d="M80,90 H60"
                stroke="#606060"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />
              <path
                d="M80,100 H70 V80 H100"
                stroke="#606060"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />
              <path
                d="M80,110 H65 V130 H100"
                stroke="#606060"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />

              <path
                d="M120,90 H140"
                stroke="#606060"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />
              <path
                d="M120,100 H130 V80 H100"
                stroke="#606060"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />
              <path
                d="M120,110 H135 V130 H100"
                stroke="#606060"
                strokeWidth="0.5"
                strokeDasharray="2,1"
              />

              {/* 电路板外圆路径 */}
              <path
                d="M20,100 C20,55 55,20 100,20 C145,20 180,55 180,100 C180,145 145,180 100,180 C55,180 20,145 20,100 Z"
                stroke="#606060"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="3,2"
              />

              {/* 竹笛图案 - 云端 */}
              <rect
                x="95"
                y="40"
                width="10"
                height="30"
                rx="5"
                fill="url(#center-gradient)"
                fillOpacity="0.3"
              />
              <circle
                cx="100"
                cy="40"
                r="5"
                fill="url(#center-gradient)"
                fillOpacity="0.3"
              />

              {/* 连接线 */}
              <path
                d="M100,20 C100,20 150,30 180,100"
                stroke="#707070"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="2,2"
              />
              <path
                d="M180,100 C180,100 150,170 100,180"
                stroke="#707070"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="2,2"
              />
              <path
                d="M100,180 C100,180 50,170 20,100"
                stroke="#707070"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="2,2"
              />
              <path
                d="M20,100 C20,100 50,30 100,20"
                stroke="#707070"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="2,2"
              />
            </svg>
          </div>
        </div>

        {/* 底部提示 - 水墨风格 */}
        <div
          className={`text-center mt-6 text-sm text-gray-500 dark:text-gray-400 opacity-0 ${
            animate ? "animate-float-up" : ""
          }`}
          style={{ animationDelay: "0.7s" }}
        >
          鼠标悬停可查看标签详情 · 点击进入对应标签页面
        </div>
      </div>
    </div>
  );
};

export default Tags;
