"use client";

import { CurrencyDisplay } from "@/components/WealthOverview/ui/CurrencyDisplay";
import { formatSignedPercent, percentColorClass } from "@/lib/format";
import {
  OnboardingCard,
  OnboardingDivider,
  OnboardingLayout,
  OnboardingStepActions,
  StepHeading,
  StepLabel,
} from "../ui/OnboardingLayout";

interface NetWealthStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const previewPortfolios = [
  { name: "All portfolios", value: 19_575_327, change: 8.9 },
  { name: "Advisory portfolio", value: 8_500_000, change: 18.2 },
  { name: "Execution portfolio", value: 6_200_000, change: -5.1 },
  { name: "Retirement portfolio", value: 4_875_327, change: 10.4 },
];

const allocationSummary = [
  { label: "Equities", value: 58 },
  { label: "Bonds", value: 32 },
  { label: "Cash", value: 10 },
];

export function NetWealthStep({ onNext, onSkip }: NetWealthStepProps) {
  return (
    <OnboardingLayout>
      <div className="flex w-full max-w-[678px] flex-col items-center gap-[55px]">
        <div className="flex w-full flex-col items-center gap-5">
          <StepLabel>STEP 2/2</StepLabel>
          <StepHeading>
            Your Net wealth dashboard brings everything together in one view.
          </StepHeading>

          <OnboardingCard width="wide">
            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2.5">
                <p className="font-display text-[16px] leading-[1.3] text-[#1d2025]">
                  Portfolio overview
                </p>
                <div className="overflow-hidden rounded-[10px] bg-[var(--db-surface-light)] p-1.5">
                  <div className="flex gap-1.5 overflow-x-auto p-0.5">
                    {previewPortfolios.map((portfolio) => (
                      <div
                        key={portfolio.name}
                        className="flex min-w-[130px] flex-1 flex-col gap-1 rounded-[6px] bg-[var(--db-card-bg)] p-2.5"
                      >
                        <p className="truncate text-[11px] leading-none text-[var(--db-primary)]">
                          {portfolio.name}
                        </p>
                        <CurrencyDisplay value={portfolio.value} size="compact" />
                        <p
                          className={`text-[11px] leading-normal ${percentColorClass(portfolio.change)}`}
                        >
                          {formatSignedPercent(portfolio.change)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <OnboardingDivider />

              <div className="flex flex-col gap-2.5">
                <p className="font-display text-[16px] leading-[1.3] text-[#1d2025]">
                  Asset allocation
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {allocationSummary.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[8px] bg-[var(--db-surface-light)] px-3 py-2.5"
                    >
                      <p className="text-[11px] text-[var(--db-muted)]">{item.label}</p>
                      <p className="mt-1 font-display text-[14px] text-[var(--db-primary)]">
                        {item.value}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <OnboardingDivider />

              <ul className="flex flex-col gap-2 text-[13px] leading-normal text-[var(--db-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--db-primary)]" />
                  Consolidated market value across all portfolios
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--db-primary)]" />
                  Real-time performance and allocation insights
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--db-primary)]" />
                  Switch to expert mode for deeper analysis
                </li>
              </ul>
            </div>
          </OnboardingCard>
        </div>

        <OnboardingStepActions
          onNext={onNext}
          onSkip={onSkip}
          nextLabel="Next"
        />
      </div>
    </OnboardingLayout>
  );
}
