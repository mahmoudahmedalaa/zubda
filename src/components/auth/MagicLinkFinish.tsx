"use client";

import { useRouter } from "next/navigation";
import { type ReactElement, useEffect, useState } from "react";
import { completeMagicLink, isMagicLink, syncSignedInUser } from "@/lib/auth/client";
import { authedFetch } from "@/lib/api/client";

type MeResponse = {
  profile: unknown | null;
};

export function MagicLinkFinish(): ReactElement {
  const router = useRouter();
  const [message, setMessage] = useState("نتأكد من رابط الدخول...");

  useEffect(() => {
    async function finish(): Promise<void> {
      try {
        const url = window.location.href;

        if (!isMagicLink(url)) {
          setMessage("الرابط غير صالح أو منتهي.");
          return;
        }

        await completeMagicLink(url);
        await syncSignedInUser();

        const response = await authedFetch("/api/me");
        if (!response.ok) {
          router.replace("/onboarding");
          return;
        }

        const data = (await response.json()) as MeResponse;
        router.replace(data.profile ? "/app/today" : "/onboarding");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "ما قدرنا نكمل الدخول.");
      }
    }

    void finish();
  }, [router]);

  return <p className="arabic-copy mt-4 text-[var(--color-ink-muted)]">{message}</p>;
}
