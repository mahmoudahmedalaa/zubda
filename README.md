# Zubda / زبدة

Arabic-first personal intelligence for ambitious GCC/MENA professionals.

Zubda turns news, markets, AI/tech, industry updates, and global events into one personalized daily brief: what changed, why it matters, what to watch, and what it means for the user’s work, money, industry, or conversations.

## Product Direction

Zubda is not a generic news feed, finance app, or newsletter clone. The product promise is:

> الزبدة مما يهمك  
> The bottom line on what matters to you.

The MVP is a mobile-first web/PWA experience with:

- Arabic-first UI with English and mixed-language modes.
- One primary Personal Intelligence Profile per user.
- Multiple interest modules instead of rigid vertical products.
- Daily private web brief with source-backed insights.
- Email delivery trigger through Resend.
- Firebase Auth and Firestore as the app backend.
- Stripe Checkout, subscriptions, lifetime plan, and webhook-based entitlements from day one.
- AI provider abstraction for Gemini/OpenAI model routing.

## Current Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS v4.
- Hosting: Vercel.
- Auth and database: Firebase Auth + Firestore.
- Payments: Stripe Checkout + Stripe webhooks.
- Email: Resend.
- AI: Gemini/OpenAI adapters behind a provider abstraction.
- Tests and verification: ESLint, TypeScript, Vitest, Playwright.

Firebase project:

- Project ID: `zubda-d075c`
- Firestore database: `(default)` in `me-central2`
- Console: `https://console.firebase.google.com/u/0/project/zubda-d075c/overview`

Stripe account/resources:

- Account display name: `PinkySwear`
- Pro Monthly product: `prod_UYIOIqnk4xP9rD`
- Founder Lifetime product: `prod_UYIOkBBGs9SKd1`
- Price IDs are included in `.env.example`; secret and publishable keys still need to be added from Stripe Dashboard.

Domain check through Vercel:

- `zubda.ai` is not available for purchase.
- Available fallbacks: `zubda.app`, `getzubda.com`, `tryzubda.com`, `zubda.co`.

## Local Development

```bash
pnpm install
pnpm dev
```

The app runs on `http://localhost:3000` unless that port is occupied.

Useful checks:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Environment

Copy `.env.example` to `.env.local` and fill in real credentials.

Important: do not commit `.env.local` or service account secrets.

Required systems for the full MVP:

- Firebase client config.
- Firebase Admin service account.
- Stripe secret key, publishable key, price IDs, and webhook secret.
- Resend API key.
- Gemini and/or OpenAI API key.
- Cron secret.

## Key Routes

- `/` landing page.
- `/login` email/password and Google sign-in.
- `/login/finish` legacy email-link callback.
- `/pricing` Free, Pro Monthly, Founder Lifetime.
- `/onboarding` and `/onboarding/[step]`.
- `/app/today`.
- `/app/briefs/[briefId]`.
- `/app/archive`.
- `/admin`.
- `/api/me`.
- `/api/health/firebase`.
- `/api/stripe/checkout`.
- `/api/stripe/webhook`.
- `/api/cron/source-collection`.
- `/api/cron/generate-briefs`.
- `/api/cron/send-brief-emails`.

## Docs

Project truth lives in:

- `PRODUCT.md`
- `DESIGN.md`
- `01-docs/PRD.md`
- `01-docs/APP_FLOW.md`
- `01-docs/TECH_STACK.md`
- `01-docs/FRONTEND_GUIDELINES.md`
- `01-docs/BACKEND_STRUCTURE.md`
- `01-docs/IMPLEMENTATION_PLAN.md`

Agent workflow starts from `AGENTS.md`.

## Current Status

Completed foundation work:

- Next.js app scaffold.
- Arabic-first Drahim-inspired visual direction with clearer typography, larger Arabic copy, blue/lavender palette, and cleaner Arabic-only UI language.
- Landing, pricing, onboarding, brief, archive, settings, and admin screens.
- Firebase project and Web app config for `zubda-d075c`.
- Firebase client/admin helpers.
- Firestore database created in `me-central2`, rules deployed, system collections seeded.
- Firebase Auth client flows for Google and email/password.
- Auth sync endpoint that creates/updates the Firestore user record after sign-up/sign-in.
- Authenticated `/api/me` token-verification path.
- Auth-guarded onboarding wizard with profile persistence API.
- Stripe Checkout, webhook, and Customer Portal API routes.
- Stripe products/prices created for Pro Monthly and Founder Lifetime in USD/AED/SAR.
- AI provider abstraction with Gemini, OpenAI, and deterministic fallback.
- Cron routes for source story seeding, profile-based brief generation, generation job logging, and Resend email delivery.
- Authenticated private brief APIs, archive APIs, feedback API, and Firestore-backed brief reader UI.
- Entitlement-aware profile limits and Free archive gating.
- Source logs stored for each generated brief.
- Basic Firestore event logging for auth, onboarding, checkout, brief opens, generated briefs, emails, and feedback.
- Communication style and open personal-context fields in onboarding, so the AI can personalize tone, framing, and relevance beyond topic filters.
- Full email/password signup → onboarding → `/app/today` browser smoke test verified locally against Firebase Auth.
- TypeScript, ESLint, Vitest, and production `next build` are passing locally.

Next implementation priorities:

1. Add Stripe secret key, publishable key, and webhook secret locally/Vercel.
2. Add Resend API key and verify `morning@zubda.ai`.
3. Add Gemini/OpenAI API keys for real AI generation beyond deterministic seeded stories.
4. Verify Stripe Checkout + webhook entitlement in Stripe test mode after keys are added.
