"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const action =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
              },
            },
          });

    const { data, error: authError } = await action;
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (mode === "signup" && data.user) {
      const trimmedFirst = firstName.trim();
      const trimmedLast = lastName.trim();
      const displayName = [trimmedFirst, trimmedLast].filter(Boolean).join(" ");

      await supabase
        .from("profiles")
        .update({
          first_name: trimmedFirst || null,
          last_name: trimmedLast || null,
          display_name: displayName || null,
        })
        .eq("id", data.user.id);
    }

    router.refresh();
    router.push(mode === "signup" ? "/onboarding" : "/dashboard");
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl",
        "border-t border-white/10"
      )}
    >
      {/* Branding */}
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-800 text-emerald-400 text-xs font-bold ring-1 ring-white/10">
            TJ
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-300">
            Trading Journal
          </span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
          {mode === "login" ? "Sign in to your edge." : "Create your account."}
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          {mode === "login"
            ? "Enter your credentials to access your performance lab."
            : "Start logging trades and discovering your edge."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="first_name"
                className="text-zinc-400 text-xs font-medium"
              >
                First name
              </Label>
              <Input
                id="first_name"
                autoComplete="given-name"
                placeholder="Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={cn(
                  "bg-zinc-800/50 border-zinc-700/60 text-zinc-100 placeholder:text-zinc-600",
                  "focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="last_name"
                className="text-zinc-400 text-xs font-medium"
              >
                Last name
              </Label>
              <Input
                id="last_name"
                autoComplete="family-name"
                placeholder="Rivera"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={cn(
                  "bg-zinc-800/50 border-zinc-700/60 text-zinc-100 placeholder:text-zinc-600",
                  "focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
                )}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-zinc-400 text-xs font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "pl-9 bg-zinc-800/50 border-zinc-700/60 text-zinc-100 placeholder:text-zinc-600",
                "focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
              )}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-zinc-400 text-xs font-medium"
            >
              Password
            </Label>
            {mode === "login" && (
              <Link
                href="/forgot-password"
                className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
            <Input
              id="password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="••••••••"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "pl-9 bg-zinc-800/50 border-zinc-700/60 text-zinc-100 placeholder:text-zinc-600",
                "focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
              )}
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
            {error}
          </p>
        )}

        {/* Primary CTA */}
        <Button
          type="submit"
          className="w-full bg-zinc-100 text-zinc-900 hover:bg-white font-medium h-10"
          disabled={loading}
        >
          {loading
            ? "Please wait…"
            : mode === "login"
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-[11px] text-zinc-600">or</span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className={cn(
          "flex w-full items-center justify-center gap-2.5 rounded-md border border-zinc-700/60 bg-zinc-800/40 px-4 py-2 text-sm text-zinc-300 transition-colors",
          "hover:border-zinc-600 hover:bg-zinc-800/70 hover:text-zinc-100",
          "disabled:opacity-50"
        )}
      >
        <GoogleIcon />
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      {/* Footer link */}
      <p className="mt-6 text-center text-xs text-zinc-600">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link
              href="/signup"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Sign up for free
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
