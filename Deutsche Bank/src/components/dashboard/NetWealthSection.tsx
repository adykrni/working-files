"use client";

import type { ReactNode } from "react";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import { useWealthData } from "@/hooks/useWealthData";
import {
  formatCurrencyParts,
  formatSignedPercent,
  formatSignedPercentTab,
  percentColorClass,
} from "@/lib/format";
import type { PortfolioId, WealthData } from "@/types/wealth";
import { DashboardCard, DashboardSection } from "./DashboardSection";

const TAB_SHADOW =
  "shadow-[0px_1px_4px_0px_rgba(0,32,91,0.1),0px_1px_0px_-1px_#00205b,0px_0px_0px_0.5px_rgba(0,32,91,0.8)]";

const EXECUTION_SECTOR_COLORS: Record<string, string> = {
  Technology: "#2563eb", // blue
  Healthcare: "#16a34a", // green
  Finance: "#ca8a04", // gold
  Industries: "#ea580c", // orange
  Consumer: "#9333ea", // purple
  Others: "#db2777", // magenta
};

function executionSectorColor(sector: string): string {
  return EXECUTION_SECTOR_COLORS[sector] ?? "#64748b";
}

function SplitCurrency({
  value,
  currency = "USD",
  wholeClassName = "text-[18px]",
}: {
  value: number;
  currency?: string;
  wholeClassName?: string;
}) {
  const { whole, decimals } = formatCurrencyParts(value);
  return (
    <span className="text-[var(--db-primary)]">
      <span className={`leading-normal ${wholeClassName}`}>{whole}</span>
      <span className="text-[10px] leading-normal">
        .{decimals} {currency}
      </span>
    </span>
  );
}

function SplitPercentGreen({ value }: { value: number }) {
  const abs = Math.abs(value);
  const formatted = Number.isInteger(abs) ? abs.toFixed(0) : abs.toFixed(1);
  const sign = value < 0 ? "-" : "+";
  return (
    <span className="text-[#088242]">
      <span className="text-[14px] leading-[1.3]">
        {sign}
        {formatted}
      </span>
      <span className="text-[10px] leading-[1.3]">%</span>
    </span>
  );
}

function AllocationLabel({
  label,
  percent,
  value,
}: {
  label: string;
  percent: number;
  value: number;
}) {
  const millions = (value / 1_000_000).toFixed(1);
  return (
    <p className="whitespace-nowrap text-[var(--db-primary)]">
      <span className="text-[14px] leading-normal">
        {label} | {percent}% | {millions}M
      </span>
      <span className="text-[10px] leading-normal">USD</span>
    </p>
  );
}

function MetricColumn({
  label,
  value,
  labelClassName = "text-[13.709px] text-[#374152]",
  width,
}: {
  label: string;
  value: ReactNode;
  labelClassName?: string;
  width?: string;
}) {
  return (
    <div
      className="flex min-w-0 flex-col gap-[5.875px]"
      style={width ? { width } : undefined}
    >
      <p className={`leading-normal ${labelClassName}`}>{label}</p>
      {value}
    </div>
  );
}

function PortfolioTabs({
  data,
  selectedId,
  onSelect,
}: {
  data: WealthData;
  selectedId: PortfolioId;
  onSelect: (id: PortfolioId) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-[6px] sm:grid-cols-2 lg:grid-cols-4">
      {data.portfolios.map((portfolio) => {
        const isSelected = portfolio.id === selectedId;
        return (
          <button
            key={portfolio.id}
            type="button"
            onClick={() => onSelect(portfolio.id as PortfolioId)}
            className={`flex flex-col gap-1 rounded-[6px] bg-[#fafafa] p-[10px] text-left transition-shadow ${
              isSelected ? TAB_SHADOW : ""
            }`}
          >
            <p className="truncate text-[12px] leading-[1.2] text-[var(--db-primary)]">
              {portfolio.name}
            </p>
            <div className="flex items-center justify-between gap-2">
              <SplitCurrency value={portfolio.value} currency={portfolio.currency} />
              <span
                className={`shrink-0 text-[12px] leading-[1.2] ${percentColorClass(portfolio.changePercentage)}`}
              >
                {formatSignedPercentTab(portfolio.changePercentage)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function AllPortfoliosDetails({ data }: { data: WealthData }) {
  const all = data.details.allPortfolios;
  if (!all) return null;

  const segments = [
    {
      label: "Equities",
      percent: all.equitiesAllocation,
      value: all.equitiesValue,
      color: "#29b6f6",
      width: "482px",
    },
    {
      label: "Bonds",
      percent: all.bondsAllocation,
      value: all.bondsValue,
      color: "#7b83ef",
      width: "308px",
    },
    {
      label: "Cash",
      percent: all.cashAllocation,
      value: all.cashValue,
      color: "#a87ce2",
      flex: true,
    },
  ] as const;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-4">
        <MetricColumn
          label="Market value of assets"
          value={<SplitCurrency value={all.marketValueOfAssets} />}
          width="162px"
        />
        <MetricColumn
          label="Net asset value"
          value={<SplitCurrency value={all.netAssetValue} />}
          width="162px"
        />
        <MetricColumn
          label="Liabilities"
          value={<SplitCurrency value={all.liabilities} />}
          width="162px"
        />
        <MetricColumn
          label="Cash"
          labelClassName="text-[14px] capitalize tracking-[0.104px] text-[#535b61]"
          value={<SplitCurrency value={all.cash} />}
          width="187px"
        />
        <MetricColumn
          label="Available borrowing"
          value={<SplitCurrency value={all.availableBorrowing} />}
          width="162px"
        />
      </div>

      <div className="flex w-full flex-col items-stretch gap-[13px] pb-[10px] md:flex-row md:items-center">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={`flex min-w-0 flex-col gap-[10px] ${
              "flex" in segment && segment.flex ? "md:min-w-0 md:flex-1" : "md:shrink-0"
            }`}
            style={"width" in segment && segment.width ? { width: segment.width } : undefined}
          >
            <div
              className="h-[10px] w-full rounded-[7.834px]"
              style={{ backgroundColor: segment.color }}
            />
            <AllocationLabel
              label={segment.label}
              percent={segment.percent}
              value={segment.value}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function AdvisoryDetails({ data }: { data: WealthData }) {
  const advisory = data.details.advisory;
  if (!advisory) return null;

  const scrollHoldings = [
    ...advisory.holdings,
    ...advisory.holdings.slice(0, 2),
    {
      ...advisory.holdings[advisory.holdings.length - 1],
      showAllocation: true,
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col gap-1">
        <p className="truncate text-[13.709px] text-[#59616f]">Your holdings</p>
        <div className="flex items-center gap-[10px] overflow-x-auto pb-1">
          {scrollHoldings.map((holding, index) => {
            const showAllocation = "showAllocation" in holding && holding.showAllocation;
            return (
              <div key={`${holding.id}-${index}`} className="flex shrink-0 items-center gap-[10px]">
                {index > 0 ? (
                  <div className="h-10 w-px shrink-0 bg-[#dee3ec]" aria-hidden />
                ) : null}
                <div className="flex flex-col gap-1 rounded-[6px] px-[6px] py-[2px]">
                  <p className="whitespace-nowrap text-[14px] leading-[1.3] text-[var(--db-primary)]">
                    {holding.security}
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <SplitPercentGreen value={holding.return} />
                    {showAllocation ? (
                      <p className="whitespace-nowrap text-[14px] leading-[1.3] text-[var(--db-primary)]">
                        {holding.allocation}% allocation
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-[13px] pb-[10px]">
          <div className="flex w-[438px] shrink-0 flex-col gap-[10px]">
            <div className="h-[10px] w-full rounded-[7.834px] bg-[#29b6f6]" />
            <AllocationLabel
              label="Equities"
              percent={advisory.equitiesAllocation}
              value={advisory.equitiesValue}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
            <div className="h-[10px] w-full rounded-[7.834px] bg-[#7b83ef]" />
            <AllocationLabel
              label="Bonds"
              percent={advisory.bondsAllocation}
              value={advisory.bondsValue}
            />
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col justify-center gap-1 text-[14px] leading-normal lg:w-[246px]">
          <div className="flex items-center justify-between text-[var(--db-primary)]">
            <span>YTD performance</span>
            <span>{formatSignedPercent(advisory.ytdPerformance)}</span>
          </div>
          <div className="flex items-center justify-between text-[#748096]">
            <span>Benchmark</span>
            <span>{formatSignedPercent(advisory.benchmark)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function ExecutionDetails({ data }: { data: WealthData }) {
  const execution = data.details.execution;
  if (!execution) return null;

  const flexSectors = execution.sectorBreakdown.slice(0, 5);
  const othersSector = execution.sectorBreakdown[5];

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-4">
        <MetricColumn
          label="Incoming"
          labelClassName="text-[13.709px] text-[#59616f]"
          value={<SplitCurrency value={execution.incoming} />}
          width="162px"
        />
        <MetricColumn
          label="Outgoing"
          labelClassName="text-[13.709px] text-[#59616f]"
          value={<SplitCurrency value={execution.outgoing} />}
          width="162px"
        />
        <MetricColumn
          label="Gains"
          labelClassName="text-[13.709px] text-[#59616f]"
          value={<SplitCurrency value={execution.gains} />}
          width="162px"
        />
      </div>

      <div className="flex w-full flex-col gap-[10px]">
        <p className="truncate text-[12px] text-[#6d7686]">HOLDINGS OVERVIEW</p>
        <div className="flex w-full items-start gap-[10px]">
          {flexSectors.map((sector) => (
            <div key={sector.sector} className="flex min-w-0 flex-1 flex-col gap-2">
              <div
                className="h-[8px] w-full rounded-[6px]"
                style={{ backgroundColor: executionSectorColor(sector.sector) }}
              />
              <div className="flex items-center gap-[7px] whitespace-nowrap text-[14px] text-[var(--db-primary)]">
                <span className="leading-normal">{sector.sector}</span>
                <span className="leading-[1.2]">{sector.percentage}%</span>
              </div>
            </div>
          ))}
          {othersSector ? (
            <div className="flex shrink-0 flex-col gap-2">
              <div
                className="h-[8px] w-[111px] rounded-[6px]"
                style={{ backgroundColor: executionSectorColor(othersSector.sector) }}
              />
              <div className="flex items-center gap-[7px] whitespace-nowrap text-[14px] text-[var(--db-primary)]">
                <span className="leading-normal">{othersSector.sector}</span>
                <span className="leading-[1.2]">{othersSector.percentage}%</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function RetirementDetails({ data }: { data: WealthData }) {
  const retirement = data.details.retirement;
  if (!retirement) return null;

  const progressPct = Math.min(
    100,
    (retirement.currentBalance / retirement.projectedAtRetirement) * 100,
  );

  const { whole: currentWhole, decimals: currentDec } = formatCurrencyParts(
    retirement.currentBalance,
  );
  const { whole: projectedWhole, decimals: projectedDec } = formatCurrencyParts(
    retirement.projectedAtRetirement,
  );

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <div className="flex flex-col gap-[10px] xl:flex-row xl:items-center xl:gap-[50px]">
        <div className="flex flex-wrap items-center gap-[50px]">
          <div className="flex flex-col gap-[6px]">
            <p className="text-[14px] leading-normal text-[#6d7686]">Current balance</p>
            <SplitCurrency value={retirement.currentBalance} />
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[14px] leading-normal text-[#6d7686]">Projected at retirement</p>
            <SplitCurrency value={retirement.projectedAtRetirement} />
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[14px] leading-normal text-[#6d7686]">Target needed</p>
            <SplitCurrency value={retirement.targetNeeded} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
          <div className="flex items-center justify-between whitespace-nowrap text-[12px]">
            <span className="text-[14px] text-[#6d7686]">Progress</span>
            <span className="text-[var(--db-primary)]">
              {currentWhole}.{currentDec} / {projectedWhole}.{projectedDec} USD
            </span>
          </div>
          <div className="h-[8px] w-full overflow-hidden rounded-[6px] bg-[#eef3f7]">
            <div
              className="h-full rounded-[6px] bg-[#6ab4e7]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioDetails({ data, selectedId }: { data: WealthData; selectedId: PortfolioId }) {
  switch (selectedId) {
    case "all":
      return <AllPortfoliosDetails data={data} />;
    case "advisory":
      return <AdvisoryDetails data={data} />;
    case "execution":
      return <ExecutionDetails data={data} />;
    case "retirement":
      return <RetirementDetails data={data} />;
    default:
      return null;
  }
}

export function NetWealthSection() {
  const data = useWealthData();
  const { selectedPortfolioId, setSelectedPortfolioId } = useDashboardPortfolio();

  return (
    <DashboardSection
      title={
        <>
          Wealth overview{" "}
          <span className="font-sans text-[10px] leading-normal text-[#6b717b]">
            {data.timestamp}
          </span>
        </>
      }
    >
      <DashboardCard className="flex flex-col gap-5">
        <PortfolioTabs
          data={data}
          selectedId={selectedPortfolioId}
          onSelect={setSelectedPortfolioId}
        />
        <PortfolioDetails data={data} selectedId={selectedPortfolioId} />
      </DashboardCard>
    </DashboardSection>
  );
}
