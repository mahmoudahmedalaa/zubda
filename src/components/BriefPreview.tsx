import { Bell, ChartNoAxesColumnIncreasing, CircleDollarSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ReactElement } from "react";

const watchItems = [
  ["تصريحات الفيدرالي", "اليوم"],
  ["نتائج Nvidia", "بعد الإغلاق"],
  ["أسعار النفط", "مباشر"]
];

export function BriefPreview(): ReactElement {
  return (
    <div className="float-slow relative mx-auto w-full max-w-[430px]">
      <div className="float-soft absolute -right-4 top-24 hidden rounded-3xl bg-white p-4 shadow-[var(--shadow-card)] sm:block">
        <p className="text-xs font-bold text-[var(--color-ink-muted)]">مؤشر السوق</p>
        <p className="mt-1 text-xl font-black text-[var(--color-zubda-500)]">حذر</p>
      </div>
      <div className="float-soft absolute -left-5 bottom-20 hidden rounded-3xl bg-white p-4 shadow-[var(--shadow-card)] sm:block">
        <p className="text-xs font-bold text-[var(--color-ink-muted)]">قائمة المتابعة</p>
        <p className="mt-1 text-xl font-black text-[var(--color-trust-500)]">٣ إشارات</p>
      </div>
      <Card className="overflow-hidden border-white/80 bg-white text-right">
        <div className="relative overflow-hidden bg-[var(--color-zubda-500)] p-6 text-white">
          <div className="scan-line absolute inset-x-6 top-0 h-px bg-white/80" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white/72">زبدة اليوم جاهزة</p>
            <Bell aria-hidden size={20} />
          </div>
          <h2 className="mt-4 text-3xl font-black leading-[1.45]">وش المهم قبل يومك؟</h2>
        </div>
        <div className="space-y-5 p-5">
          <section>
            <h3 className="text-base font-black text-[var(--color-zubda-600)]">الملخص</h3>
            <p className="arabic-copy mt-2 text-base font-medium text-[var(--color-ink-muted)]">
              السوق هادئ لكن حساس. التقنية والطاقة هم أكثر موضوعين يستحقون انتباهك اليوم
            </p>
          </section>
          <section>
            <h3 className="text-base font-black text-[var(--color-ink)]">تابع اليوم</h3>
            <div className="mt-3 grid gap-2">
              {watchItems.map(([item, time]) => (
                <div
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 text-sm font-bold"
                  key={item}
                >
                  <span>{item}</span>
                  <span className="text-xs text-[var(--color-ink-muted)]">{time}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-[var(--color-trust-50)] p-4">
              <ChartNoAxesColumnIncreasing aria-hidden className="text-[var(--color-trust-500)]" size={22} />
              <h3 className="mt-3 text-sm font-black text-[var(--color-trust-700)]">وش أثرها عليك؟</h3>
              <p className="arabic-copy mt-1 text-xs font-medium text-[var(--color-ink-muted)]">
                لو تتابع التقنية، ركز على الفائدة والإنفاق السحابي
              </p>
            </div>
            <div className="rounded-3xl bg-[var(--color-zubda-50)] p-4">
              <CircleDollarSign aria-hidden className="text-[var(--color-zubda-500)]" size={22} />
              <h3 className="mt-3 text-sm font-black text-[var(--color-zubda-700)]">بالعملة اللي تفهمها</h3>
              <p className="arabic-copy mt-1 text-xs font-medium text-[var(--color-ink-muted)]">
                ١٠٠ مليون دولار ≈ ٣٦٧ مليون درهم
              </p>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
}
