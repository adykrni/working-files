"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardPortfolio } from "@/context/DashboardPortfolioContext";
import { usePortfolioSummaries } from "@/hooks/usePortfolioSummary";
import { formatCurrencyParts, percentColorClass } from "@/lib/format";
import type { PortfolioId } from "@/types/wealth";
import { SidebarLogoLockup } from "@/components/layout/SidebarLogoLockup";

export type V2ActivePage = "home" | "wealth";

const NAV_MUTED = ["Markets", "Reports", "Transactions"];

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors ${
        isActive
          ? "bg-[#00205b]/[0.06] text-[var(--db-primary)]"
          : "text-[#3d4c67] hover:bg-black/[0.03]"
      }`}
    >
      {label}
    </Link>
  );
}

function PortfolioNavButton({
  label,
  value,
  change,
  isActive,
  onSelect,
}: {
  label: string;
  value: number;
  change: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { whole, decimals } = formatCurrencyParts(value);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col gap-0.5 rounded-md px-2.5 py-2 text-left transition-colors ${
        isActive
          ? "bg-[#00205b]/[0.06] text-[var(--db-primary)]"
          : "text-[#3d4c67] hover:bg-black/[0.03]"
      }`}
    >
      <span className="text-[13px] leading-tight font-medium">{label}</span>
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] tabular-nums text-[var(--db-muted)]">
          {whole}.{decimals}
        </span>
        <span className={`text-[11px] tabular-nums ${percentColorClass(change)}`}>
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      </span>
    </button>
  );
}

function PortfolioNavLink({
  href,
  label,
  value,
  change,
}: {
  href: string;
  label: string;
  value: number;
  change: number;
}) {
  const { whole, decimals } = formatCurrencyParts(value);

  return (
    <Link
      href={href}
      className="flex flex-col gap-0.5 rounded-md px-2.5 py-2 text-left text-[#3d4c67] transition-colors hover:bg-black/[0.03]"
    >
      <span className="text-[13px] leading-tight font-medium">{label}</span>
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] tabular-nums text-[var(--db-muted)]">
          {whole}.{decimals}
        </span>
        <span className={`text-[11px] tabular-nums ${percentColorClass(change)}`}>
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}%
        </span>
      </span>
    </Link>
  );
}

function WealthPortfolioNav({ activePage }: { activePage: V2ActivePage }) {
  const summaries = usePortfolioSummaries();

  if (activePage === "wealth") {
    return <WealthPortfolioNavInteractive summaries={summaries} />;
  }

  return (
    <div className="mt-1 flex flex-col gap-0.5">
      {summaries.map((item) => (
        <PortfolioNavLink
          key={item.id}
          href="/dashboardv2"
          label={item.shortName === "All" ? "All portfolios" : `${item.shortName} portfolio`}
          value={item.value}
          change={item.changePercentage}
        />
      ))}
    </div>
  );
}

function WealthPortfolioNavInteractive({
  summaries,
}: {
  summaries: ReturnType<typeof usePortfolioSummaries>;
}) {
  const { selectedPortfolioId, setSelectedPortfolioId } = useDashboardPortfolio();

  return (
    <div className="flex flex-col gap-0.5">
      {summaries.map((item) => (
        <PortfolioNavButton
          key={item.id}
          label={item.shortName === "All" ? "All portfolios" : `${item.shortName} portfolio`}
          value={item.value}
          change={item.changePercentage}
          isActive={selectedPortfolioId === item.id}
          onSelect={() => setSelectedPortfolioId(item.id as PortfolioId)}
        />
      ))}
    </div>
  );
}

export function V2AppSidebar({ activePage }: { activePage: V2ActivePage }) {
  const pathname = usePathname() ?? "";
  const isHome = activePage === "home" || pathname.startsWith("/homev2");
  const isWealth = activePage === "wealth" || pathname.startsWith("/dashboardv2");

  return (
    <aside
      className="hidden h-full w-[220px] shrink-0 flex-col border-r border-[var(--db-border)] bg-[#fafbfc] lg:flex"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/homev2">
          <SidebarLogoLockup />
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-3 pb-4">
        <div className="flex flex-col gap-0.5">
          <NavLink href="/homev2" label="Home" isActive={isHome} />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between px-2.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--db-muted)]">
              Wealth
            </p>
            {!isWealth ? (
              <Link
                href="/dashboardv2"
                className="text-[11px] text-[var(--db-info)] hover:underline"
              >
                Open
              </Link>
            ) : null}
          </div>
          <WealthPortfolioNav activePage={activePage} />
        </div>

        <div>
          <p className="mb-2 px-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--db-muted)]">
            Explore
          </p>
          <div className="flex flex-col gap-0.5">
            {NAV_MUTED.map((label) => (
              <span
                key={label}
                className="cursor-default rounded-md px-2.5 py-2 text-[13px] text-[#94a3b8]"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-[var(--db-border)] p-3">
        <Link
          href="/dashboard"
          className="block rounded-md px-2.5 py-2 text-[12px] text-[var(--db-muted)] transition-colors hover:bg-black/[0.03] hover:text-[var(--db-primary)]"
        >
          Classic dashboard →
        </Link>
        <div className="mt-2 flex items-center gap-2 px-2.5 py-1">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e2eaf5] text-[10px] font-semibold text-[#0a0a0a]">
            NT
          </div>
          <span className="text-[13px] text-[#171717]">Nick Thomas</span>
        </div>
      </div>
    </aside>
  );
}
