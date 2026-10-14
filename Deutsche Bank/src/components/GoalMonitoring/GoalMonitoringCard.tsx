"use client";

import type { KeyboardEvent } from "react";
import type { GoalPortfolioData } from "@/types/goalMonitoring";
import { GoalChart } from "./GoalChart";

interface GoalMonitoringCardProps {
  portfolio: GoalPortfolioData;
  onExpand: () => void;
}

/** Level 1 — static chart; expand handled by parent container */
export function GoalMonitoringCard({ portfolio, onExpand }: GoalMonitoringCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onExpand();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onExpand}
      onKeyDown={handleKeyDown}
      aria-label={`Expand wealth monitoring for ${portfolio.title}`}
      className="w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--db-primary)] focus-visible:ring-offset-2"
    >
      <GoalChart data={portfolio.chartData} />
    </div>
  );
}

export default GoalMonitoringCard;
