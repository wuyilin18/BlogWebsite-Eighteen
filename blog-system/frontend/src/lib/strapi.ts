// 与Strapi API交互的服务
import qs from "qs";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// 定义媒体对象的可能类型
export type StrapiMediaObject = {
  url?: string;
  id?: number;
  width?: number;
  height?: number;
  alternativeText?: string;
  data?: {
    attributes?: {
      url?: string;
      formats?: Record<string, { url: string }>;
    };
  };
  attributes?: {
    url?: string;
    formats?: Record<string, { url: string }>;
  };
};

// 定义更具体的 Strapi 参数类型以避免 'any'
type StrapiFilterValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: StrapiFilterValue }
  | StrapiFilterValue[];

type StrapiFilters = {
  [key: string]: StrapiFilterValue | { [key: string]: StrapiFilterValue };
};

type StrapiPopulate =
  | string
  | string[]
  | {
      [key: string]:
        | boolean
        | {
            populate?: StrapiPopulate;
            fields?: string[];
            filters?: StrapiFilters;
          };
    };

// 定义Strapi参数接口
export interface StrapiParams {
  fields?: string[];
  sort?: string[];
  populate?: StrapiPopulate;
  filters?: StrapiFilters;
  pagination?: {
    page?: number;
    pageSize?: number;
    limit?: number; // for compatibility
  };
}

// 定义标签和分类的数据结构
export interface TagData {
  id: number;
  attributes?: { name?: string };
  name?: string;
}

interface CategoryData {
  id: number;
  attributes?: { name?: string };
  name?: string;
}

// 定义Strapi数据项接口
export interface StrapiItem {
  id: number;
  attributes?: PostDataSource;
  Title?: string;
  Summary?: string;
  Content?: string;
  Slug?: string;
  PublishDate?: string;
  createdAt?: string;
  CoverImage?: StrapiMediaObject | null;
  tags?: { data?: TagData[] } | TagData[];
  categories?: { data?: CategoryData[] } | CategoryData[];
  name?: string;
  posts?: {
    data?: StrapiItem[];
  };
}

// 定义Strapi响应接口
interface StrapiResponse {
  data: StrapiItem[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// 定义错误响应接口
interface StrapiErrorResponse {
  error?: {
    message?: string;
    [key: string]: unknown; // Keep this for flexible error details
  };
}

// Represents a flattened post item, compatible with Strapi v5 responses
interface FlatPost {
  id: number;
  Title?: string;
  title?: string;
  Summary?: string;
  summary?: string;
  Content?: string;
  content?: string;
  Slug?: string;
  slug?: string;
  PublishDate?: string;
  publishDate?: string;
  published_at?: string;
  createdAt?: string;
  created_at?: string;
  CoverImage?: StrapiMediaObject | null;
  coverImage?: StrapiMediaObject | null;
  tags?: TagData[];
  categories?: CategoryData[];
}

// A type to represent the possible shapes of post data before flattening.
type PostDataSource = {
  Title?: string;
  Summary?: string;
  Content?: string;
  Slug?: string;
  PublishDate?: string;
  createdAt?: string;
  CoverImage?: StrapiMediaObject | null;
  tags?: { data?: TagData[] } | TagData[];
  categories?: { data?: CategoryData[] } | CategoryData[];
  name?: string;
  posts?: {
    data?: StrapiItem[];
  };
};

/**
 * 获取API URL
 * @param path API路径
 * @returns 完整的API URL
 */
const getStrapiURL = (path = "") => {
  return `${STRAPI_URL}${path}`;
};

/**
 * 检查Strapi服务器连接状态
 */
const checkStrapiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      getStrapiURL("/api/posts?pagination[page]=1&pagination[pageSize]=1"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(3000),
      }
    );
    return response.ok;
  } catch (error: unknown) {
    console.error("checkStrapiConnection 错误:", error);
    return false;
  }
};

/**
 * 验证 API 端点和参数
 */
// export const validateAPIEndpoint = async () => {
//   try {
//     const testUrl = `${STRAPI_URL}/api/posts?pagination[page]=1&pagination[pageSize]=1`;
//     console.log("测试 API URL:", testUrl);

//     const response = await fetch(testUrl);
//     const data = await response.json();

//     console.log("API 测试响应:", {
//       status: response.status,
//       ok: response.ok,
//       data: JSON.stringify(data, null, 2),
//     });

//     return response.ok;
//   } catch (error: unknown) {
//     console.error("API 验证失败:", error);
//     return false;
//   }
// };

/**
 * 获取媒体URL
 * @param media 媒体对象
 * @returns 媒体URL
 */
export const getStrapiMedia = (
  media: StrapiMediaObject | string | null | undefined
): string | null => {
  if (!media) return null;

  try {
    // 处理包含直接url属性的对象（Strapi v5新格式）
    if (typeof media === "object" && media.url) {
      const url = media.url;
      return url.startsWith("/") ? getStrapiURL(url) : url;
    }

    // 处理直接的URL字符串
    if (typeof media === "string") {
      return media.startsWith("/") ? getStrapiURL(media) : media;
    }

    // 以下逻辑只处理对象类型的media
    const mediaObj = media as StrapiMediaObject;

    // 处理标准Strapi媒体对象
    if (
      mediaObj.data &&
      mediaObj.data.attributes &&
      mediaObj.data.attributes.url
    ) {
      const { url } = mediaObj.data.attributes;
      return url.startsWith("/") ? getStrapiURL(url) : url;
    }

    // Strapi v5可能返回的格式
    if (
      mediaObj.data &&
      Array.isArray(mediaObj.data) &&
      mediaObj.data[0]?.attributes?.url
    ) {
      const { url } = mediaObj.data[0].attributes;
      return url.startsWith("/") ? getStrapiURL(url) : url;
    }

    // 检查是否有attributes字段（无data嵌套）
    if (mediaObj.attributes && mediaObj.attributes.url) {
      const { url } = mediaObj.attributes;
      return url.startsWith("/") ? getStrapiURL(url) : url;
    }

    // 处理可能的formats字段
    if (mediaObj.data?.attributes?.formats?.thumbnail?.url) {
      const { url } = mediaObj.data.attributes.formats.thumbnail;
      return url.startsWith("/") ? getStrapiURL(url) : url;
    }

    console.warn("无法解析媒体对象:", JSON.stringify(mediaObj, null, 2));
    return null;
  } catch (error: unknown) {
    console.error("getStrapiMedia 错误:", error);
    return null;
  }
};

/**
 * 基础请求方法 - 增强版本
 * @param path API路径
 * @param urlParamsObject 查询参数对象
 * @param options 请求选项
 * @returns 响应数据
 */
export const fetchAPI = async (
  path: string,
  urlParamsObject: StrapiParams = {},
  options: RequestInit = {}
): Promise<StrapiResponse> => {
  // 首先检查开发环境和连接状态
  if (process.env.NODE_ENV === "development") {
    const isConnected = await checkStrapiConnection();
    if (!isConnected) {
      console.warn("Strapi服务器未连接，返回模拟数据");
      return getMockData(path);
    }
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (STRAPI_API_TOKEN) {
    headers.set("Authorization", `Bearer ${STRAPI_API_TOKEN}`);
  }

  const mergedOptions = {
    ...options,
    headers,
    signal: AbortSignal.timeout(10000),
  };

  // 使用qs构建查询参数
  const queryString = qs.stringify(urlParamsObject, {
    encodeValuesOnly: true,
  });

  const apiPath = path.startsWith("/api") ? path : `/api${path}`;
  const requestUrl = getStrapiURL(
    `${apiPath}${queryString ? `?${queryString}` : ""}`
  );

  // console.log(`正在请求Strapi API: ${requestUrl}`);

  try {
    const response = await fetch(requestUrl, mergedOptions);
    // console.log(`响应状态: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      // 尝试获取详细的错误信息
      let errorDetails = "";
      try {
        const errorData: StrapiErrorResponse = await response.json();
        console.error("Strapi 错误响应:", JSON.stringify(errorData, null, 2));
        errorDetails = errorData.error?.message || JSON.stringify(errorData);
      } catch {
        errorDetails = await response.text();
      }

      console.error(
        `Strapi API 响应错误: ${response.status} ${response.statusText}`,
        errorDetails
      );
      throw new Error(
        `Strapi API error: ${response.statusText} - ${errorDetails}`
      );
    }

    const data = await response.json();

    // --- 调试日志 ---
    // console.log("Strapi API 原始响应数据:", JSON.stringify(data, null, 2));
    // --- 调试日志结束 ---

    return data;
  } catch (error: unknown) {
    console.error(`Strapi API 请求失败:`, error);

    if (process.env.NODE_ENV === "development") {
      console.log("网络错误，返回模拟数据...");
      return getMockData(path);
    }

    throw error;
  }
};

/**
 * 获取模拟数据
 * @param path API路径
 * @returns 模拟数据
 */
const getMockData = (path: string): StrapiResponse => {
  console.log(`返回模拟数据 for path: ${path}`);

  if (path === "/posts" || path === "/api/posts") {
    return {
      data: [
        {
          id: 1,
          attributes: {
            Title: "模拟文章1",
            Content: "这是模拟的文章内容，因为无法连接到Strapi服务器。",
            Summary: "模拟文章摘要1",
            Slug: "mock-post-1",
            PublishDate: new Date().toISOString(),
            CoverImage: null,
            categories: { data: [] },
            tags: { data: [] },
          },
        },
        {
          id: 2,
          attributes: {
            Title: "模拟文章2",
            Content: "这是另一篇模拟的文章内容。",
            Summary: "模拟文章摘要2",
            Slug: "mock-post-2",
            PublishDate: new Date().toISOString(),
            CoverImage: null,
            categories: { data: [] },
            tags: { data: [] },
          },
        },
      ],
      meta: {
        pagination: { page: 1, pageSize: 10, pageCount: 1, total: 2 },
      },
    };
  }

  if (path === "/categories" || path === "/api/categories") {
    return {
      data: [
        {
          id: 1,
          attributes: {
            name: "技术",
            posts: { data: [] },
          },
        },
      ],
    };
  }

  if (path === "/tags" || path === "/api/tags") {
    return {
      data: [
        {
          id: 1,
          attributes: {
            name: "JavaScript",
            posts: { data: [] },
          },
        },
      ],
    };
  }

  return { data: [] };
};

/**
 * 获取所有文章
 * @param params 查询参数
 * @returns 文章列表
 */
export const getPosts = async (params: StrapiParams = {}) => {
  // console.log("调用getPosts, 参数:", JSON.stringify(params));

  try {
    // 构建查询参数
    const queryParams: StrapiParams = {
      sort: ["PublishDate:desc"],
      populate: {
        CoverImage: {
          fields: ["url", "alternativeText"],
        },
        categories: {
          fields: ["name"],
        },
        tags: {
          fields: ["name"],
        },
      },
      pagination: {
        page: 1,
        pageSize: 25,
      },
    };

    // 正确合并参数
    const mergedParams = {
      ...queryParams,
      ...params,
      // 特别处理分页参数
      pagination: {
        ...queryParams.pagination,
        ...(params.pagination || {}),
      },
    };

    // 如果传入了 limit 参数，转换为 pageSize
    if (mergedParams.pagination?.limit) {
      mergedParams.pagination.pageSize = mergedParams.pagination.limit;
      delete mergedParams.pagination.limit;
    }

    // console.log("最终API参数:", JSON.stringify(mergedParams));

    return await fetchAPI("/posts", mergedParams);
  } catch (error: unknown) {
    console.error("getPosts 错误:", error);

    // 如果请求失败，尝试最简单的请求
    console.log("尝试简化的请求...");
    try {
      return await fetchAPI("/posts", {
        pagination: {
          page: 1,
          pageSize:
            params.pagination?.pageSize || params.pagination?.limit || 5,
        },
      });
    } catch (fallbackError: unknown) {
      console.error("简化请求也失败了:", fallbackError);

      // 开发环境返回模拟数据
      if (process.env.NODE_ENV === "development") {
        return getMockData("/posts");
      }

      throw fallbackError;
    }
  }
};

/**
 * 获取单篇文章 - 增强版本
 * @param slug 文章别名
 * @returns 文章详情
 */
export async function getPostBySlug(
  slug: string
): Promise<PostDataSource | null> {
  try {
    // console.log("getPostBySlug: 开始获取文章, slug:", slug);

    // 检查slug是否有效
    if (!slug || slug === "undefined") {
      console.error("getPostBySlug: slug无效:", slug);
      return null;
    }

    // 在开发环境下先检查连接
    if (process.env.NODE_ENV === "development") {
      const isConnected = await checkStrapiConnection();
      if (!isConnected) {
        console.log("getPostBySlug: Strapi未连接，返回模拟数据");
        return {
          Title: `模拟文章 - ${slug}`,
          Content:
            "这是模拟的文章内容，因为无法连接到Strapi服务器。您可以：\n\n1. 检查Strapi服务器是否正在运行\n2. 确认环境变量NEXT_PUBLIC_STRAPI_URL是否正确配置\n3. 检查网络连接是否正常",
          Summary: "模拟文章摘要",
          Slug: slug,
          PublishDate: new Date().toISOString(),
          CoverImage: null,
          categories: { data: [] },
          tags: { data: [] },
        };
      }
    }

    // 使用fetchAPI统一处理请求
    const params = {
      filters: {
        Slug: {
          $eq: slug,
        },
      },
      populate: {
        CoverImage: {
          fields: ["url", "alternativeText"],
        },
        categories: {
          fields: ["name"],
        },
        tags: {
          fields: ["name"],
        },
        // 如果有其他关联字段，也在这里添加
      },
    };

    const response = await fetchAPI("/posts", params);

    if (response.data && response.data.length > 0) {
      const post = response.data[0].attributes || response.data[0];
      // console.log("getPostBySlug: 找到文章:", post.Title);
      return post;
    }

    console.log("getPostBySlug: 未找到文章");
    return null;
  } catch (error: unknown) {
    console.error(`getPostBySlug: 获取文章失败 (slug: ${slug})`, error);

    // 开发环境下返回模拟数据
    if (process.env.NODE_ENV === "development") {
      console.log("getPostBySlug: 发生错误，返回模拟数据");
      const mockPost: PostDataSource = {
        Title: `模拟文章 - ${slug}`,
        Content: `网络连接失败，显示模拟内容。\n\n错误信息: ${
          error instanceof Error ? error.message : "未知错误"
        }\n\n请检查：\n1. Strapi服务器是否运行在 ${STRAPI_URL}\n2. 网络连接是否正常\n3. 防火墙设置是否阻止了连接`,
        Summary: "模拟文章摘要（网络错误）",
        Slug: slug,
        PublishDate: new Date().toISOString(),
        CoverImage: null,
        categories: { data: [] },
        tags: { data: [] },
      };
      return mockPost;
    }

    return null;
  }
}

/**
 * 获取相关文章（基于标签）
 * @param currentSlug 当前文章的slug
 * @param tags 标签名称数组
 * @param limit 返回文章数量限制
 * @returns 相关文章列表
 */
export const getRelatedPosts = async (
  currentSlug: string,
  tags: string[],
  limit: number = 2
): Promise<Partial<FlatPost>[]> => {
  // console.log(
  //   "调用getRelatedPosts, 当前文章:",
  //   currentSlug,
  //   "标签:",
  //   tags,
  //   "限制:",
  //   limit
  // );

  // 增强参数校验
  if (!currentSlug || currentSlug.trim() === "") {
    console.error("getRelatedPosts: currentSlug为空或无效!", {
      currentSlug,
      type: typeof currentSlug,
    });
    return [];
  }

  if (!tags || tags.length === 0) {
    console.log("getRelatedPosts: 没有标签，返回空数组");
    return [];
  }

  // 过滤掉空的标签名
  const validTags = tags.filter((tag) => tag && tag.trim() !== "");
  if (validTags.length === 0) {
    console.log("getRelatedPosts: 没有有效标签，返回空数组");
    return [];
  }

  // console.log("getRelatedPosts: 使用有效标签:", validTags);

  try {
    // 在开发环境下先检查连接
    if (process.env.NODE_ENV === "development") {
      const isConnected = await checkStrapiConnection();
      if (!isConnected) {
        console.log("getRelatedPosts: Strapi未连接，返回模拟数据");
        return [
          {
            id: 1,
            Title: "模拟相关文章1",
            Summary: "这是模拟的相关文章摘要1",
            slug: "mock-related-1",
            PublishDate: new Date().toISOString(),
            CoverImage: null,
            tags: [{ id: 1, name: tags[0] }],
            categories: [],
          },
          {
            id: 2,
            Title: "模拟相关文章2",
            Summary: "这是模拟的相关文章摘要2",
            slug: "mock-related-2",
            PublishDate: new Date().toISOString(),
            CoverImage: null,
            tags: [{ id: 2, name: tags[0] }],
            categories: [],
          },
        ];
      }
    }

    // 构建标签过滤条件
    const tagFilters = tags.map((tag) => ({ name: { $eq: tag } }));

    const params: StrapiParams = {
      filters: {
        $and: [
          // 排除当前文章
          {
            Slug: {
              $ne: currentSlug,
            },
          },
          // 包含任意一个指定标签
          {
            tags: {
              $or: tagFilters,
            },
          },
        ],
      },
      populate: {
        CoverImage: true,
        tags: true,
        categories: true,
      },
      sort: ["PublishDate:desc"],
      pagination: {
        page: 1,
        pageSize: limit,
      },
    };

    // console.log("getRelatedPosts: 请求参数:", JSON.stringify(params, null, 2));

    const response = await fetchAPI("/posts", params);

    if (!response.data || !Array.isArray(response.data)) {
      console.warn("getRelatedPosts: 响应数据格式不正确:", response);
      return [];
    }

    // 调试：打印原始响应数据
    // console.log(
    //   "getRelatedPosts: 原始响应数据:",
    //   JSON.stringify(response.data, null, 2)
    // );

    // 转换数据格式 - 修复Strapi v5数据结构
    const relatedPosts = response.data.map((item): Partial<FlatPost> => {
      const postData = (item.attributes || item) as PostDataSource;

      const extractTags = (
        source: { data?: TagData[] } | TagData[] | undefined
      ): TagData[] => {
        if (!source) return [];
        return Array.isArray(source) ? source : source.data ?? [];
      };

      const extractCategories = (
        source: { data?: CategoryData[] } | CategoryData[] | undefined
      ): CategoryData[] => {
        if (!source) return [];
        return Array.isArray(source) ? source : source.data ?? [];
      };

      const postTags = extractTags(postData.tags);
      const postCategories = extractCategories(postData.categories);

      return {
        id: item.id,
        Title: postData.Title,
        Summary: postData.Summary,
        slug: postData.Slug,
        PublishDate: postData.PublishDate,
        CoverImage: postData.CoverImage,
        tags: postTags.map((tag) => ({
          id: tag.id,
          name: tag.attributes?.name || tag.name || "",
        })),
        categories: postCategories.map((cat) => ({
          id: cat.id,
          name: cat.attributes?.name || cat.name || "",
        })),
      };
    });

    // console.log(`getRelatedPosts: 找到 ${relatedPosts.length} 篇相关文章`);
    // console.log(
    //   "getRelatedPosts: 最终返回数据:",
    //   JSON.stringify(relatedPosts, null, 2)
    // );
    return relatedPosts;
  } catch (error: unknown) {
    console.error("getRelatedPosts: 获取相关文章时出错:", error);

    // 开发环境下返回模拟数据
    if (process.env.NODE_ENV === "development") {
      console.log("getRelatedPosts: 发生错误，返回模拟数据");
      return [
        {
          id: 1,
          Title: "模拟相关文章1（错误情况）",
          Summary: "这是模拟的相关文章摘要1",
          slug: "mock-related-error-1",
          PublishDate: new Date().toISOString(),
          CoverImage: null,
          tags: [{ id: 1, name: tags[0] || "默认标签" }],
          categories: [],
        },
      ];
    }

    return [];
  }
};

/**
 * 获取所有分类
 * @param params 查询参数
 * @returns 分类列表
 */
export const getCategories = async (params: StrapiParams = {}) => {
  // console.log("调用getCategories, 参数:", JSON.stringify(params));

  const defaultParams: StrapiParams = {
    populate: {
      posts: {
        fields: ["id"],
      },
    },
    sort: ["name:asc"],
  };

  const mergedParams = { ...defaultParams, ...params };

  const response = await fetchAPI("/categories", mergedParams);

  // 强制将扁平化的 v5 数据转换为 v4 嵌套结构，以便前端统一处理
  const v4Data = response.data.map((item) => {
    // 假设所有从/categories来的数据都是扁平的，进行转换
    const { id, ...attributes } = item;
    // 将 posts 数组包装在 { data: [...] } 中以模拟 v4 结构
    if (attributes.posts && Array.isArray(attributes.posts)) {
      (attributes as { posts?: { data: unknown[] } }).posts = {
        data: attributes.posts,
      };
    }
    return { id, attributes };
  });

  return { ...response, data: v4Data };
};

/**
 * 获取单个分类
 * @param slug 分类别名
 * @param params 查询参数
 * @returns 分类详情
 */
export const getCategoryBySlug = async (
  slug: string,
  params: StrapiParams = {}
): Promise<StrapiItem | null> => {
  // console.log(
  //   "调用getCategoryBySlug, slug:",
  //   slug,
  //   "原始参数:",
  //   JSON.stringify(params)
  // );

  if (!slug) {
    console.error("getCategoryBySlug: slug为空!");
    return null;
  }

  // 确保 slug 已解码
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (error: unknown) {
    console.error("解码slug时出错:", error);
  }

  // console.log("getCategoryBySlug: 使用解码后的slug:", decodedSlug);

  const filters = {
    name: {
      $eq: decodedSlug,
    },
  };

  const defaultParams: StrapiParams = {
    filters,
    populate: {
      posts: {
        populate: {
          CoverImage: {
            fields: ["url", "alternativeText", "formats"],
          },
          categories: {
            fields: ["name"],
          },
          tags: {
            fields: ["name"],
          },
        },
      },
    },
  };

  const mergedParams: StrapiParams = {
    ...defaultParams,
    ...params,
    filters: {
      ...defaultParams.filters,
      ...(params.filters || {}),
    },
    populate: params.populate || defaultParams.populate,
  };

  // console.log("合并后的参数:", JSON.stringify(mergedParams));

  try {
    const response = await fetchAPI("/categories", mergedParams);

    // console.log("API响应:", JSON.stringify(response));

    if (!response.data || response.data.length === 0) {
      console.log(`未找到分类: "${decodedSlug}"`);
      return null;
    }

    const category = response.data[0];
    // 直接从扁平化数据结构中获取文章数
    // const postCount = Array.isArray(category.posts) ? category.posts.length : 0;

    // console.log(
    //   `找到分类: "${decodedSlug}", ID: ${category.id}, 文章数: ${postCount}`
    // );

    // 如果返回的是扁平数据，需要将其包装成前端期望的嵌套结构
    if (category && !category.attributes) {
      const { id, posts, ...rest } = category;
      const postsArray = (posts || []) as StrapiItem[];
      const newAttributes = {
        ...rest,
        posts: {
          // 对 post 数组中的每一项也进行 v4 嵌套转换
          data:
            postsArray.map((post: StrapiItem) => {
              if (post && !post.attributes) {
                const { id: postId, ...postAttributes } = post;
                return { id: postId, attributes: postAttributes };
              }
              return post;
            }) || [],
        },
      };
      return { id, attributes: newAttributes as PostDataSource };
    }

    return category;
  } catch (error: unknown) {
    console.error("getCategoryBySlug 错误:", error);
    return null;
  }
};

/**
 * 获取所有标签
 * @param params 查询参数
 * @returns 标签列表
 */
export const getTags = async (params: StrapiParams = {}) => {
  // console.log("调用getTags, 参数:", JSON.stringify(params));

  const defaultParams: StrapiParams = {
    populate: {
      posts: {
        fields: ["id"],
      },
    },
    sort: ["name:asc"],
  };

  const mergedParams = { ...defaultParams, ...params };

  const response = await fetchAPI("/tags", mergedParams);

  // 强制将扁平化的 v5 数据转换为 v4 嵌套结构，以便前端统一处理
  const v4Data = response.data.map((item) => {
    // 假设所有从/tags来的数据都是扁平的，进行转换
    const { id, ...attributes } = item;
    // 将 posts 数组包装在 { data: [...] } 中以模拟 v4 结构
    if (attributes.posts && Array.isArray(attributes.posts)) {
      (attributes as { posts?: { data: unknown[] } }).posts = {
        data: attributes.posts,
      };
    }
    return { id, attributes };
  });

  return { ...response, data: v4Data };
};

/**
 * 获取单个标签
 * @param slug 标签别名
 * @param params 查询参数
 * @returns 标签详情
 */
export const getTagBySlug = async (
  slug: string,
  params: StrapiParams = {}
): Promise<StrapiItem | null> => {
  // console.log(
  //   "调用getTagBySlug, slug:",
  //   slug,
  //   "原始参数:",
  //   JSON.stringify(params)
  // );

  if (!slug) {
    console.error("getTagBySlug: slug为空!");
    return null;
  }

  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (error: unknown) {
    console.error("解码slug时出错:", error);
  }

  // console.log("getTagBySlug: 使用解码后的slug:", decodedSlug);

  const filters = {
    name: {
      $eq: decodedSlug,
    },
  };

  const defaultParams: StrapiParams = {
    filters,
    populate: {
      posts: {
        populate: {
          CoverImage: {
            fields: ["url", "alternativeText", "formats"],
          },
          categories: {
            fields: ["name"],
          },
          tags: {
            fields: ["name"],
          },
        },
      },
    },
  };

  const mergedParams: StrapiParams = {
    ...defaultParams,
    ...params,
    filters: {
      ...defaultParams.filters,
      ...(params.filters || {}),
    },
  };

  // console.log("合并后的参数:", JSON.stringify(mergedParams));

  try {
    const response = await fetchAPI("/tags", mergedParams);

    // console.log("API响应:", JSON.stringify(response));

    if (!response.data || response.data.length === 0) {
      console.log(`未找到标签: "${decodedSlug}"`);
      return null;
    }

    const tag = response.data[0];
    // 直接从扁平化数据结构中获取文章数
    // const postCount = Array.isArray(tag.posts) ? tag.posts.length : 0;

    // console.log(
    //   `找到标签: "${decodedSlug}", ID: ${tag.id}, 文章数: ${postCount}`
    // );

    // 如果返回的是扁平数据，需要将其包装成前端期望的嵌套结构
    if (tag && !tag.attributes) {
      const { id, posts, ...rest } = tag;
      const postsArray = (posts || []) as StrapiItem[];
      const newAttributes = {
        ...rest,
        posts: {
          // 对 post 数组中的每一项也进行 v4 嵌套转换
          data:
            postsArray.map((post: StrapiItem) => {
              if (post && !post.attributes) {
                const { id: postId, ...postAttributes } = post;
                return { id: postId, attributes: postAttributes };
              }
              return post;
            }) || [],
        },
      };
      return { id, attributes: newAttributes as PostDataSource };
    }

    return tag;
  } catch (error: unknown) {
    console.error("getTagBySlug 错误:", error);
    return null;
  }
};
