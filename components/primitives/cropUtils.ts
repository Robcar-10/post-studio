import type { Crop } from "@/lib/types";
import type { CSSProperties } from "react";

export const DEFAULT_CROP: Crop = { zoom: 1, x: 50, y: 50 };

export function cropToImgStyle(crop?: Crop | null): CSSProperties {
  const c = { ...DEFAULT_CROP, ...(crop || {}) };
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${c.x}% ${c.y}%`,
    transform: `scale(${c.zoom})`,
    transformOrigin: `${c.x}% ${c.y}%`,
    display: "block",
    transition: "transform 0.1s ease-out",
  };
}
