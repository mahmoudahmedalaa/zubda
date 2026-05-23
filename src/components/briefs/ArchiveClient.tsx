"use client";

import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { type ReactElement, useEffect, useState } from "react";
import type { BriefDocument } from "@/lib/briefs/types";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ArchiveResponse = {
  briefs: BriefDocument[];
};

function briefTitle(brief: BriefDocument): string {
  return brief.structuredBrief?.headline ?? "زبدة محفوظة";
}

export function ArchiveClient(): ReactElement {
  const [briefs, setBriefs] = useState<BriefDocument[]>([]);
  const [status, setStatus] = useState<"loading" | "signed_out" | "ready" | "error">("loading");

  useEffect(() => {
    if (!hasFirebaseClientConfig()) {
      queueMicrotask(() => setStatus("error"));
      return;
    }

    let requestId = 0;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      const currentRequest = ++requestId;
      setBriefs([]);

      if (!user) {
        setStatus("signed_out");
        return;
      }

      setStatus("loading");

      try {
        const response = await authedFetch("/api/briefs");

        if (!response.ok) {
          throw new Error("Could not load archive.");
        }

        const data = (await response.json()) as ArchiveResponse;
        if (currentRequest !== requestId) return;
        setBriefs(data.briefs);
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
  }, []);

  if (status === "loading") {
    return (
      <div className="mt-8 grid gap-4">
        {[0, 1, 2].map((item) => (
          <div className="h-32 animate-pulse rounded-[var(--radius-card)] bg-white" key={item} />
        ))}
      </div>
    );
  }

  if (status === "signed_out") {
    return (
      <Card className="mt-8 p-6 text-center">
        <h2 className="text-3xl font-black">الأرشيف خاص فيك.</h2>
        <p className="arabic-copy mx-auto mt-3 max-w-lg text-[var(--color-ink-muted)]">
          ادخل بحسابك عشان تشوف زبداتك السابقة.
        </p>
        <ButtonLink className="mt-6" href="/login">
          ادخل الآن
        </ButtonLink>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="mt-8 p-6 text-center">
        <h2 className="text-3xl font-black">ما قدرنا نفتح الأرشيف.</h2>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">جرب تحدث الصفحة بعد شوي.</p>
      </Card>
    );
  }

  if (briefs.length === 0) {
    return (
      <Card className="mt-8 p-6 text-center">
        <h2 className="text-3xl font-black">ما عندك زبدات محفوظة بعد.</h2>
        <p className="arabic-copy mx-auto mt-3 max-w-lg text-[var(--color-ink-muted)]">
          أول ما يتولد ملخصك اليومي، بيظهر هنا عشان ترجع له وقت ما تحتاج.
        </p>
        <ButtonLink className="mt-6" href="/app/today">
          افتح زبدة اليوم
        </ButtonLink>
      </Card>
    );
  }

  return (
    <div className="mt-8 grid gap-4">
      {briefs.map((brief) => (
        <Link href={`/app/briefs/${brief.id}`} key={brief.id}>
          <Card className="p-5 transition hover:border-[var(--color-zubda-300)] hover:bg-[var(--color-zubda-50)]">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-black text-[var(--color-zubda-600)]">{brief.dateKey}</p>
                <h2 className="mt-2 text-2xl font-black leading-[1.45]">{briefTitle(brief)}</h2>
                <p className="arabic-copy mt-2 max-w-2xl text-[var(--color-ink-muted)]">
                  {brief.structuredBrief.executiveSnapshot.body}
                </p>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[var(--color-ink-muted)]">
                {brief.structuredBrief.sources.length} مصادر
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
