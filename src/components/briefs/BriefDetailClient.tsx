"use client";

import { onAuthStateChanged } from "firebase/auth";
import { type ReactElement, useEffect, useState } from "react";
import type { BriefDocument } from "@/lib/briefs/types";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";
import { BriefReader } from "@/components/briefs/BriefReader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type BriefDetailResponse = {
  brief: BriefDocument;
};

export function BriefDetailClient({ briefId }: { briefId: string }): ReactElement {
  const [brief, setBrief] = useState<BriefDocument | null>(null);
  const [status, setStatus] = useState<"loading" | "signed_out" | "ready" | "not_found" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!hasFirebaseClientConfig()) {
      queueMicrotask(() => setStatus("error"));
      return;
    }

    let requestId = 0;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      const currentRequest = ++requestId;
      setBrief(null);

      if (!user) {
        setStatus("signed_out");
        return;
      }

      setStatus("loading");

      try {
        const response = await authedFetch(`/api/briefs/${briefId}`);

        if (response.status === 404) {
          if (currentRequest !== requestId) return;
          setStatus("not_found");
          return;
        }

        if (!response.ok) {
          throw new Error("Could not load brief.");
        }

        const data = (await response.json()) as BriefDetailResponse;
        if (currentRequest !== requestId) return;
        setBrief(data.brief);
        setStatus("ready");
      } catch {
        if (currentRequest !== requestId) return;
        setStatus("error");
      }
    });

    return () => {
      requestId += 1;
      unsubscribe();
    };
  }, [briefId]);

  if (status === "loading") {
    return (
      <Card className="p-6 text-right">
        <p className="text-sm font-black text-[var(--color-zubda-600)]">نفتح الزبدة...</p>
        <div className="mt-5 h-40 animate-pulse rounded-[24px] bg-[var(--color-zubda-50)]" />
      </Card>
    );
  }

  if (status === "signed_out") {
    return (
      <Card className="p-6 text-center">
        <h1 className="text-3xl font-black">ادخل عشان تشوف الزبدة.</h1>
        <ButtonLink className="mt-6" href="/login">
          ادخل الآن
        </ButtonLink>
      </Card>
    );
  }

  if (status === "not_found") {
    return (
      <Card className="p-6 text-center">
        <h1 className="text-3xl font-black">ما لقينا هذي الزبدة.</h1>
        <p className="arabic-copy mx-auto mt-3 max-w-lg text-[var(--color-ink-muted)]">
          ممكن تكون محذوفة أو ما تخص حسابك.
        </p>
        <ButtonLink className="mt-6" href="/app/archive">
          ارجع للأرشيف
        </ButtonLink>
      </Card>
    );
  }

  if (status === "error" || !brief) {
    return (
      <Card className="p-6 text-center">
        <h1 className="text-3xl font-black">صار خطأ ونحن نفتح الزبدة.</h1>
        <p className="arabic-copy mx-auto mt-3 max-w-lg text-[var(--color-ink-muted)]">
          جرب تحدث الصفحة بعد شوي.
        </p>
      </Card>
    );
  }

  return <BriefReader brief={brief} />;
}
