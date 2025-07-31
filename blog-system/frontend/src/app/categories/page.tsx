"use client";

import React, { useState, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { getCategories } from "@/lib/strapi"; // 导入 getCategories

interface CategoryData {
  name: string;
  value: number;
  color: string;
  gradientStart: string;
  gradientEnd: string;
  count: number;
  percentage: string;
  icon: string;
}

// 定义一个从分类名称到颜色和图标的映射
const styleMap: { [key: string]: Partial<CategoryData> } = {
  web开发: {
    color: "#2A9D8F",
    gradientStart: "#2A9D8F",
    gradientEnd: "#43B88C",
    icon: "🌐",
  },
  嵌入式学习: {
    color: "#43AA8B",
    gradientStart: "#43AA8B",
    gradientEnd: "#5EBC93",
    icon: "💾",
  },
  算法: {
    color: "#90BE6D",
    gradientStart: "#90BE6D",
    gradientEnd: "#B0D170",
    icon: "🔍",
  },
  音乐: {
    color: "#9CC47E",
    gradientStart: "#9CC47E",
    gradientEnd: "#B8D686",
    icon: "🎵",
  },
  平面设计: {
    color: "#A7CC8E",
    gradientStart: "#A7CC8E",
    gradientEnd: "#C2DBA0",
    icon: "📚",
  },
  漫画: {
    color: "#C2DBA0",
    gradientStart: "#C2DBA0",
    gradientEnd: "#D5E5B6",
    icon: "📚",
  },
  动漫: {
    color: "#C2DBA0",
    gradientStart: "#C2DBA0",
    gradientEnd: "#D5E5B6",
    icon: "🎬",
  },
  default: {
    color: "#A7CC8E",
    gradientStart: "#A7CC8E",
    gradientEnd: "#C2DBA0",
    icon: "❓",
  },
};

const Categories: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [animate, setAnimate] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showCategoryCard, setShowCategoryCard] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  // 从服务器获取并格式化分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(); // 调用 getCategories，使用其默认的 populate
        if (response.data) {
          const totalPosts = response.data.reduce(
            (sum, cat) => sum + (cat.attributes?.posts?.data?.length ?? 0),
            0
          );

          const formattedCategories = response.data.map((cat) => {
            const name = cat.attributes?.name ?? "未命名";
            const count = cat.attributes?.posts?.data?.length ?? 0;
            const percentage =
              totalPosts > 0 ? ((count / totalPosts) * 100).toFixed(2) : "0.00";
            const styles = styleMap[name] || styleMap.default;

            return {
              name,
              value: count,
              count,
              percentage: `${percentage}%`,
              color: styles.color || "#A7CC8E",
              gradientStart: styles.gradientStart || "#A7CC8E",
              gradientEnd: styles.gradientEnd || "#C2DBA0",
              icon: styles.icon || "❓",
            };
          });
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("获取分类失败:", error);
      }
    };

    fetchCategories();
  }, []);
  // 为每个分类创建渐变色定义
  const renderGradients = () => {
    return categories.map((category, index) => (
      <defs key={`gradient-${index}`}>
        <linearGradient
          id={`gradient-${index}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={category.gradientStart} />
          <stop offset="100%" stopColor={category.gradientEnd} />
        </linearGradient>
        <filter
          id={`glow-${index}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* 添加阴影效果的滤镜 */}
        <filter
          id={`shadow-${index}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="rgba(0,0,0,0.3)"
          />
        </filter>
      </defs>
    ));
  };

  // 初始化所有分类为可见 + 启动动画
  useEffect(() => {
    if (categories.length === 0) return;

    setVisibleCategories(categories.map((cat) => cat.name));

    // 启动进场动画
    setTimeout(() => {
      setAnimate(true);
    }, 300);

    // 启动循环动画，每隔一定时间轮换活跃扇形
    intervalRef.current = setInterval(() => {
      if (!hoveredCategory) {
        setActiveIndex((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % categories.length;
        });
      }
    }, 3000);

    // 添加鼠标离开扇形区域的监听
    const handleMouseLeave = () => {
      setShowCategoryCard(false);
      setActiveIndex(null);
    };

    const chartElement = chartRef.current;
    if (chartElement) {
      chartElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (chartElement) {
        chartElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [categories, hoveredCategory]);

  // 处理鼠标移动，更新鼠标位置
  const handleMouseMove = (e: React.MouseEvent) => {
    if (chartRef.current) {
      const chartRect = chartRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - chartRect.left,
        y: e.clientY - chartRect.top,
      });

      // 确保在扇形区域内移动时保持提示卡片的显示
      if (activeIndex !== null && hoveredCategory) {
        setShowCategoryCard(true);
      }
    }
  };

  // 切换分类可见性
  const toggleCategoryVisibility = (categoryName: string) => {
    setVisibleCategories((prev) => {
      if (prev.includes(categoryName)) {
        // 不允许隐藏所有分类
        if (prev.length === 1) return prev;
        return prev.filter((name) => name !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  // 过滤当前显示的分类数据
  const visibleCategoryData = categories.filter((cat) =>
    visibleCategories.includes(cat.name)
  );

  // 自定义活跃扇形渲染 - 带有炫酷效果
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      // 移除未使用的变量，添加eslint禁用注释
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fill,
      midAngle,
      payload,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      index,
    } = props;

    // 计算标签位置
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);

    // 动态扩展外半径
    const expandedOuterRadius = outerRadius + 20;

    // 为标签计算更远的位置以避免重叠
    const sx = cx + expandedOuterRadius * cos;
    const sy = cy + expandedOuterRadius * sin;
    const mx = cx + (expandedOuterRadius + 30) * cos;
    const my = cy + (expandedOuterRadius + 30) * sin;
    const textAnchor = cos >= 0 ? "start" : "end";

    // 查找完整分类数据获取渐变ID
    const categoryIndex = categories.findIndex((c) => c.name === payload.name);
    if (categoryIndex === -1) return <g />; // 如果找不到分类，则不渲染
    const gradientId = `url(#gradient-${categoryIndex})`;
    const filterId = `url(#glow-${categoryIndex})`;

    return (
      <g>
        {/* 扇形阴影 - 给整个扇形增加层次感 */}
        <Sector
          cx={cx}
          cy={cy + 2}
          innerRadius={innerRadius}
          outerRadius={expandedOuterRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill="#000"
          opacity={0.15}
          filter={`url(#shadow-${categoryIndex})`}
        />

        {/* 扇形 - 扩展状态 */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={expandedOuterRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={gradientId}
          filter={filterId}
          className="transition-all duration-300 ease-out"
        />

        {/* 脉冲环 */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 2}
          outerRadius={innerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={categories[categoryIndex].gradientStart}
          className="animate-pulse"
        />

        {/* 外部轮廓 */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={expandedOuterRadius}
          outerRadius={expandedOuterRadius + 2}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={categories[categoryIndex].gradientEnd}
          opacity={0.8}
        />

        {/* 标签连线 */}
        <path
          d={`M${sx},${sy}L${mx},${my}`}
          stroke={categories[categoryIndex].gradientEnd}
          strokeWidth={2}
          fill="none"
          strokeDasharray="5,3"
          className="animate-dash"
        />

        {/* 标签背景 */}
        <rect
          x={mx + (cos >= 0 ? 5 : -135)}
          y={my - 20}
          width={130}
          height={40}
          rx={15}
          ry={15}
          fill="rgba(255,255,255,0.9)"
          filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"
        />

        {/* 标签文本 */}
        <text
          x={mx + (cos >= 0 ? 15 : -15)}
          y={my - 5}
          textAnchor={textAnchor}
          fill={categories[categoryIndex].color}
          className="font-medium"
          style={{ fontSize: "0.8rem" }}
        >
          {payload.name}
        </text>
        <text
          x={mx + (cos >= 0 ? 15 : -15)}
          y={my + 15}
          textAnchor={textAnchor}
          fill="#666"
          style={{ fontSize: "0.7rem" }}
        >
          {payload.count} 篇 ({payload.percentage})
        </text>
      </g>
    );
  };

  // 处理鼠标移入扇形区域
  const handleMouseEnter = (_: unknown, index: number) => {
    if (index >= 0 && index < visibleCategoryData.length) {
      const category = visibleCategoryData[index];
      setActiveIndex(index);
      setHoveredCategory(category.name);
      setShowCategoryCard(true);
    }
  };

  // 自定义提示框 - 鼠标跟随卡片效果
  const CategoryCard = () => {
    if (
      !showCategoryCard ||
      activeIndex === null ||
      activeIndex >= visibleCategoryData.length
    )
      return null;

    const data = visibleCategoryData[activeIndex];
    if (!data) return null;

    // 渲染对应分类的SVG图标
    const renderCategoryIcon = (categoryName: string) => {
      switch (categoryName) {
        case "嵌入式学习":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-circuit-pulse"
              style={{ animationDelay: "0.2s" }}
            >
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="2" x2="9" y2="4"></line>
              <line x1="15" y1="2" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="22"></line>
              <line x1="15" y1="20" x2="15" y2="22"></line>
              <line x1="20" y1="9" x2="22" y2="9"></line>
              <line x1="20" y1="14" x2="22" y2="14"></line>
              <line x1="2" y1="9" x2="4" y2="9"></line>
              <line x1="2" y1="14" x2="4" y2="14"></line>
            </svg>
          );
        case "web开发":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-cloud"
              style={{ animationDuration: "10s" }}
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
            </svg>
          );
        case "算法":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
              style={{ animationDelay: "0.3s" }}
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          );

        case "音乐":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-float"
              style={{ animationDelay: "0.4s" }}
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          );
        case "平面设计":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-float"
              style={{ animationDelay: "0.6s" }}
            >
              <circle cx="13.5" cy="6.5" r="2.5"></circle>
              <circle cx="17.5" cy="10.5" r="2.5"></circle>
              <circle cx="8.5" cy="7.5" r="2.5"></circle>
              <circle cx="6.5" cy="12.5" r="2.5"></circle>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
            </svg>
          );
        case "漫画":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-led-blink"
              style={{ animationDelay: "0.5s" }}
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          );
        case "动漫":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
              style={{ animationDuration: "1.5s" }}
            >
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="2.18"
                ry="2.18"
              ></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
          );
        default:
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
              style={{ animationDuration: "15s" }}
            >
              <path d="M12 2v8"></path>
              <path d="M18.4 6.6 17 8"></path>
              <path d="M6 12h12"></path>
              <path d="M17 16l1.4 1.4"></path>
              <path d="M12 22v-8"></path>
              <path d="M5.6 6.6 7 8"></path>
              <path d="M7 16l-1.4 1.4"></path>
            </svg>
          );
      }
    };

    // 检测鼠标是否接近图表右边缘
    let isNearRightEdge = false;
    const cardWidth = 180; // 卡片宽度

    if (chartRef.current) {
      const chartRect = chartRef.current.getBoundingClientRect();
      const chartWidth = chartRect.width;

      // 如果鼠标离右边缘小于卡片宽度，则认为接近右边缘
      if (mousePosition.x + cardWidth + 20 > chartWidth) {
        isNearRightEdge = true;
      }
    }

    // 提示框跟随鼠标位置，设置在鼠标右下角，接近边缘时移到左下角
    const style = {
      position: "absolute",
      left: isNearRightEdge
        ? `${mousePosition.x - cardWidth - 10}px`
        : `${mousePosition.x + 10}px`,
      top: `${mousePosition.y + 10}px`,
      pointerEvents: "none",
      zIndex: 999,
      transition: "transform 0.1s ease-out",
      transform: "translate3d(0, 0, 0)",
      borderRadius: "12px",
      width: "auto",
      minWidth: cardWidth + "px",
      opacity: 1,
      background: "rgba(42, 157, 143, 0.95)",
      boxShadow: "0 8px 32px rgba(42, 157, 143, 0.3)",
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(144, 190, 109, 0.3)",
    } as React.CSSProperties;

    return (
      <div style={style} className="text-white">
        <div className="relative px-4 py-3">
          {/* 硅原电路装饰 */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <svg
              width="180"
              height="130"
              viewBox="0 0 180 130"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 电路板网格线 */}
              <path
                d="M0,20 H180"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4,2"
                className="animate-data-flow"
                style={{ animationDelay: "0.1s" }}
              />
              <path
                d="M0,65 H180"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4,2"
                className="animate-data-flow"
                style={{ animationDelay: "0.3s" }}
              />
              <path
                d="M0,110 H180"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4,2"
                className="animate-data-flow"
                style={{ animationDelay: "0.5s" }}
              />
              <path
                d="M30,0 V130"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4,2"
                className="animate-data-flow"
                style={{ animationDelay: "0.2s" }}
              />
              <path
                d="M90,0 V130"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4,2"
                className="animate-data-flow"
                style={{ animationDelay: "0.4s" }}
              />
              <path
                d="M150,0 V130"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4,2"
                className="animate-data-flow"
                style={{ animationDelay: "0.6s" }}
              />

              {/* 电路元件 */}
              <circle
                cx="30"
                cy="20"
                r="3"
                fill="white"
                className="animate-led-blink"
                style={{ animationDelay: "0.2s" }}
              />
              <circle
                cx="90"
                cy="65"
                r="3"
                fill="white"
                className="animate-led-blink"
                style={{ animationDelay: "0.5s" }}
              />
              <circle
                cx="150"
                cy="110"
                r="3"
                fill="white"
                className="animate-led-blink"
                style={{ animationDelay: "0.8s" }}
              />

              {/* 芯片元件 */}
              <rect
                x="110"
                y="20"
                width="20"
                height="15"
                rx="1"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />
              <line
                x1="115"
                y1="20"
                x2="115"
                y2="35"
                stroke="white"
                strokeWidth="0.5"
              />
              <line
                x1="120"
                y1="20"
                x2="120"
                y2="35"
                stroke="white"
                strokeWidth="0.5"
              />
              <line
                x1="125"
                y1="20"
                x2="125"
                y2="35"
                stroke="white"
                strokeWidth="0.5"
              />

              {/* 电阻元件 */}
              <rect
                x="20"
                y="80"
                width="15"
                height="5"
                fill="white"
                fillOpacity="0.5"
              />

              {/* 电容元件 */}
              <line
                x1="55"
                y1="105"
                x2="55"
                y2="115"
                stroke="white"
                strokeWidth="2"
              />
              <line
                x1="58"
                y1="105"
                x2="58"
                y2="115"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* 标题栏 */}
          <div className="flex items-center mb-3 relative">
            <div className="w-8 h-8 rounded-md bg-[#42AB98] flex items-center justify-center mr-2 border border-white/30">
              {renderCategoryIcon(data.name)}
            </div>
            <div>
              <div className="font-bold text-white">{data.name}</div>
              <div className="text-xs text-white text-opacity-80">
                云端吟游者
              </div>
            </div>
            <div className="ml-auto px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#2A9D8F]">
              {data.percentage}
            </div>
          </div>

          {/* 文章数量 */}
          <div className="flex items-center justify-between relative z-10 mb-2">
            <div className="text-sm text-white text-opacity-80">文章数</div>
            <div className="flex items-center">
              <span className="font-bold text-lg">{data.count}</span>
              <span className="ml-2 font-normal text-sm">篇</span>
            </div>
          </div>

          {/* 进度条 - 竹笛设计 */}
          <div className="relative h-3 w-full bg-white bg-opacity-20 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: data.percentage,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.8) 100%)",
              }}
            >
              {/* 电路板轨道装饰 */}
              <div className="absolute inset-0 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 100 12">
                  {/* 电路轨道 */}
                  <path
                    d="M0,6 H100"
                    stroke="rgba(42, 157, 143, 0.5)"
                    strokeWidth="0.5"
                    strokeDasharray="2,1"
                    className="animate-data-flow"
                  />

                  {/* LED指示灯 */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={20 * (i + 1)}
                      cy="6"
                      r="1.5"
                      fill="rgba(42, 157, 143, 0.8)"
                      className="animate-led-blink"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="text-xs text-white text-opacity-70 text-center relative z-10 flex items-center justify-center">
            <span className="mr-1">☁️</span>
            <span>点击下方标签切换分类</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full pt-28 md:pt-32 pb-20 px-4 bg-gradient-to-b from-[#f5f7fa] to-[#f7f9f7] dark:from-[#2a2c31] dark:to-[#232528] transition-colors duration-500">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dash {
          to {
            stroke-dashoffset: 20;
          }
        }
        .animate-dash {
          animation: dash 1.5s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate3d(0, 10px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes floatUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes rotateIn {
          0% { transform: rotate(-5deg) scale(0.95); opacity: 0; }
          100% { transform: rotate(0) scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes circuitFlow {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(10px) translateY(-5px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes inkSpread {
          0% { transform: scale(0.95); opacity: 0.7; filter: blur(2px); }
          50% { transform: scale(1.02); opacity: 0.9; filter: blur(1px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes inkDrop {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        @keyframes inkStroke {
          0% { stroke-dashoffset: 1000; opacity: 0.3; }
          100% { stroke-dashoffset: 0; opacity: 0.7; }
        }
        @keyframes bambooSway {
          0% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
          100% { transform: rotate(-1deg); }
        }
        @keyframes circuitBlink {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes circuitPulse {
          0% { stroke-width: 1; opacity: 0.7; }
          50% { stroke-width: 1.5; opacity: 1; }
          100% { stroke-width: 1; opacity: 0.7; }
        }
        @keyframes ledBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.9; }
        }
        @keyframes dataFlow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-float-up {
          animation: floatUp 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }
        .animate-rotate-in {
          animation: rotateIn 0.8s ease-out forwards;
        }
        .animate-spin {
          animation: spin 8s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-circuit {
          stroke-dasharray: 100;
          animation: circuitFlow 3s linear infinite;
        }
        .animate-cloud {
          animation: cloudDrift 8s ease-in-out infinite;
        }
        .animate-ink-spread {
          animation: inkSpread 3s ease-in-out infinite;
        }
        .animate-ink-drop {
          animation: inkDrop 2s ease-out forwards;
        }
        .animate-ink-stroke {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: inkStroke 2s ease-out forwards;
        }
        .animate-bamboo-sway {
          animation: bambooSway 5s ease-in-out infinite;
        }
        .animate-circuit-blink {
          animation: circuitBlink 4s ease-in-out infinite;
        }
        .animate-circuit-pulse {
          animation: circuitPulse 3s ease-in-out infinite;
        }
        .animate-led-blink {
          animation: ledBlink 2s ease-in-out infinite;
        }
        .animate-data-flow {
          stroke-dasharray: 4, 2;
          animation: dataFlow 2s linear infinite;
        }
        
        /* 粒子效果 - 更改为新水墨风 */
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: overlay;
          z-index: 1;
        }
        .particle:nth-child(1) {
          width: 35px;
          height: 35px;
          top: 15%;
          left: 12%;
          background: radial-gradient(circle at center, rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.01));
          filter: blur(8px);
          animation: float 7s ease-in-out infinite;
        }
        .particle:nth-child(2) {
          width: 25px;
          height: 25px;
          top: 25%;
          right: 15%;
          background: radial-gradient(circle at center, rgba(20, 20, 20, 0.4), rgba(20, 20, 20, 0.01));
          filter: blur(6px);
          animation: float 8s ease-in-out infinite reverse;
        }
        .particle:nth-child(3) {
          width: 40px;
          height: 40px;
          bottom: 20%;
          right: 25%;
          background: radial-gradient(circle at center, rgba(20, 20, 20, 0.3), rgba(20, 20, 20, 0.01));
          filter: blur(10px);
          animation: float 9s ease-in-out infinite;
        }
        .particle:nth-child(4) {
          width: 30px;
          height: 30px;
          bottom: 30%;
          left: 20%;
          background: radial-gradient(circle at center, rgba(20, 20, 20, 0.4), rgba(20, 20, 20, 0.01));
          filter: blur(8px);
          animation: float 6s ease-in-out infinite reverse;
        }
        .particle:nth-child(5) {
          width: 20px;
          height: 20px;
          top: 40%;
          right: 10%;
          background: radial-gradient(circle at center, rgba(20, 20, 20, 0.5), rgba(20, 20, 20, 0.01));
          filter: blur(5px);
          animation: float 7s ease-in-out infinite;
        }
        .particle:nth-child(6) {
          width: 45px;
          height: 45px;
          top: 70%;
          left: 15%;
          background: radial-gradient(circle at center, rgba(20, 20, 20, 0.3), rgba(20, 20, 20, 0.01));
          filter: blur(12px);
          animation: float 8s ease-in-out infinite reverse;
        }
        
        /* 墨水滴落效果 - 新风格 */
        .ink-drop {
          position: absolute;
          transform-origin: center;
          z-index: 0;
        }
        .ink-drop:nth-child(1) {
          width: 250px;
          height: 250px;
          top: 5%;
          right: 2%;
          background-image: url("data:image/svg+xml,%3Csvg width='250' height='250' viewBox='0 0 250 250' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M125,10 C160,10 200,50 230,100 C240,150 200,220 125,230 C50,240 10,190 20,125 C30,60 90,10 125,10 Z' fill='rgba(20, 20, 20, 0.03)' /%3E%3C/svg%3E");
          animation-delay: 0.2s;
          opacity: 0;
          animation: inkDrop 3s ease-out forwards;
        }
        .ink-drop:nth-child(2) {
          width: 200px;
          height: 200px;
          bottom: 10%;
          left: 5%;
          background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M100,20 C150,20 170,60 180,100 C190,140 170,170 110,180 C50,190 20,150 20,100 C20,50 50,20 100,20 Z' fill='rgba(20, 20, 20, 0.02)' /%3E%3C/svg%3E");
          animation-delay: 0.5s;
          opacity: 0;
          animation: inkDrop 3s ease-out forwards;
        }
        .ink-drop:nth-child(3) {
          width: 300px;
          height: 300px;
          top: 40%;
          left: -5%;
          background-image: url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M150,30 C200,30 250,80 270,150 C280,220 250,260 150,270 C50,280 20,220 30,150 C40,80 100,30 150,30 Z' fill='rgba(20, 20, 20, 0.015)' /%3E%3C/svg%3E");
          animation-delay: 0.8s;
          opacity: 0;
          animation: inkDrop 3s ease-out forwards;
        }
        
        /* 墨迹笔触 */
        .ink-stroke {
          position: absolute;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          stroke: rgba(20, 20, 20, 0.1);
          fill: none;
          z-index: 0;
        }
      `,
        }}
      />

      <div className="mx-auto max-w-screen-xl px-6 sm:px-10 md:px-16 lg:px-20">
        <div
          className={`text-center mb-12 opacity-0 ${
            animate ? "animate-float-up" : ""
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-center mb-3">
            {/* 左侧硅原元素 - 水墨风格的电路 */}
            <div className="relative w-12 h-12 mr-6">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-circuit-blink"
              >
                {/* 电路板轮廓 */}
                <rect
                  x="4"
                  y="4"
                  width="40"
                  height="40"
                  rx="2"
                  stroke="#505050"
                  strokeWidth="1.5"
                  fill="none"
                  className="animate-circuit-pulse"
                  style={{ animationDelay: "0.2s" }}
                />

                {/* CPU/芯片 */}
                <rect
                  x="16"
                  y="16"
                  width="16"
                  height="16"
                  rx="1"
                  stroke="#606060"
                  strokeWidth="1"
                  fill="none"
                />

                {/* 芯片引脚 */}
                <line
                  x1="16"
                  y1="20"
                  x2="12"
                  y2="20"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                />
                <line
                  x1="16"
                  y1="24"
                  x2="12"
                  y2="24"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.2s" }}
                />
                <line
                  x1="16"
                  y1="28"
                  x2="12"
                  y2="28"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.4s" }}
                />

                <line
                  x1="32"
                  y1="20"
                  x2="36"
                  y2="20"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.3s" }}
                />
                <line
                  x1="32"
                  y1="24"
                  x2="36"
                  y2="24"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.5s" }}
                />
                <line
                  x1="32"
                  y1="28"
                  x2="36"
                  y2="28"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.7s" }}
                />

                <line
                  x1="20"
                  y1="16"
                  x2="20"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.1s" }}
                />
                <line
                  x1="24"
                  y1="16"
                  x2="24"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.6s" }}
                />
                <line
                  x1="28"
                  y1="16"
                  x2="28"
                  y2="12"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.3s" }}
                />

                <line
                  x1="20"
                  y1="32"
                  x2="20"
                  y2="36"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.5s" }}
                />
                <line
                  x1="24"
                  y1="32"
                  x2="24"
                  y2="36"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.2s" }}
                />
                <line
                  x1="28"
                  y1="32"
                  x2="28"
                  y2="36"
                  stroke="#606060"
                  strokeWidth="1"
                  className="animate-data-flow"
                  style={{ animationDelay: "0.4s" }}
                />

                {/* LED灯 */}
                <circle
                  cx="8"
                  cy="8"
                  r="2"
                  fill="#2A9D8F"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.2s" }}
                />
                <circle
                  cx="40"
                  cy="8"
                  r="2"
                  fill="#90BE6D"
                  className="animate-led-blink"
                  style={{ animationDelay: "0.8s" }}
                />
                <circle
                  cx="40"
                  cy="40"
                  r="2"
                  fill="#43AA8B"
                  className="animate-led-blink"
                  style={{ animationDelay: "1.5s" }}
                />
                <circle
                  cx="8"
                  cy="40"
                  r="2"
                  fill="#A7CC8E"
                  className="animate-led-blink"
                  style={{ animationDelay: "1s" }}
                />

                {/* 数据流位置标记 - 分类标识 */}
                <text
                  x="24"
                  y="24"
                  fill="#505050"
                  fontSize="4"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  Cat
                </text>
              </svg>
            </div>
            <h1
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] inline-block relative"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
            >
              文章分类统计
              <span className="absolute -top-4 -right-6 text-sm font-normal text-[#9D4EDD] dark:text-[#b0b0b0]">
                硅原游牧
              </span>
            </h1>

            {/* 右侧云端元素 - 更改为水墨风格的云 */}
            <div className="relative w-16 h-12 ml-6 animate-cloud">
              <svg
                width="72"
                height="56"
                viewBox="0 0 64 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20,32 C12,32 8,26 8,20 C8,14 14,10 20,12 C22,6 30,6 34,10 C38,4 50,8 48,16 C54,18 56,28 50,32 C46,38 28,36 20,32 Z"
                  fill="url(#cloud-gradient)"
                  style={{ filter: "blur(1px)" }}
                />

                {/* 竹笛元素 - 更新为绿色竹萧 */}
                {/* 竹萧主体 - 绿色渐变 */}
                <rect
                  x="31.5"
                  y="16"
                  width="3.5"
                  height="26"
                  rx="1.75"
                  fill="url(#flute-gradient)"
                />

                {/* 竹节 */}
                <rect x="31.5" y="21" width="3.5" height="1" fill="#3a5a40" />
                <rect x="31.5" y="28" width="3.5" height="1" fill="#3a5a40" />
                <rect x="31.5" y="35" width="3.5" height="1" fill="#3a5a40" />

                {/* 吹奏口 */}
                <circle cx="33.25" cy="16" r="2" fill="#3a5a40" />

                {/* 代码音符 */}
                <path
                  d="M26,19 L23,21 L26,23"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.2s" }}
                />
                <path
                  d="M40,18 L43,20 L40,22"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.5s" }}
                />
                <path
                  d="M27,27 C24,27 24,30 24,30"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.3s" }}
                />
                <path
                  d="M39,26 L42,26 L42,29"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.7s" }}
                />

                <defs>
                  <linearGradient
                    id="cloud-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#808080" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a0a0a0" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient
                    id="flute-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#588157" />
                    <stop offset="100%" stopColor="#a3b18a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-[#606060] dark:text-[#b0b0b0] mt-2 max-w-lg mx-auto relative z-10 font-medium text-sm">
              在数字硅原中漫游，用代码吟诵云端之歌
            </p>
            <div
              className="relative ml-2 animate-bamboo-sway"
              style={{ transformOrigin: "bottom center" }}
            >
              <svg
                width="42"
                height="42"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 竹萧主体 - 绿色渐变 */}
                <rect
                  x="14"
                  y="4"
                  width="4"
                  height="24"
                  rx="2"
                  fill="url(#bamboo-gradient)"
                />

                {/* 竹节 */}
                <rect x="14" y="8" width="4" height="1" fill="#3a5a40" />
                <rect x="14" y="14" width="4" height="1" fill="#3a5a40" />
                <rect x="14" y="20" width="4" height="1" fill="#3a5a40" />

                {/* 吹奏口 */}
                <circle cx="16" cy="4" r="2" fill="#3a5a40" />

                {/* 代码音符 - { } */}
                <path
                  d="M10,10 C8,10 8,12 8,12 L8,13"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.1s" }}
                />
                <path
                  d="M10,14 C8,14 8,16 8,16 L8,17"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.3s" }}
                />

                {/* 代码音符 - [ ] */}
                <path
                  d="M22,8 L22,10 L24,10"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.5s" }}
                />
                <path
                  d="M22,12 L22,14 L24,14"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.7s" }}
                />

                {/* 代码音符 - < > */}
                <path
                  d="M11,18 L9,20 L11,22"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.2s" }}
                />
                <path
                  d="M21,18 L23,20 L21,22"
                  stroke="#4a7856"
                  strokeWidth="1"
                  className="animate-float"
                  style={{ animationDelay: "0.4s" }}
                />

                {/* 渐变定义 */}
                <defs>
                  <linearGradient
                    id="bamboo-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#588157" />
                    <stop offset="100%" stopColor="#a3b18a" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-6 md:p-8 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 ${
            animate ? "animate-scale-in" : ""
          }`}
          style={{
            animationDelay: "0.3s",
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.05), 0 0 20px rgba(0, 0, 0, 0.03)",
            border: "1px solid rgba(150, 150, 150, 0.1)",
          }}
        >
          {/* 水墨效果 - 新风格 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 墨点和墨痕 */}
            <div className="ink-drop"></div>
            <div className="ink-drop"></div>
            <div className="ink-drop"></div>

            {/* 电路板图案元素 */}
            <svg
              width="100%"
              height="100%"
              className="absolute inset-0 pointer-events-none"
            >
              {/* 电路轨道 */}
              <path
                d="M0,100 H300 M300,100 V250 M300,250 H150 M150,250 V350 M150,350 H400 M400,350 V200 M400,200 H600"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,2"
                className="animate-data-flow"
                style={{ animationDelay: "0.5s", opacity: 0.2 }}
              />
              <path
                d="M0,300 H100 M100,300 V150 M100,150 H200 M200,150 V50 M200,50 H450 M450,50 V150 M450,150 H600"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,2"
                className="animate-data-flow"
                style={{ animationDelay: "1s", opacity: 0.2 }}
              />
              <path
                d="M50,0 V150 M50,150 H250 M250,150 V300 M250,300 H400 M400,300 V200 M400,200 H600"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4,2"
                className="animate-data-flow"
                style={{ animationDelay: "1.5s", opacity: 0.2 }}
              />

              {/* 电阻元件 */}
              <rect
                x="175"
                y="98"
                width="25"
                height="8"
                fill="#505050"
                fillOpacity="0.2"
              />
              <rect
                x="375"
                y="348"
                width="25"
                height="8"
                fill="#505050"
                fillOpacity="0.2"
                transform="rotate(-90 375 348)"
              />

              {/* 电容元件 */}
              <line
                x1="98"
                y1="275"
                x2="98"
                y2="285"
                stroke="#505050"
                strokeWidth="3"
                strokeOpacity="0.2"
              />
              <line
                x1="102"
                y1="275"
                x2="102"
                y2="285"
                stroke="#505050"
                strokeWidth="3"
                strokeOpacity="0.2"
              />
              <line
                x1="248"
                y1="175"
                x2="258"
                y2="175"
                stroke="#505050"
                strokeWidth="3"
                strokeOpacity="0.2"
              />
              <line
                x1="248"
                y1="179"
                x2="258"
                y2="179"
                stroke="#505050"
                strokeWidth="3"
                strokeOpacity="0.2"
              />

              {/* 集成电路/芯片 */}
              <rect
                x="425"
                y="75"
                width="50"
                height="30"
                rx="2"
                stroke="#505050"
                strokeWidth="1"
                fill="none"
                strokeOpacity="0.2"
              />
              <line
                x1="435"
                y1="75"
                x2="435"
                y2="105"
                stroke="#505050"
                strokeWidth="1"
                strokeOpacity="0.2"
              />
              <line
                x1="445"
                y1="75"
                x2="445"
                y2="105"
                stroke="#505050"
                strokeWidth="1"
                strokeOpacity="0.2"
              />
              <line
                x1="455"
                y1="75"
                x2="455"
                y2="105"
                stroke="#505050"
                strokeWidth="1"
                strokeOpacity="0.2"
              />
              <line
                x1="465"
                y1="75"
                x2="465"
                y2="105"
                stroke="#505050"
                strokeWidth="1"
                strokeOpacity="0.2"
              />

              {/* LED指示灯 */}
              <circle
                cx="250"
                cy="300"
                r="4"
                fill="#2A9D8F"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "0.2s" }}
              />
              <circle
                cx="200"
                cy="50"
                r="4"
                fill="#90BE6D"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "0.8s" }}
              />
              <circle
                cx="400"
                cy="200"
                r="4"
                fill="#43AA8B"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "1.2s" }}
              />
              <circle
                cx="150"
                cy="350"
                r="4"
                fill="#A7CC8E"
                fillOpacity="0.2"
                className="animate-led-blink"
                style={{ animationDelay: "1.6s" }}
              />

              {/* 墨笔触 */}
              <path
                d="M50,50 C100,20 200,80 300,40 C400,10 500,50 600,30"
                className="ink-stroke"
                style={{ animationDelay: "0.5s" }}
              />
              <path
                d="M10,200 C150,150 250,250 350,180 C450,120 550,180 650,150"
                className="ink-stroke"
                style={{ animationDelay: "1s" }}
              />
              <path
                d="M700,350 C600,300 500,400 400,350 C300,300 200,380 100,320"
                className="ink-stroke"
                style={{ animationDelay: "1.5s" }}
              />
            </svg>

            {/* 墨滴粒子 */}
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>

          {/* 装饰性线条 - 水墨风格 */}
          <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>

          <div
            ref={chartRef}
            className="w-full h-[450px] relative z-10"
            onMouseMove={handleMouseMove}
          >
            {/* SVG渐变定义 */}
            <svg style={{ width: 0, height: 0, position: "absolute" }}>
              {renderGradients()}
            </svg>

            {/* 动态跟随鼠标的提示框 */}
            <CategoryCard />

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {/* 整体阴影效果 */}
                  <filter
                    id="pie-shadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="6"
                      floodColor="rgba(0,0,0,0.2)"
                    />
                  </filter>
                </defs>
                <Pie
                  data={visibleCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  activeIndex={activeIndex === null ? undefined : activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => {
                    // 延迟一点点时间，避免在扇形之间移动时闪烁
                    setTimeout(() => {
                      if (!hoveredCategory) {
                        setShowCategoryCard(false);
                        setActiveIndex(null);
                      }
                    }, 50);
                  }}
                  animationBegin={300}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  filter="url(#pie-shadow)"
                >
                  {visibleCategoryData.map((entry, index) => {
                    // 查找完整分类数据获取渐变ID
                    const categoryIndex = categories.findIndex(
                      (c) => c.name === entry.name
                    );
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#gradient-${categoryIndex})`}
                        className="transition-all duration-300"
                        filter={`url(#shadow-${categoryIndex})`}
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* 中央文字 - 水墨风格 */}
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center opacity-0 animate-rotate-in"
              style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* 电路板元素背景 */}
                <svg
                  width="128"
                  height="128"
                  viewBox="0 0 128 128"
                  className="absolute inset-0"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* 内圆电路板 */}
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="40"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                    fill="none"
                    strokeDasharray="2,2"
                    className="animate-spin"
                    style={{ animationDuration: "30s" }}
                  />

                  {/* 电路板轨道 */}
                  <path
                    d="M5,64 H40 M88,64 H123 M64,5 V40 M64,88 V123"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeDasharray="4,2"
                    strokeOpacity="0.3"
                    className="animate-data-flow"
                  />

                  {/* 芯片 */}
                  <rect
                    x="52"
                    y="52"
                    width="24"
                    height="24"
                    rx="2"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                    fill="none"
                  />

                  {/* 芯片引脚 */}
                  <line
                    x1="52"
                    y1="58"
                    x2="48"
                    y2="58"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="52"
                    y1="64"
                    x2="48"
                    y2="64"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="52"
                    y1="70"
                    x2="48"
                    y2="70"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />

                  <line
                    x1="76"
                    y1="58"
                    x2="80"
                    y2="58"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="76"
                    y1="64"
                    x2="80"
                    y2="64"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="76"
                    y1="70"
                    x2="80"
                    y2="70"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />

                  <line
                    x1="58"
                    y1="52"
                    x2="58"
                    y2="48"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="64"
                    y1="52"
                    x2="64"
                    y2="48"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="70"
                    y1="52"
                    x2="70"
                    y2="48"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />

                  <line
                    x1="58"
                    y1="76"
                    x2="58"
                    y2="80"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="64"
                    y1="76"
                    x2="64"
                    y2="80"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <line
                    x1="70"
                    y1="76"
                    x2="70"
                    y2="80"
                    stroke="#505050"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />

                  {/* LED指示灯 */}
                  <circle
                    cx="32"
                    cy="32"
                    r="2"
                    fill="#2A9D8F"
                    fillOpacity="0.3"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <circle
                    cx="96"
                    cy="32"
                    r="2"
                    fill="#90BE6D"
                    fillOpacity="0.3"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="2"
                    fill="#43AA8B"
                    fillOpacity="0.3"
                    className="animate-led-blink"
                    style={{ animationDelay: "0.8s" }}
                  />
                  <circle
                    cx="32"
                    cy="96"
                    r="2"
                    fill="#A7CC8E"
                    fillOpacity="0.3"
                    className="animate-led-blink"
                    style={{ animationDelay: "1.1s" }}
                  />
                </svg>

                <div className="z-10">
                  <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    总文章数
                  </div>
                  <div className="text-3xl font-bold text-[#505050] dark:text-[#e0e0e0]">
                    {categories.reduce((sum, cat) => sum + cat.count, 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部分类标签列表 - 水墨风格 */}
          <div
            className={`flex flex-wrap justify-center gap-3 mt-8 opacity-0 ${
              animate ? "animate-float-up" : ""
            }`}
            style={{ animationDelay: "0.5s" }}
          >
            {categories.map((category, index) => {
              const isVisible = visibleCategories.includes(category.name);
              const isActive =
                activeIndex !== null &&
                visibleCategoryData[activeIndex]?.name === category.name;

              // 渲染分类的SVG图标
              const renderCategoryIcon = (categoryName: string) => {
                switch (categoryName) {
                  case "嵌入式学习":
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-circuit-pulse"
                        style={{ animationDelay: "0.2s" }}
                      >
                        <rect
                          x="4"
                          y="4"
                          width="16"
                          height="16"
                          rx="2"
                          ry="2"
                        ></rect>
                        <rect x="9" y="9" width="6" height="6"></rect>
                        <line x1="9" y1="2" x2="9" y2="4"></line>
                        <line x1="15" y1="2" x2="15" y2="4"></line>
                        <line x1="9" y1="20" x2="9" y2="22"></line>
                        <line x1="15" y1="20" x2="15" y2="22"></line>
                        <line x1="20" y1="9" x2="22" y2="9"></line>
                        <line x1="20" y1="14" x2="22" y2="14"></line>
                        <line x1="2" y1="9" x2="4" y2="9"></line>
                        <line x1="2" y1="14" x2="4" y2="14"></line>
                      </svg>
                    );
                  case "web开发":
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-cloud"
                        style={{ animationDuration: "10s" }}
                      >
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
                      </svg>
                    );
                  case "算法":
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      >
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                    );
                  case "音乐":
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-float"
                        style={{ animationDelay: "0.4s" }}
                      >
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                      </svg>
                    );
                  case "平面设计":
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-float"
                        style={{ animationDelay: "0.6s" }}
                      >
                        <circle cx="13.5" cy="6.5" r="2.5"></circle>
                        <circle cx="17.5" cy="10.5" r="2.5"></circle>
                        <circle cx="8.5" cy="7.5" r="2.5"></circle>
                        <circle cx="6.5" cy="12.5" r="2.5"></circle>
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                      </svg>
                    );
                  case "漫画":
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-led-blink"
                        style={{ animationDelay: "0.5s" }}
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    );
                  case "动漫":
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-pulse"
                        style={{ animationDuration: "1.5s" }}
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="2.18"
                          ry="2.18"
                        ></rect>
                        <line x1="7" y1="2" x2="7" y2="22"></line>
                        <line x1="17" y1="2" x2="17" y2="22"></line>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <line x1="2" y1="7" x2="7" y2="7"></line>
                        <line x1="2" y1="17" x2="7" y2="17"></line>
                        <line x1="17" y1="17" x2="22" y2="17"></line>
                        <line x1="17" y1="7" x2="22" y2="7"></line>
                      </svg>
                    );
                  default:
                    return (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-spin"
                        style={{ animationDuration: "15s" }}
                      >
                        <path d="M12 2v8"></path>
                        <path d="M18.4 6.6 17 8"></path>
                        <path d="M6 12h12"></path>
                        <path d="M17 16l1.4 1.4"></path>
                        <path d="M12 22v-8"></path>
                        <path d="M5.6 6.6 7 8"></path>
                        <path d="M7 16l-1.4 1.4"></path>
                      </svg>
                    );
                }
              };

              return (
                <div
                  key={`tag-${index}`}
                  className={`cursor-target flex items-center px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 transform ${
                    isActive ? "scale-110 translate-y-[-4px]" : ""
                  } ${isVisible ? "hover:shadow-lg" : ""}`}
                  style={{
                    background: isVisible
                      ? `rgba(80, 80, 80, 0.05)`
                      : "#e0e0e0",
                    border: isVisible
                      ? `1px solid rgba(80, 80, 80, 0.2)`
                      : "1px solid #ccc",
                    boxShadow: isActive
                      ? `0 4px 15px rgba(0, 0, 0, 0.1)`
                      : isVisible
                      ? `0 2px 8px rgba(0, 0, 0, 0.05)`
                      : "none",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onClick={() => toggleCategoryVisibility(category.name)}
                  onMouseEnter={() => {
                    const categoryIndex = visibleCategoryData.findIndex(
                      (cat) => cat.name === category.name
                    );
                    if (categoryIndex !== -1) {
                      setActiveIndex(categoryIndex);
                      setHoveredCategory(category.name);
                    }
                  }}
                >
                  {/* 微型电路背景 */}
                  {isVisible && (
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 100 40"
                        className="absolute inset-0"
                      >
                        <path
                          d="M0,20 H100"
                          stroke={category.color}
                          strokeWidth="0.5"
                          strokeOpacity="0.2"
                          strokeDasharray="3,2"
                          className="animate-data-flow"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        />
                        <circle
                          cx="10"
                          cy="20"
                          r="2"
                          fill={category.color}
                          fillOpacity="0.2"
                          className="animate-led-blink"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        />
                        <circle
                          cx="90"
                          cy="20"
                          r="2"
                          fill={category.color}
                          fillOpacity="0.2"
                          className="animate-led-blink"
                          style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                        />
                      </svg>
                    </div>
                  )}

                  <div
                    className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center transition-transform duration-300 ${
                      isActive ? "scale-110" : ""
                    }`}
                    style={{
                      background: "#42AB98",
                      boxShadow: isVisible
                        ? `0 2px 5px rgba(0, 0, 0, 0.1)`
                        : "none",
                    }}
                  >
                    <div className="text-white">
                      {renderCategoryIcon(category.name)}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm transition-colors duration-300 leading-tight ${
                        isVisible ? "font-medium" : "text-gray-500"
                      }`}
                      style={{
                        color: isVisible ? "#505050" : undefined,
                        textShadow: isActive
                          ? `0 0 8px rgba(0, 0, 0, 0.1)`
                          : "none",
                      }}
                    >
                      {category.name}
                    </span>
                    <span
                      className={`text-xs font-mono transition-colors duration-300 leading-tight ${
                        isVisible ? "" : "text-gray-400"
                      }`}
                      style={{
                        color: isVisible ? "#707070" : undefined,
                      }}
                    >
                      {category.count} ({category.percentage})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部提示 - 水墨风格 */}
        <div
          className={`text-center mt-6 text-sm text-gray-500 dark:text-gray-400 opacity-0 ${
            animate ? "animate-float-up" : ""
          }`}
          style={{ animationDelay: "0.7s" }}
        >
          点击标签可切换分类显示状态 · 鼠标悬停查看详情
        </div>
      </div>
    </div>
  );
};

export default Categories;
