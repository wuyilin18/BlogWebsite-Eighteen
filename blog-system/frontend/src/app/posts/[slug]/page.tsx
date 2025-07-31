import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/strapi";
import { calculateReadingTime } from "@/lib/reading-time";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import StrapiContentRenderer from "@/components/StrapiContentRenderer";
import "@/components/Comments/styles/twikoo-custom.css";
import TwikooCommentsWrapper from "@/components/Comments/TwikooCommentsWrapper";
import { AuthorBlock } from "@/components/post/AuthorBlock";
import { TableOfContents } from "@/components/post/TableOfContents";
import { ArticleTimeline } from "@/components/post/ArticleTimeline";
import { getRelatedPosts } from "@/lib/strapi";
import { RelatedPosts } from "@/components/post/RelatedPosts";
import Image from "next/image";

// 类型定义

// 封面图片的灵活类型定义
type FlexibleCoverImage = {
  url?: string;
  attributes?: {
    url?: string;
  };
  data?: {
    attributes?: {
      url?: string;
    };
  };
} | null;

type Params = {
  slug: string;
};

type Category = {
  id: number;
  name: string;
};

type Tag = {
  id: number;
  name: string;
};

interface SimpleTag {
  id: number;
  name: string;
}

interface StrapiTag {
  id: number;
  attributes?: {
    name: string;
  };
  name?: string;
}

interface StrapiTagsResponse {
  data: StrapiTag[];
}

type TaxonomyData =
  | SimpleTag[]
  | StrapiTag[]
  | StrapiTagsResponse
  | undefined
  | null;

// RelatedPosts 组件期望的 Post 类型
interface RelatedPost {
  id: number;
  Title?: string;
  Summary?: string;
  slug?: string;
  Slug?: string;
  PublishDate?: string;
  CoverImage?: import("@/lib/strapi").StrapiMediaObject | null;
  tags?: SimpleTag[];
  categories?: SimpleTag[];
}

// 工具函数
function checkApiUrl(): string {
  const apiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_API_URL;
  if (!apiUrl) {
    console.warn("Strapi API URL 环境变量未设置，使用默认值");
  }
  return apiUrl || "process.env.NEXT_PUBLIC_STRAPI_URL";
}

function getStringValue(value: unknown, fallback: string = ""): string {
  return typeof value === "string" ? value : fallback;
}

// 类型守卫函数
function isStrapiTaxonomyResponse(
  data: TaxonomyData
): data is StrapiTagsResponse {
  return (
    data !== null &&
    data !== undefined &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray(data.data)
  );
}

function isSimpleTaxonomyArray(data: TaxonomyData): data is SimpleTag[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    "name" in data[0] &&
    typeof data[0].name === "string" &&
    "id" in data[0] &&
    typeof data[0].id === "number"
  );
}

function isStrapiTaxonomyArray(data: TaxonomyData): data is StrapiTag[] {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    (("attributes" in data[0] &&
      data[0].attributes !== undefined &&
      typeof data[0].attributes.name === "string") ||
      ("name" in data[0] && typeof data[0].name === "string"))
  );
}

// 分类和标签的格式化函数
function formatTaxonomy(taxonomy: unknown): SimpleTag[] {
  if (!taxonomy) return [];

  try {
    const taxonomyData = taxonomy as TaxonomyData;

    // 如果是 Strapi 响应格式 { data: [...] }
    if (isStrapiTaxonomyResponse(taxonomyData)) {
      return taxonomyData.data.map((item, index) => ({
        id: item.id || index,
        name: item.attributes?.name || item.name || "未命名",
      }));
    }

    // 如果是简单标签/分类数组
    if (isSimpleTaxonomyArray(taxonomyData)) {
      return taxonomyData;
    }

    // 如果是 Strapi 标签/分类数组
    if (isStrapiTaxonomyArray(taxonomyData)) {
      return taxonomyData.map((item, index) => ({
        id: item.id || index,
        name: item.attributes?.name || item.name || "未命名",
      }));
    }

    return [];
  } catch (error) {
    console.error("处理分类/标签数据时出错:", error);
    return [];
  }
}

// 验证相关文章的有效性 - 修复后的版本
function isValidRelatedPost(post: unknown): boolean {
  // console.log("验证文章数据:", post);

  if (!post || typeof post !== "object") {
    // console.log("文章数据不是对象");
    return false;
  }

  const p = post as Record<string, unknown>;

  // 检查必需字段
  if (typeof p.id !== "number") {
    // console.log("文章缺少有效的 id");
    return false;
  }

  // 检查 slug 字段（getRelatedPosts返回的是扁平化结构，直接检查slug属性）
  const slug = p.slug;
  if (
    !slug ||
    typeof slug !== "string" ||
    slug === "undefined" ||
    !slug.trim()
  ) {
    // console.log("文章缺少有效的 slug:", {
    //   slug: p.slug,
    // });
    return false;
  }

  // console.log("文章验证通过:", p.id, slug);
  return true;
}

// 安全地从未知数据中提取字符串值
function safeExtractString(value: unknown, fallback: string = ""): string {
  return typeof value === "string" ? value : fallback;
}

// 安全地从未知数据中提取标签数组
function safeExtractTags(tags: unknown): SimpleTag[] {
  if (!Array.isArray(tags)) return [];

  return tags.map((tag, index) => {
    if (tag && typeof tag === "object") {
      const tagObj = tag as Record<string, unknown>;
      return {
        id: typeof tagObj.id === "number" ? tagObj.id : index,
        name: safeExtractString(tagObj.name, "未知标签"),
      };
    }
    return { id: index, name: "未知标签" };
  });
}

// 转换原始文章数据为 RelatedPost 格式 - 修复后的版本
function convertToRelatedPost(rawPost: unknown): RelatedPost {
  const post = rawPost as Record<string, unknown>;
  const validSlug = safeExtractString(post.slug, "");

  // console.log("转换文章数据:", {
  //   id: post.id,
  //   title: post.Title,
  //   slug: validSlug,
  //   tags: post.tags,
  //   categories: post.categories,
  // });

  return {
    id: typeof post.id === "number" ? post.id : 0,
    Title: safeExtractString(post.Title),
    Summary: safeExtractString(post.Summary),
    slug: validSlug,
    Slug: validSlug,
    PublishDate: safeExtractString(post.PublishDate),
    CoverImage: post.CoverImage as
      | import("@/lib/strapi").StrapiMediaObject
      | null,
    tags: safeExtractTags(post.tags),
    categories: safeExtractTags(post.categories),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  // const apiUrl = checkApiUrl();
  // console.log(`使用Strapi API地址: ${apiUrl}`);

  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "文章不存在",
      description: "找不到请求的文章",
    };
  }

  const title = getStringValue(post.Title, "无标题");
  const summary = getStringValue(post.Summary);
  const description = summary || title;

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | 十八加十八`,
      description: description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const apiUrl = checkApiUrl();
  // console.log(`使用Strapi API地址: ${apiUrl}`);

  const resolvedParams = await params;
  // console.log("解析的参数:", resolvedParams);

  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound(); // 调用 notFound() 来触发你的自定义404页面
  }

  // 安全地获取文章属性
  const title = getStringValue(post.Title, "无标题");
  const summary = getStringValue(post.Summary);
  const publishDate = getStringValue(post.PublishDate);
  const { wordCount, readingTime } = calculateReadingTime(post.Content);

  // 封面图片处理
  let coverImageUrl = "https://cdn.wuyilin18.top/img/7245943.png";
  if (post.CoverImage) {
    try {
      const coverImage = post.CoverImage as FlexibleCoverImage;
      const url =
        coverImage?.data?.attributes?.url ||
        coverImage?.attributes?.url ||
        coverImage?.url;

      if (url && typeof url === "string") {
        coverImageUrl = url.startsWith("/") ? `${apiUrl}${url}` : url;
      }
    } catch (error) {
      console.error("处理封面图片时出错:", error);
    }
  }

  // 安全地处理分类和标签
  const categories: Category[] = formatTaxonomy(post.categories);
  const tags: Tag[] = formatTaxonomy(post.tags);

  // 获取相关文章
  const tagNames = tags
    .map((tag) => getStringValue(tag.name, ""))
    .filter((name) => name !== "");

  // console.log("文章数据:", {
  //   title: title,
  //   slug: getStringValue(post.Slug),
  //   tags: tagNames,
  // });

  const currentSlug = getStringValue(post.Slug) || resolvedParams.slug;
  // console.log("使用的 slug:", currentSlug);

  const rawRelatedPosts =
    currentSlug && tagNames.length > 0
      ? await getRelatedPosts(currentSlug, tagNames, 2)
      : [];

  // console.log("获取到的相关文章数量:", rawRelatedPosts.length);
  // console.log("原始相关文章数据:", rawRelatedPosts);

  // 处理相关文章数据 - 使用修复后的函数
  const processedRelatedPosts: RelatedPost[] = rawRelatedPosts
    .filter((rawPost) => {
      const isValid = isValidRelatedPost(rawPost);
      // console.log("文章验证结果:", rawPost, "→", isValid);
      return isValid;
    })
    .map((validPost) => {
      const converted = convertToRelatedPost(validPost);
      // console.log("文章转换结果:", validPost, "→", converted);
      return converted;
    });

  // console.log("处理后的相关文章数量:", processedRelatedPosts.length);

  return (
    <div className="min-h-screen w-full pt-28 md:pt-32 pb-20 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
      {/* CSS样式保持不变... */}
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
        
        /* 其他样式保持不变... */
      `,
        }}
      />

      {/* 背景装饰 */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* 背景装饰可以在这里添加 */}
      </div>

      <div className="container mx-auto px-4">
        {/* 布局结构 */}
        <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
          {/* 主内容区域 */}
          <div className="flex-1 min-w-0">
            {/* 文章内容区域 */}
            <ArticleTimeline>
              <div
                id="article-content"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-8 md:p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in"
                style={{
                  animationDelay: "0.3s",
                  boxShadow:
                    "0 10px 40px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.03)",
                  border: "1px solid rgba(150, 150, 150, 0.1)",
                }}
              >
                {/* 装饰性线条 */}
                <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
                <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>

                {/* 文章头部 */}
                <div className="mb-8 relative z-10">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#505050] to-[#808080] dark:from-[#a0a0a0] dark:to-[#d0d0d0] animate-float-up">
                    {title}
                  </h1>

                  {/* 发布时间 */}
                  {/* 文章元数据：发布时间、字数、阅读时间 */}
                  <div
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 dark:text-gray-400 mb-4 animate-float-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    {/* 发布时间 */}
                    {publishDate && (
                      <span className="inline-flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        发布于{" "}
                        {new Date(publishDate).toLocaleDateString("zh-CN")}
                      </span>
                    )}

                    {/* 字数统计 */}
                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      字数: {wordCount} 字
                    </span>

                    {/* 预计阅读时间 */}
                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      阅读: 约 {readingTime} 分钟
                    </span>
                  </div>

                  {/* 分类 */}
                  {categories.length > 0 && (
                    <div
                      className="flex items-center mb-4 animate-float-up"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <span className="mr-3 text-gray-600 dark:text-gray-400 font-medium">
                        分类:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/categories/${encodeURIComponent(
                              getStringValue(category.name, "")
                            )}`}
                            className="cursor-target px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 text-green-800 dark:text-green-300 rounded-full text-sm font-medium hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                          >
                            {getStringValue(category.name, "未知分类")}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 标签 */}
                  {tags.length > 0 && (
                    <div
                      className="flex items-center animate-float-up"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <span className="mr-3 text-gray-600 dark:text-gray-400 font-medium">
                        标签:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/tags/${encodeURIComponent(
                              getStringValue(tag.name, "")
                            )}`}
                            className="cursor-target px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-600"
                          >
                            #{getStringValue(tag.name, "未知标签")}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 封面图片 */}
                {coverImageUrl && (
                  <div
                    className="mb-10 rounded-xl overflow-hidden shadow-lg animate-scale-in"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <PostImage src={coverImageUrl} alt={title || "文章封面"} />
                  </div>
                )}

                {/* 文章摘要 */}
                {summary && (
                  <div
                    className="mb-10 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-600/30 rounded-xl border-l-4 border-green-500 dark:border-green-400 animate-float-up"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed">
                      {summary}
                    </p>
                  </div>
                )}

                {/* 文章内容 */}
                <div
                  className="prose prose-lg dark:prose-invert max-w-none animate-float-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="relative">
                    {Array.isArray(post.Content) && post.Content[0]?.type ? (
                      <StrapiContentRenderer content={post.Content} />
                    ) : Array.isArray(post.Content) ? (
                      post.Content.map((line: string | object, idx: number) => {
                        if (
                          typeof line === "string" &&
                          line.match(/^https?:\/\/.+\.(jpg|png|jpeg|webp)$/i)
                        ) {
                          return (
                            <div
                              key={idx}
                              className="my-8 rounded-lg overflow-hidden shadow-md"
                            >
                              <Image
                                src={line}
                                alt=""
                                width={800}
                                height={600}
                                className="w-full max-w-3xl mx-auto"
                              />
                            </div>
                          );
                        }
                        return (
                          <p key={idx} className="mb-4 leading-relaxed">
                            {typeof line === "string"
                              ? line
                              : JSON.stringify(line)}
                          </p>
                        );
                      })
                    ) : typeof post.Content === "string" ? (
                      post.Content.split("\n").map(
                        (line: string, idx: number) => {
                          if (
                            line.match(/^https?:\/\/.+\.(jpg|png|jpeg|webp)$/i)
                          ) {
                            return (
                              <div
                                key={idx}
                                className="my-8 rounded-lg overflow-hidden shadow-md"
                              >
                                <Image
                                  src={line}
                                  alt=""
                                  width={800}
                                  height={600}
                                  className="w-full max-w-3xl mx-auto"
                                />
                              </div>
                            );
                          }
                          return (
                            <p key={idx} className="mb-4 leading-relaxed">
                              {line}
                            </p>
                          );
                        }
                      )
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 italic text-center py-12">
                        {process.env.NODE_ENV === "development"
                          ? "开发模式：Strapi服务器未连接，显示模拟内容"
                          : "这里将显示文章内容..."}
                      </div>
                    )}
                  </div>
                </div>

                {/* 相关文章推荐 */}
                {processedRelatedPosts.length > 0 && (
                  <RelatedPosts
                    posts={processedRelatedPosts}
                    currentPostTags={tags}
                    apiUrl={apiUrl}
                    maxPosts={2}
                  />
                )}

                {/* 底部装饰等其他内容保持不变... */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-4 text-gray-500 dark:text-gray-400">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect
                        x="6"
                        y="6"
                        width="12"
                        height="12"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className="text-sm">硅原游牧 · 云端数字史诗</span>
                  </div>
                </div>

                {/* 评论区域 */}
                <div className="mt-12 mb-20">
                  <div className="w-full flex justify-center mb-8">
                    <div className="w-24 h-0.5 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] rounded-full opacity-50"></div>
                  </div>
                  <div className="w-full relative max-w-4xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] rounded-lg blur-sm opacity-15"></div>
                    <div className="relative w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 overflow-hidden border border-gray-100 dark:border-gray-700">
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
                          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] flex items-center justify-center text-white mr-3">
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

                      <div className="relative z-10">
                        <TwikooCommentsWrapper />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ArticleTimeline>
          </div>

          {/* 右侧边栏 */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0 space-y-6">
            <AuthorBlock />
            <TableOfContents />
          </div>
        </div>

        {/* 移动端侧边栏内容 */}
        <div className="xl:hidden mt-8 space-y-6">
          <AuthorBlock />
          <TableOfContents />
        </div>
      </div>
    </div>
  );
}
