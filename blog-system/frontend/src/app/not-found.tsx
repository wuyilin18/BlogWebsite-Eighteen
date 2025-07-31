"use client";
import { FC } from "react";
import Link from "next/link";
import { useTheme } from "next-themes"; // 导入 useTheme
import FuzzyText from "@/components/reactbits/FuzzyText";

const NotFoundPage: FC = () => {
  // 获取当前主题，'light' 或 'dark'
  const { theme } = useTheme();

  return (
    <main
      className="
        flex min-h-screen flex-col items-center justify-center 
        p-6 font-mono 
        // 👇 背景使用更明确的颜色，白色/深灰
        bg-white text-slate-800
        dark:bg-slate-900 dark:text-slate-300
      "
    >
      <div
        // 👇 这个 div 的颜色设置不再重要，因为我们会直接给 FuzzyText 传颜色
        className="text-7xl font-bold md:text-9xl"
      >
        <FuzzyText
          fontSize="clamp(12rem, 30vw, 20rem)"
          baseIntensity={0.2}
          hoverIntensity={0.6}
          enableHover={true}
          // 👇 核心修改：根据主题动态传递颜色
          // 为浅色模式选择了一个深青色，深色模式用原来的亮青色
          color={theme === "dark" ? "#22d3ee" : "#155e75"} // cyan-400 vs cyan-800
        >
          404
        </FuzzyText>
      </div>

      <div className="mt-5 text-lg tracking-[0.2em] md:text-xl">
        <FuzzyText
          fontSize="clamp(1rem, 10vw, 4rem)"
          fontWeight="1000"
          baseIntensity={0.1}
          hoverIntensity={0.4}
          enableHover={true}
          // 👇 核心修改：同样动态传递颜色
          // 为浅色模式选择了一个深灰色，深色模式用原来的中灰色
          color={theme === "dark" ? "#64748b" : "#334155"} // slate-500 vs slate-700
        >
          CONNECTION_TERMINATED
        </FuzzyText>
      </div>

      <p
        // 👇 核心修改：为浅色模式选择更深的灰色，提高可读性
        className="mt-10 max-w-sm text-center text-slate-600 dark:text-slate-400"
      >
        你所寻找的页面已在数字虚空中丢失。
        可能是链接错误，或该资源已被永久移除。
      </p>

      {/* 按钮部分 */}
      <Link
        href="/"
        // 👇 核心修改：为浅色模式选择更深的青色
        className="cursor-target
          group relative mt-10 inline-block
          px-8 py-3 font-semibold
          text-cyan-700 dark:text-cyan-300 
          no-underline
        "
      >
        <span
          // 👇 核心修改：调整边框和辉光颜色以获得更好对比度
          className="
            absolute inset-0 rounded-lg border-2 
            border-cyan-600/80 transition-all duration-300
            group-hover:border-cyan-700
            dark:border-cyan-400/80
            dark:group-hover:border-cyan-300
            
            group-hover:shadow-[0_0_15px_2px] 
            group-hover:shadow-cyan-500/40
            dark:group-hover:shadow-cyan-400/50
          "
        ></span>
        <span className="relative">RE-ESTABLISH_LINK</span>
      </Link>
    </main>
  );
};

export default NotFoundPage;
