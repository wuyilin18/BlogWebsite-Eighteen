// src/api/algolia-syncer/services/algolia-syncer.js

"use strict";

const { createCoreService } = require("@strapi/strapi").factories;
const { transformForAlgolia } = require("../../../utils/algolia-transformer");
const algoliasearch = require("algoliasearch");

// 初始化Algolia客户端
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);
const index = client.initIndex(
  process.env.ALGOLIA_INDEX_NAME || "development_blog_posts"
);

module.exports = createCoreService(
  "api::algolia-syncer.algolia-syncer",
  ({ strapi }) => ({
    /**
     * 同步单个文章到 Algolia
     * @param {object} post - Strapi 文章对象
     */
    async syncPost(post) {
      if (!post || !post.id) {
        console.error("Sync Post: Invalid post data received.");
        return;
      }

      try {
        // 确保获取到完整的文章数据，包括关联数据和内容
        const fullPost = await strapi.entityService.findOne(
          "api::post.post",
          post.id,
          {
            populate: {
              categories: true,
              tags: true,
              CoverImage: true,
              Content: true, // 确保 Content 字段被获取
            },
          }
        );

        if (!fullPost) {
          console.error(`Sync Post: Post with ID ${post.id} not found.`);
          return;
        }

        const transformedPost = transformForAlgolia(fullPost);

        // --- 强制调试日志 ---
        console.log("--- DEBUG: Data before sending to Algolia ---");
        console.log(JSON.stringify(transformedPost, null, 2));
        console.log("--- END DEBUG ---");

        // 在发送前打印日志，检查数据大小
        const dataSize = Buffer.from(JSON.stringify(transformedPost)).length;
        console.log(
          `Syncing post ${transformedPost.objectID} to Algolia. Size: ${dataSize} bytes.`
        );
        if (dataSize > 10000) {
          console.warn(
            `Post ${transformedPost.objectID} is larger than 10KB. Content length: ${transformedPost.content.length}. It might be rejected by Algolia.`
          );
        }

        await index.saveObject(transformedPost);
        console.log(`Successfully synced post ${post.id} to Algolia.`);
      } catch (error) {
        console.error(`Failed to sync post ${post.id} to Algolia:`, error);
      }
    },

    /**
     * 从 Algolia 删除单个文章
     * @param {string|number} postId - 要删除的文章 ID
     */
    async deletePost(postId) {
      if (!postId) {
        console.error("Delete Post: Invalid post ID received.");
        return;
      }
      try {
        await index.deleteObject(postId.toString());
        console.log(`Successfully deleted post ${postId} from Algolia.`);
      } catch (error) {
        console.error(`Failed to delete post ${postId} from Algolia:`, error);
      }
    },

    /**
     * 同步所有文章到 Algolia
     */
    async syncAllPosts() {
      try {
        const posts = await strapi.entityService.findMany("api::post.post", {
          populate: {
            categories: true,
            tags: true,
            CoverImage: true,
            Content: true,
          },
          publicationState: "live", // 只同步已发布的文章
          pagination: {
            pageSize: 1000, // 根据需要调整
          },
        });

        if (!posts || posts.length === 0) {
          console.log("No posts found to sync.");
          return { success: true, count: 0 };
        }

        console.log(`Found ${posts.length} posts to sync.`);

        const transformedPosts = posts.map(transformForAlgolia);

        await index.clearObjects();
        const result = await index.saveObjects(transformedPosts);

        console.log("Algolia full sync completed.", result);
        return { success: true, count: transformedPosts.length, result };
      } catch (error) {
        console.error("Algolia full sync failed:", error);
        throw error;
      }
    },
  })
);
