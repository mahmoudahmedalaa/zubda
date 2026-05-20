import type { ReactElement } from "react";
import { ArchiveClient } from "@/components/briefs/ArchiveClient";

export default function ArchivePage(): ReactElement {
  return (
    <main className="page-shell py-8 text-right">
      <h1 className="text-4xl font-black leading-[1.45]">زبداتك السابقة</h1>
      <p className="arabic-copy mt-3 max-w-2xl text-[var(--color-ink-muted)]">
        كل ملخص جاهز للرجوع له، مع مصادره ونقاط المتابعة.
      </p>
      <ArchiveClient />
    </main>
  );
}
