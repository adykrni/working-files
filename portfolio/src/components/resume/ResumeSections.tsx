import Image from "next/image";
import Link from "next/link";

import type { ResumeProject } from "@/lib/resume-content";

function TimelineDiamond() {
  return (
    <div className="flex size-[8.485px] shrink-0 items-center justify-center">
      <div className="size-[6px] rotate-45 rounded-[1px] bg-[#d0d0db]" aria-hidden />
    </div>
  );
}

function ResumeProjectBlock({ project }: { project: ResumeProject }) {
  const paragraphs = project.description.split("\n\n");

  return (
    <div className="flex flex-col gap-2.5">
      <p className="font-radio text-[15px] font-bold leading-[1.2] text-[#1b1e24]">{project.title}</p>
      <div className="font-radio text-[15px] font-normal leading-[1.4] text-[#1b1e24]">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={index < paragraphs.length - 1 ? "mb-0" : undefined}>
            {paragraph}
          </p>
        ))}
      </div>
      {project.imageSrc ? (
        <div className="mt-0.5 w-[300px]">
          <Image
            src={project.imageSrc}
            alt={project.imageAlt ?? ""}
            width={project.imageWidth ?? 2600}
            height={project.imageHeight ?? 1704}
            className="h-auto w-full"
            sizes="300px"
            unoptimized
          />
        </div>
      ) : null}
      {project.link ? (
        <Link
          href={project.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-radio text-[15px] leading-none text-[#1b1e24] transition-opacity hover:opacity-70"
        >
          {project.link.label}
          <Image src="/icons/external-link.svg" alt="" width={14} height={14} aria-hidden />
        </Link>
      ) : null}
    </div>
  );
}

type TimelineRoleProps = {
  period: string;
  company: string;
  summary: string;
  projects: ResumeProject[];
  isLast?: boolean;
};

export function TimelineRole({ period, company, summary, projects, isLast = false }: TimelineRoleProps) {
  return (
    <div className="flex items-stretch gap-[15px]">
      {/* Timeline rail — diamond + vertical line through all role content */}
      <div className="flex w-[15px] shrink-0 flex-col items-center">
        <TimelineDiamond />
        <div className="mt-1 min-h-0 w-px flex-1 bg-[#d0d0db]" aria-hidden />
      </div>

      {/* Content — period above company, then projects */}
      <div className={`flex min-w-0 flex-1 flex-col ${isLast ? "" : "pb-[30px]"}`}>
        <p className="font-radio text-[14px] leading-[1.2] text-[#1b1e24]">{period}</p>

        <div className="mt-[9px] flex flex-col gap-1.5">
          <p className="font-radio text-[15px] font-bold leading-[1.4] text-[#1b1e24]">{company}</p>
          <p className="font-radio text-[15px] font-normal leading-[1.4] text-[#1b1e24]">{summary}</p>
        </div>

        <div className="mt-10 flex flex-col gap-10">
          {projects.map((project) => (
            <ResumeProjectBlock key={project.title} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

type ResumeSectionLabelProps = {
  children: React.ReactNode;
};

export function ResumeSectionLabel({ children }: ResumeSectionLabelProps) {
  return (
    <p className="font-radio text-[12px] font-normal leading-none text-[#1b1e24]">{children}</p>
  );
}

type ResumeSkillBlockProps = {
  title: string;
  items: string;
};

export function ResumeSkillBlock({ title, items }: ResumeSkillBlockProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-radio text-[15px] font-bold leading-none text-[#1b1e24]">{title}</p>
      <p className="font-radio text-[15px] font-normal leading-[1.4] text-[#1b1e24]">{items}</p>
    </div>
  );
}

type ResumeEducationBlockProps = {
  degree: string;
  school: string;
};

export function ResumeEducationBlock({ degree, school }: ResumeEducationBlockProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-radio text-[15px] font-bold leading-none text-[#1b1e24]">{degree}</p>
      <p className="font-radio text-[15px] font-normal leading-[1.4] text-[#1b1e24]">{school}</p>
    </div>
  );
}
