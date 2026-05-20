import { verifyFirebaseRequest } from "@/lib/auth/server";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/http";
import { planLimits } from "@/lib/plans";

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
  const userSnapshot = await userRef.get();
  const user = userSnapshot.exists
    ? { id: userSnapshot.id, ...userSnapshot.data() }
    : {
        id: auth.token.uid,
        email: auth.token.email ?? null,
        displayName: auth.token.name ?? null,
        plan: "free",
        entitlementStatus: "free"
      };

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

  const plan = user.plan === "pro_monthly" || user.plan === "founder_lifetime" ? user.plan : "free";

  return jsonOk({
    user,
    profile,
    entitlement: {
      plan,
      status:
        "entitlementStatus" in user && typeof user.entitlementStatus === "string"
          ? user.entitlementStatus
          : "free",
      limits: planLimits[plan]
    }
  });
}
