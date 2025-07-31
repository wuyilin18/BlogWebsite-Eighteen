"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  transitionDuration?: number;
}

export default function CardBody({
  children,
  className,
  transitionDuration = 200,
}: CardBodyProps) {
  return (
    <div
      className={cn("h-96 w-96", className)}
      style={{
        transformStyle: "preserve-3d",
        transition: `box-shadow ${transitionDuration}ms ease-out`,
        willChange: "transform, box-shadow",
      }}
    >
      {children}
    </div>
  );
}
