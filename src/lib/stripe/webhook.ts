import type Stripe from "stripe";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { trackServerEvent } from "@/lib/events/server";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";

function timestampFromSeconds(seconds?: number | null): Timestamp | null {
  return typeof seconds === "number" ? Timestamp.fromMillis(seconds * 1000) : null;
}

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription): Timestamp | null {
  const periodEnd = "current_period_end" in subscription ? subscription.current_period_end : null;
  return timestampFromSeconds(typeof periodEnd === "number" ? periodEnd : null);
}

function entitlementFromSubscriptionStatus(status: Stripe.Subscription.Status): "active" | "past_due" | "canceled" {
  if (status === "active" || status === "trialing") {
    return "active";
  }

  if (status === "past_due" || status === "unpaid" || status === "incomplete") {
    return "past_due";
  }

  return "canceled";
}

async function findUserIdByStripeCustomer(stripeCustomerId: string): Promise<string | null> {
  const snapshot = await getAdminDb()
    .collection(collections.users)
    .where("stripeCustomerId", "==", stripeCustomerId)
    .limit(1)
    .get();

  return snapshot.empty ? null : snapshot.docs[0].id;
}

async function findUserIdBySubscription(subscriptionId: string): Promise<string | null> {
  const snapshot = await getAdminDb()
    .collection(collections.users)
    .where("subscriptionId", "==", subscriptionId)
    .limit(1)
    .get();

  return snapshot.empty ? null : snapshot.docs[0].id;
}

function customerIdFrom(value: string | Stripe.Customer | Stripe.DeletedCustomer | null): string | null {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

export async function processStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const plan = session.metadata?.plan;
      const userId = session.metadata?.userId;
      const stripeCustomerId = customerIdFrom(session.customer);

      if (!userId || !stripeCustomerId) {
        return;
      }

      const update =
        plan === "founder_lifetime"
          ? {
              stripeCustomerId,
              plan: "founder_lifetime",
              entitlementStatus: "lifetime",
              lifetimePurchasedAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp()
            }
          : {
              stripeCustomerId,
              plan: "pro_monthly",
              entitlementStatus: "active",
              subscriptionId: session.subscription,
              updatedAt: FieldValue.serverTimestamp()
            };

      await getAdminDb().collection(collections.users).doc(userId).set(update, { merge: true });
      await trackServerEvent("checkout_completed", {
        userId,
        properties: { plan, stripeCustomerId, sessionId: session.id }
      });
      await trackServerEvent(plan === "founder_lifetime" ? "lifetime_activated" : "pro_activated", {
        userId,
        properties: { stripeCustomerId, sessionId: session.id }
      });
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const stripeCustomerId = customerIdFrom(subscription.customer);
      const userId =
        subscription.metadata?.userId ??
        (stripeCustomerId ? await findUserIdByStripeCustomer(stripeCustomerId) : null) ??
        (await findUserIdBySubscription(subscription.id));

      if (!userId || !stripeCustomerId) {
        return;
      }

      await getAdminDb()
        .collection(collections.users)
        .doc(userId)
        .set(
          {
            stripeCustomerId,
            plan: "pro_monthly",
            entitlementStatus: entitlementFromSubscriptionStatus(subscription.status),
            subscriptionStatus: subscription.status,
            subscriptionId: subscription.id,
            currentPeriodEnd: getSubscriptionPeriodEnd(subscription),
            updatedAt: FieldValue.serverTimestamp()
          },
          { merge: true }
        );

      if (subscription.status === "active" || subscription.status === "trialing") {
        await trackServerEvent("pro_activated", {
          userId,
          properties: { stripeCustomerId, subscriptionId: subscription.id, status: subscription.status }
        });
      }
      return;
    }

    case "invoice.payment_succeeded":
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const stripeCustomerId = customerIdFrom(invoice.customer);
      const userId = stripeCustomerId ? await findUserIdByStripeCustomer(stripeCustomerId) : null;

      if (!userId) {
        return;
      }

      await getAdminDb()
        .collection(collections.users)
        .doc(userId)
        .set(
          {
            entitlementStatus: event.type === "invoice.payment_succeeded" ? "active" : "past_due",
            updatedAt: FieldValue.serverTimestamp()
          },
          { merge: true }
        );

      if (event.type === "invoice.payment_failed") {
        await trackServerEvent("checkout_failed", {
          userId,
          properties: { stripeCustomerId, invoiceId: invoice.id }
        });
      }
    }
  }
}
