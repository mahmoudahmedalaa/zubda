"use client";

import { onAuthStateChanged } from "firebase/auth";
import { ArrowLeft, CheckCircle2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactElement, useEffect, useMemo, useState } from "react";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";
import { planLimits } from "@/lib/plans";
import {
  briefDepths,
  currencies,
  deliveryTimes,
  interestModules,
  languageModes,
  mainGoals,
  regions,
  roles
} from "@/data/onboarding";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

const steps = [
  "language",
  "region",
  "role",
  "goal",
  "interests",
  "watchlist",
  "currency",
  "depth",
  "delivery",
  "preview"
] as const;

type DraftProfile = {
  languageMode: "arabic" | "english" | "mixed";
  region: (typeof regions)[number];
  role: (typeof roles)[number];
  mainGoals: string[];
  interestModuleIds: string[];
  watchlist: string[];
  preferredCurrency: (typeof currencies)[number];
  briefDepth: "quick" | "standard" | "deep";
  deliveryTime: string;
  timezone: string;
};

const initialDraft: DraftProfile = {
  languageMode: "mixed",
  region: "UAE",
  role: "مستشار",
  mainGoals: [mainGoals[0]],
  interestModuleIds: ["المال والاستثمار", "الذكاء الاصطناعي والتقنية", "أعمال الخليج"],
  watchlist: [],
  preferredCurrency: "AED",
  briefDepth: "standard",
  deliveryTime: "07:30",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dubai"
};

function toggleValue(list: string[], value: string, max?: number): string[] {
  if (list.includes(value)) {
    return list.filter((item) => item !== value);
  }

  if (max && list.length >= max) {
    return list;
  }

  return [...list, value];
}

export function OnboardingWizard(): ReactElement {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<DraftProfile>(initialDraft);
  const [watchInput, setWatchInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const step = steps[stepIndex];
  const freeLimits = planLimits.free;
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  useEffect(() => {
    if (!hasFirebaseClientConfig()) {
      queueMicrotask(() => {
        setAuthReady(true);
        setError("Firebase غير مضبوط لهذه البيئة.");
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      setAuthReady(true);

      if (!user) {
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, [router]);

  const previewItems = useMemo(
    () => [
      ["اللغة", draft.languageMode],
      ["المنطقة", draft.region],
      ["الدور", draft.role],
      ["الأهداف", draft.mainGoals.join("، ")],
      ["الاهتمامات", draft.interestModuleIds.join("، ")],
      ["قائمة المتابعة", draft.watchlist.length ? draft.watchlist.join("، ") : "تقدر تضيفها لاحقاً"],
      ["العملة", draft.preferredCurrency],
      ["العمق", draft.briefDepth],
      ["وقت الوصول", draft.deliveryTime]
    ],
    [draft]
  );

  function addWatchItem(): void {
    const value = watchInput.trim();

    if (!value || draft.watchlist.includes(value) || draft.watchlist.length >= freeLimits.maxWatchlistItems) {
      return;
    }

    setDraft((current) => ({ ...current, watchlist: [...current.watchlist, value] }));
    setWatchInput("");
  }

  async function saveProfile(): Promise<void> {
    setSaving(true);
    setError(null);

    try {
      const response = await authedFetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify(draft)
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: { message?: string } };
        throw new Error(payload.error?.message ?? "ما قدرنا نحفظ ملفك.");
      }

      router.push("/app/today");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "ما قدرنا نحفظ ملفك.");
    } finally {
      setSaving(false);
    }
  }

  if (!authReady) {
    return (
      <Card className="w-full max-w-2xl p-6 text-right">
        <p className="arabic-copy text-[var(--color-ink-muted)]">نتأكد من دخولك...</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl p-6 text-right">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase text-[var(--color-ink-muted)]">
            Step {stepIndex + 1} of {steps.length}
          </p>
          <p className="font-mono text-xs text-[var(--color-trust-700)]">{progress}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-zubda-50)]">
          <div
            className="h-full rounded-full bg-[var(--color-zubda-500)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step === "language" ? (
        <section>
          <h1 className="text-3xl font-black">بأي لغة تبي الزبدة؟</h1>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
            Mixed يعني عربي أولاً، مع مصطلحات البزنس والتقنية بالإنجليزي لما تكون طبيعية.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {languageModes.map((mode) => (
              <Chip
                key={mode.value}
                onClick={() => setDraft((current) => ({ ...current, languageMode: mode.value }))}
                selected={draft.languageMode === mode.value}
              >
                {mode.label}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {step === "region" ? (
        <section>
          <h1 className="text-3xl font-black">وين نركز لك؟</h1>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
            المنطقة تساعدنا نرتب الإشارات حسب قربها من يومك.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {regions.map((region) => (
              <Chip
                key={region}
                onClick={() => setDraft((current) => ({ ...current, region }))}
                selected={draft.region === region}
              >
                {region}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {step === "role" ? (
        <section>
          <h1 className="text-3xl font-black">وش أقرب وصف لك؟</h1>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
            دورك يغير طريقة شرح التأثير: اجتماع، عميل، استثمار، أو قرار.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {roles.map((role) => (
              <Chip
                key={role}
                onClick={() => setDraft((current) => ({ ...current, role }))}
                selected={draft.role === role}
              >
                {role}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {step === "goal" ? (
        <section>
          <h1 className="text-3xl font-black">ليش تبي زبدة كل صباح؟</h1>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
            اختار أكثر من هدف عشان نعرف شكل “الفائدة” بالنسبة لك.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {mainGoals.map((goal) => (
              <Chip
                key={goal}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    mainGoals: toggleValue(current.mainGoals, goal)
                  }))
                }
                selected={draft.mainGoals.includes(goal)}
              >
                {goal}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {step === "interests" ? (
        <section>
          <h1 className="text-3xl font-black">وش المواضيع اللي تهمك؟</h1>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
            Free يبدأ بثلاث اهتمامات. Pro يفتح تخصيص أوسع لاحقاً.
          </p>
          <div className="mt-3 text-sm font-semibold text-[var(--color-trust-700)]">
            {draft.interestModuleIds.length}/{freeLimits.maxInterestModules}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {interestModules.map((interest) => (
              <Chip
                key={interest}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    interestModuleIds: toggleValue(
                      current.interestModuleIds,
                      interest,
                      freeLimits.maxInterestModules
                    )
                  }))
                }
                selected={draft.interestModuleIds.includes(interest)}
              >
                {interest}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {step === "watchlist" ? (
        <section>
          <h1 className="text-3xl font-black">مين أو إيش تبغى نراقب لك؟</h1>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
            شركات، أصول، أسواق، مواضيع، دول، أو علامات تجارية.
          </p>
          <div className="mt-7 flex gap-2">
            <input
              className="min-h-12 min-w-0 flex-1 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 outline-none focus:border-[var(--color-zubda-500)]"
              onChange={(event) => setWatchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addWatchItem();
                }
              }}
              placeholder="Nvidia, Oil prices, Saudi market..."
              value={watchInput}
            />
            <Button onClick={addWatchItem} variant="secondary">
              <Plus aria-hidden size={18} />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {draft.watchlist.map((item) => (
              <Chip
                key={item}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    watchlist: current.watchlist.filter((watchItem) => watchItem !== item)
                  }))
                }
                selected
              >
                <X aria-hidden size={14} />
                {item}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {step === "currency" ? (
        <section>
          <h1 className="text-3xl font-black">بأي عملة تحب نفهمك الأرقام؟</h1>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
            نستخدمها للشرح داخل الملخص. أسعار Stripe ثابتة ومنفصلة.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {currencies.map((currency) => (
              <Chip
                key={currency}
                onClick={() => setDraft((current) => ({ ...current, preferredCurrency: currency }))}
                selected={draft.preferredCurrency === currency}
              >
                {currency}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {step === "depth" ? (
        <section>
          <h1 className="text-3xl font-black">قد إيش تبيها مختصرة؟</h1>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
            Standard هو default: خمس دقائق تعطيك الزبدة بدون حشو.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {briefDepths.map((depth) => (
              <Chip
                key={depth.value}
                onClick={() => setDraft((current) => ({ ...current, briefDepth: depth.value }))}
                selected={draft.briefDepth === depth.value}
              >
                {depth.label}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {step === "delivery" ? (
        <section>
          <h1 className="text-3xl font-black">متى توصلك الزبدة؟</h1>
          <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
            الإيميل هو trigger اليومي، والقراءة تكون في صفحة خاصة.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {deliveryTimes.map((time) => (
              <Chip
                key={time}
                onClick={() => setDraft((current) => ({ ...current, deliveryTime: time }))}
                selected={draft.deliveryTime === time}
              >
                {time}
              </Chip>
            ))}
          </div>
        </section>
      ) : null}

      {step === "preview" ? (
        <section>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-trust-50)] px-3 py-2 text-sm font-bold text-[var(--color-trust-700)]">
            <CheckCircle2 aria-hidden size={16} />
            جاهزين لأول زبدة
          </div>
          <h1 className="text-3xl font-black">كذا بتصير زبدتك</h1>
          <div className="mt-6 grid gap-3">
            {previewItems.map(([label, value]) => (
              <div
                className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper)] p-3"
                key={label}
              >
                <p className="text-xs font-bold text-[var(--color-zubda-700)]">{label}</p>
                <p className="arabic-copy mt-1 text-sm text-[var(--color-ink-muted)]">{value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {error ? (
        <p className="arabic-copy mt-5 rounded-[var(--radius-card)] bg-[var(--color-zubda-50)] p-3 text-sm text-[var(--color-risk)]">
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex justify-between gap-3">
        <Button
          disabled={saving}
          onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
          variant="secondary"
        >
          رجوع
        </Button>
        <Button
          disabled={saving || draft.mainGoals.length === 0 || draft.interestModuleIds.length === 0}
          onClick={() => {
            if (stepIndex === steps.length - 1) {
              void saveProfile();
              return;
            }

            setStepIndex((current) => Math.min(current + 1, steps.length - 1));
          }}
        >
          {stepIndex === steps.length - 1 ? (saving ? "نحفظ..." : "ابدأ زبدتي") : "التالي"}
          <ArrowLeft aria-hidden size={18} />
        </Button>
      </div>
    </Card>
  );
}
