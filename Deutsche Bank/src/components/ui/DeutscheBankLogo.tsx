import Image from "next/image";

interface DeutscheBankLogoProps {
  size?: number;
  className?: string;
}

export function DeutscheBankLogo({ size = 28, className = "" }: DeutscheBankLogoProps) {
  return (
    <Image
      src="/dwo-logo.png"
      alt="Deutsche Bank"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      priority
    />
  );
}

interface DeutscheBankLogoLockupProps {
  logoSize?: number;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function DeutscheBankLogoLockup({
  logoSize = 28,
  className = "",
  titleClassName = "text-[11px]",
  subtitleClassName = "text-[14px]",
}: DeutscheBankLogoLockupProps) {
  const gapClass = logoSize <= 16 ? "gap-[7.824px]" : "gap-[14px]";
  const textGapClass = logoSize <= 16 ? "gap-[2.347px]" : "gap-1";

  return (
    <div className={`flex items-center ${gapClass} ${className}`}>
      <DeutscheBankLogo size={logoSize} />
      <div className={`flex flex-col ${textGapClass}`}>
        <span
          className={`font-display leading-none text-[var(--db-primary)] ${titleClassName}`}
        >
          Deutsche Bank
        </span>
        <span
          className={`font-display leading-none text-[var(--db-primary)] ${subtitleClassName}`}
        >
          Wealth Management
        </span>
      </div>
    </div>
  );
}
