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
- AI: Gemini/OpenAI adapters planned behind a provider abstraction.
- Tests and verification: ESLint, TypeScript, Vitest, Playwright.

Firebase project:

- Project ID: `zubda-d075c`
- Console: `https://console.firebase.google.com/u/0/project/zubda-d075c/overview`

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
- FX provider key for in-brief currency conversion.

## Key Routes

- `/` landing page.
- `/login` magic link and Google sign-in.
- `/login/finish` email-link callback.
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

## Docs

Project truth lives in:

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
- Arabic-first visual direction and route skeletons.
- Landing, pricing, onboarding, brief, archive, settings, and admin shells.
- Firebase client/admin helpers.
- Firestore collection constants and draft rules.
- Firebase Auth client flows for Google and email magic links.
- Authenticated `/api/me` token-verification path.
- Basic plan entitlement constants and tests.

Next implementation priorities:

1. Add real Firebase env vars and verify Google/magic-link auth.
2. Implement Firestore user/profile creation after sign-in.
3. Build the onboarding persistence flow.
4. Create Stripe products/prices and wire Checkout.
5. Implement Stripe webhook entitlement updates.
