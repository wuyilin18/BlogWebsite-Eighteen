"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiX, FiClock } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ThemeNotificationProps {
  theme: string | undefined;
}

export function ThemeNotification({ theme }: ThemeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<{
    title: string;
    description: string;
    isAutoSwitch: boolean;
  } | null>(null);

  useEffect(() => {
    setIsReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    // 检查是否在自动模式
    const checkAutoMode = () => {
      const autoMode = localStorage.getItem("themeAutoMode") === "true";
      const userOverride = localStorage.getItem("userThemeOverride") === "true";
      setIsAutoMode(autoMode && !userOverride);
    };

    // 初始检查
    checkAutoMode();

    // 处理主题变更事件
    const handleThemeChange = (event: CustomEvent) => {
      const detail = event.detail || {};
      const newTheme = detail.theme;
      const isAutoSwitch = !!detail.isAutoMode;

      let title = "";
      let description = "";

      if (isAutoSwitch) {
        title = "自动主题";
        description = "已启用基于系统时间的自动主题切换";
      } else {
        title = newTheme === "dark" ? "关灯啦" : "开灯啦";
        description =
          newTheme === "dark"
            ? "当前已成功切换至夜间模式！"
            : "当前已成功切换至白天模式！";

        // 检查是否处于自动模式
        const autoMode = localStorage.getItem("themeAutoMode") === "true";
        const userOverride =
          localStorage.getItem("userThemeOverride") === "true";
        if (autoMode && !userOverride) {
          title = "自动主题";
          description = "当前正在随系统时间自动切换主题";
        }
      }

      setNotificationMessage({
        title,
        description,
        isAutoSwitch,
      });

      setIsVisible(true);

      // 3秒后隐藏通知
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    // 监听storage变化和自动模式变化事件
    window.addEventListener("storage", checkAutoMode);
    window.addEventListener("autoModeChange", checkAutoMode);
    window.addEventListener("themechange", handleThemeChange as EventListener);

    return () => {
      window.removeEventListener("storage", checkAutoMode);
      window.removeEventListener("autoModeChange", checkAutoMode);
      window.removeEventListener(
        "themechange",
        handleThemeChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (theme && !notificationMessage) {
      // 仅当没有通过事件设置通知时，根据主题变化自动生成通知
      let title = "";
      let description = "";

      if (isAutoMode) {
        title = "自动主题";
        description = "已启用基于系统时间的自动主题切换";
      } else {
        title = theme === "dark" ? "关灯啦" : "开灯啦";
        description =
          theme === "dark"
            ? "当前已成功切换至夜间模式！"
            : "当前已成功切换至白天模式！";
      }

      setNotificationMessage({
        title,
        description,
        isAutoSwitch: isAutoMode,
      });

      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // 3 seconds display time

      return () => clearTimeout(timer);
    }
  }, [theme, isAutoMode, notificationMessage]);

  if (!notificationMessage) {
    return null;
  }

  const { title, description, isAutoSwitch } = notificationMessage;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed top-20 left-4 z-[9999] flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg max-w-xs",
            theme === "dark"
              ? "bg-gray-800 text-gray-100 border border-gray-700"
              : "bg-white text-gray-800 border border-gray-200"
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              isAutoSwitch
                ? "bg-blue-900/30 text-blue-400 dark:bg-blue-900/30 dark:text-blue-400"
                : theme === "dark"
                ? "bg-green-900/30 text-green-400"
                : "bg-green-100 text-green-600"
            )}
          >
            {isAutoSwitch ? (
              <FiClock className="h-5 w-5" />
            ) : (
              <FiCheck className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "text-sm font-bold",
                  theme === "dark" ? "text-white" : "text-gray-800"
                )}
              >
                {title}
              </span>
              <span className="ml-1">
                {isAutoSwitch ? (
                  <div className="relative flex items-center justify-center w-5 h-5">
                    {/* Auto Icon */}
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 10,
                        ease: "linear",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2L14 6H10L12 2Z"
                          fill="url(#autoGradient)"
                        />
                        <path
                          d="M12 22L10 18H14L12 22Z"
                          fill="url(#autoGradient)"
                        />
                        <path
                          d="M2 12L6 10V14L2 12Z"
                          fill="url(#autoGradient)"
                        />
                        <path
                          d="M22 12L18 14V10L22 12Z"
                          fill="url(#autoGradient)"
                        />
                        <defs>
                          <linearGradient
                            id="autoGradient"
                            x1="12"
                            y1="2"
                            x2="12"
                            y2="22"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#56CFE1" />
                            <stop offset="1" stopColor="#9D4EDD" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#56CFE1] opacity-30 rounded-full blur-md"></div>
                  </div>
                ) : theme === "dark" ? (
                  <div className="relative flex items-center justify-center w-5 h-5">
                    {/* Moon Icon */}
                    <motion.svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ rotate: -30 }}
                      animate={{ rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      <path
                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                        stroke="url(#moonGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="#1a1f35"
                      />
                      <defs>
                        <linearGradient
                          id="moonGradient"
                          x1="12"
                          y1="2"
                          x2="12"
                          y2="22"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#56CFE1" />
                          <stop offset="1" stopColor="#9D4EDD" />
                        </linearGradient>
                      </defs>
                    </motion.svg>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#56CFE1] opacity-30 rounded-full blur-md"></div>
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center w-5 h-5">
                    {/* Sun Icon */}
                    <motion.svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1, rotate: 180 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      <circle cx="12" cy="12" r="5" fill="url(#sunGradient)" />
                      <path
                        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                        stroke="url(#sunGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient
                          id="sunGradient"
                          x1="12"
                          y1="1"
                          x2="12"
                          y2="23"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#FF9470" />
                          <stop offset="1" stopColor="#FFB347" />
                        </linearGradient>
                      </defs>
                    </motion.svg>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-amber-500 opacity-30 rounded-full blur-md"></div>
                  </div>
                )}
              </span>
            </div>
            <p
              className={cn(
                "text-xs mt-0.5",
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              )}
            >
              {description}
            </p>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className={cn(
              "shrink-0 rounded-full p-1 transition-colors",
              theme === "dark"
                ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            )}
            aria-label="关闭通知"
          >
            <FiX className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
