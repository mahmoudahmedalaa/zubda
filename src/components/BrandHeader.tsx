import { ButtonLink } from "@/components/ui/Button";
import type { ReactElement } from "react";
import Link from "next/link";

export function BrandHeader(): ReactElement {
  return (
    <header className="page-shell flex items-center justify-between py-5">
      <Link className="flex items-baseline gap-2" href="/">
        <span className="text-xl font-bold">زبدة</span>
        <span className="font-mono text-xs uppercase tracking-normal text-[var(--color-ink-muted)]">
          Zubda
        </span>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <ButtonLink href="/pricing" variant="ghost">
          الأسعار
        </ButtonLink>
        <ButtonLink href="/login" variant="secondary">
          دخول
        </ButtonLink>
      </nav>
    </header>
  );
}
