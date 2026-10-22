"use client";
import { useEffect } from "react";

export function LandingClient() {
  useEffect(() => {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(a => {
      a.addEventListener("click", e => {
        const id = a.getAttribute("href");
        if (id && id.length > 1) {
          const el = document.querySelector(id);
          if (el) {
            e.preventDefault();
            window.scrollTo({ top: (el as HTMLElement).offsetTop - 70, behavior: "smooth" });
          }
        }
      });
    });

    document.querySelectorAll<HTMLElement>(".faq-item").forEach(item => {
      const q = item.querySelector<HTMLElement>(".faq-q");
      if (q) {
        q.addEventListener("click", () => {
          const wasOpen = item.classList.contains("open");
          document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
          if (!wasOpen) item.classList.add("open");
        });
      }
    });
  }, []);

  return null;
}
