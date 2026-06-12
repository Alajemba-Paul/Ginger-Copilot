import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ginger Copilot",
  description: "Agentic Intent-Solver for Injective",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0A0A0A] text-white font-mono selection:bg-[#FF7B00]/30">
        {children}
      </body>
    </html>
  );
}
