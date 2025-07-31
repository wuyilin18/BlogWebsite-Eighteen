module.exports = {
  routes: [
    // Algolia同步测试路由
    {
      method: "GET",
      path: "/api/algolia-test",
      handler: "api::algolia-syncer.algolia-syncer.test",
      config: {
        auth: false,
      },
    },
    // Algolia同步首页
    {
      method: "GET",
      path: "/api/algolia",
      handler: "api::algolia-syncer.algolia-syncer.index",
      config: {
        auth: false,
      },
    },
    // Algolia同步状态
    {
      method: "GET",
      path: "/api/algolia/status",
      handler: "api::algolia-syncer.algolia-syncer.getSyncStatus",
      config: {
        auth: false,
      },
    },
    // Algolia同步触发
    {
      method: "POST",
      path: "/api/algolia/sync",
      handler: "api::algolia-syncer.algolia-syncer.syncToAlgolia",
      config: {
        auth: false,
      },
    },
  ],
};
