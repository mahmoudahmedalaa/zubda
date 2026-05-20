export const interestModules = [
  "Finance and investing",
  "AI and technology",
  "GCC business",
  "Global economy",
  "Energy and oil",
  "Sustainability and climate",
  "Startups and VC",
  "Real estate",
  "Fashion and luxury",
  "Retail and consumer trends",
  "Geopolitics",
  "Public sector and policy",
  "Sports business",
  "Healthcare",
  "User-defined topics"
] as const;

export const currencies = ["USD", "AED", "SAR", "EGP", "QAR", "KWD", "BHD", "OMR"] as const;

export const onboardingSteps = [
  "language",
  "region",
  "role",
  "goal",
  "interests",
  "watchlist",
  "currency",
  "depth",
  "delivery",
  "preview"
] as const;

export type OnboardingStep = (typeof onboardingSteps)[number];
