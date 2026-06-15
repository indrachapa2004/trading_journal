"use client";

import { useMemo, useState, useTransition } from "react";
import { Upload } from "lucide-react";

import { bulkImportTrades } from "@/app/(dashboard)/trades/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SCHEMA_FIELDS = [
  { key: "symbol", label: "Symbol", required: true },
  { key: "direction", label: "Direction (long/short)", required: true },
  { key: "asset_class", label: "Asset class", required: false },
  { key: "quantity", label: "Quantity", required: true },
  { key: "entry_price", label: "Entry price", required: true },
  { key: "exit_price", label: "Exit price", required: false },
  { key: "entry_at", label: "Entry date/time", required: true },
  { key: "exit_at", label: "Exit date/time", required: false },
  { key: "stop_loss", label: "Stop loss", required: false },
  { key: "take_profit", label: "Take profit", required: false },
  { key: "fees", label: "Fees", required: false },
  { key: "tags", label: "Tags", required: false },
] as const;

type FieldKey = (typeof SCHEMA_FIELDS)[number]["key"];

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(current.trim());
      if (row.some((c) => c)) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  if (current || row.length) {
    row.push(current.trim());
    if (row.some((c) => c)) rows.push(row);
  }

  return rows;
}

function guessMapping(headers: string[]): Partial<Record<FieldKey, number>> {
  const map: Partial<Record<FieldKey, number>> = {};
  const aliases: Record<FieldKey, string[]> = {
    symbol: ["symbol", "ticker", "instrument"],
    direction: ["direction", "side", "type"],
    asset_class: ["asset_class", "asset", "class"],
    quantity: ["quantity", "qty", "size", "shares"],
    entry_price: ["entry_price", "entry", "open price", "price"],
    exit_price: ["exit_price", "exit", "close price"],
    entry_at: ["entry_at", "entry date", "date", "open time"],
    exit_at: ["exit_at", "exit date", "close time"],
    stop_loss: ["stop_loss", "stop", "sl"],
    take_profit: ["take_profit", "target", "tp"],
    fees: ["fees", "commission", "fee"],
    tags: ["tags", "strategy", "tag"],
  };

  headers.forEach((header, index) => {
    const normalized = header.toLowerCase().trim();
    for (const [field, names] of Object.entries(aliases) as [FieldKey, string[]][]) {
      if (names.some((n) => normalized.includes(n))) {
        map[field] = index;
      }
    }
  });

  return map;
}

export function CsvImport() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Partial<Record<FieldKey, number>>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const preview = useMemo(() => rows.slice(0, 3), [rows]);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const parsed = parseCsv(text);
      if (parsed.length < 2) {
        setError("CSV must include a header row and at least one data row.");
        return;
      }
      const [headerRow, ...dataRows] = parsed;
      setHeaders(headerRow);
      setRows(dataRows);
      setMapping(guessMapping(headerRow));
      setError(null);
      setSuccess(null);
    };
    reader.readAsText(file);
  }

  function buildRows() {
    return rows.map((row) => {
      const get = (field: FieldKey) => {
        const idx = mapping[field];
        return idx != null ? row[idx] ?? "" : "";
      };

      return {
        symbol: get("symbol"),
        direction: (get("direction").toLowerCase().includes("short")
          ? "short"
          : "long") as "long" | "short",
        asset_class: (get("asset_class") || "stocks") as
          | "stocks"
          | "forex"
          | "crypto"
          | "options"
          | "futures",
        quantity: Number(get("quantity")),
        entry_price: Number(get("entry_price")),
        exit_price: get("exit_price") ? Number(get("exit_price")) : undefined,
        entry_at: get("entry_at"),
        exit_at: get("exit_at") || undefined,
        stop_loss: get("stop_loss") ? Number(get("stop_loss")) : undefined,
        take_profit: get("take_profit") ? Number(get("take_profit")) : undefined,
        fees: Number(get("fees") || "0"),
        tags: get("tags") || undefined,
      };
    });
  }

  function handleImport() {
    setError(null);
    setSuccess(null);

    const required = SCHEMA_FIELDS.filter((f) => f.required);
    for (const field of required) {
      if (mapping[field.key] == null) {
        setError(`Map required field: ${field.label}`);
        return;
      }
    }

    startTransition(async () => {
      const result = await bulkImportTrades(buildRows());
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSuccess(`Imported ${result.count} trades successfully.`);
      setHeaders([]);
      setRows([]);
    });
  }

  return (
    <Card className="border-zinc-800/80 bg-zinc-900/50 ring-1 ring-white/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Upload className="size-4 text-emerald-400" />
          <CardTitle className="text-zinc-100">Bulk CSV import</CardTitle>
        </div>
        <CardDescription className="text-zinc-500">
          Upload broker exports and map columns to your journal schema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-400">Broker CSV file</Label>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:text-zinc-200"
          />
        </div>

        {headers.length > 0 ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SCHEMA_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-xs text-zinc-500">
                    {field.label}
                    {field.required ? " *" : ""}
                  </Label>
                  <Select
                    value={
                      mapping[field.key] != null
                        ? String(mapping[field.key])
                        : null
                    }
                    onValueChange={(v) =>
                      setMapping((m) => ({
                        ...m,
                        [field.key]: v ? Number(v) : undefined,
                      }))
                    }
                  >
                    <SelectTrigger className="border-zinc-700 bg-zinc-950">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((header, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {preview.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-zinc-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 text-zinc-500">
                    <tr>
                      {headers.map((h) => (
                        <th key={h} className="px-3 py-2 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-t border-zinc-800">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 font-mono text-zinc-400">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            <Button onClick={handleImport} disabled={isPending}>
              {isPending ? "Importing..." : `Import ${rows.length} trades`}
            </Button>
          </>
        ) : null}

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-400">{success}</p> : null}
      </CardContent>
    </Card>
  );
}
