"use client";

import Link from 'next/link';
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-4 group no-underline", className)}>
      {/* The Centered Tile */}
      <div className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-[#19211a]">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6">
          {/* Asymmetrical Mountain Path */}
          <path 
            d="M3 17L8 9L12 13L17 4L21 17" 
            stroke="#83b995"
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col items-start leading-none">
        <div className="flex items-center text-2xl tracking-tighter">
          <span className="font-bold text-white">Trad</span>
          <span className="font-light text-emerald-300">venture</span>
        </div>
        <span className="text-[9px] font-medium text-zinc-500 tracking-[0.4em] uppercase mt-1 ml-0.5">
          Journey to Edge
        </span>
      </div>
    </Link>
  );
};