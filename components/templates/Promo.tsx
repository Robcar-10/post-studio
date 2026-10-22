import type { ReactNode } from "react";
import type { RenderContext, Template } from "@/lib/types";
import { BRAND, FONT_DISPLAY, FONT_BODY, FONT_EYEBROW, getBg, getFg, getMuted, resolveAccent, resolveGrad, TS } from "@/lib/brand";
import { GradText } from "@/components/primitives/GradText";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { HeroBg } from "@/components/primitives/HeroBg";
import { Logo, DiscountBadge } from "@/components/primitives/Logo";
import { makeT, makeR, makeIP } from "./helpers";

const defaults = {
  eyebrow: "Limited time", headline: "20 tees, your design, $249.",
  badgeText: "20% OFF", subhead: "Through April 30. Includes setup, 1-color front print, free local pickup.",
  deadline: "Order by April 30", cta: "DM us · Link in bio", image: null,
};

function render(ctx: RenderContext): ReactNode {
  const T = makeT(ctx); const R = makeR(ctx); const IP = makeIP(ctx);
  const v = { ...defaults, ...ctx.values } as typeof defaults & { image?: string | null };
  const { variant, theme, accent, gradient, size, fontScale = 1, onImageChange, brandColors } = ctx;
  const W = size.w, H = size.h;
  const bg = getBg(theme), fg = getFg(theme), muted = getMuted(theme);
  const padX = W * 0.06;

  if (variant === "split") {
    const isWide = W / H > 1.4;
    return (
      <div style={{ position: "absolute", inset: 0, background: bg, display: "flex",
        flexDirection: isWide ? "row" : "column" }}>
        <div style={{ flex: 1, position: "relative", minHeight: isWide ? "100%" : "45%" }}>
          {R("image", IP("image", { src: v.image, onSelect: onImageChange,
            style: { position: "absolute", inset: 0 } }), { mode: "image" })}
          {v.badgeText && (
            <div style={{ position: "absolute", top: H * 0.04, right: H * 0.04 }}>
              {R("badge", <DiscountBadge text={v.badgeText} size={Math.min(W, H) * 0.22}/>)}
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: `${H * 0.06}px ${W * 0.05}px`,
          display: "flex", flexDirection: "column", justifyContent: "space-between", background: bg }}>
          <div>
            <Eyebrow color={resolveAccent(accent, brandColors)} size={Math.max(13, H * 0.016 * fontScale)}>{T("eyebrow", {}, v.eyebrow)}</Eyebrow>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
              fontSize: Math.min(H * 0.09, W * 0.07) * fontScale, lineHeight: 0.95,
              letterSpacing: -1.5, color: fg, marginTop: H * 0.025 }}>
              {T("headline", {}, v.headline)}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: TS(H, 22, fontScale), color: muted,
              marginTop: H * 0.025, lineHeight: 1.45 }}>{T("subhead", {}, v.subhead)}</div>
          </div>
          <div>
            {v.deadline && (
              <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 800, fontSize: Math.max(13, H * 0.016 * fontScale),
                letterSpacing: 2.5, textTransform: "uppercase", color: brandColors?.secondary ?? BRAND.coral, marginBottom: H * 0.02 }}>
                ⏱ {T("deadline", {}, v.deadline)}
              </div>
            )}
            <div style={{ background: resolveGrad(gradient, accent, brandColors),
              color: "#fff", padding: `${H * 0.025}px ${W * 0.03}px`, borderRadius: 14, display: "inline-block",
              fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: TS(H, 26, fontScale) }}>
              {T("cta", {}, v.cta)} →
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "stamp") {
    return (
      <div style={{ position: "absolute", inset: 0, background: bg }}>
        {theme === "dark" && <HeroBg/>}
        <div style={{ position: "absolute", inset: 0, padding: `${H * 0.07}px ${padX}px`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", textAlign: "center" }}>
          {R("logo", <Logo dark={theme === "dark"} height={Math.max(28, H * 0.03)}/>)}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: H * 0.025 }}>
            {R("badge", <DiscountBadge text={v.badgeText} size={Math.min(W, H) * 0.32}/>)}
            <Eyebrow color={resolveAccent(accent, brandColors)} size={Math.max(13, H * 0.016 * fontScale)}>{T("eyebrow", {}, v.eyebrow)}</Eyebrow>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
              fontSize: Math.min(H * 0.085, W * 0.075) * fontScale, lineHeight: 0.95, letterSpacing: -1.5,
              color: fg, maxWidth: "90%" }}>{T("headline", {}, v.headline)}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: TS(H, 22, fontScale), color: muted,
              lineHeight: 1.4, maxWidth: "75%" }}>{T("subhead", {}, v.subhead)}</div>
          </div>
          <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 800, fontSize: Math.max(13, H * 0.016 * fontScale),
            letterSpacing: 2.5, textTransform: "uppercase", color: brandColors?.secondary ?? BRAND.coral }}>
            {T("deadline", {}, v.deadline)} · {T("cta", {}, v.cta)}
          </div>
        </div>
      </div>
    );
  }

  // badge (default)
  return (
    <div style={{ position: "absolute", inset: 0, background: bg }}>
      {theme === "dark" && <HeroBg/>}
      {v.badgeText && (
        <div style={{ position: "absolute", top: H * 0.04, right: H * 0.04, zIndex: 2 }}>
          {R("badge", <DiscountBadge text={v.badgeText} size={Math.min(W, H) * 0.22}/>)}
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, padding: `${H * 0.08}px ${padX}px`,
        display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {R("logo", <Logo dark={theme === "dark"} height={Math.max(28, H * 0.03)}/>)}
        <div>
          <Eyebrow color={resolveAccent(accent, brandColors)} size={Math.max(13, H * 0.017 * fontScale)}>{T("eyebrow", {}, v.eyebrow)}</Eyebrow>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: Math.min(H * 0.10, W * 0.10) * fontScale, lineHeight: 0.92, letterSpacing: -2,
            color: fg, marginTop: H * 0.03, maxWidth: "85%" }}>
            {ctx.editable ? T("headline", {}, v.headline) : (gradient ? <GradText>{v.headline}</GradText> : v.headline)}
          </div>
          <div style={{ fontFamily: FONT_BODY, fontSize: TS(H, 24, fontScale), color: muted,
            marginTop: H * 0.03, lineHeight: 1.45, maxWidth: "75%" }}>{T("subhead", {}, v.subhead)}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: FONT_EYEBROW, fontWeight: 800, fontSize: Math.max(13, H * 0.016 * fontScale),
            letterSpacing: 2.5, textTransform: "uppercase", color: brandColors?.secondary ?? BRAND.coral }}>⏱ {T("deadline", {}, v.deadline)}</div>
          <div style={{ background: resolveGrad(gradient, accent, brandColors),
            color: "#fff", padding: `${H * 0.022}px ${W * 0.025}px`, borderRadius: 12,
            fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: TS(H, 24, fontScale) }}>
            {T("cta", {}, v.cta)} →
          </div>
        </div>
      </div>
    </div>
  );
}

export const Tpl_Promo: Template = {
  id: "promo", name: "Promo / Offer", type: "Promotion",
  description: "Big offer with discount badge and deadline. Drives conversion.",
  pack: "pro" as const,
  variants: [{ id: "badge", name: "Badge corner" }, { id: "split", name: "Split with photo" }, { id: "stamp", name: "Stamp center" }],
  fields: [
    { key: "eyebrow", label: "Eyebrow", kind: "text" },
    { key: "headline", label: "Headline", kind: "textarea" },
    { key: "badgeText", label: "Badge text", kind: "text" },
    { key: "subhead", label: "Subhead", kind: "textarea" },
    { key: "deadline", label: "Deadline", kind: "text" },
    { key: "cta", label: "CTA text", kind: "text" },
    { key: "image", label: "Photo (split layout)", kind: "image" },
  ],
  defaults,
  render,
};
