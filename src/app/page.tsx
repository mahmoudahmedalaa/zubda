import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MessageCircle,
  RadioTower,
  SearchCheck,
  ShieldCheck,
  Target
} from "lucide-react";
import type { ReactElement } from "react";
import { BrandFooter } from "@/components/BrandFooter";
import { BrandHeader } from "@/components/BrandHeader";
import { BriefPreview } from "@/components/BriefPreview";
import { Reveal } from "@/components/motion/Reveal";
import { TrustTabs } from "@/components/landing/TrustTabs";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const trustPoints = ["مصادر واضحة", "مصمم لك", "بدون لفّة"];

const promiseCards = [
  ["يلخص", "أهم ما تغيّر بدون رمي عشرات العناوين عليك"],
  ["يوضح", "يعطيك السبب، من يتأثر، وش تتابع بعدها"],
  ["يرتب", "المعلومة حسب دورك، مناطق اهتمامك، والجهات اللي تتابعها"]
];

const noisySources = ["واتساب", "لينكدإن", "X", "نشرات", "أخبار", "تقارير"];

const zubdaOutcome = [
  ["خلاصة قصيرة", "ثلاث نقاط تعرف منها وش صار وليش يهمك"],
  ["إشارات مهمة", "أرقام وأحداث تستاهل عينك اليوم"],
  ["مصادر واضحة", "كل نقطة معها رابط وسبب دخولها"]
];

const briefModules = [
  {
    title: "الخلاصة السريعة",
    text: "أهم ثلاث نقاط بدون لف ودوران",
    icon: FileCheck2
  },
  {
    title: "راقب",
    text: "حدث أو رقم ممكن يغيّر الصورة",
    icon: Target
  },
  {
    title: "وش أثرها عليك؟",
    text: "نربط الخبر بدورك واهتماماتك",
    icon: BarChart3
  },
  {
    title: "قولها كذا",
    text: "نقطة واضحة تنقال في اجتماع أو سالفة",
    icon: MessageCircle
  },
  {
    title: "من وين جبناها؟",
    text: "مصادر وروابط وثقة بدون إزعاج",
    icon: SearchCheck
  }
];

const steps = [
  ["قل لنا عالمك", "اختَر دورك، بلدك، المواضيع اللي تهمك، وطريقة الكلام اللي تناسبك"],
  ["أضف قائمة المتابعة", "شركات، أسواق، أصول، قطاعات، أو موضوعات تبغى ننتبه لها"],
  ["توصلك في وقتك", "أنت تختار الموعد. صباح، ظهر، أو قبل النوم، المهم تقراها وقت ما يناسبك"]
];

const personalizationExamples = [
  ["لو أنت مستثمر", "نقرب لك الفائدة، النفط، السوق، وأثرها على قراراتك"],
  ["لو أنت مؤسس", "نركز على التمويل، المنافسين، التقنية، وتغييرات السوق"],
  ["لو أنت مستشار", "نطلع لك نقاط واضحة تستخدمها في اجتماعك بثقة"]
];

const testimonials = [
  ["بدل ما أفتح خمس تطبيقات، أعرف وش مهم وليش يهمني", "مستشار، دبي"],
  ["حلو أنه ما يكتفي بالخبر. يعطيني الأثر والنقطة اللي أقدر أتكلم عنها", "مؤسس، الرياض"],
  ["أحتاج مصادر واضحة، بس بدون ما أحس أني أقرأ تقرير طويل. هذا بالضبط اللي أبيه", "محلل استثمار، أبوظبي"]
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
              وفّر وقتك
              <br />
              اعرف المهم قبل الزحمة
            </h1>
            <p className="arabic-copy mx-auto mt-6 max-w-lg text-lg font-medium text-[var(--color-ink-muted)] sm:text-xl lg:mx-0">
              زبدة ترتب الأخبار والأسواق والمواضيع اللي تهمك، وتوصل لك في الموعد اللي تختاره، بدون حشو ولا كلام عام
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

        <section className="page-shell py-24">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <Reveal className="flex flex-col justify-center text-right">
              <p className="text-base font-black text-[var(--color-trust-700)]">بدل التنقل بين سبع أماكن</p>
              <h2 className="display-arabic mt-3 text-4xl font-black leading-[1.25] md:text-5xl">
                زحمة تدخل، زبدة تطلع
              </h2>
              <p className="arabic-copy mt-5 max-w-xl text-lg font-semibold text-[var(--color-ink-muted)]">
                الفكرة مو إننا نجيب لك أخبار أكثر. الفكرة إنك تخلص أسرع، وتعرف الشيء اللي يستاهل وقتك
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-[38px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-card)]">
                <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr]">
                  <div className="rounded-[30px] bg-[var(--color-surface)] p-5 text-right">
                    <p className="text-sm font-black text-[var(--color-ink-muted)]">قبل زبدة</p>
                    <div className="mt-4 grid gap-3">
                      {noisySources.map((source) => (
                        <span
                          className="rounded-[20px] border border-[var(--color-line)] bg-white px-4 py-3 text-lg font-black text-[var(--color-ink-muted)]"
                          key={source}
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[30px] bg-[var(--color-zubda-500)] p-6 text-right text-white">
                    <p className="text-sm font-black text-white/72">مع زبدة</p>
                    <h3 className="display-arabic mt-3 text-4xl font-black leading-[1.18]">ملخص واحد يفهمك</h3>
                    <div className="mt-6 grid gap-3">
                      {zubdaOutcome.map(([title, text], index) => (
                        <div
                          className="rounded-[22px] bg-white/12 p-4 backdrop-blur-sm"
                          key={title}
                        >
                          <p className="text-xl font-black">{title}</p>
                          <p className="arabic-copy mt-1 text-sm font-bold text-white/78">{text}</p>
                          <div
                            className="mt-3 h-1.5 rounded-full bg-white/70"
                            style={{ width: `${68 + index * 12}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
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

        <section className="bg-white/74 py-24">
          <div className="page-shell">
            <Reveal className="mx-auto max-w-3xl text-center">
              <p className="text-base font-black text-[var(--color-trust-700)]">وش داخل زبدتك؟</p>
              <h2 className="display-arabic mt-3 text-4xl font-black leading-[1.25] md:text-5xl">
                كل جزء له وظيفة واضحة
              </h2>
              <p className="arabic-copy mt-4 text-lg font-semibold text-[var(--color-ink-muted)]">
                ما نحط قسم لأنه شكله حلو. كل جزء يساعدك تفهم، تقرر، أو تعرف وش تتابع بعدها
              </p>
            </Reveal>
            <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <Reveal className="rounded-[38px] border border-[var(--color-line)] bg-[var(--color-paper)] p-5 shadow-[var(--shadow-card)]">
                <div className="rounded-[30px] bg-white p-5 text-right">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-[var(--color-zubda-600)]">مثال ملخص</p>
                      <h3 className="display-arabic mt-2 text-3xl font-black">زبدة جاهزة لك</h3>
                    </div>
                    <span className="grid size-14 place-items-center rounded-[20px] bg-[var(--color-trust-50)] text-[var(--color-trust-700)]">
                      <ShieldCheck aria-hidden size={25} />
                    </span>
                  </div>
                  <div className="mt-6 grid gap-3">
                    <div className="rounded-[24px] bg-[var(--color-zubda-50)] p-4">
                      <p className="text-xl font-black">الخلاصة</p>
                      <p className="arabic-copy mt-1 text-sm font-bold text-[var(--color-ink-muted)]">
                        الفائدة والنفط يضغطون على أسهم النمو، لكن إشارات التقنية ما زالت قوية
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[24px] bg-[var(--color-saffron-50)] p-4">
                        <p className="text-lg font-black">راقب</p>
                        <p className="arabic-copy mt-1 text-sm font-bold text-[var(--color-ink-muted)]">تصريحات الفيدرالي</p>
                      </div>
                      <div className="rounded-[24px] bg-[var(--color-trust-50)] p-4">
                        <p className="text-lg font-black">الأثر عليك</p>
                        <p className="arabic-copy mt-1 text-sm font-bold text-[var(--color-ink-muted)]">قرارك الاستثماري يحتاج هدوء</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-[24px] border border-[var(--color-line)] p-4">
                      <span className="text-sm font-black text-[var(--color-ink-muted)]">مدة القراءة</span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-black">
                        <Clock3 aria-hidden size={16} />
                        ٥ دقائق
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
              <div className="grid gap-3">
                {briefModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <Reveal delay={index * 0.06} key={module.title}>
                      <div className="group flex items-center gap-4 rounded-[28px] border border-[var(--color-line)] bg-white p-5 text-right shadow-sm transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                        <span className="grid size-14 shrink-0 place-items-center rounded-[20px] bg-[var(--color-zubda-50)] text-[var(--color-zubda-500)] transition group-hover:bg-[var(--color-zubda-500)] group-hover:text-white">
                          <Icon aria-hidden size={24} />
                        </span>
                        <div>
                          <h3 className="text-2xl font-black">{module.title}</h3>
                          <p className="arabic-copy mt-1 text-sm font-bold text-[var(--color-ink-muted)]">{module.text}</p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
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
                كل واحد له زاويته. المستثمر يهمه الأثر على قراراته، المؤسس يهمه السوق والمنافسين، والمستشار يهمه كلام واضح ينفع في الاجتماع
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
          <div className="page-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <Reveal className="text-right">
              <h2 className="display-arabic text-4xl font-black leading-[1.25] md:text-5xl">
                كيف تصير مخصصة لك؟
              </h2>
              <p className="arabic-copy mt-4 max-w-xl text-lg font-semibold text-[var(--color-ink-muted)]">
                نبدأ بالمدخلات الصح، ثم نرتب الخبر حسب قربه منك، مو حسب صوته في السوشال ميديا
              </p>
            </Reveal>
            <Reveal className="grid gap-3" delay={0.1}>
              {[
                ["١", "دورك", "مستثمر، مؤسس، مستشار، أو وصفك الخاص"],
                ["٢", "اهتماماتك", "موضوعان في المجاني، وأكثر في برو بدون ما نخلي الملخص يتضخم عليك"],
                ["٣", "متابعتك", "شركات، أسواق، دول، أشخاص، أو ملفات تبغى ننتبه لها"],
                ["٤", "أسلوبك", "مختصر، عملي، تحليلي، أو أقرب للكلام اليومي"]
              ].map(([number, title, text]) => (
                <div className="grid gap-4 rounded-[28px] bg-white p-5 text-right shadow-[var(--shadow-card)] md:grid-cols-[64px_1fr]" key={title}>
                  <span className="grid size-14 place-items-center rounded-[20px] bg-[var(--color-green-50)] text-xl font-black text-[var(--color-green-500)]">
                    {number}
                  </span>
                  <div>
                    <h3 className="text-2xl font-black">{title}</h3>
                    <p className="arabic-copy mt-1 text-sm font-bold text-[var(--color-ink-muted)]">{text}</p>
                  </div>
                </div>
              ))}
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
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {testimonials.map(([quote, role], index) => (
                <Reveal delay={index * 0.08} key={role}>
                  <Card className="group h-full p-7 text-right shadow-none transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                    <div className="flex items-center justify-between gap-4">
                      <span className="grid size-12 place-items-center rounded-[18px] bg-[var(--color-zubda-50)] text-[var(--color-zubda-500)] transition group-hover:bg-[var(--color-zubda-500)] group-hover:text-white">
                        <MessageCircle aria-hidden size={24} />
                      </span>
                      <span className="text-5xl font-black leading-none text-[var(--color-line)]">“</span>
                    </div>
                    <p className="arabic-copy mt-5 text-lg font-black text-[var(--color-ink)]">{quote}</p>
                    <p className="mt-6 border-t border-[var(--color-line)] pt-4 text-sm font-bold text-[var(--color-ink-muted)]">
                      {role}
                    </p>
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
              <RadioTower aria-hidden size={30} />
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
