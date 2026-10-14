import { Noto_Sans } from "next/font/google";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${notoSans.variable} relative min-h-svh bg-white`}
      style={{ fontFamily: "var(--font-noto-sans)" }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
