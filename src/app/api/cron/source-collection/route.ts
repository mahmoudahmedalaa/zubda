import { jsonError } from "@/lib/http";

export async function POST(): Promise<Response> {
  return jsonError(
    "NOT_IMPLEMENTED",
    "Source collection cron is scheduled for Phase 4 after AI provider adapters are in place.",
    501
  );
}
