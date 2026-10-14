import { ImageCarousel } from "@/components/ImageCarousel";
import { FloatingCaseStudyNav } from "@/components/floating-nav/FloatingCaseStudyNav";
import { BlockHeading, BlockBody } from "@/components/loryn-next/blocks";
import { LorynStoryTabs } from "@/components/loryn-next/LorynStoryTabs";

const lorynHeroScreens = [
  {
    src: "/images/Loryn-Screen-1.png",
    alt: "Loryn AI chat — Microsoft 365 license upgrade flow with license type selection",
  },
  {
    src: "/images/Loryn-Screen-2.png",
    alt: "Loryn AI chat — extend external employee account duration with date picker",
  },
  {
    src: "/images/Loryn-Screen-3.png",
    alt: "Loryn AI chat — PC health diagnosis connecting to IT support agent",
  },
  {
    src: "/images/Loryn-Screen-4.png",
    alt: "Loryn AI chat — device diagnostics permission prompt for slow laptop",
  },
] as const;

export default function LorynPage() {
  return (
    <main className="bg-white">
      <FloatingCaseStudyNav currentPage="loryn" />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-5 pb-20 pt-10 sm:px-6 md:px-8 md:pt-[122px]">
        <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-11">
          {/* Title + overview — shared across both tabs */}
          <div className="flex w-full max-w-[700px] flex-col gap-2.5">
            <BlockHeading>Loryn AI</BlockHeading>
            <BlockBody>
              Shipping an AI-first enterprise product for 12k+ Syngenta employees. Designing agent
              workflows that enterprise employees can trust.
            </BlockBody>
          </div>

          <div className="flex w-full max-w-[700px] flex-col gap-2.5">
            <BlockHeading>Overview</BlockHeading>
            <BlockBody>
              Loryn&apos;s long-term product goal is for it to replace the company&apos;s Employee
              Center - the entry to IT, HR, Finance and Procurement services. Today it&apos;s just a
              directory of links into ServiceNow.
            </BlockBody>
            <BlockBody>
              It went live in August 2025 as a proof of concept. I joined in October 2025 as the
              sole designer on the IT service management functionality, covering it end-to-end,
              and releasing it in March 2026. I was working with a client-side Experience Lead
              and Product Lead as daily partners, and a team of 7 engineers.
            </BlockBody>
            <BlockBody>
              Feature scoping came out of the PM&apos;s research; I have to be honest that
              research scope was limited for me. What I&apos;d have wanted to validate before is
              ticket volume and cost, so I went back to the ticket data afterward and checked.
              Identity & Access and Hardware & Devices are the two largest automatable ticket
              categories in that data.
            </BlockBody>
          </div>

          <ImageCarousel images={[...lorynHeroScreens]} className="w-full" />

          <LorynStoryTabs />
        </div>
      </div>
    </main>
  );
}
