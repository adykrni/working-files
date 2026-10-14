"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ASSET_CLASS_OPTIONS,
  EMPTY_HOLDINGS_FILTERS,
  HELD_IN_OPTIONS,
  HOLDING_SORT_OPTIONS,
  HOLDING_VALUE_OPTIONS,
  HOLDING_WEALTH_OPTIONS,
  HOLDING_YTD_OPTIONS,
  type HoldingSortId,
  type HoldingsAppliedFilters,
} from "@/data/holdingsHomeData";
import {
  getHoldingsFacetBaseRows,
  holdingsFacetCountForOption,
  previewHoldingsCount,
  type HoldingsFilterFacetCategory,
} from "./holdingsFilterModel";

const PANEL_WIDTH_PX = 360;
const VIEWPORT_INSET_PX = 16;

type Props = {
  open: boolean;
  onClose: () => void;
  filters: HoldingsAppliedFilters;
  onApply: (next: HoldingsAppliedFilters) => void;
  searchQuery: string;
  totalCount: number;
};

function toggleInList<T extends string>(list: T[], id: T): T[] {
  const set = new Set(list);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  return [...set];
}

function FilterCheckbox({
  checked,
  label,
  count,
  disabled,
  onToggle,
}: {
  checked: boolean;
  label: string;
  count: number;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`flex cursor-default items-center justify-between gap-3 ${disabled ? "opacity-45" : ""}`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          disabled={disabled}
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
        <span className="truncate text-[14px] leading-[1.4] text-[#07132a]">{label}</span>
      </span>
      <span className="shrink-0 tabular-nums text-[12px] text-[#85868b]">{count}</span>
    </label>
  );
}

function SortRadio({
  checked,
  label,
  onSelect,
}: {
  checked: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <label className="flex cursor-default items-center gap-2">
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        onClick={onSelect}
        className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
          checked ? "border-[#00205b]" : "border-[#e4e4e9] bg-[#f7f8fb]"
        }`}
      >
        {checked ? <span className="size-2 rounded-full bg-[#00205b]" /> : null}
      </button>
      <span className="text-[14px] leading-[1.4] text-[#07132a]">{label}</span>
    </label>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="text-[#5d636e]">
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PanelSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2.5 border-b border-[#f0f2f5] px-4 py-[10px] last:border-b-0">
      <div>
        <p className="text-[14px] leading-[1.4] text-[#5d636e]">{title}</p>
        {hint ? <p className="mt-0.5 text-[12px] leading-[1.4] text-[#85868b]">{hint}</p> : null}
      </div>
      <div className="flex flex-col gap-[10px]">{children}</div>
    </section>
  );
}

export function HoldingsFilterSidePanel({
  open,
  onClose,
  filters,
  onApply,
  searchQuery,
  totalCount,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<HoldingsAppliedFilters>(filters);
  const [showZeroMatch, setShowZeroMatch] = useState(false);

  const facetBase = useMemo(() => getHoldingsFacetBaseRows(searchQuery), [searchQuery]);

  const draftPreviewCount = useMemo(
    () => previewHoldingsCount(draft, searchQuery),
    [draft, searchQuery],
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setDraft(filters);
      setShowZeroMatch(false);
    }
  }, [open, filters]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const renderFacetOptions = (
    category: HoldingsFilterFacetCategory,
    options: { id: string; label: string }[],
    getChecked: (id: string) => boolean,
    applyToggle: (id: string) => void,
  ) =>
    options.map((opt) => {
      const count = holdingsFacetCountForOption(facetBase, draft, category, opt.id);
      const checked = getChecked(opt.id);
      if (!showZeroMatch && count === 0 && !checked) return null;
      return (
        <FilterCheckbox
          key={opt.id}
          label={opt.label}
          count={count}
          checked={checked}
          disabled={count === 0 && !checked}
          onToggle={() => applyToggle(opt.id)}
        />
      );
    });

  const hiddenZeroCount = useMemo(() => {
    if (showZeroMatch) return 0;
    const ids: { cat: HoldingsFilterFacetCategory; id: string }[] = [
      ...HELD_IN_OPTIONS.map((o) => ({ cat: "heldIn" as const, id: o.id })),
      ...ASSET_CLASS_OPTIONS.map((o) => ({ cat: "assetClass" as const, id: o.id })),
      ...HOLDING_VALUE_OPTIONS.map((o) => ({ cat: "value" as const, id: o.id })),
      ...HOLDING_WEALTH_OPTIONS.map((o) => ({ cat: "wealth" as const, id: o.id })),
      ...HOLDING_YTD_OPTIONS.map((o) => ({ cat: "ytd" as const, id: o.id })),
    ];
    return ids.filter(({ cat, id }) => {
      const checked =
        (cat === "heldIn" && draft.heldIn.includes(id as HoldingsAppliedFilters["heldIn"][number])) ||
        (cat === "assetClass" &&
          draft.assetClass.includes(id as HoldingsAppliedFilters["assetClass"][number])) ||
        (cat === "value" && draft.value.includes(id as HoldingsAppliedFilters["value"][number])) ||
        (cat === "wealth" && draft.wealth.includes(id as HoldingsAppliedFilters["wealth"][number])) ||
        (cat === "ytd" && draft.ytd.includes(id as HoldingsAppliedFilters["ytd"][number]));
      return holdingsFacetCountForOption(facetBase, draft, cat, id) === 0 && !checked;
    }).length;
  }, [draft, facetBase, showZeroMatch]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[198] bg-[#07132a]/25"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filter holdings"
            data-node-id="961:22619"
            initial={{ x: "calc(100% + 16px)", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "calc(100% + 16px)", opacity: 0 }}
            transition={{ type: "spring", damping: 32, stiffness: 340, mass: 0.85 }}
            style={{
              width: PANEL_WIDTH_PX,
              right: VIEWPORT_INSET_PX,
              top: VIEWPORT_INSET_PX,
              bottom: VIEWPORT_INSET_PX,
            }}
            className="fixed z-[200] flex flex-col overflow-hidden rounded-[10px] border border-[#e7e7e7] bg-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)]"
          >
            <div className="flex shrink-0 items-start gap-3 border-b border-[#e7e7e7] px-4 pb-[10px] pt-4">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] leading-[1.4] text-[#5d636e]">All filters</p>
                <p className="mt-1 text-[12px] leading-[1.4] text-[#5d636e]">
                  Preview{" "}
                  <span className="font-medium tabular-nums text-[#07132a]">{draftPreviewCount}</span>{" "}
                  of <span className="tabular-nums text-[#07132a]">{totalCount}</span> holdings
                  {searchQuery.trim() ? " (after security search)" : ""}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close filter panel"
                onClick={onClose}
                className="flex size-8 shrink-0 items-center justify-center rounded-[6px] text-[#5d636e] transition-colors hover:bg-[#f4f7fb] hover:text-[#07132a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00205b]/35"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <PanelSection title="Held in" hint="Match any selected portfolio">
                {renderFacetOptions(
                  "heldIn",
                  HELD_IN_OPTIONS,
                  (id) => draft.heldIn.includes(id as HoldingsAppliedFilters["heldIn"][number]),
                  (id) =>
                    setDraft({
                      ...draft,
                      heldIn: toggleInList(draft.heldIn, id as HoldingsAppliedFilters["heldIn"][number]),
                    }),
                )}
              </PanelSection>

              <PanelSection title="Asset class" hint="Match any selected class">
                {renderFacetOptions(
                  "assetClass",
                  ASSET_CLASS_OPTIONS,
                  (id) =>
                    draft.assetClass.includes(id as HoldingsAppliedFilters["assetClass"][number]),
                  (id) =>
                    setDraft({
                      ...draft,
                      assetClass: toggleInList(
                        draft.assetClass,
                        id as HoldingsAppliedFilters["assetClass"][number],
                      ),
                    }),
                )}
              </PanelSection>

              <PanelSection title="Value ($USD)" hint="Match any selected threshold">
                {renderFacetOptions(
                  "value",
                  HOLDING_VALUE_OPTIONS,
                  (id) => draft.value.includes(id as HoldingsAppliedFilters["value"][number]),
                  (id) =>
                    setDraft({
                      ...draft,
                      value: toggleInList(draft.value, id as HoldingsAppliedFilters["value"][number]),
                    }),
                )}
              </PanelSection>

              <PanelSection title="% of wealth" hint="Match any selected threshold">
                {renderFacetOptions(
                  "wealth",
                  HOLDING_WEALTH_OPTIONS,
                  (id) => draft.wealth.includes(id as HoldingsAppliedFilters["wealth"][number]),
                  (id) =>
                    setDraft({
                      ...draft,
                      wealth: toggleInList(draft.wealth, id as HoldingsAppliedFilters["wealth"][number]),
                    }),
                )}
              </PanelSection>

              <PanelSection title="YTD performance" hint="Match any selected condition">
                {renderFacetOptions(
                  "ytd",
                  HOLDING_YTD_OPTIONS,
                  (id) => draft.ytd.includes(id as HoldingsAppliedFilters["ytd"][number]),
                  (id) =>
                    setDraft({
                      ...draft,
                      ytd: toggleInList(draft.ytd, id as HoldingsAppliedFilters["ytd"][number]),
                    }),
                )}
              </PanelSection>

              <PanelSection title="Sort by">
                {HOLDING_SORT_OPTIONS.map((opt) => (
                  <SortRadio
                    key={opt.id}
                    label={opt.label}
                    checked={draft.sort === opt.id}
                    onSelect={() => setDraft({ ...draft, sort: opt.id as HoldingSortId })}
                  />
                ))}
              </PanelSection>

              {hiddenZeroCount > 0 ? (
                <div className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setShowZeroMatch(true)}
                    className="text-[12px] leading-[1.4] text-[#5d636e] hover:text-[#07132a]"
                  >
                    Show {hiddenZeroCount} values with no matches
                  </button>
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-[#dfe3e9] py-[10px] pl-[17px] pr-[7px]">
              <button
                type="button"
                onClick={() => setDraft(EMPTY_HOLDINGS_FILTERS)}
                className="text-[12px] leading-[1.4] text-[#5d636e] hover:text-[#07132a]"
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply(draft);
                  onClose();
                }}
                className="flex h-[30px] items-center justify-center rounded-[4px] bg-[#00205b] px-3 pb-[3px] pt-[2px] text-[12px] leading-[1.4] text-white"
              >
                Apply · {draftPreviewCount} holdings
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
