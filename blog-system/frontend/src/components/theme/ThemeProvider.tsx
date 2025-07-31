"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeNotification } from "./ThemeNotification";

// A wrapper component to handle theme logic
function ThemeHandler({
  children,
  isChangingTheme,
  isReducedMotion,
  currentTheme,
}: {
  children: React.ReactNode;
  isChangingTheme: boolean;
  isReducedMotion: boolean;
  currentTheme: string | undefined;
}) {
  return (
    <>
      {children}
      <AnimatePresence>
        {isChangingTheme && !isReducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-[9999] pointer-events-none bg-black dark:bg-white"
          />
        )}
      </AnimatePresence>
      <ThemeNotification theme={currentTheme} />
    </>
  );
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={props.defaultTheme || "light"}
        style={{ visibility: "hidden" }}
      >
        {children}
      </div>
    );
  }

  return (
    <NextThemesProvider {...props} enableSystem={false}>
      <ThemeLogicProvider>{children}</ThemeLogicProvider>
    </NextThemesProvider>
  );
}

function ThemeLogicProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(
    undefined
  );
  const [userOverride, setUserOverride] = useState(false);

  const setThemeByTime = useCallback(() => {
    if (typeof window === "undefined" || userOverride) return;

    const autoMode = localStorage.getItem("themeAutoMode") === "true";
    if (!autoMode) return;

    const currentHour = new Date().getHours();
    const newTheme = currentHour >= 6 && currentHour < 18 ? "light" : "dark";

    setTheme(newTheme);
    setCurrentTheme(newTheme);
  }, [userOverride, setTheme]);

  useEffect(() => {
    setIsReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    const hasUserOverride =
      localStorage.getItem("userThemeOverride") === "true";
    setUserOverride(hasUserOverride);

    const autoMode = localStorage.getItem("themeAutoMode") === "true";
    if (autoMode && !hasUserOverride) {
      setThemeByTime();
    }

    const intervalId = setInterval(setThemeByTime, 60000);

    const handleThemeChange = (e: CustomEvent) => {
      const newTheme = e.detail?.theme;
      const isAutoMode = !!e.detail?.isAutoMode;

      if (!isReducedMotion) {
        setIsChangingTheme(true);
        setCurrentTheme(newTheme);
        setTimeout(() => setIsChangingTheme(false), 800);
      }

      if (isAutoMode) {
        setUserOverride(false);
        localStorage.setItem("userThemeOverride", "false");
      } else {
        setUserOverride(true);
        localStorage.setItem("userThemeOverride", "true");
      }
    };

    const handleAutoModeChange = () => {
      const autoMode = localStorage.getItem("themeAutoMode") === "true";
      const userOverrideValue =
        localStorage.getItem("userThemeOverride") === "true";
      if (autoMode && !userOverrideValue) {
        setUserOverride(false);
        setThemeByTime();
      }
    };

    window.addEventListener("themechange", handleThemeChange as EventListener);
    window.addEventListener(
      "autoModeChange",
      handleAutoModeChange as EventListener
    );

    return () => {
      clearInterval(intervalId);
      window.removeEventListener(
        "themechange",
        handleThemeChange as EventListener
      );
      window.removeEventListener(
        "autoModeChange",
        handleAutoModeChange as EventListener
      );
    };
  }, [isReducedMotion, userOverride, setThemeByTime]);

  return (
    <ThemeHandler
      isChangingTheme={isChangingTheme}
      isReducedMotion={isReducedMotion}
      currentTheme={currentTheme}
    >
      {children}
    </ThemeHandler>
  );
}
