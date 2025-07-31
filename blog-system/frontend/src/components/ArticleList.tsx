"use client";

import React from "react";
import ArticleCard from "@/components/ArticleCard";
import {
  StrapiResponse,
  StrapiItem,
  ProcessedPost,
  CoverImageType,
} from "@/types/strapi";

// 修改接口，使用更通用的类型
interface ArticleListProps {
  posts: StrapiResponse;
  className?: string;
}

function getFullImageUrl(url?: string) {
  if (!url) return "https://cdn.wuyilin18.top/img/7245943.png";
  return url.startsWith("/uploads/") ? `https://api.wuyilin18.top${url}` : url;
}

// 创建一个数据处理函数，将 StrapiItem 转换为 ProcessedPost
function processStrapiItem(item: StrapiItem | null | undefined): ProcessedPost {
  // 安全检查：确保 item 存在
  if (!item || typeof item !== "object") {
    return {
      id: 0,
      title: "无效文章",
      slug: "invalid",
      publishDate: new Date().toISOString(),
      summary: undefined,
      content: undefined,
      coverImage: "https://cdn.wuyilin18.top/img/7245943.png",
      categories: ["未分类"],
      tags: [],
    };
  }

  // 安全地获取属性值
  const getStringValue = (key: string, fallback: string = ""): string => {
    try {
      // 优先从 attributes 获取
      if (
        item.attributes &&
        typeof item.attributes === "object" &&
        item.attributes !== null
      ) {
        const attributeValue = item.attributes[key];
        if (typeof attributeValue === "string") {
          return attributeValue;
        }
      }

      // 备用：从根级别获取
      const rootValue = (item as Record<string, unknown>)?.[key];
      if (typeof rootValue === "string") {
        return rootValue;
      }

      return fallback;
    } catch (error) {
      console.warn(`Error getting value for key "${key}":`, error);
      return fallback;
    }
  };

  // 处理必需字段
  const title = getStringValue("Title", "无标题");
  const slug = getStringValue("Slug", String(item.id || 0));
  const publishDate = getStringValue("PublishDate", new Date().toISOString());
  const summary = getStringValue("Summary") || undefined;
  const content = getStringValue("Content") || undefined;

  // 处理分类信息
  let categories: string[] = [];
  try {
    // 检查 attributes.categories
    if (
      item.attributes?.categories &&
      typeof item.attributes.categories === "object" &&
      item.attributes.categories !== null &&
      "data" in item.attributes.categories &&
      Array.isArray(item.attributes.categories.data)
    ) {
      categories = item.attributes.categories.data
        .filter(
          (cat): cat is NonNullable<typeof cat> =>
            cat !== null &&
            cat !== undefined &&
            typeof cat === "object" &&
            cat.attributes &&
            typeof cat.attributes === "object" &&
            cat.attributes !== null &&
            typeof cat.attributes.name === "string"
        )
        .map((cat) => cat.attributes.name);
    } else {
      // 检查扁平结构
      const rootCategories = (item as Record<string, unknown>)?.categories;
      if (Array.isArray(rootCategories)) {
        categories = rootCategories
          .filter(
            (cat): cat is NonNullable<typeof cat> =>
              cat !== null &&
              cat !== undefined &&
              typeof cat === "object" &&
              "name" in cat &&
              typeof (cat as Record<string, unknown>).name === "string"
          )
          .map((cat) => (cat as Record<string, unknown>).name as string);
      }
    }
  } catch (error) {
    console.warn("Error processing categories:", error);
    categories = [];
  }

  // 处理标签信息
  let tags: string[] = [];
  try {
    // 检查 attributes.tags
    if (
      item.attributes?.tags &&
      typeof item.attributes.tags === "object" &&
      item.attributes.tags !== null &&
      "data" in item.attributes.tags &&
      Array.isArray(item.attributes.tags.data)
    ) {
      tags = item.attributes.tags.data
        .filter(
          (tag): tag is NonNullable<typeof tag> =>
            tag !== null &&
            tag !== undefined &&
            typeof tag === "object" &&
            tag.attributes &&
            typeof tag.attributes === "object" &&
            tag.attributes !== null &&
            typeof tag.attributes.name === "string"
        )
        .map((tag) => tag.attributes.name);
    } else {
      // 检查扁平结构
      const rootTags = (item as Record<string, unknown>)?.tags;
      if (Array.isArray(rootTags)) {
        tags = rootTags
          .filter(
            (tag): tag is NonNullable<typeof tag> =>
              tag !== null &&
              tag !== undefined &&
              typeof tag === "object" &&
              "name" in tag &&
              typeof (tag as Record<string, unknown>).name === "string"
          )
          .map((tag) => (tag as Record<string, unknown>).name as string);
      }
    }
  } catch (error) {
    console.warn("Error processing tags:", error);
    tags = [];
  }

  // 处理封面图片
  let coverImage = "https://cdn.wuyilin18.top/img/7245943.png";

  try {
    // 先尝试从 attributes 获取
    let imageSource = item.attributes?.CoverImage;

    // 如果 attributes 中没有，尝试从根级别获取
    if (!imageSource) {
      const rootImage = (item as Record<string, unknown>)?.CoverImage;
      if (rootImage) {
        imageSource = rootImage as CoverImageType | null;
      }
    }

    if (imageSource && imageSource !== null) {
      if (typeof imageSource === "string") {
        coverImage = getFullImageUrl(imageSource);
      } else if (typeof imageSource === "object") {
        const imageObj = imageSource as Record<string, unknown>;
        if (typeof imageObj.url === "string") {
          coverImage = getFullImageUrl(imageObj.url);
        } else if (
          imageObj.data &&
          typeof imageObj.data === "object" &&
          imageObj.data !== null
        ) {
          const dataObj = imageObj.data as Record<string, unknown>;
          if (
            dataObj.attributes &&
            typeof dataObj.attributes === "object" &&
            dataObj.attributes !== null
          ) {
            const attributesObj = dataObj.attributes as Record<string, unknown>;
            if (typeof attributesObj.url === "string") {
              coverImage = getFullImageUrl(attributesObj.url);
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn("Error processing cover image:", error);
    // 保持默认图片
  }

  return {
    id: item.id || 0,
    title,
    slug,
    publishDate,
    summary,
    content,
    coverImage,
    categories: categories.length > 0 ? categories : ["未分类"],
    tags,
  };
}

export default function ArticleList({
  posts,
  className = "",
}: ArticleListProps) {
  // 日志输出实际数据结构
  // console.log("文章数据 posts:", JSON.stringify(posts, null, 2));

  // 检查数据是否存在
  if (
    !posts ||
    !posts.data ||
    !Array.isArray(posts.data) ||
    posts.data.length === 0
  ) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600 dark:text-gray-400">暂无文章</p>
      </div>
    );
  }

  // 处理数据，过滤掉无效项目
  const processedPosts: ProcessedPost[] = posts.data
    .filter(
      (item): item is StrapiItem =>
        item !== null &&
        item !== undefined &&
        typeof item === "object" &&
        typeof item.id === "number"
    )
    .map(processStrapiItem)
    .filter((post) => post.id > 0 && post.title !== "无效文章"); // 过滤掉无效的文章

  // 如果处理后没有有效文章
  if (processedPosts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600 dark:text-gray-400">暂无有效文章</p>
      </div>
    );
  }

  // 合并默认网格布局和传入的类名
  const gridClasses = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`;

  return (
    <div className={gridClasses}>
      {processedPosts.map((post) => {
        // 格式化日期
        const formattedDate = post.publishDate
          ? new Date(post.publishDate).toLocaleDateString("zh-CN")
          : "";

        return (
          <ArticleCard
            key={post.id}
            title={post.title}
            category={post.categories}
            date={formattedDate}
            tag={post.tags}
            image={post.coverImage}
            slug={post.slug}
          />
        );
      })}
    </div>
  );
}
