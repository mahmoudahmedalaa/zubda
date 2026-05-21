export type PlanKey = "free" | "pro_monthly" | "founder_lifetime";

export type EntitlementStatus = "free" | "active" | "past_due" | "canceled" | "lifetime";

export const planLimits: Record<
  PlanKey,
  {
    maxInterestModules: number;
    maxWatchlistItems: number;
    archiveDays: number | null;
    archiveSearch: boolean;
    currencyConversion: boolean;
    deeperBrief: boolean;
  }
> = {
  free: {
    maxInterestModules: 3,
    maxWatchlistItems: 5,
    archiveDays: 7,
    archiveSearch: false,
    currencyConversion: false,
    deeperBrief: false
  },
  pro_monthly: {
    maxInterestModules: 15,
    maxWatchlistItems: 50,
    archiveDays: null,
    archiveSearch: true,
    currencyConversion: true,
    deeperBrief: true
  },
  founder_lifetime: {
    maxInterestModules: 15,
    maxWatchlistItems: 50,
    archiveDays: null,
    archiveSearch: true,
    currencyConversion: true,
    deeperBrief: true
  }
};

export function effectivePlanForEntitlement(plan: unknown, status: unknown): PlanKey {
  if (plan === "founder_lifetime" && (status === "lifetime" || status === "active")) {
    return "founder_lifetime";
  }

  if (plan === "pro_monthly" && status === "active") {
    return "pro_monthly";
  }

  return "free";
}
