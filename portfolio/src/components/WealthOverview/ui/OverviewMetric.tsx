import type { ReactNode } from "react";

interface OverviewMetricProps {
  label: string;
  children: ReactNode;
}

export function OverviewMetric({ label, children }: OverviewMetricProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px] leading-none text-[var(--db-muted)]">{label}</p>
      <div className="flex h-[22px] items-center leading-none">{children}</div>
    </div>
  );
}
