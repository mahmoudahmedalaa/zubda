"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPopup
} from "firebase/auth";
import { authedFetch } from "@/lib/api/client";
import { getFirebaseAuth } from "@/lib/firebase/client";

const emailStorageKey = "zubda.emailForSignIn";

export async function sendMagicLink(email: string): Promise<void> {
  const auth = getFirebaseAuth();

  await sendSignInLinkToEmail(auth, email, {
    url: `${window.location.origin}/login/finish`,
    handleCodeInApp: true
  });

  window.localStorage.setItem(emailStorageKey, email);
}

export async function signInWithGoogle(): Promise<void> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  await signInWithPopup(auth, provider);
}

export async function signInWithEmailPassword(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function createAccountWithEmailPassword(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function syncSignedInUser(): Promise<void> {
  const response = await authedFetch("/api/auth/sync", { method: "POST" });

  if (!response.ok) {
    throw new Error("تم الدخول، لكن ما قدرنا نجهز حسابك داخل زبدة.");
  }
}

export function isMagicLink(url: string): boolean {
  return isSignInWithEmailLink(getFirebaseAuth(), url);
}

export async function completeMagicLink(url: string, fallbackEmail?: string): Promise<void> {
  const auth = getFirebaseAuth();
  const storedEmail = window.localStorage.getItem(emailStorageKey);
  const email = storedEmail ?? fallbackEmail;

  if (!email) {
    throw new Error("Email is required to complete magic-link sign-in.");
  }

  await signInWithEmailLink(auth, email, url);
  window.localStorage.removeItem(emailStorageKey);
}
