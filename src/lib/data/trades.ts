import { createClient } from "@/lib/supabase/server";
import { getActiveAccount } from "@/lib/data/accounts";
import type { Trade, TradeScreenshot } from "@/types/database";

export async function getCurrentUserEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email ?? null;
}

export async function getStartingBalance(): Promise<number> {
  const account = await getActiveAccount();
  return Number(account?.starting_balance ?? 0);
}

async function tradesQuery() {
  const supabase = await createClient();
  const account = await getActiveAccount();

  let query = supabase.from("trades").select("*").order("entry_at", {
    ascending: false,
  });

  if (account?.id) {
    query = query.eq("account_id", account.id);
  }

  return query;
}

export async function getTrades(): Promise<Trade[]> {
  const { data, error } = await tradesQuery();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Trade[];
}

export async function getTradeById(id: string): Promise<Trade | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Trade | null) ?? null;
}

export async function getTradeScreenshots(
  tradeId: string
): Promise<Array<TradeScreenshot & { url: string }>> {
  const supabase = await createClient();
  const { data: screenshots, error } = await supabase
    .from("trade_screenshots")
    .select("*")
    .eq("trade_id", tradeId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return Promise.all(
    ((screenshots ?? []) as TradeScreenshot[]).map(async (shot) => {
      const { data } = await supabase.storage
        .from("trade-screenshots")
        .createSignedUrl(shot.storage_path, 3600);

      return {
        ...shot,
        url: data?.signedUrl ?? "",
      };
    })
  );
}

export async function getTradesForDate(dateKey: string): Promise<Trade[]> {
  const trades = await getTrades();
  return trades.filter((trade) => {
    const exitAt = trade.exit_at ?? trade.entry_at;
    return exitAt.slice(0, 10) === dateKey;
  });
}
