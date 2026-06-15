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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScreenshotPhase, TradeScreenshot } from "@/types/database";

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
  const [phase, setPhase] = useState<ScreenshotPhase>("before");
  const [isPending, startTransition] = useTransition();

  const beforeShots = screenshots.filter((s) => s.phase === "before");
  const afterShots = screenshots.filter((s) => s.phase === "after");

  function handleUpload(formData: FormData) {
    setError(null);
    formData.set("phase", phase);
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
    <div className="space-y-6">
      <form
        ref={formRef}
        action={handleUpload}
        className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-2">
          <Label htmlFor="file" className="text-zinc-400">Upload screenshot</Label>
          <Input id="file" name="file" type="file" accept="image/*" required className="border-zinc-700 bg-zinc-950" />
        </div>
        <div className="w-full space-y-2 sm:w-36">
          <Label className="text-zinc-400">Phase</Label>
          <Select value={phase} onValueChange={(v) => setPhase((v ?? "before") as ScreenshotPhase)}>
            <SelectTrigger className="border-zinc-700 bg-zinc-950">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="before">Before</SelectItem>
              <SelectItem value="after">After</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="caption" className="text-zinc-400">Caption</Label>
          <Input id="caption" name="caption" placeholder="Entry chart" className="border-zinc-700 bg-zinc-950" />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <GallerySection title="Before" shots={beforeShots} onDelete={handleDelete} isPending={isPending} />
        <GallerySection title="After" shots={afterShots} onDelete={handleDelete} isPending={isPending} />
      </div>
    </div>
  );
}

function GallerySection({
  title,
  shots,
  onDelete,
  isPending,
}: {
  title: string;
  shots: ScreenshotWithUrl[];
  onDelete: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium uppercase tracking-wide text-zinc-500">{title}</h4>
      {shots.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-800 py-8 text-center text-sm text-zinc-600">
          No {title.toLowerCase()} screenshots
        </p>
      ) : (
        <div className="grid gap-3">
          {shots.map((shot) => (
            <div key={shot.id} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <div className="relative aspect-video bg-zinc-900">
                <Image
                  src={shot.url}
                  alt={shot.caption ?? title}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="truncate text-sm text-zinc-500">{shot.caption ?? "Screenshot"}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => onDelete(shot.id)}
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
