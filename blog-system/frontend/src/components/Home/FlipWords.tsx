"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
  textColor?: string;
}

export function FlipWords({
  words,
  duration = 2000,
  className,
  textColor,
}: FlipWordsProps) {
  const [index, setIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    // 如果没有足够的单词来轮换，则直接返回
    if (words.length <= 1) return;

    const timer = setInterval(() => {
      // 更新索引
      const nextIndex = (index + 1) % words.length;
      setIndex(nextIndex);
      setCurrentWord(words[nextIndex]);
    }, duration);

    return () => clearInterval(timer);
  }, [index, words, duration]);

  return (
    <div className={cn("relative inline-block overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "inline-block whitespace-nowrap font-bold",
            textColor ? textColor : "text-[#5046e6]"
          )}
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
