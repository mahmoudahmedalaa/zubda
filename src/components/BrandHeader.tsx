import { ButtonLink } from "@/components/ui/Button";
import type { ReactElement } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export function BrandHeader(): ReactElement {
  return (
    <header className="page-shell flex items-center justify-between py-6">
      <Link className="transition hover:scale-[1.02]" href="/">
        <BrandLogo />
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
