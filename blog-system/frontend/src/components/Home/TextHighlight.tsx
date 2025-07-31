// components/ui/TextHighlight.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface TextHighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
  delay?: number;
  duration?: number;
  textEndColor?: string;
}

const TextHighlight: React.FC<TextHighlightProps> = ({
  className,
  delay = 0,
  duration = 2000,
  textEndColor = "inherit",
  children,
  ...props
}) => {
  // 使用 style 属性替代 Vue 的 v-bind
  const animationStyle = {
    "--delay": `${delay}ms`,
    "--duration": `${duration}ms`,
    "--text-end-color": textEndColor,
    animation: `
      background-expand var(--duration) ease-in-out var(--delay) forwards,
      text-color-change var(--duration) ease-in-out var(--delay) forwards
    `,
  } as React.CSSProperties;

  return (
    <span
      className={cn(
        "inline-block bg-[length:0%_100%] bg-no-repeat bg-left px-1 pb-1",
        className
      )}
      style={animationStyle}
      {...props}
    >
      {children}
    </span>
  );
};

export default TextHighlight;
