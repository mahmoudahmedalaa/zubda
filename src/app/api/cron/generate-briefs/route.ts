import { jsonError } from "@/lib/http";

export async function POST(): Promise<Response> {
  return jsonError(
    "NOT_IMPLEMENTED",
    "Brief generation cron is scheduled for Phase 4 after source story normalization.",
    501
  );
}
