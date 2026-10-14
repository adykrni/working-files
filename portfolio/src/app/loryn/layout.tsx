import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loryn AI — Case Study",
  description:
    "Solo designer on a live enterprise product — shipped a 0→1 design system for Loryn, an AI assistant for 17k+ employees.",
};

export default function LorynLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="font-radio">{children}</div>;
}
