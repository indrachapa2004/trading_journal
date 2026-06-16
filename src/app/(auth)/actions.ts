"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ensureUserSetup,
  resolvePostAuthRedirect,
} from "@/lib/ensure-user-setup";
import { validatePassword } from "@/lib/password";
import { createClient } from "@/lib/supabase/server";

async function getAppOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}

export async function signUpAction(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const passwordError = validatePassword(input.password);
  if (passwordError) return { error: passwordError };

  const email = input.email.trim();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();

  if (!email) return { error: "Email is required." };

  const supabase = await createClient();
  const origin = await getAppOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
    },
  });

  if (error) return { error: error.message };

  if (!data.user) {
    return { error: "Account could not be created. Please try again." };
  }

  if (data.user.identities?.length === 0) {
    return { error: "An account with this email already exists. Try signing in." };
  }

  if (!data.session) {
    return {
      needsEmailConfirmation: true,
      message:
        "Check your email for a confirmation link to finish creating your account.",
    };
  }

  try {
    await ensureUserSetup(data.user.id, firstName, lastName);
  } catch (setupError) {
    return {
      error:
        setupError instanceof Error
          ? setupError.message
          : "Account created but profile setup failed.",
    };
  }

  redirect("/onboarding");
}

export async function signInAction(input: { email: string; password: string }) {
  const email = input.email.trim();
  if (!email) return { error: "Email is required." };

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error) return { error: error.message };
  if (!data.session) return { error: "Sign in failed. Please try again." };

  const destination = await resolvePostAuthRedirect(data.user.id);
  redirect(destination);
}
