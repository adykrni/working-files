"use client";

import { useState } from "react";
import {
  DeutscheBankLogoLockup,
  LoginFooterLinks,
  OnboardingCard,
  OnboardingInput,
  OnboardingLayout,
} from "../ui/OnboardingLayout";
import { ONBOARDING_INPUT_SHADOW } from "@/types/onboarding";

interface LoginStepProps {
  onLogin: () => void;
}

export function LoginStep({ onLogin }: LoginStepProps) {
  const [username, setUsername] = useState("nickthomas1983");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <OnboardingLayout footerLinks={<LoginFooterLinks />}>
      <div className="flex w-full max-w-[395px] flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-5 px-2.5">
          <DeutscheBankLogoLockup />
          <h1 className="text-center font-display text-[20px] leading-normal tracking-[0.18px] text-[var(--db-primary)]">
            Digital wealth experience,
            <br />
            tailored for you.
          </h1>
        </div>

        <OnboardingCard width="login">
          <div className="flex w-full max-w-[315px] flex-col gap-5">
            <OnboardingInput
              label="Username"
              value={username}
              onChange={setUsername}
            />
            <OnboardingInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            <button
              type="button"
              onClick={onLogin}
              className="flex h-[39px] w-full items-center justify-center rounded-[6px] bg-[var(--db-primary)] text-[16px] leading-none text-white transition-opacity hover:opacity-90"
              style={{ boxShadow: ONBOARDING_INPUT_SHADOW }}
            >
              Login
            </button>
            <p className="text-[10px] leading-4 text-[#848fa4]">
              By logging in to this system, you have read, fully understood and agree to the{" "}
              <span className="underline">E-banking Terms & Conditions and Privacy Statement.</span>
            </p>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="size-3.5 rounded-[3px] border border-[var(--db-border)]"
                style={{ boxShadow: ONBOARDING_INPUT_SHADOW }}
              />
              <span className="text-[14px] leading-[18px] text-[#848a98]">Remember Me</span>
            </label>
          </div>
        </OnboardingCard>
      </div>
    </OnboardingLayout>
  );
}
