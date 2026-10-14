"use client";

import Image from "next/image";
import { Fragment } from "react";
import { Info, Plus } from "lucide-react";
import type { ComponentState } from "@/types";
import { getCardWidth, DEVICE_IMAGE_HEIGHT } from "@/types";
import { FindDealsButton } from "./FindDealsButton";
import { PartnerBrand } from "./PartnerBrand";

const CITY_IMAGE =
  "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80";

type OffersCardProps = {
  state: ComponentState;
};

function PlusSeparator({ className = "text-[#003f72]" }: { className?: string }) {
  return <Plus className={`size-3 shrink-0 ${className}`} strokeWidth={2.5} aria-hidden />;
}

function OfferText({ text, className }: { text: string; className?: string }) {
  const match = text.match(/(.*?)(€.+)$/);
  if (!match) {
    return <p className={className}>{text}</p>;
  }
  return (
    <p className={className}>
      {match[1]}
      <span className="font-bold">{match[2]}</span>
    </p>
  );
}

function ServiceTags({
  variant,
  showPartners,
  partner1,
  partner2,
}: {
  variant: "overlay" | "package";
  showPartners: boolean;
  partner1: string;
  partner2: string;
}) {
  const isOverlay = variant === "overlay";

  if (isOverlay) {
    return (
      <div className="flex flex-wrap items-center gap-2 py-0.5">
        <span className="text-xs leading-[1.3] text-white">Flights</span>
        <PlusSeparator className="text-white" />
        <span className="text-xs leading-[1.3] text-white">Hotels</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="flex items-center gap-2 rounded bg-[#e1edfc] px-1.5 py-1">
        <span className="text-xs leading-[1.3] text-[#003f72]">Flights</span>
        <PlusSeparator />
        <span className="text-xs leading-[1.3] text-[#003f72]">Hotels</span>
      </div>
      {showPartners && (
        <div className="flex flex-wrap items-center gap-2.5">
          <PartnerBrand name={partner1} />
          <PlusSeparator />
          <PartnerBrand name={partner2} />
        </div>
      )}
    </div>
  );
}

function CardDivider({ divider }: { divider: ComponentState["divider"] }) {
  if (divider === "Dotted") {
    return (
      <div
        className="h-px w-full border-t border-dashed border-[#cdd9e3]"
        role="separator"
      />
    );
  }
  return <div className="h-px w-full bg-[#cdd9e3]" role="separator" />;
}

function PackageDivider() {
  return <div className="h-px w-full bg-[#cdd9e3]" role="separator" />;
}

type PackageBlockProps = {
  label: string;
  offer: string;
  visible: boolean;
  showPartners: boolean;
  partner1: string;
  partner2: string;
};

function PackageBlock({
  label,
  offer,
  visible,
  showPartners,
  partner1,
  partner2,
}: PackageBlockProps) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
        visible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <p className="text-base font-normal leading-[1.3] text-[#003f72]">{label}</p>
              <Info
                className="size-4 shrink-0 text-[#003f72]/70"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
            <OfferText text={offer} className="text-base leading-[1.3] text-[#003f72]" />
            <ServiceTags
              variant="package"
              showPartners={showPartners}
              partner1={partner1}
              partner2={partner2}
            />
          </div>
          <div className="flex justify-start">
            <FindDealsButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OffersCard({ state }: OffersCardProps) {
  const width = getCardWidth(state.device, state.size);
  const imageHeight = DEVICE_IMAGE_HEIGHT[state.device];
  const isTeaser = state.content === "Teaser";

  const partnerConfigs = {
    economy: state.economyPartners,
    business: state.businessPartners,
    premium: state.premiumPartners,
  };

  const premiumOffer =
    state.premiumOffer.trim() || "3 nights, 4 days  from €649/person";

  const packages = [
    {
      key: "economy",
      visible: state.economy,
      label: "Economy class package",
      offer: state.economyOffer,
    },
    {
      key: "business",
      visible: state.business,
      label: "Business class package",
      offer: state.businessOffer,
    },
    {
      key: "premium",
      visible: state.premium,
      label: "Premium package",
      offer: premiumOffer,
    },
  ];

  const visiblePackages = packages.filter((pkg) => pkg.visible);

  if (isTeaser) {
    return (
      <article
        className="overflow-hidden rounded-[10px] transition-[width] duration-300 ease-in-out"
        style={{ width }}
      >
        <div
          className="relative flex flex-col justify-end p-5"
          style={{ height: imageHeight }}
        >
          <Image
            src={CITY_IMAGE}
            alt=""
            fill
            className="object-cover"
            sizes={`${width}px`}
            priority
          />
          <div
            className="absolute inset-0 rounded-[10px]"
            style={{
              background:
                "linear-gradient(186deg, rgba(0,0,0,0) 44%, rgba(0,0,0,0.8) 86%)",
            }}
            aria-hidden
          />
          <div className="relative z-10 flex flex-col gap-2">
            <p className="text-2xl leading-[1.3] text-white">{state.cityName}</p>
            <OfferText text={state.teaserOffer} className="text-sm leading-[1.3] text-white" />
            <ServiceTags
              variant="overlay"
              showPartners={false}
              partner1=""
              partner2=""
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="overflow-hidden rounded-[14px] border border-[#cdd9e3] bg-white transition-[width] duration-300 ease-in-out"
      style={{ width }}
    >
      {state.image && (
        <div className="relative w-full shrink-0" style={{ height: imageHeight }}>
          <Image
            src={CITY_IMAGE}
            alt=""
            fill
            className="object-cover"
            sizes={`${width}px`}
            priority
          />
        </div>
      )}

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-2xl leading-[1.3] text-[#003f72]">{state.cityName}</p>
          <p className="text-base leading-[1.3] text-[#003f72]">{state.countryName}</p>
        </div>

        <CardDivider divider={state.divider} />

        <div className="flex flex-col gap-5 px-0.5">
          {visiblePackages.map((pkg, index) => {
            const partners = partnerConfigs[pkg.key as keyof typeof partnerConfigs];
            return (
              <Fragment key={pkg.key}>
                {index > 0 && <PackageDivider />}
                <PackageBlock
                  label={pkg.label}
                  offer={pkg.offer}
                  visible
                  showPartners={partners.brandPartnership}
                  partner1={partners.partner1}
                  partner2={partners.partner2}
                />
              </Fragment>
            );
          })}

          {visiblePackages.length > 0 && (
            <>
              <PackageDivider />
              <p className="text-[10px] leading-[1.3] text-[#003f72]">
                * Including all mandatory costs
              </p>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
