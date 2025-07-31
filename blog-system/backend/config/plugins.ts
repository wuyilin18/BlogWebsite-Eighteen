/**
 * Simplified rich text parser to extract plain text.
 * This avoids complex import path issues during Strapi's build process.
 * @param {object[]} content - Strapi's rich text content array.
 * @returns {string}
 */
const parseRichTextForAlgolia = (content) => {
  if (!content || !Array.isArray(content)) {
    return "";
  }
  return content
    .map((block) => {
      if (block.type === "image") {
        return ""; // Exclude images entirely
      }
      if (block.children && Array.isArray(block.children)) {
        return block.children.map((child) => child.text || "").join("");
      }
      return "";
    })
    .join(" ")
    .replace(/\s\s+/g, " "); // Replace multiple spaces with a single one
};

export default ({ env }) => ({
  // 其他插件配置...
  // Algolia插件配置
  "strapi-algolia": {
    enabled: true,
    config: {
      apiKey: env("ALGOLIA_SEARCH_API_KEY"),
      applicationId: env("ALGOLIA_APP_ID"),
      indexPrefix: process.env.ALGOLIA_INDEX_PREFIX || "strapi",
      contentTypes: [
        {
          name: "api::post.post",
          index: "development_blog_posts", //你的algolia索引名称
          transform: (data) => {
            const baseUrl = process.env.PUBLIC_URL;
            let coverImageUrl = "";
            if (data.CoverImage?.url) {
              coverImageUrl = data.CoverImage.url.startsWith("http")
                ? data.CoverImage.url
                : `${baseUrl}${data.CoverImage.url}`;
            }

            return {
              objectID: data.id.toString(),
              title: data.Title || "",
              slug: data.Slug || "",
              summary: data.Summary || "",
              content: parseRichTextForAlgolia(data.Content), // Use the local parser
              coverImage: coverImageUrl,
              categories: data.categories?.map((cat) => cat.name) || [],
              tags: data.tags?.map((tag) => tag.name) || [],
            };
          },
          populate: {
            Content: true,
            CoverImage: true,
            categories: true,
            tags: true,
          },
        },
      ],
    },
  },
  // 你可能还有其他插件...
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "7d",
      },
      ratelimit: {
        interval: 60000,
        max: 100,
      },
    },
  },
});
