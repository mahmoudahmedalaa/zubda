export const interestModules = [
  "المال والاستثمار",
  "الذكاء الاصطناعي والتقنية",
  "أعمال الخليج",
  "الاقتصاد العالمي",
  "الطاقة والنفط",
  "الاستدامة والمناخ",
  "الشركات الناشئة والاستثمار الجريء",
  "العقار",
  "الموضة والرفاهية",
  "التجزئة والمستهلك",
  "الجغرافيا السياسية",
  "السياسات والقطاع العام",
  "رياضة الأعمال",
  "الصحة",
  "مواضيع تختارها"
] as const;

export const currencies = ["USD", "AED", "SAR", "EGP", "QAR", "KWD", "BHD", "OMR"] as const;

export const languageModes = [
  { label: "عربي", value: "arabic" },
  { label: "English", value: "english" },
  { label: "Mixed", value: "mixed" }
] as const;

export const regions = ["UAE", "Saudi", "Egypt", "Qatar", "Kuwait", "Bahrain", "Oman", "MENA", "Global"] as const;

export const roles = [
  "مستشار",
  "مؤسس",
  "مستثمر",
  "استراتيجية أو إدارة",
  "تقنية أو منتج",
  "قطاع حكومي أو سياسات",
  "طالب",
  "صانع محتوى",
  "غير ذلك"
] as const;

export const mainGoals = [
  "أكون مطّلع قبل الدوام",
  "أتابع السوق والاستثمار",
  "أفهم التقنية والذكاء الاصطناعي",
  "أتابع مجالي وعملائي",
  "أقلل وقت التصفح"
] as const;

export const communicationStyles = [
  "مختصر ومباشر",
  "عملي وفيه نقاط قابلة للاستخدام",
  "تحليلي مع سياق أكثر",
  "خفيف وقريب من الكلام اليومي"
] as const;

export const briefDepths = [
  { label: "سريع", value: "quick" },
  { label: "متوازن", value: "standard" },
  { label: "عميق", value: "deep" }
] as const;

export const deliveryTimes = ["06:30", "07:00", "07:30", "08:00", "09:00"] as const;

export const onboardingSteps = [
  "language",
  "region",
  "role",
  "goal",
  "interests",
  "watchlist",
  "communication",
  "about",
  "depth",
  "delivery",
  "preview"
] as const;

export type OnboardingStep = (typeof onboardingSteps)[number];
export type InterestModule = (typeof interestModules)[number];
export type CommunicationStyle = (typeof communicationStyles)[number];
