import { z } from "zod";
import { verifyFirebaseRequest } from "@/lib/auth/server";
import { jsonError, jsonOk } from "@/lib/http";
import { analyzeProfileText } from "@/lib/profile/analyze";

const analyzeSchema = z.object({
  text: z.string().trim().min(1).max(1800)
});

export async function POST(request: Request): Promise<Response> {
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

  const parsed = analyzeSchema.safeParse(await request.json());

  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", "Text is required.", 400);
  }

  const suggestions = await analyzeProfileText(parsed.data.text);
  return jsonOk({ suggestions });
}
