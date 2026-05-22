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
  AI_PROVIDER: z.enum(["gemini", "openai", "openai_compatible"]).default("gemini"),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AI_COMPATIBLE_API_KEY: z.string().optional(),
  AI_COMPATIBLE_BASE_URL: z.string().url().optional(),
  AI_COMPATIBLE_MODEL: z.string().optional(),
  AI_SUMMARY_MODEL: z.string().optional(),
  AI_CLASSIFICATION_MODEL: z.string().optional(),
  AI_FINAL_BRIEF_MODEL: z.string().optional(),
  AI_QUALITY_CHECK_MODEL: z.string().optional(),
  FMP_API_KEY: z.string().optional(),
  BRAVE_SEARCH_API_KEY: z.string().optional(),
  TAVILY_API_KEY: z.string().optional()
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
});

export const serverEnv = serverEnvSchema.parse({
  APP_ENV: process.env.APP_ENV,
  CRON_SECRET: process.env.CRON_SECRET,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_PRO_MONTHLY_USD: process.env.STRIPE_PRICE_PRO_MONTHLY_USD,
  STRIPE_PRICE_PRO_MONTHLY_AED: process.env.STRIPE_PRICE_PRO_MONTHLY_AED,
  STRIPE_PRICE_PRO_MONTHLY_SAR: process.env.STRIPE_PRICE_PRO_MONTHLY_SAR,
  STRIPE_PRICE_FOUNDER_LIFETIME_USD: process.env.STRIPE_PRICE_FOUNDER_LIFETIME_USD,
  STRIPE_PRICE_FOUNDER_LIFETIME_AED: process.env.STRIPE_PRICE_FOUNDER_LIFETIME_AED,
  STRIPE_PRICE_FOUNDER_LIFETIME_SAR: process.env.STRIPE_PRICE_FOUNDER_LIFETIME_SAR,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  AI_PROVIDER: process.env.AI_PROVIDER,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AI_COMPATIBLE_API_KEY: process.env.AI_COMPATIBLE_API_KEY,
  AI_COMPATIBLE_BASE_URL: process.env.AI_COMPATIBLE_BASE_URL,
  AI_COMPATIBLE_MODEL: process.env.AI_COMPATIBLE_MODEL,
  AI_SUMMARY_MODEL: process.env.AI_SUMMARY_MODEL,
  AI_CLASSIFICATION_MODEL: process.env.AI_CLASSIFICATION_MODEL,
  AI_FINAL_BRIEF_MODEL: process.env.AI_FINAL_BRIEF_MODEL,
  AI_QUALITY_CHECK_MODEL: process.env.AI_QUALITY_CHECK_MODEL,
  FMP_API_KEY: process.env.FMP_API_KEY,
  BRAVE_SEARCH_API_KEY: process.env.BRAVE_SEARCH_API_KEY,
  TAVILY_API_KEY: process.env.TAVILY_API_KEY
});
