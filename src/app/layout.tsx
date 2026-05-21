import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Readex_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const arabic = Readex_Pro({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic"
});

const display = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display"
});

const latin = Readex_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-latin"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Zubda / زبدة",
  description: "The bottom line on what matters to you.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return (
    <html lang="ar" dir="rtl" className={`${arabic.variable} ${display.variable} ${latin.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
