"use client";
import { useState, useEffect, type ReactNode } from "react";
import { getCollapseCache, setCollapseKey, subscribeCollapse } from "@/lib/collapsible";

interface Props {
  id: string;
  title: string;
  defaultOpen?: boolean;
  badge?: string;
  className?: string;
  children: ReactNode;
}

export function CollapsibleSection({ id, title, defaultOpen = false, badge, className = "", children }: Props) {
  const [open, setOpen] = useState(() => {
    const cache = getCollapseCache();
    return id in cache ? cache[id] : defaultOpen;
  });

  useEffect(() => {
    return subscribeCollapse(() => {
      const cache = getCollapseCache();
      if (id in cache) setOpen(cache[id]);
    });
  }, [id]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    setCollapseKey(id, next);
  };

  return (
    <div className={`collapsible ${className}`}>
      <button className="coll-head" onClick={toggle} aria-expanded={open}>
        <span className="coll-title">{title}</span>
        {badge && <span className="coll-badge">{badge}</span>}
        <svg
          className="coll-chev"
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s" }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className="coll-body">{children}</div>}
    </div>
  );
}
