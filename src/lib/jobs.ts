import { FieldValue } from "firebase-admin/firestore";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";

export type GenerationJobType = "source_collection" | "brief_generation" | "email_delivery";

function dateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function startGenerationJob(jobType: GenerationJobType): Promise<string> {
  const ref = await getAdminDb().collection(collections.generationJobs).add({
    jobType,
    status: "running",
    dateKey: dateKey(),
    startedAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp()
  });

  return ref.id;
}

export async function finishGenerationJob(
  jobId: string,
  status: "succeeded" | "failed",
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await getAdminDb()
    .collection(collections.generationJobs)
    .doc(jobId)
    .update({
      status,
      ...metadata,
      finishedAt: FieldValue.serverTimestamp()
    });
}
