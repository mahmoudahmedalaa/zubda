import { listBriefsForUser } from "@/lib/briefs/firestore";
import { verifyFirebaseRequest } from "@/lib/auth/server";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(request: Request): Promise<Response> {
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

  const briefs = await listBriefsForUser(auth.token.uid);
  return jsonOk({ briefs });
}

