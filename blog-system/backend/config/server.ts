export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
  url: env("PUBLIC_URL", "https://api.wuyilin18.top"),
  proxy: true,
  http: {
    serverOptions: {
      requestTimeout: 70 * 1000, // 增加到 70 秒
      headersTimeout: 65 * 1000, // 确保小于 requestTimeout
      keepAliveTimeout: 5 * 1000,
    },
  },
});
