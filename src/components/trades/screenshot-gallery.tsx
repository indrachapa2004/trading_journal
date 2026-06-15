"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";

import {
  deleteScreenshot,
  uploadScreenshot,
} from "@/app/(dashboard)/trades/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TradeScreenshot } from "@/types/database";

type ScreenshotWithUrl = TradeScreenshot & { url: string };

export function ScreenshotGallery({
  tradeId,
  screenshots,
}: {
  tradeId: string;
  screenshots: ScreenshotWithUrl[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpload(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await uploadScreenshot(tradeId, formData);
      if (result && "error" in result) {
        setError(result.error ?? "Upload failed.");
        return;
      }
      formRef.current?.reset();
    });
  }

  function handleDelete(screenshotId: string) {
    if (!confirm("Remove this screenshot?")) return;

    startTransition(async () => {
      const result = await deleteScreenshot(screenshotId, tradeId);
      if (result && "error" in result) {
        setError(result.error ?? "Delete failed.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <form
        ref={formRef}
        action={handleUpload}
        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-2">
          <Label htmlFor="file">Upload screenshot</Label>
          <Input
            id="file"
            name="file"
            type="file"
            accept="image/*"
            required
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="caption">Caption (optional)</Label>
          <Input id="caption" name="caption" placeholder="Entry chart" />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {screenshots.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No screenshots yet. Attach chart images for this trade.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {screenshots.map((shot) => (
            <div
              key={shot.id}
              className="overflow-hidden rounded-lg border bg-background"
            >
              <div className="relative aspect-video bg-muted">
                <Image
                  src={shot.url}
                  alt={shot.caption ?? "Trade screenshot"}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="truncate text-sm text-muted-foreground">
                  {shot.caption ?? "Screenshot"}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleDelete(shot.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
