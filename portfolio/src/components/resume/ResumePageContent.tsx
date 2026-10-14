import {
  resumeEducation,
  resumeExperience,
  resumeIntro,
  resumeSkills,
} from "@/lib/resume-content";
import {
  ResumeEducationBlock,
  ResumeSectionLabel,
  ResumeSkillBlock,
  TimelineRole,
} from "@/components/resume/ResumeSections";

export function ResumePageContent() {
  return (
    <div className="mx-auto flex w-full max-w-[577px] flex-col gap-[30px] px-5 pb-20 pt-[111px] sm:px-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-radio text-[16px] font-bold leading-[1.4] text-[#1b1e24]">
          {resumeIntro.title}
        </h1>
        <p className="font-radio text-[16px] font-normal leading-[1.4] text-[#1b1e24]">
          {resumeIntro.summary}
        </p>
      </div>

      <section className="flex flex-col gap-[36px]">
        <ResumeSectionLabel>WORK EXPERIENCE</ResumeSectionLabel>

        <div className="flex flex-col">
          {resumeExperience.map((role, index) => (
            <TimelineRole
              key={role.company}
              period={role.period}
              company={role.company}
              summary={role.summary}
              projects={role.projects}
              isLast={index === resumeExperience.length - 1}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-[30px]">
        <ResumeSectionLabel>SKILLS</ResumeSectionLabel>
        <div className="flex flex-col gap-[30px]">
          {resumeSkills.map((group) => (
            <ResumeSkillBlock key={group.title} title={group.title} items={group.items} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-[30px]">
        <ResumeSectionLabel>EDUCATION</ResumeSectionLabel>
        <div className="flex flex-col gap-[30px]">
          {resumeEducation.map((entry) => (
            <ResumeEducationBlock key={entry.degree} degree={entry.degree} school={entry.school} />
          ))}
        </div>
      </section>
    </div>
  );
}
