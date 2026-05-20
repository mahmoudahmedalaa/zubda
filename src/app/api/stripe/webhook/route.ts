import { FieldValue } from "firebase-admin/firestore";
import { serverEnv } from "@/lib/env";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/http";
import { getStripe, hasStripeConfig } from "@/lib/stripe/server";
import { processStripeEvent } from "@/lib/stripe/webhook";

export async function POST(request: Request): Promise<Response> {
  if (!hasStripeConfig() || !serverEnv.STRIPE_WEBHOOK_SECRET) {
    return jsonError("CONFIGURATION_ERROR", "Stripe webhook is not configured yet.", 503);
  }

  if (!hasFirebaseAdminConfig()) {
    return jsonError("CONFIGURATION_ERROR", "Firebase Admin is not configured yet.", 503);
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return jsonError("VALIDATION_ERROR", "Missing Stripe signature.", 400);
  }

  const rawBody = await request.text();
  const stripe = getStripe();
  const db = getAdminDb();

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      serverEnv.STRIPE_WEBHOOK_SECRET
    );
    const eventRef = db.collection(collections.stripeEvents).doc(event.id);
    const eventSnapshot = await eventRef.get();

    if (eventSnapshot.exists && eventSnapshot.data()?.processed === true) {
      return jsonOk({ received: true, duplicate: true });
    }

    await eventRef.set(
      {
        eventId: event.id,
        type: event.type,
        processed: false,
        payload: JSON.parse(JSON.stringify(event)),
        receivedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    await processStripeEvent(event);

    await eventRef.set(
      {
        processed: true,
        processedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    return jsonOk({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe webhook failed.";
    return jsonError("VALIDATION_ERROR", message, 400);
  }
}
