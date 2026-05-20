import { verifyFirebaseRequest } from "@/lib/auth/server";
import { clientEnv } from "@/lib/env";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/http";
import { checkoutSchema, getCheckoutMode, getStripePriceId } from "@/lib/stripe/prices";
import { getStripe, hasStripeConfig } from "@/lib/stripe/server";

export async function POST(request: Request): Promise<Response> {
  const auth = await verifyFirebaseRequest(request);

  if (!auth.ok) {
    return jsonError(
      auth.code === "FIREBASE_NOT_CONFIGURED" ? "CONFIGURATION_ERROR" : "UNAUTHORIZED",
      auth.code === "FIREBASE_NOT_CONFIGURED"
        ? "Firebase Admin is not configured yet."
        : "Missing or invalid Firebase ID token.",
      auth.status
    );
  }

  if (!hasStripeConfig()) {
    return jsonError("CONFIGURATION_ERROR", "Stripe is not configured yet.", 503);
  }

  const parsed = checkoutSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", "Checkout payload is invalid.", 400);
  }

  const priceId = getStripePriceId(parsed.data.plan, parsed.data.currency);

  if (!priceId) {
    return jsonError("CONFIGURATION_ERROR", "Stripe price ID is missing for this plan/currency.", 503);
  }

  const stripe = getStripe();
  const db = getAdminDb();
  const userRef = db.collection(collections.users).doc(auth.token.uid);
  const userSnapshot = await userRef.get();
  const user = userSnapshot.data();
  let stripeCustomerId =
    typeof user?.stripeCustomerId === "string" ? user.stripeCustomerId : null;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: auth.token.email,
      name: auth.token.name,
      metadata: {
        firebaseUserId: auth.token.uid
      }
    });

    stripeCustomerId = customer.id;
    await userRef.set(
      {
        email: auth.token.email ?? user?.email ?? null,
        displayName: auth.token.name ?? user?.displayName ?? null,
        stripeCustomerId,
        billingCurrency: parsed.data.currency,
        plan: user?.plan ?? "free",
        entitlementStatus: user?.entitlementStatus ?? "free",
        role: user?.role ?? "user",
        updatedAt: new Date(),
        ...(userSnapshot.exists ? {} : { createdAt: new Date() })
      },
      { merge: true }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: getCheckoutMode(parsed.data.plan),
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${clientEnv.NEXT_PUBLIC_APP_URL}/app/settings/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
    metadata: {
      userId: auth.token.uid,
      plan: parsed.data.plan,
      currency: parsed.data.currency
    },
    subscription_data:
      parsed.data.plan === "pro_monthly"
        ? {
            metadata: {
              userId: auth.token.uid,
              plan: parsed.data.plan,
              currency: parsed.data.currency
            }
          }
        : undefined
  });

  return jsonOk({ url: session.url });
}
