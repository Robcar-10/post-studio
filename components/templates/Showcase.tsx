import type { ReactNode } from "react";
import type { RenderContext, Template } from "@/lib/types";
import { BRAND, FONT_DISPLAY, FONT_BODY, TS, resolveAccent } from "@/lib/brand";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Logo } from "@/components/primitives/Logo";
import { makeT, makeR, makeIP } from "./helpers";

const defaults = {
  image: null, eyebrow: "Recent work",
  headline: "Custom kits for the Nyack Hawks.",
  footer: "Want one for your team? Link in bio.",
};

function render(ctx: RenderContext): ReactNode {
  const T = makeT(ctx); const R = makeR(ctx); const IP = makeIP(ctx);
  const v = { ...defaults, ...ctx.values } as typeof defaults & { image?: string | null };
  const { variant, theme, accent, size, fontScale = 1, onImageChange, brandColors } = ctx;
  const W = size.w, H = size.h;

  // ── minimal variant ───────────────────────────────────────────────────────
  if (variant === "minimal") {
    return (
      <div style={{ position: "absolute", inset: 0, background: BRAND.ink1 }}>
        {/* Full-bleed photo — NO gradient overlay */}
        {R("image", IP("image", {
          src: v.image,
          onSelect: (d: string) => onImageChange?.(d, "image"),
          label: "Drop hero photo",
          style: { position: "absolute", inset: 0 },
        }), { mode: "image" })}
        {/* Small bottom bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: H * 0.12,
          background: "rgba(0,0,0,0.72)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${W * 0.05}px`,
          gap: W * 0.04,
        }}>
          {R("logo", <Logo dark height={Math.max(22, H * 0.024)}/>)}
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: Math.min(H * 0.042, W * 0.038) * fontScale,
            lineHeight: 1.05, letterSpacing: -0.5,
            color: "#fff", textAlign: "right", flex: 1,
          }}>{T("headline", {}, v.headline)}</div>
        </div>
      </div>
    );
  }

  // ── frame variant ─────────────────────────────────────────────────────────
  if (variant === "frame") {
    const pad = W * 0.06;
    const ac = resolveAccent(accent, brandColors);
    return (
      <div style={{
        position: "absolute", inset: 0,
        background: ac,
        display: "flex", flexDirection: "column",
        padding: `${pad}px`,
      }}>
        {/* Eyebrow + headline ABOVE photo */}
        <div style={{ marginBottom: H * 0.03 }}>
          <Eyebrow color="#fff" size={Math.max(13, H * 0.016 * fontScale)}>{T("eyebrow", {}, v.eyebrow)}</Eyebrow>
          <div style={{
            fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: Math.min(H * 0.075, W * 0.068) * fontScale,
            lineHeight: 0.93, letterSpacing: -1.5, color: "#fff",
            marginTop: H * 0.018,
          }}>{T("headline", {}, v.headline)}</div>
        </div>
        {/* Inset photo box */}
        <div style={{
          flex: 1, position: "relative",
          borderRadius: 20, overflow: "hidden",
          background: BRAND.ink1,
        }}>
          {R("image", IP("image", {
            src: v.image,
            onSelect: (d: string) => onImageChange?.(d, "image"),
            label: "Drop hero photo",
            style: { position: "absolute", inset: 0 },
          }), { mode: "image" })}
        </div>
        {/* Logo at bottom */}
        <div style={{ marginTop: H * 0.03, display: "flex", justifyContent: "flex-start" }}>
          {R("logo", <Logo dark={false} height={Math.max(24, H * 0.026)}/>)}
        </div>
      </div>
    );
  }

  // ── bottom / corner variants (original) ───────────────────────────────────
  return (
    <div style={{ position: "absolute", inset: 0, background: BRAND.ink1 }}>
      {R("image", IP("image", { src: v.image, onSelect: (d: string) => onImageChange?.(d, "image"), label: "Drop hero photo",
        style: { position: "absolute", inset: 0 } }), { mode: "image" })}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: variant === "corner"
          ? "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 50%)"
          : "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 35%, rgba(22,0,40,0.85) 100%)" }}/>
      {variant === "corner" ? (
        <div style={{ position: "absolute", top: H * 0.06, left: W * 0.06, maxWidth: "65%" }}>
          <Eyebrow color={brandColors?.secondary ?? BRAND.coral} size={Math.max(14, H * 0.017 * fontScale)}>{T("eyebrow", {}, v.eyebrow)}</Eyebrow>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
            fontSize: Math.min(H * 0.075, W * 0.07) * fontScale, lineHeight: 0.95, letterSpacing: -1.5, color: "#fff", marginTop: H * 0.025 }}>
            {T("headline", {}, v.headline)}
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, padding: `${H * 0.06}px ${W * 0.06}px`,
          display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {R("logo", <Logo dark height={Math.max(26, H * 0.028)}/>)}
          <div>
            <Eyebrow color={brandColors?.secondary ?? BRAND.coral} size={Math.max(14, H * 0.017 * fontScale)}>{T("eyebrow", {}, v.eyebrow)}</Eyebrow>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
              fontSize: Math.min(H * 0.085, W * 0.075) * fontScale, lineHeight: 0.92, letterSpacing: -2,
              color: "#fff", marginTop: H * 0.025, maxWidth: "85%" }}>
              {T("headline", {}, v.headline)}
            </div>
            <div style={{ fontFamily: FONT_BODY, fontSize: TS(H, 22, fontScale), color: "rgba(255,255,255,0.8)",
              marginTop: H * 0.025 }}>{T("footer", {}, v.footer)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export const Tpl_Showcase: Template = {
  id: "showcase", name: "Photo showcase", type: "Photo-first",
  description: "Editorial full-bleed photo with overlay headline.",
  pack: "pro" as const,
  variants: [
    { id: "bottom", name: "Bottom overlay" },
    { id: "corner", name: "Corner tag" },
    { id: "minimal", name: "Minimal" },
    { id: "frame", name: "Frame" },
  ],
  fields: [
    { key: "image", label: "Hero photo", kind: "image" },
    { key: "eyebrow", label: "Eyebrow", kind: "text" },
    { key: "headline", label: "Headline", kind: "text" },
    { key: "footer", label: "Footer", kind: "text" },
  ],
  defaults,
  render,
};
