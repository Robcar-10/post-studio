import type { ReactNode } from "react";
import type { RenderContext, Template } from "@/lib/types";
import { FONT_DISPLAY, FONT_BODY, FONT_EYEBROW, getBg, getFg, getMuted, resolveAccent, resolveGrad, TS } from "@/lib/brand";
import { Logo } from "@/components/primitives/Logo";
import { makeT, makeR } from "./helpers";

const defaults = {
  label: "Did you know?", tipNumber: "TIP 01",
  headline: "Dark shirts need an underbase.",
  body: "Without a white base layer, ink soaks into dark fabric and looks dull. We always print a flash-cured underbase first — that's why your colors pop.",
  footer: "Pro tips · @rolleduptees",
};

function render(ctx: RenderContext): ReactNode {
  const T = makeT(ctx); const R = makeR(ctx);
  const v = { ...defaults, ...ctx.values };
  const { variant, theme, accent, gradient, size, fontScale = 1, brandColors } = ctx;
  const W = size.w, H = size.h;
  const bg = getBg(theme), fg = getFg(theme);

  // ── wide variant ──────────────────────────────────────────────────────────
  if (variant === "wide") {
    const ac = resolveGrad(gradient, accent, brandColors);
    return (
      <div style={{ position: "absolute", inset: 0, background: bg, display: "flex" }}>
        {/* Left accent strip */}
        <div style={{
          width: W * 0.28, flexShrink: 0, background: ac,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: H * 0.025, padding: `${H * 0.06}px ${W * 0.025}px`,
        }}>
          <div style={{
            fontFamily: FONT_EYEBROW, fontWeight: 800,
            fontSize: Math.max(11, H * 0.016 * fontScale),
            letterSpacing: 2.5, textTransform: "uppercase",
            color: "#fff", textAlign: "center",
          }}>💡 {T("label", {}, v.label)}</div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: Math.max(14, H * 0.022 * fontScale),
            letterSpacing: 3, color: "rgba(255,255,255,0.85)",
            textAlign: "center",
          }}>{T("tipNumber", {}, v.tipNumber)}</div>
        </div>
        {/* Right content */}
        <div style={{
          flex: 1, padding: `${H * 0.07}px ${W * 0.05}px`,
          display: "flex", flexDirection: "column", justifyContent: "center", gap: H * 0.03,
        }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: Math.min(H * 0.088, W * 0.07) * fontScale,
            lineHeight: 0.95, letterSpacing: -2, color: fg,
          }}>{T("headline", {}, v.headline)}</div>
          <div style={{ width: H * 0.055, height: 4, background: resolveAccent(accent, brandColors) }}/>
          <div style={{
            fontFamily: FONT_BODY, fontSize: TS(H, 24, fontScale), lineHeight: 1.5,
            color: getMuted(theme), maxWidth: "92%",
          }}>{T("body", {}, v.body)}</div>
          <div style={{ marginTop: H * 0.01, display: "flex", alignItems: "center", gap: 12 }}>
            {R("logo", <Logo dark={theme === "dark"} height={Math.max(22, H * 0.024)}/>)}
            <div style={{
              fontFamily: FONT_EYEBROW, fontWeight: 700,
              fontSize: Math.max(11, H * 0.013 * fontScale),
              letterSpacing: 2, textTransform: "uppercase", color: getMuted(theme),
            }}>{T("footer", {}, v.footer)}</div>
          </div>
        </div>
      </div>
    );
  }

  // ── big-number variant ────────────────────────────────────────────────────
  if (variant === "big-number") {
    const numMatch = v.tipNumber.match(/\d+/);
    const bigNum = numMatch ? numMatch[0].padStart(2, "0") : "01";
    return (
      <div style={{ position: "absolute", inset: 0, background: bg, overflow: "hidden" }}>
        {/* Giant semi-transparent background number */}
        <div style={{
          position: "absolute", bottom: -H * 0.08, right: -W * 0.04,
          fontFamily: FONT_DISPLAY, fontWeight: 900,
          fontSize: H * 0.72, lineHeight: 1,
          color: resolveAccent(accent, brandColors), opacity: 0.08,
          pointerEvents: "none", userSelect: "none",
          letterSpacing: -10,
        }}>{bigNum}</div>
        {/* Foreground content */}
        <div style={{
          position: "absolute", inset: 0,
          padding: `${H * 0.07}px ${W * 0.06}px`,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              background: resolveGrad(gradient, accent, brandColors), color: "#fff",
              padding: `${H * 0.014}px ${H * 0.022}px`, borderRadius: 999,
              fontFamily: FONT_EYEBROW, fontWeight: 800,
              fontSize: Math.max(12, H * 0.016 * fontScale),
              letterSpacing: 2.5, textTransform: "uppercase",
            }}>💡 {T("label", {}, v.label)}</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 900,
              fontSize: Math.max(14, H * 0.02 * fontScale),
              color: getMuted(theme), letterSpacing: 3,
            }}>{T("tipNumber", {}, v.tipNumber)}</div>
          </div>
          <div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 900,
              fontSize: Math.min(H * 0.09, W * 0.085) * fontScale,
              lineHeight: 0.95, letterSpacing: -2, color: fg,
            }}>{T("headline", {}, v.headline)}</div>
            <div style={{ width: H * 0.06, height: 4, background: resolveAccent(accent, brandColors), marginTop: H * 0.03 }}/>
            <div style={{
              fontFamily: FONT_BODY, fontSize: TS(H, 24, fontScale), lineHeight: 1.5,
              color: getMuted(theme), marginTop: H * 0.025, maxWidth: "90%",
            }}>{T("body", {}, v.body)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            {R("logo", <Logo dark={theme === "dark"} height={Math.max(24, H * 0.026)}/>)}
            <div style={{
              fontFamily: FONT_EYEBROW, fontWeight: 700,
              fontSize: Math.max(11, H * 0.014 * fontScale),
              letterSpacing: 2, textTransform: "uppercase", color: getMuted(theme),
            }}>{T("footer", {}, v.footer)}</div>
          </div>
        </div>
      </div>
    );
  }

  // ── minimal variant ───────────────────────────────────────────────────────
  if (variant === "minimal") {
    return (
      <div style={{
        position: "absolute", inset: 0, background: bg,
        padding: `${H * 0.07}px ${W * 0.07}px`,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        {/* Top: logo + rule */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: H * 0.035 }}>
            {R("logo", <Logo dark={theme === "dark"} height={Math.max(24, H * 0.026)}/>)}
          </div>
          <div style={{ height: 2, background: resolveAccent(accent, brandColors), width: "100%" }}/>
        </div>
        {/* Center: headline */}
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: Math.min(H * 0.1, W * 0.092) * fontScale,
            lineHeight: 0.93, letterSpacing: -2.5, color: fg,
          }}>{T("headline", {}, v.headline)}</div>
        </div>
        {/* Accent divider bar + body */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: W * 0.03, marginBottom: H * 0.03 }}>
            <div style={{ width: W * 0.06, height: 4, background: resolveAccent(accent, brandColors), flexShrink: 0 }}/>
            <div style={{
              fontFamily: FONT_EYEBROW, fontWeight: 800,
              fontSize: Math.max(11, H * 0.015 * fontScale),
              letterSpacing: 2.5, textTransform: "uppercase", color: resolveAccent(accent, brandColors),
            }}>{T("tipNumber", {}, v.tipNumber)}</div>
          </div>
          <div style={{
            fontFamily: FONT_BODY, fontSize: TS(H, 24, fontScale), lineHeight: 1.6,
            color: getMuted(theme), maxWidth: "88%", marginBottom: H * 0.035,
          }}>{T("body", {}, v.body)}</div>
          {/* Footer */}
          <div style={{ height: 1, background: getMuted(theme), opacity: 0.3, marginBottom: H * 0.025 }}/>
          <div style={{
            fontFamily: FONT_EYEBROW, fontWeight: 700,
            fontSize: Math.max(11, H * 0.013 * fontScale),
            letterSpacing: 2, textTransform: "uppercase", color: getMuted(theme),
          }}>{T("footer", {}, v.footer)}</div>
        </div>
      </div>
    );
  }

  // ── card variant (default) ────────────────────────────────────────────────
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, padding: `${H * 0.07}px ${W * 0.06}px`,
      display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12,
          background: resolveGrad(gradient, accent, brandColors), color: "#fff",
          padding: `${H * 0.014}px ${H * 0.022}px`, borderRadius: 999,
          fontFamily: FONT_EYEBROW, fontWeight: 800, fontSize: Math.max(12, H * 0.016 * fontScale),
          letterSpacing: 2.5, textTransform: "uppercase" }}>💡 {T("label", {}, v.label)}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: Math.max(14, H * 0.02 * fontScale),
          color: getMuted(theme), letterSpacing: 3 }}>{T("tipNumber", {}, v.tipNumber)}</div>
      </div>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
          fontSize: Math.min(H * 0.09, W * 0.085) * fontScale, lineHeight: 0.95, letterSpacing: -2, color: fg }}>
          {T("headline", {}, v.headline)}
        </div>
        <div style={{ width: H * 0.06, height: 4, background: resolveAccent(accent, brandColors), marginTop: H * 0.03 }}/>
        <div style={{ fontFamily: FONT_BODY, fontSize: TS(H, 24, fontScale), lineHeight: 1.5, color: getMuted(theme),
          marginTop: H * 0.025, maxWidth: "90%" }}>{T("body", {}, v.body)}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        {R("logo", <Logo dark={theme === "dark"} height={Math.max(24, H * 0.026)}/>)}
        <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 700, fontSize: Math.max(11, H * 0.014 * fontScale),
          letterSpacing: 2, textTransform: "uppercase", color: getMuted(theme) }}>{T("footer", {}, v.footer)}</div>
      </div>
    </div>
  );
}

export const Tpl_Tip: Template = {
  id: "tip", name: "Tip / Did you know", type: "Educational",
  description: "Short useful fact or tip. Drives saves and shares.",
  pack: "pro" as const,
  variants: [
    { id: "card", name: "Card" },
    { id: "wide", name: "Wide split" },
    { id: "big-number", name: "Big number" },
    { id: "minimal", name: "Minimal" },
  ],
  fields: [
    { key: "label", label: "Top label", kind: "text" },
    { key: "tipNumber", label: "Tip # (optional)", kind: "text" },
    { key: "headline", label: "Tip headline", kind: "textarea" },
    { key: "body", label: "Body text", kind: "textarea" },
    { key: "footer", label: "Footer", kind: "text" },
  ],
  defaults,
  render,
};
