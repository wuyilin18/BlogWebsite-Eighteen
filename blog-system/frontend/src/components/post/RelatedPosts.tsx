"use client";

import React from "react";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import { StrapiMediaObject } from "@/lib/strapi";

// 定义简单标签类型
interface SimpleTag {
  id: number;
  name: string;
}

// 定义文章类型
interface Post {
  id: number;
  Title?: string;
  Summary?: string;
  slug?: string;
  PublishDate?: string;
  CoverImage?: StrapiMediaObject | null;
  tags?: SimpleTag[];
  categories?: SimpleTag[];
}

interface RelatedPostsProps {
  posts: Post[]; // 直接接收处理好的文章数据
  currentPostTags?: SimpleTag[]; // 当前文章的标签（用于高亮）
  apiUrl: string;
  maxPosts?: number;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({
  posts,
  currentPostTags = [],
  apiUrl,
  maxPosts = 4,
}) => {
  // console.log("RelatedPosts 接收到的数据:", { posts, currentPostTags });

  // 处理封面图片URL - 修复Strapi v5数据结构
  const getCoverImageUrl = (
    coverImage: StrapiMediaObject | string | null
  ): string => {
    const defaultImage = "https://cdn.wuyilin18.top/img/7245943.png";

    if (!coverImage) return defaultImage;

    try {
      // 1. 检查是否为字符串URL
      if (typeof coverImage === "string") {
        return coverImage.startsWith("/")
          ? `${apiUrl}${coverImage}`
          : coverImage;
      }

      // 2. 检查Strapi v5的扁平化结构
      if (typeof coverImage === "object" && coverImage.url) {
        const url = coverImage.url;
        return url.startsWith("/") ? `${apiUrl}${url}` : url;
      }

      // 3. 检查Strapi v4的嵌套结构
      if ("data" in coverImage && coverImage.data?.attributes?.url) {
        const url = coverImage.data.attributes.url;
        return url.startsWith("/") ? `${apiUrl}${url}` : url;
      }

      // 4. 调试：打印未识别的封面图数据
      console.warn("未识别的封面图数据结构:", coverImage);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("处理封面图片时出错:", error.message);
      } else {
        console.error("处理封面图片时发生未知错误:", String(error));
      }
    }

    return defaultImage;
  };

  // 如果没有相关文章，不渲染组件
  if (!posts || posts.length === 0) {
    // console.log("没有相关文章，不渲染组件");
    return null;
  }

  // 限制显示的文章数量
  const displayPosts = posts.slice(0, maxPosts);

  // 获取当前文章的标签名称（用于高亮）
  const currentTagNames = currentPostTags.map((tag) => tag.name.toLowerCase());

  // console.log("准备渲染的文章:", displayPosts);
  // console.log("当前文章标签:", currentTagNames);

  return (
    <div className="mt-16 mb-12">
      {/* 装饰性分隔线 */}
      <div className="w-full flex justify-center mb-8">
        <div className="w-24 h-0.5 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] rounded-full opacity-50"></div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-8 md:p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40">
        {/* 渐变背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] opacity-5"></div>

        {/* 装饰性线条 */}
        <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>

        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] rounded-lg flex items-center justify-center mr-3 shadow-md">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              相关推荐 ({displayPosts.length})
            </h2>
          </div>
          <Link
            href="/posts"
            className="cursor-target text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors duration-300"
          >
            查看更多
          </Link>
        </div>

        {/* 文章列表 */}
        <div
          className={`grid gap-8 relative z-10 ${
            displayPosts.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : displayPosts.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
          }`}
        >
          {displayPosts.map((post) => {
            const postSlug = post.slug;
            const postTags = post.tags || [];

            return (
              <Link
                key={post.id}
                href={`/posts/${postSlug}`}
                className="cursor-target group block"
              >
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  {/* 封面图片 */}
                  <div className="aspect-video relative overflow-hidden">
                    <PostImage
                      src={getCoverImageUrl(post.CoverImage || null)}
                      alt={post.Title || "文章封面"}
                    />
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* 文章信息 */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {post.Title || "无标题"}
                    </h3>

                    {post.Summary && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {post.Summary}
                      </p>
                    )}

                    {/* 相同标签高亮显示 */}
                    {postTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {postTags.slice(0, 3).map((tag) => {
                          const isCommonTag = currentTagNames.includes(
                            tag.name.toLowerCase()
                          );
                          return (
                            <span
                              key={tag.id}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isCommonTag
                                  ? "bg-gradient-to-r from-[#56CFE1]/30 to-[#9D4EDD]/30 dark:from-[#56CFE1]/30 dark:to-[#FF9470]/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-700"
                                  : "bg-gradient-to-r from-[#56CFE1]/20 to-[#9D4EDD]/20 dark:from-[#56CFE1]/20 dark:to-[#FF9470]/20 text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              #{tag.name}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* 发布时间 */}
                    {post.PublishDate && (
                      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(post.PublishDate).toLocaleDateString("zh-CN")}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 装饰性背景图案 */}
        <div className="absolute top-4 right-4 w-16 h-16 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="20" cy="20" r="2" className="fill-[#56CFE1]">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="50"
              cy="30"
              r="1.5"
              className="fill-[#9D4EDD] dark:fill-[#FF9470]"
            >
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="80" cy="50" r="1" className="fill-[#56CFE1]">
              <animate
                attributeName="opacity"
                values="0.2;0.8;0.2"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export { RelatedPosts };
