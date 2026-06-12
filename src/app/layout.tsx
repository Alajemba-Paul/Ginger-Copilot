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
      <body className="antialiased">{children}</body>
    </html>
  );
}
