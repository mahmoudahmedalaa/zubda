"use client";

import { onAuthStateChanged } from "firebase/auth";
import { type ReactElement, useEffect, useState } from "react";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";
import { PortalButton } from "@/components/billing/PortalButton";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type BillingUser = {
  plan?: string;
  entitlementStatus?: string;
  subscriptionStatus?: string;
  billingCurrency?: string;
  currentPeriodEnd?: unknown;
};

type MeResponse = {
  user: BillingUser;
  entitlement: {
    plan: string;
    status: string;
  };
};

const planLabels: Record<string, string> = {
  free: "مجاني",
  pro_monthly: "برو شهري",
  founder_lifetime: "المؤسس مدى الحياة"
};

const statusLabels: Record<string, string> = {
  free: "مجاني",
  active: "مفعّل",
  lifetime: "مدى الحياة",
  past_due: "الدفع يحتاج متابعة",
  canceled: "ملغي"
};

export function BillingSettingsClient(): ReactElement {
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
          throw new Error("Could not load billing.");
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
    return <Card className="mt-8 h-44 animate-pulse p-5"><span className="sr-only">نحمّل الفوترة</span></Card>;
  }

  if (status === "signed_out") {
    return (
      <Card className="mt-8 p-6 text-center">
        <h2 className="text-3xl font-black">ادخل عشان تشوف خطتك.</h2>
        <ButtonLink className="mt-6" href="/login">
          ادخل الآن
        </ButtonLink>
      </Card>
    );
  }

  if (status === "error" || !data) {
    return (
      <Card className="mt-8 p-6 text-center">
        <h2 className="text-3xl font-black">ما قدرنا نفتح الفوترة.</h2>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">جرب تحديث الصفحة بعد شوي.</p>
      </Card>
    );
  }

  const plan = data.entitlement.plan;
  const entitlementStatus = data.entitlement.status;

  return (
    <div className="mt-8 grid gap-5">
      <Card className="p-5 md:p-6">
        <p className="text-sm font-black text-[var(--color-zubda-600)]">الخطة الحالية</p>
        <h2 className="mt-2 text-3xl font-black leading-[1.45]">
          {planLabels[plan] ?? planLabels.free}
        </h2>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
          الحالة: {statusLabels[entitlementStatus] ?? entitlementStatus}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {plan === "free" ? (
            <ButtonLink href="/pricing">شوف خطط برو</ButtonLink>
          ) : (
            <PortalButton />
          )}
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h2 className="text-2xl font-black">تفاصيل الدفع</h2>
        <div className="mt-4 grid gap-3 text-sm font-bold text-[var(--color-ink-muted)] md:grid-cols-2">
          <p>حالة الاشتراك: {data.user.subscriptionStatus ?? "غير موجود"}</p>
          <p>عملة الفوترة: {data.user.billingCurrency ?? "غير محددة"}</p>
        </div>
      </Card>
    </div>
  );
}
