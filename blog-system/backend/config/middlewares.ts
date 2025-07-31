export default [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "https://cdn.wuyilin18.top",
            "https://api.wuyilin18.top",
            "https://www.wuyilin18.top",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "https://cdn.wuyilin18.top",
            "https://api.wuyilin18.top",
          ],
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      origin: [
        "http://localhost:3000",
        "http://localhost:1337",
        "http://127.0.0.1:1337",
        "https://api.wuyilin18.top",
        "http://8.134.142.133",
        "https://www.wuyilin18.top",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      headers: ["Content-Type", "Authorization", "X-Requested-With"],
      keepHeaderOnError: true,
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  "global::algolia-handler",
];
