"use client";

import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

const storagePrefixes = ["zubda.", "zubda:"];

function clearStorage(storage: Storage): void {
  for (let index = storage.length - 1; index >= 0; index -= 1) {
    const key = storage.key(index);

    if (key && storagePrefixes.some((prefix) => key.startsWith(prefix))) {
      storage.removeItem(key);
    }
  }
}

export function clearZubdaClientSessionState(): void {
  if (typeof window === "undefined") {
    return;
  }

  clearStorage(window.localStorage);
  clearStorage(window.sessionStorage);
}

export async function signOutCurrentUser(): Promise<void> {
  clearZubdaClientSessionState();
  await signOut(getFirebaseAuth());
  clearZubdaClientSessionState();
}
