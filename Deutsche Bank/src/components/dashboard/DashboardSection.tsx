import type { ReactNode } from "react";

const CARD_SHADOW =
  "0px 0.49px 0.979px 0px rgba(0,32,91,0.1), 0px 0.979px 0px -0.979px rgba(0,32,91,0.2), 0px 0px 0px 0.49px rgba(0,32,91,0.2)";

const TABLE_CARD_SHADOW =
  "0px 0.5px 1px 0px rgba(0,32,91,0.1), 0px 1px 0px -1px rgba(0,32,91,0.2), 0px 0px 0px 0.5px rgba(0,32,91,0.2)";

interface DashboardSectionProps {
  title: ReactNode;
  titleRight?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Holdings / standing orders — 6px padding per Figma */
  compact?: boolean;
  /** Stretch the content area to fill remaining section height */
  fill?: boolean;
}

export function DashboardSection({
  title,
  titleRight,
  children,
  className = "",
  compact = false,
  fill = false,
}: DashboardSectionProps) {
  return (
    <section
      className={`flex w-full min-w-0 flex-col rounded-[10px] bg-[var(--db-surface-light)] gap-[8px] p-[6px] ${
        fill ? "h-full min-h-0" : ""
      } ${className}`}
    >
      <div
        className={`flex shrink-0 flex-wrap items-center justify-between gap-2 ${
          compact ? "py-0.5 pr-0.5 pl-[6px]" : "px-[6px] py-0.5"
        }`}
      >
        <div className="min-w-0 font-display text-[14px] leading-normal text-[var(--db-primary)]">
          {title}
        </div>
        {titleRight ? <div className="shrink-0">{titleRight}</div> : null}
      </div>
      <div className={`w-full min-w-0 ${fill ? "flex min-h-0 flex-1 flex-col" : ""}`}>
        {children}
      </div>
    </section>
  );
}

export function DashboardCard({
  children,
  className = "",
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "table";
}) {
  return (
    <div
      className={`w-full min-w-0 bg-white p-[10px] ${
        variant === "table" ? "rounded-[6px]" : "rounded-[8px]"
      } ${className}`}
      style={{ boxShadow: variant === "table" ? TABLE_CARD_SHADOW : CARD_SHADOW }}
    >
      {children}
    </div>
  );
}

export { CARD_SHADOW, TABLE_CARD_SHADOW };
