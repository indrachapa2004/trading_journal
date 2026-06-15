"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getActiveAccount } from "@/lib/data/accounts";
import { TRADE_STRATEGIES } from "@/lib/trade-strategies";
import { TRADE_MISTAKE_VALUES } from "@/lib/trade-psychology";
import { createClient } from "@/lib/supabase/server";
import type { AssetClass, ScreenshotPhase } from "@/types/database";

const addTradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(20),
  direction: z.enum(["long", "short"]),
  asset_class: z.enum(["stocks", "forex", "crypto", "options", "futures"]),
  quantity: z.coerce.number().positive("Quantity must be positive"),
  entry_price: z.coerce.number().positive("Entry price must be positive"),
  exit_price: z.coerce.number().positive().optional().or(z.literal("")),
  entry_at: z.string().optional(),
  exit_at: z.string().optional(),
  stop_loss: z.coerce.number().positive().optional().or(z.literal("")),
  take_profit: z.coerce.number().positive().optional().or(z.literal("")),
  fees: z.coerce.number().min(0).default(0),
  strategy: z.string().optional(),
  emotional_state: z.string().optional(),
  pre_trade_notes: z.string().optional(),
  post_trade_notes: z.string().optional(),
  rules_acknowledged: z.string().optional(),
  mistakes: z.string().optional(),
  self_rating: z.coerce.number().int().min(1).max(10).optional().or(z.literal("")),
});

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

const psychologySchema = z.object({
  mistakes: z.array(z.enum(TRADE_MISTAKE_VALUES)),
  self_rating: z.number().int().min(1).max(10).nullable(),
  emotional_state: z
    .enum(["calm", "confident", "anxious", "fomo", "revenge"])
    .nullable()
    .optional(),
});

const bulkImportRowSchema = z.object({
  symbol: z.string().min(1),
  direction: z.enum(["long", "short"]),
  asset_class: z.enum(["stocks", "forex", "crypto", "options", "futures"]).default("stocks"),
  quantity: z.coerce.number().positive(),
  entry_price: z.coerce.number().positive(),
  exit_price: z.coerce.number().positive().optional(),
  entry_at: z.string().min(1),
  exit_at: z.string().optional(),
  stop_loss: z.coerce.number().positive().optional(),
  take_profit: z.coerce.number().positive().optional(),
  fees: z.coerce.number().min(0).default(0),
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

function parseRuleIds(value: string | undefined) {
  if (!value?.trim()) return [];
  return value.split(",").map((id) => id.trim()).filter(Boolean);
}

function parseMistakes(value: string | undefined) {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((m) => m.trim())
    .filter((m): m is (typeof TRADE_MISTAKE_VALUES)[number] =>
      TRADE_MISTAKE_VALUES.includes(m as (typeof TRADE_MISTAKE_VALUES)[number])
    );
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

async function resolveAccountId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
) {
  const account = await getActiveAccount();
  if (account) return account.id;

  const { data } = await supabase
    .from("accounts")
    .select("id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  return data?.id ?? null;
}

async function uploadTradeScreenshot(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  tradeId: string,
  file: File,
  phase: ScreenshotPhase = "before",
  caption?: string
) {
  const extension = file.name.split(".").pop() ?? "png";
  const storagePath = `${userId}/${tradeId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("trade-screenshots")
    .upload(storagePath, file, { upsert: false });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { error: screenshotRowError } = await supabase
    .from("trade_screenshots")
    .insert({
      trade_id: tradeId,
      user_id: userId,
      storage_path: storagePath,
      caption: caption ?? (phase === "before" ? "Before" : "After"),
      phase,
    });

  if (screenshotRowError) {
    await supabase.storage.from("trade-screenshots").remove([storagePath]);
    return { error: screenshotRowError.message };
  }

  return { storagePath };
}

export async function createTrade(formData: FormData) {
  const parsed = addTradeSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const data = parsed.data;
  const { supabase, userId } = await getUserId();
  const accountId = await resolveAccountId(supabase, userId);

  const strategyTags =
    data.strategy &&
    TRADE_STRATEGIES.some((item) => item.value === data.strategy)
      ? [data.strategy]
      : [];

  const entryAt = data.entry_at
    ? new Date(data.entry_at).toISOString()
    : new Date().toISOString();
  const exitAt = data.exit_at ? new Date(data.exit_at).toISOString() : null;
  const exitPrice = parseOptionalNumber(data.exit_price);

  const { data: trade, error } = await supabase
    .from("trades")
    .insert({
      user_id: userId,
      account_id: accountId,
      symbol: data.symbol.toUpperCase(),
      direction: data.direction,
      asset_class: data.asset_class as AssetClass,
      quantity: data.quantity,
      entry_price: data.entry_price,
      exit_price: exitPrice,
      entry_at: entryAt,
      exit_at: exitAt,
      stop_loss: parseOptionalNumber(data.stop_loss),
      take_profit: parseOptionalNumber(data.take_profit),
      fees: data.fees ?? 0,
      pre_trade_notes: data.pre_trade_notes?.trim() || null,
      post_trade_notes: data.post_trade_notes?.trim() || null,
      emotional_state: parseEmotionalState(data.emotional_state),
      tags: strategyTags,
      mistakes: parseMistakes(data.mistakes),
      self_rating: parseOptionalNumber(data.self_rating),
      rules_acknowledged: parseRuleIds(data.rules_acknowledged),
      screenshot_url: null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  const beforeShot = formData.get("screenshot_before");
  if (beforeShot instanceof File && beforeShot.size > 0) {
    const result = await uploadTradeScreenshot(
      supabase,
      userId,
      trade.id,
      beforeShot,
      "before"
    );
    if ("error" in result && result.error) return { error: result.error };
  }

  const afterShot = formData.get("screenshot_after");
  if (afterShot instanceof File && afterShot.size > 0) {
    const result = await uploadTradeScreenshot(
      supabase,
      userId,
      trade.id,
      afterShot,
      "after"
    );
    if ("error" in result && result.error) return { error: result.error };
  }

  const legacyShot = formData.get("screenshot");
  if (legacyShot instanceof File && legacyShot.size > 0) {
    const result = await uploadTradeScreenshot(
      supabase,
      userId,
      trade.id,
      legacyShot,
      "before"
    );
    if ("error" in result && result.error) return { error: result.error };
  }

  revalidatePath("/dashboard");
  revalidatePath("/trades");
  revalidatePath("/analytics");
  revalidatePath("/calendar");
  return { success: true, tradeId: trade.id };
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

export async function updateTradePsychology(
  tradeId: string,
  input: z.infer<typeof psychologySchema>
) {
  const parsed = psychologySchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid psychology data" };
  }

  const { supabase, userId } = await getUserId();

  const { error } = await supabase
    .from("trades")
    .update({
      mistakes: parsed.data.mistakes,
      self_rating: parsed.data.self_rating,
      emotional_state: parsed.data.emotional_state ?? undefined,
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
  revalidatePath("/analytics");
  return { success: true };
}

export async function bulkImportTrades(rows: z.infer<typeof bulkImportRowSchema>[]) {
  const { supabase, userId } = await getUserId();
  const accountId = await resolveAccountId(supabase, userId);

  const validated: z.infer<typeof bulkImportRowSchema>[] = [];
  const errors: string[] = [];

  for (let index = 0; index < rows.length; index++) {
    const parsed = bulkImportRowSchema.safeParse(rows[index]);
    if (!parsed.success) {
      errors.push(`Row ${index + 1}: ${parsed.error.issues[0]?.message}`);
    } else {
      validated.push(parsed.data);
    }
  }

  if (errors.length > 0) {
    return { error: errors[0] };
  }

  if (validated.length === 0) {
    return { error: "No valid rows to import." };
  }

  const inserts = validated.map((data) => ({
    user_id: userId,
    account_id: accountId,
    symbol: data.symbol.toUpperCase(),
    direction: data.direction,
    asset_class: data.asset_class,
    quantity: data.quantity,
    entry_price: data.entry_price,
    exit_price: data.exit_price ?? null,
    entry_at: new Date(data.entry_at).toISOString(),
    exit_at: data.exit_at ? new Date(data.exit_at).toISOString() : null,
    stop_loss: data.stop_loss ?? null,
    take_profit: data.take_profit ?? null,
    fees: data.fees ?? 0,
    tags: data.tags ? parseTags(data.tags) : [],
  }));

  const { error } = await supabase.from("trades").insert(inserts);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/trades");
  revalidatePath("/analytics");
  return { success: true, count: inserts.length };
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
  return { success: true };
}

export async function uploadScreenshot(
  tradeId: string,
  formData: FormData
) {
  const file = formData.get("file");
  const phase = (formData.get("phase") as ScreenshotPhase) ?? "before";
  const caption = formData.get("caption")?.toString();

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image file." };
  }

  const { supabase, userId } = await getUserId();

  const result = await uploadTradeScreenshot(
    supabase,
    userId,
    tradeId,
    file,
    phase,
    caption
  );

  if ("error" in result && result.error) {
    return { error: result.error };
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

export async function getTradeDetail(tradeId: string) {
  const { supabase, userId } = await getUserId();

  const { data: trade, error } = await supabase
    .from("trades")
    .select("*")
    .eq("id", tradeId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { error: error.message };
  if (!trade) return { error: "Trade not found." };

  const { data: screenshots } = await supabase
    .from("trade_screenshots")
    .select("*")
    .eq("trade_id", tradeId)
    .order("created_at", { ascending: true });

  const screenshotsWithUrls = await Promise.all(
    ((screenshots ?? []) as import("@/types/database").TradeScreenshot[]).map(
      async (shot) => {
        const { data: signed } = await supabase.storage
          .from("trade-screenshots")
          .createSignedUrl(shot.storage_path, 3600);
        return { ...shot, url: signed?.signedUrl ?? "" };
      }
    )
  );

  return { trade: trade as import("@/types/database").Trade, screenshots: screenshotsWithUrls };
}
