import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BloatRay — The Dependency X-Ray",
  description: "Scan, visualize, and auto-clean unused dependency bloat from your Node.js projects. Built by Aarif Khan for the DX-Ray Hackathon.",
  keywords: ["bloatray", "dependency", "bloat", "cli", "node", "npm", "unused", "cleanup", "dx"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} dark`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
