import type { DecodedIdToken } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";

export type SyncedUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: string;
  entitlementStatus: string;
  role: string;
  primaryProfileId?: string;
  wasCreated: boolean;
};

export async function ensureUserFromToken(token: DecodedIdToken): Promise<SyncedUser> {
  const db = getAdminDb();
  const userRef = db.collection(collections.users).doc(token.uid);
  const snapshot = await userRef.get();
  const existing = snapshot.data();
  const now = FieldValue.serverTimestamp();

  await userRef.set(
    {
      email: token.email ?? existing?.email ?? null,
      displayName: token.name ?? existing?.displayName ?? null,
      photoURL: token.picture ?? existing?.photoURL ?? null,
      plan: existing?.plan ?? "free",
      entitlementStatus: existing?.entitlementStatus ?? "free",
      role: existing?.role ?? "user",
      updatedAt: now,
      ...(snapshot.exists ? {} : { createdAt: now })
    },
    { merge: true }
  );

  const fresh = (await userRef.get()).data() ?? {};

  return {
    id: token.uid,
    email: typeof fresh.email === "string" ? fresh.email : token.email ?? null,
    displayName: typeof fresh.displayName === "string" ? fresh.displayName : token.name ?? null,
    photoURL: typeof fresh.photoURL === "string" ? fresh.photoURL : token.picture ?? null,
    plan: typeof fresh.plan === "string" ? fresh.plan : "free",
    entitlementStatus:
      typeof fresh.entitlementStatus === "string" ? fresh.entitlementStatus : "free",
    role: typeof fresh.role === "string" ? fresh.role : "user",
    ...(typeof fresh.primaryProfileId === "string" ? { primaryProfileId: fresh.primaryProfileId } : {}),
    wasCreated: !snapshot.exists
  };
}
