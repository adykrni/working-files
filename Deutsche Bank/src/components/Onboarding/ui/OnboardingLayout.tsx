"use client";

import { ChevronDown, ChevronRight, CircleHelp } from "lucide-react";
import type { ReactNode } from "react";
import { ONBOARDING_CARD_SHADOW, ONBOARDING_INPUT_SHADOW } from "@/types/onboarding";

interface OnboardingLayoutProps {
  children: ReactNode;
  footerLinks?: ReactNode;
}

export function OnboardingLayout({ children, footerLinks }: OnboardingLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#fbfbfb]">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f6f8fc] from-[13.184%] to-[rgba(255,255,255,0)] to-[116.7%]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex shrink-0 items-start justify-between px-6 pt-[18px] sm:px-10">
          <LanguageSelector />
          <NeedHelpLink />
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
          {children}
          {footerLinks && (
            <div className="mt-10 w-full max-w-[259px]">{footerLinks}</div>
          )}
        </main>

        <footer className="shrink-0 pb-6 text-center">
          <p className="text-[12px] leading-normal text-[#848fa4]">
            Unauthorised access to system is prohibited [v6. 1.2]
          </p>
        </footer>
      </div>
    </div>
  );
}

function LanguageSelector() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 text-[14px] leading-none text-[var(--db-primary)]"
      aria-label="Select language"
    >
      <span>EN</span>
      <span
        className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-[2px] bg-[#012169] text-[6px] text-white"
        aria-hidden
      >
        🇬🇧
      </span>
      <ChevronDown size={12} strokeWidth={1.5} className="text-[var(--db-primary)]" />
    </button>
  );
}

function NeedHelpLink() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 text-[14px] leading-[18px] text-[var(--db-primary)]"
    >
      <span>Need help</span>
      <CircleHelp size={16} strokeWidth={1.5} />
    </button>
  );
}

export { DeutscheBankLogoLockup } from "@/components/ui/DeutscheBankLogo";

export function OnboardingCard({
  children,
  className = "",
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "wide" | "login";
}) {
  const widthClass =
    width === "wide"
      ? "w-full max-w-[678px]"
      : width === "login"
        ? "w-full max-w-[395px]"
        : "w-full max-w-[472px]";

  return (
    <div
      className={`rounded-[20px] bg-white p-10 ${widthClass} ${className}`}
      style={{ boxShadow: ONBOARDING_CARD_SHADOW }}
    >
      {children}
    </div>
  );
}

export function StepLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-[10px] leading-4 tracking-normal text-[#848fa4]">
      {children}
    </p>
  );
}

export function StepHeading({ children }: { children: ReactNode }) {
  return (
    <h1 className="mx-auto max-w-[384px] text-center font-display text-[20px] leading-normal tracking-[0.56px] text-[var(--db-primary)]">
      {children}
    </h1>
  );
}

export function OnboardingPrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-[42px] w-[150px] rounded-[6px] bg-[var(--db-primary)] text-[18px] leading-normal text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function OnboardingSkipLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-center text-[18px] leading-normal text-[#9099a8] transition-opacity hover:opacity-80"
    >
      I&apos;ll do this later
    </button>
  );
}

export function OnboardingStepActions({
  onNext,
  onSkip,
  nextLabel = "Next",
  nextDisabled,
}: {
  onNext: () => void;
  onSkip: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-5">
      <OnboardingPrimaryButton onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </OnboardingPrimaryButton>
      <OnboardingSkipLink onClick={onSkip} />
    </div>
  );
}

export function OnboardingDivider() {
  return <div className="h-px w-full bg-[var(--db-border)]" />;
}

export function LoginFooterLinks() {
  const links = ["Connect accounts", "FAQ", "Security tips"];

  return (
    <div className="flex flex-col gap-[18px]">
      {links.map((label) => (
        <button
          key={label}
          type="button"
          className="flex w-full items-end justify-between text-[14px] leading-none text-[#747a85] transition-colors hover:text-[var(--db-primary)]"
        >
          <span>{label}</span>
          <ChevronRight size={10} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}

export function OnboardingInput({
  label,
  value,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  type?: "text" | "password";
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-[14px] leading-[18px] text-[var(--db-primary)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[39px] w-full rounded-[6px] bg-white px-1.5 text-[16px] leading-none text-[var(--db-primary)] outline-none"
        style={{ boxShadow: ONBOARDING_INPUT_SHADOW }}
      />
    </div>
  );
}
