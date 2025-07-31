"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface HeadingData {
  id: string;
  text: string;
  level: number;
  element: HTMLElement; // 移除可选标记，因为在创建时总是会有element
  parentId?: string; // 父标题ID
  children?: string[]; // 子标题ID数组
}

interface TableOfContentsProps {
  contentRef?: React.RefObject<HTMLElement>;
}

export const TableOfContents = ({ contentRef }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const tocContainerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // 建立标题的层级关系
  const buildHeadingHierarchy = (headingsList: HeadingData[]) => {
    const hierarchyHeadings: HeadingData[] = [];
    const stack: HeadingData[] = [];

    headingsList.forEach((heading) => {
      // 清空children数组
      heading.children = [];

      // 找到合适的父级标题
      while (
        stack.length > 0 &&
        stack[stack.length - 1].level >= heading.level
      ) {
        stack.pop();
      }

      // 如果有父级标题，建立关系
      if (stack.length > 0) {
        const parent = stack[stack.length - 1];
        heading.parentId = parent.id;
        parent.children = parent.children || [];
        parent.children.push(heading.id);
      }

      hierarchyHeadings.push(heading);
      stack.push(heading);
    });

    return hierarchyHeadings;
  };

  // 获取所有需要展开的section
  const getExpandedSections = (
    activeHeadingId: string,
    headingsList: HeadingData[]
  ): Set<string> => {
    const expanded = new Set<string>();
    const activeHeading = headingsList.find((h) => h.id === activeHeadingId);

    if (!activeHeading) return expanded;

    // 展开当前标题的路径上的所有父级
    let current: HeadingData | undefined = activeHeading;
    while (current) {
      expanded.add(current.id);
      if (current.parentId) {
        current = headingsList.find((h) => h.id === current!.parentId);
      } else {
        current = undefined;
      }
    }

    // 如果当前是父级标题，也展开其子标题
    if (activeHeading.children && activeHeading.children.length > 0) {
      activeHeading.children.forEach((childId) => {
        expanded.add(childId);
      });
    }

    return expanded;
  };

  // 判断标题是否应该显示
  const shouldShowHeading = (heading: HeadingData): boolean => {
    // 根级标题总是显示
    if (!heading.parentId) {
      return true;
    }

    // 检查父级是否展开
    const parentExpanded = expandedSections.has(heading.parentId);
    return parentExpanded;
  };

  // 提取文章标题的函数
  const extractHeadings = useCallback(() => {
    // 只从文章内容容器中查找标题，排除留言板等其他区域
    const articleContent = document.getElementById("article-content");
    if (!articleContent) return;

    const headingElements = articleContent.querySelectorAll(
      "h1, h2, h3, h4, h5, h6"
    );

    const headingsList: HeadingData[] = Array.from(headingElements)
      .map((heading, index) => {
        const element = heading as HTMLElement;

        // 排除留言板相关的标题
        if (
          element.textContent?.includes("留言板") ||
          element.closest('[id*="comment"]') ||
          element.closest(".twikoo") ||
          element.closest('[class*="comment"]')
        ) {
          return null;
        }

        const text = element.textContent?.trim() || "";
        if (text.length === 0) {
          return null;
        }

        const id = element.id || `heading-${index}`;

        // 如果没有id，为元素添加id
        if (!element.id) {
          element.id = id;
        }

        return {
          id,
          text,
          level: parseInt(element.tagName.charAt(1)),
          element, // element 现在总是存在的
        };
      })
      .filter((heading): heading is HeadingData => {
        return heading !== null;
      });

    // 建立层级关系
    const hierarchyHeadings = buildHeadingHierarchy(headingsList);
    setHeadings(hierarchyHeadings);

    // 如果还没有激活的标题，设置第一个为激活状态
    if (hierarchyHeadings.length > 0 && !activeId) {
      setActiveId(hierarchyHeadings[0].id);
    }
  }, [activeId]);

  useEffect(() => {
    // 监听滚动事件，高亮当前可见的标题
    const handleScroll = () => {
      if (headings.length === 0) return;

      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      // 找到当前最合适的标题
      let activeHeading = headings[0].id; // 默认为第一个标题

      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        // 现在element总是存在的，不需要检查
        const rect = heading.element.getBoundingClientRect();
        const elementTop = rect.top + scrollTop;

        // 如果标题在视口中间位置上方，则认为是当前标题
        if (elementTop <= scrollTop + viewportHeight / 3) {
          activeHeading = heading.id;
        }
      }

      setActiveId(activeHeading);
    };

    // 延迟执行，确保DOM已渲染完成
    const timer = setTimeout(() => {
      extractHeadings();
    }, 500);

    // 添加滚动监听
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 监听DOM变化，当内容更新时重新提取标题
    const observer = new MutationObserver(() => {
      setTimeout(extractHeadings, 300);
    });

    const articleContent = document.getElementById("article-content");
    if (articleContent) {
      observer.observe(articleContent, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [extractHeadings, headings]); // 添加依赖

  // 当activeId改变时，更新展开状态
  useEffect(() => {
    if (activeId && headings.length > 0) {
      const newExpandedSections = getExpandedSections(activeId, headings);
      setExpandedSections(newExpandedSections);
    }
  }, [activeId, headings]);

  // 当activeId改变时，自动滚动目录到对应位置
  useEffect(() => {
    if (activeId && activeButtonRef.current && tocContainerRef.current) {
      const container = tocContainerRef.current;
      const activeButton = activeButtonRef.current;

      // 计算需要滚动的位置
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // 计算相对位置
      const relativeTop = buttonRect.top - containerRect.top;
      const containerHeight = container.clientHeight;
      const buttonHeight = activeButton.offsetHeight;

      // 目标位置：让激活的按钮显示在容器中央
      const targetScrollTop =
        container.scrollTop +
        relativeTop -
        containerHeight / 2 +
        buttonHeight / 2;

      // 平滑滚动到目标位置
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }
  }, [activeId]);

  // 点击目录项跳转到对应标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 120; // 留出120px的顶部间距
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      // 立即更新激活状态
      setActiveId(id);
    }
  };

  // 手动切换展开状态
  const toggleSection = (headingId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpanded = new Set(expandedSections);

    if (newExpanded.has(headingId)) {
      // 收起：移除当前项和所有子项
      const heading = headings.find((h) => h.id === headingId);
      if (heading?.children) {
        heading.children.forEach((childId) => {
          newExpanded.delete(childId);
        });
      }
      newExpanded.delete(headingId);
    } else {
      // 展开：添加当前项和所有直接子项
      newExpanded.add(headingId);
      const heading = headings.find((h) => h.id === headingId);
      if (heading?.children) {
        heading.children.forEach((childId) => {
          newExpanded.add(childId);
        });
      }
    }

    setExpandedSections(newExpanded);
  };

  // 处理键盘事件
  const handleKeyDown = (headingId: string, event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSection(headingId, event as unknown as React.MouseEvent);
    }
  };

  // 消除 contentRef 未使用的警告
  if (contentRef) {
    // contentRef 被引用但不实际使用
  }

  if (headings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-8 md:p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in sticky top-60">
        {/* 渐变背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] opacity-5"></div>

        {/* 顶部渐变装饰条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470]"></div>

        <div className="flex items-center mb-6 relative z-10">
          <div className="w-8 h-8 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] rounded-lg flex items-center justify-center mr-3 shadow-md">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            文章目录
          </h3>
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm italic text-center py-8 relative z-10">
          正在加载目录...
        </div>

        {/* 装饰性元素 */}
        <div className="absolute top-10 right-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-500 p-8 md:p-12 relative backdrop-blur-sm bg-opacity-60 dark:bg-opacity-40 opacity-0 animate-scale-in sticky top-60">
      {/* 渐变背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] opacity-5"></div>

      {/* 装饰性线条 */}
      <div className="absolute top-10 right-10 w-20 h-20 border-t border-l border-gray-300 dark:border-gray-600 opacity-30 rounded-tl-lg"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-r border-gray-300 dark:border-gray-600 opacity-30 rounded-br-lg"></div>

      <div className="flex items-center mb-6 relative z-10">
        <div className="w-8 h-8 bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] rounded-lg flex items-center justify-center mr-3 shadow-md">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          文章目录
        </h3>
      </div>

      {/* 目录列表容器 - 隐藏滚动条 */}
      <div
        ref={tocContainerRef}
        className="space-y-1 max-h-96 overflow-y-auto table-of-contents-scroll relative z-10"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* 添加CSS样式来隐藏webkit浏览器的滚动条 */}
        <style>{`
          .table-of-contents-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const isVisible = shouldShowHeading(heading);
          const hasChildren = heading.children && heading.children.length > 0;
          const isExpanded = expandedSections.has(heading.id);

          if (!isVisible) {
            return null;
          }

          return (
            <div
              key={heading.id}
              className={`transition-all duration-300 ease-in-out ${
                isVisible
                  ? "opacity-100 max-h-20"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <button
                ref={isActive ? activeButtonRef : null}
                onClick={() => scrollToHeading(heading.id)}
                className={`cursor-target w-full text-left py-2 px-3 rounded-lg transition-all duration-300 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-[#56CFE1]/20 to-[#9D4EDD]/20 dark:from-[#56CFE1]/20 dark:to-[#FF9470]/20 text-gray-800 dark:text-white font-medium transform scale-105 shadow-md border border-gray-200 dark:border-gray-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
                style={{
                  paddingLeft: `${
                    Math.max(heading.level - 1, 0) * 12 + (hasChildren ? 8 : 16)
                  }px`,
                  fontSize: isActive ? "15px" : "14px",
                  filter: isActive ? "none" : "blur(0.3px)",
                  opacity: isActive ? 1 : 0.8,
                }}
              >
                {/* 激活状态的左侧指示条 */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] rounded-r-full shadow-sm"></div>
                )}

                <div className="flex items-center">
                  {/* 展开/折叠按钮 */}
                  {hasChildren && (
                    <div
                      onClick={(e) => toggleSection(heading.id, e)}
                      className={`mr-2 p-1 rounded transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer ${
                        isActive
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(heading.id, e)}
                      aria-label={`${isExpanded ? "折叠" : "展开"}${
                        heading.text
                      }`}
                    >
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}

                  <span
                    className={`line-clamp-2 flex-1 transition-all duration-300 ${
                      isActive ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {heading.text}
                  </span>

                  {/* 激活状态的右侧箭头 */}
                  {isActive && (
                    <svg
                      className="w-4 h-4 ml-2 opacity-70 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <defs>
                        <linearGradient
                          id="arrowGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#56CFE1" />
                          <stop offset="100%" stopColor="#9D4EDD" />
                        </linearGradient>
                      </defs>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                        stroke="url(#arrowGradient)"
                      />
                    </svg>
                  )}
                </div>

                {/* 悬停效果 */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#56CFE1]/0 to-[#9D4EDD]/0 dark:from-[#56CFE1]/0 dark:to-[#FF9470]/0 group-hover:from-[#56CFE1]/5 group-hover:to-[#9D4EDD]/5 dark:group-hover:from-[#56CFE1]/5 dark:group-hover:to-[#FF9470]/5 rounded-lg transition-all duration-300"></div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 底部统计信息 */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 relative z-10">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>共 {headings.length} 个标题</span>
          <div className="flex items-center space-x-1">
            <span>{headings.filter((h) => h.level === 1).length} 章节</span>
            <span>·</span>
            <span>{headings.filter((h) => h.level === 2).length} 小节</span>
          </div>
        </div>

        {/* 进度指示器 */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] transition-all duration-300 ease-out rounded-full shadow-sm"
              style={{
                width: `${
                  headings.length > 0
                    ? ((headings.findIndex((h) => h.id === activeId) + 1) /
                        headings.length) *
                      100
                    : 0
                }%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>开始</span>
            <span className="bg-gradient-to-r from-[#56CFE1] to-[#9D4EDD] dark:from-[#56CFE1] dark:to-[#FF9470] bg-clip-text text-transparent font-medium">
              {headings.findIndex((h) => h.id === activeId) + 1} /{" "}
              {headings.length}
            </span>
            <span>结束</span>
          </div>
        </div>
      </div>

      {/* 装饰性背景图案 */}
      <div className="absolute top-4 right-4 w-16 h-16 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="20" cy="20" r="2" className="fill-[#56CFE1]">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="50"
            cy="30"
            r="1.5"
            className="fill-[#9D4EDD] dark:fill-[#FF9470]"
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="80" cy="50" r="1" className="fill-[#56CFE1]">
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
};
