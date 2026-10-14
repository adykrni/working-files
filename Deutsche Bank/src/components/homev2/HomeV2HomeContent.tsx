"use client";

import { motion } from "framer-motion";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import {
  getGreeting,
  HOME_V2_MTD_CHANGE,
  HOME_V2_TOTAL_WEALTH,
  useHomeV2AttentionItems,
  useHomeV2PortfolioSummaries,
  type AttentionItem,
  type AttentionTier,
} from "@/hooks/useHomeV2HomeData";
import { formatCurrencyParts, formatSignedPercentTab, percentColorClass } from "@/lib/format";
import type { PortfolioId } from "@/types/wealth";
import {
  ChevronRight,
  HOME_V2_PANEL_PADDING,
  PORTFOLIO_CARD_SHADOW,
  SplitCompactValue,
} from "./ui/homev2Ui";

const TIER_DOT: Record<AttentionTier, string> = {
  urgent: "#448de2",
  watch: "#f19317",
  positive: "#149d55",
};

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

function AttentionRow({
  item,
  onAction,
}: {
  item: AttentionItem;
  onAction: (item: AttentionItem) => void;
}) {
  const isPositive = item.tier === "positive";

  return (
    <div
      className={`flex items-center justify-between border-b border-[#dbdbe0] p-[14px] last:border-b-0 ${
        isPositive ? "bg-[#f9fbfd]/60" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-5">
        <span
          className="size-[6px] shrink-0 rounded-[4px]"
          style={{ backgroundColor: TIER_DOT[item.tier] }}
          aria-hidden
        />
        <div className="flex min-w-0 flex-col gap-2">
          <p className="truncate text-[14px] leading-none text-[#07132a]">{item.title}</p>
          <p className="truncate text-[14px] leading-none text-[#3c4556]">{item.description}</p>
        </div>
      </div>
      {item.actionLabel ? (
        <button
          type="button"
          onClick={() => onAction(item)}
          className="ml-4 shrink-0 text-[12px] leading-normal text-[#3c4556] transition-colors hover:text-[#00205b]"
        >
          {item.actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function PortfolioCard({
  label,
  value,
  changeYtd,
  onClick,
}: {
  label: string;
  value: number;
  changeYtd: number;
  onClick: () => void;
}) {
  const { whole, decimals } = formatCurrencyParts(value);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full min-w-0 flex-col gap-1 rounded-[6px] bg-[#f9fbfd] p-[10px] text-left transition-colors hover:bg-[#edf0f3]"
      style={{ boxShadow: PORTFOLIO_CARD_SHADOW }}
    >
      <p className="truncate text-[12px] leading-[1.2] text-[#07132a]">{label}</p>
      <p className="font-display text-[#07132a]">
        <span className="text-[18px] leading-normal">{whole}</span>
        <span className="text-[10px] leading-normal">.{decimals} USD</span>
      </p>
      <p className={`text-[12px] leading-[1.2] ${percentColorClass(changeYtd)}`}>
        {formatSignedPercentTab(changeYtd)}
      </p>
    </button>
  );
}

export function HomeV2HomeContent() {
  const { openPortfolio } = useDashboardPortfolio();
  const attentionItems = useHomeV2AttentionItems();
  const portfolios = useHomeV2PortfolioSummaries();

  const urgent = attentionItems.filter((i) => i.tier === "urgent");
  const rest = attentionItems.filter((i) => i.tier !== "urgent");

  const handleAttentionAction = (item: AttentionItem) => {
    if (item.portfolioId) {
      openPortfolio(item.portfolioId, item.focus);
    }
  };

  return (
    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain bg-white">
      <motion.div
        {...fade}
        className={`flex w-full min-h-full flex-col gap-10 ${HOME_V2_PANEL_PADDING}`}
      >
        <h1 className="font-display text-[20px] leading-normal text-[#07132a]">{getGreeting()}</h1>

        <button
          type="button"
          onClick={() => openPortfolio("all", undefined)}
          className="flex w-full items-center justify-between border-b border-[#d4d4d4] pb-[10px] text-left transition-colors hover:border-[#00205b]/30"
        >
          <div className="flex flex-wrap items-center gap-2.5 text-[#07132a]">
            <span className="text-[14px] leading-[1.3]">Total wealth</span>
            <SplitCompactValue
              value={HOME_V2_TOTAL_WEALTH}
              change={HOME_V2_MTD_CHANGE}
              changeLabel="MTD"
            />
          </div>
          <ChevronRight className="text-[#3c4556]" />
        </button>

        <section className="flex flex-col gap-2.5">
          <p className="text-[14px] leading-normal text-[#07132a]">
            Here&apos;s what needs your attention today.
          </p>
          <div className="w-full overflow-hidden rounded-[8px] border border-[#d4d4d4] bg-white">
            {urgent.map((item) => (
              <AttentionRow key={item.id} item={item} onAction={handleAttentionAction} />
            ))}
            {rest.map((item) => (
              <AttentionRow key={item.id} item={item} onAction={handleAttentionAction} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2.5">
          <p className="text-[14px] leading-normal text-[#07132a]">Your portfolios</p>
          <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                label={portfolio.label}
                value={portfolio.value}
                changeYtd={portfolio.changeYtd}
                onClick={() => openPortfolio(portfolio.id as PortfolioId)}
              />
            ))}
          </div>
        </section>
      </motion.div>
    </main>
  );
}
