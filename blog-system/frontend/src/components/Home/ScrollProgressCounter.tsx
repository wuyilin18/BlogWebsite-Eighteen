import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ScrollProgressCounterProps {
  isScrolled: boolean;
}

export function ScrollProgressCounter({
  isScrolled,
}: ScrollProgressCounterProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 用于防止滚动冲突
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 添加弹性动画样式到head
  useEffect(() => {
    // 添加弹性滚动CSS
    const styleEl = document.createElement("style");
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

    return () => {
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  // Update actual scroll progress
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = Math.round((window.scrollY / scrollHeight) * 100);
      setScrollProgress(currentProgress);

      // Check if at bottom
      setIsAtBottom(currentProgress >= 98);

      // Set visibility based on scroll position
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate the displayed progress
  useEffect(() => {
    // If the difference is small, just set it directly
    if (Math.abs(displayProgress - scrollProgress) <= 2) {
      setDisplayProgress(scrollProgress);
      return;
    }

    // Otherwise animate
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < scrollProgress) return prev + 1;
        if (prev > scrollProgress) return prev - 1;
        return scrollProgress;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [scrollProgress, displayProgress]);

  const handleBackToTop = () => {
    // 如果已经在滚动中，不执行新的滚动
    if (isScrollingRef.current) return;

    isScrollingRef.current = true;

    // 取消任何现有的滚动超时
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 使用平滑滚动
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

  // Size configuration
  const iconSize = "w-6 h-6"; // 调整为与图标一致的高度
  const textSize = "text-xs"; // 使用更小的文字

  return (
    <AnimatePresence mode="popLayout">
      {isScrolled && isVisible ? (
        <motion.div
          initial={{ x: 50, scale: 0.5, opacity: 0 }}
          animate={{ x: 0, scale: 1, opacity: 1 }}
          exit={{
            x: 50,
            scale: 0.5,
            opacity: 0,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 20,
              mass: 1,
            },
          }}
          transition={{ type: "spring", bounce: 0.25 }}
          className="relative"
          // 使用layout属性使其他元素产生回弹动画
          layout
          layoutId="progress-counter"
        >
          <motion.button
            onClick={handleBackToTop}
            animate={{
              borderRadius: "9999px", // 始终保持胶囊形状
              width: isAtBottom ? "75px" : "28px", // 调整宽度但保持胶囊形状
              height: "28px", // 固定高度值
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
              width: {
                type: "spring",
                stiffness: 300,
                damping: 25,
              },
            }} // 添加更丝滑的过渡效果
            className={cn(
              "flex items-center justify-center overflow-hidden",
              "bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470]",
              "shadow-md text-white"
            )}
          >
            {/* 使用AnimatePresence管理内容切换动画 */}
            <AnimatePresence mode="wait">
              {isAtBottom ? (
                <motion.div
                  key="top-button"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className="flex items-center justify-center px-2 py-0.5 whitespace-nowrap" // 添加不换行
                >
                  <FiArrowUp className="w-3 h-3 mr-1" />
                  <span className={cn("font-medium", textSize)}>顶部</span>
                </motion.div>
              ) : (
                <motion.div
                  key="percentage"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  className={cn("flex items-center justify-center", iconSize)}
                >
                  <span className="text-xs font-bold">{displayProgress}%</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 移除电路风格装饰，保持简洁的胶囊形状 */}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="w-0 opacity-0"
          layoutId="progress-counter"
          layout
          exit={{
            opacity: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 24,
              mass: 0.8,
            },
          }}
        />
      )}
    </AnimatePresence>
  );
}
