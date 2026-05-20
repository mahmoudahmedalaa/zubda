export type BriefSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  reliabilityLabel: "high" | "medium" | "low";
  whyIncluded: string;
};

export type WatchboardItem = {
  sourceStoryId: string;
  title: string;
  time: string;
  why: string;
  impact: string;
  plainArabic: string;
};

export type StructuredBrief = {
  headline: string;
  executiveSnapshot: {
    title: string;
    body: string;
  };
  watchboard: WatchboardItem[];
  personalImpact: {
    title: string;
    body: string;
  };
  talkingPoints: string[];
  glossary: Array<{
    term: string;
    explanation: string;
  }>;
  sources: BriefSource[];
};

export type BriefDocument = {
  id: string;
  userId?: string;
  profileId?: string;
  dateKey: string;
  status: string;
  languageMode?: string;
  depth?: string;
  preferredCurrency?: string;
  sourceStoryIds?: string[];
  structuredBrief: StructuredBrief;
  emailSummary?: string[];
  generatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
