"use client";

import { useRouter } from "next/navigation";
import { type ReactElement, useEffect, useState } from "react";
import { completeMagicLink, isMagicLink } from "@/lib/auth/client";

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
        router.replace("/onboarding");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "ما قدرنا نكمل الدخول.");
      }
    }

    void finish();
  }, [router]);

  return <p className="arabic-copy mt-4 text-[var(--color-ink-muted)]">{message}</p>;
}

