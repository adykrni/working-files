import Image from "next/image";

function Arrow() {
  return (
    <div className="relative size-[10px] shrink-0 overflow-hidden">
      <Image
        src="/icons/loryn-arrow-right.svg"
        alt=""
        width={10}
        height={10}
        className="size-full"
        aria-hidden
      />
    </div>
  );
}

function TokenColumn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[118px] w-[182px] shrink-0 flex-col items-start gap-[7px] rounded-[3.5px] bg-[#eceff5] p-[7px]">
      <p className="font-radio text-[8px] font-bold leading-[8.5px] text-black">{label}</p>
      <div className="flex min-h-0 w-full flex-1 flex-col items-start gap-[3.5px] rounded-[3.5px] border-[0.36px] border-solid border-[#bdbdbd] bg-[#fcfcfc] p-[7px] font-radio text-[10px] leading-[1.4]">
        {children}
      </div>
    </div>
  );
}

export function TokenArchitectureFlow() {
  return (
    <div className="w-full min-w-0 max-w-[700px] overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]">
      <div
        className="relative h-[202px] w-[700px] bg-white"
        aria-label="Token architecture — primitives, semantic, and component layers"
      >
        <div className="absolute left-[29px] top-[42px]">
          <TokenColumn label="PRIMITIVES">
            <p className="text-[#171717]">Raw values</p>
            <p className="whitespace-pre text-[#6d6c6c]">
              {`teal-500 = #209688
danger-500 = #D92D2D
spacing steps, radii`}
            </p>
          </TokenColumn>
        </div>

        <div className="absolute left-[230px] top-[96px]">
          <Arrow />
        </div>

        <div className="absolute left-[259px] top-[42px]">
          <TokenColumn label="SEMANTIC">
            <p className="text-[#171717]">Sit above primitives, referencing primitives by intent</p>
            <p className="whitespace-pre text-[#6d6c6c]">
              {`surface/primary → teal-500
border/default → neutral-300
text/tertiary → neutral-500`}
            </p>
          </TokenColumn>
        </div>

        <div className="absolute left-[460px] top-[96px]">
          <Arrow />
        </div>

        <div className="absolute left-[489px] top-[42px]">
          <TokenColumn label="COMPONENT">
            <p className="text-[#171717]">Tokens sit at the top, scoped to a single component</p>
            <p className="text-[#6d6c6c]">button/bg → primary</p>
          </TokenColumn>
        </div>
      </div>
    </div>
  );
}
