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
    subject: "زبدتك جاهزة",
    text: `زبدتك جاهزة.\n\n${textSummary}\n\nافتح الملخص الكامل:\n${briefUrl}`,
    html: `
      <div dir="rtl" style="margin:0;background:#f9f9ff;padding:28px;font-family:Arial,'Tahoma',sans-serif;color:#05050b;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:30px;padding:30px;border:1px solid #ebecf0;box-shadow:0 14px 42px rgba(27,32,86,0.08);">
          <p style="margin:0 0 10px;color:#4857fc;font-weight:800;">زبدة / Zubda</p>
          <h1 style="margin:0;font-size:32px;line-height:1.45;color:#05050b;">زبدتك جاهزة</h1>
          <p style="margin:14px 0 22px;color:#566174;line-height:1.8;font-size:17px;">
            ${escapeHtml(brief.structuredBrief.executiveSnapshot.body)}
          </p>
          <div style="background:#eff8ff;border-radius:22px;padding:18px;margin:0 0 22px;color:#276676;font-size:15px;line-height:1.8;font-weight:700;">
            هذه نسخة سريعة. التفاصيل، الرسوم، المصادر، والتوضيحات داخل الرابط الخاص.
          </div>
          <ul style="margin:0 0 24px;padding-right:22px;color:#05050b;line-height:1.9;font-size:15px;">
            ${summaryItems}
          </ul>
          <a href="${briefUrl}" style="display:inline-block;background:#4857fc;color:#ffffff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:800;">
            افتح الملخص الكامل
          </a>
          <p style="margin:24px 0 0;color:#8993a4;font-size:13px;line-height:1.8;">
            كل نقطة مهمة في زبدة معها مصدر وسبب واضح لظهورها لك.
          </p>
        </div>
      </div>
    `
  };
}
