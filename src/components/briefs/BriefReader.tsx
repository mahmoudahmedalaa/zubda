"use client";

import { motion } from "framer-motion";
import {
  BookmarkCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Gauge,
  Info,
  MessageSquareText,
  SlidersHorizontal,
  Target,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";
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
  "مزاج السوق": "قراءة سريعة مبنية على الأخبار والأرقام المختارة في هذا الملخص",
  "برنت": "سعر النفط يعطي إشارة مهمة للخليج والطاقة والتضخم",
  "أهم ملف": "الموضوع الأقرب لاهتماماتك اليوم"
};

const hiddenMetricLabels = new Set(["أسلوبك المفضل", "إشارات مهمة", "إشارات من اختياراتك"]);

type ReaderMode = "bottomLine" | "meeting" | "investment" | "watchlist";
type DetailLevel = "quick" | "standard" | "deep";
type SectionKey = "market" | "watchboard" | "impact" | "talking" | "glossary" | "sources";
type SectionVisibility = Record<SectionKey, boolean>;

const readerModes: Array<{
  id: ReaderMode;
  label: string;
  description: string;
  icon: typeof Target;
}> = [
  {
    id: "bottomLine",
    label: "الزبدة",
    description: "أهم شيء أولاً",
    icon: Target
  },
  {
    id: "meeting",
    label: "اجتماع",
    description: "نقاط تنقال",
    icon: MessageSquareText
  },
  {
    id: "investment",
    label: "استثمار",
    description: "سوق ومخاطر",
    icon: Gauge
  },
  {
    id: "watchlist",
    label: "المتابعة",
    description: "وش تراقب",
    icon: BookmarkCheck
  }
];

const detailLevels: Array<{ id: DetailLevel; label: string; description: string }> = [
  { id: "quick", label: "سريع", description: "أخف عرض" },
  { id: "standard", label: "متوازن", description: "الوضع الطبيعي" },
  { id: "deep", label: "تعمّق", description: "افتح التفاصيل" }
];

const sectionControls: Array<{ id: SectionKey; label: string }> = [
  { id: "market", label: "السوق" },
  { id: "watchboard", label: "المتابعة" },
  { id: "impact", label: "الأثر عليك" },
  { id: "talking", label: "نقاط الكلام" },
  { id: "glossary", label: "التبسيط" },
  { id: "sources", label: "المصادر" }
];

function modeHint(mode: ReaderMode): string {
  if (mode === "meeting") return "رتبنا القراءة حول الكلام الجاهز وما تحتاج تقوله بثقة";
  if (mode === "investment") return "رفعنا السوق، المخاطر، وأثر المتابعة قبل التفاصيل العامة";
  if (mode === "watchlist") return "بدأنا بما يستحق المتابعة قبل باقي الزبدة";
  return "أهم شيء أولاً، وبعدها تفتح اللي تحتاجه";
}

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

function BriefControlPanel({
  mode,
  detailLevel,
  visibleSections,
  onModeChange,
  onDetailChange,
  onSectionToggle,
  watchCount,
  sourceCount,
  talkingCount
}: {
  mode: ReaderMode;
  detailLevel: DetailLevel;
  visibleSections: SectionVisibility;
  onModeChange: (mode: ReaderMode) => void;
  onDetailChange: (level: DetailLevel) => void;
  onSectionToggle: (section: SectionKey) => void;
  watchCount: number;
  sourceCount: number;
  talkingCount: number;
}): ReactElement {
  return (
    <Card className="overflow-hidden p-5 md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl text-right">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-zubda-50)] px-3 py-1 text-sm font-black text-[var(--color-zubda-700)]">
            <SlidersHorizontal aria-hidden size={16} />
            لوحة التحكم
          </div>
          <h2 className="mt-3 text-3xl font-black leading-[1.35]">اقرأها بطريقتك</h2>
          <p className="arabic-copy mt-2 text-sm font-bold text-[var(--color-ink-muted)]">
            {modeHint(mode)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-[var(--color-surface)] p-2 text-center">
          <div className="rounded-[18px] bg-white px-3 py-2">
            <p className="tabular text-xl font-black">{watchCount}</p>
            <p className="text-xs font-bold text-[var(--color-ink-muted)]">للمتابعة</p>
          </div>
          <div className="rounded-[18px] bg-white px-3 py-2">
            <p className="tabular text-xl font-black">{talkingCount}</p>
            <p className="text-xs font-bold text-[var(--color-ink-muted)]">نقاط كلام</p>
          </div>
          <div className="rounded-[18px] bg-white px-3 py-2">
            <p className="tabular text-xl font-black">{sourceCount}</p>
            <p className="text-xs font-bold text-[var(--color-ink-muted)]">مصادر</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-3 text-sm font-black text-[var(--color-ink-muted)]">غيّر طريقة القراءة</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2">
            {readerModes.map((item) => {
              const Icon = item.icon;
              const active = mode === item.id;

              return (
                <button
                  className={`flex min-h-20 items-center gap-3 rounded-[22px] border px-4 py-3 text-right transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-zubda-500)] ${
                    active
                      ? "border-[var(--color-zubda-500)] bg-[var(--color-zubda-50)] text-[var(--color-zubda-700)]"
                      : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-zubda-200)]"
                  }`}
                  key={item.id}
                  onClick={() => onModeChange(item.id)}
                  type="button"
                >
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-[16px] ${
                      active ? "bg-[var(--color-zubda-500)] text-white" : "bg-[var(--color-surface)] text-[var(--color-ink-muted)]"
                    }`}
                  >
                    <Icon aria-hidden size={18} />
                  </span>
                  <span>
                    <span className="block font-black">{item.label}</span>
                    <span className="mt-1 block text-xs font-bold opacity-75">{item.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <p className="mb-3 text-sm font-black text-[var(--color-ink-muted)]">عمق العرض</p>
            <div className="grid grid-cols-3 gap-2 rounded-full bg-[var(--color-surface)] p-1">
              {detailLevels.map((item) => {
                const active = detailLevel === item.id;

                return (
                  <button
                    className={`min-h-11 rounded-full px-3 py-2 text-sm font-black transition ${
                      active
                        ? "bg-[var(--color-ink)] text-white shadow-sm"
                        : "text-[var(--color-ink-muted)] hover:bg-white hover:text-[var(--color-ink)]"
                    }`}
                    key={item.id}
                    onClick={() => onDetailChange(item.id)}
                    type="button"
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-black text-[var(--color-ink-muted)]">اظهر أو اخفِ</p>
            <div className="flex flex-wrap gap-2">
              {sectionControls.map((section) => {
                const active = visibleSections[section.id];

                return (
                  <button
                    className={`min-h-10 rounded-full border px-4 py-2 text-sm font-black transition ${
                      active
                        ? "border-[var(--color-trust-500)] bg-[var(--color-trust-50)] text-[var(--color-trust-700)]"
                        : "border-[var(--color-line)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-zubda-200)]"
                    }`}
                    key={section.id}
                    onClick={() => onSectionToggle(section.id)}
                    type="button"
                  >
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function MetricStrip({ metrics }: { metrics?: BriefMetric[] }): ReactElement | null {
  const visibleMetrics = metrics?.filter((metric) => !hiddenMetricLabels.has(metric.label));

  if (!visibleMetrics?.length) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {visibleMetrics.map((metric, index) => (
        <motion.div
          className={`min-h-32 rounded-[24px] p-4 ${metricToneClasses[metric.tone]}`}
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
  const [activePanel, setActivePanel] = useState<"why" | "plain" | "impact">("why");
  const panels = {
    why: {
      label: "ليش يهمك؟",
      title: "سبب المتابعة",
      body: item.why,
      tone: "bg-[var(--color-zubda-50)] text-[var(--color-zubda-700)]"
    },
    plain: {
      label: "بسّطها",
      title: "بالعربي البسيط",
      body: item.plainArabic,
      tone: "bg-[var(--color-trust-50)] text-[var(--color-trust-700)]"
    },
    impact: {
      label: "وش يتأثر؟",
      title: "الإشارة المرتبطة",
      body: item.impact,
      tone: "bg-[var(--color-saffron-50)] text-[var(--color-ink)]"
    }
  } satisfies Record<string, { label: string; title: string; body: string; tone: string }>;
  const active = panels[activePanel];

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
      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(panels) as Array<keyof typeof panels>).map((key) => (
          <button
            className={`min-h-10 rounded-full border px-4 py-2 text-sm font-black transition ${
              activePanel === key
                ? "border-[var(--color-zubda-500)] bg-[var(--color-zubda-50)] text-[var(--color-zubda-700)]"
                : "border-[var(--color-line)] bg-white text-[var(--color-ink-muted)] hover:border-[var(--color-zubda-200)]"
            }`}
            key={key}
            onClick={() => setActivePanel(key)}
            type="button"
          >
            {panels[key].label}
          </button>
        ))}
      </div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 rounded-[24px] p-4 ${active.tone}`}
        initial={{ opacity: 0, y: 8 }}
        key={activePanel}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-sm font-black">{active.title}</p>
        <p className="arabic-copy mt-2 font-bold text-[var(--color-ink-muted)]">{active.body}</p>
      </motion.div>
      {enableFeedback ? <FeedbackButtons briefId={briefId} sourceStoryId={item.sourceStoryId} /> : null}
    </Card>
  );
}

function TalkingPointsCard({ points }: { points: string[] }): ReactElement | null {
  const [copiedPoint, setCopiedPoint] = useState<string | null>(null);

  if (!points.length) {
    return null;
  }

  async function copyPoint(point: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(point);
      setCopiedPoint(point);
    } catch {
      setCopiedPoint(null);
    }
  }

  return (
    <Card className="p-5 md:p-6">
      <p className="text-sm font-black text-[var(--color-trust-700)]">لو بتتكلم عنه</p>
      <h2 className="mt-2 text-3xl font-black">قولها كذا</h2>
      <p className="arabic-copy mt-2 text-sm font-semibold text-[var(--color-ink-muted)]">
        نقاط مختصرة للاجتماعات أو السوالف المهنية، من غير مبالغة أو ادعاء يقين
      </p>
      <div className="mt-5 grid gap-3">
        {points.map((point) => (
          <div className="rounded-[22px] border border-[var(--color-line)] bg-white p-4" key={point}>
            <div className="flex gap-3">
              <CheckCircle2 aria-hidden className="mt-1 shrink-0 text-[var(--color-trust-500)]" size={18} />
              <div className="min-w-0 flex-1">
                <p className="arabic-copy font-bold text-[var(--color-ink-muted)]">{point}</p>
                <p className="mt-2 text-xs font-black text-[var(--color-risk)]">لا تحولها لتوصية أو توقع مؤكد</p>
              </div>
            </div>
            <button
              className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1 text-xs font-black text-[var(--color-ink-muted)] transition hover:border-[var(--color-zubda-300)] hover:text-[var(--color-zubda-700)]"
              onClick={() => void copyPoint(point)}
              type="button"
            >
              <Copy aria-hidden size={14} />
              {copiedPoint === point ? "انسخت" : "انسخ النقطة"}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SourcesDrawer({
  sources,
  defaultOpen
}: {
  sources: BriefDocument["structuredBrief"]["sources"];
  defaultOpen: boolean;
}): ReactElement {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="p-5 md:p-6">
      <button
        className="flex w-full items-center justify-between gap-4 text-right"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span>
          <span className="block text-3xl font-black">المصادر</span>
          <span className="arabic-copy mt-2 block text-sm font-semibold text-[var(--color-ink-muted)]">
            {sources.length} مصادر، افتحها وقت ما تحتاج تتأكد
          </span>
        </span>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--color-zubda-50)] text-[var(--color-zubda-700)]">
          {open ? <ChevronUp aria-hidden size={20} /> : <ChevronDown aria-hidden size={20} />}
        </span>
      </button>
      {open ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 grid gap-3"
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {sources.map((source) => (
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
        </motion.div>
      ) : null}
    </Card>
  );
}

export function BriefReader({ brief, enableFeedback = true }: BriefReaderProps): ReactElement {
  const { structuredBrief } = brief;
  const bullets = snapshotBullets(structuredBrief.executiveSnapshot.body);
  const hasExposure = Boolean(structuredBrief.portfolioExposure?.length);
  const hasTalkingPoints = structuredBrief.talkingPoints.length > 0;
  const [readerMode, setReaderMode] = useState<ReaderMode>("bottomLine");
  const [detailLevel, setDetailLevel] = useState<DetailLevel>(brief.depth === "deep" ? "deep" : "standard");
  const [visibleSections, setVisibleSections] = useState<SectionVisibility>({
    market: true,
    watchboard: true,
    impact: true,
    talking: true,
    glossary: true,
    sources: false
  });
  const showMarket = visibleSections.market && (detailLevel !== "quick" || readerMode === "investment");
  const showWatchboard = visibleSections.watchboard && structuredBrief.watchboard.length > 0;
  const showImpact = visibleSections.impact && detailLevel !== "quick";
  const showTalking = visibleSections.talking && hasTalkingPoints;
  const showGlossary = visibleSections.glossary && detailLevel === "deep";
  const showSources = visibleSections.sources || detailLevel === "deep";

  function toggleSection(section: SectionKey): void {
    setVisibleSections((current) => ({ ...current, [section]: !current[section] }));
  }

  function changeMode(mode: ReaderMode): void {
    setReaderMode(mode);
    setVisibleSections((current) => ({
      ...current,
      market: mode === "investment" ? true : current.market,
      watchboard: mode === "watchlist" ? true : current.watchboard,
      talking: mode === "meeting" ? true : current.talking
    }));
  }

  const metricStrip = <MetricStrip metrics={structuredBrief.metrics} />;
  const marketStack = showMarket ? (
    <>
      <SentimentGauge sentiment={structuredBrief.sentiment} />
      {structuredBrief.riskFactors?.length && detailLevel !== "quick" ? (
        <RiskPressureBars risks={structuredBrief.riskFactors} />
      ) : null}
      {hasExposure ? <PortfolioExposure exposure={structuredBrief.portfolioExposure} /> : null}
    </>
  ) : null;
  const watchboardStack = showWatchboard ? (
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
  ) : null;
  const impactCard = showImpact ? (
    <Card className="p-5 md:p-6">
      <p className="text-sm font-black text-[var(--color-zubda-600)]">الأثر عليك</p>
      <h2 className="mt-2 text-3xl font-black leading-[1.45]">{structuredBrief.personalImpact.title}</h2>
      <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
        {structuredBrief.personalImpact.body}
      </p>
    </Card>
  ) : null;
  const talkingCard = showTalking ? <TalkingPointsCard points={structuredBrief.talkingPoints} /> : null;
  const glossaryCard = showGlossary ? (
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
  ) : null;
  const sourcesDrawer = showSources ? (
    <SourcesDrawer
      defaultOpen={detailLevel === "deep" || visibleSections.sources}
      key={`${detailLevel}-${visibleSections.sources ? "open" : "closed"}`}
      sources={structuredBrief.sources}
    />
  ) : null;

  return (
    <div className="grid gap-7">
      <BriefControlPanel
        detailLevel={detailLevel}
        mode={readerMode}
        onDetailChange={setDetailLevel}
        onModeChange={changeMode}
        onSectionToggle={toggleSection}
        sourceCount={structuredBrief.sources.length}
        talkingCount={structuredBrief.talkingPoints.length}
        visibleSections={visibleSections}
        watchCount={structuredBrief.watchboard.length}
      />

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

      {readerMode === "meeting" ? (
        <>
          {talkingCard}
          {metricStrip}
          {watchboardStack}
          {impactCard}
          {marketStack}
        </>
      ) : readerMode === "investment" ? (
        <>
          {metricStrip}
          {marketStack}
          {watchboardStack}
          {impactCard}
          {talkingCard}
        </>
      ) : readerMode === "watchlist" ? (
        <>
          {watchboardStack}
          {metricStrip}
          {impactCard}
          {marketStack}
          {talkingCard}
        </>
      ) : (
        <>
          {metricStrip}
          {watchboardStack}
          {impactCard}
          {marketStack}
          {talkingCard}
        </>
      )}

      {glossaryCard}
      {sourcesDrawer}

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
