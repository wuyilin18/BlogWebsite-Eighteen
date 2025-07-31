// src/api/algolia-direct/routes/algolia-direct.js

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/algolia-direct/sync",
      handler: "algolia-direct.sync",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/algolia-direct/sync/:id",
      handler: "algolia-direct.syncOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
