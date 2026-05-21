import { verifyFirebaseRequest } from "@/lib/auth/server";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/http";
import { planLimits } from "@/lib/plans";
import { ensureUserFromToken } from "@/lib/users/ensureUser";

export async function GET(request: Request): Promise<Response> {
  const auth = await verifyFirebaseRequest(request);

  if (!auth.ok) {
    const message =
      auth.code === "FIREBASE_NOT_CONFIGURED"
        ? "Firebase Admin is not configured yet."
        : "Missing or invalid Firebase ID token.";

    return jsonError(
      auth.code === "FIREBASE_NOT_CONFIGURED" ? "CONFIGURATION_ERROR" : "UNAUTHORIZED",
      message,
      auth.status
    );
  }

  const db = getAdminDb();
  const userRef = db.collection(collections.users).doc(auth.token.uid);
  await ensureUserFromToken(auth.token);
  const userSnapshot = await userRef.get();
  const userData = (userSnapshot.data() ?? {}) as Record<string, unknown>;
  const user = { id: userSnapshot.id, ...userData };

  let profile = null;
  const primaryProfileId =
    "primaryProfileId" in user && typeof user.primaryProfileId === "string"
      ? user.primaryProfileId
      : null;

  if (primaryProfileId) {
    const profileSnapshot = await db.collection(collections.profiles).doc(primaryProfileId).get();
    profile = profileSnapshot.exists
      ? { id: profileSnapshot.id, ...profileSnapshot.data() }
      : null;
  }

  const plan =
    userData.plan === "pro_monthly" || userData.plan === "founder_lifetime"
      ? userData.plan
      : "free";

  return jsonOk({
    user,
    profile,
    entitlement: {
      plan,
      status:
        typeof userData.entitlementStatus === "string"
          ? userData.entitlementStatus
          : "free",
      limits: planLimits[plan]
    }
  });
}
