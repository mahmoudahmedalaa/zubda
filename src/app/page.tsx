import { ArrowLeft, CheckCircle2, Eye, Filter, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { BriefPreview } from "@/components/BriefPreview";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const trustPoints = ["مصادر واضحة", "شرح بسيط", "متابعة يومية", "بدون زحمة"];

const painItems = [
  ["الزحمة", "أخبار، واتساب، لينكدإن، نشرات، وأسواق تتحرك في نفس الوقت"],
  ["السؤال", "وش المهم فعلاً اليوم؟ وش يخص شغلي وفلوسي واهتماماتي؟"],
  ["النتيجة", "ملخص واحد يوضح وش صار، ليش يهمك، وش تراقب"]
];

const steps = [
  ["١", "اختر عالمك", "دورك، منطقتك، اهتماماتك، عملتك، وقائمة المتابعة"],
  ["٢", "نفلتر الضجيج", "نجمع الإشارات المهمة من مصادر واضحة ونرتبها حسب صلتها بك"],
  ["٣", "توصلك الزبدة", "ملخص صباحي خاص فيك، قصير، مفهوم، وينتهي بنقاط تتابعها"]
];

const modules = [
  "المال والاستثمار",
  "الذكاء الاصطناعي",
  "أعمال الخليج",
  "الطاقة والنفط",
  "العقار",
  "الشركات الناشئة",
  "السياسات",
  "التجزئة",
  "الصحة",
  "الموضة والرفاهية"
];

export default function LandingPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="overflow-hidden">
        <section className="page-shell grid items-center gap-10 pb-16 pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:pb-24 lg:pt-12">
          <Reveal className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-right">
            <p className="mb-4 text-lg font-semibold text-[var(--color-ink-muted)]">حيّاك في زبدة</p>
            <h1 className="text-[2.55rem] font-black leading-[1.35] tracking-[-0.04em] text-[var(--color-ink)] sm:text-6xl">
              تابع ما يهمك،
              <br />
              <span className="text-[var(--color-zubda-500)]">وافهم الزبدة</span>
            </h1>
            <p className="arabic-copy mx-auto mt-5 max-w-xl text-lg font-medium text-[var(--color-ink-muted)] sm:text-xl lg:mx-0">
              زبدة تجمع الأخبار، السوق، التقنية، والمواضيع اللي تتابعها في ملخص يومي واضح
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
          </Reveal>
          <Reveal delay={0.12}>
            <BriefPreview />
          </Reveal>
        </section>

        <section className="bg-white/78 py-16">
          <div className="page-shell">
            <Reveal className="max-w-3xl text-right">
              <h2 className="text-4xl font-black leading-[1.4] md:text-5xl">المشكلة مو نقص أخبار</h2>
              <p className="arabic-copy mt-4 text-lg font-semibold text-[var(--color-ink-muted)]">
                المشكلة إن كل شيء يوصلك بنفس الصوت. زبدة تفصل الإشارة عن الضجيج وتشرحها حسب سياقك
              </p>
            </Reveal>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {painItems.map(([title, text], index) => (
                <Reveal delay={index * 0.08} key={title}>
                  <Card className="h-full p-6 text-right shadow-none">
                    <h3 className="text-3xl font-black">{title}</h3>
                    <p className="arabic-copy mt-4 text-sm font-semibold text-[var(--color-ink-muted)]">{text}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-20">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <Reveal className="text-right">
              <h2 className="text-4xl font-black leading-[1.35] md:text-5xl">كيف تصير الزبدة</h2>
              <p className="arabic-copy mt-4 max-w-xl text-lg font-semibold text-[var(--color-ink-muted)]">
                الفكرة بسيطة: نعرف عالمك، نفلتر اليوم، ثم نعطيك الملخص اللي يستحق وقتك
              </p>
            </Reveal>
            <div className="grid gap-4">
              {steps.map(([number, title, text], index) => (
                <Reveal delay={index * 0.08} key={title}>
                  <div className="group grid gap-4 rounded-[32px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:border-[var(--color-zubda-300)] md:grid-cols-[72px_1fr]">
                    <span className="grid size-16 place-items-center rounded-[24px] bg-[var(--color-zubda-50)] text-2xl font-black text-[var(--color-zubda-600)] transition group-hover:bg-[var(--color-zubda-500)] group-hover:text-white">
                      {number}
                    </span>
                    <div className="text-right">
                      <h3 className="text-2xl font-black">{title}</h3>
                      <p className="arabic-copy mt-2 text-sm font-semibold text-[var(--color-ink-muted)]">{text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-zubda-50)] py-20">
          <div className="page-shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal className="text-right">
              <h2 className="text-4xl font-black leading-[1.35] md:text-5xl">اهتماماتك بدون شكل ممل</h2>
              <p className="arabic-copy mt-4 max-w-xl text-lg font-semibold text-[var(--color-ink-muted)]">
                بدال ما نحشرك في قسم واحد، نبني لك خريطة اهتمام خفيفة تتغير مع استخدامك
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative min-h-[390px] rounded-[40px] bg-white p-6 shadow-[var(--shadow-card)]">
                <div className="absolute inset-x-8 top-1/2 h-px bg-[var(--color-line)]" />
                <div className="absolute inset-y-8 right-1/2 w-px bg-[var(--color-line)]" />
                <div className="relative grid h-full min-h-[342px] grid-cols-2 gap-4">
                  {modules.slice(0, 8).map((module, index) => (
                    <div
                      className={`flex items-center justify-center rounded-[28px] border border-[var(--color-line)] bg-[var(--color-paper)] px-4 text-center text-sm font-black text-[var(--color-ink-muted)] shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-zubda-300)] hover:bg-white hover:text-[var(--color-zubda-600)] ${
                        index === 1 || index === 2 ? "bg-[var(--color-zubda-500)] text-white" : ""
                      }`}
                      key={module}
                    >
                      {module}
                    </div>
                  ))}
                </div>
                <div className="absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[32px] bg-[var(--color-zubda-500)] text-center text-sm font-black text-white shadow-[0_18px_44px_hsl(237_97%_61%/0.3)]">
                  زبدتك
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="page-shell py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal>
              <Card className="overflow-hidden text-right">
                <div className="grid gap-4 p-6">
                  {[
                    [Filter, "نرتب المصدر", "خبر رسمي، إعلان شركة، تقرير سوق"],
                    [Layers3, "نربطه بسياقك", "اهتماماتك، منطقتك، دورك، عملتك"],
                    [Eye, "نوضح الثقة", "مصدر، سبب الإدراج، وما يجب مراقبته"]
                  ].map(([Icon, title, text]) => (
                    <div className="grid grid-cols-[48px_1fr] gap-4 rounded-[26px] bg-[var(--color-paper)] p-4" key={title as string}>
                      <span className="grid size-12 place-items-center rounded-[18px] bg-white text-[var(--color-zubda-500)]">
                        <Icon aria-hidden size={22} />
                      </span>
                      <div>
                        <h3 className="text-xl font-black">{title as string}</h3>
                        <p className="arabic-copy mt-1 text-sm font-semibold text-[var(--color-ink-muted)]">
                          {text as string}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
            <Reveal delay={0.1} className="text-right">
              <ShieldCheck aria-hidden className="text-[var(--color-zubda-500)]" size={34} />
              <h2 className="mt-5 text-4xl font-black leading-[1.35] md:text-5xl">الثقة جزء من الملخص</h2>
              <p className="arabic-copy mt-4 max-w-xl text-lg font-semibold text-[var(--color-ink-muted)]">
                كل معلومة مهمة معها مصدرها وسبب ظهورها لك. نوضح الخبر، ثم نشرح أثره بلغة بسيطة
              </p>
            </Reveal>
          </div>
        </section>

        <section className="page-shell pb-20">
          <Reveal>
            <Card className="relative overflow-hidden bg-[var(--color-zubda-500)] p-8 text-right text-white md:p-10">
              <div className="absolute -left-10 -top-10 size-44 rounded-full bg-white/12 blur-2xl" />
              <Sparkles aria-hidden size={30} />
              <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[1.35] md:text-5xl">
                افتح صباحك بزبدة تفهمك
              </h2>
              <p className="arabic-copy mt-4 max-w-2xl text-base font-semibold text-white/82">
                جرّب الملخص، عدّل اهتماماتك، وخلي زبدة تختصر لك اليوم قبل ما يبدأ
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink
                  className="bg-white hover:bg-white/92"
                  href="/login"
                  style={{ color: "var(--color-zubda-600)" }}
                  variant="secondary"
                >
                  ابدأ الآن
                </ButtonLink>
                <ButtonLink
                  className="border-white/35 bg-white/10 hover:bg-white/16"
                  href="/brief/sample"
                  style={{ color: "white" }}
                  variant="secondary"
                >
                  شوف مثال كامل
                </ButtonLink>
              </div>
            </Card>
          </Reveal>
        </section>
      </main>
    </>
  );
}
