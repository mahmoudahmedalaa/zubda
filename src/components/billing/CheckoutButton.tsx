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
  featured?: boolean;
};

const currencies: CheckoutCurrency[] = ["USD", "AED", "SAR"];
const currencyLabels: Record<CheckoutCurrency, string> = {
  USD: "دولار",
  AED: "درهم",
  SAR: "ريال"
};

export function CheckoutButton({ plan, label, featured = false }: CheckoutButtonProps): ReactElement {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [currency, setCurrency] = useState<CheckoutCurrency>("USD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasFirebaseClientConfig()) {
      queueMicrotask(() => {
        setAuthReady(true);
        setError("Firebase غير مضبوط لهذه البيئة.");
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      setAuthReady(true);
      setSignedIn(Boolean(user));
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
        throw new Error(payload.error?.message ?? "Stripe Checkout is not ready yet.");
      }

      window.location.assign(payload.url);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Stripe Checkout is not ready yet.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {currencies.map((option) => (
          <button
            className={`rounded-[var(--radius-card)] border px-3 py-2 text-xs font-bold transition ${
              currency === option
                ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-muted)]"
            }`}
            key={option}
            onClick={() => setCurrency(option)}
            type="button"
          >
            {currencyLabels[option]}
          </button>
        ))}
      </div>
      <Button
        className="w-full"
        disabled={!authReady || loading}
        onClick={() => void startCheckout()}
        variant={featured ? "primary" : "secondary"}
      >
        {loading ? "نفتح Checkout..." : label}
      </Button>
      {error ? <p className="arabic-copy text-sm text-[var(--color-risk)]">{error}</p> : null}
    </div>
  );
}
