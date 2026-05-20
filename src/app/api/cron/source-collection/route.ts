import { seedSourceStories } from "@/lib/briefs/firestore";
import { verifyCronRequest } from "@/lib/cron";
import { jsonOk } from "@/lib/http";
import { finishGenerationJob, startGenerationJob } from "@/lib/jobs";

export async function POST(request: Request): Promise<Response> {
  const cronError = verifyCronRequest(request);
  if (cronError) return cronError;

  const jobId = await startGenerationJob("source_collection");

  try {
    const count = await seedSourceStories();
    await finishGenerationJob(jobId, "succeeded", { seeded: count });
    return jsonOk({ jobId, seeded: count });
  } catch (error) {
    await finishGenerationJob(jobId, "failed", {
      error: error instanceof Error ? error.message : "Unknown source collection error"
    });
    throw error;
  }
}
