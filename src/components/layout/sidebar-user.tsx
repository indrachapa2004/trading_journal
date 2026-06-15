import { User } from "lucide-react";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { cn } from "@/lib/utils";

type SidebarUserProps = {
  email: string | null;
  className?: string;
};

export function SidebarUser({ email, className }: SidebarUserProps) {
  const displayEmail = email ?? "Trader";
  const initial = displayEmail.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "border-t border-zinc-800 p-4",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-zinc-100">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-100">Account</p>
          <p className="truncate text-xs text-zinc-400">{displayEmail}</p>
        </div>
        <User className="size-4 shrink-0 text-zinc-500" aria-hidden />
      </div>
      <SignOutButton
        className="w-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
        variant="outline"
      />
    </div>
  );
}
