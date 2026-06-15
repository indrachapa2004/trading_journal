import { AlertTriangle } from "lucide-react";

import { getProfile, getActiveAccount } from "@/lib/data/accounts";
import { getTrades } from "@/lib/data/trades";
import { computeRiskLimitStatus } from "@/lib/risk";
import { formatCurrency } from "@/lib/trades";

export async function RiskLimitBanner() {
  const [profile, trades, account] = await Promise.all([
    getProfile(),
    getTrades(),
    getActiveAccount(),
  ]);

  if (!profile) return null;

  const status = computeRiskLimitStatus(trades, profile);
  if (!status.dailyExceeded && !status.weeklyExceeded) return null;

  const currency = account?.currency ?? "USD";

  return (
    <div className="flex items-start gap-3 rounded-lg border border-rose-900/50 bg-rose-950/40 px-4 py-3 text-sm text-rose-200 backdrop-blur">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-400" />
      <div className="space-y-1">
        <p className="font-medium text-rose-100">Risk limit warning</p>
        {status.dailyExceeded ? (
          <p>
            Daily loss {formatCurrency(status.dailyLoss, currency)} reached your
            limit of {formatCurrency(status.dailyLimit!, currency)}.
          </p>
        ) : null}
        {status.weeklyExceeded ? (
          <p>
            Weekly loss {formatCurrency(status.weeklyLoss, currency)} reached your
            limit of {formatCurrency(status.weeklyLimit!, currency)}.
          </p>
        ) : null}
      </div>
    </div>
  );
}
