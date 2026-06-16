import { NextResponse } from "next/server";

import {
  ensureUserSetup,
  resolvePostAuthRedirect,
} from "@/lib/ensure-user-setup";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const meta = user.user_metadata ?? {};
  const firstName = (meta.first_name as string | undefined)?.trim() ?? "";
  const lastName = (meta.last_name as string | undefined)?.trim() ?? "";

  try {
    await ensureUserSetup(user.id, firstName, lastName);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=setup_failed`);
  }

  const destination =
    next === "/dashboard"
      ? await resolvePostAuthRedirect(user.id)
      : next;

  return NextResponse.redirect(`${origin}${destination}`);
}
