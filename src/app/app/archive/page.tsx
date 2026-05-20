import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";

export default function ArchivePage(): ReactElement {
  return (
    <main className="page-shell py-8 text-right">
      <h1 className="text-4xl font-black">زبداتك السابقة</h1>
      <div className="mt-8 grid gap-4">
        {["اليوم", "أمس", "قبل يومين"].map((date) => (
          <Card className="p-5" key={date}>
            <p className="font-bold">{date}</p>
            <p className="arabic-copy mt-2 text-[var(--color-ink-muted)]">
              Brief archive placeholder. Free users will see a limited archive; Pro gets full history.
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
