export function LibraryDiagram() {
  return (
    <div className="relative w-full pt-2">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex h-[83px] items-center justify-center rounded-[10px] bg-surface-diagram p-[30px]">
          <span className="text-center font-mono text-[15px] leading-[1.3] tracking-[0.003px] text-black">
            Icon library
          </span>
        </div>
        <div className="flex h-[83px] items-center justify-center rounded-[10px] bg-surface-diagram p-[30px]">
          <span className="text-center font-mono text-[15px] leading-[1.3] tracking-[0.003px] text-black">
            Core library
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[69px] hidden h-[64px] w-[514px] -translate-x-1/2 sm:block">
        <svg
          viewBox="0 0 514 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M6 1 L6 32 Q6 62 96 62 L257 62"
            stroke="#2d3541"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d="M508 1 L508 32 Q508 62 418 62 L257 62"
            stroke="#2d3541"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
          <circle cx="6" cy="1" r="3" fill="#2d3541" />
          <circle cx="508" cy="1" r="3" fill="#2d3541" />
        </svg>
      </div>

      <div className="mt-[57px] flex h-[100px] items-center justify-center rounded-[10px] bg-surface-diagram p-[30px]">
        <span className="text-center font-mono text-[15px] leading-[1.3] tracking-[0.003px] text-black">
          Custom library
        </span>
      </div>
    </div>
  );
}
