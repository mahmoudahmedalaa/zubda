import { z } from "zod";
import { communicationStyles, interestModules, regions, roles } from "@/data/onboarding";

const legacyRoles = [
  "مستشار",
  "مؤسس",
  "مستثمر",
  "إدارة أو استراتيجية",
  "تقنية أو منتج",
  "تسويق أو نمو",
  "مبيعات أو شراكات",
  "قطاع حكومي أو سياسات",
  "إعلام أو صناعة محتوى",
  "طالب أو بداية مهنية"
] as const;

export const profilePayloadSchema = z.object({
  languageMode: z.enum(["arabic", "english", "mixed"]),
  region: z.enum(regions),
  regionFocus: z.array(z.enum(regions)).min(1).max(9).default([]),
  role: z.union([z.enum(roles), z.enum(legacyRoles)]),
  roleOther: z.string().trim().max(120).default(""),
  mainGoals: z.array(z.string().min(1)).min(1).max(5),
  interestModuleIds: z.array(z.enum(interestModules)).min(1).max(15),
  watchlist: z.array(z.string().trim().min(1).max(80)).max(50).default([]),
  sourcePreferences: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
  avoidTopics: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
  communicationStyle: z.enum(communicationStyles).default("مختصر ومباشر"),
  decisionContext: z.string().trim().max(800).default(""),
  personalContext: z.string().trim().max(1200).default(""),
  briefDepth: z.enum(["quick", "standard", "deep"]),
  deliveryTime: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().min(1).max(80)
});

export type ProfilePayload = z.infer<typeof profilePayloadSchema>;

export function normalizeWatchlist(items: string[]): string[] {
  return Array.from(
    new Set(
      items
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => item.slice(0, 80))
    )
  );
}
