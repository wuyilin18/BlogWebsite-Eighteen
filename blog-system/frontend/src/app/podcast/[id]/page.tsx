"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // 添加 Image 导入
import { FiArrowLeft, FiClock, FiCalendar, FiHeadphones } from "react-icons/fi";
import { AlgoliaPodcast } from "@/types/algolia";
import { AlgoliaPreloader } from "@/components/Search/AlgoliaPreloader";

export default function PodcastDetailPage() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState<AlgoliaPodcast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [algoliaReady, setAlgoliaReady] = useState(false);

  // Algolia credentials
  const appId = "RUZHGLUF3V";
  const apiKey = "378c7137eca8f2b7a6625599c691fa2f";
  const indexName = "algolia_podcast_sample_dataset";

  // 使用 useCallback 包装 fetchPodcast 函数
  const fetchPodcast = useCallback(async () => {
    if (!id) {
      setError("Podcast ID is missing");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Check if we have access to Algolia index from window
      if (typeof window !== "undefined" && window.algoliaIndex) {
        try {
          // console.log(`Fetching podcast with ID: ${id}`);
          // Fetch the podcast using Algolia's getObject method
          const podcastData =
            await window.algoliaIndex.getObject<AlgoliaPodcast>(id as string);
          // console.log("Podcast data retrieved:", podcastData.title);
          setPodcast(podcastData);
        } catch (algoliaError) {
          console.error("Error fetching from Algolia:", algoliaError);
          setError("Failed to fetch podcast details");
        }
      } else {
        // If Algolia index is not available, use a placeholder
        console.warn("Algolia index not available, using mock data");

        // Mock data for demonstration purposes
        setTimeout(() => {
          setPodcast({
            objectID: id as string,
            title: `Podcast #${id}`,
            description:
              "This is a sample podcast description. The actual content would be fetched from Algolia.",
            imageUrl: "https://source.unsplash.com/random/800x600/?podcast",
            publishedAt: new Date().toISOString(),
            duration: "32:15",
            listens: 1423,
          });
        }, 800);
      }
    } catch (e) {
      console.error("Error:", e);
      setError("An error occurred while fetching the podcast");
    } finally {
      setIsLoading(false);
    }
  }, [id]); // 依赖于 id

  useEffect(() => {
    // Only fetch podcast when Algolia is ready and we have an ID
    if (algoliaReady && id) {
      fetchPodcast();
    }
  }, [id, algoliaReady, fetchPodcast]); // 添加 fetchPodcast 到依赖数组

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="ml-2">Loading podcast...</p>
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h1 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
            {error || "Podcast not found"}
          </h1>
          <p className="text-red-600 dark:text-red-300 mb-4">
            We couldn&apos;t find the podcast you&apos;re looking for.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Preload Algolia */}
      <AlgoliaPreloader
        appId={appId}
        apiKey={apiKey}
        indexName={indexName}
        onReady={() => {
          // console.log("Algolia preloader reports ready");
          setAlgoliaReady(true);
        }}
      />

      <div className="mb-8">
        <Link
          href="/search"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Search
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {podcast.imageUrl && (
          <div className="w-full h-64 md:h-80 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
            {/* 替换 img 为 Image 组件 */}
            <Image
              src={podcast.imageUrl}
              alt={podcast.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority // 由于这是主要内容图片，添加 priority
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {podcast.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
            {podcast.publishedAt && (
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                {new Date(podcast.publishedAt).toLocaleDateString()}
              </div>
            )}
            {podcast.duration && (
              <div className="flex items-center">
                <FiClock className="mr-2" />
                {podcast.duration}
              </div>
            )}
            {podcast.listens && (
              <div className="flex items-center">
                <FiHeadphones className="mr-2" />
                {podcast.listens.toLocaleString()} listens
              </div>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {podcast.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
