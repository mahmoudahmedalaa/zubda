import type { ReactElement } from "react";
import { ProfileSettingsClient } from "@/components/settings/ProfileSettingsClient";

export default function ProfileSettingsPage(): ReactElement {
  return (
    <main className="page-shell py-8 text-right">
      <h1 className="text-4xl font-black leading-[1.45]">خلّ زبدة تفهمك</h1>
      <p className="arabic-copy mt-3 max-w-2xl text-[var(--color-ink-muted)]">
        عدّل اللغة، المنطقة، الدور، الاهتمامات، قائمة المتابعة، العملة، وعمق الملخص.
      </p>
      <ProfileSettingsClient />
    </main>
  );
}
