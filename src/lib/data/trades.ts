import { createClient } from "@/lib/supabase/server";
import type { Trade, TradeScreenshot } from "@/types/database";

export async function getCurrentUserEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email ?? null;
}

export async function getTrades(): Promise<Trade[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("entry_at", { ascending: false });

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
