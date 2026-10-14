import Image from "next/image";

const INPUT_JSON = `{
  "component": "Input",
  "type": "controlled",
  "prefill": true,
  "size": {
    "height": "32px",
    "radius": "8px",
    "paddingX": "10px",
    "paddingY": "4px"
  },
  "typography": {
    "fontSize": "14px",
    "lineHeight": "20px"
  },
  "tokens": {
    "border": "var(--input)",
    "background": "transparent",
    "text": "var(--foreground)",
    "placeholder": "var(--muted-foreground)",
    "ring": "var(--ring)"
  },
  "states": {
    "default": {
      "border": "var(--input)",
      "background": "transparent"
    },
    "focus": {
      "border": "var(--ring)",
      "ring": "3px var(--ring) / 50%"
    },
    "disabled": {
      "background": "var(--input) / 50%",
      "opacity": 0.5
    },
    "invalid": {
      "border": "var(--destructive)",
      "ring": "3px var(--destructive) / 20%"
    },
    "prefilled": {
      "value": "agent-proposed",
      "editable": true
    }
  }
}`;

export function ShippedInputPair() {
  return (
    <div className="w-full min-w-0 max-w-[700px] overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]">
      <div
        className="relative h-[280px] w-[700px] shrink-0"
        aria-label="Shipped input states mapped to the token JSON contract"
      >
        <div className="absolute left-0 top-0 h-[280px] w-[300px] overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          <Image
            src="/images/Input.png"
            alt="Input component states as shipped in code"
            width={400}
            height={861}
            className="block h-auto w-[300px] max-w-none"
          />
        </div>

        <div className="pointer-events-none absolute left-[333px] top-[135px] size-2.5 overflow-hidden">
          <Image
            src="/icons/loryn-arrow-right.svg"
            alt=""
            width={10}
            height={10}
            className="size-full"
            aria-hidden
          />
        </div>

        <div className="absolute left-[371px] top-[30px] h-[220px] w-[300px] overflow-x-hidden overflow-y-auto overscroll-contain rounded-[10px] bg-[#f7f7f7] [scrollbar-width:thin]">
          <pre className="m-0 px-4 py-3.5 font-mono text-[12px] leading-[18px] text-[#171717]">
            {INPUT_JSON}
          </pre>
        </div>
      </div>
    </div>
  );
}
