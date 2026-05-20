import { serverEnv } from "@/lib/env";
import { jsonError } from "@/lib/http";

export function verifyCronRequest(request: Request): Response | null {
  if (!serverEnv.CRON_SECRET) {
    return null;
  }

  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (token !== serverEnv.CRON_SECRET) {
    return jsonError("UNAUTHORIZED", "Invalid cron token.", 401);
  }

  return null;
}

