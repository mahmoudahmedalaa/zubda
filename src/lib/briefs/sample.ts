import type { ProfilePayload } from "@/lib/profile/schema";
import type { InterestModule } from "@/data/onboarding";
import type { StructuredBrief } from "@/lib/briefs/types";

export type SourceStorySeed = {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  publisher: string;
  sourceType: "official" | "rss" | "newsletter" | "open_web" | "user_source";
  topicTags: InterestModule[];
  regionTags: string[];
  entityTags: string[];
  reliabilityLabel: "high" | "medium" | "low";
  language: "ar" | "en";
};

export const sourceStorySeeds: SourceStorySeed[] = [
  {
    id: "fed-yields-tech-watch",
    title: "ترقب تصريحات الفيدرالي وتأثيرها على عوائد السندات",
    summary:
      "المستثمرون يراقبون نبرة الفيدرالي لأن أي تشدد إضافي قد يرفع العوائد ويضغط على أسهم النمو والتقنية.",
    sourceUrl: "https://www.federalreserve.gov/newsevents.htm",
    publisher: "Federal Reserve",
    sourceType: "official",
    topicTags: ["الاقتصاد العالمي", "المال والاستثمار", "الذكاء الاصطناعي والتقنية"],
    regionTags: ["Global", "UAE", "Saudi"],
    entityTags: ["Fed", "Nasdaq", "QQQ"],
    reliabilityLabel: "high",
    language: "en"
  },
  {
    id: "oil-prices-gcc-business",
    title: "أسعار النفط تبقى محوراً مهماً لأسواق الخليج",
    summary:
      "تحركات النفط ما زالت تؤثر على المزاج الاستثماري في الخليج، خصوصاً مع حساسية الميزانيات والقطاعات المرتبطة بالطاقة.",
    sourceUrl: "https://www.opec.org/opec_web/en/press_room/28.htm",
    publisher: "OPEC",
    sourceType: "official",
    topicTags: ["الطاقة والنفط", "أعمال الخليج", "المال والاستثمار"],
    regionTags: ["Saudi", "UAE", "GCC"],
    entityTags: ["Oil", "OPEC"],
    reliabilityLabel: "high",
    language: "en"
  },
  {
    id: "nvidia-ai-spending",
    title: "إنفاق الذكاء الاصطناعي يضع نتائج Nvidia تحت المجهر",
    summary:
      "نتائج Nvidia أصبحت مؤشراً على شهية الشركات للإنفاق على البنية التحتية للذكاء الاصطناعي والسحابة.",
    sourceUrl: "https://investor.nvidia.com/news/default.aspx",
    publisher: "Nvidia Investor Relations",
    sourceType: "official",
    topicTags: ["الذكاء الاصطناعي والتقنية", "المال والاستثمار"],
    regionTags: ["Global"],
    entityTags: ["Nvidia", "AI", "Cloud"],
    reliabilityLabel: "high",
    language: "en"
  },
  {
    id: "gcc-real-estate-rates",
    title: "العقار الخليجي يراقب اتجاه الفائدة والسيولة",
    summary:
      "أي تغيير في توقعات الفائدة ينعكس على تكلفة التمويل، وهذا مهم للقطاع العقاري والمشاريع الكبرى.",
    sourceUrl: "https://www.centralbank.ae/en/news-and-media/",
    publisher: "Central Bank UAE",
    sourceType: "official",
    topicTags: ["العقار", "أعمال الخليج", "الاقتصاد العالمي"],
    regionTags: ["UAE", "Saudi", "GCC"],
    entityTags: ["Real estate", "Rates"],
    reliabilityLabel: "medium",
    language: "en"
  }
];

export function selectStoriesForProfile(
  profile: Pick<ProfilePayload, "interestModuleIds" | "region" | "watchlist">,
  stories: SourceStorySeed[]
): SourceStorySeed[] {
  const watchlist = new Set(profile.watchlist.map((item) => item.toLowerCase()));

  return stories
    .map((story) => {
      const topicScore = story.topicTags.filter((tag) => profile.interestModuleIds.includes(tag)).length * 3;
      const regionScore = story.regionTags.includes(profile.region) || story.regionTags.includes("GCC") ? 2 : 0;
      const watchScore = story.entityTags.some((entity) => watchlist.has(entity.toLowerCase())) ? 4 : 0;
      return { story, score: topicScore + regionScore + watchScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ story }) => story);
}

export function buildStructuredBrief(profile: ProfilePayload, stories: SourceStorySeed[]): StructuredBrief {
  const selectedStories = selectStoriesForProfile(profile, stories);
  const lead = selectedStories[0] ?? sourceStorySeeds[0];

  return {
    headline: "زبدة اليوم جاهزة",
    executiveSnapshot: {
      title: "الملخص",
      body: `${lead.summary} باقي الإشارات مرتبة حسب اهتماماتك ومنطقتك.`
    },
    watchboard: selectedStories.map((story) => ({
      sourceStoryId: story.id,
      title: story.title,
      time: "اليوم",
      why: story.summary,
      impact: story.topicTags.slice(0, 2).join("، "),
      plainArabic: story.summary
    })),
    personalImpact: {
      title: "وش أثرها عليك؟",
      body: `حسب دورك كـ ${profile.role} واهتماماتك، ركز اليوم على ${selectedStories
        .flatMap((story) => story.topicTags)
        .slice(0, 3)
        .join("، ")}.`
    },
    talkingPoints: selectedStories.slice(0, 3).map((story) => `اللي يستحق المتابعة: ${story.title}`),
    glossary: [
      {
        term: "عوائد السندات",
        explanation: "العائد الذي يحصل عليه المستثمر من السندات. ارتفاعه قد يقلل جاذبية أسهم النمو."
      }
    ],
    sources: selectedStories.map((story) => ({
      id: story.id,
      title: story.title,
      publisher: story.publisher,
      url: story.sourceUrl,
      reliabilityLabel: story.reliabilityLabel,
      whyIncluded: "ظهر لأنه مرتبط باهتماماتك أو منطقتك أو قائمة المتابعة."
    }))
  };
}
