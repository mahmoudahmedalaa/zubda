"use client";

import { Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, type ReactElement, useState } from "react";
import {
  createAccountWithEmailPassword,
  signInWithEmailPassword,
  signInWithGoogle
} from "@/lib/auth/client";
import { Button } from "@/components/ui/Button";

export function LoginForm(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/onboarding";
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "email" | "google">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setStatus("email");

    try {
      if (mode === "signup") {
        await createAccountWithEmailPassword(email, password);
      } else {
        await signInWithEmailPassword(email, password);
      }

      router.push(nextPath);
    } catch (caughtError) {
      setStatus("idle");
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : mode === "signup"
            ? "ما قدرنا ننشئ الحساب"
            : "ما قدرنا ندخلك"
      );
    }
  }

  async function handleGoogle(): Promise<void> {
    setError(null);
    setStatus("google");

    try {
      await signInWithGoogle();
      router.push(nextPath);
    } catch (caughtError) {
      setStatus("idle");
      setError(caughtError instanceof Error ? caughtError.message : "ما قدرنا ندخلك بجوجل");
    }
  }

  return (
    <>
      <div className="mt-7 grid grid-cols-2 rounded-full bg-[var(--color-paper)] p-1">
        {[
          ["login", "دخول"],
          ["signup", "حساب جديد"]
        ].map(([value, label]) => (
          <button
            className={`min-h-11 rounded-full text-sm font-black transition ${
              mode === value
                ? "bg-white text-[var(--color-zubda-600)] shadow-sm"
                : "text-[var(--color-ink-muted)]"
            }`}
            key={value}
            onClick={() => setMode(value as "login" | "signup")}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleEmailAuth}>
        <label className="block text-sm font-bold" htmlFor="email">
          الإيميل
        </label>
        <div className="relative">
          <Mail
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
            size={18}
          />
          <input
            className="min-h-12 w-full rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 pl-11 text-left outline-none focus:border-[var(--color-zubda-500)]"
            dir="ltr"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </div>

        <label className="block text-sm font-bold" htmlFor="password">
          كلمة المرور
        </label>
        <div className="relative">
          <Lock
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
            size={18}
          />
          <input
            className="min-h-12 w-full rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 pl-11 text-left outline-none focus:border-[var(--color-zubda-500)]"
            dir="ltr"
            id="password"
            minLength={6}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            type="password"
            value={password}
          />
        </div>

        <Button className="w-full" disabled={status !== "idle"} type="submit">
          {status === "email" ? "لحظة..." : mode === "signup" ? "أنشئ حسابك" : "ادخل"}
        </Button>
      </form>

      {error ? (
        <p className="arabic-copy mt-4 rounded-[var(--radius-card)] bg-[var(--color-zubda-50)] p-3 text-sm text-[var(--color-risk)]">
          {error}
        </p>
      ) : null}

      <div className="my-6 flex items-center gap-3 text-xs font-bold text-[var(--color-ink-muted)]">
        <span className="h-px flex-1 bg-[var(--color-line)]" />
        أو
        <span className="h-px flex-1 bg-[var(--color-line)]" />
      </div>

      <Button
        className="w-full"
        disabled={status !== "idle"}
        onClick={handleGoogle}
        variant="secondary"
      >
        <span className="latin text-lg font-black" aria-hidden>
          G
        </span>
        {status === "google" ? "نفتح جوجل..." : "الدخول بحساب Google"}
      </Button>
    </>
  );
}
