import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";

type PageProps = {
  params: Promise<{
    briefId: string;
  }>;
};

export default async function BriefDetailPage({ params }: PageProps): Promise<ReactElement> {
  const { briefId } = await params;

  return (
    <main className="page-shell py-8 text-right">
      <p className="font-mono text-xs uppercase text-[var(--color-ink-muted)]">Brief {briefId}</p>
      <h1 className="mt-2 text-4xl font-black">زبدة محفوظة</h1>
      <Card className="mt-8 p-5">
        <h2 className="text-2xl font-black">من وين جبناها؟</h2>
        <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">
          صفحة detail جاهزة للربط مع Firestore briefs و sourceLogs في المرحلة القادمة.
        </p>
      </Card>
    </main>
  );
}
