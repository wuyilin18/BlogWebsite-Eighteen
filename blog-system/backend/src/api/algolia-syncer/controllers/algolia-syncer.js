// src/api/algolia-direct/controllers/algolia-direct.js

"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::algolia-direct.algolia-direct",
  ({ strapi }) => ({
    async sync(ctx) {
      try {
        console.log("Starting Algolia sync...");

        const algoliaService = strapi.service(
          "api::algolia-direct.algolia-direct"
        );
        const result = await algoliaService.syncAllPosts();

        console.log("Sync completed successfully");

        ctx.body = {
          success: true,
          message: `Successfully synced ${result.count} posts to Algolia`,
          count: result.count,
          taskIDs: result.taskIDs,
          objectIDs: result.objectIDs,
        };
      } catch (error) {
        console.error("Sync controller error:", error);

        ctx.status = 500;
        ctx.body = {
          success: false,
          error: error.message,
          details: error.stack,
        };
      }
    },

    async syncOne(ctx) {
      try {
        const { id } = ctx.params;

        if (!id) {
          ctx.status = 400;
          ctx.body = {
            success: false,
            error: "Post ID is required",
          };
          return;
        }

        const algoliaService = strapi.service(
          "api::algolia-direct.algolia-direct"
        );
        const result = await algoliaService.syncSinglePost(id);

        ctx.body = {
          success: true,
          message: `Successfully synced post ${id} to Algolia`,
          data: result.data,
        };
      } catch (error) {
        console.error("Single sync controller error:", error);

        ctx.status = 500;
        ctx.body = {
          success: false,
          error: error.message,
        };
      }
    },
  })
);
