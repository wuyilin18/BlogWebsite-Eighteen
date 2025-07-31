import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "所有文章",
  description: "浏览十八加十八博客的所有技术文章，学习前沿技术知识",
};

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
