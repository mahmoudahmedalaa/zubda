"use client";

import { onAuthStateChanged } from "firebase/auth";
import { ArrowLeft, CheckCircle2, Lock, Plus, SlidersHorizontal, Wand2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactElement, type ReactNode, useEffect, useMemo, useState } from "react";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";
import { type PlanKey, planLimits } from "@/lib/plans";
import {
  briefDepths,
  communicationStyles,
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
  "role",
  "region",
  "goal",
  "interests",
  "watchlist",
  "about",
  "communication",
  "depth",
  "delivery",
  "preview"
] as const;

type DraftProfile = {
  languageMode: "arabic" | "english" | "mixed";
  region: (typeof regions)[number];
  regionFocus: string[];
  role: (typeof roles)[number];
  roleOther: string;
  mainGoals: string[];
  interestModuleIds: string[];
  watchlist: string[];
  sourcePreferences: string[];
  avoidTopics: string[];
  communicationStyle: (typeof communicationStyles)[number];
  decisionContext: string;
  personalContext: string;
  briefDepth: "quick" | "standard" | "deep";
  deliveryTime: string;
  timezone: string;
};

type ProfileSuggestions = Partial<
  Pick<
    DraftProfile,
    "interestModuleIds" | "watchlist" | "sourcePreferences" | "avoidTopics" | "decisionContext" | "communicationStyle"
  >
>;

const initialDraft: DraftProfile = {
  languageMode: "arabic",
  region: "الإمارات",
  regionFocus: ["الإمارات", "السعودية"],
  role: "مستشار",
  roleOther: "",
  mainGoals: [],
  interestModuleIds: ["المال والاستثمار", "الذكاء الاصطناعي والتقنية"],
  watchlist: [],
  sourcePreferences: [],
  avoidTopics: [],
  communicationStyle: "مختصر ومباشر",
  decisionContext: "",
  personalContext: "",
  briefDepth: "standard",
  deliveryTime: "09:00",
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

function addUniqueItem(list: string[], value: string, max: number): string[] {
  const trimmed = value.trim().slice(0, 120);
  if (!trimmed || list.includes(trimmed) || list.length >= max) {
    return list;
  }

  return [...list, trimmed];
}

function planLabel(plan: PlanKey): string {
  if (plan === "founder_lifetime") return "المؤسس";
  if (plan === "pro_monthly") return "برو";
  return "مجاني";
}

function StepShell({
  eyebrow,
  title,
  body,
  required = false,
  children
}: {
  eyebrow: string;
  title: string;
  body: string;
  required?: boolean;
  children: ReactNode;
}): ReactElement {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black text-[var(--color-zubda-600)]">{eyebrow}</p>
        <span className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-black text-[var(--color-ink-muted)]">
          {required ? "مطلوب" : "اختياري"}
        </span>
      </div>
      <h1 className="mt-2 text-3xl font-black leading-[1.35] md:text-4xl">{title}</h1>
      <p className="arabic-copy mt-3 text-base font-semibold text-[var(--color-ink-muted)]">{body}</p>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export function OnboardingWizard(): ReactElement {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [plan, setPlan] = useState<PlanKey>("free");
  const [draft, setDraft] = useState<DraftProfile>(initialDraft);
  const [watchInput, setWatchInput] = useState("");
  const [sourceInput, setSourceInput] = useState("");
  const [avoidInput, setAvoidInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const step = steps[stepIndex];
  const limits = planLimits[plan];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const isPaid = plan !== "free";
  const canContinue =
    step === "role"
      ? draft.role !== "غير ذلك" || draft.roleOther.trim().length > 1
      : step === "region"
        ? draft.regionFocus.length > 0
        : step === "goal"
          ? draft.mainGoals.length > 0
          : step === "interests"
            ? draft.interestModuleIds.length > 0
            : true;

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
        return;
      }

      void authedFetch("/api/me")
        .then((response) => (response.ok ? response.json() : null))
        .then((payload: { entitlement?: { plan?: PlanKey } } | null) => {
          if (payload?.entitlement?.plan) {
            setPlan(payload.entitlement.plan);
          }
        })
        .catch(() => undefined);
    });

    return unsubscribe;
  }, [router]);

  const previewItems = useMemo(
    () => [
      ["الدور", draft.role === "غير ذلك" ? draft.roleOther || "اكتب وصفك" : draft.role],
      ["التركيز", draft.regionFocus.length ? draft.regionFocus.join("، ") : draft.region],
      ["المواضيع", draft.interestModuleIds.length ? draft.interestModuleIds.slice(0, 4).join("، ") : "اختر موضوعين على الأقل"],
      ["المتابعة", draft.watchlist.length ? draft.watchlist.slice(0, 4).join("، ") : "اختياري"],
      ["الأسلوب", draft.communicationStyle]
    ],
    [draft]
  );

  function updateList(field: "watchlist" | "sourcePreferences" | "avoidTopics", value: string, max: number): void {
    setDraft((current) => ({ ...current, [field]: addUniqueItem(current[field], value, max) }));
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

  async function analyzePersonalContext(): Promise<void> {
    if (draft.personalContext.trim().length < 20) {
      setError("اكتب تفاصيل أكثر شوي عشان نطلع إشارات مفيدة.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const response = await authedFetch("/api/profile/analyze", {
        method: "POST",
        body: JSON.stringify({ text: draft.personalContext })
      });

      if (!response.ok) {
        throw new Error("ما قدرنا نستخرج الإشارات الآن.");
      }

      const payload = (await response.json()) as { suggestions?: ProfileSuggestions };
      const suggestions = payload.suggestions ?? {};

      setDraft((current) => ({
        ...current,
        interestModuleIds: Array.from(
          new Set([...(current.interestModuleIds ?? []), ...(suggestions.interestModuleIds ?? [])])
        ).slice(0, limits.maxInterestModules),
        watchlist: Array.from(new Set([...(current.watchlist ?? []), ...(suggestions.watchlist ?? [])])).slice(
          0,
          limits.maxWatchlistItems
        ),
        sourcePreferences: isPaid
          ? Array.from(new Set([...(current.sourcePreferences ?? []), ...(suggestions.sourcePreferences ?? [])])).slice(
              0,
              20
            )
          : current.sourcePreferences,
        avoidTopics: isPaid
          ? Array.from(new Set([...(current.avoidTopics ?? []), ...(suggestions.avoidTopics ?? [])])).slice(0, 20)
          : current.avoidTopics,
        decisionContext: current.decisionContext || suggestions.decisionContext || "",
        communicationStyle: suggestions.communicationStyle ?? current.communicationStyle
      }));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "ما قدرنا نستخرج الإشارات الآن.");
    } finally {
      setAnalyzing(false);
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
    <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="p-6 text-right md:p-8">
        <div className="mb-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-black text-[var(--color-ink-muted)]">
              خطوة {stepIndex + 1} من {steps.length}
            </p>
            <span className="rounded-full bg-[var(--color-zubda-50)] px-3 py-1 text-xs font-black text-[var(--color-zubda-700)]">
              خطة {planLabel(plan)}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-zubda-50)]">
            <div
              className="h-full rounded-full bg-[var(--color-zubda-500)] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {step === "role" ? (
          <StepShell
            eyebrow="نبدأ منك"
            title="وش أقرب وصف لك؟"
            body="نفس الخبر يهم كل شخص بطريقة مختلفة. اختر الأقرب، وإذا ما لقيت نفسك اكتبها لنا"
            required
          >
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {roles.map((role) => (
                  <button
                    className={`rounded-[24px] border p-4 text-right font-black transition hover:-translate-y-0.5 ${
                      draft.role === role
                        ? "border-[var(--color-zubda-500)] bg-[var(--color-zubda-50)] text-[var(--color-zubda-700)]"
                        : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-zubda-200)]"
                    }`}
                    key={role}
                    onClick={() => setDraft((current) => ({ ...current, role }))}
                    type="button"
                  >
                    {role}
                  </button>
                ))}
              </div>
              {draft.role === "غير ذلك" ? (
                <input
                  className="mt-4 min-h-12 w-full rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 outline-none focus:border-[var(--color-zubda-500)]"
                  onChange={(event) => setDraft((current) => ({ ...current, roleOther: event.target.value }))}
                  placeholder="مثلاً: محامي، طبيب، مشتريات، موارد بشرية..."
                  value={draft.roleOther}
                />
              ) : null}
            </>
          </StepShell>
        ) : null}

        {step === "region" ? (
          <StepShell
            eyebrow="المناطق اللي تهمك"
            title="وين تبغى التركيز؟"
            body="اختَر أكثر من منطقة إذا شغلك أو استثماراتك موزعة. نستخدمها لترتيب الأخبار، مو لحصر الملخص"
            required
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {regions.map((region) => (
                <button
                  className={`rounded-[22px] border px-4 py-3 text-right font-black transition hover:-translate-y-0.5 ${
                    draft.regionFocus.includes(region)
                      ? "border-[var(--color-zubda-500)] bg-[var(--color-zubda-50)] text-[var(--color-zubda-700)]"
                      : "border-[var(--color-line)] bg-white hover:border-[var(--color-zubda-200)]"
                  }`}
                  key={region}
                  onClick={() =>
                    setDraft((current) => {
                      const regionFocus = toggleValue(current.regionFocus, region);
                      return { ...current, region, regionFocus };
                    })
                  }
                  type="button"
                >
                  {region}
                </button>
              ))}
            </div>
          </StepShell>
        ) : null}

        {step === "goal" ? (
          <StepShell
            eyebrow="ليش تستخدم زبدة؟"
            title="وش تبغى تختصر عليك؟"
            body="اختَر هدف أو أكثر. هذا يحدد نوع الزوايا اللي تظهر لك: قرار، اجتماع، سوق، أو متابعة عامة"
            required
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {mainGoals.map((goal) => (
                <button
                  className={`rounded-[24px] border p-4 text-right font-black transition hover:-translate-y-0.5 ${
                    draft.mainGoals.includes(goal)
                      ? "border-[var(--color-green-500)] bg-[var(--color-green-50)] text-[var(--color-trust-700)]"
                      : "border-[var(--color-line)] bg-white hover:border-[var(--color-green-500)]"
                  }`}
                  key={goal}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      mainGoals: toggleValue(current.mainGoals, goal)
                    }))
                  }
                  type="button"
                >
                  {goal}
                </button>
              ))}
            </div>
          </StepShell>
        ) : null}

        {step === "interests" ? (
          <StepShell
            eyebrow={`${draft.interestModuleIds.length}/${limits.maxInterestModules}`}
            title="وش المواضيع اللي تهمك؟"
            body={isPaid ? "اختر اللي يهمك فعلاً. كل ما زادت المواضيع صار الملخص أوسع، فخل اختياراتك مقصودة" : "الخطة المجانية تعطيك موضوعين فقط. اختَر أهم شيئين عشان تحس بقيمة التخصيص"}
            required
          >
            <div className="flex flex-wrap gap-3">
              {interestModules.map((interest) => (
                <Chip
                  key={interest}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      interestModuleIds: toggleValue(
                        current.interestModuleIds,
                        interest,
                        limits.maxInterestModules
                      )
                    }))
                  }
                  selected={draft.interestModuleIds.includes(interest)}
                >
                  {interest}
                </Chip>
              ))}
            </div>
          </StepShell>
        ) : null}

        {step === "watchlist" ? (
          <StepShell
            eyebrow={`${draft.watchlist.length}/${limits.maxWatchlistItems}`}
            title="مين أو إيش نراقب لك؟"
            body="هذه القائمة تجعل الملخص شخصي فعلاً. اكتب أسماء واضحة، وفصل بينها بإدخال واحد كل مرة"
          >
            <>
              <div className="flex gap-2">
                <input
                  className="min-h-12 min-w-0 flex-1 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 outline-none focus:border-[var(--color-zubda-500)]"
                  onChange={(event) => setWatchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      updateList("watchlist", watchInput, limits.maxWatchlistItems);
                      setWatchInput("");
                    }
                  }}
                  placeholder="مثلاً: أرامكو، Nvidia، أسعار النفط، سوق دبي العقاري، الفائدة الأمريكية"
                  aria-label="أضف عنصر لقائمة المتابعة"
                  value={watchInput}
                />
                <Button
                  onClick={() => {
                    updateList("watchlist", watchInput, limits.maxWatchlistItems);
                    setWatchInput("");
                  }}
                  variant="secondary"
                >
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
            </>
          </StepShell>
        ) : null}

        {step === "about" ? (
          <StepShell
            eyebrow="نبذة تساعد التخصيص"
            title="وش لازم زبدة تعرف عنك؟"
            body="اختياري، لكنه أقوى جزء للتخصيص. اكتب بطريقتك: شغلك، قراراتك، الأشياء اللي تتابعها، والأشياء اللي ما تهمك"
          >
            <>
              <textarea
                className="arabic-copy min-h-36 w-full resize-y rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 outline-none focus:border-[var(--color-zubda-500)]"
                maxLength={1200}
                onChange={(event) => setDraft((current) => ({ ...current, personalContext: event.target.value }))}
                placeholder="مثلاً: أنا مستثمر في التقنية والطاقة، أشتغل مع عملاء في السعودية والإمارات، أبي نقاط تنفعني في الاجتماعات، وما تهمني أخبار الرياضة أو الكريبتو..."
                value={draft.personalContext}
              />
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[24px] bg-[var(--color-trust-50)] p-4">
                <Button
                  disabled={analyzing || draft.personalContext.trim().length < 20}
                  onClick={() => void analyzePersonalContext()}
                  variant="secondary"
                >
                  <Wand2 aria-hidden size={17} />
                  {analyzing ? "نرتب..." : "رتّبها لي"}
                </Button>
                <p className="arabic-copy text-sm font-bold text-[var(--color-trust-700)]">
                  نقرأ كلامك ونقترح اهتمامات أو متابعة، بدون ما نخترع معلومات عنك
                </p>
              </div>
              {isPaid ? (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-black">مصادر تفضلها</p>
                    <div className="flex gap-2">
                      <input
                        className="min-h-12 min-w-0 flex-1 rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 outline-none focus:border-[var(--color-zubda-500)]"
                        onChange={(event) => setSourceInput(event.target.value)}
                        placeholder="أرقام، Reuters، هيئة حكومية..."
                        value={sourceInput}
                      />
                      <Button
                        onClick={() => {
                          updateList("sourcePreferences", sourceInput, 20);
                          setSourceInput("");
                        }}
                        variant="secondary"
                      >
                        <Plus aria-hidden size={18} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-black">أشياء ما تهمك</p>
                    <div className="flex gap-2">
                      <input
                        className="min-h-12 min-w-0 flex-1 rounded-[22px] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 outline-none focus:border-[var(--color-zubda-500)]"
                        onChange={(event) => setAvoidInput(event.target.value)}
                        placeholder="رياضة، كريبتو، أخبار مشاهير..."
                        value={avoidInput}
                      />
                      <Button
                        onClick={() => {
                          updateList("avoidTopics", avoidInput, 20);
                          setAvoidInput("");
                        }}
                        variant="secondary"
                      >
                        <Plus aria-hidden size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-[24px] border border-[var(--color-line)] bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-[var(--color-zubda-700)]">
                    <Lock aria-hidden size={16} />
                    مصادر مفضلة وتجنب مواضيع معينة ضمن برو
                  </div>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {[...draft.sourcePreferences, ...draft.avoidTopics].map((item) => (
                  <Chip
                    key={item}
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        sourcePreferences: current.sourcePreferences.filter((entry) => entry !== item),
                        avoidTopics: current.avoidTopics.filter((entry) => entry !== item)
                      }))
                    }
                    selected
                  >
                    <X aria-hidden size={14} />
                    {item}
                  </Chip>
                ))}
              </div>
            </>
          </StepShell>
        ) : null}

        {step === "communication" ? (
          <StepShell
            eyebrow="طريقة الملخص"
            title="كيف تبي نكتب لك؟"
            body="الواجهة عربية، والملخص عربي افتراضياً. تقدر تخلي المصطلحات الإنجليزية تظهر إذا هذا أقرب لطريقة شغلك"
          >
            <>
              <div className="flex flex-wrap gap-3">
                {communicationStyles.map((style) => (
                  <Chip
                    key={style}
                    onClick={() => setDraft((current) => ({ ...current, communicationStyle: style }))}
                    selected={draft.communicationStyle === style}
                  >
                    {style}
                  </Chip>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
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
            </>
          </StepShell>
        ) : null}

        {step === "depth" ? (
          <StepShell
            eyebrow="طول القراءة"
            title="قد إيش تبيها مختصرة؟"
            body="المتوازن هو الأفضل للبداية. العميق مناسب إذا تبي سياق أكثر ومصادر أكثر"
          >
            <div className="flex flex-wrap gap-3">
              {briefDepths.map((depth) => {
                const locked = depth.value === "deep" && !limits.deeperBrief;
                return (
                  <Chip
                    disabled={locked}
                    key={depth.value}
                    onClick={() => setDraft((current) => ({ ...current, briefDepth: depth.value }))}
                    selected={draft.briefDepth === depth.value}
                  >
                    {locked ? <Lock aria-hidden size={14} /> : null}
                    {depth.label}
                  </Chip>
                );
              })}
            </div>
          </StepShell>
        ) : null}

        {step === "delivery" ? (
          <StepShell
            eyebrow="مو شرط الصباح"
            title="متى توصلك الزبدة؟"
            body="اختَر الوقت اللي فعلاً تقرأ فيه. المجاني يبدأ بوقت افتراضي، وبرو يفتح التخصيص"
          >
            <>
              <div className="flex flex-wrap gap-3">
                {deliveryTimes.map((time) => {
                const locked = !limits.customDeliveryTime && !["09:00", "13:00"].includes(time);
                return (
                  <Chip
                    disabled={locked}
                    key={time}
                    onClick={() => setDraft((current) => ({ ...current, deliveryTime: time }))}
                    selected={draft.deliveryTime === time}
                  >
                    {locked ? <Lock aria-hidden size={14} /> : null}
                    {time}
                  </Chip>
                );
              })}
              </div>
              {limits.customDeliveryTime ? (
                <label className="mt-5 block rounded-[24px] border border-[var(--color-line)] bg-white p-4">
                  <span className="text-sm font-black text-[var(--color-ink-muted)]">أو حدد وقتك بنفسك</span>
                  <input
                    className="mt-2 min-h-12 w-full rounded-[18px] bg-[var(--color-surface)] px-4 text-xl font-black outline-none focus:ring-2 focus:ring-[var(--color-zubda-200)]"
                    onChange={(event) => setDraft((current) => ({ ...current, deliveryTime: event.target.value }))}
                    type="time"
                    value={draft.deliveryTime}
                  />
                </label>
              ) : (
                <p className="arabic-copy mt-4 text-sm font-bold text-[var(--color-ink-muted)]">
                  المجاني يعطيك ٩ صباحاً أو ١ ظهراً. برو يفتح أي وقت يناسب روتينك
                </p>
              )}
            </>
          </StepShell>
        ) : null}

        {step === "preview" ? (
          <StepShell
            eyebrow="جاهزين"
            title="كذا بتطلع زبدتك"
            body="إذا حسّيتها قريبة منك، نبدأ. تقدر تعدل كل شيء لاحقاً من ملفك"
          >
            <div className="grid gap-3">
              {previewItems.map(([label, value]) => (
                <div
                  className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-paper)] p-4"
                  key={label}
                >
                  <p className="text-xs font-bold text-[var(--color-zubda-700)]">{label}</p>
                  <p className="arabic-copy mt-1 text-sm font-bold text-[var(--color-ink-muted)]">{value}</p>
                </div>
              ))}
            </div>
          </StepShell>
        ) : null}

        {error ? (
          <p className="arabic-copy mt-5 rounded-[var(--radius-card)] bg-red-50 p-3 text-sm font-bold text-[var(--color-risk)]">
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
            disabled={saving || !canContinue}
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

      <aside className="h-fit rounded-[var(--radius-card)] border border-[var(--color-line)] bg-white p-5 text-right shadow-[var(--shadow-card)] lg:sticky lg:top-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--color-zubda-600)]">ملخص اختياراتك</p>
            <h2 className="mt-1 text-2xl font-black">كل إجابة تغيّر الزبدة</h2>
          </div>
          <SlidersHorizontal aria-hidden className="text-[var(--color-zubda-500)]" size={24} />
        </div>
        <div className="mt-5 grid gap-3">
          {previewItems.map(([label, value]) => (
            <div className="rounded-[22px] bg-[var(--color-surface)] p-3" key={label}>
              <p className="text-xs font-black text-[var(--color-ink-soft)]">{label}</p>
              <p className="arabic-copy mt-1 text-sm font-bold text-[var(--color-ink)]">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-[22px] bg-[var(--color-trust-50)] p-4 text-[var(--color-trust-700)]">
          <CheckCircle2 aria-hidden size={18} />
          <p className="arabic-copy mt-2 text-sm font-black">
            نستخدم هذا لترتيب الأخبار، اختيار الزوايا، وتحديد الكلام اللي يستاهل يدخل ملخصك
          </p>
        </div>
      </aside>
    </div>
  );
}
