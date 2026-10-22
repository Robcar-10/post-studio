import type { ReactNode } from "react";
import type { RenderContext, Template } from "@/lib/types";
import { BRAND, FONT_DISPLAY, FONT_BODY, FONT_EYEBROW, getBg, getFg, getMuted, resolveAccent, resolveGrad, TS } from "@/lib/brand";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { HeroBg } from "@/components/primitives/HeroBg";
import { Logo } from "@/components/primitives/Logo";
import { makeT, makeR } from "./helpers";

const defaults = {
  number: "01", eyebrow: "5 WAYS TO",
  title: "Pick the right tee.",
  body: "Start with fabric weight, then fit. The rest is personality.",
  footer: "Swipe →",
};

function render(ctx: RenderContext): ReactNode {
  const T = makeT(ctx); const R = makeR(ctx);
  const v = { ...defaults, ...ctx.values };
  const { variant, theme, accent, gradient, size, fontScale = 1, brandColors } = ctx;
  const W = size.w, H = size.h;
  const bg = getBg(theme), fg = getFg(theme), muted = getMuted(theme);
  const padX = W * 0.08;

  const numberSize = Math.min(H * 0.19, W * 0.22) * fontScale;
  const titleSize  = Math.min(H * 0.085, W * 0.1) * fontScale;
  const bodySize   = TS(H, 26, fontScale);
  const eyebrowColor = gradient ? (brandColors?.secondary ?? BRAND.coral) : resolveAccent(accent, brandColors);

  if (variant === "title") {
    return (
      <div style={{ position: "absolute", inset: 0, background: bg }}>
        {theme === "dark" && <HeroBg/>}
        <div style={{ position: "absolute", inset: 0, padding: `${H * 0.08}px ${padX}px`,
          display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {R("logo", <Logo dark={theme === "dark"} height={Math.max(28, H * 0.03)}/>)}
            <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 800,
              fontSize: Math.max(14, H * 0.016 * fontScale),
              letterSpacing: 2, textTransform: "uppercase" as const,
              color: eyebrowColor,
            }}>{T("eyebrow", {}, v.eyebrow as string)}</div>
          </div>
          <div>
            {v.number && (
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
                fontSize: numberSize * 0.5, color: muted, opacity: 0.35,
                lineHeight: 0.9, marginBottom: H * 0.015,
              }}>{T("number", {}, v.number as string)}</div>
            )}
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: titleSize,
              lineHeight: 0.95, letterSpacing: -titleSize * 0.035, color: fg }}>
              {T("title", {}, v.title as string)}
            </div>
            {v.body && (
              <div style={{ fontFamily: FONT_BODY, fontSize: bodySize, lineHeight: 1.45,
                color: muted, marginTop: H * 0.03, maxWidth: "90%" }}>
                {T("body", {}, v.body as string)}
              </div>
            )}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: TS(H, 20, fontScale), color: muted,
            fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            <span>{T("footer", {}, v.footer as string)}</span>
            <span style={{ opacity: 0.7 }}>rolleduptees.com</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "swipe") {
    return (
      <div style={{ position: "absolute", inset: 0, background: bg }}>
        {theme === "dark" && <HeroBg/>}
        <div style={{ position: "absolute", inset: 0, padding: `${H * 0.08}px ${padX}px`,
          display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {R("logo", <Logo dark={theme === "dark"} height={Math.max(28, H * 0.03)}/>)}
            <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 800,
              fontSize: Math.max(12, H * 0.014 * fontScale),
              letterSpacing: 2, textTransform: "uppercase" as const, color: muted,
              background: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              padding: "6px 12px", borderRadius: 999,
            }}>{T("number", {}, v.number as string)}</div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
            marginTop: H * 0.03 }}>
            {v.eyebrow && (
              <Eyebrow color={eyebrowColor}
                size={Math.max(14, H * 0.017 * fontScale)} style={{ marginBottom: H * 0.025 }}>
                {T("eyebrow", {}, v.eyebrow as string)}
              </Eyebrow>
            )}
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: titleSize,
              lineHeight: 0.95, letterSpacing: -titleSize * 0.035, color: fg }}>
              {T("title", {}, v.title as string)}
            </div>
            {v.body && (
              <div style={{ fontFamily: FONT_BODY, fontSize: bodySize, lineHeight: 1.45,
                color: muted, marginTop: H * 0.035, maxWidth: "88%" }}>
                {T("body", {}, v.body as string)}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10,
            fontFamily: FONT_BODY, fontSize: TS(H, 22, fontScale), fontWeight: 700, color: fg,
            paddingTop: H * 0.02 }}>
            {T("footer", {}, v.footer as string)}
            <svg width={TS(H, 28)} height={TS(H, 28)} viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Default: numbered — giant gradient number, title + body below
  const numberColor = resolveAccent(accent, brandColors);
  return (
    <div style={{ position: "absolute", inset: 0, background: bg }}>
      {theme === "dark" && <HeroBg/>}
      <div style={{ position: "absolute", inset: 0, padding: `${H * 0.07}px ${padX}px`,
        display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {R("logo", <Logo dark={theme === "dark"} height={Math.max(28, H * 0.03)}/>)}
          {v.eyebrow && (
            <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 800,
              fontSize: Math.max(12, H * 0.014 * fontScale),
              letterSpacing: 2, textTransform: "uppercase" as const,
              color: eyebrowColor,
            }}>{T("eyebrow", {}, v.eyebrow as string)}</div>
          )}
        </div>
        <div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: numberSize,
            lineHeight: 0.85, letterSpacing: -numberSize * 0.05, marginBottom: H * 0.01,
            background: gradient ? resolveGrad(true, accent, brandColors) : "none",
            WebkitBackgroundClip: gradient ? "text" : "unset",
            WebkitTextFillColor: gradient ? "transparent" : numberColor,
            color: gradient ? "transparent" : numberColor,
          }}>
            {T("number", {}, v.number as string)}
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: titleSize,
            lineHeight: 0.95, letterSpacing: -titleSize * 0.035, color: fg }}>
            {T("title", {}, v.title as string)}
          </div>
          {v.body && (
            <div style={{ fontFamily: FONT_BODY, fontSize: bodySize, lineHeight: 1.45,
              color: muted, marginTop: H * 0.03, maxWidth: "88%" }}>
              {T("body", {}, v.body as string)}
            </div>
          )}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: TS(H, 20, fontScale), color: muted, fontWeight: 600 }}>
          {T("footer", {}, v.footer as string)}
        </div>
      </div>
    </div>
  );
}

export const Tpl_Carousel: Template = {
  id: "carousel", name: "Carousel", type: "Multi-slide story",
  description: "Swipeable multi-card post. Generate several cards from a single prompt.",
  pack: "pro" as const,
  variants: [
    { id: "numbered", name: "Numbered" },
    { id: "title",    name: "Title-first" },
    { id: "swipe",    name: "Swipe hint" },
  ],
  fields: [
    { key: "number",  label: "Card number (e.g. 01)", kind: "text", placeholder: "01" },
    { key: "eyebrow", label: "Eyebrow", kind: "text" },
    { key: "title",   label: "Card title", kind: "textarea" },
    { key: "body",    label: "Card body", kind: "textarea" },
    { key: "footer",  label: "Footer line", kind: "text" },
  ],
  defaults,
  render,
};
