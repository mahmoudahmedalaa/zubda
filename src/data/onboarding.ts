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

export const languageModes = [
  { label: "عربي", value: "arabic" },
  { label: "English", value: "english" },
  { label: "Mixed", value: "mixed" }
] as const;

export const regions = ["UAE", "Saudi", "Egypt", "Qatar", "Kuwait", "Bahrain", "Oman", "MENA", "Global"] as const;

export const roles = [
  "Consultant",
  "Founder",
  "Investor",
  "Corporate / Strategy",
  "Tech / Product",
  "Government / Policy",
  "Student",
  "Creator",
  "Other"
] as const;

export const mainGoals = [
  "أكون مطّلع قبل الدوام",
  "أتابع السوق والاستثمار",
  "أفهم التقنية والذكاء الاصطناعي",
  "أتابع مجالي وعملائي",
  "أقلل وقت التصفح"
] as const;

export const briefDepths = [
  { label: "Quick", value: "quick" },
  { label: "Standard", value: "standard" },
  { label: "Deep", value: "deep" }
] as const;

export const deliveryTimes = ["06:30", "07:00", "07:30", "08:00", "09:00"] as const;

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
export type InterestModule = (typeof interestModules)[number];
