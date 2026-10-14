/** Figma 951:20552 — Portfolio Summary (pixel-matched export) */

import {
  formatHeroAsOfDate,
  formatHeroDayChange,
  formatHeroUsd,
  getHeroMetricsSummary,
} from "@/data/portfoliosHomeData";

const CARD_SHADOW =
  "shadow-[0px_0.5px_1px_0px_rgba(0,32,91,0.1),0px_1px_0px_-1px_rgba(0,32,91,0.2),0px_0px_0px_0.5px_rgba(0,32,91,0.2)]";

function dayChangeColor(positive: boolean) {
  return positive ? "text-[#0d6a1c]" : "text-[#d72735]";
}

function formatDayChangeLine(amount: number, pct: number): string {
  const core = formatHeroDayChange(amount, pct);
  if (amount >= 0) return core.replace(/^\+/, "+ ");
  return core;
}

export function HeroMetricsColumn() {
  const m = getHeroMetricsSummary();
  const dayUp = m.dayGain.amount >= 0;
  const ytdUp = m.totalReturnYtdPct >= 0;
  const ytdValue = `${ytdUp ? "+" : "−"}${Math.abs(m.totalReturnYtdPct).toFixed(2)}%`;

  return (
    <div
      data-node-id="951:20552"
      data-name="Portfolio Summary"
      className={
        "relative flex h-[320px] w-[320px] shrink-0 flex-col items-start justify-between overflow-clip " +
        "lg:h-full lg:min-h-0 lg:self-stretch " +
        "rounded-[20px] bg-[#fafbfd] p-[16px] " +
        CARD_SHADOW
      }
    >
      <div
        data-node-id="951:20554"
        data-name="Market Value Summary"
        className="relative flex w-full shrink-0 flex-col items-start gap-[10px] break-words whitespace-nowrap not-italic"
      >
        <p data-node-id="951:20555" className="relative shrink-0 text-[0px] leading-[0] text-[#383f4d]">
          <span className="text-[12px] leading-[1.3]">Total market value </span>
          <span className="text-[8px] leading-[1.3]">as of {formatHeroAsOfDate(m.asOfDate)}</span>
        </p>
        <p
          data-node-id="951:20556"
          className="relative shrink-0 text-[24px] leading-normal tabular-nums text-[#07132a]"
        >
          {formatHeroUsd(m.totalMarketValue)}
        </p>
        <div
          data-node-id="951:20557"
          data-name="Daily Change"
          className="relative flex w-full shrink-0 items-center gap-[4px] text-[12px]"
        >
          <p
            data-node-id="951:20559"
            className={`relative shrink-0 leading-normal tabular-nums ${dayChangeColor(dayUp)}`}
          >
            {formatDayChangeLine(m.dayGain.amount, m.dayGain.pct)}
          </p>
          <p data-node-id="951:20558" className="relative shrink-0 leading-[1.3] text-[#383f4d]">
            day change
          </p>
        </div>
      </div>

      <div data-node-id="953:20589" data-name="Divider" className="relative h-0 w-full shrink-0">
        <div className="absolute inset-[-0.5px_0] h-px bg-[#dfe3e9]" aria-hidden />
      </div>

      <div
        data-node-id="951:20581"
        data-name="Portfolio Metrics"
        className="relative flex w-full shrink-0 flex-col items-start gap-[20px] break-words whitespace-nowrap text-[12px] not-italic"
      >
        <div
          data-node-id="951:20561"
          data-name="Net Asset Value"
          className="relative flex w-full shrink-0 items-center justify-between leading-[1.3] text-[#383f4d]"
        >
          <p data-node-id="951:20562" className="relative shrink-0">
            Net asset value
          </p>
          <p data-node-id="951:20563" className="relative shrink-0 tabular-nums">
            {formatHeroUsd(m.netAssetValue)}
          </p>
        </div>
        <div
          data-node-id="951:20564"
          data-name="Liabilities"
          className="relative flex w-full shrink-0 items-center justify-between leading-[1.3] text-[#383f4d]"
        >
          <p data-node-id="951:20565" className="relative shrink-0">
            Liabilities
          </p>
          <p data-node-id="951:20566" className="relative shrink-0 tabular-nums">
            {formatHeroUsd(m.liabilities)}
          </p>
        </div>
        <div
          data-node-id="951:20567"
          data-name="Cash"
          className="relative flex w-full shrink-0 items-center justify-between leading-[1.3] text-[#383f4d]"
        >
          <p data-node-id="951:20568" className="relative shrink-0 capitalize tracking-[0.104px]">
            Cash
          </p>
          <p data-node-id="951:20569" className="relative shrink-0 tabular-nums">
            {formatHeroUsd(m.cash)}
          </p>
        </div>
        <div
          data-node-id="951:20570"
          data-name="Available Borrowing"
          className="relative flex w-full shrink-0 items-center justify-between leading-[1.3] text-[#383f4d]"
        >
          <p data-node-id="951:20571" className="relative shrink-0">
            Available borrowing
          </p>
          <p data-node-id="951:20572" className="relative shrink-0 tabular-nums">
            {formatHeroUsd(m.availableBorrowing)}
          </p>
        </div>
        <div
          data-node-id="951:20573"
          data-name="Total Return YTD"
          className="relative flex w-full shrink-0 items-center justify-between"
        >
          <p data-node-id="951:20574" className="relative shrink-0 leading-[1.3] text-[#383f4d]">
            Total return YTD
          </p>
          <p
            data-node-id="951:20575"
            className={`relative shrink-0 leading-normal tabular-nums ${dayChangeColor(ytdUp)}`}
          >
            {ytdValue}
          </p>
        </div>
      </div>
    </div>
  );
}
