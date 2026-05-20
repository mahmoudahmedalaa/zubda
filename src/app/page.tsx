import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { BriefPreview } from "@/components/BriefPreview";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { interestModules } from "@/data/onboarding";

const trustPoints = ["مصادر واضحة", "شرح بسيط", "متابعة يومية", "بدون زحمة"];

const featureCards = [
  ["وش صار؟", "نختصر لك أهم الأخبار والتغيرات في مكان واحد."],
  ["ليش يهمك؟", "نربط الخبر باهتماماتك، شغلك، منطقتك، وقائمة المتابعة."],
  ["وش تراقب؟", "نعطيك نقاط واضحة تتابعها خلال اليوم."]
];

export default function LandingPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main>
        <section className="page-shell grid items-center gap-10 pb-14 pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:pb-20 lg:pt-12">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-right">
            <p className="mb-4 text-lg font-semibold text-[var(--color-ink-muted)]">
              حيّاك في زبدة
            </p>
            <h1 className="text-[2.55rem] font-black leading-[1.35] tracking-[-0.04em] text-[var(--color-ink)] sm:text-6xl">
              تابع ما يهمك،
              <br />
              <span className="text-[var(--color-zubda-500)]">وافهم الزبدة.</span>
            </h1>
            <p className="arabic-copy mx-auto mt-5 max-w-xl text-lg font-medium text-[var(--color-ink-muted)] sm:text-xl lg:mx-0">
              زبدة تجمع الأخبار، السوق، التقنية، والمواضيع اللي تتابعها في ملخص يومي واضح.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <ButtonLink href="/login">
                ابدأ الآن
                <ArrowLeft aria-hidden size={18} />
              </ButtonLink>
              <ButtonLink href="/brief/sample" variant="secondary">
                شوف مثال
              </ButtonLink>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              {trustPoints.map((point) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-ink-muted)] shadow-sm"
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

        <section className="bg-white/72 py-12">
          <div className="page-shell grid gap-4 md:grid-cols-3">
            {featureCards.map(([title, text]) => (
              <Card className="p-6 text-right shadow-none" key={title}>
                <h2 className="text-2xl font-black">{title}</h2>
                <p className="arabic-copy mt-3 text-sm font-medium text-[var(--color-ink-muted)]">
                  {text}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-shell py-14">
          <div className="grid items-end gap-7 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="text-right">
              <h2 className="text-3xl font-black leading-[1.5]">اختار اهتماماتك وخلاص.</h2>
              <p className="arabic-copy mt-3 max-w-xl text-[var(--color-ink-muted)]">
                ما تحتاج تختار “قسم” واحد. اختر عالمك، وزبدة ترتب لك المهم كل صباح.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {interestModules.slice(0, 12).map((module, index) => (
                <Chip key={module} selected={index < 3}>
                  {module}
                </Chip>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell pb-16">
          <Card className="grid gap-6 bg-[var(--color-zubda-500)] p-7 text-right text-white md:grid-cols-[0.8fr_1.2fr] md:p-9">
            <div>
              <ShieldCheck aria-hidden size={30} />
              <h2 className="mt-4 text-3xl font-black leading-[1.45]">الثقة جزء من الملخص.</h2>
            </div>
            <p className="arabic-copy text-base font-medium text-white/82">
              كل معلومة مهمة معها مصدرها وسبب ظهورها لك. نوضح الخبر، ثم نشرح أثره بلغة بسيطة.
            </p>
          </Card>
        </section>
      </main>
    </>
  );
}
