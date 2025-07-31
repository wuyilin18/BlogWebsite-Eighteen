import { useState } from "react";

export function useMouseState() {
  const [isMouseEntered, setMouseEntered] = useState(false);

  return {
    isMouseEntered,
    setMouseEntered,
  };
}
