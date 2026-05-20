import type { DecodedIdToken } from "firebase-admin/auth";
import { getAdminAuth, hasFirebaseAdminConfig } from "@/lib/firebase/admin";

export type AuthResult =
  | { ok: true; token: DecodedIdToken }
  | { ok: false; status: 401 | 503; code: "MISSING_TOKEN" | "INVALID_TOKEN" | "FIREBASE_NOT_CONFIGURED" };

export function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export async function verifyFirebaseRequest(request: Request): Promise<AuthResult> {
  const token = getBearerToken(request);

  if (!token) {
    return { ok: false, status: 401, code: "MISSING_TOKEN" };
  }

  if (!hasFirebaseAdminConfig()) {
    return { ok: false, status: 503, code: "FIREBASE_NOT_CONFIGURED" };
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return { ok: true, token: decoded };
  } catch {
    return { ok: false, status: 401, code: "INVALID_TOKEN" };
  }
}

