"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, signUpAction } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/client";
import { getPasswordStrength, validatePassword } from "@/lib/password";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === "signup") {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const result = await signInAction({ email, password });
        if (result?.error) setError(result.error);
      } else {
        const result = await signUpAction({
          email,
          password,
          firstName,
          lastName,
        });
        if (result?.error) {
          setError(result.error);
        } else if (result?.needsEmailConfirmation) {
          setSuccess(result.message ?? "Check your email to confirm your account.");
        }
      }
    } catch {
      // redirect() throws — expected on successful auth
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  const passwordStrength =
    mode === "signup" ? getPasswordStrength(password) : [];

  return (
    <div className="rounded-xl border border-slate-700/60 bg-[#0e1223]/95 p-6 ring-1 ring-white/5 sm:p-8">
      <div className="mb-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-green-400">
          Secure access
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50">
          {mode === "login" ? "Welcome back." : "Create your account."}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {mode === "login"
            ? "Sign in to review your trades and performance."
            : "Start logging trades and discovering your edge."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="first_name"
                className="text-xs font-medium text-slate-300"
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
                  "h-11 border-slate-700 bg-slate-950/70 text-slate-100 placeholder:text-slate-400",
                  "focus-visible:border-green-500/70 focus-visible:ring-green-500/30"
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="last_name"
                className="text-xs font-medium text-slate-300"
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
                  "h-11 border-slate-700 bg-slate-950/70 text-slate-100 placeholder:text-slate-400",
                  "focus-visible:border-green-500/70 focus-visible:ring-green-500/30"
                )}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-slate-300">
            Email
          </Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "h-11 border-slate-700 bg-slate-950/70 pl-10 text-slate-100 placeholder:text-slate-400",
                "focus-visible:border-green-500/70 focus-visible:ring-green-500/30"
              )}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-slate-300"
            >
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "h-11 border-slate-700 bg-slate-950/70 pl-10 pr-12 text-slate-100 placeholder:text-slate-400",
                "focus-visible:border-green-500/70 focus-visible:ring-green-500/30"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
            </button>
          </div>
          {mode === "signup" && password.length > 0 && (
            <ul className="mt-2 space-y-1">
              {passwordStrength.map((rule) => (
                <li
                  key={rule.id}
                  className={cn(
                    "text-[11px]",
                    rule.met ? "text-green-400" : "text-slate-400"
                  )}
                >
                  {rule.met ? "✓" : "○"} {rule.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {success && (
          <p
            role="status"
            className="rounded-lg border border-green-500/25 bg-green-500/10 px-3 py-2 text-sm text-green-300"
          >
            {success}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
          >
            {error}
          </p>
        )}

        {/* Primary CTA */}
        <Button
          type="submit"
          className="h-11 w-full bg-green-500 font-medium text-slate-950 hover:bg-green-400"
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
        <div className="h-px flex-1 bg-slate-700" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-700" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className={cn(
          "flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-slate-700 bg-slate-950/60 px-4 text-sm text-slate-200 transition-colors",
          "hover:border-slate-600 hover:bg-slate-900 hover:text-slate-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1223]",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <GoogleIcon />
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-slate-400">
        {mode === "login" ? (
          <>
            No account?{" "}
            <Link
              href="/signup"
              className="font-medium text-green-300 transition-colors hover:text-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              Sign up for free
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-green-300 transition-colors hover:text-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
