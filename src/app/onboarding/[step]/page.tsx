import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { onboardingSteps, type OnboardingStep } from "@/data/onboarding";

type PageProps = {
  params: Promise<{
    step: string;
  }>;
};

export default async function OnboardingStepPage({ params }: PageProps): Promise<ReactElement> {
  const { step } = await params;

  if (!onboardingSteps.includes(step as OnboardingStep)) {
    redirect("/onboarding");
  }

  redirect("/onboarding");
}
