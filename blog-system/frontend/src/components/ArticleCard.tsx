"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
// 定义图片类型，替换 any
interface StrapiImage {
  url?: string;
  data?: {
    attributes?: {
      url?: string;
      alternativeText?: string;
    };
  };
  attributes?: {
    url?: string;
    alternativeText?: string;
  };
}

interface ArticleCardProps {
  category: string | string[];
  title: string;
  date: string;
  tag: string | string[];
  image?: string | StrapiImage | null; // 替换 any 类型
  slug: string;
  noShadow?: boolean;
}

export default function ArticleCard({
  category,
  title,
  date,
  tag,
  image,
  slug,
  noShadow = false,
}: ArticleCardProps) {
  // 使用与文章页面相同的封面图片处理逻辑
  const apiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL || "https://api.wuyilin18.top";
  let coverImageUrl = "https://cdn.wuyilin18.top/img/7245943.png";

  if (image) {
    try {
      if (typeof image === "string") {
        coverImageUrl = image.startsWith("/") ? `${apiUrl}${image}` : image;
      } else if (image && typeof image === "object") {
        // 直接访问 url 属性（Strapi 5.x 扁平结构）
        if ("url" in image && image.url) {
          coverImageUrl = image.url.startsWith("/")
            ? `${apiUrl}${image.url}`
            : image.url;
        }
        // Strapi 4.x 结构
        else if (image.data?.attributes?.url) {
          const url = image.data.attributes.url;
          coverImageUrl = url.startsWith("/") ? `${apiUrl}${url}` : url;
        }
        // 其他可能的结构
        else if (image.attributes?.url) {
          const url = image.attributes.url;
          coverImageUrl = url.startsWith("/") ? `${apiUrl}${url}` : url;
        }
      }
    } catch (error) {
      console.error("处理封面图片时出错:", error);
    }
  }

  // 处理分类和标签为数组
  const categories = Array.isArray(category) ? category : [category];
  const tags = Array.isArray(tag) ? tag : [tag];

  // 输出日志帮助调试
  // console.log("ArticleCard 图片处理:", {
  //   title,
  //   originalImage: image,
  //   imageType: typeof image,
  //   imageKeys: image && typeof image === "object" ? Object.keys(image) : [],
  //   finalUrl: coverImageUrl,
  // });

  return (
    <Link href={`/posts/${slug}`}>
      <div
        className={`cursor-target group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
          !noShadow
            ? "shadow-sm hover:shadow-md hover:-translate-y-1"
            : "hover:border-[#4a7856]/30 dark:hover:border-[#a3b18a]/30"
        }`}
        style={{
          boxShadow: noShadow ? "none" : undefined,
        }}
      >
        <div className="relative">
          {/* 文章图片 - 替换为 Next.js Image 组件 */}
          <div className="h-48 overflow-hidden relative bg-gray-100 dark:bg-gray-700">
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110"
              onLoad={() => {
                // console.log("图片加载成功:", coverImageUrl);
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error("图片加载失败:", coverImageUrl);
                // console.log("切换到默认图片");
                target.src = "https://cdn.wuyilin18.top/img/7245943.png";
              }}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={75}
            />

            {/* 悬浮时的遮罩层 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* 分类标签 - 左上角，硅原游牧风格 */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-20">
            {categories
              .filter((cat) => cat && cat !== "未分类")
              .map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 rounded-full backdrop-blur-sm border border-white/20 dark:border-gray-700/20 transition-all duration-300 hover:bg-[#4a7856]/10 hover:border-[#4a7856]/30"
                >
                  📁 {cat}
                </span>
              ))}
          </div>

          {/* 悬浮装饰元素 */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/10 dark:bg-black/10 rounded-full backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="white"
              className="opacity-80"
            >
              <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" />
            </svg>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-800/30">
          {/* 标签和日期 */}
          <div className="flex items-center mb-3 flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">
              {tags
                .filter((t) => t && t.trim())
                .map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-[#4a7856] dark:text-[#a3b18a] font-medium bg-[#4a7856]/10 dark:bg-[#a3b18a]/10 px-2 py-1 rounded-full transition-colors duration-300 hover:bg-[#4a7856]/20 dark:hover:bg-[#a3b18a]/20"
                  >
                    #{t}
                  </span>
                ))}
            </div>
            {date && (
              <div className="ml-auto flex items-center text-xs text-gray-500 dark:text-gray-400">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-1.5 opacity-60"
                >
                  <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
                </svg>
                {date}
              </div>
            )}
          </div>

          {/* 标题 */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#4a7856] dark:group-hover:text-[#a3b18a] transition-colors duration-300 leading-tight">
            {title}
          </h3>

          {/* 阅读更多链接 - 硅原游牧风格 */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center text-sm text-[#4a7856] dark:text-[#a3b18a] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <span className="mr-2">阅读更多</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
              </svg>
            </div>

            {/* 装饰性元素 */}
            <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-1.5 h-1.5 bg-[#4a7856] dark:bg-[#a3b18a] rounded-full animate-pulse"></div>
              <div
                className="w-1 h-1 bg-[#4a7856] dark:bg-[#a3b18a] rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="w-0.5 h-0.5 bg-[#4a7856] dark:bg-[#a3b18a] rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          {/* 底部装饰线条 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4a7856] to-[#a3b18a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
      </div>
    </Link>
  );
}
