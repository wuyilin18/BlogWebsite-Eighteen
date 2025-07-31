"use client";

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { MorphingText } from "@/components/magicui/morphing-text";

export function ParallaxSection({
  foregroundImage,
  midgroundImage,
  backgroundImage,
}: {
  foregroundImage: string;
  midgroundImage: string;
  backgroundImage: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 定义自定义缓动函数
  const customEase = cubicBezier(0.42, 0, 0.58, 1); // 示例值，可根据需要调整

  const backgroundY = useTransform(scrollYProgress, [0.9, 1], ["0%", "60%"], {
    ease: customEase,
  });

  const midgroundY = useTransform(scrollYProgress, [1, 0.2], ["0%", "15%"], {
    ease: customEase,
  });

  const foregroundY = useTransform(scrollYProgress, [0, 0.7], ["60%", "0%"], {
    ease: customEase,
  });

  // 修改为 y 轴位移控制
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"], {
    ease: customEase,
  });

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden width: 100%;"
    >
      {/* 后景层 - 最慢速 */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="后景"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* 中景层 - 中速 */}
      <motion.div style={{ y: midgroundY }} className="absolute inset-0 z-10">
        <Image src={midgroundImage} alt="中景" fill className="object-cover" />
      </motion.div>

      {/* 文字层 - 从底部向上浮现 */}
      <motion.div
        style={{ y: textY }}
        className="absolute inset-0 z-20 flex items-center justify-center-center pointer-events-none"
      >
        <MorphingText texts={["十八加十八", "Eighteen"]} />
      </motion.div>

      {/* 前景层 - 快速遮挡 */}
      <motion.div
        style={{ y: foregroundY }}
        className="absolute inset-0 bottom-0 left-0 z-30 pointer-events-none"
      >
        <div className="relative w-full h-full">
          <Image
            src={foregroundImage}
            alt="前景"
            fill
            className="object-cover object-bottom"
            style={{
              maskImage: "linear-gradient(transparent 0%, black:20%)",
              willChange: "transform",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
