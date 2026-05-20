import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { currencies, interestModules, onboardingSteps, type OnboardingStep } from "@/data/onboarding";

type PageProps = {
  params: Promise<{
    step: string;
  }>;
};

const stepCopy: Record<OnboardingStep, { title: string; prompt: string; options: readonly string[] }> = {
  language: {
    title: "بأي لغة تبي الزبدة؟",
    prompt: "اختر الطريقة اللي تناسب شغلك وتفكيرك اليومي.",
    options: ["عربي", "English", "Mixed"]
  },
  region: {
    title: "وين نركز لك؟",
    prompt: "المنطقة تساعدنا نرتب الأخبار حسب قربها منك.",
    options: ["UAE", "Saudi", "Egypt", "Qatar", "Kuwait", "Bahrain", "Oman", "MENA", "Global"]
  },
  role: {
    title: "وش أقرب وصف لك؟",
    prompt: "دورك يغير طريقة شرح التأثير عليك.",
    options: [
      "Consultant",
      "Founder",
      "Investor",
      "Corporate / Strategy",
      "Tech / Product",
      "Government / Policy",
      "Student",
      "Creator",
      "Other"
    ]
  },
  goal: {
    title: "ليش تبي زبدة كل صباح؟",
    prompt: "خلّ المنتج يعرف النتيجة اللي تبغاها من brief اليوم.",
    options: [
      "أكون مطّلع قبل الدوام",
      "أتابع السوق والاستثمار",
      "أفهم التقنية والذكاء الاصطناعي",
      "أتابع مجالي وعملائي",
      "أقلل وقت التصفح"
    ]
  },
  interests: {
    title: "وش المواضيع اللي تهمك؟",
    prompt: "Free يبدأ بثلاث اهتمامات. Pro يفتح تخصيص أوسع.",
    options: interestModules
  },
  watchlist: {
    title: "مين أو إيش تبغى نراقب لك؟",
    prompt: "شركات، مواضيع، أصول، أسواق، دول، أو علامات تجارية.",
    options: ["Nvidia", "QQQ", "Saudi market", "AI regulation", "Oil prices", "UAE real estate"]
  },
  currency: {
    title: "بأي عملة تحب نفهمك الأرقام؟",
    prompt: "هذا للشرح داخل brief. أسعار Stripe ثابتة ومنفصلة.",
    options: currencies
  },
  depth: {
    title: "قد إيش تبيها مختصرة؟",
    prompt: "Standard هو التجربة الأساسية في MVP.",
    options: ["Quick", "Standard", "Deep"]
  },
  delivery: {
    title: "متى توصلك الزبدة؟",
    prompt: "الإيميل هو trigger اليومي، والقراءة تكون في صفحة خاصة.",
    options: ["6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "9:00 AM"]
  },
  preview: {
    title: "كذا بتصير زبدتك",
    prompt: "Preview سريع قبل ما نجهز أول brief فعلي.",
    options: ["زبدة اليوم", "راقب هذي", "وش أثرها عليك؟"]
  }
};

export default async function OnboardingStepPage({ params }: PageProps): Promise<ReactElement> {
  const { step } = await params;

  if (!onboardingSteps.includes(step as OnboardingStep)) {
    notFound();
  }

  const currentStep = step as OnboardingStep;
  const index = onboardingSteps.indexOf(currentStep);
  const nextStep = onboardingSteps[index + 1];
  const previousStep = onboardingSteps[index - 1];
  const copy = stepCopy[currentStep];

  return (
    <main className="page-shell grid min-h-screen place-items-center py-10">
      <Card className="w-full max-w-2xl p-6 text-right">
        <p className="font-mono text-xs uppercase text-[var(--color-ink-muted)]">
          Step {index + 1} of {onboardingSteps.length}
        </p>
        <h1 className="mt-3 text-3xl font-black">{copy.title}</h1>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">{copy.prompt}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          {copy.options.map((option, optionIndex) => (
            <Chip key={option} selected={optionIndex === 0 || (currentStep === "interests" && optionIndex < 3)}>
              {option}
            </Chip>
          ))}
        </div>
        <div className="mt-8 flex justify-between gap-3">
          <ButtonLink href={previousStep ? `/onboarding/${previousStep}` : "/login"} variant="secondary">
            رجوع
          </ButtonLink>
          <ButtonLink href={nextStep ? `/onboarding/${nextStep}` : "/app/today"}>
            {nextStep ? "التالي" : "ابدأ زبدتي"}
          </ButtonLink>
        </div>
      </Card>
    </main>
  );
}
