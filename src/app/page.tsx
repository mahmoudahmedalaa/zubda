import { ArrowLeft, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import type { ReactElement } from "react";
import { BrandFooter } from "@/components/BrandFooter";
import { BrandHeader } from "@/components/BrandHeader";
import { BriefPreview } from "@/components/BriefPreview";
import { Reveal } from "@/components/motion/Reveal";
import { SignalFlow } from "@/components/motion/SignalFlow";
import { TrustTabs } from "@/components/landing/TrustTabs";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const trustPoints = ["مصادر واضحة", "مصمم لك", "بدون لفّة"];

const promiseCards = [
  ["يلخص", "أهم ما تغيّر بدون رمي عشرات العناوين عليك"],
  ["يوضح", "يعطيك السبب، من يتأثر، وش تتابع بعدها"],
  ["يرتب", "المعلومة حسب بلدك، عملك، اهتماماتك، وقائمة متابعتك"]
];

const steps = [
  ["قل لنا عالمك", "اختَر دورك، بلدك، المواضيع اللي تهمك، وطريقة الكلام اللي تناسبك"],
  ["أضف قائمة المتابعة", "شركات، أسواق، أصول، قطاعات، أو موضوعات تبغى ننتبه لها"],
  ["نرتبها لك", "في وقتك المختار نبدأ بالأقرب لشغلك وقراراتك، مو الأعلى صوتاً"]
];

const personalizationExamples = [
  ["لو أنت مستثمر", "نقرب لك الفائدة، النفط، السوق، وأثرها على محفظتك"],
  ["لو أنت مؤسس", "نركز على التمويل، المنافسين، التقنية، وتغييرات السوق"],
  ["لو أنت مستشار", "نطلع لك نقاط واضحة تستخدمها في اجتماعك بثقة"]
];

const testimonials = [
  ["بدل ما أفتح خمس تطبيقات، أعرف الصورة العامة من مكان واحد", "مستشار، دبي"],
  ["أهم شيء أنه يشرح لي الأثر، مو بس يلخص الخبر", "مؤسس، الرياض"],
  ["اللغة قريبة وواضحة، وفيها مصادر أقدر أرجع لها", "محلل استثمار، أبوظبي"]
];

const faqs = [
  ["هو تطبيق أخبار؟", "لا. الأخبار مادة خام. زبدة ترتبها لك وتشرح اللي يخصك منها"],
  ["أقدر أختار اللي يهمني؟", "ايه. تختار اهتماماتك، منطقتك، أسلوب الكلام، وقائمة المتابعة"],
  ["أشوف المصادر؟", "ايه. كل نقطة مهمة معها المصدر وسبب دخولها الملخص"]
];

export default function LandingPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="overflow-hidden">
        <section className="page-shell grid items-center gap-12 pb-16 pt-8 lg:grid-cols-[0.92fr_1.08fr] lg:pb-24 lg:pt-12">
          <Reveal className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-right">
            <h1 className="display-arabic text-[2.65rem] font-black leading-[1.22] tracking-[-0.04em] text-[var(--color-ink)] sm:text-6xl">
              في وقتك،
              <br />
              اعرف المهم قبل الزحمة
            </h1>
            <p className="arabic-copy mx-auto mt-6 max-w-lg text-lg font-medium text-[var(--color-ink-muted)] sm:text-xl lg:mx-0">
              زبدتك حسب شغلك واهتماماتك وقائمة متابعتك. توصلك في الوقت اللي تختاره، مختصرة وواضحة ومو نفس الكلام للجميع
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <ButtonLink href="/login">
                ابدأ الآن
                <ArrowLeft aria-hidden size={18} />
              </ButtonLink>
              <ButtonLink href="/brief/sample" variant="secondary">
                شاهد مثال
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              {trustPoints.map((point) => (
                <span
                  className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-bold text-[var(--color-ink-muted)] shadow-sm"
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

        <section className="bg-white/78 py-20">
          <div className="page-shell">
            <Reveal className="mx-auto max-w-3xl text-center">
              <h2 className="display-arabic text-4xl font-black leading-[1.25] md:text-5xl">
                الأخبار كثيرة، بس المهم قليل
              </h2>
              <p className="arabic-copy mt-4 text-lg font-semibold text-[var(--color-ink-muted)]">
                <span className="font-black text-[var(--color-zubda-500)]">زبدة</span>{" "}
                تقلل الزحمة وتطلع لك الشيء اللي يستاهل وقتك
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {promiseCards.map(([title, text], index) => (
                <Reveal delay={index * 0.08} key={title}>
                  <Card className="h-full p-7 text-right shadow-none">
                    <h3 className="display-arabic text-3xl font-black">{title}</h3>
                    <p className="arabic-copy mt-4 text-sm font-semibold text-[var(--color-ink-muted)]">{text}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-20" id="how">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <Reveal className="text-right">
              <h2 className="display-arabic text-4xl font-black leading-[1.25] md:text-5xl">من الوشوشة إلى الزبدة</h2>
              <p className="arabic-copy mt-4 max-w-xl text-lg font-semibold text-[var(--color-ink-muted)]">
                مو بس تختار موضوعات. زبدة تبني ملخصها حولك أنت
              </p>
            </Reveal>
            <div className="grid gap-4">
              {steps.map(([title, text], index) => (
                <Reveal delay={index * 0.08} key={title}>
                  <div className="group grid gap-4 rounded-[34px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:border-[var(--color-zubda-300)] md:grid-cols-[72px_1fr]">
                    <span className="grid size-16 place-items-center rounded-[24px] bg-[var(--color-zubda-50)] text-2xl font-black text-[var(--color-zubda-600)] transition group-hover:bg-[var(--color-zubda-500)] group-hover:text-white">
                      {index + 1}
                    </span>
                    <div className="text-right">
                      <h3 className="display-arabic text-2xl font-black">{title}</h3>
                      <p className="arabic-copy mt-2 text-sm font-semibold text-[var(--color-ink-muted)]">{text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white/74 py-20">
          <div className="page-shell">
            <Reveal className="mx-auto max-w-3xl text-center">
              <h2 className="display-arabic text-4xl font-black leading-[1.25] md:text-5xl">
                نفس الخبر، زبدة مختلفة لكل شخص
              </h2>
              <p className="arabic-copy mt-4 text-lg font-semibold text-[var(--color-ink-muted)]">
                كل واحد له زاويته. المستثمر يهمه الأثر على محفظته، والمؤسس يهمه السوق والمنافسين، والمستشار يهمه نقاط واضحة يقدر يستخدمها
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {personalizationExamples.map(([title, text], index) => (
                <Reveal delay={index * 0.08} key={title}>
                  <Card className="h-full overflow-hidden p-0 text-right shadow-none">
                    <div
                      className={`h-3 w-full ${
                        index === 0
                          ? "bg-[var(--color-fig-500)]"
                          : index === 1
                            ? "bg-[var(--color-zubda-500)]"
                            : "bg-[var(--color-trust-500)]"
                      }`}
                    />
                    <div className="p-6">
                      <h3 className="display-arabic text-2xl font-black">{title}</h3>
                      <p className="arabic-copy mt-3 text-sm font-semibold text-[var(--color-ink-muted)]">{text}</p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-zubda-50)] py-20">
          <div className="page-shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal className="text-right">
              <h2 className="display-arabic text-4xl font-black leading-[1.25] md:text-5xl">
                من زحمة الأخبار إلى قرار أوضح
              </h2>
              <p className="arabic-copy mt-4 max-w-xl text-lg font-semibold text-[var(--color-ink-muted)]">
                زبدة ما تجمع روابط وخلاص. ترتب لك الإشارات حسب حياتك: شغلك، السوق اللي تتابعه، والأرقام اللي تهمك
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <SignalFlow />
            </Reveal>
          </div>
        </section>

        <Reveal>
          <TrustTabs />
        </Reveal>

        <section className="bg-white/72 py-20">
          <div className="page-shell">
            <Reveal className="mx-auto max-w-3xl text-center">
              <h2 className="display-arabic text-4xl font-black leading-[1.25] md:text-5xl">مصمم كعادة على وقتك</h2>
              <p className="arabic-copy mt-4 text-lg font-semibold text-[var(--color-ink-muted)]">
                تقرأه وقت ما يناسبك، تفهم المهم، وتكمل يومك بدون زحمة
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {testimonials.map(([quote, role], index) => (
                <Reveal delay={index * 0.08} key={role}>
                  <Card className="h-full p-6 text-right shadow-none">
                    <MessageCircle aria-hidden className="text-[var(--color-zubda-500)]" size={24} />
                    <p className="arabic-copy mt-4 text-base font-bold text-[var(--color-ink)]">{quote}</p>
                    <p className="mt-5 text-sm font-bold text-[var(--color-ink-muted)]">{role}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-20">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <Reveal className="text-right">
              <h2 className="display-arabic text-4xl font-black leading-[1.25]">أسئلة سريعة</h2>
              <p className="arabic-copy mt-4 text-lg font-semibold text-[var(--color-ink-muted)]">
                إجابات مختصرة، بدون إطالة
              </p>
            </Reveal>
            <div className="grid gap-3">
              {faqs.map(([question, answer], index) => (
                <Reveal delay={index * 0.06} key={question}>
                  <Card className="p-5 text-right shadow-none">
                    <h3 className="text-xl font-black">{question}</h3>
                    <p className="arabic-copy mt-2 text-sm font-semibold text-[var(--color-ink-muted)]">{answer}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell pb-20">
          <Reveal>
            <Card className="relative overflow-hidden bg-[var(--color-zubda-500)] p-8 text-right text-white md:p-10">
              <div className="soft-orbit absolute -left-10 -top-10 size-48 rounded-full bg-[var(--color-saffron-300)]/24 blur-2xl" />
              <Sparkles aria-hidden size={30} />
              <h2 className="display-arabic mt-5 max-w-3xl text-4xl font-black leading-[1.25] md:text-5xl">
                شوف كيف تطلع زبدتك
              </h2>
              <p className="arabic-copy mt-4 max-w-2xl text-lg font-semibold text-white/84">
                افتح مثال سريع، أو ابنِ ملخصك حسب دورك واهتماماتك وطريقة قراءتك
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
                  شوف مثال سريع
                </ButtonLink>
              </div>
            </Card>
          </Reveal>
        </section>
      </main>
      <BrandFooter />
    </>
  );
}
