import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const plans = [
  {
    name: "مجاني",
    title: "زبدة يومية بسيطة",
    price: "$0",
    cta: "ابدأ مجانًا",
    href: "/login?plan=free",
    checkoutPlan: null,
    features: ["ملخص يومي واحد", "حتى ٣ اهتمامات", "أرشيف محدود", "مصادر واضحة"]
  },
  {
    name: "برو شهري",
    title: "زبدة أعمق ومخصصة أكثر",
    price: "$7.99 / 29 درهم / 29 ريال",
    cta: "جرّب Pro",
    href: "/login?plan=pro_monthly",
    checkoutPlan: "pro_monthly",
    featured: true,
    features: ["تخصيص كامل", "قائمة متابعة أكبر", "أرشيف كامل", "تحويل العملات داخل الملخص"]
  },
  {
    name: "المؤسس",
    title: "ادفع مرة وخلك من أوائل المؤسسين",
    price: "$99 / 399 درهم / 399 ريال",
    cta: "انضم للمؤسسين",
    href: "/login?plan=founder_lifetime",
    checkoutPlan: "founder_lifetime",
    features: ["برو مدى الحياة", "عرض محدود", "أرشيف كامل", "شارة داعم مبكر"]
  }
] as const;

export default function PricingPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="page-shell py-12 text-right">
        <h1 className="text-4xl font-black leading-[1.45]">اختر الخطة اللي تناسبك</h1>
        <p className="arabic-copy mt-4 max-w-2xl font-medium text-[var(--color-ink-muted)]">
          ابدأ مجانًا، وإذا صارت زبدة جزء من صباحك فعّل برو أو خطة المؤسس.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              className={`flex flex-col p-6 ${
                "featured" in plan && plan.featured
                  ? "border-[var(--color-zubda-500)] bg-[var(--color-zubda-50)]"
                  : ""
              }`}
              key={plan.name}
            >
              <p className="text-sm font-bold text-[var(--color-zubda-600)]">
                {plan.name}
              </p>
              <h2 className="mt-3 min-h-16 text-2xl font-black leading-[1.45]">{plan.title}</h2>
              <p className="tabular mt-4 text-xl font-black">{plan.price}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm font-medium text-[var(--color-ink-muted)]">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {plan.checkoutPlan ? (
                <CheckoutButton
                  featured={"featured" in plan && plan.featured}
                  label={plan.cta}
                  plan={plan.checkoutPlan}
                />
              ) : (
                <ButtonLink className="mt-6 w-full" href={plan.href}>
                  {plan.cta}
                </ButtonLink>
              )}
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
