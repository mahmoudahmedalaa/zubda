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
  { label: "عربي مع مصطلحات إنجليزية", value: "mixed" },
  { label: "English", value: "english" }
] as const;

export const regions = ["الإمارات", "السعودية", "مصر", "قطر", "الكويت", "البحرين", "عُمان", "الخليج", "العالم"] as const;

export const roles = [
  "مستشار",
  "مؤسس",
  "مستثمر",
  "إدارة أو استراتيجية",
  "تقنية أو منتج",
  "تسويق أو نمو",
  "مبيعات أو شراكات",
  "قطاع حكومي أو سياسات",
  "إعلام أو صناعة محتوى",
  "طالب أو بداية مهنية",
  "غير ذلك"
] as const;

export const mainGoals = [
  "أبقى مطّلع بدون تصفح كثير",
  "أتابع السوق والاستثمار",
  "أفهم التقنية والذكاء الاصطناعي",
  "أتابع مجالي وعملائي",
  "أطلع بنقاط تنفعني في الاجتماعات"
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

export const deliveryTimes = ["09:00", "13:00", "18:00", "21:00"] as const;

export const onboardingSteps = [
  "role",
  "region",
  "goal",
  "interests",
  "watchlist",
  "about",
  "communication",
  "depth",
  "delivery",
  "preview"
] as const;

export type OnboardingStep = (typeof onboardingSteps)[number];
export type InterestModule = (typeof interestModules)[number];
export type CommunicationStyle = (typeof communicationStyles)[number];
