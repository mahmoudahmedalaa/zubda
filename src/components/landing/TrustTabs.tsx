"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Eye, Link2, Radar, ShieldCheck } from "lucide-react";
import { type ReactElement, useState } from "react";
import { Card } from "@/components/ui/Card";

const trustTabs = [
  {
    id: "source",
    label: "المصدر",
    title: "تعرف من وين جت",
    description: "كل نقطة مهمة معها الرابط، الناشر، وسبب دخولها في ملخصك",
    example: "مثال: مصدر رسمي، تقرير شركة، أو نشرة موثوقة",
    icon: Link2
  },
  {
    id: "context",
    label: "السياق",
    title: "نربطها عليك",
    description: "نقرأ الخبر حسب دورك، اهتماماتك، منطقتك، والجهات اللي تتابعها",
    example: "للمستثمر نوضح الأثر، وللمستشار نطلع زاوية تنفع في الاجتماع",
    icon: Eye
  },
  {
    id: "follow",
    label: "وش تراقب؟",
    title: "تعرف الخطوة الجاية",
    description: "بدل ما تلاحق كل شيء، نطلع لك الإشارة اللي تستاهل المتابعة",
    example: "تصريح، نتيجة شركة، حركة نفط، أو قرار يغير المزاج",
    icon: Radar
  }
] as const;

export function TrustTabs(): ReactElement {
  const [activeId, setActiveId] = useState<(typeof trustTabs)[number]["id"]>("source");
  const active = trustTabs.find((item) => item.id === activeId) ?? trustTabs[0];
  const ActiveIcon = active.icon;

  return (
    <section className="page-shell py-20" id="trust">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base font-black text-[var(--color-trust-700)]">الثقة جزء من المنتج</p>
          <h2 className="display-arabic mt-3 text-4xl font-black leading-[1.25] md:text-5xl">اقرأ وأنت مطمئن</h2>
          <p className="arabic-copy mx-auto mt-4 max-w-2xl text-xl font-semibold text-[var(--color-ink-muted)]">
            زبدة ما تكتفي تقولك وش صار. تورّيك المصدر، تربط الخبر بسياقك، وتقولك وش يستاهل المتابعة
          </p>
        </div>

        <Card className="mt-10 overflow-hidden p-0 text-right">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[var(--color-surface)] p-6 md:p-8">
              <div className="grid gap-3">
                {trustTabs.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeId;
                  return (
                    <button
                      aria-pressed={isActive}
                      className={`group flex min-h-20 cursor-pointer items-center justify-between gap-4 rounded-[24px] border px-5 py-4 text-right transition hover:-translate-y-0.5 ${
                        isActive
                          ? "border-[var(--color-zubda-300)] bg-white shadow-[var(--shadow-card)]"
                          : "border-transparent bg-[var(--color-paper)] hover:border-[var(--color-line)] hover:bg-white"
                      }`}
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      type="button"
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={`grid size-12 shrink-0 place-items-center rounded-[16px] transition ${
                            isActive
                              ? "bg-[var(--color-zubda-500)] text-white"
                              : "bg-white text-[var(--color-trust-700)] group-hover:bg-[var(--color-trust-50)]"
                          }`}
                        >
                          <Icon aria-hidden size={22} />
                        </span>
                        <span>
                          <span className="block text-2xl font-black text-[var(--color-ink)]">{item.label}</span>
                          <span className="arabic-copy mt-1 block text-sm font-bold text-[var(--color-ink-muted)]">
                            {item.title}
                          </span>
                        </span>
                      </span>
                      {isActive ? (
                        <ArrowLeft aria-hidden className="shrink-0 text-[var(--color-zubda-500)]" size={18} />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[390px] bg-white p-7 md:p-10">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col justify-center"
              >
                <div className="mb-7 flex items-center gap-4">
                  <div className="grid size-16 place-items-center rounded-[24px] bg-[var(--color-zubda-50)] text-[var(--color-zubda-500)]">
                    <ActiveIcon aria-hidden size={32} />
                  </div>
                  <div className="grid size-13 place-items-center rounded-[20px] bg-[var(--color-trust-50)] text-[var(--color-trust-700)]">
                    <ShieldCheck aria-hidden size={27} />
                  </div>
                </div>
                <p className="text-base font-black text-[var(--color-zubda-600)]">{active.label}</p>
                <h3 className="display-arabic mt-2 max-w-xl text-4xl font-black leading-[1.25] text-[var(--color-ink)] md:text-5xl">
                  {active.title}
                </h3>
                <p className="arabic-copy mt-5 max-w-xl text-xl font-semibold leading-10 text-[var(--color-ink-muted)]">
                  {active.description}
                </p>
                <p className="arabic-copy mt-7 max-w-lg rounded-[26px] bg-[var(--color-saffron-50)] p-5 text-lg font-bold leading-9 text-[var(--color-ink-muted)]">
                  {active.example}
                </p>
              </motion.div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
