import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "标签 | 十八加十八",
  description: "浏览十八加十八博客的所有文章标签，按主题查找内容",
};

export default function TagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
