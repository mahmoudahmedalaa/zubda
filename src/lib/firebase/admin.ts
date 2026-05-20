import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { serverEnv } from "@/lib/env";

function normalizePrivateKey(privateKey?: string): string | undefined {
  return privateKey?.replace(/\\n/g, "\n");
}

export function hasFirebaseAdminConfig(): boolean {
  return Boolean(
    serverEnv.FIREBASE_PROJECT_ID &&
      serverEnv.FIREBASE_CLIENT_EMAIL &&
      serverEnv.FIREBASE_PRIVATE_KEY
  );
}

export function getFirebaseAdminApp(): App {
  if (!hasFirebaseAdminConfig()) {
    throw new Error("Firebase Admin config is missing. Check FIREBASE_* env vars.");
  }

  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId: serverEnv.FIREBASE_PROJECT_ID,
      clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
      privateKey: normalizePrivateKey(serverEnv.FIREBASE_PRIVATE_KEY)
    })
  });
}

export function getAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDb(): Firestore {
  return getFirestore(getFirebaseAdminApp());
}

