"use client";

import React, { memo, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AuroraText = memo(
  ({ children, className = "", colors, speed = 1 }: AuroraTextProps) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Mount effect for SSR compatibility
    useEffect(() => {
      setMounted(true);
    }, []);

    // Default colors based on theme - matching exactly with navigation bar gradients
    const defaultColors = mounted
      ? resolvedTheme === "dark"
        ? ["#56CFE1", "#FF9470"] // Dark mode - exact match with nav
        : ["#56CFE1", "#9D4EDD"] // Light mode - exact match with nav
      : ["#56CFE1", "#9D4EDD"]; // Default for SSR

    const gradientColors = colors || defaultColors;

    const gradientStyle = {
      backgroundImage: `linear-gradient(135deg, ${gradientColors.join(", ")})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animationDuration: `${10 / speed}s`,
    };

    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>
        <span
          className="relative animate-aurora bg-[length:200%_auto] bg-clip-text text-transparent"
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  }
);

AuroraText.displayName = "AuroraText";
