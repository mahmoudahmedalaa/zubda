"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { type ReactElement, useEffect, useState } from "react";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";
import type { CheckoutCurrency, CheckoutPlan } from "@/lib/stripe/prices";
import { Button } from "@/components/ui/Button";

type CheckoutButtonProps = {
  plan: CheckoutPlan;
  label: string;
  currency: CheckoutCurrency;
  featured?: boolean;
};

export function CheckoutButton({ plan, label, currency, featured = false }: CheckoutButtonProps): ReactElement {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasFirebaseClientConfig()) {
      queueMicrotask(() => {
        setError("Firebase غير مضبوط لهذه البيئة.");
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      setSignedIn(Boolean(user));
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  async function startCheckout(): Promise<void> {
    if (!signedIn) {
      router.push(`/login?plan=${plan}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authedFetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ plan, currency })
      });
      const payload = (await response.json()) as { url?: string; error?: { message?: string } };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error?.message ?? "الدفع غير جاهز الآن.");
      }

      window.location.assign(payload.url);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "الدفع غير جاهز الآن.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <Button
        className="w-full"
        disabled={loading}
        onClick={() => void startCheckout()}
        variant={featured ? "secondary" : "secondary"}
      >
        {loading ? "نفتح الدفع..." : label}
      </Button>
      {error ? <p className="arabic-copy text-sm text-[var(--color-risk)]">{error}</p> : null}
    </div>
  );
}
