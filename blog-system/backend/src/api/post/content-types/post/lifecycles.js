// src/api/post/content-types/post/lifecycles.js

module.exports = {
  async afterCreate(event) {
    try {
      const algoliaService = strapi.service(
        "api::algolia-syncer.algolia-syncer"
      );
      await algoliaService.syncPost(event.result);
      console.log("Post created and synced to Algolia:", event.result.id);
    } catch (error) {
      console.error("Failed to sync post after creation:", error);
    }
  },

  async afterUpdate(event) {
    try {
      const algoliaService = strapi.service(
        "api::algolia-syncer.algolia-syncer"
      );
      await algoliaService.syncPost(event.result);
      console.log("Post updated and synced to Algolia:", event.result.id);
    } catch (error) {
      console.error("Failed to sync post after update:", error);
    }
  },

  async afterDelete(event) {
    try {
      const algoliaService = strapi.service(
        "api::algolia-syncer.algolia-syncer"
      );
      await algoliaService.deletePost(event.result.id);
      console.log("Post deleted from Algolia:", event.result.id);
    } catch (error) {
      console.error("Failed to delete post from Algolia:", error);
    }
  },
};
