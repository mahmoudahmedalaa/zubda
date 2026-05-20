"use client";

import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { type ReactElement, useEffect, useState } from "react";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ProfileView = {
  languageMode?: string;
  region?: string;
  role?: string;
  mainGoals?: string[];
  interestModuleIds?: string[];
  watchlist?: string[];
  preferredCurrency?: string;
  briefDepth?: string;
  deliveryTime?: string;
};

type MeResponse = {
  profile: ProfileView | null;
  entitlement: {
    plan: string;
    status: string;
  };
};

const languageLabels: Record<string, string> = {
  arabic: "عربي",
  english: "إنجليزي",
  mixed: "عربي مع مصطلحات إنجليزية عند الحاجة"
};

const depthLabels: Record<string, string> = {
  quick: "سريع",
  standard: "متوازن",
  deep: "عميق"
};

function Field({ label, value }: { label: string; value?: string }): ReactElement {
  return (
    <div className="rounded-[24px] border border-[var(--color-line)] bg-white p-4">
      <p className="text-sm font-black text-[var(--color-ink-muted)]">{label}</p>
      <p className="mt-2 text-lg font-black leading-[1.45]">{value || "غير محدد"}</p>
    </div>
  );
}

export function ProfileSettingsClient(): ReactElement {
  const [data, setData] = useState<MeResponse | null>(null);
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
        const response = await authedFetch("/api/me");

        if (!response.ok) {
          throw new Error("Could not load profile.");
        }

        setData((await response.json()) as MeResponse);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    });

    return () => unsubscribe();
  }, []);

  if (status === "loading") {
    return <Card className="mt-8 h-48 animate-pulse p-5"><span className="sr-only">نحمّل الملف</span></Card>;
  }

  if (status === "signed_out") {
    return (
      <Card className="mt-8 p-6 text-center">
        <h2 className="text-3xl font-black">ادخل عشان تعدل ملفك.</h2>
        <ButtonLink className="mt-6" href="/login">
          ادخل الآن
        </ButtonLink>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card className="mt-8 p-6 text-center">
        <h2 className="text-3xl font-black">ما قدرنا نفتح ملفك.</h2>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">جرب تحديث الصفحة بعد شوي.</p>
      </Card>
    );
  }

  if (!data?.profile) {
    return (
      <Card className="mt-8 p-6 text-center">
        <h2 className="text-3xl font-black">ملفك الذكي ما اكتمل بعد.</h2>
        <p className="arabic-copy mx-auto mt-3 max-w-lg text-[var(--color-ink-muted)]">
          خلّ زبدة تفهم اهتماماتك، منطقتك، وقائمة المتابعة عشان الملخص يصير لك فعلاً.
        </p>
        <ButtonLink className="mt-6" href="/onboarding">
          كمّل الإعداد
        </ButtonLink>
      </Card>
    );
  }

  const { profile } = data;

  return (
    <div className="mt-8 grid gap-5">
      <Card className="p-5 md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-black text-[var(--color-zubda-600)]">ملفك الحالي</p>
            <h2 className="mt-2 text-3xl font-black leading-[1.45]">زبدة تفهم عالمك</h2>
            <p className="arabic-copy mt-3 max-w-2xl text-[var(--color-ink-muted)]">
              هذه البيانات هي اللي تحدد ترتيب الأخبار، طريقة الشرح، والعملة داخل الملخص.
            </p>
          </div>
          <Link
            className="font-bold text-[var(--color-zubda-600)] underline-offset-4 hover:underline"
            href="/onboarding"
          >
            عدّل الإعداد
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="اللغة" value={languageLabels[profile.languageMode ?? ""] ?? profile.languageMode} />
        <Field label="المنطقة" value={profile.region} />
        <Field label="الدور" value={profile.role} />
        <Field label="العملة" value={profile.preferredCurrency} />
        <Field label="عمق الملخص" value={depthLabels[profile.briefDepth ?? ""] ?? profile.briefDepth} />
        <Field label="وقت الوصول" value={profile.deliveryTime} />
      </div>

      <Card className="p-5 md:p-6">
        <h2 className="text-2xl font-black">اهتماماتك</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {(profile.interestModuleIds ?? []).map((interest) => (
            <span
              className="rounded-full bg-[var(--color-zubda-50)] px-4 py-2 text-sm font-black text-[var(--color-zubda-700)]"
              key={interest}
            >
              {interest}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h2 className="text-2xl font-black">قائمة المتابعة</h2>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
          {profile.watchlist?.length ? profile.watchlist.join("، ") : "ما أضفت شيء بعد."}
        </p>
      </Card>
    </div>
  );
}
