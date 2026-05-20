import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="page-shell grid min-h-[70vh] place-items-center py-12">
        <Card className="w-full max-w-md p-6 text-right">
          <h1 className="text-3xl font-black leading-[1.5]">ادخل بريدك ونرسل لك الرابط.</h1>
          <p className="arabic-copy mt-3 font-medium text-[var(--color-ink-muted)]">
            بدون كلمة مرور، بدون وجع راس.
          </p>
          <LoginForm />
        </Card>
      </main>
    </>
  );
}
