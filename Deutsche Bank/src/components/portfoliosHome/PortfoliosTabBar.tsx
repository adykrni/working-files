"use client";

const TABS = [
  "Portfolios",
  "CIO Insights",
  "Watchlist",
  "Holdings",
  "Liabilities",
  "Transactions",
] as const;

export type PortfoliosTab = (typeof TABS)[number];

type Props = {
  activeTab: PortfoliosTab;
  onTabChange: (tab: PortfoliosTab) => void;
};

/** Segmented bar — single track, active cell white + hairline (option A) */
export function PortfoliosTabBar({ activeTab, onTabChange }: Props) {
  return (
    <div
      className="h-[30px] overflow-hidden rounded-[8px] bg-[#f6f7fa] p-0.5"
      role="tablist"
      aria-label="Portfolio views"
    >
      <div className="flex h-full gap-0.5 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={(e) => {
                onTabChange(tab);
                e.currentTarget.focus({ preventScroll: true });
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              className={`flex h-full min-w-[88px] shrink-0 items-center justify-center rounded-[6px] border px-2 text-[12px] leading-none transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00205b]/30 sm:min-w-[96px] sm:text-[13px] xl:min-w-0 xl:flex-1 ${
                isActive
                  ? "border-[#dfe3e9] bg-white font-medium text-[#07132a]"
                  : "border-transparent text-[#5d636e] hover:bg-[#eef2f5]/90 hover:text-[#07132a]"
              }`}
            >
              <span className="whitespace-nowrap">{tab}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
