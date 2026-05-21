import { ButtonLink } from "@/components/ui/Button";
import type { ReactElement } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export function BrandHeader(): ReactElement {
  return (
    <header className="page-shell flex items-center justify-between py-5">
      <Link className="transition hover:scale-[1.02]" href="/">
        <BrandLogo />
      </Link>
      <nav className="hidden items-center gap-1 rounded-full border border-[var(--color-line)] bg-white/84 p-1 text-sm font-bold shadow-sm backdrop-blur md:flex">
        <Link className="rounded-full px-4 py-2 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-zubda-50)] hover:text-[var(--color-ink)]" href="/#how">
          كيف تعمل
        </Link>
        <Link className="rounded-full px-4 py-2 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-zubda-50)] hover:text-[var(--color-ink)]" href="/#trust">
          الثقة
        </Link>
        <Link className="rounded-full px-4 py-2 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-zubda-50)] hover:text-[var(--color-ink)]" href="/brief/sample">
          مثال
        </Link>
        <ButtonLink href="/pricing" variant="ghost">
          الأسعار
        </ButtonLink>
      </nav>
      <nav className="flex items-center gap-2 text-sm">
        <ButtonLink className="md:hidden" href="/pricing" variant="ghost">
          الأسعار
        </ButtonLink>
        <ButtonLink href="/login" variant="secondary">
          ادخل
        </ButtonLink>
      </nav>
    </header>
  );
}
