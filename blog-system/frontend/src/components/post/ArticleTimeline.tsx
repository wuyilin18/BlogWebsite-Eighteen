"use client";

import { TracingBeam } from "@/components/AceternityUI/tracing-beam";

interface ArticleTimelineProps {
  children: React.ReactNode;
}

export const ArticleTimeline = ({ children }: ArticleTimelineProps) => {
  return (
    <div className="relative">
      <TracingBeam className="px-0">
        <div className="max-w-none antialiased relative">{children}</div>
      </TracingBeam>
    </div>
  );
};
