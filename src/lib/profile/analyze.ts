import { z } from "zod";
import { communicationStyles, interestModules } from "@/data/onboarding";
import { getAiProvider } from "@/lib/ai/provider";

const profileSignalSchema = z.object({
  interestModuleIds: z.array(z.enum(interestModules)).max(8).default([]),
  watchlist: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
  sourcePreferences: z.array(z.string().trim().min(1).max(120)).max(8).default([]),
  avoidTopics: z.array(z.string().trim().min(1).max(120)).max(8).default([]),
  decisionContext: z.string().trim().max(500).default(""),
  communicationStyle: z.enum(communicationStyles).optional()
});

export type ProfileSignalSuggestions = z.infer<typeof profileSignalSchema>;

const keywordInterestMap: Array<{ keywords: string[]; interest: (typeof interestModules)[number] }> = [
  { keywords: ["استثمار", "سوق", "محفظ", "أسهم", "تداول", "finance", "invest"], interest: "المال والاستثمار" },
  { keywords: ["ai", "ذكاء", "تقنية", "تكنولوجيا", "منتج", "برمجة"], interest: "الذكاء الاصطناعي والتقنية" },
  { keywords: ["الخليج", "سعود", "إمارات", "دبي", "رياض", "gcc"], interest: "أعمال الخليج" },
  { keywords: ["نفط", "طاقة", "oil", "opec", "برنت"], interest: "الطاقة والنفط" },
  { keywords: ["عقار", "real estate", "تمويل"], interest: "العقار" },
  { keywords: ["مؤسس", "startup", "vc", "تمويل", "جولة"], interest: "الشركات الناشئة والاستثمار الجريء" },
  { keywords: ["سياسة", "حكومة", "تنظيم", "policy"], interest: "السياسات والقطاع العام" },
  { keywords: ["مناخ", "استدام", "sustain"], interest: "الاستدامة والمناخ" }
];

function unique(values: string[], max: number): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).slice(0, max);
}

function extractWatchlist(text: string): string[] {
  const englishEntities = text.match(/\b[A-Z][A-Za-z0-9&.\-]{1,24}\b/g) ?? [];
  const arabicAfterFollow = [...text.matchAll(/(?:أتابع|راقب|راقبوا|مهتم بـ|مهتم ب|متابعة)\s+([^،.\n]+)/g)].map(
    (match) => match[1] ?? ""
  );
  return unique([...englishEntities, ...arabicAfterFollow], 12);
}

export function deterministicProfileSignals(text: string): ProfileSignalSuggestions {
  const normalized = text.toLowerCase();
  const interestModuleIds = unique(
    keywordInterestMap
      .filter(({ keywords }) => keywords.some((keyword) => normalized.includes(keyword.toLowerCase())))
      .map(({ interest }) => interest),
    8
  ) as ProfileSignalSuggestions["interestModuleIds"];

  const avoidTopics = [...text.matchAll(/(?:ما أبي|لا أريد|تجنب|بدون)\s+([^،.\n]+)/g)].map((match) => match[1] ?? "");

  return profileSignalSchema.parse({
    interestModuleIds,
    watchlist: extractWatchlist(text),
    avoidTopics: unique(avoidTopics, 8),
    sourcePreferences: [],
    decisionContext: text.length > 40 ? text.slice(0, 500) : "",
    communicationStyle: normalized.includes("مختصر") ? "مختصر ومباشر" : undefined
  });
}

function parseJsonObject(text: string): unknown {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced ?? text.match(/\{[\s\S]*\}/)?.[0] ?? text;
  return JSON.parse(candidate);
}

export async function analyzeProfileText(text: string): Promise<ProfileSignalSuggestions> {
  const fallback = deterministicProfileSignals(text);

  if (text.trim().length < 20) {
    return fallback;
  }

  try {
    const provider = getAiProvider();
    const result = await provider.generateText({
      task: "classification",
      temperature: 0.1,
      system:
        "You extract profile personalization signals for Zubda, an Arabic-first personal intelligence app. Return JSON only. Do not invent facts. Use only the user's text.",
      prompt: JSON.stringify({
        allowedInterestModules: interestModules,
        allowedCommunicationStyles: communicationStyles,
        userText: text,
        outputSchema: {
          interestModuleIds: "array of allowed interest modules",
          watchlist: "companies, topics, assets, markets, countries, or brands explicitly mentioned",
          sourcePreferences: "publishers or source names explicitly mentioned",
          avoidTopics: "topics the user says they do not want",
          decisionContext: "one short Arabic sentence describing what decisions the user wants help with",
          communicationStyle: "one allowed style only if clearly implied"
        }
      })
    });

    const parsed = profileSignalSchema.safeParse(parseJsonObject(result.text));
    if (!parsed.success) {
      return fallback;
    }

    return {
      interestModuleIds: unique([...fallback.interestModuleIds, ...parsed.data.interestModuleIds], 8) as ProfileSignalSuggestions["interestModuleIds"],
      watchlist: unique([...fallback.watchlist, ...parsed.data.watchlist], 12),
      sourcePreferences: unique(parsed.data.sourcePreferences, 8),
      avoidTopics: unique([...fallback.avoidTopics, ...parsed.data.avoidTopics], 8),
      decisionContext: parsed.data.decisionContext || fallback.decisionContext,
      communicationStyle: parsed.data.communicationStyle ?? fallback.communicationStyle
    };
  } catch {
    return fallback;
  }
}
