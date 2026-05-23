"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Eye, Link2, Radar, ShieldCheck } from "lucide-react";
import { type ReactElement, useState } from "react";

const trustTabs = [
  {
    id: "source",
    label: "مصدر واضح",
    title: "تعرف من وين جت",
    description: "كل نقطة مهمة معها رابطها، اسم الناشر، وسبب دخولها في ملخصك. ما نعطيك كلام عائم ونقول لك صدّقنا.",
    example: "مثال: مصدر رسمي، تقرير شركة، نشرة موثوقة، أو بيانات سوق مع وقت التحديث",
    icon: Link2
  },
  {
    id: "context",
    label: "سياقك أنت",
    title: "نربطها عليك",
    description: "نقرأ الخبر حسب دورك، اهتماماتك، منطقتك، والجهات اللي تتابعها. المستثمر يحتاج زاوية غير المؤسس وغير المستشار.",
    example: "لو تتابع النفط والعقار، ما ندفنها تحت أخبار عامة ما تهمك",
    icon: Eye
  },
  {
    id: "follow",
    label: "وش تتابع بعدها",
    title: "تعرف الخطوة الجاية",
    description: "بدل ما تلاحق كل شيء، نطلع لك الإشارة اللي تستاهل المتابعة ونوضح ليش ممكن تغيّر الصورة.",
    example: "تصريح، نتيجة شركة، حركة نفط، قرار فائدة، أو رقم تضخم يغير مزاج السوق",
    icon: Radar
  }
] as const;

export function TrustTabs(): ReactElement {
  const [activeId, setActiveId] = useState<(typeof trustTabs)[number]["id"]>("source");
  const active = trustTabs.find((item) => item.id === activeId) ?? trustTabs[0];
  const ActiveIcon = active.icon;

  return (
    <section className="page-shell py-24" id="trust">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base font-black text-[var(--color-trust-700)]">الثقة جزء من المنتج</p>
          <h2 className="display-arabic mt-3 text-4xl font-black leading-[1.25] md:text-5xl">اقرأ وأنت مطمّن</h2>
          <p className="arabic-copy mx-auto mt-4 max-w-2xl text-xl font-semibold text-[var(--color-ink-muted)]">
            زبدة ما تكتفي تقولك وش صار. تورّيك من وين جابت الكلام، وليش يخصك، وش تتابع بعده
          </p>
        </div>

        <div className="mt-12 grid gap-6 rounded-[38px] border border-[var(--color-line)] bg-white p-4 text-right shadow-[var(--shadow-card)] md:p-6 lg:grid-cols-[330px_minmax(0,1fr)]">
          <div className="rounded-[30px] bg-[var(--color-surface)] p-3">
            <div className="grid">
              {trustTabs.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === activeId;
                return (
                  <button
                    aria-pressed={isActive}
                    className={`group relative flex min-h-24 cursor-pointer items-center gap-4 border-b border-[var(--color-line)] px-4 py-5 text-right transition last:border-b-0 ${
                      isActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    }`}
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    type="button"
                  >
                    <span
                      className={`absolute inset-y-4 right-0 w-1 rounded-full transition ${
                        isActive ? "bg-[var(--color-zubda-500)] opacity-100" : "bg-transparent opacity-0"
                      }`}
                    />
                    <span
                      className={`grid size-12 shrink-0 place-items-center rounded-[18px] transition ${
                        isActive
                          ? "bg-[var(--color-zubda-500)] text-white"
                          : "bg-white text-[var(--color-trust-700)] group-hover:bg-[var(--color-trust-50)]"
                      }`}
                    >
                      <Icon aria-hidden size={22} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-2xl font-black">{item.label}</span>
                      <span className="arabic-copy mt-1 block text-base font-bold leading-7">{item.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-[32px] bg-[var(--color-paper)] p-7 md:p-10">
            <div className="absolute left-8 top-8 hidden size-20 place-items-center rounded-[28px] bg-[var(--color-zubda-50)] text-[var(--color-zubda-500)] md:grid">
              <ShieldCheck aria-hidden size={34} />
            </div>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-[350px] flex-col justify-center"
            >
              <div className="mb-8 flex items-center gap-4 md:hidden">
                <div className="grid size-14 place-items-center rounded-[22px] bg-[var(--color-zubda-50)] text-[var(--color-zubda-500)]">
                  <ActiveIcon aria-hidden size={28} />
                </div>
                <div className="grid size-14 place-items-center rounded-[22px] bg-[var(--color-trust-50)] text-[var(--color-trust-700)]">
                  <ShieldCheck aria-hidden size={26} />
                </div>
              </div>
              <p className="text-lg font-black text-[var(--color-zubda-600)]">{active.label}</p>
              <h3 className="display-arabic mt-3 max-w-2xl text-4xl font-black leading-[1.2] text-[var(--color-ink)] md:text-6xl">
                {active.title}
              </h3>
              <p className="arabic-copy mt-6 max-w-2xl text-xl font-semibold leading-10 text-[var(--color-ink-muted)] md:text-2xl md:leading-[2]">
                {active.description}
              </p>
              <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-[26px] bg-[var(--color-saffron-50)] p-5 text-[var(--color-ink-muted)]">
                <ArrowLeft aria-hidden className="shrink-0 text-[var(--color-saffron-500)]" size={20} />
                <p className="arabic-copy text-lg font-bold leading-9">{active.example}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
