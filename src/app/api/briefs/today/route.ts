import { buildStructuredBrief, sourceStorySeeds } from "@/lib/briefs/sample";
import { getLatestBriefForUser } from "@/lib/briefs/firestore";
import { verifyFirebaseRequest } from "@/lib/auth/server";
import { trackServerEvent } from "@/lib/events/server";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/http";
import { profilePayloadSchema, type ProfilePayload } from "@/lib/profile/schema";
import { ensureUserFromToken } from "@/lib/users/ensureUser";

const defaultSampleProfile: ProfilePayload = {
  languageMode: "mixed",
  region: "UAE",
  role: "مستثمر",
  mainGoals: ["أتابع السوق والاستثمار"],
  interestModuleIds: ["المال والاستثمار", "الذكاء الاصطناعي والتقنية", "أعمال الخليج"],
  watchlist: ["أسواق الخليج", "النفط", "الذكاء الاصطناعي"],
  communicationStyle: "مختصر ومباشر",
  personalContext: "مستثمر يتابع الأسواق الخليجية والتقنية ويحب الملخصات العملية قبل بداية اليوم",
  briefDepth: "standard",
  deliveryTime: "07:30",
  timezone: "Asia/Dubai"
};

async function getPrimaryProfile(primaryProfileId?: string): Promise<ProfilePayload> {
  if (!primaryProfileId) {
    return defaultSampleProfile;
  }

  const profileSnapshot = await getAdminDb().collection(collections.profiles).doc(primaryProfileId).get();
  const parsed = profilePayloadSchema.safeParse(profileSnapshot.data());

  return parsed.success ? parsed.data : defaultSampleProfile;
}

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

  const user = await ensureUserFromToken(auth.token);
  const profile = await getPrimaryProfile(user.primaryProfileId);
  let brief = null;

  try {
    brief = await getLatestBriefForUser(auth.token.uid);
  } catch {
    brief = null;
  }

  if (brief) {
    await trackServerEvent("brief_opened", {
      userId: auth.token.uid,
      properties: { briefId: brief.id, dateKey: brief.dateKey, source: "today" }
    });
    return jsonOk({ brief });
  }

  const sampleBrief = {
    id: "sample",
    dateKey: new Date().toISOString().slice(0, 10),
    status: "sample",
    structuredBrief: buildStructuredBrief(profile, sourceStorySeeds)
  };

  await trackServerEvent("brief_opened", {
    userId: auth.token.uid,
    properties: { briefId: sampleBrief.id, dateKey: sampleBrief.dateKey, source: "sample_fallback" }
  });

  return jsonOk({ brief: sampleBrief });
}
