import type { ReactNode } from "react";
import type { RenderContext, Template } from "@/lib/types";
import { BRAND, FONT_DISPLAY, FONT_EYEBROW, getBg, getFg, getMuted, resolveAccent, resolveGrad } from "@/lib/brand";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Logo } from "@/components/primitives/Logo";
import { makeT, makeR, makeIP } from "./helpers";

const defaults = {
  headline: "Old logo → fresh print.",
  beforeLabel: "BEFORE", afterLabel: "AFTER",
  beforeImage: null, afterImage: null,
  footer: "Custom screen printing · @rolleduptees",
};

function render(ctx: RenderContext): ReactNode {
  const T = makeT(ctx); const R = makeR(ctx); const IP = makeIP(ctx);
  const v = { ...defaults, ...ctx.values } as typeof defaults & { beforeImage?: string | null; afterImage?: string | null };
  const { variant, theme, accent, gradient, size, fontScale = 1, onImageChange, brandColors } = ctx;
  const W = size.w, H = size.h;
  const bg = getBg(theme), fg = getFg(theme);

  const panels = [
    { src: v.beforeImage, label: v.beforeLabel, key: "beforeImage", color: BRAND.fg500 },
    { src: v.afterImage, label: v.afterLabel, key: "afterImage", color: resolveAccent(accent, brandColors) },
  ];

  // ── diagonal variant ──────────────────────────────────────────────────────
  if (variant === "diagonal") {
    return (
      <div style={{ position: "absolute", inset: 0, background: bg,
        padding: `${H * 0.06}px ${W * 0.05}px`,
        display: "flex", flexDirection: "column", gap: H * 0.025 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 3 }}>
          {R("logo", <Logo dark={theme === "dark"} height={Math.max(26, H * 0.028)}/>)}
          <Eyebrow color={resolveAccent(accent, brandColors)} size={Math.max(12, H * 0.015 * fontScale)}>Before · After</Eyebrow>
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
          fontSize: Math.min(H * 0.07, W * 0.06) * fontScale,
          lineHeight: 0.95, letterSpacing: -1.5, color: fg, zIndex: 3 }}>
          {T("headline", {}, v.headline)}
        </div>
        {/* Diagonal photo area */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* Before photo — top trapezoid */}
          <div style={{
            position: "absolute", inset: 0,
            clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 55%)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {R(panels[0].key, IP(panels[0].key, {
              src: panels[0].src,
              label: panels[0].label,
              onSelect: (d: string) => onImageChange?.(d, panels[0].key),
              style: { position: "absolute", inset: 0 },
            }), { mode: "image" })}
            <div style={{
              position: "absolute", top: H * 0.025, left: H * 0.025,
              background: panels[0].color,
              color: "#fff", padding: `${H * 0.012}px ${H * 0.025}px`, borderRadius: 999,
              fontFamily: FONT_EYEBROW, fontWeight: 800,
              fontSize: Math.max(12, H * 0.016 * fontScale),
              letterSpacing: 2, textTransform: "uppercase",
            }}>{panels[0].label}</div>
          </div>
          {/* After photo — bottom trapezoid */}
          <div style={{
            position: "absolute", inset: 0,
            clipPath: "polygon(0 55%, 100% 45%, 100% 100%, 0 100%)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {R(panels[1].key, IP(panels[1].key, {
              src: panels[1].src,
              label: panels[1].label,
              onSelect: (d: string) => onImageChange?.(d, panels[1].key),
              style: { position: "absolute", inset: 0 },
            }), { mode: "image" })}
            <div style={{
              position: "absolute", bottom: H * 0.025, right: H * 0.025,
              background: resolveGrad(gradient, accent, brandColors),
              color: "#fff", padding: `${H * 0.012}px ${H * 0.025}px`, borderRadius: 999,
              fontFamily: FONT_EYEBROW, fontWeight: 800,
              fontSize: Math.max(12, H * 0.016 * fontScale),
              letterSpacing: 2, textTransform: "uppercase",
            }}>{panels[1].label}</div>
          </div>
          {/* Diagonal divider line */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: `linear-gradient(to bottom right, transparent calc(50% - 2px), rgba(255,255,255,0.7) calc(50% - 1px), rgba(255,255,255,0.7) calc(50% + 1px), transparent calc(50% + 2px))`,
          }}/>
        </div>
        {/* Footer */}
        <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 700,
          fontSize: Math.max(11, H * 0.013 * fontScale),
          letterSpacing: 2, textTransform: "uppercase", color: getMuted(theme), zIndex: 3 }}>
          {T("footer", {}, v.footer)}
        </div>
      </div>
    );
  }

  // ── big-label variant ─────────────────────────────────────────────────────
  if (variant === "big-label") {
    return (
      <div style={{ position: "absolute", inset: 0, background: bg,
        padding: `${H * 0.06}px ${W * 0.05}px`,
        display: "flex", flexDirection: "column", gap: H * 0.025 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {R("logo", <Logo dark={theme === "dark"} height={Math.max(26, H * 0.028)}/>)}
          <Eyebrow color={resolveAccent(accent, brandColors)} size={Math.max(12, H * 0.015 * fontScale)}>Before · After</Eyebrow>
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
          fontSize: Math.min(H * 0.07, W * 0.06) * fontScale,
          lineHeight: 0.95, letterSpacing: -1.5, color: fg }}>
          {T("headline", {}, v.headline)}
        </div>
        {/* Side-by-side panels with huge label overlay */}
        <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: H * 0.02 }}>
          {panels.map((p, i) => (
            <div key={i} style={{ flex: 1, position: "relative", borderRadius: 16, overflow: "hidden" }}>
              {R(p.key, IP(p.key, {
                src: p.src,
                label: p.label,
                onSelect: (d: string) => onImageChange?.(d, p.key),
                style: { position: "absolute", inset: 0 },
              }), { mode: "image" })}
              {/* Dark gradient at bottom for label legibility */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)",
              }}/>
              {/* Huge BEFORE / AFTER label */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: `0 ${H * 0.02}px ${H * 0.025}px`,
                pointerEvents: "none",
              }}>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 900,
                  fontSize: H * 0.18,
                  lineHeight: 0.85,
                  color: "rgba(255,255,255,0.9)",
                  textTransform: "uppercase",
                  letterSpacing: -4,
                }}>{p.label}</div>
              </div>
              {/* Small pill in top corner */}
              <div style={{
                position: "absolute", top: H * 0.025, left: H * 0.025,
                background: i === 1 ? resolveGrad(gradient, accent, brandColors) : (p.color || BRAND.fg900),
                color: "#fff", padding: `${H * 0.01}px ${H * 0.02}px`, borderRadius: 999,
                fontFamily: FONT_EYEBROW, fontWeight: 800,
                fontSize: Math.max(10, H * 0.013 * fontScale),
                letterSpacing: 2, textTransform: "uppercase",
              }}>{p.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 700,
          fontSize: Math.max(11, H * 0.013 * fontScale),
          letterSpacing: 2, textTransform: "uppercase", color: getMuted(theme) }}>
          {T("footer", {}, v.footer)}
        </div>
      </div>
    );
  }

  // ── split / stack variants (original) ─────────────────────────────────────
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, padding: `${H * 0.06}px ${W * 0.05}px`,
      display: "flex", flexDirection: "column", gap: H * 0.025 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {R("logo", <Logo dark={theme === "dark"} height={Math.max(26, H * 0.028)}/>)}
        <Eyebrow color={resolveAccent(accent, brandColors)} size={Math.max(12, H * 0.015 * fontScale)}>Before · After</Eyebrow>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: Math.min(H * 0.07, W * 0.06) * fontScale,
        lineHeight: 0.95, letterSpacing: -1.5, color: fg }}>
        {T("headline", {}, v.headline)}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: variant === "stack" ? "column" : "row", gap: H * 0.02 }}>
        {panels.map((p, i) => (
          <div key={i} style={{ flex: 1, position: "relative", borderRadius: 16, overflow: "hidden" }}>
            {R(p.key, IP(p.key, { src: p.src, label: p.label, onSelect: (d: string) => onImageChange?.(d, p.key),
              style: { position: "absolute", inset: 0 } }), { mode: "image" })}
            <div style={{ position: "absolute", top: H * 0.025, left: H * 0.025,
              background: i === 1 ? resolveGrad(gradient, accent, brandColors) : (p.color || BRAND.fg900),
              color: "#fff", padding: `${H * 0.012}px ${H * 0.025}px`, borderRadius: 999,
              fontFamily: FONT_EYEBROW, fontWeight: 800, fontSize: Math.max(12, H * 0.016 * fontScale),
              letterSpacing: 2, textTransform: "uppercase" }}>{p.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 700, fontSize: Math.max(11, H * 0.013 * fontScale),
        letterSpacing: 2, textTransform: "uppercase", color: getMuted(theme) }}>{T("footer", {}, v.footer)}</div>
    </div>
  );
}

export const Tpl_BeforeAfter: Template = {
  id: "beforeafter", name: "Before & After", type: "Comparison",
  description: "Split layout comparing two photos. Show transformation work.",
  pack: "pro" as const,
  variants: [
    { id: "split", name: "Side by side" },
    { id: "stack", name: "Stacked" },
    { id: "diagonal", name: "Diagonal cut" },
    { id: "big-label", name: "Big labels" },
  ],
  fields: [
    { key: "headline", label: "Headline", kind: "text" },
    { key: "beforeLabel", label: "Before label", kind: "text" },
    { key: "afterLabel", label: "After label", kind: "text" },
    { key: "beforeImage", label: "Before photo", kind: "image" },
    { key: "afterImage", label: "After photo", kind: "image" },
    { key: "footer", label: "Footer", kind: "text" },
  ],
  defaults,
  render,
};
