"use client";

import React, { createContext, useRef, useState, useEffect } from "react";
import { useMouseState } from "./useMouseState";

// Create context for the mouse state
export const MouseStateContext = createContext<ReturnType<
  typeof useMouseState
> | null>(null);

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  rotationFactor?: number;
  perspective?: number;
  dampingFactor?: number;
}

export default function CardContainer({
  children,
  className = "",
  containerClassName = "",
  rotationFactor = 15, // Lower value = more rotation
  perspective = 1200, // Higher value = less extreme perspective
  dampingFactor = 0.9, // Higher value = smoother but slower transitions
}: CardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseState = useMouseState();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Animation loop for smooth transitions
  useEffect(() => {
    const animateRotation = () => {
      if (!containerRef.current) return;

      // Smooth transition using damping
      setRotation((prev) => ({
        x: prev.x + (targetRotation.x - prev.x) * (1 - dampingFactor),
        y: prev.y + (targetRotation.y - prev.y) * (1 - dampingFactor),
      }));

      containerRef.current.style.transform = `rotateY(${rotation.x}deg) rotateX(${rotation.y}deg)`;

      rafRef.current = requestAnimationFrame(animateRotation);
    };

    rafRef.current = requestAnimationFrame(animateRotation);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetRotation, dampingFactor, rotation]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    // Calculate cursor position relative to the center of the element
    const x = (e.clientX - left - width / 2) / rotationFactor;
    const y = (e.clientY - top - height / 2) / rotationFactor;

    // Update target rotation - using negative y for natural rotation direction
    setTargetRotation({ x, y: -y });
  }

  function handleMouseEnter() {
    mouseState.setMouseEntered(true);
  }

  function handleMouseLeave() {
    if (!containerRef.current) return;
    mouseState.setMouseEntered(false);

    // Smoothly reset to default position
    setTargetRotation({ x: 0, y: 0 });
  }

  return (
    <MouseStateContext.Provider value={mouseState}>
      <div
        className={`flex items-center justify-center p-2 ${containerClassName}`}
        style={{ perspective: `${perspective}px` }}
      >
        <div
          ref={containerRef}
          className={`relative flex items-center justify-center will-change-transform ${className}`}
          style={{ transformStyle: "preserve-3d" }}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </div>
    </MouseStateContext.Provider>
  );
}
