"use client";

import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import type { HoldingRow } from "@/data/holdingsHomeData";
import { STICKY_TABLE_HEAD_BLOCK } from "./portfoliosHomeLayout";
import { createHorizontalScrollSync, TABLE_X_SCROLL } from "./tableHorizontalScroll";

function formatUsd(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatWealthPct(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatYtdPct(value: number) {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

function YtdCell({ pct }: { pct: number }) {
  const positive = pct >= 0;
  return (
    <span className={`tabular-nums ${positive ? "text-[#11810d]" : "text-[#d72735]"}`}>
      {formatYtdPct(pct)}
    </span>
  );
}

function PlainHeader({ label, align }: { label: string; align: "left" | "right" }) {
  return (
    <span
      className={`block text-[10px] font-normal uppercase leading-normal text-[#3c4556] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {label}
    </span>
  );
}

/** Figma 956:22134 — aligned with PortfoliosTable cell rhythm */
const headFirst =
  "border-b border-[#dfe3e9] bg-white pb-2.5 pt-2.5 align-top pl-[10px] pr-[15px]";
const headMid = "border-b border-[#dfe3e9] bg-white px-[6px] pb-2.5 pt-2.5 align-top";
const headLast = "border-b border-[#dfe3e9] bg-white py-2.5 pl-[6px] pr-[6px] align-top";

const firstCell = "border-b border-[#dfe3e9] py-3 pl-[10px] pr-[15px] align-middle";
const midCell = "border-b border-[#dfe3e9] px-[6px] py-3 align-middle";
const lastCell = "border-b border-[#dfe3e9] px-[6px] py-3 align-middle";

const COL = {
  security: "29.93%",
  heldIn: "25.03%",
  value: "22.68%",
  wealth: "13.53%",
  ytd: "8.83%",
};

const TABLE_CLASS = "w-full min-w-[880px] table-fixed border-collapse text-left";

type Props = {
  rows: HoldingRow[];
  onRowSelect?: (row: HoldingRow) => void;
  onClearFilters?: () => void;
  stickyHeaderTop?: number;
};

function HoldingsColGroup() {
  return (
    <colgroup>
      <col style={{ width: COL.security }} />
      <col style={{ width: COL.heldIn }} />
      <col style={{ width: COL.value }} />
      <col style={{ width: COL.wealth }} />
      <col style={{ width: COL.ytd }} />
    </colgroup>
  );
}

function HoldingsHeaderRow() {
  return (
    <tr>
      <th className={`${headFirst} text-left`}>
        <PlainHeader label="Security" align="left" />
      </th>
      <th className={`${headMid} text-left`}>
        <PlainHeader label="Held in" align="left" />
      </th>
      <th className={`${headMid} text-left`}>
        <PlainHeader label="Value ($USD)" align="left" />
      </th>
      <th className={`${headMid} text-left`}>
        <PlainHeader label="% of wealth" align="left" />
      </th>
      <th className={`${headLast} text-right`}>
        <PlainHeader label="YTD" align="right" />
      </th>
    </tr>
  );
}

export function HoldingsTable({ rows, onRowSelect, onClearFilters, stickyHeaderTop }: Props) {
  const headScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const syncScroll = useMemo(
    () => createHorizontalScrollSync(headScrollRef, bodyScrollRef),
    [],
  );

  const usePinnedHeader = stickyHeaderTop !== undefined;

  const bodyRows = (
    <>
      {rows.map((row) => {
        const total = row.isTotalRow;
        const rowFirst = total
          ? "border-t-2 border-[#dfe3e9] py-3 pl-[10px] pr-[15px] align-middle bg-[#fafbfd]/60"
          : firstCell;
        const rowMid = total
          ? "border-t-2 border-[#dfe3e9] px-[6px] py-3 align-middle bg-[#fafbfd]/60"
          : midCell;
        const rowLast = total
          ? "border-t-2 border-[#dfe3e9] px-[6px] py-3 align-middle bg-[#fafbfd]/60"
          : lastCell;

        return (
          <motion.tr
            key={row.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`group transition-colors ${total ? "" : "cursor-pointer hover:bg-[#fafbfd]/90"}`}
            onClick={() => {
              if (!total && onRowSelect) onRowSelect(row);
            }}
            onKeyDown={(e) => {
              if (total || !onRowSelect) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRowSelect(row);
              }
            }}
            tabIndex={total ? undefined : 0}
            role={total ? undefined : "button"}
          >
            <td className={rowFirst}>
              <span
                className={`block truncate text-[14px] leading-[1.4] text-[#07132a] ${
                  total ? "font-display font-normal" : ""
                }`}
              >
                {row.security}
              </span>
            </td>
            <td className={rowMid}>
              <span className="block truncate text-[14px] leading-[1.4] text-[#07132a]">
                {row.heldIn || "\u00a0"}
              </span>
            </td>
            <td className={rowMid}>
              <span className="block whitespace-nowrap text-[14px] leading-[1.4] tabular-nums text-[#07132a]">
                {formatUsd(row.valueUsd)}
              </span>
            </td>
            <td className={rowMid}>
              <span className="block whitespace-nowrap text-[14px] leading-[1.4] tabular-nums text-[#07132a]">
                {total ? "\u00a0" : formatWealthPct(row.wealthPct)}
              </span>
            </td>
            <td className={rowLast}>
              <div className="flex justify-end">
                <span className="whitespace-nowrap text-[14px] leading-[1.4]">
                  {total ? "\u00a0" : <YtdCell pct={row.ytdPct} />}
                </span>
              </div>
            </td>
          </motion.tr>
        );
      })}
      {rows.length === 0 ? (
        <tr>
          <td colSpan={5} className="py-12 text-center">
            <p className="text-[14px] text-[#5d636e]">No holdings match these filters.</p>
            {onClearFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                className="mt-2 text-[13px] text-[#00205b] underline-offset-2 hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </td>
        </tr>
      ) : null}
    </>
  );

  return (
    <div className="relative w-full" data-node-id="956:22134">
      {usePinnedHeader ? (
        <>
          <div className={STICKY_TABLE_HEAD_BLOCK} style={{ top: stickyHeaderTop }}>
            <div ref={headScrollRef} className={TABLE_X_SCROLL} onScroll={() => syncScroll("head")}>
              <table className={TABLE_CLASS}>
                <HoldingsColGroup />
                <thead>
                  <HoldingsHeaderRow />
                </thead>
              </table>
            </div>
          </div>
          <div
            ref={bodyScrollRef}
            className={TABLE_X_SCROLL}
            onScroll={() => syncScroll("body")}
          >
            <table className={TABLE_CLASS}>
              <HoldingsColGroup />
              <thead className="sr-only">
                <HoldingsHeaderRow />
              </thead>
              <tbody>{bodyRows}</tbody>
            </table>
          </div>
        </>
      ) : (
        <div className={TABLE_X_SCROLL}>
          <table className={TABLE_CLASS}>
            <HoldingsColGroup />
            <thead>
              <HoldingsHeaderRow />
            </thead>
            <tbody>{bodyRows}</tbody>
          </table>
        </div>
      )}
      <p className="mt-2 text-[11px] text-[#9aa3b2] lg:hidden">
        Swipe for all columns. Tap a row to view the holding.
      </p>
    </div>
  );
}
