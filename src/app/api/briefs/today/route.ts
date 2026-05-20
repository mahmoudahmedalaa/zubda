import { buildStructuredBrief, sourceStorySeeds } from "@/lib/briefs/sample";
import { getLatestBriefForUser } from "@/lib/briefs/firestore";
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

  const brief = await getLatestBriefForUser(auth.token.uid);

  if (brief) {
    return jsonOk({ brief });
  }

  return jsonOk({
    brief: {
      id: "sample",
      dateKey: new Date().toISOString().slice(0, 10),
      status: "sample",
      structuredBrief: buildStructuredBrief(
        {
          languageMode: "mixed",
          region: "UAE",
          role: "مستشار",
          mainGoals: ["أكون مطّلع قبل الدوام"],
          interestModuleIds: ["المال والاستثمار", "الذكاء الاصطناعي والتقنية", "أعمال الخليج"],
          watchlist: ["Nvidia"],
          preferredCurrency: "AED",
          briefDepth: "standard",
          deliveryTime: "07:30",
          timezone: "Asia/Dubai"
        },
        sourceStorySeeds
      )
    }
  });
}

