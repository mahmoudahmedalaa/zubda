import type { ProfilePayload } from "@/lib/profile/schema";

export type SupportedCurrency = ProfilePayload["preferredCurrency"];

const usdRates: Record<SupportedCurrency, number> = {
  USD: 1,
  AED: 3.6725,
  SAR: 3.75,
  EGP: 47.35,
  QAR: 3.64,
  KWD: 0.307,
  BHD: 0.376,
  OMR: 0.385
};

const currencyNames: Record<SupportedCurrency, string> = {
  USD: "دولار",
  AED: "درهم",
  SAR: "ريال",
  EGP: "جنيه",
  QAR: "ريال قطري",
  KWD: "دينار كويتي",
  BHD: "دينار بحريني",
  OMR: "ريال عماني"
};

function compactArabicNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(value >= 10_000_000_000 ? 0 : 1)} مليار`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)} مليون`;
  }

  return new Intl.NumberFormat("ar", { maximumFractionDigits: 1 }).format(value);
}

export function convertUsd(amountUsd: number, currency: SupportedCurrency): number {
  return amountUsd * usdRates[currency];
}

export function formatUsdConversion(amountUsd: number, currency: SupportedCurrency): string {
  const converted = convertUsd(amountUsd, currency);
  const usdLabel = `$${compactArabicNumber(amountUsd)}`;

  if (currency === "USD") {
    return usdLabel;
  }

  return `${usdLabel} ≈ ${compactArabicNumber(converted)} ${currencyNames[currency]}`;
}

export function usdRateLabel(currency: SupportedCurrency): string {
  if (currency === "USD") {
    return "عملة الأساس";
  }

  return `1 دولار ≈ ${usdRates[currency]} ${currencyNames[currency]}`;
}
