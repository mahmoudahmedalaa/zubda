import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";

const adminAreas = ["Users", "Profiles", "Briefs", "Generation jobs", "Source logs", "Feedback"];

export default function AdminPage(): ReactElement {
  return (
    <main className="page-shell py-8 text-right">
      <h1 className="text-4xl font-black">Admin monitoring</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {adminAreas.map((area) => (
          <Card className="p-5" key={area}>
            <h2 className="text-xl font-black">{area}</h2>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              MVP admin surface placeholder.
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
