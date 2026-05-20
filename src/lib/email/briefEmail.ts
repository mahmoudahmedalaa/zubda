import type { BriefDocument } from "@/lib/briefs/types";
import { serverEnv } from "@/lib/env";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildBriefEmail({
  brief,
  appUrl
}: {
  brief: BriefDocument;
  appUrl?: string;
}): { subject: string; html: string; text: string } {
  const baseUrl = appUrl ?? (serverEnv.APP_ENV === "development" ? "http://localhost:3000" : "https://zubda.ai");
  const briefUrl = `${baseUrl}/app/briefs/${brief.id}`;
  const summaryItems = (brief.emailSummary?.length ? brief.emailSummary : [brief.structuredBrief.executiveSnapshot.body])
    .slice(0, 5)
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const textSummary = (brief.emailSummary?.length ? brief.emailSummary : [brief.structuredBrief.executiveSnapshot.body])
    .slice(0, 5)
    .map((item) => `- ${item}`)
    .join("\n");

  return {
    subject: "زبدة اليوم جاهزة",
    text: `زبدتك وصلت.\n\n${textSummary}\n\nافتح الملخص الكامل:\n${briefUrl}`,
    html: `
      <div dir="rtl" style="margin:0;background:#f7f8ff;padding:28px;font-family:Arial,'Tahoma',sans-serif;color:#101422;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:28px;padding:28px;border:1px solid #e4e7f5;">
          <p style="margin:0 0 8px;color:#4857fc;font-weight:800;">زبدة / Zubda</p>
          <h1 style="margin:0;font-size:30px;line-height:1.45;color:#101422;">زبدة اليوم جاهزة</h1>
          <p style="margin:14px 0 22px;color:#586174;line-height:1.8;font-size:16px;">
            ${escapeHtml(brief.structuredBrief.executiveSnapshot.body)}
          </p>
          <ul style="margin:0 0 24px;padding-right:22px;color:#101422;line-height:1.9;font-size:15px;">
            ${summaryItems}
          </ul>
          <a href="${briefUrl}" style="display:inline-block;background:#4857fc;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:800;">
            افتح الملخص الكامل
          </a>
          <p style="margin:24px 0 0;color:#7a8397;font-size:13px;line-height:1.8;">
            كل ملخص في زبدة يعتمد على مصادر واضحة وسبب ظهور كل معلومة لك.
          </p>
        </div>
      </div>
    `
  };
}
