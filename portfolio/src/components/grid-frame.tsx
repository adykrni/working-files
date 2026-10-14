import { contentMaxWidth } from "@/lib/grid-spec";

export function SectionDivider() {
  return (
    <div className="relative w-full" aria-hidden>
      <img
        src="/images/decorator-mobile.svg"
        alt=""
        width={440}
        height={12}
        className="block w-full h-auto md:hidden"
        decoding="sync"
      />
      <div className="relative left-1/2 hidden w-[min(calc(100vw-3rem),55.625rem)] -translate-x-1/2 md:block">
        <img
          src="/images/decorator-web.svg"
          alt=""
          width={890}
          height={12}
          className="block w-full h-auto"
          decoding="sync"
        />
      </div>
    </div>
  );
}

export function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="mx-auto w-full px-6 pb-24"
      style={{ maxWidth: contentMaxWidth }}
    >
      {children}
    </main>
  );
}
