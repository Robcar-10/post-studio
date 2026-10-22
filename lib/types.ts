import type { ReactNode } from 'react';

export interface CanvasSize { w: number; h: number; label: string; short: string; }

export interface Crop { zoom: number; x: number; y: number; _reasoning?: string; }

export interface FieldStyle {
  font?: string;
  weight?: number;
  align?: string;
  color?: string;
  case?: string;
}

export interface BrandVoice {
  business: string;
  location: string;
  whatWeDo: string;
  voiceLean: string;
  usePhrases: string[];
  avoidPhrases: string[];
  sampleLine: string;
  includeEmoji: boolean;
  ctaDefault: string;
  // Brand Kit extras — stored in Supabase, fall back to RUT defaults
  colorPrimary: string;
  colorSecondary: string;
  logoUrl: string | null;
}

export interface Slide {
  id: string;
  tplId: string;
  variantId: string;
  theme: string;
  accent: string;
  gradient: boolean;
  fontScale: number;
  valuesByTpl: Record<string, Record<string, unknown>>;
}

export interface Project {
  slides: Slide[];
  activeIdx: number;
  activeTpl: string;
  sizeKey: string;
  exportSizes: string[];
  caption: string;
}

export interface RenderContext {
  values: Record<string, unknown>;
  variant: string;
  theme: string;
  accent: string;
  gradient: boolean;
  size: CanvasSize;
  fontScale: number;
  brandColors?: { primary: string; secondary: string };
  editable?: boolean;
  editKey?: string | null;
  setEditKey?: (k: string | null) => void;
  selectedKey?: string | null;
  setSelectedKey?: (k: string | null) => void;
  onTextChange?: (key: string, val: string) => void;
  onImageChange?: (dataUrl: string, key?: string) => void;
  scales: Record<string, number>;
  positions: Record<string, { x: number; y: number }>;
  styles: Record<string, FieldStyle>;
  crops: Record<string, Crop>;
  onScaleChange?: (key: string, val: number) => void;
  onPosChange?: (key: string, pos: { x: number; y: number }) => void;
  stageScale?: number;
}

export interface TemplateField {
  key: string;
  label: string;
  kind: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface TemplateVariant { id: string; name: string; }

export interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  pack: "essential" | "pro";
  variants: TemplateVariant[];
  fields: TemplateField[];
  defaults: Record<string, unknown>;
  render: (ctx: RenderContext) => ReactNode;
}

export interface DraftEntry {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumb: string | null;
  project: Project;
  isAutosave?: boolean;
}

export interface DraftStore {
  drafts: DraftEntry[];
  autosaveId: string | null;
}

export interface HistoryControls {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface SnapLine { x1: number; y1: number; x2: number; y2: number; }

export interface CarouselCard {
  eyebrow: string;
  number: string;
  title: string;
  body: string;
  footer: string;
}
