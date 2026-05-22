import { createHash } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { InterestModule } from "@/data/onboarding";
import { sourceStorySeeds, type SourceStorySeed } from "@/lib/briefs/sample";
import { serverEnv } from "@/lib/env";
import { collections } from "@/lib/firebase/collections";
import { getAdminDb } from "@/lib/firebase/admin";

type SourceQuery = {
  id: string;
  query: string;
  topicTags: InterestModule[];
  regionTags: string[];
  entityTags: string[];
};

type GdeltArticle = {
  url?: string;
  title?: string;
  seendate?: string;
  domain?: string;
  sourcecountry?: string;
  language?: string;
};

type FmpNewsItem = {
  symbol?: string;
  publishedDate?: string;
  title?: string;
  site?: string;
  text?: string;
  url?: string;
};

const sourceQueries: SourceQuery[] = [
  {
    id: "gcc-business",
    query: "(GCC OR UAE OR Saudi OR Riyadh OR Dubai) business economy investment",
    topicTags: ["أعمال الخليج", "الاقتصاد العالمي", "المال والاستثمار"],
    regionTags: ["GCC", "UAE", "Saudi"],
    entityTags: ["GCC", "UAE", "Saudi"]
  },
  {
    id: "ai-technology",
    query: "\"artificial intelligence\" OR AI Nvidia cloud chips earnings",
    topicTags: ["الذكاء الاصطناعي والتقنية", "المال والاستثمار"],
    regionTags: ["Global", "UAE", "Saudi"],
    entityTags: ["AI", "Nvidia", "Cloud", "Semiconductors"]
  },
  {
    id: "energy-oil",
    query: "oil Brent OPEC energy Gulf",
    topicTags: ["الطاقة والنفط", "أعمال الخليج", "المال والاستثمار"],
    regionTags: ["GCC", "Saudi", "UAE", "Global"],
    entityTags: ["Oil", "Brent", "OPEC", "Energy"]
  },
  {
    id: "rates-macro",
    query: "Federal Reserve interest rates treasury yields markets",
    topicTags: ["الاقتصاد العالمي", "المال والاستثمار"],
    regionTags: ["Global"],
    entityTags: ["Fed", "Treasury yields", "Rates", "QQQ"]
  },
  {
    id: "startups-vc",
    query: "startups venture capital MENA Saudi UAE funding",
    topicTags: ["الشركات الناشئة والاستثمار الجريء", "أعمال الخليج"],
    regionTags: ["MENA", "GCC", "UAE", "Saudi"],
    entityTags: ["Startups", "VC", "Funding"]
  }
];

function storyId(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 24);
}

function compactText(text?: string, fallback = "تحديث مهم ضمن اهتماماتك المختارة."): string {
  return (text ?? fallback).replace(/\s+/g, " ").trim().slice(0, 420);
}

function gdeltUrl(query: SourceQuery): string {
  const params = new URLSearchParams({
    query: query.query,
    mode: "ArtList",
    format: "json",
    sort: "HybridRel",
    maxrecords: "8",
    timespan: "36h"
  });

  return `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`;
}

function normalizeGdeltArticle(article: GdeltArticle, query: SourceQuery): SourceStorySeed | null {
  if (!article.url || !article.title) {
    return null;
  }

  return {
    id: `gdelt_${storyId(article.url)}`,
    title: compactText(article.title, "تحديث من الأخبار العالمية"),
    summary: compactText(article.title),
    sourceUrl: article.url,
    publisher: article.domain ?? new URL(article.url).hostname,
    sourceType: "open_web",
    topicTags: query.topicTags,
    regionTags: Array.from(new Set([...query.regionTags, article.sourcecountry ?? "Global"])),
    entityTags: query.entityTags,
    reliabilityLabel: "medium",
    language: article.language === "Arabic" || article.language === "ar" ? "ar" : "en"
  };
}

async function fetchGdeltStories(): Promise<SourceStorySeed[]> {
  const batches = await Promise.allSettled(
    sourceQueries.map(async (query) => {
      const response = await fetch(gdeltUrl(query), {
        headers: { accept: "application/json" },
        next: { revalidate: 60 * 15 }
      });

      if (!response.ok) {
        throw new Error(`GDELT ${query.id} failed with ${response.status}`);
      }

      const payload = (await response.json()) as { articles?: GdeltArticle[] };
      return (payload.articles ?? [])
        .map((article) => normalizeGdeltArticle(article, query))
        .filter((story): story is SourceStorySeed => Boolean(story));
    })
  );

  return batches.flatMap((batch) => (batch.status === "fulfilled" ? batch.value : []));
}

function fmpNewsUrl(): string | null {
  if (!serverEnv.FMP_API_KEY) {
    return null;
  }

  const params = new URLSearchParams({
    tickers: "NVDA,QQQ,SPY,TSLA,META,MSFT",
    limit: "20",
    apikey: serverEnv.FMP_API_KEY
  });

  return `https://financialmodelingprep.com/api/v3/stock_news?${params.toString()}`;
}

function normalizeFmpNews(item: FmpNewsItem): SourceStorySeed | null {
  if (!item.url || !item.title) {
    return null;
  }

  return {
    id: `fmp_${storyId(item.url)}`,
    title: compactText(item.title),
    summary: compactText(item.text ?? item.title),
    sourceUrl: item.url,
    publisher: item.site ?? "Financial Modeling Prep",
    sourceType: "open_web",
    topicTags: ["المال والاستثمار", "الذكاء الاصطناعي والتقنية"],
    regionTags: ["Global"],
    entityTags: [item.symbol ?? "Markets"].filter(Boolean),
    reliabilityLabel: "medium",
    language: "en"
  };
}

async function fetchFmpStories(): Promise<SourceStorySeed[]> {
  const url = fmpNewsUrl();

  if (!url) {
    return [];
  }

  const response = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate: 60 * 15 }
  });

  if (!response.ok) {
    throw new Error(`FMP news failed with ${response.status}`);
  }

  const payload = (await response.json()) as FmpNewsItem[];
  return payload.map(normalizeFmpNews).filter((story): story is SourceStorySeed => Boolean(story));
}

function dedupeStories(stories: SourceStorySeed[]): SourceStorySeed[] {
  const seen = new Set<string>();
  const deduped: SourceStorySeed[] = [];

  for (const story of stories) {
    const key = story.sourceUrl.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(story);
  }

  return deduped.slice(0, 60);
}

export async function collectSourceStories(): Promise<SourceStorySeed[]> {
  const results = await Promise.allSettled([fetchGdeltStories(), fetchFmpStories()]);
  const liveStories = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const stories = dedupeStories(liveStories);

  return stories.length > 0 ? stories : sourceStorySeeds;
}

export async function collectAndStoreSourceStories(): Promise<number> {
  const stories = await collectSourceStories();
  const db = getAdminDb();
  const batch = db.batch();

  for (const story of stories) {
    const ref = db.collection(collections.sourceStories).doc(story.id);
    batch.set(
      ref,
      {
        ...story,
        collectedAt: FieldValue.serverTimestamp(),
        publishedAt: Timestamp.fromDate(new Date()),
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  }

  await batch.commit();
  return stories.length;
}
