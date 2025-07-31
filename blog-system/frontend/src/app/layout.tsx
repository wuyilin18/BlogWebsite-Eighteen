// import { Geist, Geist_Mono } from "next/font/google";
import type { Viewport } from "next";
import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "首页 | 十八加十八",
  description: "从前端到单片机：我的全栈开发生存手记",
};

// 临时使用CSS变量代替字体直接导入
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
//   display: "swap",
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
//   display: "swap",
// });

// 定义CSS变量
const fontVariables = {
  "--font-geist-sans":
    "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  "--font-geist-mono":
    "'Geist Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className="font-sans antialiased"
        style={fontVariables as React.CSSProperties}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
