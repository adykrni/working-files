"use client";

import { ChevronDown } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import type { Security } from "@/types/holdings";
import { HoldingsCurrencyValue, HoldingsReturnsValue } from "./HoldingsCurrencyValue";

const ROW_DETAIL_TRANSITION =
  "grid transition-[grid-template-rows] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]";

interface HoldingsTableProps {
  holdings: Security[];
  isDetailView: boolean;
  expandedSecurityIds: Set<string>;
  onExpandComponent: () => void;
  onSecurityToggle: (securityId: string) => void;
  getReturnForSecurity?: (
    securityId: string,
  ) => { dollar: number; percent: number } | undefined;
  renderExpandedRow?: (security: Security) => ReactNode;
}

function computeReturn(security: Security) {
  const dollar = security.currentValue - security.investedAmount;
  const percent =
    security.investedAmount === 0
      ? 0
      : (dollar / security.investedAmount) * 100;
  return { dollar, percent };
}

const GRID_COLS_L1 =
  "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]";
const GRID_COLS_L2 =
  "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_7.5rem]";

const COLUMN_HEADER_CLASS =
  "text-left text-[10px] uppercase leading-normal text-[#59616f]";

const DATA_CELL_CLASS = "min-w-0 justify-self-start text-left";

const ROW_GRID_INTERACTION =
  "cursor-pointer outline-none transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--db-primary)] focus-visible:ring-offset-2";

interface HoldingsRowCellsProps {
  security: Security;
  dollar: number;
  percent: number;
  isDetailView: boolean;
  isRowExpanded: boolean;
  gridCols: string;
  onRowActivate: () => void;
  onSecurityToggle: (securityId: string) => void;
}

function HoldingsRowCells({
  security,
  dollar,
  percent,
  isDetailView,
  isRowExpanded,
  gridCols,
  onRowActivate,
  onSecurityToggle,
}: HoldingsRowCellsProps) {
  return (
    <div
      className={`grid w-full items-center gap-x-2 gap-y-0 ${ROW_GRID_INTERACTION} ${gridCols}`}
      onClick={onRowActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onRowActivate();
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={isDetailView ? isRowExpanded : undefined}
      aria-label={
        isDetailView
          ? `${security.name}, ${isRowExpanded ? "collapse" : "expand"} details`
          : `Open holdings details for ${security.name}`
      }
    >
      <p className={`${DATA_CELL_CLASS} text-[14px] leading-5 text-[var(--db-primary)]`}>
        {security.name}
      </p>
      <div className={DATA_CELL_CLASS}>
        <HoldingsCurrencyValue value={security.investedAmount} />
      </div>
      <div className={DATA_CELL_CLASS}>
        <HoldingsReturnsValue dollar={dollar} percent={percent} />
      </div>
      {isDetailView && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSecurityToggle(security.id);
          }}
          className="flex w-full shrink-0 items-center justify-end gap-1 text-[12px] text-[var(--db-muted)]"
          aria-label={
            isRowExpanded
              ? `Collapse ${security.name} details`
              : `Expand ${security.name} details`
          }
        >
          <span>{isRowExpanded ? "Show less" : "Show more"}</span>
          <ChevronDown
            size={18}
            strokeWidth={1.5}
            className={`shrink-0 transition-transform duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isRowExpanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      )}
    </div>
  );
}

export function HoldingsTable({
  holdings,
  isDetailView,
  expandedSecurityIds,
  onExpandComponent,
  onSecurityToggle,
  getReturnForSecurity,
  renderExpandedRow,
}: HoldingsTableProps) {
  const gridCols = isDetailView ? GRID_COLS_L2 : GRID_COLS_L1;

  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className={`grid w-full ${gridCols} items-center gap-x-2 gap-y-0`}>
        <span className={COLUMN_HEADER_CLASS}>Security</span>
        <span className={COLUMN_HEADER_CLASS}>Invested amount</span>
        <span className={COLUMN_HEADER_CLASS}>Returns</span>
        {isDetailView && (
          <span className="sr-only" aria-hidden>
            Row actions
          </span>
        )}
      </div>

      <div className="flex w-full flex-col gap-2.5">
        {holdings.map((security, index) => {
          const isRowExpanded = isDetailView && expandedSecurityIds.has(security.id);
          const { dollar, percent } =
            getReturnForSecurity?.(security.id) ?? computeReturn(security);
          const isLast = index === holdings.length - 1;
          const showDetail = isRowExpanded && Boolean(renderExpandedRow);

          const handleRowActivate = () => {
            if (isDetailView) {
              onSecurityToggle(security.id);
            } else {
              onExpandComponent();
            }
          };

          return (
            <Fragment key={security.id}>
              <div
                className={[
                  "w-full overflow-hidden rounded-[10px]",
                  isRowExpanded ? "bg-[var(--db-surface-light)] p-5" : "",
                ].join(" ")}
              >
                <HoldingsRowCells
                  security={security}
                  dollar={dollar}
                  percent={percent}
                  isDetailView={isDetailView}
                  isRowExpanded={isRowExpanded}
                  gridCols={gridCols}
                  onRowActivate={handleRowActivate}
                  onSecurityToggle={onSecurityToggle}
                />

                {isDetailView && renderExpandedRow && (
                  <div
                    className={[
                      ROW_DETAIL_TRANSITION,
                      showDetail ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    ].join(" ")}
                    aria-hidden={!showDetail}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div
                        className={[
                          "flex w-full flex-col gap-[15px] pt-2.5 transition-opacity duration-200 ease-out",
                          showDetail ? "opacity-100 delay-[70ms]" : "opacity-0",
                        ].join(" ")}
                      >
                        {showDetail ? renderExpandedRow(security) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!isLast && (
                <div
                  className="h-px w-full shrink-0 bg-[var(--db-border-secondary)]"
                  aria-hidden
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default HoldingsTable;
