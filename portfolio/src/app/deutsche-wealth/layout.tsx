import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deutsche Wealth Online + — Case Study",
  description:
    "Redesigning portfolio management for Deutsche Bank — modernized the desktop experience for 22k+ wealth managers with progressive disclosure and vertical navigation.",
};

export default function DeutscheWealthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="font-radio">{children}</div>;
}
