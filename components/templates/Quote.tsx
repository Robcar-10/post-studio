import type { ReactNode } from "react";
import type { RenderContext, Template } from "@/lib/types";
import { BRAND, FONT_DISPLAY, FONT_BODY, FONT_EYEBROW, getBg, getFg, getMuted, resolveAccent, resolveGrad, TS } from "@/lib/brand";
import { HeroBg } from "@/components/primitives/HeroBg";
import { StarRow } from "@/components/primitives/Logo";
import { makeT, makeR, makeIP } from "./helpers";

const defaults = {
  stars: 5,
  quote: "Rob is fantastic! He carried out a task of printing on 85 shirts for our business. Extremely diligent with our needs and delivered on time.",
  author: "Michael C.", authorMeta: "TCS, LLC", source: "Google Review · 5.0", image: null,
};

function render(ctx: RenderContext): ReactNode {
  const T = makeT(ctx); const R = makeR(ctx); const IP = makeIP(ctx);
  const v = { ...defaults, ...ctx.values } as typeof defaults & { image?: string | null };
  const { variant, theme, accent, gradient, size, fontScale = 1, onImageChange, brandColors } = ctx;
  const W = size.w, H = size.h;
  const bg = getBg(theme), fg = getFg(theme), muted = getMuted(theme);
  const padX = W * 0.07;
  const stars = typeof v.stars === "number" ? v.stars : 5;

  const Quoted = (
    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontStyle: "italic",
      fontSize: Math.min(H * 0.06, W * 0.052) * fontScale, lineHeight: 1.25, color: fg, letterSpacing: -0.5 }}>
      &ldquo;{T("quote", {}, v.quote)}&rdquo;
    </div>
  );
  const initials = (v.author || "").split(" ").map((s: string) => s[0]).slice(0, 2).join("");
  const Attribution = (
    <div style={{ display: "flex", alignItems: "center", gap: H * 0.018 }}>
      <div style={{ width: H * 0.06, height: H * 0.06, borderRadius: 999,
        background: resolveGrad(gradient, accent, brandColors),
        color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: H * 0.022,
        display: "flex", alignItems: "center", justifyContent: "center" }}>{initials}</div>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: TS(H, 26, fontScale), color: fg, lineHeight: 1.1 }}>
          {T("author", {}, v.author)}
        </div>
        <div style={{ fontFamily: FONT_BODY, fontSize: TS(H, 18, fontScale), color: muted, marginTop: 4 }}>
          {T("authorMeta", {}, v.authorMeta)}
        </div>
      </div>
    </div>
  );

  if (variant === "withphoto") {
    const isWide = W / H > 1.4;
    return (
      <div style={{ position: "absolute", inset: 0, background: bg, display: "flex", flexDirection: isWide ? "row" : "column" }}>
        <div style={{ flex: 1, position: "relative", minHeight: isWide ? "100%" : "40%" }}>
          {R("image", IP("image", { src: v.image, onSelect: onImageChange, style: { position: "absolute", inset: 0 } }), { mode: "image" })}
        </div>
        <div style={{ flex: 1.1, padding: `${H * 0.06}px ${W * 0.05}px`,
          display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <StarRow count={stars} size={Math.max(20, H * 0.028)}/>
            <div style={{ marginTop: H * 0.03 }}>{Quoted}</div>
          </div>
          <div>
            {Attribution}
            <div style={{ marginTop: H * 0.025, fontFamily: FONT_EYEBROW, fontSize: Math.max(11, H * 0.014 * fontScale),
              fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: muted }}>{T("source", {}, v.source)}</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "bigquote") {
    return (
      <div style={{ position: "absolute", inset: 0, background: bg }}>
        {theme === "dark" && <HeroBg/>}
        <div style={{ position: "absolute", inset: 0, padding: `${H * 0.08}px ${padX}px`,
          display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900,
              fontSize: Math.min(H * 0.22, W * 0.22), lineHeight: 0.7,
              color: gradient ? "transparent" : resolveAccent(accent, brandColors),
              background: gradient ? resolveGrad(true, accent, brandColors) : "none",
              WebkitBackgroundClip: gradient ? "text" : "border-box",
              backgroundClip: gradient ? "text" : "border-box",
              marginBottom: -H * 0.03 }}>&ldquo;</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800,
              fontSize: Math.min(H * 0.07, W * 0.062) * fontScale, lineHeight: 1.18, color: fg, letterSpacing: -1 }}>
              {T("quote", {}, v.quote)}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20 }}>
            <div>
              <StarRow count={stars} size={Math.max(18, H * 0.024)}/>
              <div style={{ marginTop: H * 0.018, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: TS(H, 24, fontScale), color: fg }}>
                {T("author", {}, v.author)} <span style={{ color: muted, fontWeight: 500 }}>· {T("authorMeta", {}, v.authorMeta)}</span>
              </div>
            </div>
            <div style={{ fontFamily: FONT_EYEBROW, fontSize: Math.max(11, H * 0.014 * fontScale), fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 2, color: muted }}>{T("source", {}, v.source)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: theme === "dark" ? BRAND.ink1 : BRAND.lavenderBg }}>
      {theme === "dark" && <HeroBg/>}
      <div style={{ position: "absolute", inset: 0, padding: `${H * 0.08}px ${padX}px`,
        display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          background: theme === "dark" ? "rgba(255,255,255,0.06)" : "#fff",
          border: theme === "dark" ? "1px solid rgba(255,255,255,0.12)" : `1px solid ${BRAND.lavenderBorder}`,
          borderRadius: Math.min(W, H) * 0.025, padding: `${H * 0.05}px ${W * 0.05}px`,
          boxShadow: theme === "dark" ? "none" : "0 20px 40px rgba(178,33,246,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: H * 0.03 }}>
            <StarRow count={stars} size={Math.max(20, H * 0.028)}/>
            <div style={{ fontFamily: FONT_EYEBROW, fontSize: Math.max(11, H * 0.014 * fontScale), fontWeight: 700,
              textTransform: "uppercase", letterSpacing: 2, color: muted }}>{T("source", {}, v.source)}</div>
          </div>
          {Quoted}
          <div style={{ marginTop: H * 0.04, paddingTop: H * 0.03,
            borderTop: theme === "dark" ? "1px solid rgba(255,255,255,0.12)" : "1px solid #F3F4F6" }}>
            {Attribution}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Tpl_Quote: Template = {
  id: "quote", name: "Testimonial", type: "Quote / review",
  description: "5-star review from a customer with attribution. Builds trust.",
  pack: "essential" as const,
  variants: [{ id: "card", name: "Card centered" }, { id: "bigquote", name: "Big quote" }, { id: "withphoto", name: "Photo + quote" }],
  fields: [
    { key: "stars", label: "Stars (1–5)", kind: "number", min: 1, max: 5 },
    { key: "quote", label: "Quote text", kind: "textarea" },
    { key: "author", label: "Author name", kind: "text" },
    { key: "authorMeta", label: "Author title / org", kind: "text" },
    { key: "source", label: "Source label", kind: "text" },
    { key: "image", label: "Photo (photo+quote)", kind: "image" },
  ],
  defaults,
  render,
};
