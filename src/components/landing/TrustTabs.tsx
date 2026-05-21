"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Eye, Link2, Radar, ShieldCheck } from "lucide-react";
import { type ReactElement, useState } from "react";
import { Card } from "@/components/ui/Card";

const trustTabs = [
  {
    id: "source",
    label: "المصدر",
    title: "تعرف من وين جت المعلومة",
    description: "كل نقطة مهمة معها الرابط، الناشر، وقت النشر، وليش دخلت ملخصك",
    example: "مثال: خبر من مصدر رسمي أو نشرة موثوقة، ومعه سبب اختياره لك",
    icon: Link2
  },
  {
    id: "context",
    label: "السياق",
    title: "نفهمها على عالمك",
    description: "نربط الخبر بدورك، اهتماماتك المختارة، منطقتك، وقائمة المتابعة",
    example: "للمستثمر نوضح أثرها على السوق، وللمستشار نطلع زاوية تنفع في الاجتماع",
    icon: Eye
  },
  {
    id: "follow",
    label: "المتابعة",
    title: "تعرف وش تراقب بعدها",
    description: "بدل ما تتابع كل شيء، نعطيك الإشارة الجاية والجهات اللي قد تتأثر",
    example: "راقب: تصريح، نتيجة شركة، حركة نفط، أو قرار يغير المزاج",
    icon: Radar
  }
] as const;

export function TrustTabs(): ReactElement {
  const [activeId, setActiveId] = useState<(typeof trustTabs)[number]["id"]>("source");
  const active = trustTabs.find((item) => item.id === activeId) ?? trustTabs[0];
  const ActiveIcon = active.icon;

  return (
    <section className="page-shell py-20" id="trust">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="text-right">
          <p className="text-sm font-black text-[var(--color-trust-700)]">الثقة مو ملاحظة صغيرة</p>
          <h2 className="display-arabic mt-3 text-4xl font-black leading-[1.25] md:text-5xl">
            اقرأ وأنت مطمئن
          </h2>
          <p className="arabic-copy mt-4 max-w-xl text-lg font-semibold text-[var(--color-ink-muted)]">
            زبدة تقول لك وش صار، ليش يهمك، وش تراقب، ومتى تترك الموضوع لأنه مجرد وشوشة
          </p>
          <div className="mt-7 rounded-[30px] border border-[var(--color-trust-100)] bg-[var(--color-trust-50)] p-5 text-right">
            <p className="text-base font-black text-[var(--color-trust-700)]">المطلوب مو تعرف كل شيء</p>
            <p className="arabic-copy mt-2 text-base font-bold text-[var(--color-ink-muted)]">
              المطلوب تعرف الشيء اللي يستاهل وقتك، ومعاه سبب واضح يخليك تثق بالملخص
            </p>
          </div>
        </div>

        <Card className="overflow-hidden p-0 text-right">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
            <div className="relative min-h-[330px] bg-[var(--color-ink-panel)] p-7 text-white">
              <div className="absolute left-6 top-6 grid size-12 place-items-center rounded-[18px] bg-[var(--color-trust-100)] text-[var(--color-trust-700)]">
                <ShieldCheck aria-hidden size={27} />
              </div>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col justify-end"
              >
                <div className="mb-5 grid size-16 place-items-center rounded-[24px] bg-white/10 text-[var(--color-saffron-300)]">
                  <ActiveIcon aria-hidden size={32} />
                </div>
                <p className="text-base font-black text-[var(--color-saffron-300)]">{active.label}</p>
                <h3 className="display-arabic mt-2 text-4xl font-black leading-[1.25]">{active.title}</h3>
                <p className="arabic-copy mt-4 text-lg font-semibold text-white/82">{active.description}</p>
                <p className="arabic-copy mt-5 rounded-[24px] bg-white/10 p-4 text-base font-bold text-white/76">
                  {active.example}
                </p>
              </motion.div>
            </div>

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
                        <p className="text-xl font-black text-[var(--color-ink)]">{item.label}</p>
                        <p className="arabic-copy mt-1 text-base font-bold text-[var(--color-ink-muted)]">
                          {item.description}
                        </p>
                      </div>
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-[16px] transition ${
                          isActive
                            ? "bg-[var(--color-zubda-500)] text-white"
                            : "bg-white text-[var(--color-trust-700)] group-hover:bg-[var(--color-trust-50)]"
                        }`}
                      >
                        <Icon aria-hidden size={21} />
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
          </div>
        </Card>
      </div>
    </section>
  );
}
