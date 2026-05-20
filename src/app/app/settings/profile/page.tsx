import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";

export default function ProfileSettingsPage(): ReactElement {
  return (
    <main className="page-shell py-8 text-right">
      <h1 className="text-4xl font-black">خلّ زبدة تفهمك</h1>
      <Card className="mt-8 p-5">
        <p className="arabic-copy text-[var(--color-ink-muted)]">
          هنا يتم تعديل اللغة، المنطقة، الدور، الاهتمامات، قائمة المتابعة، العملة، وعمق brief.
        </p>
      </Card>
    </main>
  );
}
