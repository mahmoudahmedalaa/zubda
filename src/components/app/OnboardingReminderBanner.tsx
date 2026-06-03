"use client";

import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { type ReactElement, useEffect, useState } from "react";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";

type MeResponse = {
  profile: unknown | null;
};

export function OnboardingReminderBanner(): ReactElement | null {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!hasFirebaseClientConfig()) {
      return;
    }

    let requestId = 0;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      const currentRequest = ++requestId;

      if (!user) {
        setShowBanner(false);
        return;
      }

      try {
        const response = await authedFetch("/api/me");
        if (!response.ok) {
          if (currentRequest === requestId) setShowBanner(true);
          return;
        }

        const data = (await response.json()) as MeResponse;
        if (currentRequest === requestId) setShowBanner(!data.profile);
      } catch {
        if (currentRequest === requestId) setShowBanner(false);
      }
    });

    return () => {
      requestId += 1;
      unsubscribe();
    };
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div className="page-shell pb-4">
      <div className="rounded-[24px] border border-[var(--color-zubda-200)] bg-[var(--color-zubda-50)] px-4 py-3 text-right shadow-sm md:flex md:items-center md:justify-between md:gap-4">
        <div>
          <p className="text-sm font-black text-[var(--color-zubda-700)]">زبدتك لسه عامة</p>
          <p className="arabic-copy mt-1 text-sm font-bold text-[var(--color-ink-muted)]">
            كم اختيار سريع يخلي الملخص أقرب لشغلك واهتماماتك
          </p>
        </div>
        <Link
          className="mt-3 inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--color-zubda-500)] px-4 text-sm font-black text-white transition hover:-translate-y-0.5 md:mt-0"
          href="/onboarding"
        >
          كمّل التخصيص
        </Link>
      </div>
    </div>
  );
}
