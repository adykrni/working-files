"use client";

import {
  OnboardingCard,
  OnboardingDivider,
  OnboardingLayout,
  OnboardingStepActions,
  StepHeading,
  StepLabel,
} from "../ui/OnboardingLayout";
import { PortfolioRow } from "../ui/PillChip";
import {
  PORTFOLIO_OPTIONS,
  type PortfolioOptionId,
} from "@/types/onboarding";

interface PortfolioSelectionStepProps {
  selectedPortfolios: PortfolioOptionId[];
  onTogglePortfolio: (id: PortfolioOptionId) => void;
  onSelectAll: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export function PortfolioSelectionStep({
  selectedPortfolios,
  onTogglePortfolio,
  onSelectAll,
  onNext,
  onSkip,
}: PortfolioSelectionStepProps) {
  const allSelected = selectedPortfolios.length === PORTFOLIO_OPTIONS.length;

  return (
    <OnboardingLayout>
      <div className="flex w-full max-w-[472px] flex-col items-center gap-[55px]">
        <div className="flex w-full flex-col items-center gap-5">
          <StepLabel>STEP 1/2</StepLabel>
          <StepHeading>
            Select your portfolios that you would like to have on your dashboard.
          </StepHeading>

          <OnboardingCard>
            <div className="flex w-full flex-col gap-5">
              {PORTFOLIO_OPTIONS.map((portfolio) => (
                <div key={portfolio.id} className="flex flex-col gap-5">
                  <PortfolioRow
                    label={portfolio.label}
                    value={portfolio.value}
                    selected={selectedPortfolios.includes(portfolio.id)}
                    onToggle={() => onTogglePortfolio(portfolio.id)}
                    showCheck={selectedPortfolios.includes(portfolio.id)}
                  />
                  <OnboardingDivider />
                </div>
              ))}
              <button
                type="button"
                onClick={onSelectAll}
                className="px-1 text-left font-display text-[16px] leading-normal text-[var(--db-primary)]"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
          </OnboardingCard>
        </div>

        <OnboardingStepActions onNext={onNext} onSkip={onSkip} />
      </div>
    </OnboardingLayout>
  );
}
