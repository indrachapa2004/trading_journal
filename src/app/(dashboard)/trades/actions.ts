"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const tradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(20),
  direction: z.enum(["long", "short"]),
  asset_class: z.enum(["stocks", "forex", "crypto", "options", "futures"]),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  entry_price: z.coerce.number().positive("Entry price must be positive"),
  exit_price: z.coerce.number().positive().optional().or(z.literal("")),
  entry_at: z.string().min(1),
  exit_at: z.string().optional(),
  stop_loss: z.coerce.number().positive().optional().or(z.literal("")),
  take_profit: z.coerce.number().positive().optional().or(z.literal("")),
  fees: z.coerce.number().min(0).default(0),
  pre_trade_notes: z.string().optional(),
  post_trade_notes: z.string().optional(),
  emotional_state: z.string().optional(),
  tags: z.string().optional(),
});

function parseOptionalNumber(value: unknown) {
  if (value === "" || value == null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function parseEmotionalState(value: string | undefined) {
  const states = ["calm", "confident", "anxious", "fomo", "revenge"] as const;
  if (!value || !states.includes(value as (typeof states)[number])) {
    return null;
  }
  return value as (typeof states)[number];
}

function parseTags(value: string | undefined) {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return { supabase, userId: user.id };
}

export async function createTrade(formData: FormData) {
  const parsed = tradeSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const data = parsed.data;
  const { supabase, userId } = await getUserId();

  const { data: account } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  const { data: trade, error } = await supabase
    .from("trades")
    .insert({
      user_id: userId,
      account_id: account?.id ?? null,
      symbol: data.symbol.toUpperCase(),
      direction: data.direction,
      asset_class: data.asset_class,
      quantity: data.quantity,
      entry_price: data.entry_price,
      exit_price: parseOptionalNumber(data.exit_price),
      entry_at: new Date(data.entry_at).toISOString(),
      exit_at: data.exit_at ? new Date(data.exit_at).toISOString() : null,
      stop_loss: parseOptionalNumber(data.stop_loss),
      take_profit: parseOptionalNumber(data.take_profit),
      fees: data.fees ?? 0,
      pre_trade_notes: data.pre_trade_notes || null,
      post_trade_notes: data.post_trade_notes || null,
      emotional_state: parseEmotionalState(data.emotional_state),
      tags: parseTags(data.tags),
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/trades");
  redirect(`/trades/${trade.id}`);
}

export async function updateTrade(tradeId: string, formData: FormData) {
  const parsed = tradeSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const data = parsed.data;
  const { supabase, userId } = await getUserId();

  const { error } = await supabase
    .from("trades")
    .update({
      symbol: data.symbol.toUpperCase(),
      direction: data.direction,
      asset_class: data.asset_class,
      quantity: data.quantity,
      entry_price: data.entry_price,
      exit_price: parseOptionalNumber(data.exit_price),
      entry_at: new Date(data.entry_at).toISOString(),
      exit_at: data.exit_at ? new Date(data.exit_at).toISOString() : null,
      stop_loss: parseOptionalNumber(data.stop_loss),
      take_profit: parseOptionalNumber(data.take_profit),
      fees: data.fees ?? 0,
      pre_trade_notes: data.pre_trade_notes || null,
      post_trade_notes: data.post_trade_notes || null,
      emotional_state: parseEmotionalState(data.emotional_state),
      tags: parseTags(data.tags),
      updated_at: new Date().toISOString(),
    })
    .eq("id", tradeId)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/trades");
  revalidatePath(`/trades/${tradeId}`);
  redirect(`/trades/${tradeId}`);
}

export async function deleteTrade(tradeId: string) {
  const { supabase, userId } = await getUserId();

  const { data: screenshots } = await supabase
    .from("trade_screenshots")
    .select("storage_path")
    .eq("trade_id", tradeId)
    .eq("user_id", userId);

  if (screenshots?.length) {
    await supabase.storage
      .from("trade-screenshots")
      .remove(screenshots.map((s) => s.storage_path));
  }

  const { error } = await supabase
    .from("trades")
    .delete()
    .eq("id", tradeId)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/trades");
  redirect("/trades");
}

export async function uploadScreenshot(tradeId: string, formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image file." };
  }

  const { supabase, userId } = await getUserId();

  const extension = file.name.split(".").pop() ?? "png";
  const path = `${userId}/${tradeId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("trade-screenshots")
    .upload(path, file, { upsert: false });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { error: dbError } = await supabase.from("trade_screenshots").insert({
    trade_id: tradeId,
    user_id: userId,
    storage_path: path,
    caption: (formData.get("caption") as string) || null,
  });

  if (dbError) {
    await supabase.storage.from("trade-screenshots").remove([path]);
    return { error: dbError.message };
  }

  revalidatePath(`/trades/${tradeId}`);
  return { success: true };
}

export async function deleteScreenshot(screenshotId: string, tradeId: string) {
  const { supabase, userId } = await getUserId();

  const { data: screenshot } = await supabase
    .from("trade_screenshots")
    .select("storage_path")
    .eq("id", screenshotId)
    .eq("user_id", userId)
    .single();

  if (screenshot?.storage_path) {
    await supabase.storage
      .from("trade-screenshots")
      .remove([screenshot.storage_path]);
  }

  const { error } = await supabase
    .from("trade_screenshots")
    .delete()
    .eq("id", screenshotId)
    .eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/trades/${tradeId}`);
  return { success: true };
}
