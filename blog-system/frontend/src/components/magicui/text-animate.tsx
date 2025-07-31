"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, MotionProps, Variants } from "motion/react";
import { ElementType, ReactNode, useEffect, useState } from "react";

type AnimationType = "text" | "word" | "character" | "line";
type AnimationVariant =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";

interface TextAnimateProps extends MotionProps {
  /**
   * The text content to animate
   */
  children: string | ReactNode;
  /**
   * The class name to be applied to the component
   */
  className?: string;
  /**
   * The class name to be applied to each segment
   */
  segmentClassName?: string;
  /**
   * The delay before the animation starts
   */
  delay?: number;
  /**
   * The duration of the animation
   */
  duration?: number;
  /**
   * Custom motion variants for the animation
   */
  variants?: Variants;
  /**
   * The element type to render
   */
  as?: ElementType;
  /**
   * How to split the text ("text", "word", "character")
   */
  by?: AnimationType;
  /**
   * Whether to start animation when component enters viewport
   */
  startOnView?: boolean;
  /**
   * Whether to animate only once
   */
  once?: boolean;
  /**
   * The animation preset to use
   */
  animation?: AnimationVariant;
  /**
   * Whether to loop the animation
   */
  loop?: boolean | number;
  /**
   * Delay between animation loops (in seconds)
   */
  loopDelay?: number;
}

const staggerTimings: Record<AnimationType, number> = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06,
};

const defaultContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const defaultItemAnimationVariants: Record<
  AnimationVariant,
  { container: Variants; item: Variants }
> = {
  fadeIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 },
      },
    },
  },
  blurIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        transition: { duration: 0.3 },
      },
    },
  },
  blurInUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
  blurInDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
  slideUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: 20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: {
          duration: 0.3,
        },
      },
    },
  },
  slideDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: -20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        y: 20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  slideLeft: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        x: -20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  slideRight: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: -20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        x: 20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  scaleUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 0.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 300,
          },
        },
      },
      exit: {
        scale: 0.5,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  scaleDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 1.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 300,
          },
        },
      },
      exit: {
        scale: 1.5,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
};

export function TextAnimate({
  children,
  delay = 0,
  duration = 0.3,
  variants,
  className,
  segmentClassName,
  as: Component = "p",
  startOnView = true,
  once = false,
  by = "word",
  animation = "fadeIn",
  loop = false,
  loopDelay = 2,
  ...props
}: TextAnimateProps) {
  const MotionComponent = motion.create(Component);
  const [key, setKey] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const [animationState, setAnimationState] = useState<
    "hidden" | "show" | "exit"
  >("hidden");

  // 处理循环逻辑
  useEffect(() => {
    if (!loop) return;

    // 如果指定了循环次数并且已达到，则不再循环
    if (typeof loop === "number" && loopCount >= loop) return;

    // 初始显示
    setAnimationState("show");

    const animationDuration = typeof duration === "number" ? duration * 2 : 0.6; // 考虑进出动画时间

    // 设置退出动画的定时器
    const exitTimer = setTimeout(() => {
      setAnimationState("exit");
    }, (animationDuration + (typeof delay === "number" ? delay : 0) + loopDelay / 2) * 1000);

    // 设置重置动画的定时器
    const resetTimer = setTimeout(() => {
      setKey((prev) => prev + 1);
      setLoopCount((prev) => prev + 1);
      setAnimationState("hidden");

      // 下一个循环开始前的短暂延迟
      setTimeout(() => {
        setAnimationState("show");
      }, 50);
    }, (animationDuration + loopDelay) * 1000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(resetTimer);
    };
  }, [key, loop, loopCount, duration, delay, loopDelay]);

  // 检查是否为React节点而不是字符串
  const isReactNode = typeof children !== "string";

  let segments: string[] = [];
  if (!isReactNode) {
    const textContent = children as string;
    switch (by) {
      case "word":
        segments = textContent.split(/(\s+)/);
        break;
      case "character":
        segments = textContent.split("");
        break;
      case "line":
        segments = textContent.split("\n");
        break;
      case "text":
      default:
        segments = [textContent];
        break;
    }
  }

  const finalVariants = variants
    ? {
        container: {
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              opacity: { duration: 0.01, delay },
              delayChildren: delay,
              staggerChildren: duration / (segments.length || 1),
            },
          },
          exit: {
            opacity: 0,
            transition: {
              staggerChildren: duration / (segments.length || 1),
              staggerDirection: -1,
            },
          },
        },
        item: variants,
      }
    : animation
    ? {
        container: {
          ...defaultItemAnimationVariants[animation].container,
          show: {
            ...defaultItemAnimationVariants[animation].container.show,
            transition: {
              delayChildren: delay,
              staggerChildren: duration / (segments.length || 1),
            },
          },
          exit: {
            ...defaultItemAnimationVariants[animation].container.exit,
            transition: {
              staggerChildren: duration / (segments.length || 1),
              staggerDirection: -1,
            },
          },
        },
        item: defaultItemAnimationVariants[animation].item,
      }
    : { container: defaultContainerVariants, item: defaultItemVariants };

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent
        key={loop ? `text-animate-${key}` : "text-animate"}
        variants={finalVariants.container as Variants}
        initial="hidden"
        whileInView={startOnView && !loop ? "show" : undefined}
        animate={loop ? animationState : !startOnView ? "show" : undefined}
        exit="exit"
        className={cn("whitespace-pre-wrap", className)}
        viewport={{ once }}
        {...props}
      >
        {isReactNode ? (
          <motion.div
            variants={finalVariants.item}
            className={cn(segmentClassName)}
          >
            {children}
          </motion.div>
        ) : (
          segments.map((segment, i) => (
            <motion.span
              key={`${by}-${segment}-${i}`}
              variants={finalVariants.item}
              custom={i * staggerTimings[by]}
              className={cn(
                by === "line" ? "block" : "inline-block whitespace-pre",
                by === "character" && "",
                segmentClassName
              )}
            >
              {segment}
            </motion.span>
          ))
        )}
      </MotionComponent>
    </AnimatePresence>
  );
}
