"use client";

import { getFirebaseAuth } from "@/lib/firebase/client";

type ApiOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function authedFetch(path: string, options: ApiOptions = {}): Promise<Response> {
  const user = getFirebaseAuth().currentUser;

  if (!user) {
    throw new Error("سجل دخولك أولاً.");
  }

  const token = await user.getIdToken();

  return fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...options.headers,
      authorization: `Bearer ${token}`
    }
  });
}

