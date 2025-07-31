"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./HorizontalScroller.module.css";
import NextImage from "next/image";

interface HorizontalScrollerProps {
  image: string; // 单张图片URL
  scrollSpeed?: number; // 自动滚动速度（毫秒，0表示不自动滚动）
  height?: number | string; // 组件高度
  borderRadius?: number; // 边框圆角
  padding?: number; // 内边距
  minBorderWidth?: number; // 最小边框宽度（px）
  maxBorderWidth?: number; // 最大边框宽度（px）
  borderWidthRatio?: number; // 边框宽度比例系数（0-1）
  wheelSensitivity?: number; // 滚轮灵敏度（默认1）
  scrollDuration?: number; // 滚动动画持续时间（毫秒，默认300）
  pauseOnHover?: boolean; // 悬停时暂停自动滚动
  fullWidthBorder?: boolean; // 边框宽度等于图片宽度
  triggerDistance?: number; // 触发距离（像素）
  borderDistance?: number; // 边框距离（像素）
  useProportionalScroll?: boolean; // 使用比例滚动
  noPadding?: boolean; // 是否不留内部空隙
  thickBorder?: boolean; // 是否使用加厚边框
}

const HorizontalScroller = ({
  image,
  scrollSpeed = 3000,
  height = 300,
  borderRadius = 4,
  padding = 8,
  minBorderWidth = 1,
  maxBorderWidth = 4,
  borderWidthRatio = 0.001,
  wheelSensitivity = 0.3,
  pauseOnHover = true,
  fullWidthBorder = false,
  noPadding = false, // 默认有内部空隙
  thickBorder = false, // 默认不使用加厚边框
}: HorizontalScrollerProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [borderWidth, setBorderWidth] = useState(2);
  const [isMounted, setIsMounted] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false); // 是否已到达右边界
  const [horizontalPos, setHorizontalPos] = useState(0); // 水平滚动位置（像素）
  const [isWheelScrolling, setIsWheelScrolling] = useState(false); // 是否正在鼠标滚动

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null); // 用于存储动画帧ID

  // 在组件挂载后运行的效果
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 动态计算边框宽度
  const updateBorderWidth = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      let calculatedWidth = containerWidth * borderWidthRatio;
      calculatedWidth = Math.max(
        minBorderWidth,
        Math.min(maxBorderWidth, calculatedWidth)
      );
      setBorderWidth(calculatedWidth);
    }
  }, [borderWidthRatio, minBorderWidth, maxBorderWidth]);

  // 获取图片尺寸并设置边框
  useEffect(() => {
    if (!isMounted) return;

    // 创建一个新的Image对象来预加载并获取尺寸
    const imgLoader = new window.Image();
    imgLoader.onload = () => {
      // 如果需要全宽边框，设置边框宽度等于图片宽度
      if (fullWidthBorder) {
        setBorderWidth(imgLoader.width);
      } else {
        // 使用常规边框宽度计算
        updateBorderWidth();
      }
    };
    imgLoader.src = image;
  }, [isMounted, image, fullWidthBorder, updateBorderWidth]);

  // 计算当前是否已到达滚动边界的函数
  const checkScrollBoundaries = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const contentWidth = contentRef.current.scrollWidth;

    // 计算可滚动距离
    const maxScrollable = contentWidth;

    // 有效的最大滚动距离（考虑容器宽度）
    const maxAllowedScroll = maxScrollable - containerWidth;

    // 检查水平位置是否已到达边界
    const hasReachedEnd = horizontalPos >= maxAllowedScroll;

    if (hasReachedEnd !== reachedEnd) {
      setReachedEnd(hasReachedEnd);
    }
  }, [horizontalPos, reachedEnd]);

  // 在滚动位置改变时检查边界
  useEffect(() => {
    checkScrollBoundaries();
  }, [horizontalPos, checkScrollBoundaries]);

  // 自动横向滚动动画
  const animateScroll = useCallback(() => {
    if (isPaused || !contentRef.current || !containerRef.current) return;

    const contentWidth = contentRef.current.scrollWidth;
    const containerWidth = containerRef.current.offsetWidth;

    // 如果内容不需要滚动，不执行动画
    if (contentWidth <= containerWidth) return;

    // 计算最大滚动距离（图片宽度减去容器宽度）
    const maxScrollDistance = contentWidth - containerWidth;

    // 检查是否已经到达末尾
    if (horizontalPos >= maxScrollDistance) {
      setReachedEnd(true);
      // 停止自动滚动动画
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    // 缓慢增加水平位置
    const scrollStep = 0.5; // 每帧移动的像素，较小的值会使滚动更平滑
    setHorizontalPos((prevPos) => {
      // 确保不超过最大滚动距离
      const newPos = prevPos + scrollStep;
      return Math.min(newPos, maxScrollDistance);
    });

    // 递归调用以创建平滑动画
    animationRef.current = requestAnimationFrame(animateScroll);
  }, [isPaused, horizontalPos]);

  // 自动滚动效果
  useEffect(() => {
    if (!isMounted || scrollSpeed <= 0 || reachedEnd) return;

    // 开始动画
    if (!isPaused) {
      animationRef.current = requestAnimationFrame(animateScroll);
    }

    return () => {
      // 清理动画
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMounted, scrollSpeed, isPaused, animateScroll, reachedEnd]);

  // 监听容器尺寸变化
  useEffect(() => {
    if (!isMounted) return;

    let observer: ResizeObserver | undefined;
    // 修复1: 在effect内部保存containerRef.current的引用
    const currentContainer = containerRef.current;

    // 确保ResizeObserver仅在客户端使用
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        // 如果不是全宽边框模式，才更新边框宽度
        if (!fullWidthBorder) {
          updateBorderWidth();
        }
        // 重新检查滚动边界
        checkScrollBoundaries();
      });

      if (currentContainer) {
        observer.observe(currentContainer);
        if (!fullWidthBorder) {
          updateBorderWidth();
        }
      }
    }

    return () => {
      // 修复1: 在清理函数中使用保存的引用
      if (observer && currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [updateBorderWidth, isMounted, checkScrollBoundaries, fullWidthBorder]);

  // 处理滚轮事件
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      if (!containerRef.current || !contentRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;

      // 暂停自动滚动
      setIsPaused(true);
      setIsWheelScrolling(true);
      // 300ms 后关闭 transition
      if (scrollTimeoutRef.current !== null) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsWheelScrolling(false);
        if (!reachedEnd) {
          setIsPaused(false);
        }
        scrollTimeoutRef.current = null;
      }, 300);

      // 如果内容不需要滚动，不执行动画
      if (contentWidth <= containerWidth) return;

      // 计算最大滚动距离
      const maxScrollDistance = contentWidth - containerWidth;

      // 丝滑：步长更小
      const delta = -e.deltaY * wheelSensitivity * 0.5; // 0.5倍更细腻

      // 更新水平位置
      setHorizontalPos((prevPos) => {
        const newPos = Math.max(
          0,
          Math.min(maxScrollDistance, prevPos + delta)
        );
        // 检查是否到达末尾
        if (newPos >= maxScrollDistance) {
          setReachedEnd(true);
        } else if (newPos === 0) {
          setReachedEnd(false);
        }
        return newPos;
      });
    },
    // 修复2: 移除不必要的scrollDuration依赖
    [wheelSensitivity, reachedEnd]
  );

  // 使用非被动事件监听器处理滚轮事件
  useEffect(() => {
    if (!isMounted) return;

    // 修复1: 在effect内部保存containerRef.current的引用
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // 使用非被动事件监听器，允许preventDefault
    currentContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      // 修复1: 在清理函数中使用保存的引用
      currentContainer.removeEventListener("wheel", handleWheel);
    };
  }, [isMounted, handleWheel]);

  // 重置滚动位置的函数
  const resetScroll = useCallback(() => {
    setReachedEnd(false);
    setHorizontalPos(0);
    // 恢复自动滚动
    setIsPaused(false);
  }, []);

  const finalHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={styles.container}
      style={{
        height: finalHeight,
        borderRadius: `${borderRadius}px`,
        padding: noPadding ? 0 : `${padding}px`,
        borderWidth: thickBorder
          ? "3px"
          : fullWidthBorder
          ? `0 ${borderWidth}px 0 0`
          : `${borderWidth}px`,
        borderStyle: "solid",
        borderColor: "#000",
        position: "relative",
        overflow: "hidden",
      }}
      ref={containerRef}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && !reachedEnd && setIsPaused(false)}
    >
      <div
        ref={contentRef}
        className={styles.content}
        style={{
          transform: `translateX(-${horizontalPos}px)`,
          width: "max-content",
          height: "100%",
          transition: isWheelScrolling
            ? "transform 0.35s cubic-bezier(0.22,0.61,0.36,1)"
            : "none",
        }}
      >
        {isMounted ? (
          // 修复3: 将img标签替换为NextImage组件
          <div style={{ position: "relative", height: "100%", width: "auto" }}>
            <NextImage
              ref={imageRef}
              src={image}
              alt="Horizontal scroller content"
              className={styles.image}
              width={0}
              height={0}
              sizes="100vw"
              style={{
                display: "block",
                maxWidth: "none",
                height: "100%",
                width: "auto",
              }}
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                if (fullWidthBorder) {
                  setBorderWidth(img.naturalWidth);
                }
              }}
            />
          </div>
        ) : (
          <NextImage
            src={image}
            alt="Horizontal scroller content"
            className={styles.image}
            width={1000}
            height={500}
            priority
            style={{
              display: "block",
              maxWidth: "none",
              height: "100%",
              width: "auto",
            }}
          />
        )}
      </div>

      {/* 可选：添加重置按钮，当达到末尾时显示 */}
      {reachedEnd && (
        <button
          onClick={resetScroll}
          className={styles.resetButton}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "5px 10px",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          重置
        </button>
      )}
    </div>
  );
};

export default HorizontalScroller;
