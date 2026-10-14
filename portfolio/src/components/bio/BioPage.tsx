import Image from "next/image";

import { site } from "@/lib/content";

function AvatarDoodle() {
  return (
    <Image
      src="/icons/astrix.svg"
      alt=""
      width={12}
      height={12}
      aria-hidden
      className="shrink-0 animate-spin-slow"
    />
  );
}

export function BioPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-10 md:p-0">
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex items-center gap-[10px]">
          <AvatarDoodle />
          <p className="font-radio text-[16px] font-bold tracking-[0.16px] text-foreground">
            Aditya Kulkarni / Senior Product Designer
          </p>
        </div>

        <p className="w-full max-w-[660px] text-center font-radio text-[16px] font-normal leading-[1.4] tracking-[0.16px] text-foreground">
          yo, I’m a product designer who ships, and I love everything related to building a
          product - what to build, why to build, and who’s it for. Apologies, but the portfolio
          is currently being updated, until then you can reach out to me{" "}
          <a
            href={site.links.mail}
            className="underline decoration-solid underline-offset-2"
          >
            here
          </a>
          .
        </p>
      </div>
    </main>
  );
}
