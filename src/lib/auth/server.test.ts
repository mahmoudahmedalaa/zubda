import { describe, expect, it } from "vitest";
import { getBearerToken } from "@/lib/auth/server";

describe("getBearerToken", () => {
  it("extracts bearer tokens from authorization headers", () => {
    const request = new Request("http://localhost/api/me", {
      headers: { authorization: "Bearer test-token" }
    });

    expect(getBearerToken(request)).toBe("test-token");
  });

  it("returns null for missing or malformed authorization headers", () => {
    expect(getBearerToken(new Request("http://localhost/api/me"))).toBeNull();
    expect(
      getBearerToken(
        new Request("http://localhost/api/me", {
          headers: { authorization: "Basic nope" }
        })
      )
    ).toBeNull();
  });
});

