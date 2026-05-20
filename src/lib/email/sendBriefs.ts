import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import type { BriefDocument } from "@/lib/briefs/types";
import { buildBriefEmail } from "@/lib/email/briefEmail";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import { clientEnv, serverEnv } from "@/lib/env";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function wasAlreadySent(briefId: string): Promise<boolean> {
  const snapshot = await getAdminDb()
    .collection(collections.deliveryLogs)
    .where("briefId", "==", briefId)
    .where("channel", "==", "email")
    .where("status", "in", ["queued", "sent"])
    .limit(1)
    .get();

  return !snapshot.empty;
}

export async function sendReadyBriefEmails(): Promise<{
  queued: number;
  sent: number;
  skipped: number;
  failed: number;
  configured: boolean;
}> {
  const db = getAdminDb();
  const briefs = await db
    .collection(collections.briefs)
    .where("dateKey", "==", todayKey())
    .where("status", "==", "ready")
    .limit(100)
    .get();

  if (!serverEnv.RESEND_API_KEY) {
    return {
      queued: 0,
      sent: 0,
      skipped: briefs.size,
      failed: 0,
      configured: false
    };
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);
  let queued = 0;
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const doc of briefs.docs) {
    const brief = { id: doc.id, ...doc.data() } as BriefDocument;

    if (await wasAlreadySent(brief.id)) {
      skipped += 1;
      continue;
    }

    if (!brief.userId) {
      skipped += 1;
      continue;
    }

    const user = await db.collection(collections.users).doc(brief.userId).get();
    const email = user.data()?.email;

    if (!email) {
      skipped += 1;
      continue;
    }

    const logRef = await db.collection(collections.deliveryLogs).add({
      userId: brief.userId,
      profileId: brief.profileId,
      briefId: brief.id,
      channel: "email",
      status: "queued",
      createdAt: FieldValue.serverTimestamp()
    });
    queued += 1;

    try {
      const emailContent = buildBriefEmail({
        brief,
        appUrl: clientEnv.NEXT_PUBLIC_APP_URL
      });
      const result = await resend.emails.send({
        from: `Zubda / زبدة <${serverEnv.RESEND_FROM_EMAIL}>`,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });

      await logRef.update({
        status: "sent",
        resendMessageId: result.data?.id,
        sentAt: FieldValue.serverTimestamp()
      });
      sent += 1;
    } catch (error) {
      await logRef.update({
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown email send error",
        updatedAt: FieldValue.serverTimestamp()
      });
      failed += 1;
    }
  }

  return {
    queued,
    sent,
    skipped,
    failed,
    configured: true
  };
}
