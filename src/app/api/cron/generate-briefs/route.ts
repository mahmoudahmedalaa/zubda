import { generateBriefsForProfiles } from "@/lib/briefs/firestore";
import { verifyCronRequest } from "@/lib/cron";
import { jsonOk } from "@/lib/http";
import { finishGenerationJob, startGenerationJob } from "@/lib/jobs";

export async function POST(request: Request): Promise<Response> {
  const cronError = verifyCronRequest(request);
  if (cronError) return cronError;

  const jobId = await startGenerationJob("brief_generation");

  try {
    const generated = await generateBriefsForProfiles();
    await finishGenerationJob(jobId, "succeeded", { generated });
    return jsonOk({ jobId, generated });
  } catch (error) {
    await finishGenerationJob(jobId, "failed", {
      error: error instanceof Error ? error.message : "Unknown brief generation error"
    });
    throw error;
  }
}
