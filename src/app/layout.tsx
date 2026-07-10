import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";

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
          "min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased",
          geist.variable,
          jetbrainsMono.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
