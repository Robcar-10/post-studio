"use client";
import type { CanvasSize } from "@/lib/types";

interface Zone {
  label: string;
  x: number; y: number; w: number; h: number;
  kind: "safe" | "chrome" | "crop";
}

interface Props {
  size: CanvasSize;
  sizeKey: string;
  show: boolean;
}

export function SafeZones({ size, sizeKey, show }: Props) {
  if (!show) return null;
  const W = size.w, H = size.h;

  const zones: Zone[] = [];
  if (sizeKey === "ig_story") {
    zones.push({ label: "Profile + name (top)", x: 0, y: 0, w: W, h: 220, kind: "chrome" });
    zones.push({ label: "Nav + caption (bottom)", x: 0, y: H - 250, w: W, h: 250, kind: "chrome" });
    zones.push({ label: "Safe text area", x: W * 0.05, y: 220, w: W * 0.9, h: H - 470, kind: "safe" });
  } else if (sizeKey === "ig_portrait") {
    zones.push({ label: "Safe text area (4:5)", x: W * 0.05, y: H * 0.04, w: W * 0.9, h: H * 0.92, kind: "safe" });
  } else if (sizeKey === "ig_square") {
    zones.push({ label: "Safe text area (1:1)", x: W * 0.05, y: H * 0.05, w: W * 0.9, h: H * 0.9, kind: "safe" });
  } else if (sizeKey === "fb_feed") {
    zones.push({ label: "Safe text area", x: W * 0.04, y: H * 0.08, w: W * 0.92, h: H * 0.84, kind: "safe" });
  } else if (sizeKey === "fb_square") {
    zones.push({ label: "Safe text area", x: W * 0.05, y: H * 0.05, w: W * 0.9, h: H * 0.9, kind: "safe" });
  } else if (sizeKey === "gbp") {
    zones.push({ label: "Safe text area", x: W * 0.05, y: H * 0.06, w: W * 0.9, h: H * 0.88, kind: "safe" });
    zones.push({ label: "16:9 list crop", x: 0, y: (H - W * 9 / 16) / 2, w: W, h: W * 9 / 16, kind: "crop" });
  } else {
    zones.push({ label: "Safe text area", x: W * 0.05, y: H * 0.05, w: W * 0.9, h: H * 0.9, kind: "safe" });
  }

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20 }}
    >
      {/* Rule-of-thirds */}
      <g stroke="rgba(178,33,246,0.28)" strokeWidth={1.5} strokeDasharray="4 6">
        <line x1={W / 3} y1={0} x2={W / 3} y2={H}/>
        <line x1={W * 2 / 3} y1={0} x2={W * 2 / 3} y2={H}/>
        <line x1={0} y1={H / 3} x2={W} y2={H / 3}/>
        <line x1={0} y1={H * 2 / 3} x2={W} y2={H * 2 / 3}/>
      </g>
      {/* Center cross */}
      <g stroke="rgba(178,33,246,0.35)" strokeWidth={1}>
        <line x1={W / 2} y1={H / 2 - 30} x2={W / 2} y2={H / 2 + 30}/>
        <line x1={W / 2 - 30} y1={H / 2} x2={W / 2 + 30} y2={H / 2}/>
      </g>
      {/* Safe zones */}
      {zones.map((z, i) => {
        const color = z.kind === "chrome"
          ? "rgba(255,100,82,0.5)"
          : z.kind === "crop"
          ? "rgba(22,0,40,0.4)"
          : "rgba(34,197,94,0.6)";
        const fill = z.kind === "chrome"
          ? "rgba(255,100,82,0.08)"
          : z.kind === "crop"
          ? "rgba(22,0,40,0.05)"
          : "rgba(34,197,94,0.04)";
        const labelW = z.label.length * 11 + 24;
        return (
          <g key={i}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h}
              fill={fill} stroke={color} strokeWidth={3}
              strokeDasharray={z.kind === "safe" ? "12 10" : "0"}/>
            <rect x={z.x + 8} y={z.y + 8} width={labelW} height={34} rx={6} fill={color} opacity={0.9}/>
            <text x={z.x + 20} y={z.y + 31} fill="#fff" fontSize="18"
              fontFamily="Inter, sans-serif" fontWeight="700">
              {z.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
