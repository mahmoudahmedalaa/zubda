import { getBriefForUser } from "@/lib/briefs/firestore";
import { verifyFirebaseRequest } from "@/lib/auth/server";
import { trackServerEvent } from "@/lib/events/server";
import { jsonError, jsonOk } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    briefId: string;
  }>;
};

export async function GET(request: Request, context: RouteContext): Promise<Response> {
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

  const { briefId } = await context.params;
  const brief = await getBriefForUser(auth.token.uid, briefId);

  if (!brief) {
    return jsonError("NOT_FOUND", "Brief was not found for this user.", 404);
  }

  await trackServerEvent("brief_opened", {
    userId: auth.token.uid,
    properties: { briefId: brief.id, dateKey: brief.dateKey, source: "detail" }
  });

  return jsonOk({ brief });
}
