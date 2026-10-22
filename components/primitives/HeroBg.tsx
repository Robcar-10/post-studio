import { GRAD_HERO_DARK } from "@/lib/brand";

export function HeroBg() {
  return (
    <div style={{ position: "absolute", inset: 0, background: GRAD_HERO_DARK, overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: -200, right: -200, width: 700, height: 700,
        background: "radial-gradient(circle, rgba(178,33,246,0.55) 0%, transparent 70%)",
      }}/>
      <div style={{
        position: "absolute", bottom: -250, left: -250, width: 800, height: 800,
        background: "radial-gradient(circle, rgba(255,100,82,0.45) 0%, transparent 70%)",
      }}/>
    </div>
  );
}
