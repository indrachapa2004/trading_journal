import {
  Brain,
  Calculator,
  Camera,
  LineChart,
  Shield,
  Upload,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: LineChart,
    title: "See the shape of your performance",
    description:
      "Follow your equity curve and compare results by symbol, setup, and session.",
  },
  {
    icon: Brain,
    title: "Keep the decision with the trade",
    description:
      "Record your mindset, mistakes, and rule adherence while the details are fresh.",
  },
  {
    icon: Camera,
    title: "Save the chart context",
    description:
      "Attach before-and-after screenshots to the trade they explain.",
  },
  {
    icon: Calculator,
    title: "Plan risk before entry",
    description:
      "Size positions and keep daily or weekly loss limits in view.",
  },
  {
    icon: Upload,
    title: "Bring in existing trades",
    description:
      "Import broker CSVs and map their columns to your journal.",
  },
  {
    icon: Shield,
    title: "Keep records private",
    description:
      "Row-level access controls keep each account's trade data scoped to its owner.",
  },
];

export function FeatureBento() {
  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-10 grid gap-4 sm:mb-12 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
              Built for the review
            </p>
            <h2 className="mt-3 max-w-lg text-2xl font-medium tracking-tight text-zinc-50 sm:text-3xl">
              Keep the whole trade in view.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-zinc-400 sm:justify-self-end">
            Execution, context, and outcome belong together. Tradventure gives
            you one place to record them—and a quieter way to spot what repeats.
          </p>
        </header>

        <ul className="grid gap-x-10 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="border-t border-white/10 py-5 sm:py-6"
            >
              <div className="flex items-start gap-4">
                <Icon
                  className="mt-0.5 size-4 shrink-0 text-emerald-300"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-medium text-zinc-100">{title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                    {description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
