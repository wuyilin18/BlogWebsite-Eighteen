"use client";
import React, { useEffect, useRef } from "react";

// 定义组件的 props 接口
interface FuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number | string;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string; // 该属性用于接收外部传入的颜色
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children,
  fontSize = "clamp(2rem, 8vw, 8rem)",
  fontWeight = 900,
  fontFamily = "inherit",
  color = "#fff", // 默认颜色为白色
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 使用 ref 来存储动画帧ID和事件监听器，以便在清理时访问
  // 将 listener 的类型从 (e: any) => void 修改为更通用的 EventListener 来修复 linter 报错
  const animationState = useRef<{
    animationFrameId: number | null;
    listeners: { type: string; listener: EventListener }[];
  }>({ animationFrameId: null, listeners: [] });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isEffectCancelled = false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const init = async () => {
      // 等待字体加载完成，以防字体闪烁或计算错误
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      if (isEffectCancelled) return;

      // 1. 计算文本尺寸和字体
      const computedFontFamily =
        fontFamily === "inherit"
          ? window.getComputedStyle(canvas).fontFamily || "sans-serif"
          : fontFamily;
      const fontSizeStr =
        typeof fontSize === "number" ? `${fontSize}px` : fontSize;

      let numericFontSize: number;
      if (typeof fontSize === "number") {
        numericFontSize = fontSize;
      } else {
        const temp = document.createElement("span");
        temp.style.position = "absolute";
        temp.style.visibility = "hidden";
        temp.style.fontSize = fontSize;
        document.body.appendChild(temp);
        const computedSize = window.getComputedStyle(temp).fontSize;
        numericFontSize = parseFloat(computedSize);
        document.body.removeChild(temp);
      }
      const text = React.Children.toArray(children).join("");

      // 2. 创建离屏 Canvas 用于预渲染文本
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";
      const metrics = offCtx.measureText(text);
      const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
      const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
      const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
      const actualDescent =
        metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;
      const textBoundingWidth = Math.ceil(actualLeft + actualRight);
      const tightHeight = Math.ceil(actualAscent + actualDescent);

      const extraWidthBuffer = 10;
      offscreen.width = textBoundingWidth + extraWidthBuffer;
      offscreen.height = tightHeight;
      const xOffset = extraWidthBuffer / 2;

      // 3. 在离屏 Canvas 上绘制文本，使用传入的 `color` prop
      offCtx.font = `${fontWeight} ${fontSizeStr} ${computedFontFamily}`;
      offCtx.textBaseline = "alphabetic";
      offCtx.fillStyle = color;
      offCtx.fillText(text, xOffset - actualLeft, actualAscent);

      // 4. 设置主 Canvas 尺寸并准备动画
      const horizontalMargin = 50;
      const verticalMargin = 0;
      canvas.width = offscreen.width + horizontalMargin * 2;
      canvas.height = tightHeight + verticalMargin * 2;
      ctx.translate(horizontalMargin, verticalMargin);

      let isHovering = false;
      const fuzzRange = 30;

      // 5. 动画循环
      const run = () => {
        if (isEffectCancelled) return;
        ctx.clearRect(
          -horizontalMargin,
          -verticalMargin,
          canvas.width,
          canvas.height
        );
        const intensity = isHovering ? hoverIntensity : baseIntensity;
        for (let j = 0; j < tightHeight; j++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
          ctx.drawImage(
            offscreen,
            0,
            j,
            offscreen.width,
            1,
            dx,
            j,
            offscreen.width,
            1
          );
        }
        animationState.current.animationFrameId = requestAnimationFrame(run);
      };
      run();

      // 6. 设置交互事件
      if (enableHover) {
        const interactiveLeft = horizontalMargin + xOffset;
        const interactiveTop = verticalMargin;
        const interactiveRight = interactiveLeft + textBoundingWidth;
        const interactiveBottom = interactiveTop + tightHeight;
        const isInsideTextArea = (x: number, y: number) =>
          x >= interactiveLeft &&
          x <= interactiveRight &&
          y >= interactiveTop &&
          y <= interactiveBottom;

        // 辅助函数，用于添加事件监听器并记录下来以便清理
        const addListener = (
          type: string,
          listener: EventListener,
          options?: AddEventListenerOptions
        ) => {
          canvas.addEventListener(type, listener, options);
          animationState.current.listeners.push({ type, listener });
        };

        addListener("mousemove", (e: Event) => {
          const rect = canvas.getBoundingClientRect();
          const mouseEvent = e as MouseEvent;
          isHovering = isInsideTextArea(
            mouseEvent.clientX - rect.left,
            mouseEvent.clientY - rect.top
          );
        });

        addListener("mouseleave", () => {
          isHovering = false;
        });

        addListener(
          "touchmove",
          (e: Event) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const touchEvent = e as TouchEvent;
            const touch = touchEvent.touches[0];
            isHovering = isInsideTextArea(
              touch.clientX - rect.left,
              touch.clientY - rect.top
            );
          },
          { passive: false }
        );

        addListener("touchend", () => {
          isHovering = false;
        });
      }
    };

    init();

    // 7. 清理函数：在组件卸载或依赖项变更时运行
    return () => {
      isEffectCancelled = true;
      // 取消动画帧
      if (animationState.current.animationFrameId) {
        cancelAnimationFrame(animationState.current.animationFrameId);
      }
      // 移除所有事件监听器
      if (canvas) {
        animationState.current.listeners.forEach(({ type, listener }) => {
          canvas.removeEventListener(type, listener);
        });
      }
      animationState.current.listeners = []; // 清空记录
    };
  }, [
    children,
    fontSize,
    fontWeight,
    fontFamily,
    color,
    enableHover,
    baseIntensity,
    hoverIntensity,
  ]);

  // 添加 style={{ maxWidth: '100%' }} 防止 canvas 在小屏幕上溢出
  return <canvas ref={canvasRef} style={{ maxWidth: "100%" }} />;
};

export default FuzzyText;
