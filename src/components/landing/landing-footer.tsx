import Link from "next/link";
import { ExternalLink } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Demo", href: "#demo" },
    { label: "Pricing", href: "#pricing" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="text-lg font-semibold text-zinc-100">
              Tradventure
            </Link>
            <p className="mt-3 max-w-sm text-sm text-zinc-500">
              The data-driven journal for traders who care about psychology,
              risk, and measurable edge.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Twitter
                <ExternalLink className="size-3" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
              >
                GitHub
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-300">Product</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-300">Legal</p>
            <ul className="mt-3 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-600">
          © {new Date().getFullYear()} Tradventure. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
