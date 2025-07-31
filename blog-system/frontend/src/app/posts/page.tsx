import { Metadata } from "next";
import { getPosts } from "@/lib/strapi";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "博客文章 | 十八加十八",
  description: "浏览所有博客文章",
};

export default async function PostsPage() {
  // 从Strapi API获取文章列表
  const posts = await getPosts();

  // console.log("获取到文章列表:", JSON.stringify(posts, null, 2));

  // 规范化文章数据，处理关联数据的不同结构
  const normalizedPosts = posts.data.map((post) => {
    const categories =
      post.categories && "data" in post.categories
        ? post.categories.data
        : post.categories;
    const tags = post.tags && "data" in post.tags ? post.tags.data : post.tags;

    return {
      ...post,
      categories: Array.isArray(categories) ? categories : [],
      tags: Array.isArray(tags) ? tags : [],
    };
  });

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
        @keyframes cardFloat {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-5px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
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
        .animate-card-float {
          animation: cardFloat 4s ease-in-out infinite;
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
        
        /* 文章卡片样式 */
        .article-card {
          transition: all 0.3s ease;
          position: relative;
          backface-visibility: hidden;
        }
        .article-card:hover {
          transform: translateY(-8px) scale(1.02);
          z-index: 5;
        }
        .article-appear {
          opacity: 0;
          transform: translateY(30px);
          animation: floatUp 0.8s ease-out forwards;
          animation-delay: var(--delay, 0s);
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
      `,
        }}
      />

      <div className="mx-auto max-w-screen-xl px-6 sm:px-10 md:px-16 lg:px-20">
        <div
          className="text-center mb-12 opacity-0 animate-float-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-center mb-3">
            {/* 左侧硅原元素 - 电路板样式 */}
            <div className="relative w-16 h-16 mr-6">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-circuit-blink"
              >
                {/* 主电路板基座 */}
                <rect
                  x="8"
                  y="8"
                  width="48"
                  height="48"
                  rx="4"
                  stroke="#505050"
                  strokeWidth="2"
                  fill="rgba(80, 80, 80, 0.05)"
                  className="animate-circuit-pulse"
                  style={{ animationDelay: "0.2s" }}
                />

                {/* 中央处理器 */}
                <rect
                  x="20"
                  y="20"
                  width="24"
                  height="24"
                  rx="2"
                  stroke="#606060"
                  strokeWidth="1.5"
                  fill="rgba(96, 96, 96, 0.1)"
                />

                {/* CPU内部网格 */}
                <line
                  x1="26"
                  y1="20"
                  x2="26"
                  y2="44"
                  stroke="#606060"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <line
                  x1="32"
                  y1="20"
                  x2="32"
                  y2="44"
                  stroke="#606060"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <line
                  x1="38"
                  y1="20"
                  x2="38"
                  y2="44"
                  stroke="#606060"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <line
                  x1="20"
                  y1="26"
                  x2="44"
                  y2="26"
                  stroke="#606060"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <line
                  x1="20"
                  y1="32"
                  x2="44"
                  y2="32"
                  stroke="#606060"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                <line
                  x1="20"
                  y1="38"
                  x2="44"
                  y2="38"
                  stroke="#606060"
                  strokeWidth="0.5"
                  opacity="0.6"
                />

                {/* 芯片引脚 - 左侧 */}
                <line
                  x1="20"
                  y1="24"
                  x2="12"
                  y2="24"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                />
                <line
                  x1="20"
                  y1="28"
                  x2="12"
                  y2="28"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.3s" }}
                />
                <line
                  x1="20"
                  y1="32"
                  x2="12"
                  y2="32"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.6s" }}
                />
                <line
                  x1="20"
                  y1="36"
                  x2="12"
                  y2="36"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.9s" }}
                />
                <line
                  x1="20"
                  y1="40"
                  x2="12"
                  y2="40"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "1.2s" }}
                />

                {/* 芯片引脚 - 右侧 */}
                <line
                  x1="44"
                  y1="24"
                  x2="52"
                  y2="24"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.4s" }}
                />
                <line
                  x1="44"
                  y1="28"
                  x2="52"
                  y2="28"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.7s" }}
                />
                <line
                  x1="44"
                  y1="32"
                  x2="52"
                  y2="32"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "1s" }}
                />
                <line
                  x1="44"
                  y1="36"
                  x2="52"
                  y2="36"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "1.3s" }}
                />
                <line
                  x1="44"
                  y1="40"
                  x2="52"
                  y2="40"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "1.6s" }}
                />

                {/* 芯片引脚 - 上侧 */}
                <line
                  x1="24"
                  y1="20"
                  x2="24"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.2s" }}
                />
                <line
                  x1="28"
                  y1="20"
                  x2="28"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.8s" }}
                />
                <line
                  x1="32"
                  y1="20"
                  x2="32"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.5s" }}
                />
                <line
                  x1="36"
                  y1="20"
                  x2="36"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "1.1s" }}
                />
                <line
                  x1="40"
                  y1="20"
                  x2="40"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "1.4s" }}
                />

                {/* 芯片引脚 - 下侧 */}
                <line
                  x1="24"
                  y1="44"
                  x2="24"
                  y2="52"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.7s" }}
                />
                <line
                  x1="28"
                  y1="44"
                  x2="28"
                  y2="52"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.4s" }}
                />
                <line
                  x1="32"
                  y1="44"
                  x2="32"
                  y2="52"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "1s" }}
                />
                <line
                  x1="36"
                  y1="44"
                  x2="36"
                  y2="52"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.6s" }}
                />
                <line
                  x1="40"
                  y1="44"
                  x2="40"
                  y2="52"
                  stroke="#606060"
                  strokeWidth="2"
                  className="animate-data-flow"
                  style={{ animationDelay: "1.3s" }}
                />

                {/* 四角LED状态灯 */}
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.5s" }}
                />
                <circle
                  cx="52"
                  cy="12"
                  r="3"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.2s" }}
                />
                <circle
                  cx="52"
                  cy="52"
                  r="3"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "2s" }}
                />
                <circle
                  cx="12"
                  cy="52"
                  r="3"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.7s" }}
                />

                {/* 中央硅原标识 */}
                <text
                  x="32"
                  y="34"
                  fill="#505050"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="animate-pulse"
                >
                  Si
                </text>

                {/* 散热栅格 */}
                <rect
                  x="22"
                  y="22"
                  width="20"
                  height="20"
                  rx="1"
                  stroke="#707070"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.4"
                />
                <line
                  x1="25"
                  y1="22"
                  x2="25"
                  y2="42"
                  stroke="#707070"
                  strokeWidth="0.3"
                  opacity="0.3"
                />
                <line
                  x1="29"
                  y1="22"
                  x2="29"
                  y2="42"
                  stroke="#707070"
                  strokeWidth="0.3"
                  opacity="0.3"
                />
                <line
                  x1="33"
                  y1="22"
                  x2="33"
                  y2="42"
                  stroke="#707070"
                  strokeWidth="0.3"
                  opacity="0.3"
                />
                <line
                  x1="37"
                  y1="22"
                  x2="37"
                  y2="42"
                  stroke="#707070"
                  strokeWidth="0.3"
                  opacity="0.3"
                />
                <line
                  x1="39"
                  y1="22"
                  x2="39"
                  y2="42"
                  stroke="#707070"
                  strokeWidth="0.3"
                  opacity="0.3"
                />

                {/* 电路轨迹 */}
                <path
                  d="M8,16 Q16,16 16,24 T32,24 Q48,24 48,32"
                  stroke="#4a7856"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="3,2"
                  className="animate-circuit"
                  opacity="0.6"
                />
                <path
                  d="M8,48 Q16,48 16,40 T32,40 Q48,40 48,32"
                  stroke="#4a7856"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="3,2"
                  className="animate-circuit"
                  style={{ animationDelay: "0.8s" }}
                  opacity="0.6"
                />
              </svg>
            </div>

            <h1
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#505050] to-[#808080] dark:from-[#a0a0a0] dark:to-[#d0d0d0] inline-block relative"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            >
              博客文章
              <span className="absolute -top-4 -right-4 text-sm font-normal text-[#5a5a5a] dark:text-[#b0b0b0]">
                硅原游牧
              </span>
            </h1>

            {/* 右侧云端元素 - 云朵和竹笛组合 */}
            <div className="relative w-20 h-16 ml-6 animate-cloud">
              <svg
                width="80"
                height="64"
                viewBox="0 0 80 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 云端背景 - 更精致的云朵 */}
                <path
                  d="M25,42 C15,42 10,35 10,27 C10,19 16,14 23,16 C25,8 35,8 40,13 C45,5 60,10 58,20 C66,23 68,36 60,42 C55,50 35,48 25,42 Z"
                  fill="url(#cloud-gradient)"
                  className="animate-cloud"
                  style={{ filter: "blur(1.5px)" }}
                />

                {/* 云朵内部纹理 */}
                <ellipse
                  cx="35"
                  cy="28"
                  rx="15"
                  ry="8"
                  fill="url(#cloud-inner)"
                  opacity="0.3"
                />
                <ellipse
                  cx="45"
                  cy="32"
                  rx="10"
                  ry="5"
                  fill="url(#cloud-inner)"
                  opacity="0.2"
                />
                <ellipse
                  cx="25"
                  cy="35"
                  rx="8"
                  ry="4"
                  fill="url(#cloud-inner)"
                  opacity="0.25"
                />

                {/* 竹笛主体 - 更精致的设计 */}
                <rect
                  x="38"
                  y="20"
                  width="5"
                  height="32"
                  rx="2.5"
                  fill="url(#flute-gradient)"
                  className="animate-bamboo-sway"
                  style={{
                    transformOrigin: "center bottom",
                    animationDuration: "10s",
                  }}
                />

                {/* 竹节纹理 */}
                <rect
                  x="38"
                  y="26"
                  width="5"
                  height="1.5"
                  fill="#3a5a40"
                  opacity="0.8"
                />
                <rect
                  x="38"
                  y="34"
                  width="5"
                  height="1.5"
                  fill="#3a5a40"
                  opacity="0.8"
                />
                <rect
                  x="38"
                  y="42"
                  width="5"
                  height="1.5"
                  fill="#3a5a40"
                  opacity="0.8"
                />

                {/* 竹笛孔洞 */}
                <circle cx="40.5" cy="23" r="0.8" fill="#3a5a40" />
                <circle cx="40.5" cy="28" r="0.6" fill="#3a5a40" />
                <circle cx="40.5" cy="32" r="0.6" fill="#3a5a40" />
                <circle cx="40.5" cy="36" r="0.6" fill="#3a5a40" />
                <circle cx="40.5" cy="40" r="0.6" fill="#3a5a40" />
                <circle cx="40.5" cy="44" r="0.6" fill="#3a5a40" />

                {/* 吹奏口 - 更精致 */}
                <ellipse cx="40.5" cy="20" rx="3" ry="2" fill="#3a5a40" />
                <ellipse cx="40.5" cy="20" rx="2" ry="1.3" fill="#588157" />

                {/* 音符和代码符号 - 左侧API流 */}
                <g className="animate-float" style={{ animationDelay: "0.2s" }}>
                  <path
                    d="M28,24 L25,26 L28,28"
                    stroke="#4a7856"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="23"
                    cy="26"
                    r="1.5"
                    fill="#4a7856"
                    opacity="0.7"
                  />
                </g>

                <g className="animate-float" style={{ animationDelay: "0.8s" }}>
                  <path
                    d="M30,32 C27,32 27,35 30,35"
                    stroke="#4a7856"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <text x="24" y="35" fill="#4a7856" fontSize="4" opacity="0.8">
                    API
                  </text>
                </g>

                {/* 音符和代码符号 - 右侧界面流 */}
                <g className="animate-float" style={{ animationDelay: "0.5s" }}>
                  <path
                    d="M52,23 L55,25 L52,27"
                    stroke="#4a7856"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect
                    x="56"
                    y="24"
                    width="3"
                    height="2"
                    rx="0.5"
                    stroke="#4a7856"
                    strokeWidth="0.8"
                    fill="none"
                  />
                </g>

                <g className="animate-float" style={{ animationDelay: "1.1s" }}>
                  <path
                    d="M50,31 L53,31 L53,34"
                    stroke="#4a7856"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <text x="54" y="35" fill="#4a7856" fontSize="4" opacity="0.8">
                    UI
                  </text>
                </g>

                {/* 流动的数据线条 */}
                <path
                  d="M25,15 C30,12 35,18 45,14"
                  stroke="#4a7856"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                  className="animate-circuit"
                  style={{ animationDelay: "0.3s" }}
                  opacity="0.6"
                />
                <path
                  d="M20,20 C25,17 30,23 40,19"
                  stroke="#4a7856"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                  className="animate-circuit"
                  style={{ animationDelay: "0.7s" }}
                  opacity="0.5"
                />

                {/* 云端数据点 */}
                <circle
                  cx="30"
                  cy="25"
                  r="1"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.4s" }}
                />
                <circle
                  cx="48"
                  cy="28"
                  r="1"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.9s" }}
                />
                <circle
                  cx="35"
                  cy="38"
                  r="1"
                  fill="#4a7856"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.4s" }}
                />

                {/* 梯度定义 */}
                <defs>
                  <linearGradient
                    id="cloud-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#a0a0a0" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#c0c0c0" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#d0d0d0" stopOpacity="0.3" />
                  </linearGradient>

                  <radialGradient id="cloud-inner" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                  </radialGradient>

                  <linearGradient
                    id="flute-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#588157" />
                    <stop offset="30%" stopColor="#6a9569" />
                    <stop offset="70%" stopColor="#7ba87a" />
                    <stop offset="100%" stopColor="#a3b18a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-[#606060] dark:text-[#b0b0b0] mt-2 max-w-lg mx-auto relative z-10 font-medium text-sm">
              在硅原的极夜里点亮函数，于云端的极昼中焊接星光。
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

        {!posts.data || posts.data.length === 0 ? (
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
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

              {/* 粒子效果 */}
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>

            <div className="text-center relative z-10">
              <div className="text-6xl mb-4 animate-float">📝</div>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
                暂无文章
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                敬请期待更多精彩内容
              </p>
            </div>
          </div>
        ) : (
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-6 md:p-8 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
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

              {/* 粒子效果 */}
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

            {/* 文章网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {normalizedPosts
                .filter((post) => post && post.Title)
                .map((post, index: number) => {
                  const category =
                    (post.categories && post.categories.length > 0
                      ? post.categories[0].name
                      : "未分类") ?? "未分类";

                  const tag =
                    (post.tags && post.tags.length > 0
                      ? post.tags[0].name
                      : "") ?? "";

                  // 删除原来的图片处理逻辑，直接使用原始数据
                  // console.log(
                  //   `文章 ${post.Title} 的完整数据:`,
                  //   JSON.stringify(post, null, 2)
                  // );

                  return (
                    <div
                      key={post.id}
                      className="article-card article-appear"
                      style={
                        {
                          "--delay": `${0.1 + index * 0.1}s`,
                        } as React.CSSProperties
                      }
                    >
                      <div
                        className=" article-card-container bg-white dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 relative group"
                        style={{
                          background:
                            index % 3 === 0
                              ? "rgba(80, 120, 86, 0.02)"
                              : "rgba(80, 80, 80, 0.02)",
                          borderColor:
                            index % 3 === 0
                              ? "rgba(80, 120, 86, 0.1)"
                              : "rgba(80, 80, 80, 0.1)",
                          boxShadow:
                            "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <ArticleCard
                          title={post.Title || "无标题"}
                          category={category}
                          date={
                            post.PublishDate
                              ? new Date(post.PublishDate).toLocaleDateString(
                                  "zh-CN"
                                )
                              : ""
                          }
                          tag={tag}
                          image={post.CoverImage} // 直接传递原始的 CoverImage 对象（注意大写）
                          slug={String(post.Slug || post.id)}
                          noShadow={true}
                        />
                      </div>
                    </div>
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
        )}

        {/* 底部提示 - 水墨风格 */}
        <div
          className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400 opacity-0 animate-float-up"
          style={{ animationDelay: "0.7s" }}
        >
          探索硅原游牧的数字史诗 · 点击文章卡片阅读详情
        </div>
      </div>
    </div>
  );
}
