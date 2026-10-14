"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AMOUNT_OPTIONS,
  DAY_MOVEMENT_OPTIONS,
  TOTAL_GAIN_OPTIONS,
  type AppliedFilters,
  type PortfolioRow,
  type RiskLevel,
} from "@/data/portfoliosHomeData";
import { STICKY_TABLE_HEAD_BLOCK } from "./portfoliosHomeLayout";
import {
  PORTFOLIOS_TABLE_NODE_ID,
  portfoliosGridBody,
  portfoliosGridHead,
  portfoliosTableFrame,
  portfoliosTableShell,
  PORTFOLIOS_TABLE_COL,
} from "./portfoliosTableLayout";
import { createHorizontalScrollSync, TABLE_X_SCROLL } from "./tableHorizontalScroll";

const RISK_DOT: Record<RiskLevel, string> = {
  Conservative: "#838820",
  Moderate: "#ec6b10",
  Aggressive: "#ff4242",
  Speculative: "#838820",
  "Moderately aggressive": "#ce51e4",
};

type FilterableColumnId = "value" | "dayGain" | "totalGain";

const MENU_GAP = 4;
const MENU_WIDTH = 248;

type TableProps = {
  rows: PortfolioRow[];
  filters: AppliedFilters;
  onFiltersChange: (next: AppliedFilters) => void;
  onClearFilters?: () => void;
  columnFiltersEnabled?: boolean;
  stickyHeaderTop?: number;
};

function useIsLgUp() {
  const [isLg, setIsLg] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsLg(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return isLg;
}

function formatUsd(value: number) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatGain(amount: number, pct: number) {
  const sign = amount >= 0 ? "+" : "−";
  const pctSign = pct >= 0 ? "+" : "−";
  return `${sign}${formatUsd(Math.abs(amount))} (${pctSign}${Math.abs(pct).toFixed(2)}%)`;
}

function GainCell({ amount, pct }: { amount: number; pct: number }) {
  const positive = amount >= 0;
  return (
    <span className={`tabular-nums ${positive ? "text-[#11810d]" : "text-[#d72735]"}`}>
      {formatGain(amount, pct)}
    </span>
  );
}

function toggleInList<T extends string>(list: T[], id: T): T[] {
  const set = new Set(list);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  return [...set];
}

function FilterCheckbox({
  checked,
  label,
  onToggle,
  leading,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
  leading?: React.ReactNode;
}) {
  return (
    <label className="flex cursor-default items-center gap-2 py-0.5">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ${
          checked ? "border-[#00205b] bg-[#00205b]" : "border-[#e4e4e9] bg-[#f7f8fb]"
        }`}
      >
        {checked ? (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : null}
      </button>
      {leading}
      <span className="text-[13px] leading-[1.4] text-[#07132a]">{label}</span>
    </label>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ColumnFilterMenu({
  open,
  anchorRef,
  onClose,
  children,
  align,
}: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  children: React.ReactNode;
  align: "left" | "right";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const pad = 16;
    let left = align === "left" ? rect.left : rect.right - MENU_WIDTH;
    if (left < pad) left = pad;
    if (left + MENU_WIDTH > window.innerWidth - pad) {
      left = Math.max(pad, window.innerWidth - MENU_WIDTH - pad);
    }
    setPos({ top: rect.bottom + MENU_GAP, left });
  }, [anchorRef, align]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open, onClose, anchorRef]);

  if (!mounted || !open || !pos) return null;

  return createPortal(
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 2 }}
      transition={{ duration: 0.12 }}
      style={{
        top: pos.top,
        left: pos.left,
        width: MENU_WIDTH,
        maxWidth: `min(${MENU_WIDTH}px, calc(100vw - 24px))`,
      }}
      className="fixed z-[200] box-border max-h-[min(60vh,400px)] overflow-x-hidden overflow-y-auto overscroll-y-contain rounded-[8px] border border-[#dfe3e9] bg-white p-3 shadow-[0px_4px_16px_rgba(0,32,91,0.08)]"
      role="dialog"
    >
      {children}
    </motion.div>,
    document.body,
  );
}

function MenuSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {title ? (
        <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-[#5d636e]">{title}</p>
      ) : null}
      {children}
    </div>
  );
}

function ColumnHeader({
  label,
  align,
  active,
  open,
  onToggle,
  buttonRef,
}: {
  label: string;
  align: "left" | "right";
  active: boolean;
  open: boolean;
  onToggle: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={open}
      onClick={onToggle}
      className={`group inline-flex max-w-full items-center gap-1 text-[10px] font-normal uppercase leading-normal whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00205b]/35 ${
        align === "right" ? "ml-auto" : ""
      } ${active ? "text-[#00205b]" : "text-[#3c4556] hover:text-[#07132a]"}`}
    >
      {label}
      {active ? (
        <span className="size-1 shrink-0 rounded-full bg-[#00205b]" aria-hidden />
      ) : null}
      <ChevronIcon open={open} />
    </button>
  );
}

const AMOUNT_QUICK = AMOUNT_OPTIONS.filter((o) => o.id !== "custom");

function columnActiveCount(column: FilterableColumnId, filters: AppliedFilters): number {
  switch (column) {
    case "value":
      return filters.amount.length;
    case "dayGain":
      return filters.dayMovement.length;
    case "totalGain":
      return filters.totalGain.length;
    default:
      return 0;
  }
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

type BodyColumnKind = "portfolio" | "metric" | "risk";

function headCellClass(kind: "portfolio" | "metric" | "risk") {
  return `${portfoliosGridHead.base} ${portfoliosGridHead[kind]}`;
}

function bodyCellClass(
  kind: BodyColumnKind,
  opts: { total: boolean },
) {
  if (opts.total) {
    const totalPad =
      kind === "portfolio"
        ? portfoliosGridBody.portfolio
        : kind === "risk"
          ? portfoliosGridBody.risk
          : portfoliosGridBody.metric;
    return `${portfoliosGridBody.base} ${totalPad} ${portfoliosGridBody.total}`;
  }
  const pad = portfoliosGridBody[kind];
  return `${portfoliosGridBody.base} ${pad} ${portfoliosGridBody.hover}`;
}

export function PortfoliosTable({
  rows,
  filters,
  onFiltersChange,
  onClearFilters,
  columnFiltersEnabled = true,
  stickyHeaderTop,
}: TableProps) {
  const usePinnedHeader = stickyHeaderTop !== undefined;
  const headScrollRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const syncScroll = useMemo(
    () => createHorizontalScrollSync(headScrollRef, bodyScrollRef),
    [],
  );
  const isLgUp = useIsLgUp();
  const xScrollClass = isLgUp ? "overflow-x-hidden" : TABLE_X_SCROLL;
  const [openColumn, setOpenColumn] = useState<FilterableColumnId | null>(null);
  const [customMin, setCustomMin] = useState(String(filters.dayMovementCustom?.min ?? -2));
  const [customMax, setCustomMax] = useState(String(filters.dayMovementCustom?.max ?? 3));

  const valueRef = useRef<HTMLButtonElement>(null);
  const dayRef = useRef<HTMLButtonElement>(null);
  const totalGainRef = useRef<HTMLButtonElement>(null);

  const refs: Record<FilterableColumnId, React.RefObject<HTMLButtonElement | null>> = {
    value: valueRef,
    dayGain: dayRef,
    totalGain: totalGainRef,
  };

  useLayoutEffect(() => {
    if (!isLgUp) return;
    if (headScrollRef.current) headScrollRef.current.scrollLeft = 0;
    if (bodyScrollRef.current) bodyScrollRef.current.scrollLeft = 0;
  }, [isLgUp, rows]);

  const toggleColumn = (id: FilterableColumnId) => {
    setOpenColumn((cur) => (cur === id ? null : id));
  };

  const closeMenu = () => setOpenColumn(null);

  const applyCustomDay = () => {
    const min = parseFloat(customMin) || 0;
    const max = parseFloat(customMax) || 0;
    const set = new Set(filters.dayMovement);
    set.add("custom");
    onFiltersChange({
      ...filters,
      dayMovement: [...set],
      dayMovementCustom: { min, max },
    });
  };

  const col = isLgUp ? PORTFOLIOS_TABLE_COL.lg : PORTFOLIOS_TABLE_COL.sm;

  const renderMenu = () => {
    if (!columnFiltersEnabled || !openColumn) return null;
    const anchorRef = refs[openColumn];
    const align = "right" as const;

    let content: React.ReactNode = null;
    if (openColumn === "value") {
      content = (
        <MenuSection>
          <p className="mb-1 text-[11px] leading-[1.3] text-[#5d636e]">Match any threshold</p>
          {AMOUNT_QUICK.map((opt) => (
            <FilterCheckbox
              key={opt.id}
              label={opt.label}
              checked={filters.amount.includes(opt.id)}
              onToggle={() =>
                onFiltersChange({
                  ...filters,
                  amount: toggleInList(filters.amount, opt.id),
                })
              }
            />
          ))}
        </MenuSection>
      );
    } else if (openColumn === "dayGain") {
      content = (
        <MenuSection>
          <p className="mb-1 text-[11px] leading-[1.3] text-[#5d636e]">Match any move today</p>
          {DAY_MOVEMENT_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.id}
              label={opt.label}
              checked={filters.dayMovement.includes(opt.id)}
              onToggle={() =>
                onFiltersChange({
                  ...filters,
                  dayMovement: toggleInList(filters.dayMovement, opt.id),
                })
              }
            />
          ))}
          {filters.dayMovement.includes("custom") ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 pl-6">
              <input
                type="text"
                inputMode="decimal"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                onBlur={applyCustomDay}
                className="h-7 w-14 rounded-[4px] border border-[#e4e4e9] bg-[#f7f8fb] px-2 text-[12px] tabular-nums"
                aria-label="Min day change percent"
              />
              <span className="text-[12px] text-[#5d636e]">to</span>
              <input
                type="text"
                inputMode="decimal"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                onBlur={applyCustomDay}
                className="h-7 w-14 rounded-[4px] border border-[#e4e4e9] bg-[#f7f8fb] px-2 text-[12px] tabular-nums"
                aria-label="Max day change percent"
              />
              <span className="text-[12px] text-[#5d636e]">%</span>
            </div>
          ) : null}
        </MenuSection>
      );
    } else if (openColumn === "totalGain") {
      content = (
        <MenuSection>
          {TOTAL_GAIN_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.id}
              label={opt.label}
              checked={filters.totalGain.includes(opt.id)}
              onToggle={() =>
                onFiltersChange({
                  ...filters,
                  totalGain: toggleInList(filters.totalGain, opt.id),
                })
              }
            />
          ))}
        </MenuSection>
      );
    }

    return (
      <AnimatePresence>
        <ColumnFilterMenu open={Boolean(openColumn)} anchorRef={anchorRef} onClose={closeMenu} align={align}>
          {content}
        </ColumnFilterMenu>
      </AnimatePresence>
    );
  };

  const tableClass = portfoliosTableShell;

  const colGroup = (
    <colgroup>
      <col style={{ width: col.portfolio }} />
      <col style={{ width: col.value }} />
      <col style={{ width: col.dayGain }} />
      <col style={{ width: col.totalGain }} />
      <col style={{ width: col.risk }} />
    </colgroup>
  );

  const headerRow = (
    <tr>
      <th className={headCellClass("portfolio")}>
        <PlainHeader label="Portfolio" align="left" />
      </th>
      <th className={headCellClass("metric")}>
        {columnFiltersEnabled ? (
          <ColumnHeader
            label="Value ($USD)"
            align="left"
            active={columnActiveCount("value", filters) > 0}
            open={openColumn === "value"}
            onToggle={() => toggleColumn("value")}
            buttonRef={valueRef}
          />
        ) : (
          <PlainHeader label="Value ($USD)" align="left" />
        )}
      </th>
      <th className={headCellClass("metric")}>
        {columnFiltersEnabled ? (
          <ColumnHeader
            label="Day gain"
            align="left"
            active={columnActiveCount("dayGain", filters) > 0}
            open={openColumn === "dayGain"}
            onToggle={() => toggleColumn("dayGain")}
            buttonRef={dayRef}
          />
        ) : (
          <PlainHeader label="Day gain" align="left" />
        )}
      </th>
      <th className={headCellClass("metric")}>
        {columnFiltersEnabled ? (
          <ColumnHeader
            label="Total gain"
            align="left"
            active={columnActiveCount("totalGain", filters) > 0}
            open={openColumn === "totalGain"}
            onToggle={() => toggleColumn("totalGain")}
            buttonRef={totalGainRef}
          />
        ) : (
          <PlainHeader label="Total gain" align="left" />
        )}
      </th>
      <th className={headCellClass("risk")}>
        <PlainHeader label="Risk" align="left" />
      </th>
    </tr>
  );

  const bodyRows = (
    <>
            {rows.map((row) => {
              const total = Boolean(row.isTotalRow);
              const cellOpts = { total };

              return (
                <motion.tr
                  key={row.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group"
                >
                  <td className={bodyCellClass("portfolio", cellOpts)}>
                    <span
                      className="block text-[14px] leading-[1.4] text-[#07132a] max-lg:truncate lg:whitespace-normal"
                      title={row.name}
                    >
                      {row.name}
                    </span>
                  </td>
                  <td className={bodyCellClass("metric", cellOpts)}>
                    <span className="block whitespace-nowrap text-[14px] tabular-nums leading-[1.4] text-[#07132a]">
                      {formatUsd(row.valueUsd)}
                    </span>
                  </td>
                  <td className={bodyCellClass("metric", cellOpts)}>
                    <span className="block whitespace-nowrap text-[14px] leading-[1.4]">
                      {row.dayGain ? (
                        <GainCell amount={row.dayGain.amount} pct={row.dayGain.pct} />
                      ) : (
                        <span className="text-[#07132a]">–</span>
                      )}
                    </span>
                  </td>
                  <td className={bodyCellClass("metric", cellOpts)}>
                    <span className="block whitespace-nowrap text-[14px] tabular-nums leading-[1.4] text-[#07132a]">
                      {formatGain(row.totalGain.amount, row.totalGain.pct)}
                    </span>
                  </td>
                  <td className={bodyCellClass("risk", cellOpts)}>
                    <span className="inline-flex items-center justify-start gap-1 whitespace-nowrap text-[12px] leading-[1.4] text-[#07132a]">
                        <span
                          className="size-1 shrink-0 rounded-full"
                          style={{ backgroundColor: RISK_DOT[row.risk] }}
                          aria-hidden
                        />
                        {row.risk}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="border-b-0 border-r-0 px-[10px] py-12 text-center">
                  <p className="text-[14px] text-[#5d636e]">No portfolios match these filters.</p>
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
    <div
      className="relative w-full min-w-0 overflow-x-hidden"
      data-node-id={PORTFOLIOS_TABLE_NODE_ID}
      data-name="Portfolios table"
    >
      {renderMenu()}
      {usePinnedHeader && isLgUp ? (
        <div className={portfoliosTableFrame}>
          <table className={tableClass}>
            {colGroup}
            <thead
              className={`${STICKY_TABLE_HEAD_BLOCK} [&_th]:bg-white`}
              style={{ top: stickyHeaderTop }}
            >
              {headerRow}
            </thead>
            <tbody>{bodyRows}</tbody>
          </table>
        </div>
      ) : usePinnedHeader ? (
        <div className={portfoliosTableFrame}>
          <div className={STICKY_TABLE_HEAD_BLOCK} style={{ top: stickyHeaderTop }}>
            <div
              ref={headScrollRef}
              className={xScrollClass}
              onScroll={() => syncScroll("head")}
            >
              <table className={tableClass}>
                {colGroup}
                <thead>{headerRow}</thead>
              </table>
            </div>
          </div>
          <div
            ref={bodyScrollRef}
            className={xScrollClass}
            onScroll={() => syncScroll("body")}
          >
            <table className={tableClass}>
              {colGroup}
              <thead className="sr-only">{headerRow}</thead>
              <tbody>{bodyRows}</tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`${portfoliosTableFrame} ${xScrollClass}`}>
          <table className={tableClass}>
            {colGroup}
            <thead>{headerRow}</thead>
            <tbody>{bodyRows}</tbody>
          </table>
        </div>
      )}
      <p className="mt-2 text-[11px] text-[#9aa3b2] lg:hidden">
        Swipe for all columns. Value, Day gain, and Total gain headers open filters.
      </p>
    </div>
  );
}
