/**
 * 从未知类型的内容中提取纯文本字符串
 * @param content - Strapi 返回的内容，可能是字符串、数组等
 * @returns 纯文本内容
 */
function extractTextFromContent(content: unknown): string {
  if (!content) {
    return "";
  }

  // 如果是字符串，直接返回
  if (typeof content === "string") {
    return content;
  }

  // 如果是数组，递归处理
  if (Array.isArray(content)) {
    return content.map(extractTextFromContent).join(" ");
  }

  // 如果是对象（例如 Strapi 的块），尝试提取文本
  if (typeof content === "object") {
    let text = "";
    // 这是一个常见的 Strapi 块结构
    if ("children" in content && Array.isArray(content.children)) {
      text += extractTextFromContent(content.children);
    }
    if ("text" in content && typeof content.text === "string") {
      text += content.text;
    }
    return text;
  }

  return "";
}

/**
 * 计算文章的字数和预计阅读时间
 * @param content - 从 Strapi 获取的文章内容
 * @param wordsPerMinute - 估算的阅读速度（字/分钟）
 * @returns 一个包含字数和阅读时间的对象
 */
export function calculateReadingTime(
  content: unknown,
  wordsPerMinute: number = 250 // 通常中文阅读速度在200-300之间，英文在200-250之间，取一个折中值
): { wordCount: number; readingTime: number } {
  const fullText = extractTextFromContent(content);

  // 移除 HTML 标签和多余的空白字符
  const text = fullText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  // 中英文混合字数统计的正则表达式
  // \u4e00-\u9fa5 匹配一个中文字符
  // [a-zA-Z0-9]+ 匹配一个或多个连续的字母或数字（算作一个词）
  const matches = text.match(/[\u4e00-\u9fa5]|[a-zA-Z0-9]+/g);
  const wordCount = matches ? matches.length : 0;

  // 计算阅读时间（分钟），并向上取整
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return {
    wordCount,
    // 确保阅读时间至少为 1 分钟
    readingTime: readingTime > 0 ? readingTime : 1,
  };
}
