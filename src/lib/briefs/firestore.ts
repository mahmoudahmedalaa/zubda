import { FieldValue, Timestamp, type DocumentData } from "firebase-admin/firestore";
import { sourceStorySeeds, buildStructuredBrief, type SourceStorySeed } from "@/lib/briefs/sample";
import type { BriefDocument } from "@/lib/briefs/types";
import { trackServerEvent } from "@/lib/events/server";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";
import type { ProfilePayload } from "@/lib/profile/schema";

export function dateKey(date = new Date(), timeZone = "Asia/Dubai"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
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

export async function generateBriefForProfile({
  userId,
  profileId,
  profile,
  date = new Date()
}: {
  userId: string;
  profileId: string;
  profile: ProfilePayload;
  date?: Date;
}): Promise<BriefDocument> {
  const db = getAdminDb();
  const cachedStories = await getCachedStories();
  const structuredBrief = buildStructuredBrief(profile, cachedStories);
  const key = dateKey(date, profile.timezone);
  const briefRef = db.collection(collections.briefs).doc(`${userId}_${key}`);

  const briefPayload = {
    userId,
    profileId,
    dateKey: key,
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
        userId,
        profileId,
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
    userId,
    properties: {
      briefId: briefRef.id,
      profileId,
      dateKey: key,
      sourceCount: structuredBrief.sources.length
    }
  });

  const snapshot = await briefRef.get();
  return serializeBrief(snapshot.id, snapshot.data() ?? briefPayload);
}

export async function generateBriefsForProfiles(): Promise<number> {
  const db = getAdminDb();
  const profiles = await db.collection(collections.profiles).where("isPrimary", "==", true).get();
  let count = 0;

  for (const doc of profiles.docs) {
    const profile = doc.data() as ProfilePayload & { userId: string };
    await generateBriefForProfile({
      userId: profile.userId,
      profileId: doc.id,
      profile
    });
    count += 1;
  }

  return count;
}

export async function getLatestBriefForUser(userId: string): Promise<BriefDocument | null> {
  const snapshot = await getAdminDb()
    .collection(collections.briefs)
    .where("userId", "==", userId)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs
    .map((doc) => serializeBrief(doc.id, doc.data()))
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))[0];
}

export async function listBriefsForUser(
  userId: string,
  options: { archiveDays?: number | null; limit?: number } = {}
): Promise<BriefDocument[]> {
  const snapshot = await getAdminDb()
    .collection(collections.briefs)
    .where("userId", "==", userId)
    .get();

  let briefs = snapshot.docs
    .map((doc) => serializeBrief(doc.id, doc.data()))
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey));

  if (options.archiveDays) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - options.archiveDays);
    const cutoffKey = dateKey(cutoff);
    briefs = briefs.filter((brief) => brief.dateKey >= cutoffKey);
  }

  return briefs.slice(0, options.limit ?? 20);
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
