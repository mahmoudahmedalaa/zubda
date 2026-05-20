import type { ReactElement } from "react";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default function OnboardingIndexPage(): ReactElement {
  return (
    <main className="page-shell grid min-h-screen place-items-center py-10">
      <OnboardingWizard />
    </main>
  );
}
