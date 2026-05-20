"use client";

import { type ReactElement, useState } from "react";
import { authedFetch } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";

export function PortalButton(): ReactElement {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const response = await authedFetch("/api/stripe/portal", { method: "POST" });
      const payload = (await response.json()) as { url?: string; error?: { message?: string } };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error?.message ?? "Billing portal is not ready yet.");
      }

      window.location.assign(payload.url);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Billing portal is not ready yet.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-5">
      <Button disabled={loading} onClick={() => void openPortal()} variant="secondary">
        {loading ? "نفتح الفوترة..." : "إدارة الفوترة في Stripe"}
      </Button>
      {error ? <p className="arabic-copy mt-3 text-sm text-[var(--color-risk)]">{error}</p> : null}
    </div>
  );
}

