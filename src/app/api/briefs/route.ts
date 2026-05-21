import { listBriefsForUser } from "@/lib/briefs/firestore";
import { verifyFirebaseRequest } from "@/lib/auth/server";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/http";
import { effectivePlanForEntitlement, planLimits } from "@/lib/plans";

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

  const userSnapshot = await getAdminDb().collection(collections.users).doc(auth.token.uid).get();
  const userData = userSnapshot.data() ?? {};
  const effectivePlan = effectivePlanForEntitlement(userData.plan, userData.entitlementStatus);
  const briefs = await listBriefsForUser(auth.token.uid, {
    archiveDays: planLimits[effectivePlan].archiveDays,
    limit: effectivePlan === "free" ? 10 : 50
  });
  return jsonOk({ briefs });
}
