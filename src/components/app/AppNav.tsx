"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/Button";
import { signOutCurrentUser } from "@/lib/auth/session";

const links = [
  { href: "/app/today", label: "زبدة اليوم" },
  { href: "/app/archive", label: "زبداتك السابقة" },
  { href: "/app/settings/profile", label: "ملفك" },
  { href: "/app/settings/billing", label: "الخطة" }
];

export function AppNav(): ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut(): Promise<void> {
    await signOutCurrentUser();
    router.replace("/login");
  }

  return (
    <header className="page-shell flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
      <Link className="w-fit transition hover:scale-[1.02]" href="/app/today">
        <BrandLogo />
      </Link>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <nav className="flex gap-2 overflow-x-auto rounded-full border border-[var(--color-line)] bg-white/84 p-1 text-sm font-bold shadow-sm backdrop-blur">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                className={`whitespace-nowrap rounded-full px-4 py-2 transition ${
                  active
                    ? "bg-[var(--color-zubda-500)] text-white shadow-sm"
                    : "text-[var(--color-ink-muted)] hover:bg-[var(--color-zubda-50)] hover:text-[var(--color-ink)]"
                }`}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Button className="min-h-10 px-4 py-2" onClick={handleSignOut} variant="secondary">
          خروج
        </Button>
      </div>
    </header>
  );
}
