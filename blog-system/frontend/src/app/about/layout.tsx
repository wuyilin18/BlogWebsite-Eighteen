import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我 | 十八加十八",
  description: "了解更多关于十八加十八的信息，我的技术栈和个人经历",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
