// src/types/global.d.ts

// 扩展 DeviceOrientationEvent 类型
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DeviceOrientationEvent {
  readonly beta: number | null;
  readonly gamma: number | null;
  readonly alpha: number | null;
}

// 如果使用 import/export 语法需要 declare global
export {}; // 确保文件被视为模块

declare global {
  // 可添加其他全局声明

  // Type for Algolia index
  interface AlgoliaIndex {
    search: <T>(
      query: string,
      options?: Record<string, unknown>
    ) => Promise<AlgoliaSearchResponse<T>>;
    getObject: <T>(objectID: string) => Promise<T>;
  }

  // Type for Algolia search client
  interface AlgoliaClient {
    initIndex: (indexName: string) => AlgoliaIndex;
  }

  // 使用 interface 扩展 Window 类型
  interface Window {
    algoliasearch?: (appId: string, apiKey: string) => AlgoliaClient;
    algoliaIndex?: AlgoliaIndex;
    myCustomProperty?: unknown;
  }
}

// Global type definitions for the application

// Define the search result interface
interface AlgoliaSearchResponse<T> {
  hits: T[];
  nbHits?: number;
  page?: number;
  nbPages?: number;
  hitsPerPage?: number;
  processingTimeMS?: number;
  query?: string;
  params?: string;
}
