import type { Metadata } from "next";

import { FloatingSiteNav } from "@/components/floating-nav/FloatingSiteNav";
import { ResumePageContent } from "@/components/resume/ResumePageContent";

export const metadata: Metadata = {
  title: "Resume — Aditya Kulkarni",
  description:
    "Product designer with 5+ years shaping UI-led, systems-driven products across AI, automotive, and finance.",
};

export default function ResumePage() {
  return (
    <main className="bg-[#fcfcfc]">
      <FloatingSiteNav currentPage="resume" />
      <ResumePageContent />
    </main>
  );
}
