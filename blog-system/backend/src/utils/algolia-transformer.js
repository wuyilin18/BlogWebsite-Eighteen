// src/utils/algolia-transformer.js
const { parseRichText } = require("./content-parser");

function transformForAlgolia(post) {
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
}

module.exports = { transformForAlgolia };
