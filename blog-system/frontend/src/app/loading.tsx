// app/loading.tsx
"use client";
import MetaBalls from "@/components/reactbits/MetaBalls";
import { Ripple } from "@/components/magicui/ripple";
export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ripple />
      {/* Meta Balls 动画 */}
      <MetaBalls
        color="#89f7feff"
        cursorBallColor="#89f7feff"
        cursorBallSize={2}
        ballCount={15}
        animationSize={30}
        enableMouseInteraction={true}
        enableTransparency={true}
        hoverSmoothness={0.05}
        clumpFactor={1}
        speed={0.8}
      />
    </div>
  );
}
