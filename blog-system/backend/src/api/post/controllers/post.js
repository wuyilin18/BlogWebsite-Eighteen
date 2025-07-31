module.exports = {
  async findBySlug(ctx) {
    const { slug } = ctx.params;

    try {
      const entity = await strapi.db.query("api::post.post").findOne({
        where: { slug },
        populate: ["CoverImage", "categories", "tags"],
      });

      if (!entity) {
        return ctx.notFound("Post not found");
      }

      // 返回完整实体
      return entity;
    } catch (err) {
      console.error("Error finding post by slug:", err);
      return ctx.internalServerError("Internal server error");
    }
  },
};
