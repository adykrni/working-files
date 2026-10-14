import type { ComponentState } from "@/types";

export type HighlightRegion =
  | "frame"
  | "image"
  | "header"
  | "divider"
  | "economy"
  | "business"
  | "premium"
  | "teaser";

export function getHighlightFromPatch(
  patch: Partial<ComponentState>,
): HighlightRegion | null {
  const keys = Object.keys(patch) as (keyof ComponentState)[];

  for (const key of keys) {
    if (key === "device" || key === "size" || key === "content") return "frame";
    if (key === "image") return "image";
    if (key === "cityName" || key === "countryName") return "header";
    if (key === "divider") return "divider";
    if (key === "teaserOffer") return "teaser";
    if (key.startsWith("economy")) return "economy";
    if (key.startsWith("business")) return "business";
    if (key.startsWith("premium")) return "premium";
  }

  return null;
}
