import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { BriefReader } from "@/components/briefs/BriefReader";
import { ButtonLink } from "@/components/ui/Button";
import { buildStructuredBrief, sourceStorySeeds } from "@/lib/briefs/sample";
import type { BriefDocument } from "@/lib/briefs/types";
import type { ProfilePayload } from "@/lib/profile/schema";

const sampleProfile: ProfilePayload = {
  languageMode: "mixed",
  region: "الإمارات",
  regionFocus: ["الإمارات", "السعودية"],
  role: "مستثمر أو مدير محفظة",
  roleOther: "",
  mainGoals: ["أتابع السوق بدون لفّة طويلة"],
  interestModuleIds: ["المال والاستثمار", "الذكاء الاصطناعي والتقنية", "أعمال الخليج"],
  watchlist: ["Nvidia", "Oil", "UAE real estate"],
  sourcePreferences: ["Federal Reserve", "OPEC"],
  avoidTopics: [],
  communicationStyle: "عملي وفيه نقاط قابلة للاستخدام",
  decisionContext: "أحتاج أفهم أثر الأخبار على استثماراتي واجتماعاتي في دبي",
  personalContext: "مستثمر في دبي يتابع التقنية والأسواق الخليجية ويحتاج نقاط سريعة تنفعه قبل الاجتماعات",
  briefDepth: "standard",
  deliveryTime: "09:00",
  timezone: "Asia/Dubai"
};

const sampleBrief: BriefDocument = {
  id: "sample",
  dateKey: new Date().toISOString().slice(0, 10),
  status: "ready",
  languageMode: "mixed",
  depth: "standard",
  structuredBrief: buildStructuredBrief(sampleProfile, sourceStorySeeds, { mode: "demo" })
};

const sampleSelections = [
  { label: "الدور", value: sampleProfile.role },
  { label: "المنطقة", value: sampleProfile.region },
  { label: "الاهتمامات", value: "المال، التقنية، أعمال الخليج" },
  { label: "يتابع", value: "Nvidia، النفط، عقار الإمارات" }
];

export default function SampleBriefPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="page-shell py-10 text-right">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-black leading-[1.35]">مثال على زبدة مخصصة</h1>
            <p className="arabic-copy mt-3 max-w-3xl font-semibold text-[var(--color-ink-muted)]">
              هذا المثال مبني على اختيارات مستخدم واحد، عشان تشوف كيف يتغير الملخص حسب شغله واهتماماته وقائمة متابعته
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5" aria-label="اختيارات مستخدم المثال">
              {sampleSelections.map((selection) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-black shadow-sm"
                  key={selection.label}
                >
                  <span className="text-[var(--color-ink-soft)]">{selection.label}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-zubda-500)]" aria-hidden="true" />
                  <span className="text-[var(--color-ink)]">{selection.value}</span>
                </span>
              ))}
            </div>
          </div>
          <ButtonLink href="/login">ابدأ زبدتك</ButtonLink>
        </div>
        <BriefReader brief={sampleBrief} enableFeedback={false} />
      </main>
    </>
  );
}
