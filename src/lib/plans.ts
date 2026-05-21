export type PlanKey = "free" | "pro_monthly" | "founder_lifetime";

export type EntitlementStatus = "free" | "active" | "past_due" | "canceled" | "lifetime";

export const planLimits: Record<
  PlanKey,
  {
    maxInterestModules: number;
    maxWatchlistItems: number;
    archiveDays: number | null;
    archiveSearch: boolean;
    deeperBrief: boolean;
    sourcePreferences: boolean;
    customDeliveryTime: boolean;
  }
> = {
  free: {
    maxInterestModules: 2,
    maxWatchlistItems: 5,
    archiveDays: 7,
    archiveSearch: false,
    deeperBrief: false,
    sourcePreferences: false,
    customDeliveryTime: false
  },
  pro_monthly: {
    maxInterestModules: 15,
    maxWatchlistItems: 50,
    archiveDays: null,
    archiveSearch: true,
    deeperBrief: true,
    sourcePreferences: true,
    customDeliveryTime: true
  },
  founder_lifetime: {
    maxInterestModules: 15,
    maxWatchlistItems: 50,
    archiveDays: null,
    archiveSearch: true,
    deeperBrief: true,
    sourcePreferences: true,
    customDeliveryTime: true
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
