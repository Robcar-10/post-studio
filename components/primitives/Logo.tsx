import { BRAND, FONT_DISPLAY } from "@/lib/brand";

interface Props {
  dark?: boolean;
  height?: number;
}

export function Logo({ dark = false, height = 38 }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, height }}>
      <img src="/assets/rut-icon.png" style={{ height, width: height, objectFit: "contain" }} alt=""/>
      <div style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 900,
        fontSize: height * 0.5,
        letterSpacing: -0.4,
        color: dark ? "#fff" : BRAND.fg900,
        lineHeight: 1,
      }}>ROLLED UP TEES</div>
    </div>
  );
}

export function Star({ size = 22, color = BRAND.star }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="12 2 15 9 22 9.3 16.5 14 18 21 12 17.3 6 21 7.5 14 2 9.3 9 9"/>
    </svg>
  );
}

export function StarRow({ count = 5, size = 22 }: { count?: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: count }).map((_, i) => <Star key={i} size={size}/>)}
    </div>
  );
}

export function Burst({ size = 120, color = BRAND.yellow, style = {} }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <path fill={color} d="M50 0 L58 32 L90 18 L74 48 L100 50 L74 52 L90 82 L58 68 L50 100 L42 68 L10 82 L26 52 L0 50 L26 48 L10 18 L42 32 Z"/>
    </svg>
  );
}

export function DiscountBadge({ text = "20% OFF", style = {}, size = 180 }: { text?: string; style?: React.CSSProperties; size?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, ...style }}>
      <Burst size={size} color={BRAND.coral} style={{ position: "absolute", inset: 0 }}/>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 900,
        fontSize: size * 0.18, textAlign: "center", lineHeight: 1, padding: size * 0.18,
      }}>{text}</div>
    </div>
  );
}
