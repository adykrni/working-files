import Image from "next/image";
import { getPartnerLogo } from "@/data/partners";

type PartnerBrandProps = {
  name: string;
};

export function PartnerBrand({ name }: PartnerBrandProps) {
  const src = getPartnerLogo(name);

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {src ? (
        <Image
          src={src}
          alt={`${name} logo`}
          width={56}
          height={20}
          className="h-5 w-auto min-w-5 max-w-14 shrink-0 object-contain object-left"
          unoptimized
        />
      ) : (
        <span
          className="flex size-5 shrink-0 items-center justify-center rounded bg-[#e1edfc] text-[8px] font-bold text-[#003f72]"
          aria-hidden
        >
          {name.charAt(0)}
        </span>
      )}
      <span className="whitespace-nowrap text-[11px] font-medium leading-none text-[#003f72]">
        {name}
      </span>
    </div>
  );
}
