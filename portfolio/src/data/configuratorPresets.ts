import type { ComponentState } from "@/types";
import { defaultState } from "@/types";

export type PresetId =
  | "economy-single"
  | "business-upsell"
  | "teaser"
  | "mobile-funnel";

export type ConfiguratorPreset = {
  id: PresetId;
  label: string;
  description: string;
  state: ComponentState;
};

export const CONFIGURATOR_PRESETS: ConfiguratorPreset[] = [
  {
    id: "economy-single",
    label: "Economy A/B",
    description: "Single tier with airline + hotel partners",
    state: {
      ...defaultState,
      device: "Desktop",
      content: "Full package",
      economy: true,
      business: false,
      premium: false,
      economyPartners: {
        brandPartnership: true,
        partner1: "Delta",
        partner2: "Marriott",
      },
    },
  },
  {
    id: "business-upsell",
    label: "Business upsell",
    description: "Two tiers with dotted divider",
    state: {
      ...defaultState,
      device: "Desktop",
      content: "Full package",
      divider: "Dotted",
      economy: true,
      business: true,
      premium: false,
      economyPartners: {
        brandPartnership: true,
        partner1: "Delta",
        partner2: "Marriott",
      },
      businessPartners: {
        brandPartnership: true,
        partner1: "Air France",
        partner2: "Hilton",
      },
    },
  },
  {
    id: "teaser",
    label: "Teaser card",
    description: "Hero overlay for landing pages",
    state: {
      ...defaultState,
      device: "Desktop",
      content: "Teaser",
      cityName: "Amsterdam",
      teaserOffer: "3 nights, 4 days  from €197/person",
    },
  },
  {
    id: "mobile-funnel",
    label: "Mobile funnel",
    description: "Single package on a narrow viewport",
    state: {
      ...defaultState,
      device: "Mobile",
      size: "Default",
      content: "Full package",
      economy: true,
      business: false,
      premium: false,
      economyPartners: {
        brandPartnership: false,
        partner1: "Delta",
        partner2: "Marriott",
      },
    },
  },
];
