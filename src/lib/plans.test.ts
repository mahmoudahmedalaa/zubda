import { describe, expect, it } from "vitest";
import { planLimits } from "./plans";

describe("planLimits", () => {
  it("keeps Free constrained below paid plans", () => {
    expect(planLimits.free.maxInterestModules).toBeLessThan(planLimits.pro_monthly.maxInterestModules);
    expect(planLimits.free.archiveSearch).toBe(false);
    expect(planLimits.pro_monthly.archiveSearch).toBe(true);
    expect(planLimits.founder_lifetime.deeperBrief).toBe(true);
  });
});
