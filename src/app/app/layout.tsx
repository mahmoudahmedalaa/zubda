import type { ReactElement, ReactNode } from "react";
import { AppNav } from "@/components/app/AppNav";
import { OnboardingReminderBanner } from "@/components/app/OnboardingReminderBanner";

export default function AppLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <>
      <AppNav />
      <OnboardingReminderBanner />
      {children}
    </>
  );
}
