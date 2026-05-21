"use client";

import { motion } from "framer-motion";
import { Bell, CheckCircle2, CircleDollarSign, RadioTower, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ReactElement } from "react";

const watchItems = [
  ["أسعار النفط", "مهم للخليج"],
  ["نتائج التقنية", "تؤثر على أسهم النمو"],
  ["تصريحات الفائدة", "يؤثر على السوق"]
];

const sourceItems = ["خبر رسمي", "تقرير سوق", "إشارة مهمة"];

export function BriefPreview(): ReactElement {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      className="relative mx-auto w-full max-w-[430px]"
      transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
    >
      <motion.div
        animate={{ x: [0, -7, 0], y: [0, -8, 0] }}
        className="absolute -right-5 top-20 z-10 hidden rounded-[26px] bg-white p-4 shadow-[var(--shadow-card)] sm:block"
        transition={{ duration: 5.8, ease: "easeInOut", repeat: Infinity }}
      >
        <p className="text-xs font-bold text-[var(--color-ink-muted)]">مزاج السوق</p>
        <p className="mt-1 text-xl font-black text-[var(--color-saffron-500)]">حذر</p>
      </motion.div>

      <motion.div
        animate={{ x: [0, 8, 0], y: [0, 8, 0] }}
        className="absolute -left-6 bottom-24 z-10 hidden rounded-[26px] bg-white p-4 shadow-[var(--shadow-card)] sm:block"
        transition={{ duration: 6.4, ease: "easeInOut", repeat: Infinity }}
      >
        <p className="text-xs font-bold text-[var(--color-ink-muted)]">مصادر موثقة</p>
        <p className="mt-1 text-xl font-black text-[var(--color-trust-500)]">٣ إشارات</p>
      </motion.div>

      <Card className="overflow-hidden border-white/80 bg-white text-right">
        <div className="relative overflow-hidden bg-[var(--color-zubda-500)] p-6 text-white">
          <motion.span
            animate={{ y: [0, 144, 0], opacity: [0.16, 0.62, 0.16] }}
            className="absolute inset-x-6 top-0 h-px bg-white/80"
            transition={{ duration: 4.6, ease: "easeInOut", repeat: Infinity }}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white/76">زبدتك جاهزة</p>
            <Bell aria-hidden size={20} />
          </div>
          <h2 className="display-arabic mt-4 text-3xl font-black leading-[1.35]">ما المهم قبل يومك؟</h2>
        </div>

        <div className="space-y-5 p-5">
          <section>
            <h3 className="text-base font-black text-[var(--color-zubda-600)]">الزبدة</h3>
            <p className="arabic-copy mt-2 text-base font-medium text-[var(--color-ink-muted)]">
              السوق هادئ لكنه حساس. التقنية والطاقة أهم ما يستحق انتباهك
            </p>
          </section>

          <section>
            <h3 className="text-base font-black text-[var(--color-ink)]">راقب</h3>
            <div className="mt-3 grid gap-2">
              {watchItems.map(([item, reason], index) => (
                <motion.div
                  animate={{ opacity: [0.78, 1, 0.78] }}
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 text-sm font-bold"
                  key={item}
                  transition={{ duration: 3.2, delay: index * 0.55, repeat: Infinity }}
                >
                  <span>{item}</span>
                  <span className="text-xs text-[var(--color-ink-muted)]">{reason}</span>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-[var(--color-trust-50)] p-4">
              <RadioTower aria-hidden className="text-[var(--color-trust-500)]" size={22} />
              <h3 className="mt-3 text-sm font-black text-[var(--color-trust-700)]">لماذا يهمك؟</h3>
              <p className="arabic-copy mt-1 text-xs font-medium text-[var(--color-ink-muted)]">
                نربط الخبر باهتماماتك بدل سرد عناوين كثيرة
              </p>
            </div>
            <div className="rounded-3xl bg-[var(--color-saffron-50)] p-4">
              <CircleDollarSign aria-hidden className="text-[var(--color-saffron-500)]" size={22} />
              <h3 className="mt-3 text-sm font-black text-[var(--color-ink)]">بالعملة التي تناسبك</h3>
              <p className="arabic-copy mt-1 text-xs font-medium text-[var(--color-ink-muted)]">
                ١٠٠ مليون دولار ≈ ٣٦٧ مليون درهم
              </p>
            </div>
          </section>

          <section className="rounded-[26px] bg-[var(--color-paper)] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-[var(--color-ink)]">
              <Sparkles aria-hidden className="text-[var(--color-zubda-500)]" size={18} />
              كيف وصلنا إليها
            </div>
            <div className="grid gap-2">
              {sourceItems.map((item) => (
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-ink-muted)]" key={item}>
                  <CheckCircle2 aria-hidden className="text-[var(--color-trust-500)]" size={15} />
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </Card>
    </motion.div>
  );
}
