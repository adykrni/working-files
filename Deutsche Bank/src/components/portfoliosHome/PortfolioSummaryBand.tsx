/** Figma 1034:3252 — Portfolio Summary (inline band) */

import {
  formatHeroAsOfDate,
  formatHeroDayChange,
  formatHeroUsd,
  getHeroMetricsSummary,
} from "@/data/portfoliosHomeData";
import {
  DEFAULT_BENCHMARK_ID,
  formatHeroBenchmarkSpreadPts,
  getWealthBenchmark,
} from "@/data/wealthBenchmarks";

function toneClass(positive: boolean) {
  return positive ? "text-[#0c6a1c]" : "text-[#d72735]";
}

function formatDayChangeLine(amount: number, pct: number): string {
  const core = formatHeroDayChange(amount, pct);
  if (amount >= 0) return core.replace(/^\+/, "+ ");
  return core;
}

function DomainColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <p className="text-[10px] font-normal uppercase leading-[1.3] text-[#373f4c]">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function MetricRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex w-full items-center justify-between gap-3 text-[12px] leading-[1.35]">
      <span className="min-w-0 shrink text-[#373f4c]">{label}</span>
      <span className={`shrink-0 tabular-nums text-[#07132a] ${valueClassName ?? ""}`}>{value}</span>
    </div>
  );
}

function VerticalRule() {
  return <div className="mx-5 hidden w-px shrink-0 self-stretch bg-[#dfe3e9] lg:block" aria-hidden />;
}

export function PortfolioSummaryBand() {
  const m = getHeroMetricsSummary();
  const policy = getWealthBenchmark(DEFAULT_BENCHMARK_ID);
  const dayUp = m.dayGain.amount >= 0;
  const ytdUp = m.totalReturnYtdPct >= 0;
  const ytdValue = `${ytdUp ? "+" : "−"}${Math.abs(m.totalReturnYtdPct).toFixed(2)}%`;
  const spreadPts = formatHeroBenchmarkSpreadPts(m.totalReturnYtdPct, policy.ytdReturnPct);
  const spreadUp = m.totalReturnYtdPct >= policy.ytdReturnPct;

  return (
    <div
      data-node-id="1034:3252"
      data-name="Portfolio Summary"
      className="flex w-full min-h-[132px] flex-col gap-5 overflow-x-auto rounded-none bg-[#fafbfd] px-4 py-5 sm:flex-row sm:items-center sm:gap-0 sm:px-5 lg:-mx-0"
    >
      <div className="flex min-w-[188px] shrink-0 flex-col gap-3">
        <p className="text-[12px] leading-[1.35] text-[#373f4c]">
          <span className="uppercase">Total market value </span>
          <span className="normal-case">(As of {formatHeroAsOfDate(m.asOfDate)})</span>
        </p>
        <p className="text-[28px] leading-none tabular-nums text-[#07132a]">{formatHeroUsd(m.totalMarketValue)}</p>
        <p className={`text-[12px] leading-normal tabular-nums ${toneClass(dayUp)}`}>
          {formatDayChangeLine(m.dayGain.amount, m.dayGain.pct)}
        </p>
      </div>

      <VerticalRule />

      <div className="flex min-w-0 flex-1 flex-col gap-5 sm:flex-row sm:items-center sm:gap-0">
        <div className="min-w-[178px] shrink-0 sm:pl-0">
          <DomainColumn title="Performance">
            <MetricRow label="Total return YTD" value={ytdValue} valueClassName={toneClass(ytdUp)} />
            <MetricRow label="vs Benchmark" value={spreadPts} valueClassName={toneClass(spreadUp)} />
          </DomainColumn>
        </div>

        <VerticalRule />

        <div className="min-w-[200px] shrink-0 lg:min-w-[246px]">
          <DomainColumn title="Position">
            <MetricRow label="Net asset value" value={formatHeroUsd(m.netAssetValue)} />
            <MetricRow label="Liabilities" value={formatHeroUsd(m.liabilities)} />
          </DomainColumn>
        </div>

        <VerticalRule />

        <div className="min-w-[200px] shrink-0 lg:min-w-[246px]">
          <DomainColumn title="Liquidity">
            <MetricRow label="Available borrowing" value={formatHeroUsd(m.availableBorrowing)} />
            <MetricRow label="Cash" value={formatHeroUsd(m.cash)} />
          </DomainColumn>
        </div>
      </div>
    </div>
  );
}
