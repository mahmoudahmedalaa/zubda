import { jsonError } from "@/lib/http";

export async function POST(): Promise<Response> {
  return jsonError(
    "NOT_IMPLEMENTED",
    "Stripe webhook signature verification and entitlement updates are scheduled for Phase 3.",
    501
  );
}
