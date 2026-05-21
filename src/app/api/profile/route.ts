import { FieldValue } from "firebase-admin/firestore";
import { verifyFirebaseRequest } from "@/lib/auth/server";
import { collections } from "@/lib/firebase/collections";
import { trackServerEvent } from "@/lib/events/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/http";
import { normalizeWatchlist, profilePayloadSchema } from "@/lib/profile/schema";
import { effectivePlanForEntitlement, planLimits } from "@/lib/plans";

function authErrorResponse(code: string, status: 401 | 503): Response {
  return jsonError(
    code === "FIREBASE_NOT_CONFIGURED" ? "CONFIGURATION_ERROR" : "UNAUTHORIZED",
    code === "FIREBASE_NOT_CONFIGURED"
      ? "Firebase Admin is not configured yet."
      : "Missing or invalid Firebase ID token.",
    status
  );
}

export async function PATCH(request: Request): Promise<Response> {
  const auth = await verifyFirebaseRequest(request);

  if (!auth.ok) {
    return authErrorResponse(auth.code, auth.status);
  }

  const parsed = profilePayloadSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", "Profile payload is invalid.", 400);
  }

  const db = getAdminDb();
  const userRef = db.collection(collections.users).doc(auth.token.uid);
  const userSnapshot = await userRef.get();
  const userData = userSnapshot.data();
  const plan = effectivePlanForEntitlement(userData?.plan, userData?.entitlementStatus);
  const limits = planLimits[plan] ?? planLimits.free;
  const watchlist = normalizeWatchlist(parsed.data.watchlist);
  const sourcePreferences = normalizeWatchlist(parsed.data.sourcePreferences);
  const avoidTopics = normalizeWatchlist(parsed.data.avoidTopics);

  if (parsed.data.interestModuleIds.length > limits.maxInterestModules) {
    return jsonError(
      "VALIDATION_ERROR",
      `Your current plan supports up to ${limits.maxInterestModules} interest modules.`,
      400
    );
  }

  if (watchlist.length > limits.maxWatchlistItems) {
    return jsonError(
      "VALIDATION_ERROR",
      `Your current plan supports up to ${limits.maxWatchlistItems} watchlist items.`,
      400
    );
  }

  if (!limits.sourcePreferences && sourcePreferences.length > 0) {
    return jsonError("FORBIDDEN", "Source preferences are available on Pro.", 402);
  }

  if (!limits.customDeliveryTime && parsed.data.deliveryTime !== "07:30") {
    return jsonError("FORBIDDEN", "Custom delivery time is available on Pro.", 402);
  }

  const hasExistingProfile = typeof userData?.primaryProfileId === "string";
  const profileId = hasExistingProfile
    ? userData.primaryProfileId
    : db.collection(collections.profiles).doc().id;
  const profileRef = db.collection(collections.profiles).doc(profileId);
  const now = FieldValue.serverTimestamp();

  await db.runTransaction(async (transaction) => {
    transaction.set(
      profileRef,
      {
        ...parsed.data,
        watchlist,
        sourcePreferences,
        avoidTopics,
        name: "Primary profile",
        userId: auth.token.uid,
        isPrimary: true,
        updatedAt: now,
        ...(hasExistingProfile ? {} : { createdAt: now })
      },
      { merge: true }
    );

    transaction.set(
      userRef,
      {
        email: auth.token.email ?? userData?.email ?? null,
        displayName: auth.token.name ?? userData?.displayName ?? null,
        photoURL: auth.token.picture ?? userData?.photoURL ?? null,
        primaryProfileId: profileId,
        plan: userData?.plan ?? "free",
        entitlementStatus: userData?.entitlementStatus ?? "free",
        role: userData?.role ?? "user",
        updatedAt: now,
        ...(userSnapshot.exists ? {} : { createdAt: now })
      },
      { merge: true }
    );
  });

  await trackServerEvent("onboarding_completed", {
    userId: auth.token.uid,
    properties: {
      plan,
      region: parsed.data.region,
      role: parsed.data.role,
      interests: parsed.data.interestModuleIds.length,
      watchlist: watchlist.length,
      communicationStyle: parsed.data.communicationStyle,
      hasPersonalContext: parsed.data.personalContext.length > 0
    }
  });

  return jsonOk({
    profile: {
      id: profileId,
      ...parsed.data,
      watchlist,
      sourcePreferences,
      avoidTopics
    }
  });
}
