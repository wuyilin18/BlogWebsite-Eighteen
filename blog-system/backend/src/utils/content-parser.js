// src/utils/content-parser.js

/**
 * 解析Strapi富文本内容，提取纯文本。
 * @param {object[]} content - Strapi富文本数组。
 * @returns {string} - 提取的纯文本内容。
 */
function parseRichText(content) {
  if (!content || !Array.isArray(content)) {
    return "";
  }

  return content
    .map((block) => {
      // 处理段落、标题等包含文本的块
      if (
        (block.type === "paragraph" ||
          block.type.startsWith("heading-") ||
          block.type === "quote" ||
          block.type === "code") &&
        block.children
      ) {
        return block.children.map((child) => child.text || "").join("");
      }
      // 处理列表
      if (block.type === "list" && block.children) {
        return block.children
          .map((listItem) =>
            listItem.children.map((child) => child.text || "").join("")
          )
          .join("\n");
      }
      // 忽略图片、视频等非文本块
      if (block.type === "image") {
        return "[图片]"; // 用占位符表示图片
      }
      return "";
    })
    .filter(Boolean) // 过滤掉空字符串
    .join("\n\n"); // 用换行符连接块
}

module.exports = { parseRichText };
