export type PackId = "essential" | "pro";

export interface PackDef {
  id: PackId;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  features: string[];
  templateIds: string[];
}

export const PACKS: PackDef[] = [
  {
    id: "essential",
    name: "Essential",
    tagline: "Great posts, zero cost.",
    price: "Free",
    priceNote: "forever",
    features: [
      "2 templates (Announcement + Quote)",
      "All layout variants",
      "Dark, light & cream themes",
      "Export PNG for any size",
      "Brand voice settings",
    ],
    templateIds: ["announcement", "quote"],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "The full brand engine.",
    price: "$29",
    priceNote: "per month",
    features: [
      "All 8 templates + layout variants",
      "AI copy generation",
      "AI carousel builder",
      "Before & After showcase",
      "Photo Showcase templates",
      "Draft history (unlimited)",
      "Priority support",
    ],
    templateIds: ["announcement", "quote", "promo", "showcase", "beforeafter", "tip", "question", "carousel"],
  },
];

export const FREE_TEMPLATE_IDS = new Set(PACKS.find((p) => p.id === "essential")!.templateIds);
