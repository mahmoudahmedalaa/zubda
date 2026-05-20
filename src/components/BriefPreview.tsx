import { Card } from "@/components/ui/Card";
import type { ReactElement } from "react";

const watchItems = ["تصريحات الفيدرالي", "نتائج Nvidia", "أسعار النفط"];

export function BriefPreview(): ReactElement {
  return (
    <Card className="overflow-hidden text-right">
      <div className="border-b border-[var(--color-line)] bg-[var(--color-ink)] p-5 text-[var(--color-paper)]">
        <p className="text-sm text-[var(--color-zubda-200)]">زبدة اليوم جاهزة</p>
        <h2 className="mt-2 text-2xl font-bold">وش المهم قبل يومك؟</h2>
      </div>
      <div className="space-y-5 p-5">
        <section>
          <h3 className="text-sm font-bold text-[var(--color-zubda-700)]">زبدة اليوم</h3>
          <p className="arabic-copy mt-2 text-base">
            السوق حذر، التقنية تحت المجهر، وتحركات الطاقة اليوم ممكن تغير نبرة النقاش في الخليج.
          </p>
        </section>
        <section>
          <h3 className="text-sm font-bold text-[var(--color-trust-700)]">راقب هذي</h3>
          <div className="mt-3 grid gap-2">
            {watchItems.map((item) => (
              <div
                className="flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-2 text-sm"
                key={item}
              >
                <span>{item}</span>
                <span className="font-mono text-xs text-[var(--color-ink-muted)]">اليوم</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-[var(--radius-card)] bg-[var(--color-trust-50)] p-4">
          <h3 className="text-sm font-bold text-[var(--color-trust-700)]">وش أثرها عليك؟</h3>
          <p className="arabic-copy mt-2 text-sm text-[var(--color-ink-muted)]">
            إذا كنت تتابع أسهم النمو أو عملاء التقنية، ركز على نبرة الفائدة والإنفاق السحابي.
          </p>
        </section>
      </div>
    </Card>
  );
}
