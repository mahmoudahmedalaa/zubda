import { verifyFirebaseRequest } from "@/lib/auth/server";
import { trackServerEvent } from "@/lib/events/server";
import { jsonError, jsonOk } from "@/lib/http";
import { ensureUserFromToken } from "@/lib/users/ensureUser";

export async function POST(request: Request): Promise<Response> {
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

  const user = await ensureUserFromToken(auth.token);
  await trackServerEvent(user.wasCreated ? "signup_completed" : "login_completed", {
    userId: user.id,
    properties: { provider: auth.token.firebase?.sign_in_provider ?? "unknown" }
  });

  return jsonOk({ user });
}
