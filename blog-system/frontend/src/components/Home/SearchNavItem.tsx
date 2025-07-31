"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils";
import TooltipPortal from "@/components/Home/TooltipPortal";

interface SearchNavItemProps {
  windowWidth: number;
  delay?: number;
  animationType?: "spring" | "tween" | "inertia";
  onSearchClick: () => void;
  isSearching: boolean;
}

export function SearchNavItem({
  windowWidth,
  delay = 1000,
  animationType = "spring",
  onSearchClick,
  isSearching,
}: SearchNavItemProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const iconControls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navItemRef = useRef<HTMLDivElement>(null);

  // 初始化
  useEffect(() => {
    setMounted(true);
  }, []);

  // 根据窗口宽度计算动画参数
  const animationScale = windowWidth < 768 ? 1.05 : 1.1;
  const marginChange = windowWidth < 768 ? "0.5rem" : "0.75rem";

  // 处理鼠标悬浮状态
  const handleMouseEnter = () => {
    setIsHovered(true);

    // 获取位置
    if (navItemRef.current) {
      setAnchorRect(navItemRef.current.getBoundingClientRect());
    }

    // 清除任何现有的计时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // 设置新的计时器
    timerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);

    // 清除计时器
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 监听滚动和调整大小以更新位置
  useEffect(() => {
    const updatePosition = () => {
      if (navItemRef.current && showTooltip) {
        setAnchorRect(navItemRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showTooltip]);

  // 为图标设置动画
  useEffect(() => {
    if (isHovered) {
      iconControls.start({
        scale: animationScale,
        margin: marginChange,
      });
    } else {
      iconControls.start({
        scale: 1,
        margin: "0.25rem",
      });
    }
  }, [isHovered, iconControls, animationScale, marginChange]);

  // 点击涟漪效果
  useEffect(() => {
    if (isTapped) {
      const timer = setTimeout(() => setIsTapped(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTapped]);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // 占位元素
  }

  return (
    <div className="relative flex items-center justify-center" ref={navItemRef}>
      <button
        className="relative group"
        onClick={onSearchClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => {
          handleMouseEnter();
          setIsTapped(true);
        }}
        onTouchEnd={handleMouseLeave}
        aria-label="搜索"
      >
        {/* 图标容器 */}
        <motion.div
          className={cn(
            "p-2 rounded-full relative overflow-hidden transition-colors",
            isSearching
              ? "bg-[#56CFE1]/20 dark:bg-[#56CFE1]/30 text-[#56CFE1] dark:text-[#56CFE1]"
              : isHovered
              ? "bg-gray-200 dark:bg-gray-700 text-[#9D4EDD] dark:text-[#FF9470]"
              : "bg-transparent text-gray-600 dark:text-gray-400"
          )}
          animate={iconControls}
          transition={{
            type: animationType,
            bounce: 0.5,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          {isTapped && (
            <motion.span
              className="absolute inset-0 bg-black/10 rounded-full"
              initial={{ opacity: 0.5, scale: 0 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 0.3 }}
            />
          )}

          <FiSearch className="w-6 h-6 relative z-1" />

          {/* 电路背景 */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 40 40"
            className="absolute inset-0 pointer-events-none opacity-30"
          >
            <path
              d="M10,20 H15 C17,20 17,15 20,15 H25 C27,15 27,20 30,20"
              stroke={isSearching ? "#56CFE1" : "#9D4EDD"}
              strokeWidth="0.7"
              fill="none"
              className={isSearching ? "animate-data-flow" : ""}
              style={{ animationDuration: "3s" }}
            />
            {isSearching && (
              <circle
                cx="20"
                cy="20"
                r="1.5"
                fill="#56CFE1"
                className="animate-led-blink"
              />
            )}
            <path
              d="M5,25 C10,23 15,27 20,25 C25,23 30,27 35,25"
              stroke={isSearching ? "#FF9470" : "#9D4EDD"}
              strokeWidth="0.5"
              strokeOpacity="0.5"
              fill="none"
              className={isSearching ? "animate-wave-float" : ""}
            />
          </svg>
        </motion.div>
      </button>

      {/* 使用TooltipPortal组件 */}
      <TooltipPortal
        text="搜索"
        anchorRect={anchorRect}
        isVisible={showTooltip}
      />
    </div>
  );
}
