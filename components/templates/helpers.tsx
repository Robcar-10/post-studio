import type { ReactNode, CSSProperties } from "react";
import type { RenderContext, FieldStyle } from "@/lib/types";
import { EditText } from "@/components/primitives/EditText";
import { Resizable } from "@/components/primitives/Resizable";
import { ImagePlaceholder } from "@/components/primitives/ImagePlaceholder";

export function mergeFieldStyle(baseStyle: CSSProperties, fieldStyle: FieldStyle | null | undefined): CSSProperties {
  if (!fieldStyle) return baseStyle;
  const FONT_PRESETS: Record<string, string> = {
    display: '"Work Sans", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    soft: '"Palanquin", "Inter", sans-serif',
    mono: "Menlo, Consolas, monospace",
    serif: 'Georgia, "Times New Roman", serif',
  };
  const out: CSSProperties = { ...baseStyle };
  if (fieldStyle.font && FONT_PRESETS[fieldStyle.font]) out.fontFamily = FONT_PRESETS[fieldStyle.font];
  if (fieldStyle.weight) out.fontWeight = fieldStyle.weight;
  if (fieldStyle.align) out.textAlign = fieldStyle.align as CSSProperties["textAlign"];
  if (fieldStyle.color) out.color = fieldStyle.color;
  if (fieldStyle.case && fieldStyle.case !== "none") {
    out.textTransform = fieldStyle.case === "upper" ? "uppercase"
      : fieldStyle.case === "lower" ? "lowercase"
      : fieldStyle.case === "title" ? "capitalize"
      : "none";
  }
  return out;
}

export function makeT(ctx: RenderContext) {
  return function T(key: string, style: CSSProperties, value: string, opts: { multi?: boolean; children?: ReactNode } = {}): ReactNode {
    const scale = (ctx.scales || {})[key] || 1;
    const pos = (ctx.positions || {})[key] || null;
    const fieldStyle = (ctx.styles || {})[key] || null;
    const mergedStyle = mergeFieldStyle(style, fieldStyle);
    const text = (
      <EditText
        fieldKey={key} value={value}
        editable={ctx.editable} editKey={ctx.editKey} setEditKey={ctx.setEditKey}
        selectedKey={ctx.selectedKey} setSelectedKey={ctx.setSelectedKey}
        onChange={ctx.onTextChange} multi={opts.multi !== false}
        style={mergedStyle}
      >{opts.children ?? value}</EditText>
    );
    const hasTransform = scale !== 1 || (pos && (pos.x || pos.y));
    if (!ctx.editable) {
      if (hasTransform) {
        return (
          <span style={{ display: "inline-block", transform: `translate(${pos?.x || 0}px, ${pos?.y || 0}px) scale(${scale})`, transformOrigin: "center center" }}>
            {text}
          </span>
        );
      }
      return text;
    }
    return (
      <Resizable
        fieldKey={key} editable={ctx.editable}
        selectedKey={ctx.selectedKey} setSelectedKey={ctx.setSelectedKey}
        scale={scale} pos={pos} stageScale={ctx.stageScale}
        onScaleChange={ctx.onScaleChange} onPosChange={ctx.onPosChange} mode="inline"
      >
        {text}
      </Resizable>
    );
  };
}

export function makeR(ctx: RenderContext) {
  return function R(key: string, children: ReactNode, opts: { mode?: "inline" | "fill" | "image" } = {}): ReactNode {
    const scale = (ctx.scales || {})[key] || 1;
    const pos = (ctx.positions || {})[key] || null;
    const hasTransform = scale !== 1 || (pos && (pos.x || pos.y));
    if (!ctx.editable) {
      if (!hasTransform) return children;
      const t = `translate(${pos?.x || 0}px, ${pos?.y || 0}px) scale(${scale})`;
      if (opts.mode === "fill" || opts.mode === "image") {
        return <div style={{ position: "absolute", inset: 0, transform: t, transformOrigin: "center center" }}>{children}</div>;
      }
      return <span style={{ display: "inline-block", transform: t, transformOrigin: "center center" }}>{children}</span>;
    }
    return (
      <Resizable
        fieldKey={key} editable={ctx.editable}
        selectedKey={ctx.selectedKey} setSelectedKey={ctx.setSelectedKey}
        scale={scale} pos={pos} stageScale={ctx.stageScale}
        onScaleChange={ctx.onScaleChange} onPosChange={ctx.onPosChange}
        mode={opts.mode || "inline"}
      >
        {children}
      </Resizable>
    );
  };
}

export function makeIP(ctx: RenderContext) {
  return function IP(key: string, props: {
    src?: string | null;
    onSelect?: (d: string) => void;
    style?: CSSProperties;
    label?: string;
  } = {}): ReactNode {
    const crop = (ctx.crops || {})[key] || null;
    return <ImagePlaceholder {...props} fieldKey={key} crop={crop}/>;
  };
}
