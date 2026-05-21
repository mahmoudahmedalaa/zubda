"use client";

import { onAuthStateChanged } from "firebase/auth";
import { ArrowLeft, CheckCircle2, Lock, Plus, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactElement, useEffect, useMemo, useState } from "react";
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
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

const steps = [
  "language",
  "region",
  "role",
  "goal",
  "interests",
  "watchlist",
  "decision",
  "communication",
  "about",
  "sources",
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
  languageMode: "mixed",
  region: "UAE",
  role: "مستشار",
  mainGoals: [mainGoals[0]],
  interestModuleIds: ["المال والاستثمار", "الذكاء الاصطناعي والتقنية", "أعمال الخليج"],
  watchlist: [],
  sourcePreferences: [],
  avoidTopics: [],
  communicationStyle: "مختصر ومباشر",
  decisionContext: "",
  personalContext: "",
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
  children
}: {
  eyebrow: string;
  title: string;
  body: string;
  children: ReactElement;
}): ReactElement {
  return (
    <section>
      <p className="text-sm font-black text-[var(--color-zubda-600)]">{eyebrow}</p>
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
      ["نرتب لك", draft.interestModuleIds.slice(0, 3).join("، ")],
      ["نراقب", draft.watchlist.length ? draft.watchlist.slice(0, 4).join("، ") : "أضف شركات أو مواضيع"],
      ["نشرح لك", draft.communicationStyle],
      ["نراعي", draft.decisionContext || draft.personalContext || "دورك وأهدافك"],
      ["نتجنب", draft.avoidTopics.length ? draft.avoidTopics.join("، ") : "ما حددت شيء"]
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
    <div className="grid w-full max-w-5xl gap-5 lg:grid-cols-[1fr_320px]">
      <Card className="p-6 text-right md:p-7">
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

        {step === "language" ? (
          <StepShell
            eyebrow="النبرة"
            title="بأي لغة تبي الزبدة؟"
            body="نضبط اللغة من البداية عشان الملخص ما يطلع مترجم أو غريب"
          >
            <div className="flex flex-wrap gap-3">
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
          </StepShell>
        ) : null}

        {step === "region" ? (
          <StepShell
            eyebrow="المكان يغير الأولوية"
            title="وين نركز لك؟"
            body="نفس الخبر ممكن يكون عادي عالمياً، لكنه مهم جداً في الخليج أو مصر أو منطقتك"
          >
            <div className="flex flex-wrap gap-3">
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
          </StepShell>
        ) : null}

        {step === "role" ? (
          <StepShell
            eyebrow="زاويتك"
            title="وش أقرب وصف لك؟"
            body="المستثمر يقرأ الأثر غير المؤسس، والمستشار يحتاج زاوية تنفع في الاجتماع"
          >
            <div className="flex flex-wrap gap-3">
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
          </StepShell>
        ) : null}

        {step === "goal" ? (
          <StepShell
            eyebrow="سبب الاستخدام"
            title="وش تبغى زبدة تختصر عليك؟"
            body="اختر اللي يهمك فعلاً. هذه الإجابة تحدد شكل الفائدة في الملخص"
          >
            <div className="flex flex-wrap gap-3">
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
          </StepShell>
        ) : null}

        {step === "interests" ? (
          <StepShell
            eyebrow={`${draft.interestModuleIds.length}/${limits.maxInterestModules}`}
            title="وش المواضيع اللي تهمك؟"
            body={isPaid ? "خذ راحتك. برو يعطيك مساحة أوسع للتخصيص" : "المجاني يبدأ بثلاث اهتمامات. خلك حاد في الاختيار"}
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
            body="اكتب الشركات، الأصول، الأسواق، المواضيع، الدول، أو العلامات اللي تبغى تظهر إذا صار حولها شيء مهم"
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
                  placeholder="أرامكو، النفط، السوق السعودي..."
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

        {step === "decision" ? (
          <StepShell
            eyebrow="السياق الذكي"
            title="وش القرارات اللي تبغى الزبدة تساعدك فيها؟"
            body="جملة أو جملتين تكفي. هذا يخلي التحليل أقرب لحياتك بدل ما يكون كلام عام"
          >
            <textarea
              className="arabic-copy min-h-32 w-full resize-y rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 outline-none focus:border-[var(--color-zubda-500)]"
              maxLength={800}
              onChange={(event) => setDraft((current) => ({ ...current, decisionContext: event.target.value }))}
              placeholder="مثلاً: أحتاج أفهم أثر الأخبار على استثماراتي، اجتماعات العملاء، والفرص في الخليج..."
              value={draft.decisionContext}
            />
          </StepShell>
        ) : null}

        {step === "communication" ? (
          <StepShell
            eyebrow="أسلوبك المفضل"
            title="كيف تحب زبدة تكلمك؟"
            body="هذا يغير طريقة الشرح، طول الجمل، ونوع النقاط اللي تطلع لك"
          >
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
          </StepShell>
        ) : null}

        {step === "about" ? (
          <StepShell
            eyebrow="خل زبدة تفهمك"
            title="شيء لازم نعرفه عنك؟"
            body="اكتبها بطريقتك. الذكاء في الخلفية يحولها لإشارات منظمة، بدون افتراضات زيادة"
          >
            <>
              <textarea
                className="arabic-copy min-h-36 w-full resize-y rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 outline-none focus:border-[var(--color-zubda-500)]"
                maxLength={1200}
                onChange={(event) => setDraft((current) => ({ ...current, personalContext: event.target.value }))}
                placeholder="مثلاً: أشتغل في الاستراتيجية، أتابع الاستثمار والتقنية، أحب المختصر العملي، وما أبي أخبار رياضية..."
                value={draft.personalContext}
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  disabled={analyzing || draft.personalContext.trim().length < 20}
                  onClick={() => void analyzePersonalContext()}
                  variant="secondary"
                >
                  <Sparkles aria-hidden size={17} />
                  {analyzing ? "نستخرج..." : "استخرج الإشارات"}
                </Button>
                <p className="text-xs font-bold text-[var(--color-ink-muted)]">
                  تضيف اهتمامات وقائمة متابعة من كلامك، بدون ما تخترع شيء
                </p>
              </div>
            </>
          </StepShell>
        ) : null}

        {step === "sources" ? (
          <StepShell
            eyebrow={isPaid ? "مصادرك المفضلة" : "ميزة برو"}
            title="في مصادر تحب ننتبه لها أو مواضيع نتجنبها؟"
            body="هذه خطوة اختيارية، لكنها تمنع الملخص من الذهاب لأماكن ما تهمك"
          >
            <div className="grid gap-4">
              {!isPaid ? (
                <div className="rounded-[26px] border border-[var(--color-line)] bg-[var(--color-zubda-50)] p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-[var(--color-zubda-700)]">
                    <Lock aria-hidden size={16} />
                    تخصيص المصادر يتفعل مع برو
                  </div>
                  <p className="arabic-copy mt-2 text-sm font-bold text-[var(--color-ink-muted)]">
                    تقدر تكمل الآن. لما تفعل برو، تضيف مصادر مفضلة ومواضيع ما تبغى تشوفها
                  </p>
                  <ButtonLink className="mt-4" href="/pricing" variant="secondary">
                    شوف برو
                  </ButtonLink>
                </div>
              ) : null}
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-black">مصادر أو ناشرين تفضلهم</p>
                  <div className="flex gap-2">
                    <input
                      className="min-h-12 min-w-0 flex-1 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 outline-none focus:border-[var(--color-zubda-500)] disabled:opacity-50"
                      disabled={!isPaid}
                      onChange={(event) => setSourceInput(event.target.value)}
                      placeholder="Reuters، أرقام، بلومبرغ..."
                      value={sourceInput}
                    />
                    <Button
                      disabled={!isPaid}
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
                  <p className="mb-2 text-sm font-black">مواضيع ما تهمك</p>
                  <div className="flex gap-2">
                    <input
                      className="min-h-12 min-w-0 flex-1 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 outline-none focus:border-[var(--color-zubda-500)] disabled:opacity-50"
                      disabled={!isPaid}
                      onChange={(event) => setAvoidInput(event.target.value)}
                      placeholder="رياضة، كريبتو، سياسة داخلية..."
                      value={avoidInput}
                    />
                    <Button
                      disabled={!isPaid}
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
              <div className="flex flex-wrap gap-2">
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
            </div>
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
            <div className="flex flex-wrap gap-3">
              {deliveryTimes.map((time) => {
                const locked = !limits.customDeliveryTime && time !== "07:30";
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
          </StepShell>
        ) : null}

        {step === "preview" ? (
          <StepShell
            eyebrow="جاهزين"
            title="كذا بتطلع زبدتك"
            body="هذه ليست إعدادات تقنية. هذه العدسة اللي بنقرأ فيها العالم لك"
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

      <aside className="h-fit rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-ink-panel)] p-5 text-right text-white shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[var(--color-saffron-300)]">ملفك الذكي</p>
            <h2 className="mt-1 text-2xl font-black">زبدتك تتشكل</h2>
          </div>
          <Sparkles aria-hidden className="text-[var(--color-saffron-300)]" size={24} />
        </div>
        <div className="mt-5 grid gap-3">
          {previewItems.map(([label, value]) => (
            <div className="rounded-[22px] bg-white/8 p-3" key={label}>
              <p className="text-xs font-black text-white/52">{label}</p>
              <p className="arabic-copy mt-1 text-sm font-bold text-white/86">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-[22px] bg-[var(--color-trust-50)] p-4 text-[var(--color-trust-700)]">
          <CheckCircle2 aria-hidden size={18} />
          <p className="arabic-copy mt-2 text-sm font-black">
            كل إجابة هنا تتحول لاحقاً لترتيب، تفسير، أو نقطة متابعة في الملخص
          </p>
        </div>
      </aside>
    </div>
  );
}
