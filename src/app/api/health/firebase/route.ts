import { clientEnv } from "@/lib/env";
import { hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { jsonOk } from "@/lib/http";

export function GET(): Response {
  return jsonOk({
    clientConfigured: Boolean(clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    adminConfigured: hasFirebaseAdminConfig(),
    projectId:
      clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
      process.env.FIREBASE_PROJECT_ID ??
      null
  });
}

