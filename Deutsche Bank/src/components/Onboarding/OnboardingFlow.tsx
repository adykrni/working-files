"use client";

import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ContentPreferencesStep } from "./steps/ContentPreferencesStep";
import { LoginStep } from "./steps/LoginStep";
import { NetWealthStep } from "./steps/NetWealthStep";
import { PortfolioSelectionStep } from "./steps/PortfolioSelectionStep";
import { onboardingStepVariants } from "./motion";
import type {
  ContentExplore,
  ContentFormat,
  ContentInterest,
  OnboardingStepId,
  PortfolioOptionId,
} from "@/types/onboarding";
import { PORTFOLIO_OPTIONS } from "@/types/onboarding";

const STEP_ORDER: OnboardingStepId[] = ["login", "portfolios", "content", "net-wealth"];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStepId>("login");
  const [selectedPortfolios, setSelectedPortfolios] =
    useState<PortfolioOptionId[]>(["advisory"]);
  const [selectedFormats, setSelectedFormats] = useState<ContentFormat[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<ContentInterest[]>([]);
  const [selectedExplore, setSelectedExplore] = useState<ContentExplore[]>([]);

  const goNext = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(step);
    const nextStep = STEP_ORDER[currentIndex + 1];
    if (nextStep) {
      setStep(nextStep);
    }
  }, [step]);

  const completeOnboarding = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("onboardingComplete", "true");
      window.sessionStorage.setItem(
        "onboardingPreferences",
        JSON.stringify({
          portfolios: selectedPortfolios,
          formats: selectedFormats,
          interests: selectedInterests,
          explore: selectedExplore,
        }),
      );
    }
    router.push("/homev2");
  }, [router, selectedExplore, selectedFormats, selectedInterests, selectedPortfolios]);

  const skipToDashboard = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const togglePortfolio = useCallback((id: PortfolioOptionId) => {
    setSelectedPortfolios((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const selectAllPortfolios = useCallback(() => {
    setSelectedPortfolios((current) =>
      current.length === PORTFOLIO_OPTIONS.length
        ? []
        : PORTFOLIO_OPTIONS.map((p) => p.id),
    );
  }, []);

  const toggleItem = useCallback(<T extends string>(
    value: T,
    setter: Dispatch<SetStateAction<T[]>>,
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        variants={onboardingStepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {step === "login" && <LoginStep onLogin={goNext} />}
        {step === "portfolios" && (
          <PortfolioSelectionStep
            selectedPortfolios={selectedPortfolios}
            onTogglePortfolio={togglePortfolio}
            onSelectAll={selectAllPortfolios}
            onNext={goNext}
            onSkip={goNext}
          />
        )}
        {step === "content" && (
          <ContentPreferencesStep
            selectedFormats={selectedFormats}
            selectedInterests={selectedInterests}
            selectedExplore={selectedExplore}
            onToggleFormat={(value) => toggleItem(value, setSelectedFormats)}
            onToggleInterest={(value) => toggleItem(value, setSelectedInterests)}
            onToggleExplore={(value) => toggleItem(value, setSelectedExplore)}
            onNext={goNext}
            onSkip={goNext}
          />
        )}
        {step === "net-wealth" && (
          <NetWealthStep onNext={completeOnboarding} onSkip={skipToDashboard} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
