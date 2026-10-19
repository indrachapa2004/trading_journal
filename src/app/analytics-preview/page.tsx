import Link from "next/link";
import { notFound } from "next/navigation";

import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { sampleTrades } from "@/lib/sample-trades";
import { cn } from "@/lib/utils";

export default function AnalyticsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main className="min-h-screen space-y-8 bg-zinc-950 p-6 text-zinc-100 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title="Analytics preview"
          description="Explore the analytics components with a representative sample journal."
        >
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Sign in
          </Link>
        </PageHeader>

        <div
          role="status"
          className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-200"
        >
          Sample data preview. These trades are temporary and are not saved to your journal.
        </div>

        <AnalyticsOverview trades={sampleTrades} startingBalance={10000} />
      </div>
    </main>
  );
}
