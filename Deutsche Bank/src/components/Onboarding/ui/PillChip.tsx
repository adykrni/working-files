"use client";

import { Check } from "lucide-react";
import { ONBOARDING_INPUT_SHADOW } from "@/types/onboarding";

interface PillChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export function PillChip({ label, selected, onToggle }: PillChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={[
        "rounded-[100px] px-5 py-2.5 text-[14px] leading-none transition-colors",
        selected
          ? "bg-[var(--db-primary)] text-white"
          : "bg-white text-[var(--db-primary)]",
      ].join(" ")}
      style={
        selected
          ? undefined
          : { boxShadow: ONBOARDING_INPUT_SHADOW }
      }
    >
      {label}
    </button>
  );
}

export function PortfolioRow({
  label,
  value,
  selected,
  onToggle,
  showCheck,
}: {
  label: string;
  value: number;
  selected: boolean;
  onToggle: () => void;
  showCheck?: boolean;
}) {
  const { whole, decimals } = formatPortfolioValue(value);

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-1 py-0.5 text-left"
    >
      <p className="truncate font-display text-[var(--db-primary)]">
        <span className="text-[16px] leading-normal">{label} - {whole}.</span>
        <span className="text-[12px] leading-normal">{decimals} USD</span>
      </p>
      {showCheck && selected && (
        <Check size={14} strokeWidth={2} className="shrink-0 text-[var(--db-primary)]" />
      )}
    </button>
  );
}

function formatPortfolioValue(value: number): { whole: string; decimals: string } {
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [whole, decimals = "00"] = formatted.split(".");
  return { whole, decimals };
}
