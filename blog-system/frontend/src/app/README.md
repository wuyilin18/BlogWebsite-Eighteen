# 页面标题设置指南

本项目使用 Next.js 的元数据系统为每个页面设置特定的浏览器窗口标题。

## 基本用法

### 静态页面标题

对于静态页面，在页面目录下创建 `metadata.js` 文件：

```javascript
// 示例: src/app/example/metadata.js
export const metadata = {
  title: "页面标题", // 这将显示为 "页面标题 | 十八加十八"
  description: "页面描述",
  openGraph: {
    title: "页面标题 | 十八加十八", // 建议与上面保持一致
    description: "页面描述",
  },
};
```

### 动态页面标题

对于动态路由页面（如 `[slug]` 或 `[id]`），在页面组件中导出 `generateMetadata` 函数：

```typescript
// 示例: src/app/posts/[slug]/page.tsx
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // 从API或数据库获取数据
  const data = await fetchData(params.slug);

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: `${data.title} | 十八加十八`,
      description: data.description,
    },
  };
}

export default function Page() {
  // 页面组件
}
```

### 客户端组件

对于使用 "use client" 的客户端组件，需要创建一个单独的 `metadata.ts` 文件：

```typescript
// 示例: src/app/client-page/metadata.ts
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "客户端页面",
  description: "这是一个客户端页面",
};
```

## 标题格式

- 默认标题格式: `页面标题 | 十八加十八`
- 如果页面未设置标题，将使用默认标题: `十八加十八 - 技术博客`

## 注意事项

1. 确保每个页面都有唯一的、描述性的标题
2. 标题应该简洁明了，通常不超过 60 个字符
3. 描述应该准确概括页面内容，通常不超过 160 个字符
4. OpenGraph 元数据对社交媒体分享很重要，请确保设置正确
