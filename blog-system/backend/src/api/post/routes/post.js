module.exports = {
  routes: [
    // 其他路由...
    {
      method: "GET",
      path: "/posts/slug/:slug",
      handler: "post.findBySlug",
      config: {
        auth: false,
      },
    },
  ],
};
