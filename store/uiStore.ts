"use client";
import { create } from "zustand";
import type { SnapLine } from "@/lib/types";

interface UIState {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  sizePopOpen: boolean;
  showSafeZones: boolean;
  showBrandVoice: boolean;
  showDrafts: boolean;
  editKey: string | null;
  selectedKey: string | null;
  aiBusy: boolean;
  status: string;
  copyFx: string;
  snapLines: SnapLine[];
  stageScale: number;

  setLeftCollapsed: (v: boolean) => void;
  setRightCollapsed: (v: boolean) => void;
  setSizePopOpen: (v: boolean) => void;
  setShowSafeZones: (v: boolean) => void;
  setShowBrandVoice: (v: boolean) => void;
  setShowDrafts: (v: boolean) => void;
  setEditKey: (k: string | null) => void;
  setSelectedKey: (k: string | null) => void;
  setAiBusy: (v: boolean) => void;
  setStatus: (s: string) => void;
  setCopyFx: (s: string) => void;
  setSnapLines: (lines: SnapLine[]) => void;
  setStageScale: (v: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  leftCollapsed: false,
  rightCollapsed: false,
  sizePopOpen: false,
  showSafeZones: false,
  showBrandVoice: false,
  showDrafts: false,
  editKey: null,
  selectedKey: null,
  aiBusy: false,
  status: "",
  copyFx: "",
  snapLines: [],
  stageScale: 0.4,

  setLeftCollapsed: (v) => set({ leftCollapsed: v }),
  setRightCollapsed: (v) => set({ rightCollapsed: v }),
  setSizePopOpen: (v) => set({ sizePopOpen: v }),
  setShowSafeZones: (v) => set({ showSafeZones: v }),
  setShowBrandVoice: (v) => set({ showBrandVoice: v }),
  setShowDrafts: (v) => set({ showDrafts: v }),
  setEditKey: (k) => set({ editKey: k }),
  setSelectedKey: (k) => set({ selectedKey: k }),
  setAiBusy: (v) => set({ aiBusy: v }),
  setStatus: (s) => set({ status: s }),
  setCopyFx: (s) => set({ copyFx: s }),
  setSnapLines: (lines) => set({ snapLines: lines }),
  setStageScale: (v) => set({ stageScale: v }),
}));
