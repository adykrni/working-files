import Image from "next/image";

export function StoryDisclaimer() {
  return (
    <div className="flex w-full items-start gap-2 border-t border-[#ccd3da] pt-[30px]">
      <Image
        src="/icons/info.svg"
        alt=""
        width={16}
        height={16}
        className="mt-0.5 shrink-0"
        aria-hidden
      />
      <p className="flex-1 text-sm leading-[1.4] text-muted">
        This case study describes work completed at Accenture Song for an enterprise client.
        Client identity, real names, and exact numbers are under NDA.
      </p>
    </div>
  );
}
