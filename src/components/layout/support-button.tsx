import { Coffee } from "lucide-react";
import Link from "next/link";

export function SupportButton() {
  return (
    <Link
      href="https://ko-fi.com/indrachapajayasinghe"
      target="_blank"
      rel="noopener noreferrer"
      className="w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2.5 font-medium transition-all text-[#00f58d] bg-emerald-950/40 border-2 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-500/20 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:text-emerald-300"
    >
      <Coffee className="h-5 w-5" />
      <span>Support Development</span>
    </Link>
  );
}