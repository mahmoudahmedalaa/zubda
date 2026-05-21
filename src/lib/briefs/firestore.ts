import { FieldValue, Timestamp, type DocumentData } from "firebase-admin/firestore";
import { sourceStorySeeds, buildStructuredBrief, type SourceStorySeed } from "@/lib/briefs/sample";
import type { BriefDocument } from "@/lib/briefs/types";
import { trackServerEvent } from "@/lib/events/server";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import type { ProfilePayload } from "@/lib/profile/schema";

function dateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function serializeDate(value: unknown): string | undefined {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return undefined;
}

function serializeBrief(id: string, data: DocumentData): BriefDocument {
  return {
    ...(data as Omit<BriefDocument, "id">),
    id,
    generatedAt: serializeDate(data.generatedAt),
    createdAt: serializeDate(data.createdAt),
    updatedAt: serializeDate(data.updatedAt)
  };
}

export async function seedSourceStories(): Promise<number> {
  const db = getAdminDb();
  const batch = db.batch();

  for (const story of sourceStorySeeds) {
    const ref = db.collection(collections.sourceStories).doc(story.id);
    batch.set(
      ref,
      {
        ...story,
        collectedAt: FieldValue.serverTimestamp(),
        publishedAt: Timestamp.fromDate(new Date()),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  }

  await batch.commit();
  return sourceStorySeeds.length;
}

export async function getCachedStories(): Promise<SourceStorySeed[]> {
  const snapshot = await getAdminDb().collection(collections.sourceStories).limit(40).get();

  if (snapshot.empty) {
    return sourceStorySeeds;
  }

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as SourceStorySeed);
}

export async function generateBriefsForProfiles(): Promise<number> {
  const db = getAdminDb();
  const profiles = await db.collection(collections.profiles).where("isPrimary", "==", true).get();
  const cachedStories = await getCachedStories();
  let count = 0;

  for (const doc of profiles.docs) {
    const profile = doc.data() as ProfilePayload & { userId: string };
    const structuredBrief = buildStructuredBrief(profile, cachedStories);
    const briefRef = db.collection(collections.briefs).doc(`${profile.userId}_${dateKey()}`);

    const briefPayload = {
      userId: profile.userId,
      profileId: doc.id,
      dateKey: dateKey(),
      status: "ready",
      languageMode: profile.languageMode,
      depth: profile.briefDepth,
      sourceStoryIds: structuredBrief.sources.map((source) => source.id),
      structuredBrief,
      emailSummary: [
        structuredBrief.executiveSnapshot.body,
        structuredBrief.watchboard[0]?.title ?? "لا توجد إشارة قوية الآن",
        structuredBrief.personalImpact.body
      ],
      generatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    const batch = db.batch();
    batch.set(briefRef, briefPayload, { merge: true });

    for (const source of structuredBrief.sources) {
      const sourceLogRef = db.collection(collections.sourceLogs).doc(`${briefRef.id}_${source.id}`);
      batch.set(
        sourceLogRef,
        {
          userId: profile.userId,
          profileId: doc.id,
          briefId: briefRef.id,
          sourceStoryId: source.id,
          sourceTitle: source.title,
          publisher: source.publisher,
          sourceUrl: source.url,
          reliabilityLabel: source.reliabilityLabel,
          whyIncluded: source.whyIncluded,
          createdAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    }

    await batch.commit();
    await trackServerEvent("brief_generated", {
      userId: profile.userId,
      properties: {
        briefId: briefRef.id,
        profileId: doc.id,
        dateKey: dateKey(),
        sourceCount: structuredBrief.sources.length
      }
    });

    count += 1;
  }

  return count;
}

export async function getLatestBriefForUser(userId: string): Promise<BriefDocument | null> {
  const snapshot = await getAdminDb()
    .collection(collections.briefs)
    .where("userId", "==", userId)
    .orderBy("dateKey", "desc")
    .limit(1)
    .get();

  return snapshot.empty ? null : serializeBrief(snapshot.docs[0].id, snapshot.docs[0].data());
}

export async function listBriefsForUser(
  userId: string,
  options: { archiveDays?: number | null; limit?: number } = {}
): Promise<BriefDocument[]> {
  const snapshot = await getAdminDb()
    .collection(collections.briefs)
    .where("userId", "==", userId)
    .orderBy("dateKey", "desc")
    .limit(options.limit ?? 20)
    .get();

  const briefs = snapshot.docs.map((doc) => serializeBrief(doc.id, doc.data()));

  if (!options.archiveDays) {
    return briefs;
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - options.archiveDays);
  const cutoffKey = cutoff.toISOString().slice(0, 10);

  return briefs.filter((brief) => brief.dateKey >= cutoffKey);
}

export async function getBriefForUser(userId: string, briefId: string): Promise<BriefDocument | null> {
  const doc = await getAdminDb().collection(collections.briefs).doc(briefId).get();

  if (!doc.exists) {
    return null;
  }

  const data = doc.data();

  if (!data || data.userId !== userId) {
    return null;
  }

  return serializeBrief(doc.id, data);
}
