"use client";

import type { ValuationRange } from "./valuationChartUtils";
import { VALUATION_RANGE_LABELS, VALUATION_RANGES } from "./valuationChartUtils";

interface ValuationRangeBarProps {
  activeRange: ValuationRange;
  onChange: (range: ValuationRange) => void;
}

/** Figma 732:3021 — single baseline track, one active segment, labels below */
export function ValuationRangeBar({ activeRange, onChange }: ValuationRangeBarProps) {
  const activeIndex = VALUATION_RANGES.indexOf(activeRange);
  const segmentWidth = 100 / VALUATION_RANGES.length;
  const segmentLeft = activeIndex * segmentWidth;

  return (
    <div className="w-full">
      <div className="relative h-[3px] w-full rounded-full bg-[#1a69de]/15">
        <div
          className="absolute top-0 h-full rounded-full bg-[#1a69de] transition-[left] duration-200 ease-out"
          style={{ left: `${segmentLeft}%`, width: `${segmentWidth}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-1.5 grid w-full grid-cols-6">
        {VALUATION_RANGES.map((range) => {
          const isActive = range === activeRange;
          return (
            <button
              key={range}
              type="button"
              onClick={() => onChange(range)}
              className={`text-center text-[14px] leading-normal transition-colors ${
                isActive ? "font-medium text-[#3c4556]" : "text-[#3c4556]/70 hover:text-[#3c4556]"
              }`}
            >
              {VALUATION_RANGE_LABELS[range]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
