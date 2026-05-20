import Stripe from "stripe";
import { serverEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function hasStripeConfig(): boolean {
  return Boolean(serverEnv.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  if (!serverEnv.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is missing.");
  }

  stripeClient ??= new Stripe(serverEnv.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
    typescript: true
  });

  return stripeClient;
}
