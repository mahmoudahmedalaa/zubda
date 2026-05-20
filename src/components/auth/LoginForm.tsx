"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactElement, useState } from "react";
import { sendMagicLink, signInWithGoogle } from "@/lib/auth/client";
import { Button } from "@/components/ui/Button";

export function LoginForm(): ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "google">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setStatus("sending");

    try {
      await sendMagicLink(email);
      setStatus("sent");
    } catch (caughtError) {
      setStatus("idle");
      setError(caughtError instanceof Error ? caughtError.message : "ما قدرنا نرسل الرابط.");
    }
  }

  async function handleGoogle(): Promise<void> {
    setError(null);
    setStatus("google");

    try {
      await signInWithGoogle();
      router.push("/onboarding");
    } catch (caughtError) {
      setStatus("idle");
      setError(caughtError instanceof Error ? caughtError.message : "ما قدرنا ندخلك بجوجل.");
    }
  }

  return (
    <>
      <form className="mt-7 space-y-4" onSubmit={handleMagicLink}>
        <label className="block text-sm font-bold" htmlFor="email">
          البريد الإلكتروني
        </label>
        <input
          className="min-h-12 w-full rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 text-left outline-none focus:border-[var(--color-zubda-500)]"
          dir="ltr"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
        <Button className="w-full" disabled={status === "sending" || status === "google"} type="submit">
          <Mail aria-hidden size={18} />
          {status === "sending" ? "نرسل الرابط..." : "أرسل الرابط"}
        </Button>
      </form>

      {status === "sent" ? (
        <p className="arabic-copy mt-4 rounded-[var(--radius-card)] bg-[var(--color-trust-50)] p-3 text-sm text-[var(--color-trust-700)]">
          أرسلنا الرابط. افتح بريدك وكمل الدخول من نفس الجهاز.
        </p>
      ) : null}

      {error ? (
        <p className="arabic-copy mt-4 rounded-[var(--radius-card)] bg-[var(--color-zubda-50)] p-3 text-sm text-[var(--color-risk)]">
          {error}
        </p>
      ) : null}

      <div className="my-6 h-px bg-[var(--color-line)]" />
      <Button
        className="w-full"
        disabled={status === "sending" || status === "google"}
        onClick={handleGoogle}
        variant="secondary"
      >
        {status === "google" ? "نفتح جوجل..." : "Continue with Google"}
      </Button>
    </>
  );
}

