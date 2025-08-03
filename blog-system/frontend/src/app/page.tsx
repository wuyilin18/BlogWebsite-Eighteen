import { TextAnimate } from "@/components/magicui/text-animate";
import { ParallaxSection } from "@/components/Home/ParallaxSkeleton/ParallaxSection";
import { BoxReveal } from "@/components/magicui/box-reveal";
import CardContainer from "@/components/Home/3DCardEffect/CardContainer";
import CardBody from "@/components/Home/3DCardEffect/CardBody";
import CardItem from "@/components/Home/3DCardEffect/CardItem";
import Image from "next/image";
import React from "react";
import { ORBIT_DIRECTION } from "@/components/Home/Orbit/types";
import Orbit from "@/components/Home/Orbit/Orbit";
import { WordRotate } from "@/components/magicui/word-rotate";
import InteractiveMenu from "@/components/Home/InteractiveMenu";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { StrapiResponse } from "@/types/strapi";
import { getPosts } from "@/lib/strapi";
import Link from "next/link";
import ArticleList from "@/components/ArticleList";
import SplitText from "@/components/reactbits/SplitText";
import TextType from "@/components/reactbits/TextType";

// 将主页面组件保持为服务器端组件
export default async function Home() {
  // 获取最4新的篇文章
  const latestPosts = await getPosts({
    pagination: {
      pageSize: 4,
      page: 1,
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] relative">
      {/* 添加首页专用的CSS动画样式 */}
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
        
        /* Technology icons horizontal scrolling animations */
        @keyframes scrollRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes scrollLeft {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        
        .animate-scroll-right {
          animation: scrollRight 25s linear infinite;
          display: flex;
          flex-wrap: nowrap;
          will-change: transform;
        }
        
        .animate-scroll-left {
          animation: scrollLeft 25s linear infinite;
          display: flex;
          flex-wrap: nowrap;
          will-change: transform;
        }
        
        /* Vertical scrolling animations */
        @keyframes scrollDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        @keyframes scrollUp {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        
        .animate-scroll-down {
          animation: scrollDown 15s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        .animate-scroll-up {
          animation: scrollUp 15s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        /* Pause animation on hover */
        .tech-icons-container:hover .animate-scroll-down,
        .tech-icons-container:hover .animate-scroll-up,
        .tech-row:hover .animate-scroll-right,
        .tech-row:hover .animate-scroll-left {
          animation-play-state: paused;
        }
        
        /* Hover effects for icons */
        .tech-icons-container:hover .animate-scroll-down > div:hover,
        .tech-icons-container:hover .animate-scroll-up > div:hover,
        .tech-row:hover .animate-scroll-right > div:hover,
        .tech-row:hover .animate-scroll-left > div:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          z-index: 10;
        }
        
        /* 技术卡片滚动条美化 */
        .tech-icons-container::-webkit-scrollbar {
          width: 5px;
        }
        
        .tech-icons-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        
        .tech-icons-container::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        .tech-icons-container:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .dark .tech-icons-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .dark .tech-icons-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .dark .tech-icons-container:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        
        /* 技术图标提示框样式 */
        .tech-icon-tooltip {
          position: relative;
        }
        
        .tech-icon-tooltip::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%) scale(0);
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 14px;
          white-space: nowrap;
          z-index: 20;
          opacity: 0;
          transition: all 0.2s ease;
          pointer-events: none;
        }
        
        .tech-icon-tooltip:hover::after {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
        
        .dark .tech-icon-tooltip::after {
          background-color: rgba(255, 255, 255, 0.8);
          color: black;
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
        
        /* 墨迹笔触 */
        .ink-stroke {
          position: absolute;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          stroke: rgba(20, 20, 20, 0.1);
          fill: none;
          z-index: 0;
        }
      `,
        }}
      />
      {/* 背景装饰 - 水墨电路风格 */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* 水墨效果和装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 墨点和墨痕 */}
          <div className="ink-drop"></div>
          <div className="ink-drop"></div>
          <div className="ink-drop"></div>

          {/* 电路板图案元素 - 简约风格 */}
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0 pointer-events-none"
          >
            {/* 主电路网格 - 淡色虚线 */}
            <path
              d="M0,100 H600 M0,300 H600 M0,500 H600 M100,0 V600 M300,0 V600 M500,0 V600"
              stroke="#e0e0e0"
              strokeWidth="0.8"
              fill="none"
              strokeDasharray="4 4"
              opacity="0.3"
            />

            {/* 电路路径 - 淡化电路路径 */}
            <path
              d="M50,150 H250 M250,150 V300 M250,300 H400 M400,300 V450 M400,450 H600"
              stroke="#d0d0d0"
              strokeWidth="1"
              fill="none"
              strokeDasharray="2 2"
              className="animate-data-flow"
              style={{ animationDelay: "0.5s", opacity: 0.2 }}
            />

            <path
              d="M0,350 H150 M150,350 V250 M150,250 H300 M300,250 V100 M300,100 H450 M450,100 V200 M450,200 H600"
              stroke="#d0d0d0"
              strokeWidth="1"
              fill="none"
              strokeDasharray="2 2"
              className="animate-data-flow"
              style={{ animationDelay: "1s", opacity: 0.2 }}
            />

            <path
              d="M0,200 H100 M100,200 V400 M100,400 H300 M300,400 V500 M300,500 H500 M500,500 V300 M500,300 H600"
              stroke="#d0d0d0"
              strokeWidth="1"
              fill="none"
              strokeDasharray="2 2"
              className="animate-data-flow"
              style={{ animationDelay: "1.5s", opacity: 0.2 }}
            />

            {/* 连接点 - 微小圆点 */}
            <circle cx="250" cy="150" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="250" cy="300" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="400" cy="300" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="400" cy="450" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="150" cy="350" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="150" cy="250" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="300" cy="250" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="300" cy="100" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="100" cy="200" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="100" cy="400" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="300" cy="400" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="300" cy="500" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="500" cy="500" r="2" fill="#c0c0c0" opacity="0.4" />
            <circle cx="500" cy="300" r="2" fill="#c0c0c0" opacity="0.4" />

            {/* 微型电子元件 - 极简设计 */}
            {/* 电阻器 */}
            <rect
              x="175"
              y="148"
              width="16"
              height="4"
              fill="#e0e0e0"
              opacity="0.4"
            />
            <rect
              x="398"
              y="370"
              width="4"
              height="16"
              fill="#e0e0e0"
              opacity="0.4"
            />
            <rect
              x="225"
              y="298"
              width="16"
              height="4"
              fill="#e0e0e0"
              opacity="0.4"
            />

            {/* LED指示灯 - 更小更淡 */}
            <circle
              cx="300"
              cy="250"
              r="3"
              fill="#e0e0e0"
              opacity="0.2"
              className="animate-led-blink"
              style={{ animationDelay: "0.2s" }}
            />
            <circle
              cx="450"
              cy="100"
              r="3"
              fill="#e0e0e0"
              opacity="0.2"
              className="animate-led-blink"
              style={{ animationDelay: "0.8s" }}
            />
            <circle
              cx="100"
              cy="400"
              r="3"
              fill="#e0e0e0"
              opacity="0.2"
              className="animate-led-blink"
              style={{ animationDelay: "1.2s" }}
            />
          </svg>
        </div>
      </div>
      {/* 滚动视差化组件 */}
      <main className="snap-y snap-mandatory h-screen overflow-y-auto scroll-smooth">
        <ParallaxSection
          foregroundImage="https://cdn.wuyilin18.top/img/foreGroundImage.webp"
          midgroundImage="https://cdn.wuyilin18.top/img/midGroundImage.webp"
          backgroundImage="https://cdn.wuyilin18.top/img/backGroundImage.webp"
        />
      </main>
      {/* 盒子显示动画 */}
      <div className=" flex flex-col items-center justify-center overflow-hidden z-6">
        <BoxReveal boxColor={"#56CFE1"} duration={0.5}>
          <h2 className="mt-[2.5rem] text-[3.5rem] ">
            <TextType
              className=" font-semibold text-[#5a5a5a] dark:text-[#b0b0b0]"
              text={[
                "Welcome to Eighteen🌲のTiny Home!",
                "Hope you have a nice day!❄️",
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </h2>
          {/* <WordRotate
            className="h-[5rem] text-[3.5rem] font-semibold bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] bg-clip-text text-transparent"
            words={[
              "Welcome to Eighteen🌲のTiny Home!",
              "Hope you have a nice day!❄️",
            ]}
          /> */}
        </BoxReveal>
        <h2 className="mt-[2.5rem] text-[1.5rem] text-[#5a5a5a] dark:text-[#b0b0b0]">
          <SplitText
            text="《硅原逐梦：二进制牧歌与云端史诗》——在数字荒原上，我以API为经，界面为纬，编织0与1的游牧传说"
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </h2>

        <BoxReveal boxColor={"#56CFE1"} duration={0.5}>
          <div className="flex justify-center text-balance mt-5 px-4">
            <div className="text-balance border-1 border-gray-500 rounded-xl w-full max-w-[80rem] md:min-w-[40rem] lg:min-w-[60rem] xl:min-w-[75rem] h-[21rem] overflow-hidden relative flex items-center">
              <div className="flex flex-row w-full h-full">
                {/* 内容方向和标题区域 - 左侧 */}
                <div className="max-w-[17.5rem] p-4 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#56CFE1]/10 to-[#9D4EDD]/10 dark:from-[#56CFE1]/20 dark:to-[#FF9470]/20 border border-[#56CFE1]/20 dark:border-[#56CFE1]/30">
                    <span className="text-[#56CFE1]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14"></path>
                      </svg>
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      技术探索
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mt-4 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] bg-clip-text text-transparent">
                    分享代码
                    <br />
                    与技术思考
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 border-l-2 border-[#56CFE1] pl-2">
                    前端、后端、嵌入式、AI
                  </p>

                  <div className="flex flex-col gap-2 mt-6">
                    <div className="cursor-target px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full text-white flex items-center w-28 shadow-sm shadow-orange-500/20 hover:shadow-orange-500/30 hover:translate-y-[-1px] transition-all">
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2v20M4.93 4.93l4.24 4.24M2 12h6M4.93 19.07l4.24-4.24M19.07 4.93l-4.24 4.24M16 12h6M19.07 19.07l-4.24-4.24"></path>
                        </svg>
                      </span>
                      <Link href="/tags/必看" className="inline-block">
                        <span className="font-medium text-sm">必看</span>
                      </Link>
                    </div>
                    <div className="cursor-target px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full text-white flex items-center w-28 shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30 hover:translate-y-[-1px] transition-all">
                      <span className="mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                      </span>
                      <Link href="/tags/教程" className="inline-block">
                        <span className="font-medium text-sm">精选教程</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 技术图标显示区域 - 右侧，使用纵向滚动布局 */}
                <div className="flex flex-row gap-4 ml-auto pr-4 overflow-hidden h-[21rem] w-[18rem] tech-icons-container">
                  {/* 左列图标 - 向下滚动 */}
                  <div className="relative overflow-hidden w-[8rem] h-full">
                    <div className="flex flex-col absolute w-full animate-scroll-down">
                      {/* 第一组技术图标 */}
                      <div
                        className="w-[8rem] h-[8rem] bg-[#5C6BC0]/20 dark:bg-[#5C6BC0]/30 border-[#5C6BC0]/30 dark:border-[#5C6BC0]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="C"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg"
                          alt="C"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#E76F00]/20 dark:bg-[#E76F00]/30 border-[#E76F00]/30 dark:border-[#E76F00]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Java"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
                          alt="Java"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#00979D]/20 dark:bg-[#00979D]/30 border-[#00979D]/30 dark:border-[#00979D]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Arduino"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg"
                          alt="Arduino"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#E44D26]/20 dark:bg-[#E44D26]/30 border-[#E44D26]/30 dark:border-[#E44D26]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="HTML5"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                          alt="HTML5"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#1572B6]/20 dark:bg-[#1572B6]/30 border-[#1572B6]/30 dark:border-[#1572B6]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="CSS3"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                          alt="CSS3"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#F7DF1E]/20 dark:bg-[#F7DF1E]/30 border-[#F7DF1E]/30 dark:border-[#F7DF1E]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="JavaScript"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                          alt="JavaScript"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>

                      {/* 复制第一组用于无缝循环 - 完全相同的内容和顺序 */}
                      <div
                        className="w-[8rem] h-[8rem] bg-[#5C6BC0]/20 dark:bg-[#5C6BC0]/30 border-[#5C6BC0]/30 dark:border-[#5C6BC0]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="C"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg"
                          alt="C"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#E76F00]/20 dark:bg-[#E76F00]/30 border-[#E76F00]/30 dark:border-[#E76F00]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Java"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
                          alt="Java"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#00979D]/20 dark:bg-[#00979D]/30 border-[#00979D]/30 dark:border-[#00979D]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Arduino"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg"
                          alt="Arduino"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#E44D26]/20 dark:bg-[#E44D26]/30 border-[#E44D26]/30 dark:border-[#E44D26]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="HTML5"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                          alt="HTML5"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#1572B6]/20 dark:bg-[#1572B6]/30 border-[#1572B6]/30 dark:border-[#1572B6]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="CSS3"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                          alt="CSS3"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#F7DF1E]/20 dark:bg-[#F7DF1E]/30 border-[#F7DF1E]/30 dark:border-[#F7DF1E]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="JavaScript"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                          alt="JavaScript"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 右列图标 - 向上滚动 */}
                  <div className="relative overflow-hidden w-[8rem] h-full">
                    <div className="flex flex-col absolute w-full animate-scroll-up">
                      {/* 第二组技术图标 */}
                      <div
                        className="w-[8rem] h-[8rem] bg-[#000000]/20 dark:bg-[#ffffff]/20 border-[#000000]/30 dark:border-[#ffffff]/40 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Next.js"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                          alt="Next.js"
                          width={48}
                          height={48}
                          className="object-contain dark:invert"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#4FC08D]/20 dark:bg-[#4FC08D]/30 border-[#4FC08D]/30 dark:border-[#4FC08D]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Vue.js"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg"
                          alt="Vue.js"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#6DB33F]/20 dark:bg-[#6DB33F]/30 border-[#6DB33F]/30 dark:border-[#6DB33F]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Spring Boot"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"
                          alt="Spring Boot"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#2496ED]/20 dark:bg-[#2496ED]/30 border-[#2496ED]/30 dark:border-[#2496ED]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Docker"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                          alt="Docker"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#31A8FF]/20 dark:bg-[#31A8FF]/30 border-[#31A8FF]/30 dark:border-[#31A8FF]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Photoshop"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg"
                          alt="Photoshop"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#007ACC]/20 dark:bg-[#007ACC]/30 border-[#007ACC]/30 dark:border-[#007ACC]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="VS Code"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
                          alt="VS Code"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#5066EB]/20 dark:bg-[#5066EB]/30 border-[#5066EB]/30 dark:border-[#5066EB]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="DeepSeek"
                      >
                        <Image
                          src="https://cdn.wuyilin18.top/img/deepseek-color.webp"
                          alt="DeepSeek"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>

                      {/* 复制第二组用于无缝循环 - 完全相同的内容和顺序 */}
                      <div
                        className="w-[8rem] h-[8rem] bg-[#000000]/20 dark:bg-[#ffffff]/20 border-[#000000]/30 dark:border-[#ffffff]/40 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Next.js"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
                          alt="Next.js"
                          width={48}
                          height={48}
                          className="object-contain dark:invert"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#4FC08D]/20 dark:bg-[#4FC08D]/30 border-[#4FC08D]/30 dark:border-[#4FC08D]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Vue.js"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg"
                          alt="Vue.js"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#6DB33F]/20 dark:bg-[#6DB33F]/30 border-[#6DB33F]/30 dark:border-[#6DB33F]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Spring Boot"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"
                          alt="Spring Boot"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#2496ED]/20 dark:bg-[#2496ED]/30 border-[#2496ED]/30 dark:border-[#2496ED]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Docker"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                          alt="Docker"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#31A8FF]/20 dark:bg-[#31A8FF]/30 border-[#31A8FF]/30 dark:border-[#31A8FF]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="Photoshop"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg"
                          alt="Photoshop"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#007ACC]/20 dark:bg-[#007ACC]/30 border-[#007ACC]/30 dark:border-[#007ACC]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="VS Code"
                      >
                        <Image
                          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
                          alt="Visual Studio Code"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <div
                        className="w-[8rem] h-[8rem] bg-[#5066EB]/20 dark:bg-[#5066EB]/30 border-[#5066EB]/30 dark:border-[#5066EB]/50 rounded-2xl flex items-center justify-center my-2 shadow-sm border-2 border-gray-100 dark:border-gray-700 tech-icon-tooltip"
                        data-tooltip="DeepSeek"
                      >
                        <Image
                          src="https://cdn.wuyilin18.top/img/deepseek-color.webp"
                          alt="DeepSeek"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BoxReveal>
      </div>
      {/* 轨道圆 */}
      <div className="relative z-10 flex h-[60rem] md:h-[55rem] flex-col items-center justify-center overflow-hidden">
        {/* 3D卡片 */}
        <div className="z-100">
          <CardContainer>
            <CardBody className="bg-[linear-gradient(90deg,_#fff_0%,_#e5e7eb_100%)] relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-gradient-to-r from-gray-900 to-gray-600 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-full h-auto rounded-xl p-6 border-2 border-gray-200">
              <CardItem
                translateZ={80}
                className=" text-xl font-bold text-neutral-600 dark:text-white "
              >
                <TextAnimate animation="scaleUp" by="text">
                  My name is:
                </TextAnimate>
              </CardItem>
              <CardItem
                translateZ={100}
                className=" mt-3 font-bold text-neutral-600 dark:text-white"
              >
                <div className="flex 5-[6rem] items-center justify-center ">
                  <div className="mx-[3rem]  font-normal text-neutral-600 dark:text-neutral-400">
                    <WordRotate
                      className=" text-[3.3rem] font-semibold bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] bg-clip-text text-transparent dark:from-[#56CFE1] dark:to-[#FF9470]"
                      words={["十八加十八", "硅原游牧人", "云端吟游者"]}
                    />
                  </div>
                </div>
                <div className="mt-2 w-full text-sm text-neutral-500 dark:text-neutral-300 border-b-2"></div>
              </CardItem>
              <CardItem
                translateZ={80}
                className=" text-xl font-bold text-neutral-600 dark:text-white "
              >
                {" "}
                <div className="mt-3 max-w-sm text-sm text-neutral-500 dark:text-neutral-300">
                  <TextAnimate
                    animation="slideLeft"
                    by="character"
                    duration={1}
                    loop={false}
                    loopDelay={3}
                  >
                    代码放牧人，逐硅基水草而居。
                  </TextAnimate>
                </div>
              </CardItem>
              <CardItem
                translateZ={70}
                className="mt-4 w-full text-xl font-bold text-neutral-600 dark:text-white"
              >
                <TextAnimate
                  className=" mt-3 mb-3 "
                  animation="scaleUp"
                  by="text"
                >
                  I&apos;m a :
                </TextAnimate>
                <div className="h-50">
                  <InteractiveMenu />
                </div>
              </CardItem>
              <div className="mt-10 flex items-center justify-between">
                <CardItem
                  translateZ={30}
                  as="a"
                  href="https://github.com/wuyilin18?tab=repositories"
                  target="_blank"
                  className="cursor-target rounded-xl pl-10 pb-5 text-sm font-normal dark:text-white"
                >
                  GitHub
                </CardItem>
              </div>

              <div className="bg-[#56CFE1]  dark:bg-[#FF9470] w-16 h-16 absolute -left-4 -bottom-4 rounded-full"></div>
            </CardBody>
          </CardContainer>
        </div>
        {/* avatar orbit */}
        <Orbit key="avatar" radius={340} duration={10} delay={5} path>
          <div className="size-30  flex items-center justify-center bg-white rounded-full">
            <Image
              src="https://cdn.wuyilin18.top/img/avatar.png"
              alt="avatar"
              width={340}
              height={340}
              className="rounded-full"
            />
          </div>
        </Orbit>

        {/* GitHub orbit */}
        <Orbit
          key="github"
          radius={300}
          duration={22}
          delay={15}
          path
          direction={ORBIT_DIRECTION.CounterClockwise}
        >
          <div className="size-10 flex items-center justify-center bg-white rounded-full">
            <Image
              src="https://cdn.wuyilin18.top/img/github-mark.png"
              alt="GitHub"
              width={300}
              height={300}
            />
          </div>
        </Orbit>

        {/* MagicUI orbit */}
        <Orbit key="MagicUI" radius={300} delay={10} duration={20} path>
          <div className="size-10 flex items-center justify-center bg-white rounded-full">
            <Image
              src="https://cdn.wuyilin18.top/img/MagicUI.png"
              alt="avatar"
              width={300}
              height={300}
            />
          </div>
        </Orbit>
        {/* AceternityUI orbit */}
        <Orbit key="AceternityUI" radius={300} delay={10} duration={18} path>
          <div className="size-10 flex items-center justify-center bg-white rounded-full">
            <Image
              src="https://cdn.wuyilin18.top/img/logo.png"
              alt="avatar"
              width={300}
              height={300}
            />
          </div>
        </Orbit>
      </div>
      {/* 文章区域 - 参考图片样式设计 */}
      <section
        id="featured-articles"
        className="py-16 z-6 bg-gradient-to-br from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* 标题区域 */}
          <div className="mb-12 mt-10 text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] bg-clip-text text-transparent">
              精选技术博文
            </h2>
            <div className="mt-4 text-gray-600 dark:text-gray-400">
              <TextAnimate
                animation="slideLeft"
                by="character"
                duration={1}
                loop={false}
                loopDelay={3}
              >
                在硅原的极夜里点亮函数，于云端的极昼中焊接星光。
              </TextAnimate>
            </div>
          </div>
          {/* 文章列表区域 - 直接使用ArticleList组件 */}
          {/* 在组件中使用时进行类型断言 */}
          <ArticleList
            posts={latestPosts as StrapiResponse}
            className="!grid-cols-1 md:!grid-cols-2 lg:!grid-cols-2 !gap-8 "
          />
          {/* 按钮区域 */}
          <div className=" mt-10 text-center">
            <Link href="/posts" className="cursor-target inline-block">
              <InteractiveHoverButton>
                查看更多文章 Start Exploring
              </InteractiveHoverButton>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
