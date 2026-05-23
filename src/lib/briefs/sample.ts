import type { ProfilePayload } from "@/lib/profile/schema";
import type { InterestModule } from "@/data/onboarding";
import type { BriefMetric, StructuredBrief } from "@/lib/briefs/types";

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

type BuildStructuredBriefOptions = {
  mode?: "demo" | "production";
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

const storyContext: Record<string, { time: string; why: string; plainArabic: string; metric: string }> = {
  "fed-yields-tech-watch": {
    time: "قبل افتتاح السوق",
    why: "لو لهجة الفيدرالي طلعت متشددة، المستثمرين غالباً يخففون من أسهم النمو والتقنية",
    plainArabic: "الفائدة العالية تخلي المال أغلى، فالشركات التي تعتمد على النمو السريع تتأثر أكثر",
    metric: "عوائد السندات"
  },
  "oil-prices-gcc-business": {
    time: "خلال الجلسة",
    why: "أنت تتابع الخليج والطاقة، والنفط ما زال مؤثراً على المزاج العام للأسواق والميزانيات",
    plainArabic: "إذا النفط تحرك بقوة، غالباً تتحرك معه توقعات المستثمرين تجاه أسواق الخليج",
    metric: "برنت"
  },
  "nvidia-ai-spending": {
    time: "بعد الإغلاق",
    why: "نتائج Nvidia أصبحت إشارة مهمة على قوة الإنفاق في الذكاء الاصطناعي والسحابة",
    plainArabic: "لو Nvidia قوية، السوق يفهم أن موجة الذكاء الاصطناعي ما زالت مستمرة",
    metric: "NVDA"
  },
  "gcc-real-estate-rates": {
    time: "خلال الأسبوع",
    why: "الفائدة والسيولة تؤثر على تكلفة التمويل، وهذا يهم العقار والمشاريع الكبرى في المنطقة",
    plainArabic: "إذا التمويل صار أغلى، المطورون والمشترون يصبحون أكثر حذراً",
    metric: "تمويل العقار"
  }
};

function formatArabicList(items: string[]): string {
  if (items.length === 0) {
    return "اهتماماتك";
  }

  if (items.length === 1) {
    return items[0];
  }

  return `${items.slice(0, -1).join("، ")} و${items[items.length - 1]}`;
}

function profileLens(profile: ProfilePayload): string {
  if (profile.role === "مستثمر") {
    return "كمستثمر";
  }

  if (profile.role === "مؤسس") {
    return "كمؤسس";
  }

  if (profile.role === "مستشار") {
    return "كمستشار";
  }

  return "حسب شغلك واهتماماتك";
}

function normalizedRegions(profile: Pick<ProfilePayload, "region"> & Partial<Pick<ProfilePayload, "regionFocus">>): string[] {
  const map: Record<string, string[]> = {
    الإمارات: ["UAE", "GCC"],
    السعودية: ["Saudi", "GCC"],
    الخليج: ["GCC", "UAE", "Saudi"],
    العالم: ["Global"],
    مصر: ["MENA"],
    قطر: ["GCC"],
    الكويت: ["GCC"],
    البحرين: ["GCC"],
    "عُمان": ["GCC"]
  };
  const rawRegions = [profile.region, ...(profile.regionFocus ?? [])];
  return Array.from(new Set(rawRegions.flatMap((region) => map[region] ?? [region])));
}

function profileStyle(profile: ProfilePayload): string {
  if (profile.communicationStyle) {
    return profile.communicationStyle;
  }

  return "مختصر ومباشر";
}

function profileContextNote(profile: ProfilePayload): string {
  if (profile.decisionContext) {
    return profile.decisionContext.slice(0, 160);
  }

  if (profile.personalContext) {
    return profile.personalContext.slice(0, 160);
  }

  return "ما أضفت تفاصيل شخصية بعد، فاعتمدنا على دورك واهتماماتك المختارة وقائمة المتابعة";
}

export function selectStoriesForProfile(
  profile: Pick<
    ProfilePayload,
    "interestModuleIds" | "region" | "watchlist" | "avoidTopics" | "sourcePreferences"
  > &
    Partial<Pick<ProfilePayload, "regionFocus">>,
  stories: SourceStorySeed[]
): SourceStorySeed[] {
  const watchlist = new Set(profile.watchlist.map((item) => item.toLowerCase()));
  const avoidTopics = new Set(profile.avoidTopics.map((item) => item.toLowerCase()));
  const sourcePreferences = new Set(profile.sourcePreferences.map((item) => item.toLowerCase()));
  const regionFocus = new Set(normalizedRegions(profile));

  return stories
    .filter((story) => {
      const haystack = [story.title, story.summary, story.publisher, ...story.topicTags, ...story.entityTags]
        .join(" ")
        .toLowerCase();
      return !Array.from(avoidTopics).some((topic) => haystack.includes(topic));
    })
    .map((story) => {
      const topicScore = story.topicTags.filter((tag) => profile.interestModuleIds.includes(tag)).length * 3;
      const regionScore = story.regionTags.some((region) => regionFocus.has(region)) ? 2 : 0;
      const watchScore = story.entityTags.some((entity) => watchlist.has(entity.toLowerCase())) ? 4 : 0;
      const sourceScore = sourcePreferences.has(story.publisher.toLowerCase()) ? 2 : 0;
      return { story, score: topicScore + regionScore + watchScore + sourceScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ story }) => story);
}

export function buildStructuredBrief(
  profile: ProfilePayload,
  stories: SourceStorySeed[],
  options: BuildStructuredBriefOptions = {}
): StructuredBrief {
  const selectedStories = selectStoriesForProfile(profile, stories);
  const lead = selectedStories[0] ?? sourceStorySeeds[0];
  const focusTags = Array.from(new Set(selectedStories.flatMap((story) => story.topicTags))).slice(0, 3);
  const watchlistFocus = profile.watchlist.slice(0, 3);
  const watchlistText = formatArabicList(watchlistFocus);
  const focusText = formatArabicList(focusTags);
  const decisionText = profile.decisionContext || profile.personalContext;
  const isDemo = options.mode === "demo";
  const metrics: BriefMetric[] = [
    {
      label: "إشارات مهمة",
      value: String(selectedStories.length),
      change: "حسب اهتماماتك",
      tone: "watch" as const
    },
    {
      label: "أهم ملف",
      value: focusTags[0] ?? "حسب اهتمامك",
      change: "أقرب موضوع لك",
      tone: "good" as const
    }
  ];

  if (isDemo) {
    metrics.unshift({ label: "مزاج السوق", value: "حذر", change: "أسهم النمو تحت الضغط", tone: "watch" });
    metrics.splice(1, 0, { label: "برنت", value: "$84.2", change: "+1.1%", tone: "good" });
  }

  return {
    headline: "الخلاصة",
    executiveSnapshot: {
      title: "الملخص",
      body: `${lead.summary} رتّبنا الباقي ${profileLens(profile)} وبناءً على اهتماماتك المختارة: ${focusText}.`
    },
    metrics,
    sentiment: isDemo
      ? {
          label: "إيجابي بحذر",
          score: 64,
          conviction: 7,
          explanation: "الذكاء الاصطناعي يدعم المزاج العام، لكن الفائدة والنفط يخلون السوق حساس."
        }
      : undefined,
    riskFactors: isDemo
      ? [
          {
            label: "الفائدة",
            score: 8,
            note: "أكبر ضغط على أسهم النمو والتقنية"
          },
          {
            label: "نتائج التقنية",
            score: 7,
            note: "توقعات السوق عالية، خصوصاً حول Nvidia"
          },
          {
            label: "النفط",
            score: 6,
            note: "مهم للخليج ولتوقعات التضخم"
          },
          {
            label: "العقار",
            score: 5,
            note: "يتأثر إذا زادت تكلفة التمويل"
          }
        ]
      : undefined,
    portfolioExposure: isDemo
      ? [
          {
            symbol: "NVDA",
            label: "Nvidia",
            weight: 38,
            bias: "فرصة عالية وتقلب عال",
            note: "أقرب مؤشر على إنفاق الذكاء الاصطناعي"
          },
          {
            symbol: "Oil",
            label: "النفط",
            weight: 28,
            bias: "مهم للخليج",
            note: "يرفع أو يهدئ مزاج أسواق المنطقة"
          },
          {
            symbol: "QQQ",
            label: "ناسداك",
            weight: 24,
            bias: "حساس للفائدة",
            note: "يستفيد من التقنية ويتأثر بالعوائد"
          },
          {
            symbol: "UAE RE",
            label: "عقار الإمارات",
            weight: 10,
            bias: "متابعة هادئة",
            note: "التمويل والسيولة هما المفتاح"
          }
        ]
      : undefined,
    watchboard: selectedStories.map((story) => ({
      sourceStoryId: story.id,
      title: story.title,
      time: storyContext[story.id]?.time ?? "للمتابعة",
      why: storyContext[story.id]?.why ?? story.summary,
      impact: storyContext[story.id]?.metric ?? story.topicTags.slice(0, 1).join("، "),
      plainArabic: storyContext[story.id]?.plainArabic ?? "الموضوع مهم لأنه قريب من اهتماماتك المختارة أو قائمة المتابعة"
    })),
    personalImpact: {
      title: "وش يعني لك؟",
      body: `${profileLens(profile)}، ركز اليوم على ${focusText}. ${
        watchlistText ? `إذا تتابع ${watchlistText}، خذ الأخبار كإشارات تحتاج متابعة لا كقرار جاهز. ` : ""
      }${decisionText ? `السياق اللي ذكرته لنا يخلي الأثر العملي أهم من الخبر نفسه. ` : ""}الزبدة: لا تطارد كل العناوين، راقب المحركات اللي ممكن تغير الصورة.`
    },
    personalizationNotes: [
      `رتبنا الإشارات حسب منطقتك: ${profile.region}`,
      `قائمة متابعتك: ${watchlistText}`,
      `أسلوبك المفضل: ${profileStyle(profile)}`,
      `سياقك: ${profileContextNote(profile)}`,
      profile.sourcePreferences.length ? `مصادرك المفضلة: ${formatArabicList(profile.sourcePreferences.slice(0, 3))}` : "",
      profile.avoidTopics.length ? `نتجنب: ${formatArabicList(profile.avoidTopics.slice(0, 3))}` : ""
    ].filter(Boolean),
    talkingPoints: selectedStories.slice(0, 3).map((story) => story.title),
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
      whyIncluded: "اخترناه لأنه قريب من اهتماماتك المختارة أو منطقتك أو قائمة المتابعة، بدون استخدام مواضيع طلبت تجاهلها."
    }))
  };
}
