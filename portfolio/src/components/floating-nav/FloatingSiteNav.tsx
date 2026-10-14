"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { site } from "@/lib/content";

type CaseStudyId = "loryn" | "deutsche-wealth" | "klm" | "audi";
type SitePageId = CaseStudyId | "resume";

const caseStudies: {
  id: CaseStudyId;
  label: string;
  href: string;
  navigable?: boolean;
}[] = [
  { id: "loryn", label: "Loryn AI", href: "/loryn" },
  { id: "deutsche-wealth", label: "Deutsche Bank", href: "/deutsche-wealth" },
  { id: "klm", label: "KLM Holidays", href: "/klm", navigable: false },
  { id: "audi", label: "Audi", href: "/audi", navigable: false },
];

const utilityLinks = [
  { id: "home", label: "Home", href: "/" },
  { id: "resume", label: "Resume", href: site.resumeUrl ?? "/resume" },
  { id: "contact", label: "Get in touch", href: site.links.mail },
] as const;

const menuSpring = { type: "spring" as const, duration: 0.45, bounce: 0 };
const menuExitSpring = { type: "spring" as const, duration: 0.28, bounce: 0 };
const backdropEase = { duration: 0.25, ease: [0.2, 0, 0, 1] as const };

const menuVariants = {
  initial: { opacity: 0, scale: 0.96, y: 8, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: menuSpring,
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    transition: menuExitSpring,
  },
};

type FloatingSiteNavProps = {
  currentPage?: SitePageId;
};

function MenuRow({
  label,
  href,
  disabled = false,
}: {
  label: string;
  href: string;
  disabled?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-disabled={disabled || undefined}
      onClick={disabled ? (event) => event.preventDefault() : undefined}
      className={`flex h-8 max-h-8 w-full items-center justify-between gap-4 rounded-[6px] px-2 py-0 text-base leading-none transition-colors md:h-auto md:max-h-none md:p-1.5 ${
        disabled ? "cursor-default text-[#d0d0d0]" : "text-foreground hover:bg-surface-card"
      }`}
    >
      {label}
      <Image
        src="/icons/chevron-right.svg"
        alt=""
        width={5}
        height={9}
        aria-hidden
        className={`shrink-0 ${disabled ? "opacity-30" : ""}`}
      />
    </Link>
  );
}

export function FloatingSiteNav({ currentPage }: FloatingSiteNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleCaseStudies = caseStudies.filter((study) => study.id !== currentPage);

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropEase}
            className="fixed inset-0 z-40 backdrop-blur-[16px] md:hidden"
            aria-hidden
            onClick={() => setIsOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-10 md:left-auto md:right-16 md:translate-x-0 md:items-end lg:right-[94px]">
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              key="nav-menu"
              variants={menuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ transformOrigin: "bottom center" }}
              className="w-[204px] overflow-hidden rounded-[10px] border border-[#ddd] bg-[#fcfcfc] shadow-[0_4px_10px_0_rgba(0,0,0,0.1)] md:w-[230px]"
            >
              <div className="flex flex-col gap-1.5 p-1 md:gap-1">
                {visibleCaseStudies.map((study) => (
                  <MenuRow
                    key={study.id}
                    label={study.label}
                    href={study.href}
                    disabled={study.navigable === false}
                  />
                ))}

                <div className="my-1 h-px w-full bg-divider" aria-hidden />

                {utilityLinks.map((link) => (
                  <MenuRow
                    key={link.id}
                    label={link.label}
                    href={link.href}
                    disabled={
                      (link.id === "resume" && currentPage === "resume") ||
                      (link.id === "home" && currentPage === undefined && false)
                    }
                  />
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          whileTap={{ scale: 0.96 }}
          className="flex size-10 shrink-0 items-center justify-center rounded-[6px] bg-[#0E0A1F]"
        >
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={menuSpring}
          >
            <path
              d="M0 6H12M6 0V12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.button>
      </div>
    </>
  );
}

/** @deprecated Use FloatingSiteNav */
export function FloatingCaseStudyNav({ currentPage }: { currentPage: CaseStudyId }) {
  return <FloatingSiteNav currentPage={currentPage} />;
}
