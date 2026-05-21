import type { ReactElement } from "react";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { Card } from "@/components/ui/Card";

const adminAreas = [
  ["المستخدمون", collections.users],
  ["الملفات الذكية", collections.profiles],
  ["الزبدات", collections.briefs],
  ["مهام التوليد", collections.generationJobs],
  ["سجل المصادر", collections.sourceLogs],
  ["التفاعل", collections.feedback],
  ["الأحداث", collections.events],
  ["التوصيل", collections.deliveryLogs],
  ["الدفع", collections.stripeEvents]
] as const;

async function getCollectionCount(collectionName: string): Promise<number | null> {
  if (!hasFirebaseAdminConfig()) {
    return null;
  }

  const snapshot = await getAdminDb().collection(collectionName).count().get();
  return snapshot.data().count;
}

export default async function AdminPage(): Promise<ReactElement> {
  const counts = await Promise.all(
    adminAreas.map(async ([label, collectionName]) => ({
      label,
      collectionName,
      count: await getCollectionCount(collectionName)
    }))
  );

  return (
    <main className="page-shell py-8 text-right">
      <h1 className="text-4xl font-black leading-[1.45]">لوحة المتابعة الداخلية</h1>
      <p className="arabic-copy mt-3 max-w-2xl text-[var(--color-ink-muted)]">
        نظرة سريعة على Firestore: المستخدمين، الملفات، الزبدات، التوصيل، والتفاعل.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {counts.map((area) => (
          <Card className="p-5" key={area.collectionName}>
            <p className="text-sm font-black text-[var(--color-zubda-600)]">{area.collectionName}</p>
            <h2 className="mt-2 text-2xl font-black">{area.label}</h2>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              {area.count === null ? "Firebase Admin غير مضبوط في هذه البيئة." : `${area.count} سجل`}
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
