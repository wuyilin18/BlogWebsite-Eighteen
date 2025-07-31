"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Timeline } from "@/components/AceternityUI/timeline";
import { getPosts } from "@/lib/strapi";
import Link from "next/link";
import Image from "next/image";

interface ProcessedPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  summary?: string;
  coverImage?: string;
}

interface TimelineData {
  title: string;
  content: React.ReactNode;
}

export default function Archives() {
  const [animate, setAnimate] = useState(false);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);

  // 使用 useCallback 包装动画函数
  const startAnimation = useCallback(() => {
    setTimeout(() => setAnimate(true), 300);
  }, []);

  // 使用 useCallback 包装数据获取函数
  const fetchData = useCallback(async () => {
    try {
      const postsData = await getPosts({
        fields: ["Title", "Slug", "PublishDate", "Summary"],
        populate: "*", // 先获取所有字段来查看结构
        sort: ["PublishDate:desc"],
      });

      // 调试输出
      // console.log("Posts data:", postsData);
      // if (postsData?.data?.[0]) {
      //   console.log("First post structure:", postsData.data[0]);
      //   console.log("First post attributes:", postsData.data[0].attributes);
      // }

      // 处理数据，按年份分组 - 使用通用类型避免类型冲突
      const posts: ProcessedPost[] = (postsData?.data || []).map(
        (post: unknown) => {
          // 类型保护函数
          const isValidPost = (
            item: unknown
          ): item is Record<string, unknown> => {
            return typeof item === "object" && item !== null;
          };

          if (!isValidPost(post)) {
            return {
              id: 0,
              title: "无效文章",
              slug: "",
              date: "",
              summary: "",
              coverImage: undefined,
            };
          }

          // 安全地获取 ID
          const id = typeof post.id === "number" ? post.id : 0;

          // 安全地获取属性，优先从 attributes 获取，如果没有则从根级别获取
          const getPostAttribute = (key: string): unknown => {
            const attributes = post.attributes as
              | Record<string, unknown>
              | undefined;
            if (attributes && key in attributes) {
              return attributes[key];
            }
            // 备用：从根级别获取
            return post[key as keyof typeof post];
          };

          const title = String(getPostAttribute("Title") || "无标题");
          const slug = String(getPostAttribute("Slug") || "");
          const publishDate = String(getPostAttribute("PublishDate") || "");
          const summary = getPostAttribute("Summary")
            ? String(getPostAttribute("Summary"))
            : undefined;

          // 尝试多种可能的封面图字段路径
          let coverImage: string | undefined = undefined;

          // 修改后的辅助函数：安全地获取图片URL
          const getImageUrl = (field: unknown): string | undefined => {
            if (!field || field === null || field === undefined) {
              return undefined;
            }

            // 如果是字符串，直接返回
            if (typeof field === "string") {
              return field;
            }

            // 如果是对象，尝试获取 URL
            if (typeof field === "object") {
              const fieldObj = field as Record<string, unknown>;

              // 直接的 url 属性
              if (typeof fieldObj.url === "string") {
                return fieldObj.url;
              }

              // Strapi 媒体对象结构：field.attributes.url
              const attributes = fieldObj.attributes as
                | Record<string, unknown>
                | undefined;
              if (attributes && typeof attributes.url === "string") {
                return attributes.url;
              }

              // 尝试从 formats 中获取
              if (
                attributes &&
                typeof attributes.formats === "object" &&
                attributes.formats
              ) {
                const formats = attributes.formats as Record<string, unknown>;
                // 尝试获取不同尺寸的图片
                for (const size of ["medium", "small", "thumbnail"]) {
                  const format = formats[size] as
                    | Record<string, unknown>
                    | undefined;
                  if (format && typeof format.url === "string") {
                    return format.url;
                  }
                }
              }

              // 尝试从 data 字段获取
              if (fieldObj.data) {
                const data = fieldObj.data;
                if (Array.isArray(data) && data.length > 0) {
                  return getImageUrl(data[0]);
                } else if (typeof data === "object") {
                  return getImageUrl(data);
                }
              }
            }

            return undefined;
          };

          // 尝试不同的字段名称
          const imageFields = [
            getPostAttribute("CoverImage"),
            getPostAttribute("cover"),
            getPostAttribute("coverImage"),
            getPostAttribute("Cover"),
            getPostAttribute("featured_image"),
            getPostAttribute("image"),
          ];

          for (const field of imageFields) {
            const url = getImageUrl(field);
            if (url) {
              coverImage = url;
              break;
            }
          }

          // console.log(`Post ${id} cover image:`, coverImage);

          return {
            id,
            title,
            slug,
            date: publishDate,
            summary,
            coverImage,
          };
        }
      );

      // 过滤掉没有必要信息的文章
      const validPosts = posts.filter(
        (post) => post.title && post.slug && post.date && post.id > 0
      );

      // 按年份分组
      const yearMap: Record<string, ProcessedPost[]> = {};
      validPosts.forEach((post) => {
        if (!post.date) return;
        try {
          const year = new Date(post.date).getFullYear().toString();
          if (!yearMap[year]) yearMap[year] = [];
          yearMap[year].push(post);
        } catch {
          console.warn(`Invalid date for post ${post.id}:`, post.date);
        }
      });

      // 组装 Timeline 需要的数据
      const data: TimelineData[] = Object.keys(yearMap)
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => ({
          title: year,
          content: (
            <div className="space-y-6">
              {yearMap[year].map((post) => (
                <div
                  key={post.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                >
                  <Link
                    href={`/posts/${post.slug}`}
                    className="flex flex-col md:flex-row gap-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-3 transition-all duration-300"
                  >
                    {/* 封面图 - 响应式布局 */}
                    <div className="w-full md:w-32 lg:w-36 flex-shrink-0">
                      <div className="relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        {post.coverImage ? (
                          <Image
                            src={
                              post.coverImage.startsWith("http")
                                ? post.coverImage
                                : `${process.env.NEXT_PUBLIC_STRAPI_URL}${post.coverImage}`
                            }
                            alt={post.title}
                            fill
                            className="object-cover"
                            onError={() => {
                              console.log(
                                `Image load error for post ${post.id}:`,
                                post.coverImage
                              );
                            }}
                          />
                        ) : (
                          // 默认封面图占位符
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400 dark:text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 文章信息 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#66a6ff] dark:group-hover:text-[#66a6ff] transition-colors duration-300 mb-2">
                        {post.title}
                      </h3>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {new Date(post.date).toLocaleDateString("zh-CN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>

                      {post.summary && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                          {post.summary}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ),
        }));

      setTimelineData(data);
    } catch (error) {
      console.error("获取文章数据失败:", error);
    }
  }, []); // 空依赖数组，因为函数内部没有依赖任何 props 或 state

  // 修复 useEffect 依赖问题
  useEffect(() => {
    startAnimation();
    fetchData();
  }, [startAnimation, fetchData]); // 添加正确的依赖项

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
        .animate-led-blink {
          animation: ledBlink 2s ease-in-out infinite;
        }
        .animate-data-flow {
          stroke-dasharray: 4, 2;
          animation: dataFlow 2s linear infinite;
        }
        
        /* 限制文本行数 */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* 粒子效果 */
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
        
        @keyframes inkDrop {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0.4; }
        }
      `,
        }}
      />
      {/* 其余 JSX 代码保持不变 */}
      <div className="mx-auto max-w-screen-xl px-6 sm:px-10 md:px-16 lg:px-20">
        <div
          className={`text-center mb-10 opacity-0 ${
            animate ? "animate-float-up" : ""
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-center mb-3">
            {/* 左侧硅原元素 - 电路风格 */}
            <div className="relative w-12 h-12 mr-6">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
                  className="animate-pulse"
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

                {/* LED灯 */}
                <circle
                  cx="8"
                  cy="8"
                  r="2"
                  fill="#2A9D8F"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.2s" }}
                />
                <circle
                  cx="40"
                  cy="8"
                  r="2"
                  fill="#90BE6D"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.8s" }}
                />
                <circle
                  cx="40"
                  cy="40"
                  r="2"
                  fill="#43AA8B"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.5s" }}
                />

                <text
                  x="24"
                  y="24"
                  fill="#505050"
                  fontSize="4"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  Arc
                </text>
              </svg>
            </div>

            <h1
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] inline-block relative"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            >
              时间的轨迹
              <span className="absolute -top-4 -right-6 text-sm font-normal text-[#9D4EDD] dark:text-[#b0b0b0]">
                硅原游牧
              </span>
            </h1>

            {/* 右侧云端元素 */}
            <div className="relative w-16 h-12 ml-6 animate-cloud">
              <svg
                width="72"
                height="56"
                viewBox="0 0 64 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20,32 C12,32 8,26 8,20 C8,14 14,10 20,12 C22,6 30,6 34,10 C38,4 50,8 48,16 C54,18 56,28 50,32 C46,38 28,36 20,32 Z"
                  fill="url(#cloud-gradient)"
                  style={{ filter: "blur(1px)" }}
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
              数字旅程中的足迹与记忆
            </p>
          </div>
        </div>

        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-500 p-6 md:p-8 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 min-h-[600px] ${
            animate ? "animate-scale-in" : ""
          }`}
          style={{
            animationDelay: "0.3s",
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.03)",
            border: "1px solid rgba(150, 150, 150, 0.1)",
          }}
        >
          {/* 水墨效果和装饰 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 墨点和墨痕 */}
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

              {/* LED指示灯 */}
              <circle
                cx="250"
                cy="300"
                r="4"
                fill="#2A9D8F"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "0.2s" }}
              />
              <circle
                cx="200"
                cy="50"
                r="4"
                fill="#90BE6D"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "0.8s" }}
              />
              <circle
                cx="400"
                cy="200"
                r="4"
                fill="#43AA8B"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "1.2s" }}
              />
            </svg>

            {/* 墨滴粒子 */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>

          {/* 装饰性线条 */}
          <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>

          {/* Timeline容器 */}
          <div className="relative z-10 w-full">
            {timelineData.length === 0 ? (
              <div className="flex justify-center items-center h-40">
                <div className="text-gray-500 dark:text-gray-400">
                  正在加载归档数据...
                </div>
              </div>
            ) : (
              <Timeline data={timelineData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
