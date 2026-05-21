"use client";

import { Check, ChevronDown } from "lucide-react";
import { type ReactElement, useState } from "react";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CheckoutCurrency, CheckoutPlan } from "@/lib/stripe/prices";

type Plan = {
  key: "free" | CheckoutPlan;
  name: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  checkoutPlan: CheckoutPlan | null;
  featured?: boolean;
  features: string[];
  prices: Record<CheckoutCurrency, string>;
};

const currencyLabels: Record<CheckoutCurrency, string> = {
  USD: "USD",
  AED: "AED",
  SAR: "SAR"
};

const plans: Plan[] = [
  {
    key: "free",
    name: "مجاني",
    title: "ابدأ بالأساسيات",
    description: "ملخص يومي خفيف لتجربة الفكرة",
    cta: "ابدأ مجاناً",
    href: "/login?plan=free",
    checkoutPlan: null,
    prices: { USD: "$0", AED: "0 درهم", SAR: "0 ريال" },
    features: ["ملخص يومي واحد", "موضوعان فقط", "أرشيف قصير", "مصادر واضحة"]
  },
  {
    key: "pro_monthly",
    name: "برو",
    title: "زبدة أعمق على وقتك",
    description: "للي يبغى تخصيص أقوى وقائمة متابعة أكبر",
    cta: "اشترك في برو",
    href: "/login?plan=pro_monthly",
    checkoutPlan: "pro_monthly",
    featured: true,
    prices: { USD: "$7.99 / شهر", AED: "29 درهم / شهر", SAR: "30 ريال / شهر" },
    features: ["اهتمامات أكثر", "قائمة متابعة أكبر", "أرشيف كامل", "تحويل العملات داخل الملخص"]
  },
  {
    key: "founder_lifetime",
    name: "المؤسس",
    title: "ادفع مرة وخلاص",
    description: "عرض مبكر لمن يريد برو مدى الحياة",
    cta: "خذ العرض مدى الحياة",
    href: "/login?plan=founder_lifetime",
    checkoutPlan: "founder_lifetime",
    prices: { USD: "$99 مرة واحدة", AED: "399 درهم مرة واحدة", SAR: "379 ريال مرة واحدة" },
    features: ["برو مدى الحياة", "عرض محدود", "أرشيف كامل", "أولوية في الميزات الجديدة"]
  }
];

export function PricingClient(): ReactElement {
  const [currency, setCurrency] = useState<CheckoutCurrency>("USD");

  return (
    <>
      <section className="page-shell py-12 text-right lg:py-14">
        <div className="max-w-3xl">
          <h1 className="max-w-3xl text-5xl font-black leading-[1.35] tracking-[-0.04em] md:text-6xl">
            اختر الخطة اللي تناسب استخدامك
          </h1>
          <p className="arabic-copy mt-5 max-w-2xl text-lg font-semibold text-[var(--color-ink-muted)]">
            ابدأ مجاناً، وإذا صارت زبدة جزء من روتينك فعّل برو
          </p>
          <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-white p-2 shadow-[var(--shadow-card)]">
            <label className="pr-4 text-sm font-black text-[var(--color-ink-muted)]" htmlFor="pricing-currency">
              العملة
            </label>
            <div className="relative">
              <select
                className="min-h-11 appearance-none rounded-full bg-[var(--color-zubda-50)] py-2 pl-10 pr-5 text-sm font-black text-[var(--color-zubda-700)] outline-none transition hover:bg-[var(--color-zubda-100)] focus:bg-[var(--color-zubda-100)]"
                id="pricing-currency"
                value={currency}
                onChange={(event) => setCurrency(event.target.value as CheckoutCurrency)}
              >
                {Object.entries(currencyLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-zubda-500)]"
                size={16}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell pb-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              className={`group relative flex min-h-[520px] flex-col overflow-hidden p-7 transition duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? "border-[var(--color-zubda-500)] bg-white shadow-[0_22px_60px_rgb(72_87_252/0.14)]"
                  : ""
              }`}
              key={plan.key}
            >
              {plan.featured ? (
                <div className="absolute left-6 top-6 rounded-full bg-[var(--color-zubda-500)] px-4 py-2 text-xs font-black text-white">
                  الأنسب للبداية
                </div>
              ) : null}
              <p className="text-lg font-black text-[var(--color-zubda-600)]">{plan.name}</p>
              <h2 className="mt-5 text-3xl font-black leading-[1.35]">{plan.title}</h2>
              <p className="arabic-copy mt-3 min-h-16 text-sm font-semibold text-[var(--color-ink-muted)]">
                {plan.description}
              </p>
              <p className="tabular mt-7 text-3xl font-black leading-[1.2]">{plan.prices[currency]}</p>
              <div className="mt-8 grid gap-3">
                {plan.features.map((feature) => (
                  <div className="flex items-center gap-3 text-sm font-bold text-[var(--color-ink-muted)]" key={feature}>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[var(--color-trust-500)]">
                      <Check aria-hidden size={15} strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-8">
                {plan.checkoutPlan ? (
                  <CheckoutButton
                    currency={currency}
                    featured={plan.featured}
                    label={plan.cta}
                    plan={plan.checkoutPlan}
                  />
                ) : (
                  <ButtonLink className="w-full" href={plan.href} variant="secondary">
                    {plan.cta}
                  </ButtonLink>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
