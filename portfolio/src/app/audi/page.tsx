import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AudiCaseStudyPage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6 px-6 py-24">
        <h1 className="text-base font-bold leading-[1.4] text-foreground">
          Unifying a global system for Audi
        </h1>

        <div className="flex h-[201px] w-full items-center justify-center overflow-hidden rounded-[10px] bg-surface-card">
          <p className="font-radio text-base font-bold uppercase leading-[1.4] text-foreground">
            Case study coming soon.
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex h-10 w-fit items-center gap-2 text-base font-medium text-foreground transition-opacity hover:opacity-80"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}
