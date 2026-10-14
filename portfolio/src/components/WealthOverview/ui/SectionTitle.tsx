import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] uppercase tracking-normal text-[var(--db-muted)]">{children}</p>
  );
}
