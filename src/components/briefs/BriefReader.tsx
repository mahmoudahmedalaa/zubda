"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Info, ThumbsDown, ThumbsUp } from "lucide-react";
import { type ReactElement, useState } from "react";
import type {
  BriefDocument,
  BriefMetric,
  BriefPortfolioExposure,
  BriefRiskFactor,
  WatchboardItem
} from "@/lib/briefs/types";
import { authedFetch } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type BriefReaderProps = {
  brief: BriefDocument;
  enableFeedback?: boolean;
};

const reliabilityLabels = {
  high: "قوي",
  medium: "متوسط",
  low: "يحتاج متابعة"
} as const;

const metricToneClasses: Record<BriefMetric["tone"], string> = {
  good: "bg-[var(--color-trust-50)] text-[var(--color-trust-700)]",
  watch: "bg-[var(--color-saffron-50)] text-[var(--color-ink)]",
  risk: "bg-red-50 text-[var(--color-risk)]"
};

const metricHelp: Record<string, string> = {
  "مزاج السوق": "قراءة سريعة لميل الأخبار اليوم: مطمئن، حذر، أو ضاغط",
  "برنت": "سعر النفط يعطي إشارة مهمة للخليج والطاقة والتضخم",
  "أسلوبك المفضل": "طريقة الشرح اللي اخترتها في ملفك الشخصي",
  "إشارات من اختياراتك": "عدد المواضيع اللي ظهرت لأنها قريبة من اهتماماتك أو قائمة المتابعة"
};

function snapshotBullets(body: string): string[] {
  return body
    .split(/(?<=[.!؟۔])\s+|(?<=،)\s+/u)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function InfoTooltip({ text }: { text: string }): ReactElement {
  return (
    <span className="group relative inline-flex">
      <button
        aria-label={text}
        className="grid size-6 cursor-help place-items-center rounded-full bg-white/72 text-[var(--color-ink-muted)] outline-none transition hover:bg-white hover:text-[var(--color-zubda-600)] focus-visible:ring-2 focus-visible:ring-[var(--color-zubda-300)]"
        type="button"
      >
        <Info aria-hidden size={14} />
      </button>
      <span className="pointer-events-none absolute left-0 top-8 z-20 hidden w-64 rounded-[18px] border border-[var(--color-line)] bg-[var(--color-ink-panel)] p-3 text-right text-xs font-bold leading-6 text-white shadow-[var(--shadow-card)] group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
}

function FeedbackButtons({
  briefId,
  sourceStoryId
}: {
  briefId: string;
  sourceStoryId?: string;
}): ReactElement {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(feedbackType: "useful" | "not_useful" | "more_like_this"): Promise<void> {
    setIsSubmitting(true);

    try {
      const response = await authedFetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          briefId,
          sourceStoryId,
          feedbackType
        })
      });

      if (!response.ok) {
        throw new Error("Feedback failed");
      }

      setSelected(feedbackType);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button
        className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
          selected === "useful"
            ? "border-[var(--color-trust-500)] bg-[var(--color-trust-50)] text-[var(--color-trust-700)]"
            : "border-[var(--color-line)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-trust-300)]"
        }`}
        disabled={isSubmitting}
        onClick={() => void submit("useful")}
        type="button"
      >
        <ThumbsUp aria-hidden size={15} />
        مفيد
      </button>
      <button
        className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
          selected === "not_useful"
            ? "border-[var(--color-risk)] bg-red-50 text-[var(--color-risk)]"
            : "border-[var(--color-line)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-risk)]"
        }`}
        disabled={isSubmitting}
        onClick={() => void submit("not_useful")}
        type="button"
      >
        <ThumbsDown aria-hidden size={15} />
        ما يهمني
      </button>
      <button
        className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
          selected === "more_like_this"
            ? "border-[var(--color-zubda-500)] bg-[var(--color-zubda-50)] text-[var(--color-zubda-700)]"
            : "border-[var(--color-line)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-zubda-300)]"
        }`}
        disabled={isSubmitting}
        onClick={() => void submit("more_like_this")}
        type="button"
      >
        أبغى أكثر
      </button>
    </div>
  );
}

function MetricStrip({ metrics }: { metrics?: BriefMetric[] }): ReactElement | null {
  if (!metrics?.length) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <motion.div
          className={`rounded-[24px] p-4 ${metricToneClasses[metric.tone]}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.07, duration: 0.4 }}
          key={metric.label}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-black opacity-75">{metric.label}</p>
            {metricHelp[metric.label] ? <InfoTooltip text={metricHelp[metric.label]} /> : null}
          </div>
          <p className="mt-2 text-2xl font-black">{metric.value}</p>
          <p className="mt-1 text-sm font-bold opacity-78">{metric.change}</p>
        </motion.div>
      ))}
    </div>
  );
}

function sentimentTone(score: number): { stroke: string; labelTone: string } {
  if (score >= 72) {
    return { stroke: "var(--color-trust-500)", labelTone: "bg-[var(--color-trust-50)] text-[var(--color-trust-700)]" };
  }

  if (score >= 55) {
    return { stroke: "var(--color-trust-500)", labelTone: "bg-[var(--color-trust-50)] text-[var(--color-trust-700)]" };
  }

  if (score >= 40) {
    return { stroke: "var(--color-saffron-500)", labelTone: "bg-[var(--color-saffron-50)] text-[var(--color-ink)]" };
  }

  return { stroke: "var(--color-risk)", labelTone: "bg-red-50 text-[var(--color-risk)]" };
}

function SentimentGauge({
  sentiment
}: {
  sentiment?: { label: string; score: number; explanation: string; conviction: number };
}): ReactElement | null {
  if (!sentiment) {
    return null;
  }
  const tone = sentimentTone(sentiment.score);

  return (
    <Card className="overflow-hidden p-5 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-center">
        <div className="relative mx-auto w-full max-w-[320px]">
          <svg className="h-auto w-full" viewBox="0 0 320 190" role="img" aria-label={`مزاج السوق ${sentiment.score} من 100`}>
            <path
              d="M50 150 A110 110 0 0 1 270 150"
              fill="none"
              stroke="var(--color-line)"
              strokeLinecap="round"
              strokeWidth="24"
            />
            <motion.path
              d="M50 150 A110 110 0 0 1 270 150"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: sentiment.score / 100 }}
              stroke={tone.stroke}
              strokeLinecap="round"
              strokeWidth="24"
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-x-0 bottom-2 text-center">
            <p className="tabular text-4xl font-black">{sentiment.score}/100</p>
            <p className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${tone.labelTone}`}>
              مزاج السوق
              <InfoTooltip text="مؤشر مبسط يقرأ مزاج الأخبار المختارة. الرقم يساعدك تفهم الجو العام بسرعة، وليس توصية استثمارية." />
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-black text-[var(--color-zubda-600)]">قراءة السوق</p>
          <h2 className="mt-2 text-3xl font-black leading-[1.35]">{sentiment.label}</h2>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">{sentiment.explanation}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] bg-[var(--color-zubda-50)] p-4">
              <p className="flex items-center gap-2 text-sm font-black text-[var(--color-zubda-700)]">
                وضوح الصورة
                <InfoTooltip text="كلما ارتفع الرقم، كانت المصادر متقاربة أكثر في الاتجاه العام." />
              </p>
              <p className="mt-1 text-2xl font-black">{sentiment.conviction}/10</p>
            </div>
            <div className="rounded-[22px] bg-[var(--color-saffron-50)] p-4">
              <p className="text-sm font-black">المحرك الرئيسي</p>
              <p className="mt-1 text-sm font-bold text-[var(--color-ink-muted)]">التقنية + الفائدة</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function RiskPressureBars({ risks }: { risks?: BriefRiskFactor[] }): ReactElement | null {
  if (!risks?.length) {
    return null;
  }

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-3xl font-black">مؤشرات الضغط</h2>
      <p className="arabic-copy mt-2 text-sm font-semibold text-[var(--color-ink-muted)]">
        وين ممكن تضغط الأخبار على السوق أو اهتماماتك المختارة
      </p>
      <div className="mt-6 grid gap-4">
        {risks.map((risk, index) => (
          <div className="grid gap-2" key={risk.label}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-black">{risk.label}</span>
              <span className="rounded-full bg-[var(--color-saffron-50)] px-3 py-1 text-xs font-black text-[var(--color-ink)]">
                {risk.score}/10
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--color-paper)]">
              <motion.span
                className="block h-full rounded-full bg-gradient-to-l from-[var(--color-risk)] via-[var(--color-saffron-500)] to-[var(--color-trust-500)]"
                initial={{ width: 0 }}
                animate={{ width: `${risk.score * 10}%` }}
                transition={{ delay: index * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="text-sm font-semibold text-[var(--color-ink-muted)]">{risk.note}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PortfolioExposure({ exposure }: { exposure?: BriefPortfolioExposure[] }): ReactElement | null {
  if (!exposure?.length) {
    return null;
  }

  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-3xl font-black">أثرها على اهتماماتك</h2>
      <p className="arabic-copy mt-2 text-sm font-semibold text-[var(--color-ink-muted)]">
        توزيع تقريبي لما يستحق انتباهك بناءً على اهتماماتك وقائمة المتابعة
      </p>
      <div className="mt-6 grid gap-4">
        {exposure.map((item, index) => (
          <div className="grid gap-3 rounded-[24px] bg-white p-4 md:grid-cols-[120px_1fr_170px] md:items-center" key={item.symbol}>
            <div>
              <p className="text-xl font-black">{item.symbol}</p>
              <p className="text-xs font-bold text-[var(--color-ink-muted)]">{item.label}</p>
            </div>
            <div>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--color-paper)]">
                <motion.span
                  className="block h-full rounded-full bg-[var(--color-zubda-500)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.weight}%` }}
                  transition={{ delay: index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-[var(--color-ink-muted)]">{item.note}</p>
            </div>
            <div className="rounded-full bg-[var(--color-trust-50)] px-4 py-2 text-center text-xs font-black text-[var(--color-trust-700)]">
              {item.bias}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function WatchboardCard({
  item,
  briefId,
  enableFeedback
}: {
  item: WatchboardItem;
  briefId: string;
  enableFeedback: boolean;
}): ReactElement {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black text-[var(--color-zubda-600)]">راقب</p>
          <h3 className="mt-2 text-2xl font-black leading-[1.45]">{item.title}</h3>
        </div>
        <span className="rounded-full bg-[var(--color-zubda-50)] px-3 py-1 text-xs font-black text-[var(--color-zubda-700)]">
          {item.time}
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] bg-[var(--color-zubda-50)] p-4">
          <p className="text-sm font-black text-[var(--color-zubda-700)]">ليش يهمك؟</p>
          <p className="arabic-copy mt-2 text-[var(--color-ink-muted)]">{item.why}</p>
        </div>
        <div className="rounded-[24px] bg-[var(--color-saffron-50)] p-4">
          <p className="text-sm font-black text-[var(--color-ink)]">بالعربي البسيط</p>
          <p className="arabic-copy mt-2 text-[var(--color-ink-muted)]">{item.plainArabic}</p>
        </div>
      </div>
      <p className="mt-4 inline-flex rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-[var(--color-ink-muted)]">
        المؤشر المرتبط: {item.impact}
      </p>
      {enableFeedback ? <FeedbackButtons briefId={briefId} sourceStoryId={item.sourceStoryId} /> : null}
    </Card>
  );
}

export function BriefReader({ brief, enableFeedback = true }: BriefReaderProps): ReactElement {
  const { structuredBrief } = brief;
  const bullets = snapshotBullets(structuredBrief.executiveSnapshot.body);
  const hasExposure = Boolean(structuredBrief.portfolioExposure?.length);
  const hasTalkingPoints = structuredBrief.talkingPoints.length > 0;

  return (
    <div className="grid gap-7">
      <Card className="overflow-hidden border-[var(--color-zubda-200)]">
        <div className="bg-[var(--color-zubda-500)] p-7 text-white md:p-10">
          <p className="text-base font-black text-white/82">الخلاصة السريعة</p>
          <h1 className="mt-3 text-4xl font-black leading-[1.3] md:text-5xl">
            {structuredBrief.headline}
          </h1>
          <ul className="mt-6 grid w-full gap-3 text-right">
            {bullets.map((bullet) => (
              <li
                className="arabic-copy rounded-[22px] bg-white/10 px-4 py-3 text-lg font-bold leading-9 text-white/92 md:text-xl md:leading-10"
                key={bullet}
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
          <div className="rounded-[24px] bg-[var(--color-zubda-50)] p-4">
            <p className="text-sm font-black text-[var(--color-zubda-700)]">تاريخ الملخص</p>
            <p className="mt-2 text-lg font-black">{brief.dateKey}</p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-sm font-black text-[var(--color-ink-muted)]">العمق</p>
            <p className="mt-2 text-lg font-black">{brief.depth === "deep" ? "عميق" : "متوازن"}</p>
          </div>
          <div className="rounded-[24px] bg-[var(--color-trust-50)] p-4">
            <p className="text-sm font-black text-[var(--color-trust-700)]">المصادر</p>
            <p className="mt-2 text-lg font-black">{structuredBrief.sources.length} مصادر</p>
          </div>
        </div>
      </Card>

      <MetricStrip metrics={structuredBrief.metrics} />
      <SentimentGauge sentiment={structuredBrief.sentiment} />
      {structuredBrief.riskFactors?.length ? <RiskPressureBars risks={structuredBrief.riskFactors} /> : null}
      {hasExposure ? <PortfolioExposure exposure={structuredBrief.portfolioExposure} /> : null}

      <section className="grid gap-4">
        {structuredBrief.watchboard.map((item) => (
          <WatchboardCard
            briefId={brief.id}
            enableFeedback={enableFeedback}
            item={item}
            key={`${brief.id}-${item.sourceStoryId}`}
          />
        ))}
      </section>

      <Card className="p-5 md:p-6">
        <p className="text-sm font-black text-[var(--color-zubda-600)]">مخصص لك</p>
        <h2 className="mt-2 text-3xl font-black leading-[1.45]">{structuredBrief.personalImpact.title}</h2>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
          {structuredBrief.personalImpact.body}
        </p>
        {structuredBrief.personalizationNotes?.length ? (
          <div className="mt-5 grid gap-2 md:grid-cols-3">
            {structuredBrief.personalizationNotes.map((note) => (
              <span
                className="rounded-[20px] bg-[var(--color-paper)] px-4 py-3 text-sm font-bold text-[var(--color-ink-muted)]"
                key={note}
              >
                {note}
              </span>
            ))}
          </div>
        ) : null}
        {structuredBrief.chart ? (
          <details className="mt-5 rounded-[22px] bg-[var(--color-zubda-50)] p-4">
            <summary className="cursor-pointer text-sm font-black text-[var(--color-zubda-700)]">
              ليش ظهرت لك هالمواضيع؟
            </summary>
            <div className="mt-3 grid gap-2">
              {structuredBrief.chart.points.map((point) => (
                <p className="text-sm font-bold text-[var(--color-ink-muted)]" key={point.label}>
                  {point.label}: {point.value}/100
                </p>
              ))}
            </div>
          </details>
        ) : null}
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        {hasTalkingPoints ? (
          <Card className="p-5 md:p-6">
            <p className="text-sm font-black text-[var(--color-trust-700)]">لو بتتكلم عنه</p>
            <h2 className="mt-2 text-3xl font-black">قولها كذا</h2>
            <p className="arabic-copy mt-2 text-sm font-semibold text-[var(--color-ink-muted)]">
              نقاط مختصرة للاجتماعات أو السوالف المهنية، من غير مبالغة أو ادعاء يقين
            </p>
            <div className="mt-5 grid gap-3">
              {structuredBrief.talkingPoints.map((point) => (
                <div
                  className="flex gap-3 rounded-[22px] border border-[var(--color-line)] bg-white p-4"
                  key={point}
                >
                  <CheckCircle2 aria-hidden className="mt-1 shrink-0 text-[var(--color-trust-500)]" size={18} />
                  <div>
                    <p className="arabic-copy font-bold text-[var(--color-ink-muted)]">{point}</p>
                    <p className="mt-2 text-xs font-black text-[var(--color-risk)]">لا تحولها لتوصية أو توقع مؤكد</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        <Card className="p-5 md:p-6">
          <h2 className="text-3xl font-black">بالعربي البسيط</h2>
          <div className="mt-5 grid gap-3">
            {structuredBrief.glossary.map((item) => (
              <div className="rounded-[22px] bg-slate-50 p-4" key={item.term}>
                <p className="font-black">{item.term}</p>
                <p className="arabic-copy mt-2 text-sm text-[var(--color-ink-muted)]">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 md:p-6">
        <h2 className="text-3xl font-black">المصادر</h2>
        <div className="mt-5 grid gap-3">
          {structuredBrief.sources.map((source) => (
            <a
              className="group rounded-[24px] border border-[var(--color-line)] bg-white p-4 transition hover:border-[var(--color-zubda-300)] hover:bg-[var(--color-zubda-50)]"
              href={source.url}
              key={source.id}
              rel="noreferrer"
              target="_blank"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black leading-[1.45]">{source.title}</p>
                  <p className="mt-1 text-sm font-bold text-[var(--color-ink-muted)]">
                    {source.publisher} · موثوقية {reliabilityLabels[source.reliabilityLabel]}
                  </p>
                </div>
                <ExternalLink
                  aria-hidden
                  className="mt-1 shrink-0 text-[var(--color-zubda-500)] transition group-hover:-translate-x-1"
                  size={18}
                />
              </div>
              <p className="arabic-copy mt-3 text-sm text-[var(--color-ink-muted)]">
                {source.whyIncluded}
              </p>
            </a>
          ))}
        </div>
      </Card>

      <Card className="bg-[var(--color-trust-50)] p-6 text-center">
        <h2 className="text-3xl font-black">خلصت الزبدة</h2>
        <p className="arabic-copy mx-auto mt-3 max-w-xl text-[var(--color-ink-muted)]">
          عندك أهم ما يستحق المتابعة، ومعه المصادر وسبب الأهمية. الباقي غالباً زحمة.
        </p>
        <Button className="mt-5" variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ارجع للأعلى
        </Button>
      </Card>
    </div>
  );
}
