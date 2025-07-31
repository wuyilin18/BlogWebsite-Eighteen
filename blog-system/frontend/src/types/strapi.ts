// src/types/strapi.ts

// 定义CoverImage类型
export interface CoverImageType {
  id?: number;
  documentId?: string;
  url?: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  data?: {
    id?: number;
    attributes?: {
      url?: string;
      formats?: Record<string, { url: string }>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// 定义基础的 StrapiAttributes 接口
export interface StrapiAttributes {
  [key: string]: unknown;
  Title?: string;
  Slug?: string;
  PublishDate?: string;
  Summary?: string;
  Content?: string;
  CoverImage?: CoverImageType | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  categories?: {
    data: Array<{
      id: number;
      attributes: {
        name: string;
        slug?: string;
      };
    }>;
  };
  tags?: {
    data: Array<{
      id: number;
      attributes: {
        name: string;
        slug?: string;
      };
    }>;
  };
  posts?: {
    data: unknown[];
  };
}

// 定义 StrapiItem 类型（匹配实际的 Strapi 返回数据）
export interface StrapiItem {
  id: number;
  attributes?: StrapiAttributes;
  // 支持扁平结构
  [key: string]: unknown;
}

// 定义 StrapiResponse 类型
export interface StrapiResponse {
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

// 定义严格的 Post 类型接口（用于组件内部处理）
export interface Post {
  id: number;
  attributes?: {
    Title: string;
    Slug: string;
    PublishDate: string;
    Summary?: string;
    Content?: string;
    CoverImage?: CoverImageType;
    categories?: {
      data: Array<{
        id: number;
        attributes: {
          name: string;
        };
      }>;
    };
    tags?: {
      data: Array<{
        id: number;
        attributes: {
          name: string;
        };
      }>;
    };
  };
  // 支持扁平结构
  [key: string]: unknown;
}

// 定义处理后的文章接口（用于最终渲染）
export interface ProcessedPost {
  id: number;
  title: string;
  slug: string;
  publishDate: string;
  summary?: string;
  content?: string;
  coverImage?: string;
  categories: string[];
  tags: string[];
}
