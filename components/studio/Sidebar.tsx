"use client";
import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import type { Template, Slide } from "@/lib/types";
import { ProGateModal } from "./ProGateModal";

interface Props {
  templates: Template[];
  activeTpl: string;
  allSlides: Slide[];
  setTplId: (id: string) => void;
  slideCount: number;
  isPro: boolean;
}

const PACK_LABELS: Record<string, string> = {
  essential: "Essential · Free",
  pro: "Pro",
};

export function Sidebar({ templates, activeTpl, allSlides, setTplId, slideCount, isPro }: Props) {
  const { user, isSignedIn } = useUser();
  const [showGate, setShowGate] = useState(false);
  const essential = templates.filter((t) => t.pack === "essential");
  const pro = templates.filter((t) => t.pack === "pro");

  function handleTplClick(t: Template) {
    if (t.pack === "pro" && !isPro) {
      setShowGate(true);
      return;
    }
    setTplId(t.id);
  }

  const renderGroup = (group: Template[], label: string, isPack: boolean) => (
    <>
      <div className="sect-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>{label}</span>
        {isPack && (
          <span style={{
            background: isPro ? "linear-gradient(90deg,#B221F6,#FF6452)" : "rgba(178,33,246,0.25)",
            color: isPro ? "#fff" : "rgba(255,255,255,0.5)",
            fontSize: 9, fontWeight: 800,
            letterSpacing: 1.5, padding: "2px 7px", borderRadius: 999,
          }}>{isPro ? "PRO ✓" : "PRO 🔒"}</span>
        )}
      </div>
      <div className="tpl-list">
        {group.map((t) => {
          const count = allSlides.filter((s) => s.tplId === t.id).length;
          const locked = t.pack === "pro" && !isPro;
          return (
            <button
              key={t.id}
              className={`tpl ${t.id === activeTpl ? "active" : ""} ${locked ? "tpl-locked" : ""}`}
              onClick={() => handleTplClick(t)}
            >
              <div className="tpl-name">
                {locked && <span style={{ marginRight: 4, opacity: 0.5 }}>🔒</span>}
                {t.name}
                {count > 0 && <span className="tpl-count">{count}</span>}
                <span className="tpl-variants">{t.variants.length} layouts</span>
              </div>
              <div className="tpl-type">{t.type}</div>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <img src="/rut-icon.png" width="36" height="36" alt="RUT"/>
          <div>
            <div className="bn">RUT Studio</div>
            <div className="bs">Brand-locked post designer</div>
          </div>
        </div>

        {renderGroup(essential, PACK_LABELS.essential, false)}
        {renderGroup(pro, PACK_LABELS.pro, true)}

        <div className="foot">
          {isSignedIn ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <UserButton />
              <div style={{ fontSize: 12, opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.primaryEmailAddress?.emailAddress ?? user?.fullName ?? "Account"}
              </div>
            </div>
          ) : (
            <a href="/sign-in" style={{ display: "block", marginBottom: 10, fontSize: 12, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
              Sign in to sync →
            </a>
          )}
          {!isPro && isSignedIn && (
            <button
              onClick={() => setShowGate(true)}
              style={{
                display: "block", width: "100%", marginBottom: 10, padding: "8px 0",
                background: "linear-gradient(90deg,#B221F6,#FF6452)",
                border: "none", borderRadius: 8, color: "#fff",
                fontSize: 11, fontWeight: 800, letterSpacing: 1, cursor: "pointer",
              }}
            >
              UPGRADE TO PRO →
            </button>
          )}
          <div style={{ opacity: 0.5 }}>
            v1.0 · {templates.length} templates · {slideCount} slides
          </div>
        </div>
      </aside>

      {showGate && <ProGateModal onClose={() => setShowGate(false)} />}
    </>
  );
}
