import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { verifyFirebaseRequest } from "@/lib/auth/server";
import { trackServerEvent } from "@/lib/events/server";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import { jsonError, jsonOk } from "@/lib/http";

const feedbackSchema = z.object({
  briefId: z.string().min(1),
  feedbackType: z.enum(["useful", "not_useful", "too_much", "too_little", "more_like_this"]),
  sourceStoryId: z.string().optional(),
  note: z.string().max(500).optional()
});

export async function POST(request: Request): Promise<Response> {
  const auth = await verifyFirebaseRequest(request);

  if (!auth.ok) {
    return jsonError(
      auth.code === "FIREBASE_NOT_CONFIGURED" ? "CONFIGURATION_ERROR" : "UNAUTHORIZED",
      "Missing or invalid Firebase ID token.",
      auth.status
    );
  }

  const parsed = feedbackSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", "Feedback payload is invalid.", 400);
  }

  const ref = await getAdminDb().collection(collections.feedback).add({
    ...parsed.data,
    userId: auth.token.uid,
    createdAt: FieldValue.serverTimestamp()
  });

  await trackServerEvent("feedback_submitted", {
    userId: auth.token.uid,
    properties: parsed.data
  });

  return jsonOk({ id: ref.id });
}
