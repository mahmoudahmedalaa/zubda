import type { ReactElement } from "react";
import { BriefDetailClient } from "@/components/briefs/BriefDetailClient";

type PageProps = {
  params: Promise<{
    briefId: string;
  }>;
};

export default async function BriefDetailPage({ params }: PageProps): Promise<ReactElement> {
  const { briefId } = await params;

  return (
    <main className="page-shell py-8 text-right">
      <BriefDetailClient briefId={briefId} />
    </main>
  );
}
