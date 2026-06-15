import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  LineChart,
  NotebookPen,
  Tags,
} from "lucide-react";

import { MarketingHeader } from "@/components/layout/marketing-header";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BookOpen,
    title: "Trade logging",
    description:
      "Record entries, exits, fees, tags, and notes for every position.",
  },
  {
    icon: BarChart3,
    title: "Performance analytics",
    description:
      "Track P&L, win rate, profit factor, and your equity curve over time.",
  },
  {
    icon: Tags,
    title: "Strategy tracking",
    description:
      "Tag trades by setup, market condition, and emotional state.",
  },
  {
    icon: NotebookPen,
    title: "Trade journal",
    description:
      "Capture pre-trade and post-trade notes to review what worked.",
  },
  {
    icon: LineChart,
    title: "Visual insights",
    description:
      "See cumulative performance and spot patterns in your results.",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <MarketingHeader />

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Built for serious traders
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Your trades. Your data. Your edge.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A focused trading journal to log every trade, measure performance,
              and improve with clarity — not clutter.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
                Start for free
              </Link>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t bg-background">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Everything you need to journal smarter
              </h2>
              <p className="mt-2 text-muted-foreground">
                Core tools to log trades and review your performance.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-muted">
                      <feature.icon className="size-4" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to review your trading?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Create an account and log your first trade in minutes.
            </p>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg" }), "mt-6 inline-flex")}
            >
              Create your journal
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        Trading Journal — track, analyze, improve.
      </footer>
    </div>
  );
}
