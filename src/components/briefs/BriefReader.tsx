"use client";

import { CheckCircle2, ExternalLink, ThumbsDown, ThumbsUp } from "lucide-react";
import { type ReactElement, useState } from "react";
import type { BriefDocument, WatchboardItem } from "@/lib/briefs/types";
import { authedFetch } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type BriefReaderProps = {
  brief: BriefDocument;
};

const reliabilityLabels = {
  high: "قوي",
  medium: "متوسط",
  low: "يحتاج متابعة"
} as const;

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
        مو مهم
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
        زودني عنه
      </button>
    </div>
  );
}

function WatchboardCard({ item, briefId }: { item: WatchboardItem; briefId: string }): ReactElement {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-[var(--color-zubda-600)]">راقب اليوم</p>
          <h3 className="mt-2 text-2xl font-black leading-[1.45]">{item.title}</h3>
        </div>
        <span className="rounded-full bg-[var(--color-zubda-50)] px-3 py-1 text-xs font-black text-[var(--color-zubda-700)]">
          {item.time}
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm font-black">ليش يهمك؟</p>
          <p className="arabic-copy mt-2 text-[var(--color-ink-muted)]">{item.why}</p>
        </div>
        <div>
          <p className="text-sm font-black">بالعربي البسيط</p>
          <p className="arabic-copy mt-2 text-[var(--color-ink-muted)]">{item.plainArabic}</p>
        </div>
      </div>
      <p className="mt-4 inline-flex rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-[var(--color-ink-muted)]">
        التأثير المحتمل: {item.impact}
      </p>
      <FeedbackButtons briefId={briefId} sourceStoryId={item.sourceStoryId} />
    </Card>
  );
}

export function BriefReader({ brief }: BriefReaderProps): ReactElement {
  const { structuredBrief } = brief;

  return (
    <div className="grid gap-5">
      <Card className="overflow-hidden border-[var(--color-zubda-200)]">
        <div className="bg-[var(--color-zubda-500)] p-6 text-white md:p-8">
          <p className="text-sm font-black text-white/80">زبدة اليوم</p>
          <h1 className="mt-2 text-4xl font-black leading-[1.45] md:text-5xl">
            {structuredBrief.headline}
          </h1>
          <p className="arabic-copy mt-4 max-w-3xl text-lg font-medium text-white/88">
            {structuredBrief.executiveSnapshot.body}
          </p>
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

      <section className="grid gap-4">
        {structuredBrief.watchboard.map((item) => (
          <WatchboardCard briefId={brief.id} item={item} key={`${brief.id}-${item.sourceStoryId}`} />
        ))}
      </section>

      <Card className="p-5 md:p-6">
        <p className="text-sm font-black text-[var(--color-zubda-600)]">وش أثرها عليك؟</p>
        <h2 className="mt-2 text-3xl font-black leading-[1.45]">{structuredBrief.personalImpact.title}</h2>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
          {structuredBrief.personalImpact.body}
        </p>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <Card className="p-5 md:p-6">
          <h2 className="text-3xl font-black">كلام ينقال</h2>
          <div className="mt-5 grid gap-3">
            {structuredBrief.talkingPoints.map((point) => (
              <div
                className="flex gap-3 rounded-[22px] border border-[var(--color-line)] bg-white p-4"
                key={point}
              >
                <CheckCircle2 aria-hidden className="mt-1 shrink-0 text-[var(--color-trust-500)]" size={18} />
                <p className="arabic-copy font-medium text-[var(--color-ink-muted)]">{point}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <h2 className="text-3xl font-black">يعني إيش؟</h2>
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
        <h2 className="text-3xl font-black">من وين جبناها؟</h2>
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
        <h2 className="text-3xl font-black">خلصت زبدة اليوم</h2>
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
