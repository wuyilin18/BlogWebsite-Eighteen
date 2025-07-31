"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Dock } from "@/components/Home/naver";
import { Footer } from "@/components/Footer/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AlgoliaProvider } from "@/components/Search/AlgoliaProvider";
import FullMusicPlayerWrapper from "./FullMusicPlayerWrapper";
import {
  FamilyButton,
  FamilyButtonContent,
} from "@/components/ui/family-button";
import TargetCursor from "@/components/reactbits/TargetCursor";
// 引入 Framer Motion
import { AnimatePresence, motion } from "framer-motion";
// import { Ripple } from "@/components/magicui/ripple";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />
      <AlgoliaProvider>
        <Dock />
        {/* AnimatePresence 包裹你的页面内容 */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname} // 关键！让 Framer Motion 知道页面变了
            initial={{
              opacity: 0,
              filter: "blur(8px)", // 初始模糊
              scale: 1.05, // 初始微小放大
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)", // 动画结束时清晰
              scale: 1, // 恢复正常大小
            }}
            exit={{
              opacity: 0,
              filter: "blur(8px)", // 退出时模糊
              scale: 0.95, // 退出时微小缩小
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-screen"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        {/* <Ripple /> */}
        <Footer />
        <Analytics />
        <SpeedInsights />
        <FamilyButton className="cursor-target">
          <FamilyButtonContent>
            <FullMusicPlayerWrapper />
          </FamilyButtonContent>
        </FamilyButton>
      </AlgoliaProvider>
    </ThemeProvider>
  );
}
