import { z } from "zod";
import { serverEnv } from "@/lib/env";

export const checkoutSchema = z.object({
  plan: z.enum(["pro_monthly", "founder_lifetime"]),
  currency: z.enum(["USD", "AED", "SAR"]).default("USD")
});

export type CheckoutPlan = z.infer<typeof checkoutSchema>["plan"];
export type CheckoutCurrency = z.infer<typeof checkoutSchema>["currency"];

const priceMap: Record<CheckoutPlan, Partial<Record<CheckoutCurrency, string | undefined>>> = {
  pro_monthly: {
    USD: serverEnv.STRIPE_PRICE_PRO_MONTHLY_USD,
    AED: serverEnv.STRIPE_PRICE_PRO_MONTHLY_AED,
    SAR: serverEnv.STRIPE_PRICE_PRO_MONTHLY_SAR
  },
  founder_lifetime: {
    USD: serverEnv.STRIPE_PRICE_FOUNDER_LIFETIME_USD,
    AED: serverEnv.STRIPE_PRICE_FOUNDER_LIFETIME_AED,
    SAR: serverEnv.STRIPE_PRICE_FOUNDER_LIFETIME_SAR
  }
};

export function getStripePriceId(plan: CheckoutPlan, currency: CheckoutCurrency): string | null {
  return priceMap[plan][currency] ?? null;
}

export function getCheckoutMode(plan: CheckoutPlan): "payment" | "subscription" {
  return plan === "pro_monthly" ? "subscription" : "payment";
}

