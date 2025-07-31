"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FiClock } from "react-icons/fi";
import TooltipPortal from "@/components/Home/TooltipPortal";

interface ThemeNavItemProps {
  windowWidth: number;
  delay?: number;
  animationType?: "spring" | "tween" | "inertia";
}

export function ThemeNavItem({
  windowWidth,
  delay = 1000,
  animationType = "spring",
}: ThemeNavItemProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  const iconControls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navItemRef = useRef<HTMLDivElement>(null);

  // 初始化
  useEffect(() => {
    setMounted(true);
    setIsReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    // 检查是否在自动模式
    const storedAutoMode = localStorage.getItem("themeAutoMode") === "true";
    const userOverride = localStorage.getItem("userThemeOverride") === "true";
    setAutoMode(storedAutoMode && !userOverride);

    // 监听自动模式变化
    const handleStorageChange = () => {
      const newAutoMode = localStorage.getItem("themeAutoMode") === "true";
      const userOverride = localStorage.getItem("userThemeOverride") === "true";
      setAutoMode(newAutoMode && !userOverride);
    };

    // 监听自动模式切换事件
    const handleAutoModeChange = () => {
      const autoMode = localStorage.getItem("themeAutoMode") === "true";
      const userOverride =
        localStorage.getItem("userThemeOverride") === "false";
      setAutoMode(autoMode && userOverride !== true);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "autoModeChange",
      handleAutoModeChange as EventListener
    );
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "autoModeChange",
        handleAutoModeChange as EventListener
      );
    };
  }, []);

  // 根据窗口宽度计算动画参数
  const animationScale = windowWidth < 768 ? 1.05 : 1.1;
  const marginChange = windowWidth < 768 ? "0.5rem" : "0.75rem";

  // 切换主题
  const toggleTheme = () => {
    // 如果长按被激活，不执行普通点击切换
    if (longPressActive) {
      setLongPressActive(false);
      return;
    }

    // 如果是自动模式，切换到手动模式，并保持当前主题
    if (autoMode) {
      localStorage.setItem("themeAutoMode", "false");
      localStorage.setItem("userThemeOverride", "true");
      setAutoMode(false);

      // 触发主题变更事件，显示通知
      window.dispatchEvent(
        new CustomEvent("themechange", {
          detail: { theme },
        })
      );
      return;
    }

    // 否则在亮/暗模式间切换
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    // 标记用户已手动设置主题
    localStorage.setItem("userThemeOverride", "true");

    // 发送主题变更事件
    window.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { theme: newTheme },
      })
    );
  };

  // 切换自动模式
  const toggleAutoMode = () => {
    const newAutoMode = !autoMode;
    setAutoMode(newAutoMode);
    localStorage.setItem("themeAutoMode", String(newAutoMode));

    if (newAutoMode) {
      // 切换到自动模式
      localStorage.setItem("userThemeOverride", "false");

      // 根据当前时间设置主题
      const currentHour = new Date().getHours();
      const isDaytime = currentHour >= 6 && currentHour < 18;
      const newTheme = isDaytime ? "light" : "dark";
      setTheme(newTheme);

      // 触发自动模式变更事件
      window.dispatchEvent(new Event("autoModeChange"));

      // 触发主题变更事件，显示通知
      window.dispatchEvent(
        new CustomEvent("themechange", {
          detail: { theme: newTheme, isAutoMode: true },
        })
      );
    } else {
      // 标记用户已手动设置主题
      localStorage.setItem("userThemeOverride", "true");

      // 触发主题变更事件，显示通知
      window.dispatchEvent(
        new CustomEvent("themechange", {
          detail: { theme },
        })
      );
    }
  };

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

    // 清除长按计时器
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setLongPressActive(false);
  };

  // 处理按下事件 - 开始长按计时
  const handlePointerDown = () => {
    // 清除任何已存在的长按计时器
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    // 设置新的长按计时器
    longPressTimerRef.current = setTimeout(() => {
      setLongPressActive(true);
      toggleAutoMode();
    }, 800); // 800ms长按时间触发自动模式切换
  };

  // 处理释放事件 - 清除长按计时器
  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
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
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // 占位元素
  }

  return (
    <div
      className="cursor-target relative flex items-center justify-center"
      ref={navItemRef}
    >
      <button
        className="relative group"
        onClick={toggleTheme}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={() => {
          handleMouseEnter();
          setIsTapped(true);
        }}
        onTouchEnd={handleMouseLeave}
        aria-label={
          autoMode ? "自动主题模式 (长按切换)" : "切换主题 (长按切换自动模式)"
        }
      >
        {/* 图标容器 */}
        <motion.div
          className={cn(
            "p-2 rounded-full relative overflow-hidden transition-colors",
            isHovered
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

          {/* 自动模式指示器 */}
          {autoMode && (
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#56CFE1] rounded-full flex items-center justify-center animate-pulse z-20">
              <FiClock className="w-1.5 h-1.5 text-white" />
            </div>
          )}

          {/* 主题图标 */}
          <div className="w-6 h-6 relative z-1 overflow-hidden rounded-full">
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="night-scene"
                  initial={
                    isReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Dark mode - Night scene */}
                  <div className="w-full h-full bg-gradient-to-b from-[#0f1729] to-[#2c3e50] rounded-full flex items-center justify-center relative">
                    {/* Moon */}
                    <motion.div
                      initial={{ x: -6 }}
                      animate={{ x: 0 }}
                      className="w-3 h-3 bg-gray-100 rounded-full absolute shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                      style={{ top: "25%", left: "30%" }}
                    />
                    {/* Stars */}
                    {!isReducedMotion && (
                      <>
                        <motion.div
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          className="w-0.5 h-0.5 bg-white rounded-full absolute"
                          style={{ top: "20%", right: "30%" }}
                        />
                        <motion.div
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.5,
                          }}
                          className="w-0.5 h-0.5 bg-white rounded-full absolute"
                          style={{ top: "40%", right: "20%" }}
                        />
                        <motion.div
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1,
                          }}
                          className="w-0.5 h-0.5 bg-white rounded-full absolute"
                          style={{ top: "30%", left: "20%" }}
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="day-scene"
                  initial={
                    isReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Light mode - Day scene */}
                  <div className="w-full h-full bg-gradient-to-b from-[#56CFE1] to-[#7FD3F2] rounded-full flex items-center justify-center relative">
                    {/* Sun */}
                    <motion.div
                      initial={{ y: 6 }}
                      animate={{ y: 0 }}
                      className="w-4 h-4 bg-yellow-300 rounded-full shadow-[0_0_10px_rgba(255,204,0,0.8)]"
                    />
                    {/* Clouds */}
                    {!isReducedMotion && (
                      <>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          className="absolute w-2.5 h-1.5 bg-white rounded-full left-1 top-2"
                        />
                        <motion.div
                          animate={{ x: [0, -2, 0] }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          className="absolute w-2 h-1 bg-white rounded-full right-1.5 top-1.5"
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 新风格：电路背景 */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 40 40"
            className="absolute inset-0 pointer-events-none opacity-30"
          >
            <path
              d="M10,20 H15 C17,20 17,15 20,15 H25 C27,15 27,20 30,20"
              stroke={
                autoMode ? "#56CFE1" : theme === "dark" ? "#56CFE1" : "#9D4EDD"
              }
              strokeWidth="0.7"
              fill="none"
              className={
                autoMode || theme === "dark" ? "animate-data-flow" : ""
              }
              style={{ animationDuration: "3s" }}
            />
            {(autoMode || theme === "dark") && (
              <circle
                cx="20"
                cy="20"
                r="1.5"
                fill="#56CFE1"
                className="animate-led-blink"
              />
            )}
            {/* 波形云线 */}
            <path
              d="M5,25 C10,23 15,27 20,25 C25,23 30,27 35,25"
              stroke={
                autoMode ? "#56CFE1" : theme === "dark" ? "#FF9470" : "#9D4EDD"
              }
              strokeWidth="0.5"
              strokeOpacity="0.5"
              fill="none"
              className={
                autoMode || theme === "dark" ? "animate-wave-float" : ""
              }
            />
          </svg>
        </motion.div>
      </button>

      {/* 使用TooltipPortal组件 */}
      <TooltipPortal
        text={
          autoMode ? "自动主题模式 (长按切换)" : "切换主题 (长按切换自动模式)"
        }
        anchorRect={anchorRect}
        isVisible={showTooltip}
      />
    </div>
  );
}
