"use client";

import React from 'react';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-4 group no-underline">
      {/* The Centered Tile */}
      <div className="flex items-center justify-center w-12 h-12 bg-[#0B0B0B] border border-white/5 rounded-[14px] shadow-2xl transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
          {/* Asymmetrical Mountain Path */}
          <path 
            d="M3 17L8 9L12 13L17 4L21 17" 
            stroke="#10b981" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col items-start leading-none">
        <div className="flex items-center text-2xl tracking-tighter">
          <span className="font-bold text-white">Trad</span>
          <span className="font-light text-emerald-500">venture</span>
        </div>
        <span className="text-[9px] font-medium text-zinc-500 tracking-[0.4em] uppercase mt-1 ml-0.5">
          Journey to Edge
        </span>
      </div>
    </Link>
  );
};