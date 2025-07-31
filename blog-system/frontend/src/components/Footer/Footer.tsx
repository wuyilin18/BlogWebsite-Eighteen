"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiMail, FiArrowUp, FiGithub, FiClock, FiEye } from "react-icons/fi";
import { SiBilibili, SiGitee } from "react-icons/si";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Script from "next/script";
import Image from "next/image";

export function Footer() {
  // 运行时间计算
  const [runningTime, setRunningTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  // 是否显示"返回顶部"
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 不蒜子访问统计数据
  const [visitorStats, setVisitorStats] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
  });
  const [isClient, setIsClient] = useState(false);

  const pathname = usePathname();

  // 用于防止滚动冲突
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 计算网站运行时间
  useEffect(() => {
    // 网站启动日期 - 可以修改为你的实际日期
    const startDate = new Date("2025-05-09");

    const calculateRunningTime = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setRunningTime({ days, hours, minutes });
    };

    calculateRunningTime();
    const timer = setInterval(calculateRunningTime, 60000); // 每分钟更新一次

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 使用不蒜子统计访问量
  useEffect(() => {
    // 检查全局对象是否已加载
    const checkBusuanzi = () => {
      if (
        typeof window !== "undefined" &&
        window.document.getElementById("busuanzi_value_site_pv") !== null
      ) {
        // 获取不蒜子统计的值
        const pv = document.getElementById("busuanzi_value_site_pv");
        const uv = document.getElementById("busuanzi_value_site_uv");

        setVisitorStats({
          pageViews: pv ? parseInt(pv.innerText) || 0 : 0,
          uniqueVisitors: uv ? parseInt(uv.innerText) || 0 : 0,
        });
      } else {
        // 如果不蒜子脚本尚未加载完成，等待一段时间后重试
        setTimeout(checkBusuanzi, 1000);
      }
    };

    // 在组件挂载后检查不蒜子是否已加载
    checkBusuanzi();
  }, [pathname]);

  // 添加弹性动画样式到head
  useEffect(() => {
    // 添加弹性滚动CSS
    const styleId = "bounce-animation-style";

    // 检查是否已存在
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.innerHTML = `
        @keyframes bounceTop {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          70% { transform: translateY(5px); }
          85% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        .bounce-top {
          animation: bounceTop 0.8s ease-out;
        }
      `;
      document.head.appendChild(styleEl);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // 一次性直接返回顶部，确保100%达到顶部
  const scrollToTop = () => {
    // 如果已经在滚动中，不执行新的滚动
    if (isScrollingRef.current) return;

    isScrollingRef.current = true;

    // 取消任何现有的滚动超时
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 直接使用硬性滚动确保到达绝对顶部
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // 设置延迟确保平滑滚动有时间执行
    scrollTimeoutRef.current = setTimeout(() => {
      // 强制二次滚动到绝对顶部，确保已到达
      window.scrollTo(0, 0);

      // 添加顶部弹性效果
      const pageContent = document.querySelector("main");
      if (pageContent) {
        pageContent.classList.add("bounce-top");

        // 移除动画类
        setTimeout(() => {
          pageContent.classList.remove("bounce-top");
          isScrollingRef.current = false;
        }, 800);
      } else {
        isScrollingRef.current = false;
      }
    }, 500); // 给平滑滚动预留时间
  };

  return (
    <footer className="w-full mt-20">
      {/* 不蒜子脚本 */}
      <Script
        src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
        strategy="afterInteractive"
      />
      {/* 社交媒体图标和返回顶部按钮 */}
      <div className="py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center space-x-6 sm:space-x-8">
            {/* 第一个社交媒体图标 - 邮箱 */}
            <Link
              href="mailto:example@example.com"
              className="cursor-target group transition-transform duration-300 hover:scale-110"
              aria-label="邮箱"
            >
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-white shadow-sm text-[#0C8F5C] dark:text-[#0C8F5C] hover:shadow-md transition-all duration-300">
                <FiMail className="w-5 h-5" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[#0C8F5C] dark:text-[#2A9D8F] shadow-sm px-2 py-1 rounded-md">
                  邮箱
                </div>
              </div>
            </Link>

            {/* 第二个社交媒体图标 - GitHub */}
            <Link
              href="https://github.com/wuyilin18"
              className="cursor-target group transition-transform duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-white shadow-sm text-[#0C8F5C] dark:text-[#0C8F5C] hover:shadow-md transition-all duration-300">
                <FiGithub className="w-5 h-5" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[#0C8F5C] dark:text-[#2A9D8F] shadow-sm px-2 py-1 rounded-md">
                  GitHub
                </div>
              </div>
            </Link>

            {/* 第三个位置 - 返回顶部按钮 */}
            <button
              onClick={scrollToTop}
              className={cn(
                "cursor-target group relative rounded-full shadow-sm p-3 transition-all duration-300 transform bg-white dark:bg-white w-12 h-12 flex items-center justify-center",
                showBackToTop ? "hover:-translate-y-1 hover:shadow-md" : "",
                !showBackToTop && "opacity-70 cursor-default"
              )}
              disabled={!showBackToTop}
              aria-label="返回顶部"
            >
              <div
                className={cn(
                  "text-[#0C8F5C] dark:text-[#0C8F5C] transition-colors",
                  !showBackToTop && "opacity-50"
                )}
              >
                <FiArrowUp className="w-5 h-5" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[#0C8F5C] dark:text-[#2A9D8F] shadow-sm px-2 py-1 rounded-md">
                  返回顶部
                </div>
              </div>
            </button>

            {/* 第四个社交媒体图标 - Gitee */}
            <Link
              href="https://gitee.com/eighteenpluseighteen"
              className="cursor-target group transition-transform duration-300 hover:scale-110"
              aria-label="Gitee"
            >
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-white shadow-sm text-[#0C8F5C] dark:text-[#0C8F5C] hover:shadow-md transition-all duration-300">
                <SiGitee className="w-5 h-5" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[#0C8F5C] dark:text-[#2A9D8F] shadow-sm px-2 py-1 rounded-md">
                  Gitee
                </div>
              </div>
            </Link>

            {/* 第五个社交媒体图标 - B站 */}
            <Link
              href="https://space.bilibili.com/379914795"
              className="cursor-target group transition-transform duration-300 hover:scale-110"
              aria-label="哔哩哔哩"
            >
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-white shadow-sm text-[#0C8F5C] dark:text-[#0C8F5C] hover:shadow-md transition-all duration-300">
                <SiBilibili className="w-5 h-5" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[#0C8F5C] dark:text-[#2A9D8F] shadow-sm px-2 py-1 rounded-md">
                  哔哩哔哩
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 下半部分 - 运行时间、访问统计和版权信息 */}
      <div className="py-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* 运行时间和访问统计 */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <FiClock className="mr-2" />
                <span>
                  本站已运行 {runningTime.days} 天 {runningTime.hours} 时{" "}
                  {runningTime.minutes} 分
                </span>
              </div>
              {isClient && (
                <div className="flex items-center">
                  <FiEye className="mr-2" />
                  <span>
                    访问统计: 访问人数{" "}
                    <span id="busuanzi_value_site_uv">
                      {visitorStats.uniqueVisitors}
                    </span>{" "}
                    / 访问次数{" "}
                    <span id="busuanzi_value_site_pv">
                      {visitorStats.pageViews}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* 版权信息 */}
            <div className="space-y-2 text-center text-sm text-gray-600 dark:text-gray-400 md:text-right">
              <div className="flex items-center justify-center space-x-4 md:justify-end">
                <div>© 2025 - 2026 By 十八Eighteen</div>
                <Image
                  src="https://cdn.wuyilin18.top/img/avatar.png"
                  alt="头像"
                  className="mr-1 h-8 w-8"
                  width={32}
                  height={32}
                />
              </div>
              <div className="flex items-center justify-center space-x-4 md:justify-end">
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target flex items-center hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <Image
                    src="https://bu.dusays.com/2025/07/18/687a6042dafeb.png"
                    alt="粤ICP备"
                    className="mr-1 h-4 w-4"
                    width={16}
                    height={16}
                  />
                  <span>粤ICP备2025444276号</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
