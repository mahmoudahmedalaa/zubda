import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { BriefPreview } from "@/components/BriefPreview";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { interestModules } from "@/data/onboarding";

const trustPoints = ["مصادر واضحة", "ليش يهمك؟", "وش تراقب؟", "بدون حشو"];

export default function LandingPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main>
        <section className="page-shell grid items-center gap-10 py-10 lg:grid-cols-[1fr_0.88fr] lg:py-16">
          <div className="max-w-2xl text-right">
            <h1 className="text-5xl font-black leading-[1.12] text-[var(--color-ink)] sm:text-6xl">
              زبدة يومك،
              <br />
              بدون زحمة.
            </h1>
            <p className="arabic-copy mt-6 max-w-xl text-xl text-[var(--color-ink-muted)]">
              كل صباح، زبدة شخصية من الأخبار، السوق، التقنية، والمواضيع اللي تهمك.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/login">
                ابدأ زبدتك
                <ArrowLeft aria-hidden size={18} />
              </ButtonLink>
              <ButtonLink href="/brief/sample" variant="secondary">
                جرب زبدة اليوم
              </ButtonLink>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {trustPoints.map((point) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm font-semibold text-[var(--color-ink-muted)]"
                  key={point}
                >
                  <CheckCircle2 aria-hidden className="text-[var(--color-trust-500)]" size={16} />
                  {point}
                </span>
              ))}
            </div>
          </div>
          <BriefPreview />
        </section>

        <section className="border-y border-[var(--color-line)] bg-[var(--color-surface)] py-12">
          <div className="page-shell grid gap-8 lg:grid-cols-3">
            {[
              ["وش السالفة؟", "نلخص الحدث بدون ما ندفنك في التفاصيل."],
              ["ليش يهمك؟", "نربطه بدورك، اهتماماتك، منطقتك، وقائمة المتابعة."],
              ["وش تراقب؟", "نختم بنقاط عملية تعرف تتابعها أو تقولها في اجتماع."]
            ].map(([title, text]) => (
              <div className="text-right" key={title}>
                <Sparkles aria-hidden className="mb-4 text-[var(--color-zubda-600)]" size={24} />
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="page-shell py-14">
          <div className="flex flex-col justify-between gap-5 text-right md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black">خلّ زبدة تفهمك</h2>
              <p className="arabic-copy mt-3 max-w-2xl text-[var(--color-ink-muted)]">
                اختر اهتماماتك، منطقتك، عملتك، وقائمة المتابعة. المنتج يعطيك brief واحد
                مرتب، مو عشر نشرات منفصلة.
              </p>
            </div>
            <ButtonLink href="/login" variant="secondary">
              ابدأ الإعداد
            </ButtonLink>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {interestModules.slice(0, 12).map((module, index) => (
              <Chip key={module} selected={index < 4}>
                {module}
              </Chip>
            ))}
          </div>
        </section>

        <section className="page-shell pb-16">
          <Card className="grid gap-8 p-6 text-right md:grid-cols-[0.8fr_1.2fr] md:p-8">
            <div>
              <p className="font-mono text-xs uppercase text-[var(--color-trust-700)]">Trust UX</p>
              <h2 className="mt-3 text-3xl font-black">من وين جبناها؟</h2>
            </div>
            <div className="arabic-copy text-[var(--color-ink-muted)]">
              كل بند مهم في زبدة يحتاج مصدر، سبب إدراجه، وقوة دليل. الثقة هنا مو footer صغير،
              هي جزء من واجهة القراءة نفسها.
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}
