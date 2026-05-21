"use client";

import { motion } from "framer-motion";
import { BarChart3, BriefcaseBusiness, CircleDollarSign, MapPin, Target } from "lucide-react";
import { type ReactElement } from "react";

const profileInputs = [
  { label: "دورك", value: "مستثمر", icon: BriefcaseBusiness },
  { label: "منطقتك", value: "الإمارات والخليج", icon: MapPin },
  { label: "عملتك", value: "AED", icon: CircleDollarSign }
];

const rankedSignals = [
  { label: "الفائدة", score: 82, note: "تضغط على أسهم النمو" },
  { label: "النفط", score: 74, note: "يحرك مزاج الخليج" },
  { label: "التقنية", score: 69, note: "فرص وتقلب" }
];

export function SignalFlow(): ReactElement {
  return (
    <div className="relative overflow-hidden rounded-[40px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="absolute -left-16 -top-16 size-48 rounded-full bg-[var(--color-saffron-300)]/18 blur-3xl" />
      <div className="absolute -bottom-20 right-8 size-56 rounded-full bg-[var(--color-zubda-300)]/16 blur-3xl" />

      <div className="relative grid gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="text-right">
            <p className="text-sm font-black text-[var(--color-zubda-600)]">محرك التخصيص</p>
            <h3 className="display-arabic mt-2 text-3xl font-black leading-[1.25]">كيف تختار زبدتك؟</h3>
          </div>
          <div className="grid size-14 place-items-center rounded-[22px] bg-[var(--color-zubda-50)] text-[var(--color-zubda-600)]">
            <Target aria-hidden size={25} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {profileInputs.map(({ label, value, icon: Icon }, index) => (
            <motion.div
              className="rounded-[24px] bg-[var(--color-paper)] p-4 text-right"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              key={label}
            >
              <Icon aria-hidden className="text-[var(--color-zubda-500)]" size={20} />
              <p className="mt-3 text-xs font-black text-[var(--color-ink-muted)]">{label}</p>
              <p className="mt-1 text-lg font-black">{value}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-[30px] bg-[var(--color-ink-panel)] p-5 text-white">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-white/68">ترتيب الإشارات</p>
              <h4 className="mt-1 text-2xl font-black">الأعلى صلة بك</h4>
            </div>
            <BarChart3 aria-hidden className="text-[var(--color-saffron-300)]" size={26} />
          </div>
          <div className="grid gap-4">
            {rankedSignals.map((signal, index) => (
              <div className="grid gap-2" key={signal.label}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black">{signal.label}</span>
                  <span className="text-xs font-black text-white/62">{signal.score}/100</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/12">
                  <motion.span
                    className="block h-full rounded-full bg-[var(--color-saffron-300)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${signal.score}%` }}
                    transition={{ delay: 0.25 + index * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="text-xs font-semibold text-white/62">{signal.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-[var(--color-trust-50)] p-5 text-right">
          <p className="text-sm font-black text-[var(--color-trust-700)]">النتيجة</p>
          <p className="arabic-copy mt-2 text-sm font-bold text-[var(--color-ink-muted)]">
            بدل ملخص عام، تبدأ بالأشياء الأقرب لمحفظتك وشغلك والقرارات اللي قدامك
          </p>
        </div>
      </div>
    </div>
  );
}
