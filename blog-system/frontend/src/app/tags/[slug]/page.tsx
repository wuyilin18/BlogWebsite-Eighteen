import { Metadata } from "next";
import { getTagBySlug, getStrapiMedia } from "@/lib/strapi";
import Link from "next/link";
import Image from "next/image";
import React from "react";

// 定义参数类型 - 修复：改为 Promise 类型
type Params = Promise<{
  slug: string;
}>;

// 定义Strapi媒体对象类型，匹配getStrapiMedia函数的期望
interface StrapiMediaObject {
  [key: string]: unknown;
  attributes?: {
    [key: string]: unknown;
    url?: string;
    formats?: Record<string, { url: string }>;
  };
}

// 使用从 strapi.ts 导入的类型，或者定义更准确的 V4 结构
import { StrapiItem } from "@/lib/strapi";

// 定义Post类型接口，现在它是一个带有 attributes 的 StrapiItem
interface Post extends StrapiItem {
  attributes: {
    Title: string;
    Slug: string;
    PublishDate: string;
    Summary?: string;
    Content?: string;
    CoverImage?: StrapiMediaObject | null;
  };
}

// 定义标签类型，匹配 getTagBySlug 返回的嵌套结构
interface Tag {
  id: number;
  attributes: {
    name: string;
    posts: {
      data: Post[];
    };
    [key: string]: unknown;
  };
}

// 为标签页面生成元数据
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  try {
    // 解析异步的 params
    const { slug } = await params;
    // 确保对params.slug进行解码
    const decodedSlug = decodeURIComponent(slug);
    // console.log("generateMetadata: 正在查询标签:", decodedSlug);

    // getTagBySlug 已经有默认的详细 populate，此处无需覆盖
    const tag = (await getTagBySlug(decodedSlug)) as Tag | null;

    if (!tag || !tag.attributes) {
      // console.log("generateMetadata: 未找到标签，使用默认元数据:", decodedSlug);
      return {
        title: `#${decodedSlug} | 标签 | 十八加十八`,
        description: `浏览带有 #${decodedSlug} 标签的所有文章`,
      };
    }

    // 通过 attributes 访问标签名称
    const tagName = tag.attributes.name || decodedSlug;
    // console.log("generateMetadata: 找到标签:", tagName);

    return {
      title: `#${tagName} | 标签 | 十八加十八`,
      description: `浏览带有 #${tagName} 标签的所有文章`,
    };
  } catch (error) {
    console.error("generateMetadata: 生成标签元数据时出错:", error);
    // 修复：在 catch 块中也需要 await params
    const { slug } = await params;
    return {
      title: `#${slug} | 标签 | 十八加十八`,
      description: `浏览带有标签的所有文章`,
    };
  }
}

export default async function TagPage({ params }: { params: Params }) {
  try {
    const { slug } = await params;
    // 从Strapi API获取标签信息
    // 确保对params.slug进行解码
    const decodedSlug = decodeURIComponent(slug);
    // console.log("正在查询标签:", decodedSlug);

    // getTagBySlug 已经有默认的详细 populate，此处无需覆盖
    const tag = (await getTagBySlug(decodedSlug)) as Tag | null;

    // 即使找不到标签，也显示一个通用页面，而不是错误页面
    if (!tag) {
      // console.log("未找到标签，显示空标签页:", decodedSlug);

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
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0px); }
            }
            .animate-float-up {
              animation: floatUp 0.8s ease-out forwards;
            }
            .animate-scale-in {
              animation: scaleIn 0.8s ease-out forwards;
            }
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
          `,
            }}
          />

          <div className="mx-auto max-w-screen-xl px-6 sm:px-10 md:px-16 lg:px-20">
            <div
              className="text-center mb-12 opacity-0 animate-float-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#505050] to-[#808080] dark:from-[#a0a0a0] dark:to-[#d0d0d0] mb-4">
                <span className="text-gray-500 dark:text-gray-400">#</span>
                {decodedSlug}
              </h1>
              <p className="text-[#606060] dark:text-[#b0b0b0]">
                该标签暂无内容
              </p>
            </div>

            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="text-center relative z-10">
                <div className="text-6xl mb-4 animate-float">#️⃣</div>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-4">
                  该标签下暂无文章
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/tags"
                    className="px-6 py-3 bg-gradient-to-r from-[#4a7856] to-[#588157] text-white rounded-lg hover:from-[#5a8866] hover:to-[#689167] transition-all duration-300 transform hover:scale-105"
                  >
                    浏览全部标签
                  </Link>
                  <Link
                    href="/posts"
                    className="px-6 py-3 bg-gradient-to-r from-[#505050] to-[#808080] text-white rounded-lg hover:from-[#606060] hover:to-[#909090] transition-all duration-300 transform hover:scale-105"
                  >
                    浏览全部文章
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 通过 attributes 访问标签数据
    const tagName = tag.attributes.name || "未命名标签";
    // 通过 attributes 和 data 访问文章数组
    const posts = tag.attributes.posts?.data || [];

    console.log("找到标签:", tagName, "文章数:", posts.length);

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
        @keyframes tagPulse {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); }
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
        .animate-tag-pulse {
          animation: tagPulse 6s ease-in-out infinite;
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

                  {/* 标签图标 - 井号标记 */}
                  <path
                    d="M16 14L16 34 M32 14L32 34 M10 20L38 20 M10 28L38 28"
                    stroke="#606060"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-tag-pulse"
                  />

                  {/* 标签装饰点 */}
                  <circle
                    cx="16"
                    cy="20"
                    r="1.5"
                    fill="#4a7856"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <circle
                    cx="32"
                    cy="20"
                    r="1.5"
                    fill="#4a7856"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.3s" }}
                  />
                  <circle
                    cx="16"
                    cy="28"
                    r="1.5"
                    fill="#4a7856"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <circle
                    cx="32"
                    cy="28"
                    r="1.5"
                    fill="#4a7856"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.7s" }}
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

                  {/* 数据流位置标记 */}
                  <text
                    x="24"
                    y="42"
                    fill="#505050"
                    fontSize="4"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    #{posts.length}
                  </text>
                </svg>
              </div>

              <h1
                className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4a7856] to-[#588157] dark:from-[#a3b18a] dark:to-[#c3d3ba] inline-block relative"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
              >
                #{tagName}
                <span className="absolute -top-4 -right-4 text-sm font-normal text-[#5a8866] dark:text-[#b3c8ba]">
                  标签
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

                  {/* 标签音符 - 特殊的井号音符 */}
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

                  {/* 井号音符 */}
                  <path
                    d="M24,25 L24,29 M28,25 L28,29 M22,26 L30,26 M22,28 L30,28"
                    stroke="#4a7856"
                    strokeWidth="0.5"
                    className="animate-float"
                    style={{ animationDelay: "0.3s" }}
                  />

                  <defs>
                    <linearGradient
                      id="cloud-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#a3b18a" stopOpacity="0.6" />
                      <stop
                        offset="100%"
                        stopColor="#c3d3ba"
                        stopOpacity="0.3"
                      />
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
              <p className="text-[#5a8866] dark:text-[#b3c8ba] mt-2 max-w-lg mx-auto relative z-10 font-medium text-sm">
                在硅原的二进制风沙中逐水草而居，共收录 {posts.length}{" "}
                篇带有此标签的数字史诗
              </p>
            </div>
          </div>

          {posts.length === 0 ? (
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
                <div className="text-6xl mb-4 animate-float">#️⃣</div>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
                  该标签下暂无文章
                </p>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  敬请期待更多精彩内容
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/tags"
                    className="px-6 py-3 bg-gradient-to-r from-[#4a7856] to-[#588157] text-white rounded-lg hover:from-[#5a8866] hover:to-[#689167] transition-all duration-300 transform hover:scale-105"
                  >
                    浏览全部标签
                  </Link>
                  <Link
                    href="/posts"
                    className="px-6 py-3 bg-gradient-to-r from-[#505050] to-[#808080] text-white rounded-lg hover:from-[#606060] hover:to-[#909090] transition-all duration-300 transform hover:scale-105"
                  >
                    浏览全部文章
                  </Link>
                </div>
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

                  {/* 标签专用电路 */}
                  <path
                    d="M100,200 L150,200 M150,180 L150,220 M200,200 L250,200 M250,180 L250,220"
                    stroke="#4a7856"
                    strokeWidth="1"
                    fill="none"
                    strokeDasharray="2 2"
                    className="animate-data-flow"
                    style={{ animationDelay: "1.5s", opacity: 0.3 }}
                  />

                  {/* LED指示灯 */}
                  <circle
                    cx="150"
                    cy="200"
                    r="4"
                    fill="#4a7856"
                    fillOpacity="0.3"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <circle
                    cx="250"
                    cy="200"
                    r="4"
                    fill="#4a7856"
                    fillOpacity="0.3"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.8s" }}
                  />
                  <circle
                    cx="350"
                    cy="100"
                    r="4"
                    fill="#4a7856"
                    fillOpacity="0.2"
                    className="animate-led-blink"
                    style={{ animationDelay: "1.2s" }}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 relative z-10">
                {posts.map((post: Post, index: number) => (
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
                      className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 relative"
                      style={{
                        background:
                          index % 3 === 0
                            ? "rgba(80, 120, 86, 0.02)"
                            : "rgba(80, 80, 80, 0.02)",
                        borderColor:
                          index % 3 === 0
                            ? "rgba(80, 120, 86, 0.1)"
                            : "rgba(80, 80, 80, 0.1)",
                      }}
                    >
                      {/* 文章卡片装饰元素 */}
                      <div className="absolute top-2 right-2 w-8 h-8 opacity-10">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          {index % 3 === 0 ? (
                            // 井号标签图标
                            <path d="M9 11H15L14 9H10L9 11M7 13V15H17V13H19V11H17V9H19V7H17V5H15V7H9V5H7V7H5V9H7V11H5V13H7M9 13V15H15V13H9Z" />
                          ) : (
                            // 标签图标
                            <path d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.78 12.45,22 13,22C13.55,22 14.05,21.78 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.45 21.78,11.95 21.41,11.58Z" />
                          )}
                        </svg>
                      </div>

                      <ArticleCard post={post} />
                    </div>
                  </div>
                ))}
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
                      <stop offset="0%" stopColor="#4a7856" stopOpacity="0.5" />
                      <stop
                        offset="50%"
                        stopColor="#588157"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="#a3b18a"
                        stopOpacity="0.2"
                      />
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

                  {/* 标签井号中心 */}
                  <path
                    d="M80 90L80 110 M120 90L120 110 M70 95L130 95 M70 105L130 105"
                    stroke="#606060"
                    strokeWidth="1"
                    strokeLinecap="round"
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
                </svg>
              </div>
            </div>
          )}

          {/* 底部提示 - 水墨风格 */}
          <div
            className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400 opacity-0 animate-float-up"
            style={{ animationDelay: "0.7s" }}
          >
            探索#{tagName}标签的数字史诗 · 点击文章卡片阅读详情
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("获取标签信息时发生错误:", error);
    return (
      <div className="min-h-screen w-full pt-28 md:pt-32 pb-20 px-4 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-10 md:px-16 lg:px-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40">
            <div className="text-center relative z-10">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">
                获取标签信息时发生错误
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                请稍后再试，或联系管理员。
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/tags"
                  className="px-6 py-3 bg-gradient-to-r from-[#4a7856] to-[#588157] text-white rounded-lg hover:from-[#5a8866] hover:to-[#689167] transition-all duration-300 transform hover:scale-105"
                >
                  返回标签列表
                </Link>
                <Link
                  href="/posts"
                  className="px-6 py-3 bg-gradient-to-r from-[#505050] to-[#808080] text-white rounded-lg hover:from-[#606060] hover:to-[#909090] transition-all duration-300 transform hover:scale-105"
                >
                  浏览全部文章
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function ArticleCard({ post }: { post: Post }) {
  // 现在 post 是一个标准的 StrapiItem，所有数据都在 attributes 中
  const { Title, Slug, PublishDate, Summary, CoverImage } = post.attributes;

  // 使用 getStrapiMedia 安全地获取封面图片URL
  const coverImageUrl =
    getStrapiMedia(CoverImage) || "https://cdn.wuyilin18.top/img/7245943.png";

  // 格式化日期
  const publishDate = PublishDate
    ? new Date(PublishDate).toLocaleDateString("zh-CN")
    : "未知日期";

  return (
    <Link href={`/posts/${Slug || ""}`} className="cursor-target block h-full">
      <div className="h-full flex flex-col group">
        {/* 文章封面图片 */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
          <Image
            src={coverImageUrl}
            alt={Title || "文章封面"}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* 图片遮罩层 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* 悬浮装饰元素 */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
              className="opacity-80"
            >
              <path d="M9 11H15L14 9H10L9 11M7 13V15H17V13H19V11H17V9H19V7H17V5H15V7H9V5H7V7H5V9H7V11H5V13H7M9 13V15H15V13H9Z" />
            </svg>
          </div>
        </div>

        {/* 文章信息 */}
        <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
          <h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-800 dark:text-gray-100 group-hover:text-[#4a7856] dark:group-hover:text-[#a3b18a] transition-colors duration-300">
            {Title}
          </h2>

          {Summary && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm flex-grow leading-relaxed">
              {Summary}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-1.5 opacity-60"
              >
                <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
              </svg>
              <span>{publishDate}</span>
            </div>

            {/* 阅读更多指示器 */}
            <div className="flex items-center text-sm text-[#4a7856] dark:text-[#a3b18a] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <span className="mr-1">阅读</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
              </svg>
            </div>
          </div>

          {/* 底部装饰线条 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4a7856] to-[#a3b18a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
      </div>
    </Link>
  );
}
