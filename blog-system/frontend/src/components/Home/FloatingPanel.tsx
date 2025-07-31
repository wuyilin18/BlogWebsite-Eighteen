"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";
import Link from "next/link";

import { ThemeNavItem } from "@/components/theme/ThemeNavItem";
import { SearchModal } from "@/components/Search/SearchModal";

// 导航项类型定义
interface NavigationItem {
  id: number;
  icon: React.ElementType;
  label: string;
  href: string;
}

interface FloatingPanelProps {
  onClose: () => void;
  navigation: NavigationItem[];
  isOpen: boolean;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  onClose,
  navigation,
  isOpen,
}) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  // 初始化窗口宽度
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 打开搜索modal
  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
    // 关闭侧边栏
    onClose();
  };

  // 关闭搜索模态框
  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  // 点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* 添加动画关键帧 */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes ledBlink {
                  0%, 100% { opacity: 0.3; }
                  50% { opacity: 0.9; }
                }
                @keyframes dataFlow {
                  0% { stroke-dashoffset: 20; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes circuitPulse {
                  0% { transform: scale(1); opacity: 0.7; }
                  50% { transform: scale(1.03); opacity: 1; }
                  100% { transform: scale(1); opacity: 0.7; }
                }
                @keyframes cloudFloat {
                  0% { transform: translateY(0) translateX(0); }
                  50% { transform: translateY(-2px) translateX(2px); }
                  100% { transform: translateY(0) translateX(0); }
                }
                @keyframes waveFloat {
                  0% { transform: rotate(-1deg) translateY(0); }
                  50% { transform: rotate(1deg) translateY(-3px); }
                  100% { transform: rotate(-1deg) translateY(0); }
                }
                .animate-led-blink {
                  animation: ledBlink 2s ease-in-out infinite;
                }
                .animate-data-flow {
                  stroke-dasharray: 4, 2;
                  animation: dataFlow 2s linear infinite;
                }
                .animate-circuit-pulse {
                  animation: circuitPulse 3s ease-in-out infinite;
                }
                .animate-cloud-float {
                  animation: cloudFloat 5s ease-in-out infinite;
                }
                .animate-wave-float {
                  animation: waveFloat 7s ease-in-out infinite;
                }
                .led-chip {
                  filter: drop-shadow(0 0 3px rgba(86, 207, 225, 0.7));
                }
              `,
            }}
          />

          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />

          {/* 主面板 */}
          <motion.div
            ref={panelRef}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md shadow-xl border-l border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            {/* 电路与云端背景 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* 云雾效果 */}
              <div className="absolute inset-0">
                <div
                  className="absolute top-[10%] left-[10%] w-[150px] h-[40px] bg-[#56CFE1] rounded-full"
                  style={{ filter: "blur(15px)", opacity: "0.07" }}
                ></div>
                <div
                  className="absolute top-[30%] right-[15%] w-[120px] h-[30px] bg-[#FF9470] rounded-full"
                  style={{
                    filter: "blur(15px)",
                    opacity: "0.07",
                    animationDelay: "1.5s",
                  }}
                ></div>
                <div
                  className="absolute top-[50%] left-[20%] w-[100px] h-[25px] bg-[#9D4EDD] rounded-full"
                  style={{
                    filter: "blur(15px)",
                    opacity: "0.07",
                    animationDelay: "0.8s",
                  }}
                ></div>
              </div>

              {/* 电路网格 */}
              <div className="absolute inset-0">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 800"
                  className="opacity-20 dark:opacity-30"
                >
                  {/* 垂直电路线 */}
                  <path
                    d="M100,0 V800"
                    stroke="#56CFE1"
                    strokeWidth="0.6"
                    strokeDasharray="4,4"
                    className="animate-data-flow"
                    style={{ animationDuration: "15s" }}
                  />
                  <path
                    d="M200,0 V800"
                    stroke="#9D4EDD"
                    strokeWidth="0.6"
                    strokeDasharray="4,4"
                    className="animate-data-flow"
                    style={{ animationDuration: "15s", animationDelay: "0.5s" }}
                  />
                  <path
                    d="M300,0 V800"
                    stroke="#FF9470"
                    strokeWidth="0.6"
                    strokeDasharray="4,4"
                    className="animate-data-flow"
                    style={{ animationDuration: "15s", animationDelay: "1s" }}
                  />

                  {/* 水平连接线 */}
                  <path
                    d="M0,200 H400"
                    stroke="#56CFE1"
                    strokeWidth="0.5"
                    className="animate-data-flow"
                    style={{ animationDuration: "10s" }}
                  />
                  <path
                    d="M0,400 H400"
                    stroke="#9D4EDD"
                    strokeWidth="0.5"
                    className="animate-data-flow"
                    style={{ animationDuration: "10s", animationDelay: "0.5s" }}
                  />
                  <path
                    d="M0,600 H400"
                    stroke="#FF9470"
                    strokeWidth="0.5"
                    className="animate-data-flow"
                    style={{ animationDuration: "10s", animationDelay: "1s" }}
                  />

                  {/* 电路节点 */}
                  <circle
                    cx="100"
                    cy="200"
                    r="3"
                    fill="#56CFE1"
                    className="animate-led-blink"
                  />
                  <circle
                    cx="200"
                    cy="400"
                    r="3"
                    fill="#9D4EDD"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.7s" }}
                  />
                  <circle
                    cx="300"
                    cy="600"
                    r="3"
                    fill="#FF9470"
                    className="animate-led-blink"
                    style={{ animationDelay: "1.4s" }}
                  />

                  {/* 芯片元素 */}
                  <g
                    transform="translate(200, 300)"
                    className="animate-circuit-pulse"
                    style={{
                      animationDelay: "1.1s",
                      transformOrigin: "center",
                    }}
                  >
                    <rect
                      x="-15"
                      y="-10"
                      width="30"
                      height="20"
                      rx="2"
                      stroke="#56CFE1"
                      strokeWidth="0.7"
                      fill="none"
                    />
                    <line
                      x1="-9"
                      y1="-10"
                      x2="-9"
                      y2="10"
                      stroke="#56CFE1"
                      strokeWidth="0.4"
                    />
                    <line
                      x1="-3"
                      y1="-10"
                      x2="-3"
                      y2="10"
                      stroke="#56CFE1"
                      strokeWidth="0.4"
                    />
                    <line
                      x1="3"
                      y1="-10"
                      x2="3"
                      y2="10"
                      stroke="#56CFE1"
                      strokeWidth="0.4"
                    />
                    <line
                      x1="9"
                      y1="-10"
                      x2="9"
                      y2="10"
                      stroke="#56CFE1"
                      strokeWidth="0.4"
                    />
                  </g>

                  {/* 山水波形线 */}
                  <path
                    d="M50,100 C100,80 150,120 200,100 C250,80 300,120 350,100"
                    stroke="#9D4EDD"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                    fill="none"
                    className="animate-wave-float"
                  />
                  <path
                    d="M50,500 C100,480 150,520 200,500 C250,480 300,520 350,500"
                    stroke="#FF9470"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                    fill="none"
                    className="animate-wave-float"
                    style={{ animationDelay: "1.2s" }}
                  />
                </svg>
              </div>
            </div>

            <div className="h-full flex flex-col relative z-10">
              {/* 头部 */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] bg-clip-text text-transparent dark:from-[#56CFE1] dark:to-[#FF9470] relative">
                  Eighteen
                  <div className="absolute -right-3 -top-3 w-2 h-2 rounded-full bg-[#56CFE1] animate-led-blink led-chip"></div>
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 hover:text-[#9D4EDD] dark:hover:text-[#FF9470]"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* 搜索区域 - 修改为与导航菜单项相似的样式 */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <motion.div
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={handleSearchClick}
                  className="cursor-target flex items-center py-3 px-2 rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-700/60 transition-colors cursor-pointer"
                >
                  <div className="relative w-10 h-10 flex items-center justify-center mr-3">
                    <FiSearch className="w-6 h-6 text-[#56CFE1] dark:text-[#56CFE1] relative z-1" />
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 40 40"
                      className="absolute inset-0 pointer-events-none opacity-30"
                    >
                      <path
                        d="M10,20 H15 C17,20 17,15 20,15 H25 C27,15 27,20 30,20"
                        stroke="#9D4EDD"
                        strokeWidth="0.7"
                        fill="none"
                      />
                      <path
                        d="M5,25 C10,23 15,27 20,25 C25,23 30,27 35,25"
                        stroke="#FF9470"
                        strokeWidth="0.5"
                        strokeOpacity="0.5"
                        fill="none"
                        className="animate-wave-float"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-800 dark:text-white hover:text-[#9D4EDD] dark:hover:text-[#FF9470]">
                    搜索
                  </span>
                </motion.div>
              </div>

              {/* 导航菜单 */}
              <div className="px-6 py-8 space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="cursor-target flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={onClose}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative w-10 h-10 flex items-center justify-center mr-3">
                      <item.icon className="w-6 h-6 text-[#56CFE1] dark:text-[#56CFE1] relative z-1" />
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 40 40"
                        className="absolute inset-0 pointer-events-none opacity-30"
                      >
                        <path
                          d="M10,20 H15 C17,20 17,15 20,15 H25 C27,15 27,20 30,20"
                          stroke="#9D4EDD"
                          strokeWidth="0.7"
                          fill="none"
                        />
                        {/* 山水波形线 */}
                        <path
                          d="M5,25 C10,23 15,27 20,25 C25,23 30,27 35,25"
                          stroke="#FF9470"
                          strokeWidth="0.5"
                          strokeOpacity="0.5"
                          fill="none"
                          className="animate-wave-float"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-800 dark:text-white hover:text-[#9D4EDD] dark:hover:text-[#FF9470]">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* 底部区域 */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center items-center">
                  <ThemeNavItem windowWidth={windowWidth} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 搜索模态框 */}
      <SearchModal
        key="floating-panel-search-modal"
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
      />
    </AnimatePresence>
  );
};

export default FloatingPanel;
