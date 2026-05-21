import Link from "next/link";
import type { ReactElement } from "react";
import { BrandLogo } from "@/components/BrandLogo";

const footerLinks = [
  ["كيف تعمل", "/#how"],
  ["الثقة والمصادر", "/#trust"],
  ["مثال الملخص", "/brief/sample"],
  ["الأسعار", "/pricing"],
  ["الدخول", "/login"]
];

export function BrandFooter(): ReactElement {
  return (
    <footer className="border-t border-[var(--color-line)] bg-white/70 py-10">
      <div className="page-shell grid gap-8 text-right md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <BrandLogo />
          <p className="arabic-copy mt-4 max-w-xl text-sm font-semibold text-[var(--color-ink-muted)]">
            زبدة ملخص يومي عربي يختصر لك المهم من الأخبار والأسواق والموضوعات التي تتابعها، مع مصادر واضحة وسياق مختصر
          </p>
          <p className="mt-4 text-xs font-bold text-[var(--color-ink-muted)]">morning@zubda.ai</p>
        </div>
        <nav className="grid gap-3 text-sm font-bold text-[var(--color-ink-muted)] sm:grid-cols-2 md:min-w-64">
          {footerLinks.map(([label, href]) => (
            <Link className="transition hover:text-[var(--color-zubda-600)]" href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
