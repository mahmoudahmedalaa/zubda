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
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="text-right">
          <p className="text-base font-black text-[var(--color-trust-700)]">الثقة جزء من المنتج</p>
          <h2 className="display-arabic mt-3 text-4xl font-black leading-[1.25] md:text-5xl">
            اقرأ وأنت مطمئن
          </h2>
          <p className="arabic-copy mt-4 max-w-xl text-xl font-semibold text-[var(--color-ink-muted)]">
            زبدة تقول لك وش صار، ليش يهمك، وش تراقب، ومتى تترك الموضوع لأنه مجرد وشوشة
          </p>
          <div className="mt-7 rounded-[30px] border border-[var(--color-trust-100)] bg-[var(--color-trust-50)] p-6 text-right">
            <p className="text-xl font-black text-[var(--color-trust-700)]">المطلوب مو تعرف كل شيء</p>
            <p className="arabic-copy mt-2 text-lg font-bold text-[var(--color-ink-muted)]">
              المطلوب تعرف الشيء اللي يستاهل وقتك، ومعاه سبب واضح يخليك تثق بالملخص
            </p>
          </div>
        </div>

        <Card className="overflow-hidden p-0 text-right">
          <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="grid gap-3 bg-[var(--color-surface)] p-5">
              {trustTabs.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === activeId;
                return (
                  <button
                    aria-pressed={isActive}
                    className={`group cursor-pointer rounded-[26px] border p-5 text-right transition hover:-translate-y-0.5 ${
                      isActive
                        ? "border-[var(--color-zubda-300)] bg-white shadow-[var(--shadow-card)]"
                        : "border-transparent bg-[var(--color-paper)] hover:border-[var(--color-line)] hover:bg-white"
                    }`}
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-2xl font-black text-[var(--color-ink)]">{item.label}</p>
                        <p className="arabic-copy mt-2 text-base font-bold text-[var(--color-ink-muted)]">
                          {item.description}
                        </p>
                      </div>
                      <span
                        className={`grid size-12 shrink-0 place-items-center rounded-[16px] transition ${
                          isActive
                            ? "bg-[var(--color-zubda-500)] text-white"
                            : "bg-white text-[var(--color-trust-700)] group-hover:bg-[var(--color-trust-50)]"
                        }`}
                      >
                        <Icon aria-hidden size={22} />
                      </span>
                    </div>
                    {isActive ? (
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[var(--color-zubda-600)]">
                        ظاهر في الملخص
                        <ArrowLeft aria-hidden size={15} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[370px] bg-white p-8">
              <div className="absolute left-6 top-6 grid size-12 place-items-center rounded-[18px] bg-[var(--color-trust-50)] text-[var(--color-trust-700)]">
                <ShieldCheck aria-hidden size={27} />
              </div>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col justify-center"
              >
                <div className="mb-5 grid size-16 place-items-center rounded-[24px] bg-[var(--color-zubda-50)] text-[var(--color-zubda-500)]">
                  <ActiveIcon aria-hidden size={32} />
                </div>
                <p className="text-base font-black text-[var(--color-zubda-600)]">{active.label}</p>
                <h3 className="display-arabic mt-2 text-4xl font-black leading-[1.25] text-[var(--color-ink)]">
                  {active.title}
                </h3>
                <p className="arabic-copy mt-4 text-xl font-semibold text-[var(--color-ink-muted)]">
                  {active.description}
                </p>
                <p className="arabic-copy mt-5 rounded-[24px] bg-[var(--color-saffron-50)] p-4 text-base font-bold text-[var(--color-ink-muted)]">
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
