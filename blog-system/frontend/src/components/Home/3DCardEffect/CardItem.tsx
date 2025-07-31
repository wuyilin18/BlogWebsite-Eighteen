"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MouseStateContext } from "./CardContainer";

interface CardItemProps {
  children: React.ReactNode;
  className?: string;
  as?:
    | "div"
    | "a"
    | "button"
    | "p"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "span";
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  springFactor?: number;
  href?: string;
  target?: string;
  onClick?: () => void;
}

export default function CardItem({
  children,
  className,
  as = "div",
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  springFactor = 0.15, // Controls spring physics (higher = faster, but less smooth)
  ...props
}: CardItemProps) {
  const elementRef = useRef<HTMLElement>(null);
  const mouseState = useContext(MouseStateContext);
  const [currentTransform, setCurrentTransform] = useState({
    x: 0,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
  });
  const [targetTransform, setTargetTransform] = useState({
    x: 0,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
  });
  const rafRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Set target transform values when mouse state changes
  useEffect(() => {
    if (mouseState?.isMouseEntered) {
      setTargetTransform({
        x: Number(translateX),
        y: Number(translateY),
        z: Number(translateZ),
        rx: Number(rotateX),
        ry: Number(rotateY),
        rz: Number(rotateZ),
      });
    } else {
      setTargetTransform({
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
      });
    }
  }, [
    mouseState?.isMouseEntered,
    translateX,
    translateY,
    translateZ,
    rotateX,
    rotateY,
    rotateZ,
  ]);

  // Animate using spring physics for more natural motion
  useEffect(() => {
    const animateTransform = () => {
      if (!elementRef.current) return;

      // Calculate new current position using spring physics
      const newTransform = {
        x:
          currentTransform.x +
          (targetTransform.x - currentTransform.x) * springFactor,
        y:
          currentTransform.y +
          (targetTransform.y - currentTransform.y) * springFactor,
        z:
          currentTransform.z +
          (targetTransform.z - currentTransform.z) * springFactor,
        rx:
          currentTransform.rx +
          (targetTransform.rx - currentTransform.rx) * springFactor,
        ry:
          currentTransform.ry +
          (targetTransform.ry - currentTransform.ry) * springFactor,
        rz:
          currentTransform.rz +
          (targetTransform.rz - currentTransform.rz) * springFactor,
      };

      setCurrentTransform(newTransform);

      // Apply the transform to the element
      elementRef.current.style.transform = `
        translateX(${newTransform.x}px) 
        translateY(${newTransform.y}px) 
        translateZ(${newTransform.z}px) 
        rotateX(${newTransform.rx}deg) 
        rotateY(${newTransform.ry}deg) 
        rotateZ(${newTransform.rz}deg)
      `;

      rafRef.current = requestAnimationFrame(animateTransform);
    };

    rafRef.current = requestAnimationFrame(animateTransform);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [currentTransform, targetTransform, springFactor]);

  const Component = as;

  return React.createElement(
    Component,
    {
      ref: elementRef,
      className: cn("w-fit will-change-transform", className),
      ...props,
    },
    children
  );
}
