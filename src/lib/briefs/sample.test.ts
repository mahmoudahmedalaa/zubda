import { describe, expect, it } from "vitest";
import { buildStructuredBrief, selectStoriesForProfile, sourceStorySeeds } from "@/lib/briefs/sample";
import type { ProfilePayload } from "@/lib/profile/schema";

const profile: ProfilePayload = {
  languageMode: "mixed",
  region: "الإمارات",
  regionFocus: ["الإمارات", "السعودية"],
  role: "مستشار",
  roleOther: "",
  mainGoals: ["أبقى مطّلع بدون تصفح كثير"],
  interestModuleIds: ["المال والاستثمار", "الذكاء الاصطناعي والتقنية", "أعمال الخليج"],
  watchlist: ["Nvidia"],
  sourcePreferences: [],
  avoidTopics: [],
  communicationStyle: "مختصر ومباشر",
  decisionContext: "مستشار يحتاج نقاط واضحة للاجتماعات",
  personalContext: "مستشار يحتاج نقاط واضحة للاجتماعات",
  briefDepth: "standard",
  deliveryTime: "09:00",
  timezone: "Asia/Dubai"
};

describe("brief sample pipeline", () => {
  it("prioritizes stories by interests, region, and watchlist", () => {
    const selected = selectStoriesForProfile(profile, sourceStorySeeds);

    expect(selected).toHaveLength(4);
    expect(selected[0].entityTags).toContain("Nvidia");
  });

  it("builds a sourced Arabic structured brief", () => {
    const brief = buildStructuredBrief(profile, sourceStorySeeds);

    expect(brief.headline).toContain("زبدة");
    expect(brief.watchboard[0].sourceStoryId).toBeTruthy();
    expect(brief.sources[0].id).toBeTruthy();
    expect(brief.glossary[0].explanation).toContain("السندات");
  });
});
