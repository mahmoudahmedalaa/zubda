"use client";

import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { type ReactElement, useEffect, useState } from "react";
import type { BriefDocument } from "@/lib/briefs/types";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";
import { BriefReader } from "@/components/briefs/BriefReader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type TodayResponse = {
  brief: BriefDocument;
};

export function TodayBriefClient(): ReactElement {
  const [brief, setBrief] = useState<BriefDocument | null>(null);
  const [status, setStatus] = useState<"loading" | "signed_out" | "ready" | "error">("loading");

  useEffect(() => {
    if (!hasFirebaseClientConfig()) {
      queueMicrotask(() => setStatus("error"));
      return;
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      if (!user) {
        setStatus("signed_out");
        return;
      }

      try {
        const response = await authedFetch("/api/briefs/today");

        if (!response.ok) {
          throw new Error("Could not load today's brief.");
        }

        const data = (await response.json()) as TodayResponse;
        setBrief(data.brief);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    });

    return () => unsubscribe();
  }, []);

  if (status === "loading") {
    return (
      <Card className="p-6 text-right">
        <p className="text-sm font-black text-[var(--color-zubda-600)]">نجهز لك الزبدة...</p>
        <div className="mt-5 grid gap-3">
          <div className="h-20 animate-pulse rounded-[24px] bg-[var(--color-zubda-50)]" />
          <div className="h-28 animate-pulse rounded-[24px] bg-slate-50" />
          <div className="h-28 animate-pulse rounded-[24px] bg-slate-50" />
        </div>
      </Card>
    );
  }

  if (status === "signed_out") {
    return (
      <Card className="p-6 text-center">
        <h1 className="text-3xl font-black">ادخل عشان تشوف زبدتك.</h1>
        <p className="arabic-copy mx-auto mt-3 max-w-lg text-[var(--color-ink-muted)]">
          الملخص خاص فيك ويتغير حسب اهتماماتك وقائمة المتابعة.
        </p>
        <ButtonLink className="mt-6" href="/login">
          ادخل الآن
        </ButtonLink>
      </Card>
    );
  }

  if (status === "error" || !brief) {
    return (
      <Card className="p-6 text-center">
        <h1 className="text-3xl font-black">ما قدرنا نجيب زبدة اليوم.</h1>
        <p className="arabic-copy mx-auto mt-3 max-w-lg text-[var(--color-ink-muted)]">
          غالباً مشكلة مؤقتة في الاتصال. جرب تحدث الصفحة بعد شوي.
        </p>
      </Card>
    );
  }

  return (
    <>
      <header className="mb-8 flex flex-col justify-between gap-4 text-right md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold text-[var(--color-ink-muted)]">ملخصك اليومي</p>
          <h1 className="mt-2 text-4xl font-black leading-[1.45]">زبدة اليوم جاهزة</h1>
        </div>
        <Link
          className="font-bold text-[var(--color-zubda-600)] underline-offset-4 hover:underline"
          href="/app/archive"
        >
          زبداتك السابقة
        </Link>
      </header>
      <BriefReader brief={brief} />
    </>
  );
}
