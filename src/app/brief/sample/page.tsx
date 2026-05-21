import type { ReactElement } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { BriefReader } from "@/components/briefs/BriefReader";
import { ButtonLink } from "@/components/ui/Button";
import { buildStructuredBrief, sourceStorySeeds } from "@/lib/briefs/sample";
import type { BriefDocument } from "@/lib/briefs/types";
import type { ProfilePayload } from "@/lib/profile/schema";

const sampleProfile: ProfilePayload = {
  languageMode: "mixed",
  region: "UAE",
  role: "مستثمر",
  mainGoals: ["أتابع السوق بدون لفّة طويلة"],
  interestModuleIds: ["المال والاستثمار", "الذكاء الاصطناعي والتقنية", "أعمال الخليج"],
  watchlist: ["Nvidia", "Oil", "UAE real estate"],
  preferredCurrency: "AED",
  briefDepth: "standard",
  deliveryTime: "07:30",
  timezone: "Asia/Dubai"
};

const sampleBrief: BriefDocument = {
  id: "sample",
  dateKey: new Date().toISOString().slice(0, 10),
  status: "ready",
  languageMode: "mixed",
  depth: "standard",
  preferredCurrency: "AED",
  structuredBrief: buildStructuredBrief(sampleProfile, sourceStorySeeds)
};

export default function SampleBriefPage(): ReactElement {
  return (
    <>
      <BrandHeader />
      <main className="page-shell py-10 text-right">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black leading-[1.35]">مثال على زبدة مخصصة</h1>
            <p className="arabic-copy mt-3 max-w-2xl font-semibold text-[var(--color-ink-muted)]">
              شوف كيف يتغير الملخص لما تكون مهتم بـ Nvidia، النفط، وأسواق الخليج
            </p>
          </div>
          <ButtonLink href="/login">ابدأ زبدتك</ButtonLink>
        </div>
        <BriefReader brief={sampleBrief} enableFeedback={false} />
      </main>
    </>
  );
}
