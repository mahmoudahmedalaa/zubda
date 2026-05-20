import { verifyCronRequest } from "@/lib/cron";
import { sendReadyBriefEmails } from "@/lib/email/sendBriefs";
import { jsonOk } from "@/lib/http";
import { finishGenerationJob, startGenerationJob } from "@/lib/jobs";

export async function POST(request: Request): Promise<Response> {
  const cronError = verifyCronRequest(request);
  if (cronError) return cronError;

  const jobId = await startGenerationJob("email_delivery");

  try {
    const result = await sendReadyBriefEmails();
    await finishGenerationJob(jobId, "succeeded", result);

    return jsonOk({
      jobId,
      ...result,
      note: result.configured
        ? "Ready briefs were processed for email delivery."
        : "RESEND_API_KEY is not configured, so email delivery was skipped safely."
    });
  } catch (error) {
    await finishGenerationJob(jobId, "failed", {
      error: error instanceof Error ? error.message : "Unknown email delivery error"
    });
    throw error;
  }
}
