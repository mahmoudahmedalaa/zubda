import { FieldValue } from "firebase-admin/firestore";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";

export type AppEventName =
  | "signup_completed"
  | "login_completed"
  | "onboarding_completed"
  | "checkout_started"
  | "checkout_completed"
  | "checkout_failed"
  | "brief_generated"
  | "brief_opened"
  | "brief_email_sent"
  | "feedback_submitted"
  | "pro_activated"
  | "lifetime_activated";

function withoutUndefined(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

export async function trackServerEvent(
  eventName: AppEventName,
  input: {
    userId?: string | null;
    properties?: Record<string, unknown>;
  } = {}
): Promise<void> {
  if (!hasFirebaseAdminConfig()) {
    return;
  }

  try {
    await getAdminDb().collection(collections.events).add({
      name: eventName,
      userId: input.userId ?? null,
      properties: input.properties ? withoutUndefined(input.properties) : {},
      createdAt: FieldValue.serverTimestamp()
    });
  } catch {
    // Analytics should never block the product path.
  }
}
