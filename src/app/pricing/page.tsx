import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const plans = [
  {
    name: "Free",
    title: "زبدة يومية بسيطة",
    price: "$0",
    cta: "ابدأ مجانًا",
    href: "/login?plan=free",
    features: ["1 daily brief", "Up to 3 interests", "Limited archive", "Source links"]
  },
  {
    name: "Pro Monthly",
    title: "زبدة أعمق ومخصصة أكثر",
    price: "$7.99 / AED 29 / SAR 29",
    cta: "جرّب Pro",
    href: "/login?plan=pro_monthly",
    featured: true,
    features: ["Full personalization", "Larger watchlist", "Full archive", "Currency conversion"]
  },
  {
    name: "Founder Lifetime",
    title: "ادفع مرة وخلك من أوائل المؤسسين",
    price: "$99 / AED 399 / SAR 399",
    cta: "انضم للمؤسسين",
    href: "/login?plan=founder_lifetime",
    features: ["Pro forever", "Limited founder offer", "Lifetime archive", "Early supporter status"]
  }
];

export default function PricingPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="page-shell py-12 text-right">
        <h1 className="text-4xl font-black">اختر الزبدة اللي تناسبك</h1>
        <p className="arabic-copy mt-4 max-w-2xl text-[var(--color-ink-muted)]">
          الدفع في Zubda حقيقي من اليوم الأول: Stripe Checkout، اشتراك شهري، وخطة مؤسس
          Lifetime.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              className={`flex flex-col p-6 ${
                plan.featured ? "border-[var(--color-zubda-500)] bg-[var(--color-zubda-50)]" : ""
              }`}
              key={plan.name}
            >
              <p className="font-mono text-xs uppercase text-[var(--color-ink-muted)]">
                {plan.name}
              </p>
              <h2 className="mt-3 min-h-16 text-2xl font-black">{plan.title}</h2>
              <p className="tabular mt-4 text-2xl font-bold">{plan.price}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-[var(--color-ink-muted)]">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <ButtonLink className="mt-6 w-full" href={plan.href}>
                {plan.cta}
              </ButtonLink>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
