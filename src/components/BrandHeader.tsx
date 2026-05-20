import { ButtonLink } from "@/components/ui/Button";
import type { ReactElement } from "react";
import Link from "next/link";

export function BrandHeader(): ReactElement {
  return (
    <header className="page-shell flex items-center justify-between py-6">
      <Link className="flex items-center gap-2" href="/">
        <span className="grid size-10 place-items-center rounded-2xl bg-[var(--color-zubda-500)] text-xl font-black text-white">
          ز
        </span>
        <span className="text-2xl font-black leading-none">زبدة</span>
      </Link>
      <nav className="flex items-center gap-2 text-sm">
        <ButtonLink href="/pricing" variant="ghost">
          الأسعار
        </ButtonLink>
        <ButtonLink href="/login" variant="secondary">
          ادخل
        </ButtonLink>
      </nav>
    </header>
  );
}
