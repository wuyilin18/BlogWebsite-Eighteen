// components/ui/orbit/Orbit.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { OrbitProps } from "./types";

const Orbit: React.FC<OrbitProps> = ({
  className,
  direction = "normal",
  duration = 20,
  delay = 0,
  radius = 50,
  path = false,
  children,
  ...props
}) => {
  // 通过内联样式实现旋转动画
  const animationName = `orbit-${radius}`;

  // 创建动态的 keyframes 样式
  const keyframesStyle = `
    @keyframes ${animationName} {
      0% {
        transform: rotate(0deg) translateX(${radius}px) rotate(0deg);
      }
      100% {
        transform: rotate(360deg) translateX(${radius}px) rotate(-360deg);
      }
    }
  `;

  const orbitStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: "-20px",
    marginTop: "-20px",
    animation: `${animationName} ${duration}s linear infinite ${direction}`,
    animationDelay: `-${delay}s`,
    zIndex: 5,
  } as React.CSSProperties;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle }} />

      {path && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
          }}
        >
          <div className="w-full h-full rounded-full border-2 border-slate-300/20 dark:border-slate-400/20" />
        </div>
      )}

      <div
        className={cn("flex items-center justify-center", className)}
        style={orbitStyle}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

export default Orbit;
