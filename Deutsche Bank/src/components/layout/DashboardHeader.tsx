"use client";

import { CircleHelp, Menu } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="relative z-10 flex h-[42px] w-full shrink-0 items-center justify-between border-b border-[var(--db-border)] bg-white px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          className="flex size-4 items-center justify-center text-[var(--db-primary)] lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={16} strokeWidth={1.5} />
        </button>
        <h1 className="text-[12px] leading-normal text-[var(--db-primary)]">Net wealth</h1>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] leading-none text-[var(--db-primary)]">Dark theme</span>
          <button
            type="button"
            role="switch"
            aria-checked={false}
            aria-label="Toggle dark theme"
            className="relative flex h-[16.667px] w-[30px] shrink-0 items-center rounded-full border-[1.667px] border-transparent bg-[#e2e8f0] px-[1.667px]"
          >
            <span className="size-[13.333px] rounded-full bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)]" />
          </button>
        </div>
        <button
          type="button"
          className="flex size-4 items-center justify-center text-[var(--db-primary)]"
          aria-label="More information"
        >
          <CircleHelp size={16} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
