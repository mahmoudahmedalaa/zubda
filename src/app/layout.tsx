import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic"
});

const latin = Manrope({
  subsets: ["latin"],
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
    <html lang="ar" dir="rtl" className={`${arabic.variable} ${latin.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
