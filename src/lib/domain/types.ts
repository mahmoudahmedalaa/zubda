export type LanguageMode = "arabic" | "english" | "mixed";
export type BriefDepth = "quick" | "standard" | "deep";
export type Plan = "free" | "pro_monthly" | "founder_lifetime";
export type EntitlementStatus = "free" | "active" | "past_due" | "canceled" | "lifetime";
export type SupportedCurrency = "USD" | "AED" | "SAR" | "EGP" | "QAR" | "KWD" | "BHD" | "OMR";

export type UserDocument = {
  email: string;
  displayName?: string;
  photoURL?: string;
  primaryProfileId?: string;
  stripeCustomerId?: string;
  plan: Plan;
  entitlementStatus: EntitlementStatus;
  subscriptionStatus?: string;
  subscriptionId?: string;
  currentPeriodEnd?: Date;
  lifetimePurchasedAt?: Date;
  billingCurrency?: SupportedCurrency;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileDocument = {
  userId: string;
  name: string;
  isPrimary: boolean;
  languageMode: LanguageMode;
  region: string;
  role: string;
  mainGoals: string[];
  interestModuleIds: string[];
  userDefinedTopics?: string[];
  watchlistIds?: string[];
  communicationStyle?: string;
  personalContext?: string;
  briefDepth: BriefDepth;
  deliveryTime: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
};
