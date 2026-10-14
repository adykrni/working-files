import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { HeroImage } from "@/components/CaseStudyImage";
import { OffersConfigurator } from "@/components/OffersConfigurator";
import { SectionDivider } from "@/components/SectionDivider";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold leading-[1.4] text-foreground">{children}</h2>
  );
}

function SectionIntro({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-normal leading-[1.4] text-muted">{children}</p>;
}

function SubsectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase leading-[1.4] text-[#696d74]">
      {children}
    </p>
  );
}

const backButtonClassName =
  "inline-flex items-center justify-center gap-2 rounded-md bg-[#f1f1ef] p-2.5 text-sm font-medium text-[#171717] outline-none transition-colors hover:bg-surface-card focus:outline-none focus-visible:outline-none";

export default function KlmCaseStudyPage() {
  return (
    <main className="bg-background">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-5 pb-20 pt-10 sm:px-6 md:px-8 md:pt-[55px]">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-[900px] flex-col gap-10 md:gap-[70px]">
          <div className="mx-auto flex w-full max-w-[700px] flex-col gap-2.5">
            <h1 className="text-base font-semibold leading-[1.4] text-foreground">KLM Holidays</h1>
            <p className="text-base leading-[1.4] text-muted">
              KLM Holidays sells complete vacation packages in one booking. I designed a single,
              reconfigurable Offers component, shipped it to engineering, and its A/B-tested
              variants{" "}
              <span className="font-semibold text-[#151618]">
                lifted bookings 27% in the BeNeLux market.
              </span>
            </p>
            <a
              href="https://holidays.klm.nl/en"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-base leading-[1.4] text-muted underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Live link
            </a>
          </div>

          <HeroImage />
        </section>

        <SectionDivider className="mx-auto my-10 w-full max-w-[700px] md:my-[70px]" />

        {/* The bottleneck */}
        <section className="mx-auto flex w-full max-w-[900px] flex-col gap-6 md:gap-[25px]">
          <div className="mx-auto flex w-full max-w-[700px] flex-col gap-5">
            <SectionHeading>The bottleneck</SectionHeading>
            <SectionIntro>
              Product teams kept requesting variations of the Offers block — different layouts,
              package tiers, partner logos. The traditional path meant a designer in every sprint.
              That dependency was the thing slowing releases down.
            </SectionIntro>
          </div>

          <div className="mx-auto flex w-full max-w-[700px] flex-col gap-2.5">
            <SubsectionLabel>What I did</SubsectionLabel>
            <SectionIntro>
              I designed one flexible Offers component that teams could configure themselves
              through Figma component properties — swap content, toggle package tiers, change
              partner logos — without opening a design ticket. One component, one source of truth,
              built so product managers could ship A/B variants on their own timeline. Then I
              shipped it to engineering as a developer-ready build.
            </SectionIntro>
          </div>
        </section>

        <div className="mx-auto mt-10 w-full max-w-[1280px] md:mt-[70px]">
          <OffersConfigurator />
        </div>

        <SectionDivider className="mx-auto my-10 w-full max-w-[700px] md:my-[70px]" />

        {/* How I knew it worked */}
        <section className="mx-auto flex w-full max-w-[700px] flex-col gap-2.5">
          <SectionHeading>How I knew it worked</SectionHeading>
          <SectionIntro>
            Shipped to engineering and put into A/B testing across BeNeLux, the component&apos;s
            winning variants lifted bookings 27%, with 10+ variants run to tune the sales funnel.
            Product managers shipped offers independently — the designer-in-every-sprint bottleneck
            was gone.
          </SectionIntro>
        </section>

        <SectionDivider className="mx-auto my-10 w-full max-w-[700px] md:my-[70px]" />

        <div className="flex justify-center">
          <Link href="/" className={backButtonClassName}>
            <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}
