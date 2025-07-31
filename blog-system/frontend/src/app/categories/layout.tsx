import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "分类 | 十八加十八",
  description: "浏览十八加十八博客的所有文章分类，探索不同领域的技术内容",
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
