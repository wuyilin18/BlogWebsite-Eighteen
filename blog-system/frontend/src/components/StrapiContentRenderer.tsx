import React from "react";
import PostImage from "./PostImage";
import { CodeBlock } from "./AceternityUI/code-block";

// 定义块和子元素的接口

// 文本节点
interface TextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

// 链接节点
interface LinkNode {
  type: "link";
  url: string;
  children: TextNode[];
}

// 子节点可以是文本或链接
type Child = TextNode | LinkNode;

// 列表项
interface ListItem {
  type: "list-item";
  children: Child[];
}

interface Block {
  type: string;
  level?: number;
  children: (Child | ListItem)[];
  image?: {
    url: string;
    alternativeText?: string;
  };
  format?: string;
  language?: string;
}

// 渲染子元素（处理粗体、斜体等）
const renderChildren = (children: Child[]) => {
  return children.map((child, index) => {
    if (child.type === "link") {
      return (
        <a
          href={child.url}
          key={index}
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {renderChildren(child.children)}
        </a>
      );
    }

    const textChild = child as TextNode;
    let element: React.ReactNode = textChild.text;

    if (textChild.bold) {
      element = <strong>{element}</strong>;
    }
    if (textChild.italic) {
      element = <em>{element}</em>;
    }
    if (textChild.underline) {
      element = <u>{element}</u>;
    }
    if (textChild.strikethrough) {
      element = <s>{element}</s>;
    }
    if (textChild.code) {
      element = (
        <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 text-sm">
          {element}
        </code>
      );
    }

    return <React.Fragment key={index}>{element}</React.Fragment>;
  });
};

// Strapi内容渲染器组件
export default function StrapiContentRenderer({
  content,
}: {
  content: Block[];
}) {
  if (!Array.isArray(content)) {
    console.warn("Content is not an array:", content);
    return null;
  }

  // --- 预处理步骤：合并连续的代码块 ---
  const processedContent: Block[] = [];
  let currentCodeBlock: Block | null = null;

  content.forEach((block) => {
    if (block.type === "code") {
      if (!currentCodeBlock) {
        // 开始一个新的代码块
        currentCodeBlock = {
          type: "merged-code", // 使用一个特殊的类型
          children: [...block.children],
          language: block.language, // 从原始块中获取语言
        };
      } else {
        // 如果当前行有语言，则更新合并块的语言（最后的非空语言为准）
        if (block.language) {
          currentCodeBlock.language = block.language;
        }
        // 将当前行的文本添加到已存在的代码块中
        const textChild: Child = { type: "text", text: "\n" };
        currentCodeBlock.children.push(textChild, ...block.children);
      }
    } else {
      // 遇到非代码块
      if (currentCodeBlock) {
        // 检查这个非代码块是否是可忽略的空段落
        const isSkippable =
          block.type === "paragraph" &&
          (block.children as Child[]).every((child) => {
            if (child.type === "text")
              return !child.text || child.text.trim() === "";
            // 链接节点不被视为空
            return false;
          });

        if (!isSkippable) {
          // 如果是“有意义”的块，则结束当前代码块
          processedContent.push(currentCodeBlock);
          currentCodeBlock = null;
          processedContent.push(block); // 并将这个有意义的块也推入
        }
        // 如果是可忽略的空段落，则什么也不做，继续等待下一个代码行
      } else {
        // 如果之前没有在处理代码块，就直接推入当前块
        processedContent.push(block);
      }
    }
  });

  // 如果最后一个块是代码块，确保它也被添加
  if (currentCodeBlock) {
    processedContent.push(currentCodeBlock);
  }
  // --- 预处理结束 ---

  const getHeadingClass = (level?: number) => {
    switch (level) {
      case 1:
        return "text-4xl font-extrabold my-6";
      case 2:
        return "text-3xl font-bold my-5 border-b pb-2";
      case 3:
        return "text-2xl font-semibold my-4";
      case 4:
        return "text-xl font-medium my-3";
      case 5:
        return "text-lg font-normal my-2";
      case 6:
        return "text-base font-normal my-1 text-gray-600 dark:text-gray-400";
      default:
        return "text-4xl font-extrabold my-6";
    }
  };

  return (
    <div className="max-w-none text-gray-800 dark:text-gray-200">
      {processedContent.map((block, idx) => {
        // 使用处理过的内容
        switch (block.type) {
          case "heading":
            return React.createElement(
              `h${block.level || 1}`,
              { key: idx, className: getHeadingClass(block.level) },
              renderChildren(block.children as Child[])
            );

          case "paragraph":
            return (
              <p
                key={idx}
                className="my-4 text-base leading-relaxed whitespace-pre-line"
              >
                {renderChildren(block.children as Child[])}
              </p>
            );

          case "quote":
            return (
              <blockquote
                key={idx}
                className="my-4 pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic text-gray-600 dark:text-gray-400"
              >
                {renderChildren(block.children as Child[])}
              </blockquote>
            );

          case "list":
            const ListTag = block.format === "ordered" ? "ol" : "ul";
            const listClasses =
              "my-4 pl-8 " + (ListTag === "ol" ? "list-decimal" : "list-disc");
            return (
              <ListTag key={idx} className={listClasses}>
                {block.children.map((item, itemIdx) => (
                  <li key={itemIdx} className="my-1">
                    {renderChildren((item as ListItem).children)}
                  </li>
                ))}
              </ListTag>
            );

          case "image":
            if (block.image?.url) {
              const imageUrl = block.image.url.startsWith("http")
                ? block.image.url
                : `${process.env.NEXT_PUBLIC_STRAPI_URL || ""}${
                    block.image.url
                  }`;
              return (
                <div
                  key={idx}
                  className="my-8 rounded-lg overflow-hidden shadow-lg"
                >
                  <PostImage
                    src={imageUrl}
                    alt={block.image.alternativeText || "文章图片"}
                  />
                </div>
              );
            }
            return null;

          case "merged-code": // 处理我们合并后的代码块
            const codeText = (block.children as Child[])
              .map((child) => (child.type === "text" ? child.text : ""))
              .join("");
            const language = block.language || "plaintext";

            return (
              <CodeBlock
                key={idx}
                code={codeText}
                language={language}
                filename={language}
              />
            );

          default:
            // 忽略原始的 "code" 块，因为它们已经被合并了
            if (block.type !== "code") {
              console.warn("Unhandled block type:", block.type);
            }
            return null;
        }
      })}
    </div>
  );
}
