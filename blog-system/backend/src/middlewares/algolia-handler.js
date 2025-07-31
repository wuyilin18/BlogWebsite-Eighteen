// src/middlewares/algolia-handler.js

module.exports = () => {
  // 富文本转换函数
  const parseRichText = (content) => {
    if (!content || !Array.isArray(content)) return "";

    return content
      .map((block) => {
        if (block.type === "paragraph") {
          return block.children.map((child) => child.text || "").join("");
        }
        return "";
      })
      .filter((text) => text)
      .join("\n\n");
  };

  // 数据转换函数
  const transformForAlgolia = (post) => {
    const baseUrl = process.env.STRAPI_URL;

    let coverImageUrl = "";
    if (post.CoverImage?.url) {
      coverImageUrl = post.CoverImage.url.startsWith("http")
        ? post.CoverImage.url
        : `${baseUrl}${post.CoverImage.url}`;
    }

    return {
      objectID: post.id.toString(),
      title: post.Title || "",
      slug: post.Slug || "",
      summary: post.Summary || "",
      content: parseRichText(post.Content),
      coverImage: coverImageUrl,
      categories: post.categories?.map((cat) => cat.name) || [],
      tags: post.tags?.map((tag) => tag.name) || [],
    };
  };

  return async (ctx, next) => {
    const path = ctx.url;
    const method = ctx.method;

    // 检查是否是Algolia相关请求
    if (
      path.includes("/strapi-algolia/index-all-articles") &&
      method === "POST"
    ) {
      try {
        console.log(`Intercepted Algolia request: ${path}`);

        const algoliasearch = require("algoliasearch");
        const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
        const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
        const ALGOLIA_INDEX_NAME = "development_blog_posts";
        const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
        const index = client.initIndex(ALGOLIA_INDEX_NAME);

        // 先尝试获取所有文章（不加过滤条件）
        let posts;
        try {
          posts = await strapi.entityService.findMany("api::post.post", {
            populate: {
              CoverImage: true,
              categories: true,
              tags: true,
            },
            pagination: {
              pageSize: 1000,
            },
          });
          console.log("不加过滤条件的查询结果:", posts.length);
        } catch (error) {
          console.log("使用api::post.post查询失败，尝试其他API名称...");

          // 尝试其他可能的API名称
          const possibleApiNames = [
            "api::post.post",
            "api::posts.post",
            "api::article.article",
            "api::blog-post.blog-post",
          ];

          for (const apiName of possibleApiNames) {
            try {
              posts = await strapi.entityService.findMany(apiName, {
                populate: {
                  CoverImage: true,
                  categories: true,
                  tags: true,
                },
                pagination: {
                  pageSize: 1000,
                },
              });
              console.log(
                `使用 ${apiName} 查询成功，找到 ${posts.length} 篇文章`
              );
              break;
            } catch (e) {
              console.log(`尝试 ${apiName} 失败:`, e.message);
            }
          }
        }

        // 如果还是没有数据，使用原来的db.query方法
        if (!posts || posts.length === 0) {
          console.log("使用entityService查询失败，尝试使用db.query...");
          try {
            posts = await strapi.db.query("api::post.post").findMany({
              populate: {
                CoverImage: {
                  select: ["url"],
                },
                categories: {
                  select: ["name"],
                },
                tags: {
                  select: ["name"],
                },
              },
              select: ["id", "Title", "Content", "Slug", "Summary"],
            });
            console.log(`使用db.query查询到 ${posts.length} 篇文章`);
          } catch (e) {
            console.log("db.query也失败了:", e.message);
          }
        }

        if (!posts || posts.length === 0) {
          console.log("所有查询方法都失败了，返回错误");
          ctx.status = 404;
          ctx.body = { success: false, message: "没有找到文章数据" };
          return;
        }

        console.log("找到文章数据，开始转换...");
        console.log("示例原始数据:", JSON.stringify(posts[0], null, 2));

        // 使用转换函数
        const objects = posts.map(transformForAlgolia);

        console.log("转换后的数据量:", objects.length);
        if (objects.length > 0) {
          console.log(
            "【转换后同步到Algolia的示例数据】",
            JSON.stringify(objects[0], null, 2)
          );
        }

        // 先清除索引再添加新数据
        await index.clearObjects();
        const result = await index.saveObjects(objects);

        ctx.status = 200;
        ctx.body = {
          success: true,
          count: objects.length,
          result,
          message: `Successfully synced ${objects.length} posts with transformed data`,
        };

        return;
      } catch (err) {
        console.error("Algolia同步错误:", err);
        ctx.status = 500;
        ctx.body = {
          success: false,
          error: err.message,
          stack: err.stack,
        };
        return;
      }
    }

    // 处理原来的API端点
    if (path === "/api/algolia-direct/sync" && ctx.method === "POST") {
      try {
        const algoliasearch = require("algoliasearch");
        const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
        const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
        const ALGOLIA_INDEX_NAME = "development_blog_posts";
        const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
        const index = client.initIndex(ALGOLIA_INDEX_NAME);

        const posts = await strapi.db.query("api::post.post").findMany({
          where: {
            publishedAt: { $notNull: true },
          },
          populate: {
            CoverImage: {
              select: ["url"],
            },
            categories: {
              select: ["name"],
            },
            tags: {
              select: ["name"],
            },
          },
          select: ["id", "Title", "Content", "Slug", "Summary"],
        });

        if (!posts || posts.length === 0) {
          ctx.status = 404;
          ctx.body = { success: false, message: "没有找到文章" };
          return;
        }

        const richTextToPlainText = (content) => {
          if (!Array.isArray(content)) return "";
          return content
            .map((item) => {
              if (item.children) {
                return item.children.map((child) => child.text || "").join("");
              }
              return "";
            })
            .join("\n");
        };

        const getFullUrl = (url) => {
          if (!url) return "";
          if (url.startsWith("http")) return url;
          return `${process.env.STRAPI_URL}${url}`;
        };

        const objects = posts.map((post) => ({
          objectID: post.id,
          title: post.Title || "",
          slug: post.Slug || "",
          summary:
            post.Summary ||
            richTextToPlainText(post.Content).substring(0, 200) + "...",
          content: richTextToPlainText(post.Content),
          coverImage: post.CoverImage?.url
            ? getFullUrl(post.CoverImage.url)
            : "",
          categories: post.categories?.map((c) => c.name) || [],
          tags: post.tags?.map((t) => t.name) || [],
        }));

        await index.clearObjects();
        const result = await index.saveObjects(objects);

        ctx.status = 200;
        ctx.body = {
          success: true,
          count: objects.length,
          result,
        };
      } catch (err) {
        console.error("Algolia同步错误:", err);
        ctx.status = 500;
        ctx.body = {
          success: false,
          error: err.message,
        };
      }
      return;
    }

    await next();
  };
};
