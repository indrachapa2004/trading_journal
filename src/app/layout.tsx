import type { Metadata } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Tradventure",
  description: "Track trades, analyze performance, and improve your edge.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body
        className={cn(
          "min-h-screen bg-[#101510] font-sans text-zinc-100 antialiased",
          geist.variable,
          jetbrainsMono.variable
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-zinc-100 focus:shadow-lg"
        >
          skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
