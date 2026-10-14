import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KLM Holidays — Case Study",
  description:
    "KLM Holidays case study — a reconfigurable Offers component shipped to engineering, with A/B-tested variants that lifted bookings 27% in the BeNeLux market.",
};

export default function KlmLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
