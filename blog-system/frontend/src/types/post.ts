// src/types/post.ts

// Strapi 媒体对象类型
export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface StrapiMediaData {
  id: number;
  attributes: {
    url: string;
    width?: number;
    height?: number;
    size?: number;
    formats?: {
      thumbnail?: StrapiMediaFormat;
      small?: StrapiMediaFormat;
      medium?: StrapiMediaFormat;
      large?: StrapiMediaFormat;
    };
  };
}

export interface StrapiMediaObject {
  data?: StrapiMediaData | StrapiMediaData[] | null;
}

// 标签和分类类型
export interface Tag {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

// 文章类型 - 与 Strapi 返回的数据结构匹配
export interface Post {
  id: number;
  Title?: string;
  Summary?: string;
  Content?: string;
  slug?: string;
  PublishDate?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  CoverImage?: StrapiMediaObject | null;
  tags: Tag[];
  categories: Category[];
}

// 处理后的文章类型（用于组件显示）
export interface ProcessedPost {
  id: number;
  title: string;
  summary?: string;
  content?: string;
  slug: string;
  publishDate?: string;
  coverImage?: string;
  tags: Tag[];
  categories: Category[];
}
