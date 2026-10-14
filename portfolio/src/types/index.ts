export type Device = "Desktop" | "Tablet" | "Mobile";
export type Size = "Default" | "SM" | "MD" | "LG";
export type Content = "Teaser" | "Full package";
export type Divider = "Dotted" | "Solid";

export interface PackagePartners {
  brandPartnership: boolean;
  partner1: string;
  partner2: string;
}

export interface ComponentState {
  device: Device;
  size: Size;
  content: Content;
  image: boolean;
  cityName: string;
  countryName: string;
  teaserOffer: string;
  divider: Divider;
  economy: boolean;
  business: boolean;
  premium: boolean;
  economyOffer: string;
  businessOffer: string;
  premiumOffer: string;
  economyPartners: PackagePartners;
  businessPartners: PackagePartners;
  premiumPartners: PackagePartners;
}

export const defaultState: ComponentState = {
  device: "Desktop",
  size: "Default",
  content: "Full package",
  image: true,
  cityName: "Amsterdam",
  countryName: "Netherlands",
  teaserOffer: "3 nights, 4 days  from €197/person",
  divider: "Dotted",
  economy: true,
  business: false,
  premium: false,
  economyOffer: "3 nights, 4 days  from €197/person",
  businessOffer: "3 nights, 4 days  from €419/person",
  premiumOffer: "3 nights, 4 days  from €649/person",
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
  premiumPartners: {
    brandPartnership: true,
    partner1: "Transavia",
    partner2: "NH Hotels",
  },
};

export const CARD_WIDTH: Record<Exclude<Size, "Default">, number> = {
  SM: 300,
  MD: 420,
  LG: 520,
};

export const DEVICE_FRAME_WIDTH: Record<Device, number> = {
  Desktop: 600,
  Tablet: 450,
  Mobile: 320,
};

export const DEVICE_IMAGE_HEIGHT: Record<Device, number> = {
  Desktop: 350,
  Tablet: 280,
  Mobile: 200,
};

/** Default size follows device frame; SM/MD/LG use fixed widths */
export function getCardWidth(device: Device, size: Size): number {
  if (size === "Default") {
    return DEVICE_FRAME_WIDTH[device];
  }
  return CARD_WIDTH[size];
}
