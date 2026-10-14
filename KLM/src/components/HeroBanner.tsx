import Image from "next/image";
import { Plus } from "lucide-react";

import { FindDealsButton } from "@/components/FindDealsButton";

const HERO_CARDS = [
  { city: "Rio di Janerio", offer: "3 nights, 4 days from €328" },
  { city: "Athens", offer: "3 nights, 4 days from €328" },
  { city: "Cancun", offer: "3 nights, 4 days from €328" },
  { city: "Istanbul", offer: "3 nights, 4 days from €328" },
] as const;

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

function ServicePill() {
  return (
    <div className="flex h-[25px] w-fit items-center gap-2 self-start rounded bg-[#e1edfc] px-1.5 py-0.5">
      <div className="flex items-center gap-1">
        <span className="text-xs leading-[1.3] text-[#003f72]">Flights</span>
        <Image
          src="/images/hero/airplane.svg"
          alt=""
          width={10}
          height={10}
          className="size-2.5 shrink-0"
          aria-hidden
        />
      </div>
      <Plus className="size-3 shrink-0 text-[#003f72]" strokeWidth={2.5} aria-hidden />
      <div className="flex items-center gap-1">
        <span className="text-xs leading-[1.3] text-[#003f72]">Hotels</span>
        <Image
          src="/images/hero/bed.svg"
          alt=""
          width={10}
          height={10}
          className="size-2.5 shrink-0"
          aria-hidden
        />
      </div>
    </div>
  );
}

function HeroOfferCard({ city, offer }: { city: string; offer: string }) {
  return (
    <article className="flex w-[clamp(200px,17.36vw,250px)] shrink-0 flex-col items-start gap-2.5 rounded-[10px] bg-white p-4">
      <p className="text-lg leading-[1.3] text-[#003f72]">{city}</p>
      <ServicePill />
      <OfferText text={offer} className="text-left text-sm leading-[1.3] text-[#003f72]" />
      <FindDealsButton className="h-10 w-full min-w-0 text-sm leading-[1.3]" />
    </article>
  );
}

export function HeroBanner() {
  return (
    <section
      className="relative aspect-[1440/568] w-full overflow-hidden rounded-[10px]"
      aria-labelledby="hero-heading"
    >
      <Image
        src="/images/hero/background.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 1280px) 100vw, 1280px"
        priority
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[rgba(37,40,64,0)] to-[rgba(37,40,64,0.8)]"
        aria-hidden
      />

      <div className="relative flex h-full flex-col items-center justify-end gap-[clamp(16px,2.08vw,30px)] px-[clamp(20px,4.44vw,64px)] pb-[clamp(20px,4.44vw,64px)] pt-8">
        <h2
          id="hero-heading"
          className="text-center text-[clamp(22px,2.5vw,36px)] font-medium leading-[1.3] text-white"
        >
          Find your perfect holiday package
        </h2>

        <div className="flex w-full justify-center gap-[clamp(12px,1.39vw,20px)] overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {HERO_CARDS.map((card) => (
            <HeroOfferCard key={card.city} city={card.city} offer={card.offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
