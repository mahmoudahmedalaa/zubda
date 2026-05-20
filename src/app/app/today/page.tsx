import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

const sections = [
  ["زبدة اليوم", "السوق ينتظر إشارات الفائدة، وقطاع التقنية يتحرك على نتائج الذكاء الاصطناعي."],
  ["راقب هذي", "تصريحات الفيدرالي، أسعار النفط، وأخبار الإنفاق السحابي."],
  ["وش أثرها عليك؟", "إذا اهتماماتك تشمل AI والأسواق، اليوم يحتاج عين على العوائد وأسهم النمو."],
  ["كلام ينقال", "ارتفاع العوائد لا يضغط فقط على الأسهم؛ يغير شهية المخاطرة كلها."]
];

export default function TodayPage(): ReactElement {
  return (
    <main className="page-shell py-8 text-right">
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-ink-muted)]">/app/today</p>
          <h1 className="mt-2 text-4xl font-black">زبدة اليوم جاهزة</h1>
        </div>
        <ButtonLink href="/app/archive" variant="secondary">
          زبداتك السابقة
        </ButtonLink>
      </header>
      <div className="grid gap-5">
        {sections.map(([title, text]) => (
          <Card className="p-5" key={title}>
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="arabic-copy mt-3 text-[var(--color-ink-muted)]">{text}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 bg-[var(--color-trust-50)] p-5 text-center">
        <h2 className="text-2xl font-black">خلصت زبدة اليوم</h2>
        <p className="arabic-copy mt-2 text-[var(--color-ink-muted)]">
          عندك الزبدة، بدون زحمة.
        </p>
      </Card>
    </main>
  );
}
