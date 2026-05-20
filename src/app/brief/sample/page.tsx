import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { BriefPreview } from "@/components/BriefPreview";

export default function SampleBriefPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="page-shell grid gap-8 py-12 lg:grid-cols-[0.75fr_1fr]">
        <section className="text-right">
          <h1 className="text-4xl font-black">جرب زبدة اليوم</h1>
          <p className="arabic-copy mt-4 text-[var(--color-ink-muted)]">
            هذا preview ثابت لهيكل المنتج. الربط مع مصادر حقيقية وذكاء اصطناعي يبدأ في مراحل
            Firebase/AI القادمة.
          </p>
        </section>
        <BriefPreview />
      </main>
    </>
  );
}
