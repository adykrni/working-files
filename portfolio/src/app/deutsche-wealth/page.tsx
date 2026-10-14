import Image from "next/image";

import { FloatingCaseStudyNav } from "@/components/floating-nav/FloatingCaseStudyNav";
import { SectionDivider } from "@/components/SectionDivider";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold leading-[1.4] text-foreground">{children}</h2>
  );
}

function SectionIntro({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-normal leading-[1.4] text-muted">{children}</p>;
}

type CaseStudyImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
};

function AspectCaseStudyImage({
  src,
  alt,
  width,
  height,
  priority = false,
  maxWidthClass = "max-w-[900px]",
  className = "",
}: CaseStudyImageProps & { maxWidthClass?: string }) {
  return (
    <div
      className={`relative mx-auto w-full ${maxWidthClass} ${className}`.trim()}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized
        sizes="(max-width: 768px) 100vw, 900px"
        className="object-contain"
      />
    </div>
  );
}

const contributions = [
  "Visual redesign — Modernized the entire UI language, moving from horizontal to vertical navigation",
  "Navigation architecture — Integrated portfolio selection into sidebar, eliminating navigation clutter",
  "UI pattern — Designed a Banner + Tabs pattern (Progressive Disclosure) that scales across multiple portfolio types",
  "Dashboard (Home) redesign — Structured hierarchy into hero metrics → alerts → portfolio grid → tabs, enabling 1-second portfolio understanding",
  "Component hierarchy — Designed insight cards with one-action-per-card governance, reducing cognitive load and support tickets",
] as const;

export default function DeutscheWealthCaseStudyPage() {
  return (
    <main className="bg-white">
      <FloatingCaseStudyNav currentPage="deutsche-wealth" />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-5 pb-20 pt-10 sm:px-6 md:px-8 md:pt-[122px]">
        {/* Intro */}
        <section className="mx-auto flex w-full max-w-[900px] flex-col gap-10 md:gap-[70px]">
          <div className="mx-auto flex w-full max-w-[700px] flex-col gap-10">
            <div className="flex flex-col gap-2.5">
              <h1 className="text-base font-semibold leading-[1.4] text-foreground">
                Deutsche Wealth Online +
              </h1>
              <SectionIntro>
                Redesigning portfolio management for Deutsche Bank. Modernized the desktop
                experience for 22k+ wealth managers to navigate portfolios, insights, and
                transactions with clarity and speed.
              </SectionIntro>
              <SectionIntro>
                I was the sole UI designer, and partnered with 1 Product Owner, 2 UX Designers,
                and 2 Engineers to align on information architecture and interaction patterns.
              </SectionIntro>
            </div>

            <div className="flex flex-col gap-2.5">
              <SectionHeading>My contributions:</SectionHeading>
              <ul className="flex flex-col gap-2.5">
                {contributions.map((item) => (
                  <li key={item} className="text-base leading-[1.4] text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <AspectCaseStudyImage
          src="/images/deutsche-wealth/db-new-1@3x.png"
          alt="Deutsche Wealth Online redesigned home dashboard with vertical navigation and portfolio grid"
          width={3843}
          height={2355}
          priority
          className="mt-10 md:mt-[70px]"
        />

        <SectionDivider className="mx-auto my-10 w-full max-w-[700px] md:my-[70px]" />

        {/* The challenge */}
        <section className="mx-auto flex w-full max-w-[900px] flex-col gap-10 md:gap-[70px]">
          <div className="mx-auto flex w-full max-w-[700px] flex-col gap-2.5">
            <SectionHeading>The challenge</SectionHeading>
            <SectionIntro>
              The old dashboard had a horizontal navigation model that was difficult to scale.
              Portfolio navigation competed with global actions. Tab-based architecture felt ad-hoc
              across different portfolio types. Hierarchy fell apart — users struggled with
              information overload and actions weren&apos;t prioritized by importance.
            </SectionIntro>
          </div>
        </section>

        <AspectCaseStudyImage
          src="/images/deutsche-wealth/db-old.png"
          alt="Deutsche Bank legacy dashboard with horizontal navigation and tab-based portfolio views"
          width={3843}
          height={2355}
          className="mt-10 md:mt-[70px]"
        />

        <SectionDivider className="mx-auto my-10 w-full max-w-[700px] md:my-[70px]" />

        {/* The Redesign */}
        <section className="mx-auto flex w-full max-w-[900px] flex-col gap-10 md:gap-[70px]">
          <div className="mx-auto flex w-full max-w-[700px] flex-col gap-2.5">
            <SectionHeading>The Redesign</SectionHeading>
            <SectionIntro>
              I redesigned the entire visual language. I led the UI pattern redesign, moving
              navigation to a vertical sidebar, integrated portfolio selection, and created a
              scalable banner + tabs system that worked across all portfolio types while
              maintaining information hierarchy.
            </SectionIntro>
            <SectionIntro>
              The outcome was a cleaner, faster experience where wealth managers can locate
              portfolios and the information they need in seconds, and access insights without
              friction. Every decision prioritized a high-level glance and progressive disclosure
              to manage complexity.
            </SectionIntro>
          </div>
        </section>

        <div className="mx-auto mt-10 flex w-full flex-col gap-10 md:mt-[70px] md:gap-[70px]">
          <AspectCaseStudyImage
            src="/images/deutsche-wealth/db-new-performance.png"
            alt="Redesigned Deutsche Wealth Online home screen with hero metrics and portfolio cards"
            width={3843}
            height={2355}
          />

          <AspectCaseStudyImage
            src="/images/deutsche-wealth/db-new-features.png"
            alt="Sidebar navigation, CIO Insights, and feature highlights in the redesigned dashboard"
            width={3840}
            height={2475}
          />

          <AspectCaseStudyImage
            src="/images/deutsche-wealth/db-new-allocations.png"
            alt="All portfolios view with standing orders table and portfolio summary banner"
            width={3843}
            height={2355}
          />

          <AspectCaseStudyImage
            src="/images/deutsche-wealth/db-new-table.png"
            alt="Standing orders table with security, order type, quantity, price, and status"
            width={3288}
            height={1503}
          />
        </div>

        <SectionDivider className="mx-auto my-10 w-full max-w-[700px] md:my-[70px]" />

        {/* The Outcome */}
        <section className="mx-auto flex w-full max-w-[700px] flex-col gap-2.5">
          <SectionHeading>The Outcome</SectionHeading>
          <SectionIntro>
            I delivered production-grade designs to the engineers, who built an MVP prototype.
            This MVP was tested with 27 users in task-based sessions built around one question:
            could a client answer &quot;how is my wealth doing?&quot; without help. I didn&apos;t
            have comparison metrics against the old dashboard, so there&apos;s no percentage lift
            to claim. What the test gives me is direct evidence that the new design did its job.
          </SectionIntro>
          <SectionIntro>
            What I found is that{" "}
            <span className="font-semibold text-foreground">19 / 27</span> users located their
            total wealth and read their direction of travel from the banner alone. What it
            confirmed: progressive disclosure was the right call. The layered model didn&apos;t
            just look cleaner — it matched the order in which clients actually ask their
            questions, which is what made the dense data feel manageable instead of overwhelming.
          </SectionIntro>
        </section>
      </div>
    </main>
  );
}
