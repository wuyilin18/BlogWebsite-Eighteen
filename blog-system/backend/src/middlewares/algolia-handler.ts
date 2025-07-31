// src/middlewares/algolia-handler.ts

module.exports = () => {
  // 富文本转换函数
  const parseRichText = (content: any[]): string => {
    if (!content || !Array.isArray(content)) return "";

    return content
      .map((block) => {
        if (block.type === "paragraph") {
          return block.children.map((child: any) => child.text || "").join("");
        }
        return "";
      })
      .filter((text) => text)
      .join("\n\n");
  };

  // 数据转换函数
  const transformForAlgolia = (post: any) => {
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
      categories: post.categories?.map((cat: any) => cat.name) || [],
      tags: post.tags?.map((tag: any) => tag.name) || [],
    };
  };

  return async (ctx: any, next: any) => {
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

        // 使用any类型和类型断言来避免TypeScript错误
        let posts: any = null;

        try {
          // 使用类型断言强制转换为正确的类型
          const result = await (strapi.entityService as any).findMany(
            "api::post.post",
            {
              populate: {
                CoverImage: true,
                categories: true,
                tags: true,
              },
              pagination: {
                pageSize: 1000,
              },
            }
          );

          // 确保结果是数组
          posts = Array.isArray(result) ? result : [result].filter(Boolean);
          console.log("查询到的文章数量:", posts.length);
        } catch (error: any) {
          console.log("使用entityService查询失败:", error.message);

          // 尝试使用db.query
          try {
            const result = await (strapi.db as any)
              .query("api::post.post")
              .findMany({
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

            posts = Array.isArray(result) ? result : [result].filter(Boolean);
            console.log(`使用db.query查询到 ${posts.length} 篇文章`);
          } catch (e: any) {
            console.log("db.query也失败了:", e.message);
            posts = [];
          }
        }

        if (!posts || posts.length === 0) {
          console.log("没有找到文章数据");
          ctx.status = 404;
          ctx.body = { success: false, message: "没有找到文章数据" };
          return;
        }

        console.log("找到文章数据，开始转换...");
        if (posts.length > 0) {
          console.log("示例原始数据:", JSON.stringify(posts[0], null, 2));
        }

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
      } catch (err: any) {
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

        const result = await (strapi.db as any)
          .query("api::post.post")
          .findMany({
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

        const posts = Array.isArray(result) ? result : [result].filter(Boolean);

        if (!posts || posts.length === 0) {
          ctx.status = 404;
          ctx.body = { success: false, message: "没有找到文章" };
          return;
        }

        const richTextToPlainText = (content: any): string => {
          if (!Array.isArray(content)) return "";
          return content
            .map((item) => {
              if (item.children) {
                return item.children
                  .map((child: any) => child.text || "")
                  .join("");
              }
              return "";
            })
            .join("\n");
        };

        const getFullUrl = (url: string): string => {
          if (!url) return "";
          if (url.startsWith("http")) return url;
          return `${process.env.STRAPI_URL}${url}`;
        };

        const objects = posts.map((post: any) => ({
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
          categories: post.categories?.map((c: any) => c.name) || [],
          tags: post.tags?.map((t: any) => t.name) || [],
        }));

        await index.clearObjects();
        const syncResult = await index.saveObjects(objects);

        ctx.status = 200;
        ctx.body = {
          success: true,
          count: objects.length,
          result: syncResult,
        };
      } catch (err: any) {
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
