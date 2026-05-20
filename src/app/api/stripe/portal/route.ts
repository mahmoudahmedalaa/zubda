import { verifyFirebaseRequest } from "@/lib/auth/server";
import { clientEnv } from "@/lib/env";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/http";
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

  const userSnapshot = await getAdminDb().collection(collections.users).doc(auth.token.uid).get();
  const stripeCustomerId = userSnapshot.data()?.stripeCustomerId;

  if (typeof stripeCustomerId !== "string") {
    return jsonError("VALIDATION_ERROR", "No Stripe customer exists for this user.", 400);
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_APP_URL}/app/settings/billing`
  });

  return jsonOk({ url: session.url });
}

