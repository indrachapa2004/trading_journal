import { Coffee } from "lucide-react";
import Link from "next/link";

export function SupportButton() {
  return (
    <Link
      href="https://ko-fi.com/indrachapajayasinghe"
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-10 w-full items-center justify-center gap-2.5 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-zinc-100"
    >
      <Coffee className="h-5 w-5" />
      <span>Support Development</span>
    </Link>
  );
}