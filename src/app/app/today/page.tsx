import type { ReactElement } from "react";
import { TodayBriefClient } from "@/components/briefs/TodayBriefClient";

export default function TodayPage(): ReactElement {
  return (
    <main className="page-shell py-8 text-right">
      <TodayBriefClient />
    </main>
  );
}
