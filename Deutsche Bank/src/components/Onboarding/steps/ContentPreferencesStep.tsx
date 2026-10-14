"use client";

import {
  OnboardingCard,
  OnboardingDivider,
  OnboardingLayout,
  OnboardingStepActions,
  StepHeading,
  StepLabel,
} from "../ui/OnboardingLayout";
import { PillChip } from "../ui/PillChip";
import {
  CONTENT_EXPLORE_OPTIONS,
  CONTENT_FORMAT_OPTIONS,
  CONTENT_INTEREST_OPTIONS,
  type ContentExplore,
  type ContentFormat,
  type ContentInterest,
} from "@/types/onboarding";

interface ContentPreferencesStepProps {
  selectedFormats: ContentFormat[];
  selectedInterests: ContentInterest[];
  selectedExplore: ContentExplore[];
  onToggleFormat: (value: ContentFormat) => void;
  onToggleInterest: (value: ContentInterest) => void;
  onToggleExplore: (value: ContentExplore) => void;
  onNext: () => void;
  onSkip: () => void;
}

function ChipSection<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <p className="font-display text-[16px] leading-[1.3] text-[#1d2025]">{title}</p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => (
          <PillChip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onToggle={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  );
}

export function ContentPreferencesStep({
  selectedFormats,
  selectedInterests,
  selectedExplore,
  onToggleFormat,
  onToggleInterest,
  onToggleExplore,
  onNext,
  onSkip,
}: ContentPreferencesStepProps) {
  return (
    <OnboardingLayout>
      <div className="flex w-full max-w-[678px] flex-col items-center gap-[55px]">
        <div className="flex w-full flex-col items-center gap-5">
          <StepLabel>STEP 2/2</StepLabel>
          <StepHeading>
            We offer you the best insights. Select your choice for the best content.
          </StepHeading>

          <OnboardingCard width="wide">
            <div className="flex w-full flex-col gap-4">
              <ChipSection
                title="I want to know more about..."
                options={CONTENT_FORMAT_OPTIONS}
                selected={selectedFormats}
                onToggle={onToggleFormat}
              />
              <OnboardingDivider />
              <ChipSection
                title="I’m interested in..."
                options={CONTENT_INTEREST_OPTIONS}
                selected={selectedInterests}
                onToggle={onToggleInterest}
              />
              <OnboardingDivider />
              <ChipSection
                title="I would like to explore..."
                options={CONTENT_EXPLORE_OPTIONS}
                selected={selectedExplore}
                onToggle={onToggleExplore}
              />
            </div>
          </OnboardingCard>
        </div>

        <OnboardingStepActions onNext={onNext} onSkip={onSkip} />
      </div>
    </OnboardingLayout>
  );
}
