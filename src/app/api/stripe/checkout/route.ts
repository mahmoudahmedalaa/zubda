import { jsonError } from "@/lib/http";

export async function POST(): Promise<Response> {
  return jsonError(
    "NOT_IMPLEMENTED",
    "Stripe Checkout will be implemented after Firebase auth and Stripe products are configured.",
    501
  );
}
