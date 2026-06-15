import { cookies } from "next/headers";

export const ACTIVE_ACCOUNT_COOKIE = "active_account_id";

export async function getActiveAccountIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_ACCOUNT_COOKIE)?.value ?? null;
}
