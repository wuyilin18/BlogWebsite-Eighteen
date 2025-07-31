// 声明一个简化的AlgoliaSearchIndex接口
interface AlgoliaSearchIndex {
  search: <T>(
    query: string,
    options?: Record<string, unknown>
  ) => Promise<{ hits: T[] }>;
  getObject: <T>(objectID: string) => Promise<T>;
}

interface AlgoliaClientWrapper {
  searchClient: ReturnType<NonNullable<typeof window.algoliasearch>>;
  index: AlgoliaSearchIndex;
}

export function createAlgoliaClient(
  appId: string,
  apiKey: string,
  indexName: string
): AlgoliaClientWrapper | null {
  // Use dynamic import for the Algolia client to avoid TypeScript issues
  // This function will be called only in the browser
  if (typeof window !== "undefined" && window.algoliasearch) {
    const searchClient = window.algoliasearch(appId, apiKey);
    const index = searchClient.initIndex(indexName);

    return { searchClient, index };
  }

  // If algolia is not available or on server side, return null or a mock
  console.error("Algolia search library not loaded or running on the server.");
  return null;
}
