import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";

export default function BillingSettingsPage(): ReactElement {
  return (
    <main className="page-shell py-8 text-right">
      <h1 className="text-4xl font-black">الخطة والفوترة</h1>
      <Card className="mt-8 p-5">
        <p className="font-mono text-xs uppercase text-[var(--color-ink-muted)]">Stripe required</p>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
          هذه الصفحة ستعرض plan، entitlementStatus، subscriptionStatus، ورابط Stripe Customer Portal.
        </p>
      </Card>
    </main>
  );
}
