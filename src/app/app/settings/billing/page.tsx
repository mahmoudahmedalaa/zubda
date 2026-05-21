import type { ReactElement } from "react";
import { BillingSettingsClient } from "@/components/settings/BillingSettingsClient";

export default function BillingSettingsPage(): ReactElement {
  return (
    <main className="page-shell py-8 text-right">
      <h1 className="text-4xl font-black leading-[1.45]">الخطة والفوترة</h1>
      <p className="arabic-copy mt-3 max-w-2xl text-[var(--color-ink-muted)]">
        تابع خطتك الحالية، حالة التفعيل، وإدارة الدفع من مكان واحد
      </p>
      <BillingSettingsClient />
    </main>
  );
}
