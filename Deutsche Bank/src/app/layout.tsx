import type { Metadata } from "next";
import { deutscheBankDisplay, deutscheBankText } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deutsche Bank — Net Wealth Dashboard",
  description: "Deutsche Bank Wealth Management net wealth dashboard",
  icons: {
    icon: "/dwo-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${deutscheBankDisplay.variable} ${deutscheBankText.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
