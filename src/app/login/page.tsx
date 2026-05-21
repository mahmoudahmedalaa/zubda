import type { ReactElement } from "react";
import { Suspense } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="page-shell grid min-h-[70vh] place-items-center py-12">
        <Card className="w-full max-w-md p-6 text-right">
          <h1 className="text-3xl font-black leading-[1.5]">ادخل على زبدة</h1>
          <p className="arabic-copy mt-3 font-medium text-[var(--color-ink-muted)]">
            استخدم الإيميل وكلمة المرور، أو ادخل بسرعة بحساب Google
          </p>
          <Suspense fallback={<p className="mt-6 text-sm font-bold text-[var(--color-ink-muted)]">نجهز الدخول...</p>}>
            <LoginForm />
          </Suspense>
        </Card>
      </main>
    </>
  );
}
