"use client";

import type { AppliedFilters } from "@/data/portfoliosHomeData";
import {
  filtersToFormulaClauses,
  type FormulaClause,
} from "./portfolioFilterModel";

type Props = {
  filters: AppliedFilters;
  searchQuery: string;
  onRemoveToken: (chipId: string) => void;
  onClearSearch: () => void;
};

function TokenPill({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex max-w-[200px] items-center gap-1 rounded-[4px] border border-[#dfe3e9] bg-white py-0.5 pl-2 pr-0.5">
      <span className="truncate text-[12px] leading-[1.35] text-[#07132a]">{label}</span>
      <button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        className="flex size-5 shrink-0 items-center justify-center rounded-[3px] text-[#5d636e] hover:bg-[#f4f7fb] hover:text-[#07132a]"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}

const clauseMetaClass =
  "text-[12px] font-medium leading-[1.35] text-[#85868b]";

function ClauseRow({
  clause,
  onRemoveToken,
}: {
  clause: FormulaClause;
  onRemoveToken: (chipId: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1">
      <span className={clauseMetaClass}>{clause.property}</span>
      <span className={clauseMetaClass}>{clause.operator}</span>
      {clause.tokens.map((token) => (
        <TokenPill
          key={token.chipId}
          label={token.label}
          onRemove={() => onRemoveToken(token.chipId)}
        />
      ))}
    </div>
  );
}

export function PortfolioFilterFormulaBar({
  filters,
  searchQuery,
  onRemoveToken,
  onClearSearch,
}: Props) {
  const clauses = filtersToFormulaClauses(filters);
  const q = searchQuery.trim();
  const hasFormula = clauses.length > 0 || q.length > 0;

  if (!hasFormula) return null;

  return (
    <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-2">
      {q ? (
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          <span className={clauseMetaClass}>Name</span>
          <span className={clauseMetaClass}>contains</span>
          <TokenPill label={`"${q}"`} onRemove={onClearSearch} />
        </div>
      ) : null}
      {clauses.map((clause) => (
        <ClauseRow key={clause.id} clause={clause} onRemoveToken={onRemoveToken} />
      ))}
    </div>
  );
}
