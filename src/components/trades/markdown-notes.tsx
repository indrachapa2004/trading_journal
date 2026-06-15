"use client";

import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("### ")) {
      return (
        <h4 key={i} className="mt-3 text-sm font-semibold text-zinc-200">
          {line.slice(4)}
        </h4>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h3 key={i} className="mt-3 text-base font-semibold text-zinc-100">
          {line.slice(3)}
        </h3>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-4 list-disc text-zinc-400">
          {line.slice(2)}
        </li>
      );
    }
    const bold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return (
      <p
        key={i}
        className="text-zinc-400"
        dangerouslySetInnerHTML={{ __html: bold || "&nbsp;" }}
      />
    );
  });
}

export function MarkdownNotes({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const [preview, setPreview] = useState(false);

  if (readOnly) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-300">{label}</p>
        <div className="min-h-[80px] rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-sm">
          {value ? renderMarkdown(value) : (
            <p className="text-zinc-600">No notes.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-300">{label}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-zinc-500"
          onClick={() => setPreview((p) => !p)}
        >
          {preview ? "Edit" : "Preview"}
        </Button>
      </div>
      {preview ? (
        <div
          className={cn(
            "min-h-[120px] rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-sm"
          )}
        >
          {value ? renderMarkdown(value) : (
            <p className="text-zinc-600">Nothing to preview.</p>
          )}
        </div>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          rows={5}
          placeholder={placeholder}
          className="border-zinc-700 bg-zinc-950 font-mono text-sm"
        />
      )}
      <p className="text-xs text-zinc-600">
        Supports **bold**, ## headings, and - bullet lists
      </p>
    </div>
  );
}
