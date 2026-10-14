"use client";

import type { WealthData } from "@/types/wealth";
import { Divider } from "../ui/Divider";
import { SectionTitle } from "../ui/SectionTitle";
import { MotionSection } from "../ui/MotionSection";
import { StatusDot } from "../ui/StatusDot";
import { formatSignedPercentParts, formatSignedPercentWhole } from "@/lib/format";

interface AdvisoryPortfolioContentProps {
  data: WealthData;
}

export function AdvisoryPortfolioContent({ data }: AdvisoryPortfolioContentProps) {
  const advisory = data.details.advisory;
  if (!advisory) return null;

  const ytdParts = formatSignedPercentParts(advisory.ytdPerformance);
  const equitiesMillions = (advisory.equitiesValue / 1_000_000).toFixed(1);
  const bondsMillions = (advisory.bondsValue / 1_000_000).toFixed(1);

  return (
    <div className="flex flex-col gap-5">
      <MotionSection className="flex flex-col gap-2.5">
        {/* Mobile — stacked sections */}
        <div className="flex flex-col gap-[50px] lg:hidden">
          <div className="flex flex-col gap-2.5">
            <SectionTitle>Performance</SectionTitle>
            <div className="flex flex-col gap-3">
              <p className="text-[14px] leading-none text-[var(--db-muted)]">YTD performance</p>
              <div className="flex h-3 items-center gap-1.5">
                <StatusDot variant="success" />
                <p className="text-[12px] leading-none text-[#454e5e]">
                  Outperforming the market by {formatSignedPercentWhole(advisory.outperformance)}.
                </p>
              </div>
              <HeroNumber whole={ytdParts.whole} suffix={ytdParts.suffix} />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <SectionTitle>Asset allocation</SectionTitle>
            <div className="flex flex-col gap-5 sm:flex-row sm:gap-[52px]">
              <AllocationColumn
                label="Equities"
                pct={advisory.equitiesAllocation}
                valueMillions={equitiesMillions}
                color="var(--db-equities)"
              />
              <AllocationColumn
                label="Bonds"
                pct={advisory.bondsAllocation}
                valueMillions={bondsMillions}
                color="var(--db-bonds)"
              />
            </div>
          </div>
        </div>

        {/* Desktop — 3-column grid, row 4 aligns all hero numbers */}
        <div className="hidden grid-cols-[212px_1fr_1fr] gap-x-[52px] gap-y-2.5 lg:grid">
          <SectionTitle>Performance</SectionTitle>
          <div className="col-span-2">
            <SectionTitle>Asset allocation</SectionTitle>
          </div>

          <p className="text-[14px] leading-none text-[var(--db-muted)]">YTD performance</p>
          <p className="text-[14px] leading-none text-[var(--db-muted)]">Equities</p>
          <p className="text-[14px] leading-none text-[var(--db-muted)]">Bonds</p>

          <div className="flex h-3 items-center gap-1.5">
            <StatusDot variant="success" />
            <p className="text-[12px] leading-none text-[#454e5e]">
              Outperforming the market by {formatSignedPercentWhole(advisory.outperformance)}.
            </p>
          </div>
          <div className="flex h-3 items-center">
            <AllocationBar pct={advisory.equitiesAllocation} color="var(--db-equities)" />
          </div>
          <div className="flex h-3 items-center">
            <AllocationBar pct={advisory.bondsAllocation} color="var(--db-bonds)" />
          </div>

          <HeroNumber whole={ytdParts.whole} suffix={ytdParts.suffix} />
          <HeroValuePair pct={advisory.equitiesAllocation} valueMillions={equitiesMillions} />
          <HeroValuePair pct={advisory.bondsAllocation} valueMillions={bondsMillions} />
        </div>
      </MotionSection>

      <Divider />

      <MotionSection className="flex flex-col gap-2.5">
        <SectionTitle>Holdings</SectionTitle>
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {advisory.holdings.map((h) => (
            <div
              key={h.id}
              className="flex h-[67px] min-w-[160px] flex-1 flex-col justify-between rounded-[6px] bg-[var(--db-surface-light)] px-2.5 py-2"
            >
              <p className="text-[14px] leading-5 text-[var(--db-primary)]">{h.security}</p>
              <div className="flex items-start justify-between">
                <p className="text-[var(--db-primary)]">
                  <span className="font-display text-[16px]">{h.allocation}</span>
                  <span className="text-[12px]">% allocation</span>
                </p>
                <p
                  className={`font-display text-[16px] ${h.return >= 0 ? "text-[var(--db-success)]" : "text-red-600"}`}
                >
                  {formatSignedPercentWhole(h.return)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </MotionSection>
    </div>
  );
}

function HeroNumber({ whole, suffix }: { whole: string; suffix: string }) {
  return (
    <p className="font-display leading-none text-[var(--db-primary)]">
      <span className="text-[22px]">{whole}</span>
      <span className="text-[12px]">{suffix}</span>
    </p>
  );
}

function AllocationBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-[6px] bg-[#eef3f7]">
      <div className="h-full rounded-[6px]" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function HeroValuePair({ pct, valueMillions }: { pct: number; valueMillions: string }) {
  return (
    <div className="flex items-end justify-between font-display leading-none text-[var(--db-primary)]">
      <p>
        <span className="text-[22px]">{pct}</span>
        <span className="text-[12px]">%</span>
      </p>
      <p>
        <span className="text-[22px]">{valueMillions}</span>
        <span className="text-[12px]">M USD</span>
      </p>
    </div>
  );
}

function AllocationColumn({
  label,
  pct,
  valueMillions,
  color,
}: {
  label: string;
  pct: number;
  valueMillions: string;
  color: string;
}) {
  return (
    <div className="flex min-w-[240px] flex-1 flex-col gap-3">
      <p className="text-[14px] leading-none text-[var(--db-muted)]">{label}</p>
      <div className="flex h-3 items-center">
        <AllocationBar pct={pct} color={color} />
      </div>
      <HeroValuePair pct={pct} valueMillions={valueMillions} />
    </div>
  );
}
