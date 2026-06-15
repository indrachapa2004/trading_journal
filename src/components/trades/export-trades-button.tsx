"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";

import { exportTradesCsv } from "@/app/(dashboard)/settings/actions";
import { Button } from "@/components/ui/button";

export function ExportTradesButton() {
  const [isPending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const result = await exportTradesCsv();
      if (result.error || !result.csv) {
        alert(result.error ?? "Export failed.");
        return;
      }

      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `trades-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isPending}
      className="border-zinc-700"
    >
      <Download className="size-4" />
      {isPending ? "Exporting..." : "Export CSV"}
    </Button>
  );
}
