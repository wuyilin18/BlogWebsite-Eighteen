"use strict";

/**
 * Algolia同步API配置
 */

const controllers = require("./controllers/algolia-syncer");
const routes = require("./routes/algolia-syncer");
const services = require("./services/algolia-syncer");

module.exports = {
  controllers,
  routes,
  services,
};
