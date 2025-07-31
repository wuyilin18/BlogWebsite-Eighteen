"use client";

import { FC, ReactNode, useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";

const CONTAINER_SIZE = 200;
const CONTAINER_HEIGHT = 220; // 减小容器高度，仅保留足够的空间

interface FamilyButtonProps {
  children: React.ReactNode;
  position?: "bottom-right" | "custom";
  className?: string;
}

const FamilyButton: React.FC<FamilyButtonProps> = ({
  children,
  position = "bottom-right",
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <motion.div
      className={cn(
        "border border-black/10 shadow-sm dark:border-neutral-800",
        "bg-gradient-to-b from-neutral-800 to-black overflow-hidden", // overflow-hidden is crucial
        position === "bottom-right" && "fixed bottom-8 right-8 z-50",
        className
      )}
      animate={{
        width: isExpanded ? CONTAINER_SIZE : 64, // 4rem = 64px
        height: isExpanded ? CONTAINER_HEIGHT : 64,
        borderRadius: isExpanded ? 20 : 32, // 32px for w-16 h-16 circle (circular)
      }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      layout // Added layout for smoother transitions of size
    >
      {/* Content wrapper for children - animated opacity and height */}
      <motion.div
        className="children-content-wrapper"
        initial={false}
        animate={{
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? CONTAINER_HEIGHT - 50 : 0, // 50px is for the button bar below
        }}
        transition={{
          opacity: {
            duration: isExpanded ? 0.3 : 0.1,
            delay: isExpanded ? 0.1 : 0,
          },
          height: {
            duration: 0.25,
            type: "spring",
            damping: 25,
            stiffness: 400,
          }, // Match parent animation somewhat
        }}
        style={{
          pointerEvents: isExpanded ? "auto" : "none",
          overflow: "hidden", // Clip content as it animates height
        }}
      >
        {/* This inner div receives the background and rounded corners for the content area */}
        <div className="h-full overflow-hidden bg-gradient-to-b from-neutral-800 to-black rounded-t-[22px]">
          {children}
        </div>
      </motion.div>

      {/* Toggle button area - positioned at the bottom */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 flex items-center justify-center",
          isExpanded ? "h-[50px] bg-black" : "h-full w-full" // Takes full space when collapsed
        )}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.button
              key="close-btn"
              initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
              animate={{
                rotate: 0,
                scale: 1,
                opacity: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.3,
                  type: "spring",
                  damping: 15,
                  stiffness: 300,
                },
              }}
              exit={{
                rotate: 90,
                scale: 0.7,
                opacity: 0,
                transition: { duration: 0.15 },
              }}
              onClick={toggleExpand}
              className="p-[10px] group bg-neutral-800 border border-neutral-700 hover:border-neutral-600 text-orange-50 rounded-full transition-colors duration-300"
            >
              <XIcon className="h-6 w-6 text-neutral-400 group-hover:text-neutral-300" />
            </motion.button>
          ) : (
            <motion.div
              key="open-btn"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 300,
                  delay: 0.1,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.7,
                transition: { duration: 0.15 },
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-b from-neutral-700 to-neutral-900 flex items-center justify-center cursor-pointer border border-neutral-800"
              onClick={toggleExpand}
            >
              <motion.div
                className="p-[10px] group bg-cyan-500 text-black border border-cyan-600 rounded-full shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusIcon className="h-7 w-7" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// 简单的子组件用于组织内容
export const FamilyButtonContent: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("w-full h-full px-3 py-2 text-sm", className)}>
    {children}
  </div>
);

export { FamilyButton };
export default FamilyButton;
