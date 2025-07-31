export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    // Grant public access to posts and categories
    const publicRole = await strapi.db
      .query("plugin::users-permissions.role")
      .findOne({
        where: { type: "public" },
        populate: ["permissions"],
      });

    if (publicRole) {
      const permissionsToGrant = [
        "api::post.post.find",
        "api::post.post.findOne",
        "api::category.category.find",
        "api::category.category.findOne",
      ];

      const allPermissions = await strapi.db
        .query("plugin::users-permissions.permission")
        .findMany({
          where: {
            action: {
              $in: permissionsToGrant,
            },
          },
        });

      const newPermissions = allPermissions.filter(
        (p) => !publicRole.permissions.some((rp) => rp.id === p.id)
      );

      if (newPermissions.length > 0) {
        await strapi.db.query("plugin::users-permissions.role").update({
          where: { id: publicRole.id },
          data: {
            permissions: {
              connect: newPermissions.map((p) => p.id),
            },
          },
        });
        console.log(
          "Successfully granted public access to posts and categories."
        );
      } else {
        console.log("Public access to posts and categories already granted.");
      }
    }
  },
};
