// components/ui/orbit/types.ts
export const ORBIT_DIRECTION = {
  Clockwise: "normal",
  CounterClockwise: "reverse",
} as const;

export type OrbitDirection =
  (typeof ORBIT_DIRECTION)[keyof typeof ORBIT_DIRECTION];

export interface OrbitProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: OrbitDirection;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
}
