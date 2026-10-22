import { GRAD_CTA } from "@/lib/brand";
import type { CSSProperties } from "react";

interface Props {
  children: React.ReactNode;
  style?: CSSProperties;
  gradient?: string;
}

export function GradText({ children, style = {}, gradient = GRAD_CTA }: Props) {
  return (
    <span style={{
      backgroundImage: gradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      color: "transparent",
      ...style,
    }}>{children}</span>
  );
}
