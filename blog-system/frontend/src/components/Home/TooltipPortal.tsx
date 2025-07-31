"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

interface TooltipPortalProps {
  text: string;
  anchorRect: DOMRect | null;
  isVisible: boolean;
}

export default function TooltipPortal({
  text,
  anchorRect,
  isVisible,
}: TooltipPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted || !isVisible || !anchorRect) return null;

  // 创建一个portal直接渲染到body
  return createPortal(
    <div
      style={{
        position: "absolute",
        top: `${anchorRect.bottom + window.scrollY + 5}px`,
        left: `${anchorRect.left + anchorRect.width / 2 + window.scrollX}px`,
        transform: "translateX(-50%)",
        zIndex: 9999999,
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="  bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-1.5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm font-medium whitespace-nowrap text-center min-w-[45px] relative">
          {text}
          <div className="absolute -top-2 left-[50%] -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-t border-l border-gray-200 dark:border-gray-700"></div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
