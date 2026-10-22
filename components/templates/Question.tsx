import type { ReactNode } from "react";
import type { RenderContext, Template } from "@/lib/types";
import { BRAND, FONT_DISPLAY, FONT_BODY, FONT_EYEBROW, getBg, getFg, resolveAccent, TS } from "@/lib/brand";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Logo } from "@/components/primitives/Logo";
import { makeT, makeR, makeIP } from "./helpers";

const defaults = {
  headline: "Which would you wear?",
  optionA: "Vintage tee", optionB: "Cropped hoodie",
  imageA: null, imageB: null,
  footer: "Comment 'A' or 'B' below",
};

function render(ctx: RenderContext): ReactNode {
  const T = makeT(ctx); const R = makeR(ctx); const IP = makeIP(ctx);
  const v = { ...defaults, ...ctx.values };
  const { variant, theme, accent, gradient, size, fontScale = 1, onImageChange, brandColors } = ctx;
  const W = size.w, H = size.h;
  const bg = getBg(theme), fg = getFg(theme);

  const opts = [
    { src: v.imageA as string | null, label: v.optionA as string, letter: "A", key: "imageA", labelKey: "optionA", color: brandColors?.primary ?? BRAND.purple },
    { src: v.imageB as string | null, label: v.optionB as string, letter: "B", key: "imageB", labelKey: "optionB", color: brandColors?.secondary ?? BRAND.coral },
  ];

  // ── stacked variant ───────────────────────────────────────────────────────
  if (variant === "stacked") {
    return (
      <div style={{
        position: "absolute", inset: 0, background: bg,
        padding: `${H * 0.05}px ${W * 0.05}px`,
        display: "flex", flexDirection: "column", gap: H * 0.025,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {R("logo", <Logo dark={theme === "dark"} height={Math.max(26, H * 0.028)}/>)}
          <Eyebrow color={resolveAccent(accent, brandColors)} size={Math.max(12, H * 0.015 * fontScale)}>This or that</Eyebrow>
        </div>
        {/* Headline */}
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 900,
          fontSize: Math.min(H * 0.065, W * 0.06) * fontScale,
          lineHeight: 0.95, letterSpacing: -1.5, color: fg, textAlign: "center",
        }}>{T("headline", {}, v.headline as string)}</div>
        {/* Stacked option panels */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: H * 0.015, position: "relative" }}>
          {opts.map((opt, i) => (
            <div key={i} style={{
              flex: "0 0 40%", position: "relative",
              borderRadius: 18, overflow: "hidden",
              background: BRAND.lavenderBg,
            }}>
              {variant === "stacked"
                ? R(opt.key, IP(opt.key, {
                    src: opt.src,
                    label: `Photo ${opt.letter}`,
                    onSelect: (d: string) => onImageChange?.(d, opt.key),
                    style: { position: "absolute", inset: 0 },
                  }), { mode: "image" })
                : <div style={{ position: "absolute", inset: 0, background: opt.color }}/>
              }
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
                display: "flex", flexDirection: "row",
                alignItems: "flex-end", justifyContent: "space-between",
                padding: H * 0.025, pointerEvents: "none",
              }}>
                <div style={{
                  color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 800,
                  fontSize: TS(H, 32, fontScale), lineHeight: 1.1,
                  pointerEvents: "auto",
                }}>{T(opt.labelKey, {}, opt.label)}</div>
                <div style={{
                  width: H * 0.065, height: H * 0.065, borderRadius: 999,
                  background: opt.color, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: H * 0.036,
                  flexShrink: 0,
                }}>{opt.letter}</div>
              </div>
            </div>
          ))}
          {/* VS badge — centered between the two panels */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: H * 0.07, height: H * 0.07, borderRadius: 999,
            background: BRAND.fg900, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: H * 0.025,
            border: "4px solid #fff", zIndex: 2,
          }}>VS</div>
        </div>
        {/* Footer */}
        <div style={{
          fontFamily: FONT_EYEBROW, fontWeight: 800,
          fontSize: Math.max(12, H * 0.016 * fontScale),
          letterSpacing: 2, textTransform: "uppercase", color: brandColors?.secondary ?? BRAND.coral, textAlign: "center",
        }}>{T("footer", {}, v.footer as string)}</div>
      </div>
    );
  }

  // ── versus variant (text-only, full half-panels) ──────────────────────────
  if (variant === "versus") {
    return (
      <div style={{ position: "absolute", inset: 0, background: bg, display: "flex", flexDirection: "column" }}>
        {/* Headline bar at top */}
        <div style={{
          padding: `${H * 0.05}px ${W * 0.05}px ${H * 0.025}px`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {R("logo", <Logo dark={theme === "dark"} height={Math.max(26, H * 0.028)}/>)}
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: Math.min(H * 0.065, W * 0.06) * fontScale,
            lineHeight: 0.95, letterSpacing: -1.5, color: fg, textAlign: "right",
            flex: 1, marginLeft: W * 0.03,
          }}>{T("headline", {}, v.headline as string)}</div>
        </div>
        {/* Two full half-panels */}
        <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
          {opts.map((opt, i) => (
            <div key={i} style={{
              flex: 1, position: "relative",
              background: opt.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              {/* Giant letter watermark */}
              <div style={{
                position: "absolute",
                fontFamily: FONT_DISPLAY, fontWeight: 900,
                fontSize: H * 0.35, lineHeight: 1,
                color: "rgba(255,255,255,0.15)",
                pointerEvents: "none", userSelect: "none",
                letterSpacing: -8,
              }}>{opt.letter}</div>
              {/* Option label centered */}
              <div style={{
                position: "relative", zIndex: 1,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: H * 0.02, padding: `0 ${W * 0.035}px`, textAlign: "center",
              }}>
                <div style={{
                  width: H * 0.075, height: H * 0.075, borderRadius: 999,
                  background: "rgba(255,255,255,0.25)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: H * 0.042,
                }}>{opt.letter}</div>
                <div style={{
                  color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 800,
                  fontSize: TS(H, 34, fontScale), lineHeight: 1.1,
                  pointerEvents: "auto",
                }}>{T(opt.labelKey, {}, opt.label)}</div>
              </div>
              {/* Thin divider on right edge of left panel */}
              {i === 0 && (
                <div style={{
                  position: "absolute", right: 0, top: 0, bottom: 0,
                  width: 3, background: "rgba(255,255,255,0.4)", zIndex: 3,
                }}/>
              )}
            </div>
          ))}
          {/* VS badge in center */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: H * 0.085, height: H * 0.085, borderRadius: 999,
            background: "#fff", color: BRAND.fg900,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: H * 0.03,
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)", zIndex: 4,
          }}>VS</div>
        </div>
        {/* Footer */}
        <div style={{
          padding: `${H * 0.025}px ${W * 0.05}px`,
          fontFamily: FONT_EYEBROW, fontWeight: 800,
          fontSize: Math.max(12, H * 0.016 * fontScale),
          letterSpacing: 2, textTransform: "uppercase", color: brandColors?.secondary ?? BRAND.coral, textAlign: "center",
        }}>{T("footer", {}, v.footer as string)}</div>
      </div>
    );
  }

  // ── split / text variants (original) ─────────────────────────────────────
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, padding: `${H * 0.06}px ${W * 0.05}px`,
      display: "flex", flexDirection: "column", gap: H * 0.03 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {R("logo", <Logo dark={theme === "dark"} height={Math.max(26, H * 0.028)}/>)}
        <Eyebrow color={resolveAccent(accent, brandColors)} size={Math.max(12, H * 0.015 * fontScale)}>This or that</Eyebrow>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
        fontSize: Math.min(H * 0.075, W * 0.07) * fontScale, lineHeight: 0.95,
        letterSpacing: -1.5, color: fg, textAlign: "center" }}>
        {T("headline", {}, v.headline as string)}
      </div>
      <div style={{ flex: 1, display: "flex", gap: H * 0.02, position: "relative" }}>
        {opts.map((opt, i) => (
          <div key={i} style={{ flex: 1, position: "relative", borderRadius: 18, overflow: "hidden", background: BRAND.lavenderBg }}>
            {variant === "split"
              ? R(opt.key, IP(opt.key, {
                  src: opt.src,
                  label: `Photo ${opt.letter}`,
                  onSelect: (d: string) => onImageChange?.(d, opt.key),
                  style: { position: "absolute", inset: 0 },
                }), { mode: "image" })
              : <div style={{ position: "absolute", inset: 0, background: opt.color }}/>
            }
            <div style={{ position: "absolute", inset: 0,
              background: variant === "split"
                ? "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)"
                : "none",
              display: "flex", flexDirection: "column",
              justifyContent: variant === "split" ? "space-between" : "center",
              alignItems: variant === "split" ? "stretch" : "center",
              padding: H * 0.03, pointerEvents: "none" }}>
              <div style={{
                alignSelf: variant === "split" ? "flex-start" : "auto",
                width: H * 0.07, height: H * 0.07, borderRadius: 999,
                background: opt.color, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: H * 0.04,
              }}>{opt.letter}</div>
              <div style={{ color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 800,
                fontSize: TS(H, 30, fontScale), lineHeight: 1.1,
                textAlign: variant === "split" ? "left" : "center",
                pointerEvents: "auto" }}>
                {T(opt.labelKey, {}, opt.label)}
              </div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          width: H * 0.08, height: H * 0.08, borderRadius: 999, background: BRAND.fg900, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: H * 0.028,
          border: "4px solid #fff", zIndex: 2 }}>VS</div>
      </div>
      <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 800, fontSize: Math.max(12, H * 0.016 * fontScale),
        letterSpacing: 2, textTransform: "uppercase", color: brandColors?.secondary ?? BRAND.coral, textAlign: "center" }}>
        {T("footer", {}, v.footer as string)}
      </div>
    </div>
  );
}

export const Tpl_Question: Template = {
  id: "question", name: "Question / Poll", type: "Engagement",
  description: "Two-option poll — \"Which would you wear?\"",
  pack: "pro" as const,
  variants: [
    { id: "split", name: "Split with images" },
    { id: "text", name: "Text only" },
    { id: "stacked", name: "Stacked" },
    { id: "versus", name: "Versus" },
  ],
  fields: [
    { key: "headline", label: "Question", kind: "text" },
    { key: "optionA", label: "Option A label", kind: "text" },
    { key: "optionB", label: "Option B label", kind: "text" },
    { key: "imageA", label: "Option A photo", kind: "image" },
    { key: "imageB", label: "Option B photo", kind: "image" },
    { key: "footer", label: "Footer", kind: "text" },
  ],
  defaults,
  render,
};
