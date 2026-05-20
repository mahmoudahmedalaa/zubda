import { redirect } from "next/navigation";
import type { ReactElement } from "react";

export default function OnboardingIndexPage(): ReactElement {
  redirect("/onboarding/language");
}
