import type { ReactNode } from "react";
import type { RenderContext, Template } from "@/lib/types";
import { BRAND, FONT_DISPLAY, FONT_BODY, FONT_EYEBROW, getBg, getFg, getMuted, resolveAccent, resolveGrad, TS } from "@/lib/brand";
import { GradText } from "@/components/primitives/GradText";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { HeroBg } from "@/components/primitives/HeroBg";
import { Logo } from "@/components/primitives/Logo";
import { EditText } from "@/components/primitives/EditText";
import { makeT, makeR } from "./helpers";

const defaults = {
  eyebrow: "Now booking", headline: "Spring sports orders.", highlight: "Spring",
  subhead: "Get your team in fresh kits before the first game.",
  footer: "Link in bio · rolleduptees.com",
};

function render(ctx: RenderContext): ReactNode {
  const T = makeT(ctx); const R = makeR(ctx);
  const v = { ...defaults, ...ctx.values };
  const { variant, theme, accent, gradient, size, fontScale = 1, brandColors } = ctx;
  const W = size.w, H = size.h;
  const bg = getBg(theme), fg = getFg(theme), muted = getMuted(theme);
  const padX = W * 0.07;
  const headlineSize = Math.min(H * 0.11, W * 0.13) * fontScale;

  const renderHeadline = (): ReactNode => {
    const h = v.headline || "", hi = v.highlight || "";
    if (hi && h.toLowerCase().includes(hi.toLowerCase())) {
      const idx = h.toLowerCase().indexOf(hi.toLowerCase());
      return (
        <>
          {h.slice(0, idx)}
          {gradient
            ? <GradText>{h.slice(idx, idx + hi.length)}</GradText>
            : <span style={{ color: resolveAccent(accent, brandColors) }}>{h.slice(idx, idx + hi.length)}</span>}
          {h.slice(idx + hi.length)}
        </>
      );
    }
    return h;
  };

  if (variant === "block") {
    return (
      <div style={{ position: "absolute", inset: 0, background: bg }}>
        {theme === "dark" && <HeroBg/>}
        <div style={{ position: "absolute", inset: 0, padding: `${H * 0.08}px ${padX}px`,
          display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {R("logo", <Logo dark={theme === "dark"} height={Math.max(28, H * 0.03)}/>)}
          <div style={{
            background: resolveGrad(gradient, accent, brandColors),
            padding: `${H * 0.05}px ${W * 0.05}px`, borderRadius: Math.min(W, H) * 0.025,
            transform: "rotate(-1.2deg)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            {v.eyebrow && (
              <Eyebrow color="rgba(255,255,255,0.9)" size={Math.max(14, H * 0.018 * fontScale)} style={{ marginBottom: H * 0.025 }}>
                {T("eyebrow", {}, v.eyebrow)}
              </Eyebrow>
            )}
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: headlineSize,
              lineHeight: 0.92, letterSpacing: -headlineSize * 0.03, color: "#fff" }}>
              {T("headline", {}, v.headline)}
            </div>
          </div>
          <div style={{ fontSize: TS(H, 24, fontScale), color: muted, fontFamily: FONT_BODY,
            display: "flex", justifyContent: "space-between", gap: 20 }}>
            <div style={{ maxWidth: "70%" }}>{T("subhead", {}, v.subhead)}</div>
            <div style={{ opacity: 0.8 }}>{T("footer", {}, v.footer)}</div>
          </div>
        </div>
      </div>
    );
  }

  const align = variant === "centered" ? "center" : "flex-start";
  const textAlign = variant === "centered" ? "center" : "left";
  return (
    <div style={{ position: "absolute", inset: 0, background: bg }}>
      {theme === "dark" && <HeroBg/>}
      <div style={{ position: "absolute", inset: 0, padding: `${H * 0.08}px ${padX}px`,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        alignItems: align, textAlign: textAlign as React.CSSProperties["textAlign"] }}>
        <div style={{ width: "100%", display: "flex", justifyContent: variant === "centered" ? "center" : "flex-start" }}>
          {R("logo", <Logo dark={theme === "dark"} height={Math.max(28, H * 0.03)}/>)}
        </div>
        <div style={{ width: "100%", textAlign: textAlign as React.CSSProperties["textAlign"] }}>
          {v.eyebrow && (
            <Eyebrow color={gradient ? (brandColors?.secondary ?? BRAND.coral) : resolveAccent(accent, brandColors)}
              size={Math.max(14, H * 0.017 * fontScale)} style={{ marginBottom: H * 0.03 }}>
              {T("eyebrow", {}, v.eyebrow)}
            </Eyebrow>
          )}
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: headlineSize,
            lineHeight: 0.92, letterSpacing: -headlineSize * 0.035, color: fg }}>
            {ctx.editable
              ? <EditText fieldKey="headline" value={v.headline}
                  editable={ctx.editable} editKey={ctx.editKey} setEditKey={ctx.setEditKey}
                  selectedKey={ctx.selectedKey} setSelectedKey={ctx.setSelectedKey}
                  onChange={ctx.onTextChange} multi style={{}}>{v.headline}</EditText>
              : renderHeadline()}
          </div>
          {v.subhead && (
            <div style={{ fontFamily: FONT_BODY, fontSize: TS(H, 26, fontScale), lineHeight: 1.4,
              color: muted, marginTop: H * 0.035, maxWidth: variant === "centered" ? "100%" : "85%" }}>
              {T("subhead", {}, v.subhead)}
            </div>
          )}
        </div>
        <div style={{ width: "100%", display: "flex",
          justifyContent: variant === "centered" ? "center" : "flex-start",
          paddingTop: H * 0.025,
          borderTop: theme === "dark" ? "1px solid rgba(255,255,255,0.15)" : `1px solid ${BRAND.lavenderBorder}` }}>
          <div style={{ fontFamily: FONT_EYEBROW, fontSize: Math.max(12, H * 0.014 * fontScale), fontWeight: 700,
            letterSpacing: 2.5, textTransform: "uppercase", color: muted }}>
            {T("footer", {}, v.footer)}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Tpl_Announcement: Template = {
  id: "announcement", name: "Announcement", type: "Big statement",
  description: "Huge display type with optional gradient pop. Use for launches, big news.",
  pack: "essential" as const,
  variants: [{ id: "centered", name: "Centered" }, { id: "left", name: "Left aligned" }, { id: "block", name: "Color block" }],
  fields: [
    { key: "eyebrow", label: "Eyebrow", kind: "text" },
    { key: "headline", label: "Headline", kind: "textarea" },
    { key: "highlight", label: "Highlight word (gradient)", kind: "text" },
    { key: "subhead", label: "Subhead", kind: "textarea" },
    { key: "footer", label: "Footer line", kind: "text" },
  ],
  defaults,
  render,
};
