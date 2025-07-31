"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import FallingText from "@/components/reactbits/FallingText";
import HorizontalScroller from "@/components/Home/HorizontalScroll/HorizontalScroll";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { BackgroundBeamsWithCollision } from "@/components/AceternityUI/background-beams-with-collision";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import TwikooCommentsWrapper from "@/components/Comments/TwikooCommentsWrapper";
import { Tabs } from "@/components/AceternityUI/tabs";
import { AnimatedTooltip } from "@/components/AceternityUI/animated-tooltip";
import "@/components/Comments/styles/twikoo-custom.css"; // 导入自定义 Twikoo 样式

export default function AboutPage() {
  const [animate, setAnimate] = useState(false);
  // New state for client-side rendering of random elements
  const [isClient, setIsClient] = useState(false);
  const [showComicScroll, setShowComicScroll] = useState(false);

  // Initialize animation on component mount
  useEffect(() => {
    // Start entrance animation after a short delay
    setTimeout(() => {
      setAnimate(true);
    }, 300);

    // Set isClient to true once component mounts (client-side only)
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen w-full pt-28 md:pt-32 pb-20 px-4 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
      {/* CSS Animations */}
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
          @keyframes ledBlink {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.9; }
          }
          @keyframes dataFlow {
            0% { stroke-dashoffset: 20; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes snowfall {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(20px) rotate(360deg); }
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
          @keyframes circuitBlink {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
          }
          @keyframes circuitPulse {
            0% { stroke-width: 1; opacity: 0.7; }
            50% { stroke-width: 1.5; opacity: 1; }
            100% { stroke-width: 1; opacity: 0.7; }
          }
          @keyframes circuitFlow {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes bambooSway {
            0% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
            100% { transform: rotate(-1deg); }
          }
          @keyframes inkSplatter {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0.4; }
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
          .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-led-blink {
            animation: ledBlink 2s ease-in-out infinite;
          }
          .animate-data-flow {
            stroke-dasharray: 4, 2;
            animation: dataFlow 2s linear infinite;
          }
          .animate-snowfall {
            animation: snowfall 10s linear infinite;
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
          .animate-circuit {
            stroke-dasharray: 100;
            animation: circuitFlow 3s linear infinite;
          }
          .animate-circuit-blink {
            animation: circuitBlink 4s ease-in-out infinite;
          }
          .animate-circuit-pulse {
            animation: circuitPulse 3s ease-in-out infinite;
          }
          .animate-bamboo-sway {
            animation: bambooSway 5s ease-in-out infinite;
          }
          .animate-ink-splatter {
            animation: inkSplatter 2s ease-out forwards;
          }
          
          /* 粒子效果 - 水墨风格 */
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
            background: radial-gradient(circle at center, rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.01));
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
            background: radial-gradient(circle at center, rgba(20, 20, 20, 0.3), rgba(20, 20, 20, 0.01));
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
            background: radial-gradient(circle at center, rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.01));
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
            background-image: url("data:image/svg+xml,%3Csvg width='250' height='250' viewBox='0 0 250 250' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M125,10 C160,10 200,50 230,100 C240,150 200,220 125,230 C50,240 10,190 20,125 C30,60 90,10 125,10 Z' fill='rgba(20, 20, 20, 0.03)' /%3E%3C/svg%3E");
            animation-delay: 0.2s;
            opacity: 0;
            animation: inkDrop 3s ease-out forwards;
          }
          .ink-drop:nth-child(2) {
            width: 200px;
            height: 200px;
            bottom: 10%;
            left: 5%;
            background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100,20 C150,20 170,60 180,100 C190,140 170,170 110,180 C50,190 20,150 20,100 C20,50 50,20 100,20 Z' fill='rgba(20, 20, 20, 0.02)' /%3E%3C/svg%3E");
            animation-delay: 0.5s;
            opacity: 0;
            animation: inkDrop 3s ease-out forwards;
          }
          .ink-drop:nth-child(3) {
            width: 300px;
            height: 300px;
            top: 40%;
            left: -5%;
            background-image: url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M150,30 C200,30 250,80 270,150 C280,220 250,260 150,270 C50,280 20,220 30,150 C40,80 100,30 150,30 Z' fill='rgba(20, 20, 20, 0.015)' /%3E%3C/svg%3E");
            animation-delay: 0.8s;
            opacity: 0;
            animation: inkDrop 3s ease-out forwards;
          }
          
          /* 山形墨滴效果 */
          .mountain-ink {
            position: absolute;
            transform-origin: center;
            z-index: 0;
            opacity: 0;
            animation: inkDrop 3s ease-out forwards;
          }
          .mountain-ink:nth-child(1) {
            width: 180px;
            height: 120px;
            bottom: 20%;
            right: 8%;
            background-image: url("data:image/svg+xml,%3Csvg width='180' height='120' viewBox='0 0 180 120' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,90 L30,60 L45,75 L60,30 L75,60 L90,20 L105,60 L120,40 L135,70 L150,50 L180,90 L180,120 L0,120 Z' fill='rgba(20, 20, 20, 0.02)' /%3E%3C/svg%3E");
            animation-delay: 0.3s;
          }
          .mountain-ink:nth-child(2) {
            width: 220px;
            height: 150px;
            top: 15%;
            left: 10%;
            background-image: url("data:image/svg+xml,%3Csvg width='220' height='150' viewBox='0 0 220 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,110 L40,70 L60,90 L80,40 L100,70 L120,20 L140,80 L160,50 L180,90 L220,110 L220,150 L0,150 Z' fill='rgba(20, 20, 20, 0.025)' /%3E%3C/svg%3E");
            animation-delay: 0.6s;
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
          
          /* 墨迹溅落 */
          .ink-splatter {
            position: absolute;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: rgba(20, 20, 20, 0.2);
            filter: blur(2px);
            pointer-events: none;
            opacity: 0;
          }
          
          .snowflake {
            position: absolute;
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            filter: blur(1px);
            opacity: 0.7;
            pointer-events: none;
          }
        `,
        }}
      />

      <div className="mx-auto max-w-screen-xl px-6 sm:px-10 md:px-16 lg:px-20">
        {/* Header section */}
        <div
          className={`text-center mb-10 opacity-0 ${
            animate ? "animate-float-up" : ""
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-center mb-3">
            {/* 左侧松树简笔元素 */}
            <div className="relative w-12 h-12 mr-6">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-bamboo-sway"
                // 步骤2: 应用定义好的滤镜
                filter="url(#pine-shadow)"
              >
                {/* 步骤1: 在 <defs> 中定义滤镜 */}
                <defs>
                  <filter
                    id="pine-shadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feDropShadow
                      dx="2"
                      dy="2"
                      stdDeviation="2"
                      floodColor="#000"
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>
                {/* 松树干 */}
                <rect
                  x="21"
                  y="32"
                  width="6"
                  height="12"
                  rx="1"
                  fill="#5A3D2B"
                />

                {/* 松树枝叶 - 三角形层叠效果 */}
                <path
                  d="M24,4 L36,18 H12 Z"
                  fill="#2A9D8F"
                  fillOpacity="0.9"
                  className="animate-circuit-pulse"
                />
                <path
                  d="M24,12 L38,24 H10 Z"
                  fill="#43AA8B"
                  fillOpacity="0.85"
                  className="animate-circuit-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <path
                  d="M24,18 L40,32 H8 Z"
                  fill="#52B69A"
                  fillOpacity="0.8"
                  className="animate-circuit-pulse"
                  style={{ animationDelay: "0.4s" }}
                />

                {/* 雪覆盖效果 - 树顶部 */}
                <path
                  d="M24,4 C20,6 18,9 17,11 C20,10 28,10 31,11 C30,9 28,6 24,4 Z"
                  fill="white"
                  fillOpacity="0.9"
                />

                {/* 雪覆盖效果 - 第二层 */}
                <path
                  d="M16,17 C19,16 29,16 32,17 C31,15 30,14 28,13 C23,14 20,14 16,13 Z"
                  fill="white"
                  fillOpacity="0.8"
                />

                {/* 雪覆盖效果 - 第三层 */}
                <path
                  d="M12,32 L15,28 C18,27 30,27 33,28 L36,32 Z"
                  fill="white"
                  fillOpacity="0.7"
                />

                {/* 松针效果 */}
                <g
                  className="animate-led-blink"
                  style={{ animationDelay: "1s" }}
                >
                  <line
                    x1="18"
                    y1="17"
                    x2="16"
                    y2="15"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="22"
                    y1="13"
                    x2="20"
                    y2="10"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="26"
                    y1="13"
                    x2="28"
                    y2="10"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="30"
                    y1="17"
                    x2="32"
                    y2="15"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                </g>
                <g
                  className="animate-led-blink"
                  style={{ animationDelay: "1.5s" }}
                >
                  <line
                    x1="16"
                    y1="23"
                    x2="13"
                    y2="21"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="20"
                    y1="20"
                    x2="18"
                    y2="17"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="28"
                    y1="20"
                    x2="30"
                    y2="17"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="32"
                    y1="23"
                    x2="35"
                    y2="21"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                </g>
                <g
                  className="animate-led-blink"
                  style={{ animationDelay: "2s" }}
                >
                  <line
                    x1="12"
                    y1="30"
                    x2="9"
                    y2="28"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="17"
                    y1="28"
                    x2="14"
                    y2="25"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="31"
                    y1="28"
                    x2="34"
                    y2="25"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                  <line
                    x1="36"
                    y1="30"
                    x2="39"
                    y2="28"
                    stroke="#A7CC8E"
                    strokeWidth="0.5"
                  />
                </g>

                {/* 点缀小点 - 松果效果 */}
                <circle
                  cx="21"
                  cy="15"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.2s" }}
                />
                <circle
                  cx="27"
                  cy="15"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.5s" }}
                />
                <circle
                  cx="19"
                  cy="22"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.8s" }}
                />
                <circle
                  cx="29"
                  cy="22"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.2s" }}
                />
                <circle
                  cx="24"
                  cy="10"
                  r="1"
                  fill="#5A3D2B"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.5s" }}
                />

                {/* 飘落的雪花 */}
                <circle cx="14" cy="8" r="0.8" fill="white" />
                <circle cx="32" cy="10" r="0.6" fill="white" />
                <circle cx="10" cy="20" r="0.7" fill="white" />
                <circle cx="37" cy="24" r="0.5" fill="white" />
                <circle cx="18" cy="6" r="0.6" fill="white" />
                <circle cx="30" cy="5" r="0.5" fill="white" />

                {/* 雪压弯曲效果 - 遮罩 */}
                <path
                  d="M34,20 C30,17 28,15 24,14 C20,15 18,17 14,20 C17,16 20,12 24,12 C28,12 31,16 34,20 Z"
                  fill="#43AA8B"
                  fillOpacity="0.7"
                />
              </svg>
            </div>

            <h1
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] inline-block relative"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            >
              关于我
              <span className="absolute -top-4 -right-6 text-sm font-normal text-[#9D4EDD] dark:text-[#b0b0b0]">
                十八加十八
              </span>
            </h1>

            {/* 右侧雪云元素 */}
            <div className="relative w-16 h-12 ml-6 animate-float">
              <svg
                width="72"
                height="56"
                viewBox="0 0 64 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                filter="url(#wind-shadow)"
              >
                <defs>
                  <filter
                    id="wind-shadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feDropShadow
                      dx="2"
                      dy="2"
                      stdDeviation="2"
                      floodColor="#000"
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>
                <path
                  d="M20,32 C12,32 8,26 8,20 C8,14 14,10 20,12 C22,6 30,6 34,10 C38,4 50,8 48,16 C54,18 56,28 50,32 C46,38 28,36 20,32 Z"
                  fill="url(#cloud-gradient)"
                  style={{ filter: "blur(1px)" }}
                />

                {/* 雪花 */}
                <circle
                  cx="20"
                  cy="22"
                  r="1"
                  fill="white"
                  className="animate-float"
                  style={{ animationDelay: "0.2s" }}
                />
                <circle
                  cx="30"
                  cy="16"
                  r="1"
                  fill="white"
                  className="animate-float"
                  style={{ animationDelay: "0.5s" }}
                />
                <circle
                  cx="40"
                  cy="22"
                  r="1"
                  fill="white"
                  className="animate-float"
                  style={{ animationDelay: "0.8s" }}
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
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-[#606060] dark:text-[#b0b0b0] mt-2 max-w-lg mx-auto relative z-10 font-medium text-sm">
              『十八加十八，松风自成林』——松针写春秋，字间藏岁寒，行处有松声。
            </p>
          </div>

          {/* 山脉剪影背景 */}
          <div className="absolute top-24 left-0 w-full overflow-hidden opacity-10 dark:opacity-20 pointer-events-none z-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              preserveAspectRatio="none"
            >
              <path
                d="M0,80 L60,70 L140,90 L200,60 L260,80 L320,40 L380,70 L440,50 L500,60 L560,30 L620,50 L680,20 L740,50 L800,10 L860,40 L920,30 L980,60 L1040,40 L1100,70 L1160,50 L1220,80 L1280,60 L1340,90 L1400,70 L1440,80 L1440,120 L0,120 Z"
                fill="#505050"
              />
              <path
                d="M0,100 L60,95 L120,105 L180,90 L240,100 L300,80 L360,95 L420,85 L480,90 L540,75 L600,85 L660,65 L720,85 L780,60 L840,80 L900,70 L960,90 L1020,75 L1080,95 L1140,85 L1200,100 L1260,90 L1320,105 L1380,95 L1440,100 L1440,120 L0,120 Z"
                fill="#606060"
              />
            </svg>
          </div>
        </div>

        {/* Main content */}
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
          {/* 水墨效果 - 新风格 */}
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
                d="M0,100 H300 M300,100 V250 M300,250 H150 M150,250 V350 M150,350 H400"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "0.5s", opacity: 0.2 }}
              />
              <path
                d="M0,300 H100 M100,300 V150 M100,150 H200 M200,150 V50 M200,50 H450"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 2"
                className="animate-data-flow"
                style={{ animationDelay: "1s", opacity: 0.2 }}
              />

              {/* CPU/芯片 装饰元素 */}
              <g transform="translate(400, 200)">
                <rect
                  x="-20"
                  y="-20"
                  width="40"
                  height="40"
                  stroke="#505050"
                  strokeWidth="1"
                  fill="none"
                  strokeOpacity="0.3"
                />
                <path
                  d="M-25,-10 H-30 M-25,0 H-30 M-25,10 H-30 M25,-10 H30 M25,0 H30 M25,10 H30 M-10,-25 V-30 M0,-25 V-30 M10,-25 V-30 M-10,25 V30 M0,25 V30 M10,25 V30"
                  stroke="#505050"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              </g>

              <g transform="translate(100, 400)">
                <rect
                  x="-15"
                  y="-15"
                  width="30"
                  height="30"
                  stroke="#505050"
                  strokeWidth="1"
                  fill="none"
                  strokeOpacity="0.3"
                />
                <path
                  d="M-20,-7 H-25 M-20,0 H-25 M-20,7 H-25 M20,-7 H25 M20,0 H25 M20,7 H25 M-7,-20 V-25 M0,-20 V-25 M7,-20 V-25 M-7,20 V25 M0,20 V25 M7,20 V25"
                  stroke="#505050"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              </g>

              {/* LED指示灯 */}
              <circle
                cx="300"
                cy="100"
                r="3"
                fill="#2A9D8F"
                fillOpacity="0.3"
                className="animate-led-blink"
                style={{ animationDelay: "0.2s" }}
              />
              <circle
                cx="150"
                cy="250"
                r="3"
                fill="#90BE6D"
                fillOpacity="0.3"
                className="animate-led-blink"
                style={{ animationDelay: "0.8s" }}
              />
              <circle
                cx="150"
                cy="350"
                r="3"
                fill="#43AA8B"
                fillOpacity="0.3"
                className="animate-led-blink"
                style={{ animationDelay: "1.2s" }}
              />

              {/* 墨笔触 */}
              <path
                d="M50,50 C100,20 200,80 300,40 C400,10 500,50 600,30"
                className="ink-stroke"
                style={{ animationDelay: "0.5s" }}
              />
              <path
                d="M10,200 C150,150 250,250 350,180 C450,120 550,180 650,150"
                className="ink-stroke"
                style={{ animationDelay: "1s" }}
              />
              <path
                d="M700,350 C600,300 500,400 400,350 C300,300 200,380 100,320"
                className="ink-stroke"
                style={{ animationDelay: "1.5s" }}
              />
            </svg>

            {/* 墨滴粒子 */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>

            {/* 山形墨滴 */}
            <div className="mountain-ink"></div>
            <div className="mountain-ink"></div>

            {/* 墨迹溅落 */}
            {isClient &&
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`ink-splatter-${i}`}
                  className="ink-splatter animate-ink-splatter"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `scale(${0.5 + Math.random()})`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}

            {/* 雪花粒子 */}
            {isClient &&
              Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="snowflake"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0.1 + Math.random() * 0.3,
                    animation: `snowfall ${
                      5 + Math.random() * 10
                    }s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}
          </div>
          {/* 装饰性线条 */}
          <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>
          {/* Content sections */}
          <div className="relative z-10 mt-8">
            {/* 个人介绍 */}
            <div
              id="intro"
              className="space-y-6 animate-float-up mb-12 "
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* 头像 */}
                <div className="w-40 h-40 relative">
                  <div className="cursor-target w-40 h-40 rounded-full overflow-hidden border-4 border-[#56CFE1]/30">
                    <Image
                      src="https://cdn.wuyilin18.top/img/avatar.png" // 替换为实际的头像路径
                      alt="十八加十八"
                      width={160}
                      height={160}
                      className="object-cover"
                    />
                  </div>

                  {/* 水墨装饰 */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20 pointer-events-none">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 80 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M40,10 C50,10 60,20 70,40 C75,60 60,70 40,70 C20,70 5,60 10,40 C15,20 30,10 40,10 Z"
                        fill="#56CFE1"
                        fillOpacity="0.4"
                        className="animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      />
                    </svg>
                  </div>
                </div>

                <div className="md:flex-1">
                  <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-200">
                    十八加十八
                  </h2>
                  <div className="cursor-target bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      头像由来
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      &ldquo;雪松&rdquo; 与竹、梅并称
                      &ldquo;岁寒三友&rdquo;，凌霜傲雪，象征坚韧与高洁的君子品格。
                    </p>
                  </div>
                  <div className="cursor-target bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      网名由来
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-balance">
                      『十八加十八，松风自成林』——松针写春秋，字间藏岁寒，行处有松声。
                      <br />
                      <strong className="font-bold block mt-2 mb-2">
                        注解：
                      </strong>
                      拆字： &ldquo;十八加十八&rdquo; 合为
                      &ldquo;林&rdquo;，松为林中君子，暗喻风骨。
                      <br />
                      典故：化用《论语》 &ldquo;岁寒，然后知松柏之后凋也
                      &rdquo;，以 &ldquo;岁寒&rdquo; 呼应雪松之志。
                    </p>
                  </div>

                  <div className="cursor-target bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      教育背景
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      广州华南商贸职业学院 信息学院软件技术2022届
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative z-50 flex h-[-20rem] w-[20rem] ml-[-10%]  items-center justify-center overflow-hidden rounded-lg ">
                <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                  Skill
                </span>
              </div>
              <FallingText
                text={`C Java Linux Arduino HTML CSS JS NextJS Vue SpringBoot Strapi Photoshop VsCode DeepSeek`}
                highlightWords={["NextJS", "Strapi"]}
                highlightClass="highlighted"
                trigger="hover"
                backgroundColor="transparent"
                wireframes={false}
                gravity={0.56}
                fontSize="2rem"
                mouseConstraintStiffness={0.9}
              />
              {/* 技术成长 */}
              <div
                id="tech"
                className="animate-float-up mb-12"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    技术成长路线图
                  </h2>

                  {/* Web方向 */}
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#56CFE1] flex items-center justify-center text-white relative overflow-hidden">
                        {/* 山脉背景 */}
                        <div className="absolute inset-0 opacity-30">
                          <svg
                            viewBox="0 0 32 32"
                            preserveAspectRatio="none"
                            className="w-full h-full"
                          >
                            <path
                              d="M0,24 L8,16 L12,20 L16,12 L20,18 L24,14 L32,24 L32,32 L0,32 Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative z-10"
                        >
                          <path
                            d="M4,4 H20 V20 H4 V4 Z M4,8 H20 M8,8 V20"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        Web开发方向
                      </h3>
                    </div>

                    <div className="relative ml-4 pl-8 border-l-2 border-[#56CFE1]/30">
                      {/* Timeline items */}
                      {[
                        {
                          year: "2022",
                          title: "HTML/CSS/JS基础",
                          desc: "开始接触前端开发基础",
                        },
                        {
                          year: "2023",
                          title: "Vue框架",
                          desc: "学习主流前端框架",
                        },
                        {
                          year: "2024",
                          title: "后端开发 & 微服务",
                          desc: "后端技术栈与架构",
                        },
                        {
                          year: "2025",
                          title: "NextJS & TypeScript",
                          desc: "全栈开发进阶",
                        },
                      ].map((item, index) => (
                        <div key={index} className="mb-6 relative">
                          <div className="absolute -left-10 w-4 h-4 rounded-full bg-[#56CFE1]"></div>
                          <span className="text-xs font-medium text-[#56CFE1]">
                            {item.year}
                          </span>
                          <h4 className="font-bold text-gray-700 dark:text-gray-300 mt-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 嵌入式方向 */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#9D4EDD] flex items-center justify-center text-white relative overflow-hidden">
                        {/* 山脉背景 */}
                        <div className="absolute inset-0 opacity-30">
                          <svg
                            viewBox="0 0 32 32"
                            preserveAspectRatio="none"
                            className="w-full h-full"
                          >
                            <path
                              d="M0,24 L8,16 L12,20 L16,12 L20,18 L24,14 L32,24 L32,32 L0,32 Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative z-10"
                        >
                          <rect
                            x="6"
                            y="6"
                            width="12"
                            height="12"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M9,2 V6 M15,2 V6 M9,18 V22 M15,18 V22 M2,9 H6 M2,15 H6 M18,9 H22 M18,15 H22"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        嵌入式方向
                      </h3>
                    </div>

                    <div className="relative ml-4 pl-8 border-l-2 border-[#9D4EDD]/30">
                      {/* Timeline items */}
                      {[
                        {
                          year: "2023",
                          title: "C语言基础",
                          desc: "嵌入式开发基础",
                        },
                        {
                          year: "2025",
                          title: "单片机开发",
                          desc: "Arduino & STM32 & ESP32",
                        },
                      ].map((item, index) => (
                        <div key={index} className="mb-6 relative">
                          <div className="absolute -left-10 w-4 h-4 rounded-full bg-[#9D4EDD]"></div>
                          <span className="text-xs font-medium text-[#9D4EDD]">
                            {item.year}
                          </span>
                          <h4 className="font-bold text-gray-700 dark:text-gray-300 mt-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* 其他方向 */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#FF9470] flex items-center justify-center text-white relative overflow-hidden">
                        {/* 山脉背景 */}
                        <div className="absolute inset-0 opacity-30">
                          <svg
                            viewBox="0 0 32 32"
                            preserveAspectRatio="none"
                            className="w-full h-full"
                          >
                            <path
                              d="M0,24 L8,16 L12,20 L16,12 L20,18 L24,14 L32,24 L32,32 L0,32 Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="relative z-10"
                        >
                          <path
                            d="M12,4 L19,8 L19,16 L12,20 L5,16 L5,8 L12,4 Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle cx="12" cy="12" r="2" fill="currentColor" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        其他方向
                      </h3>
                    </div>

                    <div className="relative ml-4 pl-8 border-l-2 border-[#FF9470]/30">
                      {/* Timeline items */}
                      {[
                        {
                          year: "2023",
                          title: "Java语言",
                          desc: "Java语言基础",
                        },
                        {
                          year: "2024",
                          title: "UI/UX设计",
                          desc: "创意与用户体验研究",
                        },
                        {
                          year: "2025",
                          title: "云原生技术",
                          desc: "容器编排与微服务架构",
                        },
                      ].map((item, index) => (
                        <div key={index} className="mb-6 relative">
                          <div className="absolute -left-10 w-4 h-4 rounded-full bg-[#FF9470]"></div>
                          <span className="text-xs font-medium text-[#FF9470]">
                            {item.year}
                          </span>
                          <h4 className="font-bold text-gray-700 dark:text-gray-300 mt-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* GitHub热力图 */}
              <div
                id="github"
                className="animate-float-up mb-12"
                style={{ animationDelay: "0.1s" }}
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  GitHub 日历热力图
                </h2>
                <div className="cursor-target bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="w-full overflow-x-auto">
                    <Image
                      src="https://ghchart.rshah.org/wuyilin18"
                      alt="GitHub贡献热力图"
                      width={800}
                      height={200}
                      className="w-full h-auto min-w-[800px]"
                      unoptimized={true} // 对于外部图像源，设置为unoptimized
                    />
                  </div>
                  <div className="text-center mt-4">
                    <Link
                      href="https://github.com/wuyilin18"
                      target="_blank"
                      className="cursor-target text-[#56CFE1] "
                    >
                      访问我的GitHub主页
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative z-50 flex h-[-20rem] w-[20rem] ml-[-8%]  items-center justify-center overflow-hidden rounded-lg ">
                <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                  Hobby
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                动漫爱好
              </h2>
              {/* 动漫精彩截图展示栏 */}
              <div className="h-[36rem] md:h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start mb-18">
                <Tabs
                  tabs={[
                    {
                      title: "凡人修仙传",
                      value: "A Mortal's Journey",
                      content: (
                        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                          {/* 背景图片 - 凡人修仙传 */}
                          <div
                            className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                            style={{
                              backgroundImage:
                                "url('https://cdn.wuyilin18.top/img/HanLi2.webp')",
                            }}
                          ></div>

                          <div className="flex flex-col md:flex-row h-full relative z-10">
                            {/* 左侧图片（移动端隐藏） */}
                            <div className="w-full md:w-2/5 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                              <Image
                                src="https://cdn.wuyilin18.top/img/HanLi3.webp"
                                alt="凡人修仙传"
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* 右侧文字介绍 */}
                            <div className="w-full md:w-3/5 p-4 md:p-6 flex flex-col justify-between">
                              <div>
                                <h3 className="text-2xl md:text-3xl mb-4 text-white">
                                  凡人修仙传
                                </h3>
                                <p className="text-base font-normal text-gray-200">
                                  《凡人修仙传》是起点中文网白金作家忘语所著的一部东方玄幻小说，后改编为动画。
                                </p>
                                <p className="text-base font-normal text-gray-200 mt-2">
                                  简介：看机智的凡人小子韩立如何稳健发展、步步为营，战魔道、夺至宝、驰骋星海、快意恩仇，成为纵横三界的强者。他日仙界重相逢，一声道友尽沧桑。
                                </p>
                              </div>

                              <div className="mt-4">
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                  玄幻
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  热血
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  励志
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "剑来",
                      value: "Sword Is Coming",
                      content: (
                        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                          {/* 背景图片 - 剑来 */}
                          <div
                            className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                            style={{
                              backgroundImage:
                                "url('https://cdn.wuyilin18.top/img/v2-f085285db957e86cc2e975ec814d34e0_1440w.jpg')",
                            }}
                          ></div>

                          <div className="flex flex-col md:flex-row h-full relative z-10">
                            {/* 左侧图片（移动端隐藏） */}
                            <div className="w-full md:w-1/4 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                              <Image
                                src="https://cdn.wuyilin18.top/img/v2-9f5def67392231bca561592eedac21be_1440w.jpg"
                                alt="剑来"
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* 右侧文字介绍 */}
                            <div className="w-full md:w-3/4 p-4 md:p-6 flex flex-col justify-between">
                              <div>
                                <h3 className="text-2xl md:text-3xl mb-4 text-white">
                                  剑来
                                </h3>
                                <p className="text-base font-normal text-gray-200">
                                  《剑来》是起点中文网白金作家烽火戏诸侯所著的一部东方玄幻小说。
                                </p>
                                <p className="text-base font-normal text-gray-200 mt-2">
                                  简介：大千世界，无奇不有。
                                  骊珠洞天中本该有大气运的贫寒少年，因为本命瓷碎裂的缘故，使得机缘临身却难以捉住。基于此，众多大佬纷纷以少年为焦点进行布局，使得少年身边的朋友获得大机缘，而少年却置身风口浪尖之上…{" "}
                                </p>
                              </div>
                              <div className="mt-4">
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                  武侠
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  仙侠
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  热血
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "沧元图",
                      value: "The Demon Hunter",
                      content: (
                        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                          {/* 背景图片 - 沧元图 */}
                          <div
                            className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                            style={{
                              backgroundImage:
                                "url('https://cdn.wuyilin18.top/img/cyt.webp')",
                            }}
                          ></div>

                          <div className="flex flex-col md:flex-row h-full relative z-10">
                            {/* 左侧图片（移动端隐藏） */}
                            <div className="w-full md:w-3/5 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                              <Image
                                src="https://cdn.wuyilin18.top/img/cyt.webp"
                                alt="沧元图"
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* 右侧文字介绍 */}
                            <div className="w-full md:w-2/5 p-4 md:p-6 flex flex-col justify-between">
                              <div>
                                <h3 className="text-2xl md:text-3xl mb-4 text-grey">
                                  沧元图
                                </h3>
                                <p className="text-base font-normal text-gray-200">
                                  《沧元图》是起点中文网白金作家我吃西红柿所著的一部东方玄幻小说。
                                </p>
                                <p className="text-base font-normal text-gray-200 mt-2">
                                  简介：沧元界妖邪作乱，人族饱受摧残，主角孟川自小立下为母复仇的誓言，以镜湖道院为起点，凭借坚毅无畏的心志与利落果决的刀法身手，惩处奸恶，溃灭妖族，登顶四大道院，名满东宁府，拜上元初山，成就一代神魔。{" "}
                                </p>
                              </div>
                              <div className="mt-4">
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                  玄幻
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  修真
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  冒险
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                  containerClassName="w-full py-4 mb-4"
                  activeTabClassName="bg-[#56CFE1] dark:bg-[#9D4EDD] shadow-md"
                  tabClassName="px-6 py-3 text-sm rounded-full transition-all my-2 mx-1"
                  contentClassName="mt-8"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                漫画爱好
              </h2>
              {/* 漫画展示栏 */}
              <div className="h-[55rem] md:h-[45rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start mb-18">
                <Tabs
                  tabs={[
                    {
                      title: "我为邪帝",
                      value: "I'm An Evil God",
                      content: (
                        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                          {/* 背景图片 - 我为邪帝 */}
                          <div
                            className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                            style={{
                              backgroundImage:
                                "url('https://cdn.wuyilin18.top/img/%E6%88%91%E4%B8%BA%E9%82%AA%E5%B8%9D.webp')",
                            }}
                          ></div>

                          <div className="flex flex-col md:flex-row h-full relative z-10">
                            {/* 左侧图片（移动端隐藏） */}
                            <div className="w-full md:w-2/5 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                              <Image
                                src="https://cdn.wuyilin18.top/img/wwxd.jpg"
                                alt="我为邪帝"
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* 右侧文字介绍 */}
                            <div className="w-full md:w-3/5 p-4 md:p-6 flex flex-col justify-between">
                              <div>
                                <h3 className="text-2xl md:text-3xl mb-4 text-white">
                                  我为邪帝
                                </h3>
                                <p className="text-base font-normal text-gray-200 mb-4">
                                  《我为邪帝》是连载中的一部原创玄幻类漫画，作者是时代漫王。是一部包含穿越、玄幻、系统等元素的漫画，在腾讯动漫独家连载。
                                </p>
                                <p className="text-base font-normal text-gray-200">
                                  简介：纵横万界，史上最肉、最帅邪帝！
                                  绝世美男子谢焱一朝穿越掉进妖女窝，为了生存，穿梭诸天万界，斩位面之子，拒联邦洋夷……终成一代邪帝的故事。
                                </p>
                              </div>
                              <div className="mt-4">
                                <div className="mb-6">
                                  <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                    穿越
                                  </span>
                                  <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                    玄幻
                                  </span>
                                  <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                    系统
                                  </span>
                                </div>
                                <div className="cursor-target text-base font-normal text-gray-500">
                                  <InteractiveHoverButton
                                    onClick={() => {
                                      setShowComicScroll(true);
                                      setTimeout(() => {
                                        const el = document.getElementById(
                                          "comic-scroll-section"
                                        );
                                        if (el)
                                          el.scrollIntoView({
                                            behavior: "smooth",
                                            block: "center",
                                          });
                                      }, 50);
                                    }}
                                  >
                                    精彩片段 Start Exploring
                                  </InteractiveHoverButton>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "我！天命大反派",
                      value: "I Am The Fated Villain",
                      content: (
                        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                          {/* 背景图片 - 我！天命大反派 */}
                          <div
                            className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                            style={{
                              backgroundImage:
                                "url('https://cdn.wuyilin18.top/img/I_Am_The_Fated_Villain8.jpg')",
                            }}
                          ></div>

                          <div className="flex flex-col md:flex-row h-full relative z-10">
                            {/* 左侧图片（移动端隐藏） */}
                            <div className="w-full md:w-1/3 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                              <Image
                                src="https://cdn.wuyilin18.top/img/I_Am_The_Fated_Villain1.jpg"
                                alt="我！天命大反派"
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* 右侧文字介绍 */}
                            <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col justify-between">
                              <div>
                                <h3 className="text-2xl md:text-3xl mb-4 text-white">
                                  我！天命大反派
                                </h3>
                                <p className="text-base font-normal text-gray-200 mb-4">
                                  《我！天命大反派》是一部玄幻漫画，讲述了一个被命运选中成为反派的主角如何逆天改命的故事。
                                </p>
                                <p className="text-base font-normal text-gray-200">
                                  简介：顾长歌穿越到玄幻世界，开局就拉满了模范主角、气运之子的仇恨值。不仅女主投怀送抱，还有令人眼红的贵客待遇。好在自己身份实力高人一筹，踩死一个小小的气运之子，还不简单？等等，这里还有个专门收割各路主角的系统？顾长歌微微一笑，看来这是要自己在天命大反派的路上越走越远啊！{" "}
                                </p>
                              </div>
                              <div className="mt-4">
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                  后宫
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  古风
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  系统
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2 ">
                                  逆袭
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "魔皇大管家",
                      value: "Demonic Emperor",
                      content: (
                        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                          {/* 背景图片 - 魔皇大管家 */}
                          <div
                            className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                            style={{
                              backgroundImage:
                                "url('https://cdn.wuyilin18.top/img/DemonicEmperor.jpg')",
                            }}
                          ></div>

                          <div className="flex flex-col md:flex-row h-full relative z-10">
                            {/* 左侧图片（移动端隐藏） */}
                            <div className="w-full md:w-1/3 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                              <Image
                                src="https://cdn.wuyilin18.top/img/DemonicEmperor1.jpg"
                                alt="魔皇大管家"
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* 右侧文字介绍 */}
                            <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col justify-between">
                              <div>
                                <h3 className="text-2xl md:text-3xl mb-4 text-white">
                                  魔皇大管家
                                </h3>
                                <p className="text-base font-normal text-gray-200 mb-4">
                                  《魔皇大管家》是一部中国玄幻题材的网络漫画，改编自同名小说（作者：夜枭）。
                                </p>
                                <p className="text-base font-normal text-gray-200">
                                  简介：魔皇卓一凡因得到上古魔帝传承，遭亲信背叛并引来杀身之祸。重生后修为归零的他又被心魔所困，不得不成为一个落寞家族大小姐的专属管家。从魔皇到小小管家，他究竟要怎样和自己的&ldquo;心魔大小姐&rdquo;相处，又如何才能带领这个没落家族和自己一起重回这片大陆的巅峰呢！{" "}
                                </p>
                              </div>
                              <div className="mt-4">
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                  热血
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  玄幻
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  古风
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  冒险
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  魔幻
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  奇幻
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  少年
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  逆袭
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "我的徒弟都是大反派",
                      value: "My Disciples Are All Big Villains",
                      content: (
                        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                          {/* 背景图片 - 我的徒弟都是大反派 */}
                          <div
                            className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                            style={{
                              backgroundImage:
                                "url('https://cdn.wuyilin18.top/img/My_Disciples_Are_All_Big_Villains1.jpg')",
                            }}
                          ></div>

                          <div className="flex flex-col md:flex-row h-full relative z-10">
                            {/* 左侧图片（移动端隐藏） */}
                            <div className="w-full md:w-2/5 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                              <Image
                                src="https://cdn.wuyilin18.top/img/My_Disciples_Are_All_Big_Villains.webp"
                                alt="我的徒弟都是大反派"
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* 右侧文字介绍 */}
                            <div className="w-full md:w-3/5 p-4 md:p-6 flex flex-col justify-between">
                              <div>
                                <h3 className="text-2xl md:text-3xl mb-4 text-white">
                                  我的徒弟都是大反派
                                </h3>
                                <p className="text-base font-normal text-gray-200 mb-4">
                                  《我的徒弟都是大反派》是一部热门修仙漫画，改编自同名小说，讲述了一个穿越者成为各大反派师父的故事。
                                </p>
                                <p className="text-base font-normal text-gray-200">
                                  简介：陆州一觉醒来成了世间最强大最老的魔头祖师爷，还有九个恶贯满盈，威震天下的徒弟。大徒弟幽冥教教主手下万千魔众，二徒弟剑魔一言不合就开杀戒……没了一身修为，如何调教这帮恶徒大徒弟于正海：&ldquo;老夫这一生所向披靡，除了师父他老人家，谁也别想骑我头上。&rdquo;七徒弟司无涯：&ldquo;师父不死，我等寝食难安啊&rdquo;……
                                </p>
                              </div>
                              <div className="mt-4">
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                  古风
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  冒险
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  热血
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  系统
                                </span>
                                <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                  师徒
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                  containerClassName="w-full py-4 mb-4"
                  activeTabClassName="bg-[#56CFE1] dark:bg-[#9D4EDD] shadow-md"
                  tabClassName="px-6 py-3 text-sm rounded-full transition-all my-2 mx-1"
                  contentClassName="mt-8"
                />
              </div>
              {/* 漫画图展示 */}
              {showComicScroll && (
                <div id="comic-scroll-section" style={{ position: "relative" }}>
                  {/* 关闭按钮 */}
                  <button
                    onClick={() => setShowComicScroll(false)}
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 20,
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.85)",
                      border: "1px solid #ccc",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      fontSize: 22,
                      color: "#333",
                      cursor: "pointer",
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#eee";
                      e.currentTarget.style.color = "#56CFE1";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.85)";
                      e.currentTarget.style.color = "#333";
                    }}
                    aria-label="关闭漫画图展示"
                  >
                    ×
                  </button>
                  <HorizontalScroller
                    image="https://cdn.wuyilin18.top/img/wwxd.png" // 单张长图路径
                    scrollSpeed={5000} // 4秒自动滚动一次
                    height="60vh" // 占据视口60%高度
                    wheelSensitivity={1.5} // 提高滚轮灵敏度
                    scrollDuration={200} // 更快的滚动动画
                    pauseOnHover={true} // 悬停时暂停自动滚动
                    borderWidthRatio={0.008} // 边框宽度为容器宽度的0.2%
                    useProportionalScroll={true} // 使用比例滚动
                    triggerDistance={50} // 触发距离
                    borderDistance={150} // 边框距离
                    borderRadius={8} // 增加圆角
                    thickBorder={true} // 使用加厚边框
                    noPadding={true} // 不留内部空隙
                  />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200  mb-4">
              电影爱好
            </h2>
            {/* 电影展示栏 */}
            <div className="mb-20 h-[40rem] md:h-[50rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start mb-12">
              <Tabs
                tabs={[
                  {
                    title: "Frozen",
                    value: "Frozen",
                    content: (
                      <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                        {/* 背景图片 - 冰雪奇缘 */}
                        <div
                          className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                          style={{
                            backgroundImage:
                              "url('https://cdn.wuyilin18.top/img/Elsa.webp')",
                          }}
                        ></div>

                        <div className="flex flex-col md:flex-row h-full relative z-10">
                          {/* 左侧图片（移动端隐藏） */}
                          <div className="w-full md:w-2/5 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                            <Image
                              src="https://cdn.wuyilin18.top/img/Frozen.webp"
                              alt="冰雪奇缘"
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* 右侧文字介绍 */}
                          <div className="w-full md:w-3/4 p-4 md:p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-2xl md:text-3xl mb-4 text-white">
                                冰雪奇缘
                              </h3>
                              <p className="text-base font-normal text-gray-200">
                                《冰雪奇缘》是迪士尼2013年推出的经典动画电影，改编自安徒生童话《冰雪女王》。
                              </p>
                              <p className="text-base font-normal text-gray-200 mt-2">
                                简介：艾莎天生拥有冰雪魔法，却因失控伤害了妹妹安娜，从此封闭自我。多年后，艾莎在加冕典礼上意外暴露能力，逃入雪山。安娜踏上冒险之旅，寻找姐姐，并结识了山民克里斯托夫、驯鹿斯文和雪人奥拉夫。她们必须解开魔法的秘密，拯救被冰封的阿伦黛尔王国…
                              </p>
                            </div>
                            <div className="mt-4">
                              <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                动画
                              </span>
                              <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                奇幻
                              </span>
                              <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                音乐
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "FrozenⅡ",
                    value: "FrozenⅡ",
                    content: (
                      <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                        {/* 背景图片 - 冰雪奇缘2 */}
                        <div
                          className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                          style={{
                            backgroundImage:
                              "url('https://cdn.wuyilin18.top/img/Elsa1.webp')",
                          }}
                        ></div>

                        <div className="flex flex-col md:flex-row h-full relative z-10">
                          {/* 左侧图片（移动端隐藏） */}
                          <div className="w-full md:w-2/5 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                            <Image
                              src="https://cdn.wuyilin18.top/img/Frozen2.jpg"
                              alt="冰雪奇缘2"
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* 右侧文字介绍 */}
                          <div className="w-full md:w-3/4 p-4 md:p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-2xl md:text-3xl mb-4 text-white">
                                冰雪奇缘2
                              </h3>
                              <p className="text-base font-normal text-gray-200">
                                《冰雪奇缘2》是迪士尼2019年推出的续作，延续了艾莎与安娜的冒险故事。
                              </p>
                              <p className="text-base font-normal text-gray-200 mt-2">
                                简介：阿伦黛尔王国恢复平静后，艾莎却听到神秘的歌声呼唤。为了探寻父母遇难的真相和自身魔法的起源，艾莎与安娜、克里斯托夫、奥拉夫一同前往北方魔法森林。她们揭开了古老的部落秘密，面对自然之灵的考验，而艾莎更需直面自己作为&ldquo;第五元素&rdquo;的使命…
                              </p>
                            </div>
                            <div className="mt-4">
                              <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                冒险
                              </span>
                              <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                奇幻
                              </span>
                              <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                家庭
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Moana",
                    value: "Moana",
                    content: (
                      <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 text-xl font-bold text-white bg-[grey] min-h-[400px] md:min-h-0">
                        {/* 背景图片 - 海洋奇缘 */}
                        <div
                          className="absolute inset-0 opacity-30 bg-cover bg-center z-0"
                          style={{
                            backgroundImage:
                              "url('https://cdn.wuyilin18.top/img/Moana2.jpg')",
                          }}
                        ></div>

                        <div className="flex flex-col md:flex-row h-full relative z-10">
                          {/* 左侧图片（移动端隐藏） */}
                          <div className="w-full md:w-3/5 h-56 md:h-full relative rounded-xl overflow-hidden hidden md:block">
                            <Image
                              src="https://cdn.wuyilin18.top/img/Moana.jpg"
                              alt="海洋奇缘"
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* 右侧文字介绍 */}
                          <div className="w-full md:w-3/4 p-4 md:p-6 flex flex-col justify-between">
                            <div>
                              <h3 className="text-2xl md:text-3xl mb-4 text-white">
                                海洋奇缘
                              </h3>
                              <p className="text-base font-normal text-gray-200">
                                《海洋奇缘》是迪士尼2016年推出的南太平洋风情动画电影，致敬波利尼西亚文化。
                              </p>
                              <p className="text-base font-normal text-gray-200 mt-2">
                                简介：莫阿娜是酋长之女，自幼被海洋选中。当岛屿面临黑暗诅咒时，她违背父亲禁令，扬帆远航寻找半神毛伊，要求他归还偷走的&ldquo;海洋之心&rdquo;。两人穿越凶险海域，遭遇椰子海盗和岩浆怪物，最终解开特菲提女神的秘密，恢复世界的平衡…
                              </p>
                            </div>
                            <div className="mt-4">
                              <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal">
                                冒险
                              </span>
                              <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                神话
                              </span>
                              <span className="px-3 py-1 bg-[#56CFE1]/40 rounded-full text-sm font-normal ml-2">
                                歌舞
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                ]}
                containerClassName="w-full py-4 mb-4"
                activeTabClassName="bg-[#56CFE1] dark:bg-[#9D4EDD] shadow-md"
                tabClassName="px-6 py-3 text-sm rounded-full transition-all my-2 mx-1"
                contentClassName="mt-8"
              />
            </div>

            {/* 关于本站 */}
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">
                关于本站
              </h2>
              <div className="border-2 border-grey-500 rounded-lg">
                <BackgroundBeamsWithCollision>
                  <div
                    className="
                  items-center justify-center overflow-hidden  "
                  >
                    <BoxReveal boxColor={"#56CFE1"} duration={0.5}>
                      <div className="flex justify-center text-balance">
                        <div className="text-balance pt-2 pl-2 text-start text-0.3xl">
                          {" "}
                          <h2 className="font-bold mt-[.5rem] text-[1.3rem] bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] bg-clip-text text-transparent dark:from-[#56CFE1] dark:to-[#FF9470]">
                            域名
                          </h2>
                          <div className="font-bold pl-2 pt-1">
                            本网站采用多线路并行部署，一份源码同时分发给多个托管商
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            主域名：
                            <a
                              href="https://www.wuyilin18.top/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#56CFE1] hover:underline"
                            >
                              wuyilin18.top
                            </a>{" "}
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            均解析至Vercel，Vercel有全球的泛播节点，兼具全球CDN功能，国内访问速度较快{" "}
                            <span className="text-[#56CFE1]">
                              (Ping值：70-80ms)
                            </span>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            备用域名1：
                            <a
                              href="https://netlify.wuyilin18.top"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#56CFE1] hover:underline"
                            >
                              netlify.wuyilin18.top
                            </a>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            解析至Netlify，一个现代化网站自动化系统，国内访问到的节点在新加坡、加州等，国内速度尚可{" "}
                            <span className="text-[#56CFE1]">
                              (Ping值：90-120ms)
                            </span>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            备用域名2：
                            <a
                              href="https://zeabur.wuyilin18.top"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#56CFE1] hover:underline"
                            >
                              zeabur.wuyilin18.top
                            </a>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            解析至Zeabur，一个可以帮助你部署服务的平台，节点是位于台湾彰化的谷歌云，国内速度较快{" "}
                            <span className="text-[#56CFE1]">
                              (Ping值：50-100ms)
                            </span>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            初始域名：
                            <a
                              href="https://blog-website-psi-taupe.vercel.app/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#56CFE1] hover:underline"
                            >
                              blog-website-psi-taupe.vercel.app
                            </a>
                          </div>
                          {/* <div className="font-bold pl-2 pt-1">
                            直链至Github泛播，国内速度较慢{" "}
                            <span className="text-[#56CFE1]">
                              (Ping值：80-120ms)
                            </span>
                          </div> */}
                          {/* <div className="font-bold pl-2 pt-1">
                            目前主域{" "}
                            <a
                              href="https://wuyilin18.top"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#56CFE1] hover:underline"
                            >
                              wuyilin18.top
                            </a>{" "}
                            已劫持分流至缤纷云，在国内速度非常快{" "}
                            <span className="text-[#56CFE1]">
                              (Ping值：30-50ms)
                            </span>
                          </div> */}
                          <div className="font-bold pl-2 pt-1">
                            以上所有线路均支持HTTPS协议
                          </div>
                          <h2 className="font-bold mt-[2.5rem] text-[1.3rem] bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] bg-clip-text text-transparent dark:from-[#56CFE1] dark:to-[#FF9470]">
                            技术栈
                          </h2>
                          <div className="font-bold pl-2 pt-1">
                            源码仓库：<AuroraText>Github</AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            前端：
                            <AuroraText>
                              Next.js + Tailwind CSS + TypeScript
                            </AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            后端：
                            <AuroraText>Strapi + 阿里云服务器</AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            数据库：<AuroraText>MongoDB</AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            托管与部署：
                            <AuroraText>Vercel + 阿里云服务器</AuroraText>{" "}
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            评论系统：<AuroraText>Twikoo</AuroraText>系统 +{" "}
                            <AuroraText>Vercel</AuroraText>部署 +{" "}
                            <AuroraText>MongoDB</AuroraText>提供存储服务
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            图床：
                            <AuroraText>PicGo + 去不图床</AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            CDN：
                            <AuroraText>Github + Vercel</AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            图片压缩：<AuroraText>Squoosh </AuroraText>
                            转化图片格式为webp格式
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            自动部署：
                            <AuroraText>Git 钩子 + Github Action</AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            SEO优化：<AuroraText>谷歌 + 必应 + 百度</AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            博客统计：
                            <AuroraText>不蒜子</AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            渐进加载与缓存加速技术：
                            <AuroraText>Framer Motion</AuroraText>
                          </div>
                          <div className="font-bold pl-2 pt-1">
                            开发语言：
                            <AuroraText>
                              Next.js + Tailwind CSS + TypeScript
                            </AuroraText>
                          </div>
                          {/* <div className="font-bold pl-2 pt-1">
                            维护日志：见旧<AuroraText>时光</AuroraText>栏目
                          </div> */}
                          <div className="font-bold pl-2 pt-1">
                            AI工具或模型：
                            <AuroraText>
                              DeepSeek + Cursor + Gemini-2.5-pro
                            </AuroraText>
                          </div>
                        </div>
                      </div>
                    </BoxReveal>
                  </div>
                </BackgroundBeamsWithCollision>
              </div>
            </div>

            {/* 鸣谢列表 */}
            <div
              id="thanks"
              className="animate-float-up mb-12"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                鸣谢
              </h2>

              {/* 友情链接 - 使用AnimatedTooltip组件 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[#56CFE1] flex items-center justify-center text-white mr-2 text-xs">
                    1
                  </span>
                  友情链接
                </h3>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 py-4">
                  <AnimatedTooltip
                    items={[
                      {
                        id: 1,
                        name: "十八加十八",
                        designation: "技术博主",
                        image: "https://cdn.wuyilin18.top/img/avatar.png",
                        link: "https://wuyilin18.top",
                      },
                      {
                        id: 2,
                        name: "张洪Heo",
                        designation: "UI/UX设计师",
                        image:
                          "https://weavatar.com/avatar/2dbb3f37c116504761d2103a6938f5f7871ebdd840ab5c4cd006d67c90fd18a0?d=https%3A%2F%2Fbu.dusays.com%2F2024%2F04%2F18%2F66209793d5145.png",
                        link: "https://blog.zhheo.com/",
                      },
                      {
                        id: 3,
                        name: "SamuelQZQ",
                        designation: "数字游牧人",
                        image: "https://cdn.wuyilin18.top/img/SamuelQZQ.webp",
                        link: "https://blog.samuelqzq.com/",
                      },
                      {
                        id: 4,
                        name: "Fomalhaut🥝",
                        designation: "博主",
                        image:
                          "https://sourcebucket.s3.bitiful.net/img/avatar.webp",
                        link: "https://www.fomal.cc/",
                      },
                    ]}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      name: "十八加十八",
                      desc: "技术博主",
                      detail: "友链我自己，`(｡•̀ᴗ-)✧ 诶嘿~",
                    },
                    {
                      name: "张洪Heo",
                      desc: "UI/UX设计师",
                      detail: "参考一些设计风格。",
                    },
                    {
                      name: "SamuelQZQ",
                      desc: "数字游牧人",
                      detail: "参考一些板块特色设计。",
                    },
                    {
                      name: "Fomalhaut🥝",
                      desc: "博主",
                      detail: "参考一些内容设计。",
                    },
                  ].map((person, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        {person.name}
                      </h4>
                      <p className="text-[#56CFE1] dark:text-[#56CFE1] text-sm font-medium">
                        {person.desc}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        {person.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 灵感来源 - 使用AnimatedTooltip组件 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[#9D4EDD] flex items-center justify-center text-white mr-2 text-xs">
                    2
                  </span>
                  灵感来源
                </h3>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 py-4">
                  <AnimatedTooltip
                    items={[
                      {
                        id: 5,
                        name: "Tailwind CSS",
                        designation: "CSS框架",
                        image:
                          "https://cdn.wuyilin18.top/img/tailwindCSSjpg.jpg",
                        link: "https://tailwindcss.com/",
                      },
                      {
                        id: 6,
                        name: "Aceternity UI",
                        designation: "UI组件库",
                        image: "https://cdn.wuyilin18.top/img/logo.png",
                        link: "https://ui.aceternity.com/",
                      },
                      {
                        id: 7,
                        name: "Magic UI",
                        designation: "UI组件库",
                        image: "https://cdn.wuyilin18.top/img/MagicUI.png",
                        link: "https://magicui.design/",
                      },
                      {
                        id: 8,
                        name: "reactbits",
                        designation: "UI组件库",
                        image:
                          "https://cdn.sanity.io/images/keon66n8/production/aa5e237ff5e6f5296ab063e52f0ba1b2687034ac-128x128.png?w=64&auto=format",
                        link: "https://www.reactbits.dev/",
                      },
                    ]}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      name: "Tailwind CSS",
                      desc: "CSS框架",
                      detail:
                        "采用实用优先的CSS框架，加速了UI开发并保持了一致的设计语言。",
                    },
                    {
                      name: "Aceternity UI",
                      desc: "UI组件库",
                      detail:
                        "通过精心设计的交互组件和优雅的过渡动画，为博客内容赋予更生动的视觉呈现。",
                    },
                    {
                      name: "Magic UI",
                      desc: "UI组件库",
                      detail:
                        "提供了现代化的UI组件和动效，为网站增添了独特的视觉体验。",
                    },
                    {
                      name: "reactbits",
                      desc: "UI组件库",
                      detail:
                        "通过前沿的UI设计和流畅的动画效果，使网站呈现出与众不同的视觉魅力。",
                    },
                  ].map((source, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        {source.name}
                      </h4>
                      <p className="text-[#9D4EDD] dark:text-[#9D4EDD] text-sm font-medium">
                        {source.desc}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        {source.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 开源项目鸣谢 - 新增板块 */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[#FF9470] flex items-center justify-center text-white mr-2 text-xs">
                    3
                  </span>
                  开源项目
                </h3>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 py-4">
                  <AnimatedTooltip
                    items={[
                      {
                        id: 9,
                        name: "Twikoo",
                        designation: "评论系统",
                        image:
                          "https://avatars.githubusercontent.com/u/92834001?s=200&v=4",
                        link: "https://twikoo.js.org/",
                      },
                    ]}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      name: "Twikoo",
                      desc: "评论系统",
                      detail:
                        "轻量级的评论系统，为博客提供了互动功能和用户反馈渠道。",
                    },
                  ].map((source, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700/40 p-4 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="font-medium text-gray-700 dark:text-gray-300">
                        {source.name}
                      </h4>
                      <p className="text-[#FF9470] dark:text-[#FF9470] text-sm font-medium">
                        {source.desc}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        {source.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 添加评论区 */}
            <div className="mt-12 mb-20">
              {/* 装饰性分隔线 */}
              <div className="w-full flex justify-center mb-8">
                <div className="w-24 h-0.5 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD]  dark:from-[#56CFE1] dark:to-[#FF9470] rounded-full opacity-50"></div>
              </div>

              <div className="w-full relative">
                {/* 背景装饰 - 更加简约的水墨风格 */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD]  dark:from-[#56CFE1] dark:to-[#FF9470]  rounded-lg blur-sm opacity-15"></div>

                <div className="relative w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 overflow-hidden border border-gray-100 dark:border-gray-700">
                  {/* 顶部水墨装饰线 */}

                  {/* 墨水滴装饰 - 右上角 */}
                  <div className="absolute top-6 right-6 w-24 h-24 pointer-events-none opacity-10">
                    <svg
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M50,10 C65,10 80,25 90,45 C95,65 85,85 50,90 C15,85 5,65 10,45 C20,25 35,10 50,10 Z"
                        fill="currentColor"
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </svg>
                  </div>

                  {/* 墨水滴装饰 - 左下角 */}
                  <div className="absolute bottom-8 left-8 w-16 h-16 pointer-events-none opacity-10 rotate-45">
                    <svg
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M50,10 C65,10 80,25 90,45 C95,65 85,85 50,90 C15,85 5,65 10,45 C20,25 35,10 50,10 Z"
                        fill="currentColor"
                        className="text-gray-700 dark:text-gray-300"
                      />
                    </svg>
                  </div>

                  <div className="mb-6 relative z-10">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD]  dark:from-[#56CFE1] dark:to-[#FF9470]  flex items-center justify-center text-white mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      留言板 ✨
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm ml-11">
                      欢迎来到我的留言板，留下你的足迹，与我分享你的想法和感受。
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm ml-15 mt-2">
                      点击文本框会有惊喜哦`(｡•̀ᴗ-)✧
                    </p>
                  </div>

                  {/* 评论组件容器 */}
                  <div className="relative z-10">
                    <TwikooCommentsWrapper />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
