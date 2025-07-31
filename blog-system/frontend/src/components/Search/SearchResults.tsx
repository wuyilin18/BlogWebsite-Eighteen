import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiLink } from "react-icons/fi";
import { cn } from "@/lib/utils";

export interface SearchResultItem {
  objectID: string;
  title: string;
  summary?: string;
  content?: string;
  Slug: string;
  imageUrl?: string;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  isLoading: boolean;
  searchQuery: string;
  onResultClick: () => void;
}

export function SearchResults({
  results,
  isLoading,
  searchQuery,
  onResultClick,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="py-6 px-4 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          搜索中...
        </p>
      </div>
    );
  }

  if (results.length === 0 && searchQuery.trim() !== "") {
    return (
      <div className="py-8 px-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          没有找到与 &quot;{searchQuery}&quot; 相关的结果
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {results.map((result, index) => (
        <motion.div
          key={result.objectID}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className={cn(
            "py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
            index !== results.length - 1 &&
              "border-b border-gray-200 dark:border-gray-700"
          )}
        >
          <Link
            href={result.Slug} // 使用新的 slug 链接
            className="block"
            onClick={onResultClick}
          >
            <div className="flex items-start">
              <div className="mr-2 mt-1 text-blue-500 dark:text-blue-400">
                <FiLink className="h-4 w-4" />
              </div>
              <div>
                <h3
                  className="text-base font-medium text-gray-900 dark:text-white mb-1"
                  dangerouslySetInnerHTML={{ __html: result.title }}
                />
                {result.summary && (
                  <p
                    className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: result.summary }}
                  />
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {result.Slug}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
