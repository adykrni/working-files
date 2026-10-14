export const airlinePartners = [
  "Delta",
  "Air France",
  "Kenya Airways",
  "Transavia",
  "Corsair",
  "SAS",
  "Tarom",
  "Air Austral",
  "GOL",
  "Xiamen Air",
] as const;

export const hotelPartners = [
  "Marriott",
  "Hilton",
  "NH Hotels",
  "Radisson",
  "IHG",
  "Accor",
  "Mövenpick",
  "citizenM",
  "Park Plaza",
  "Van der Valk",
] as const;

export type PartnerName = (typeof airlinePartners)[number] | (typeof hotelPartners)[number];

/** Local logo assets in /public/partners (Simple Icons + custom wordmarks) */
export const partnerLogoPaths: Record<PartnerName, string> = {
  Delta: "/partners/delta.svg",
  "Air France": "/partners/air-france.svg",
  "Kenya Airways": "/partners/kenya-airways.svg",
  Transavia: "/partners/transavia.svg",
  Corsair: "/partners/corsair.svg",
  SAS: "/partners/sas.svg",
  Tarom: "/partners/tarom.svg",
  "Air Austral": "/partners/air-austral.svg",
  GOL: "/partners/gol.svg",
  "Xiamen Air": "/partners/xiamen-air.svg",
  Marriott: "/partners/marriott.svg",
  Hilton: "/partners/hilton.svg",
  "NH Hotels": "/partners/nh-hotels.svg",
  Radisson: "/partners/radisson.svg",
  IHG: "/partners/ihg.svg",
  Accor: "/partners/accor.svg",
  Mövenpick: "/partners/movenpick.svg",
  citizenM: "/partners/citizenm.svg",
  "Park Plaza": "/partners/park-plaza.svg",
  "Van der Valk": "/partners/van-der-valk.svg",
};

export function getPartnerLogo(name: string): string | undefined {
  return partnerLogoPaths[name as PartnerName];
}
