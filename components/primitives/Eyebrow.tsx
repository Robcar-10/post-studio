import { BRAND, FONT_EYEBROW } from "@/lib/brand";
import type { CSSProperties } from "react";

interface Props {
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}

export function Eyebrow({ children, color = BRAND.coral, size = 22, style = {} }: Props) {
  return (
    <div style={{
      fontFamily: FONT_EYEBROW,
      fontSize: size,
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: 3,
      color,
      ...style,
    }}>{children}</div>
  );
}
