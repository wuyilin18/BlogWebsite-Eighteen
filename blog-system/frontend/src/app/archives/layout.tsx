import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "归档 | 十八加十八",
  description: "按时间浏览十八加十八博客的所有文章，查看历史发布内容",
};

export default function ArchivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
