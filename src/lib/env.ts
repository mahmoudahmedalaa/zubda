import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional()
});

const serverEnvSchema = z.object({
  APP_ENV: z.string().default("development"),
  CRON_SECRET: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PRO_MONTHLY_USD: z.string().optional(),
  STRIPE_PRICE_PRO_MONTHLY_AED: z.string().optional(),
  STRIPE_PRICE_PRO_MONTHLY_SAR: z.string().optional(),
  STRIPE_PRICE_FOUNDER_LIFETIME_USD: z.string().optional(),
  STRIPE_PRICE_FOUNDER_LIFETIME_AED: z.string().optional(),
  STRIPE_PRICE_FOUNDER_LIFETIME_SAR: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().default("morning@zubda.ai"),
  AI_PROVIDER: z.enum(["gemini", "openai"]).default("gemini"),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AI_SUMMARY_MODEL: z.string().optional(),
  AI_CLASSIFICATION_MODEL: z.string().optional(),
  AI_FINAL_BRIEF_MODEL: z.string().optional(),
  AI_QUALITY_CHECK_MODEL: z.string().optional(),
  FX_PROVIDER: z.string().optional(),
  FX_API_KEY: z.string().optional()
});

export const clientEnv = clientEnvSchema.parse(process.env);
export const serverEnv = serverEnvSchema.parse(process.env);
