"use client";

import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import type { HoldingRow } from "@/data/holdingsHomeData";
import { getHoldingDetail } from "@/data/holdingsHomeDetailData";

function formatUsd(value: number, fraction = 2) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  });
}

function formatSignedUsd(value: number) {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${formatUsd(Math.abs(value))}`;
}

function formatSignedPct(value: number) {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

function toneClass(positive: boolean) {
  return positive ? "text-[#11810d]" : "text-[#d72735]";
}

type Props = {
  holding: HoldingRow | null;
  onClose: () => void;
};

export function HoldingDetailDialog({ holding, onClose }: Props) {
  useEffect(() => {
    if (!holding) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [holding, onClose]);

  const detail = useMemo(
    () => (holding && !holding.isTotalRow ? getHoldingDetail(holding) : null),
    [holding],
  );

  if (!holding || holding.isTotalRow || !detail) return null;

  const dayUp = detail.dayChangePct >= 0;
  const glUp = detail.unrealizedGlUsd >= 0;
  const overGuideline = holding.wealthPct > detail.guidelineLimitPct;
  const isCash = holding.id === "cash";
  const multiplePortfolios = detail.portfolioSlices.length > 1;

  return createPortal(
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-[#07132a]/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-labelledby="holding-detail-title"
        className="relative flex w-full max-w-[480px] flex-col overflow-hidden rounded-[10px] border border-[#dfe3e9] bg-white shadow-[0px_8px_32px_rgba(0,32,91,0.14)]"
      >
        <div className="shrink-0 border-b border-[#eef1f5] px-5 pb-4 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2
                id="holding-detail-title"
                className="font-display text-[16px] leading-snug text-[#00205b]"
              >
                {holding.security}
              </h2>
              <p className="mt-1 text-[12px] text-[#5d636e]">
                {detail.ticker}
                {detail.isin !== "—" ? ` · ${detail.isin}` : ""}
              </p>
              <p className="mt-0.5 text-[12px] text-[#5d636e]">
                {detail.sector} · {detail.assetClassLabel}
              </p>
            </div>
            {!isCash ? (
              <div className="shrink-0 text-right">
                <p className="tabular-nums text-[14px] font-medium text-[#07132a]">
                  {formatUsd(detail.lastPrice)}
                </p>
                <p
                  className={`mt-0.5 rounded-[4px] px-2 py-0.5 text-[11px] tabular-nums ${dayUp ? "bg-[#e8f5ea] text-[#11810d]" : "bg-[#fdecee] text-[#d72735]"}`}
                >
                  {formatSignedUsd(detail.dayChangeUsd)} ({formatSignedPct(detail.dayChangePct)})
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="rounded-[8px] border border-[#eef1f5] bg-[#fafbfd] px-4 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#585d65]">
              Unrealised gain / loss (consolidated)
            </p>
            <p className={`mt-1 font-display text-[28px] leading-none tabular-nums ${toneClass(glUp)}`}>
              {formatSignedUsd(detail.unrealizedGlUsd)}
            </p>
            <p className={`mt-1 text-[13px] tabular-nums ${toneClass(glUp)}`}>
              {formatSignedPct(detail.unrealizedGlPct)}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[#eef1f5] pt-3 text-[12px]">
              <div>
                <dt className="text-[#5d636e]">Market value</dt>
                <dd className="tabular-nums font-medium text-[#07132a]">
                  ${formatUsd(holding.valueUsd)}
                </dd>
              </div>
              <div>
                <dt className="text-[#5d636e]">Cost basis</dt>
                <dd className="tabular-nums text-[#07132a]">${formatUsd(detail.costBasis)}</dd>
              </div>
              <div>
                <dt className="text-[#5d636e]">Quantity</dt>
                <dd className="tabular-nums text-[#07132a]">
                  {isCash ? `${formatUsd(detail.quantity)} USD` : formatUsd(detail.quantity, 0)}
                </dd>
              </div>
              <div>
                <dt className="text-[#5d636e]">Table YTD</dt>
                <dd className={`tabular-nums ${toneClass(holding.ytdPct >= 0)}`}>
                  {formatSignedPct(holding.ytdPct)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-5">
            <h3 className="text-[10px] font-medium uppercase tracking-[0.04em] text-[#585d65]">
              Held across portfolios
            </h3>
            <div className="mt-2 overflow-hidden rounded-[8px] border border-[#eef1f5]">
              <table className="w-full border-collapse text-left text-[12px]">
                <thead>
                  <tr className="border-b border-[#eef1f5] bg-[#fafbfd] text-[10px] uppercase tracking-[0.03em] text-[#585d65]">
                    <th className="px-3 py-2 font-medium">Portfolio</th>
                    <th className="px-3 py-2 font-medium text-right">Value</th>
                    <th className="px-3 py-2 font-medium text-right">% of portfolio</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.portfolioSlices.map((slice) => (
                    <tr key={slice.portfolioName} className="border-b border-[#eef1f5] last:border-0">
                      <td className="px-3 py-2.5 text-[#383f4d]">{slice.portfolioName}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-[#07132a]">
                        ${formatUsd(slice.valueUsd)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-[#07132a]">
                        {slice.portfolioPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] leading-[1.4] text-[#5d636e]">
              {holding.wealthPct.toFixed(1)}% of total wealth
              {overGuideline ? (
                <span className="text-[#b45309]">
                  {" "}
                  · Above {detail.guidelineLimitPct}% single-name guidance
                </span>
              ) : (
                <span> · Within {detail.guidelineLimitPct}% single-name guidance</span>
              )}
            </p>
          </div>

          <p className="mt-4 text-[12px] leading-[1.45] text-[#5d636e]">
            {multiplePortfolios
              ? "Tax lots, harvest opportunities, and trading apply per portfolio — not at consolidated level."
              : "Open the portfolio for tax lots, performance history, and actions on this position."}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-[#eef1f5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="order-2 h-[30px] rounded-[4px] px-1 text-[12px] text-[#5d636e] hover:text-[#07132a] sm:order-1"
          >
            Close
          </button>
          <div className="order-1 flex flex-wrap gap-2 sm:order-2 sm:justify-end">
            {overGuideline ? (
              <button
                type="button"
                className="h-[30px] rounded-[4px] border border-[#dfe3e9] px-3 text-[12px] text-[#07132a] hover:bg-[#fafbfd]"
              >
                Message advisor
              </button>
            ) : null}
            <button
              type="button"
              className="flex h-[30px] items-center justify-center rounded-[4px] bg-[#00205b] px-3 pb-[3px] pt-[2px] text-[12px] text-white"
              onClick={onClose}
            >
              View in portfolio
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
