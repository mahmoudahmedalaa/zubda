import { jsonError } from "@/lib/http";

export async function POST(): Promise<Response> {
  return jsonError(
    "NOT_IMPLEMENTED",
    "Resend delivery cron is scheduled for Phase 5 after generated briefs exist.",
    501
  );
}
