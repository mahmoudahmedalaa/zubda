# Technology Stack — Zubda / زبدة

> Every technology decision is locked for MVP unless this document is updated. Current package versions were checked with `npm view` on May 20, 2026.

## 1. Stack Overview

| Dimension | Decision | Justification |
|:----------|:---------|:--------------|
| **Architecture** | Next.js web/PWA with Firebase-backed BaaS and server-side API routes | Fast to ship, mobile-first, supports authenticated private briefs, scheduled jobs, Stripe webhooks, and future native apps |
| **Platform** | Mobile-first web app / PWA | Avoids App Store friction while supporting iPhone, Android, and desktop |
| **Deployment** | Vercel | Best fit for Next.js hosting, API routes, environment variables, and MVP cron jobs |
| **Auth + Database** | Firebase Auth + Firestore | Avoids creating another Supabase project; supports Google login, email link auth, user profiles, brief archives, source logs, and entitlement state |
| **Payments** | Stripe Checkout + Stripe Billing + Stripe webhooks | Real checkout, subscription state, lifetime plan, entitlements, and customer portal from day one |
| **Email** | Resend | Daily brief trigger email with short summary and CTA to private web brief |
| **AI** | Provider abstraction with Gemini and OpenAI adapters | Keeps cost and quality tunable; avoids hardcoding one model/provider |
| **Analytics** | Firestore event logs first | Simple and sufficient for MVP; PostHog can be added later |
| **Scale Target** | 50-100 beta users by week 6; architecture should tolerate first 1K users | Source/story caching avoids per-user expensive research |

### Non-Negotiables
- Do not use Supabase.
- Do not use manual payments.
- Stripe is required from day one.
- Do not hardcode OpenAI as the only AI provider.
- Do not use a ChatGPT subscription as app backend infrastructure.
- Do not put the full report inside email.
- Use one primary profile per user for MVP.

---

## 2. Frontend Stack

| Technology | Version | Purpose | Docs | Alternative Considered |
|:-----------|:--------|:--------|:-----|:-----------------------|
| **Framework** | Next.js `16.2.6` | App Router web/PWA, API routes, server actions, Vercel deployment | https://nextjs.org/docs | Native app rejected for MVP speed |
| **React** | React `19.2.6` | UI runtime | https://react.dev | Older React rejected to stay aligned with current Next.js |
| **Language** | TypeScript `6.0.3` | Type safety across app, API routes, and data contracts | https://www.typescriptlang.org/docs/ | JavaScript rejected due to payment/auth/AI complexity |
| **Styling** | Tailwind CSS `4.3.0` + `@tailwindcss/postcss` `4.3.0` | Token-driven responsive UI with RTL-aware classes | https://tailwindcss.com/docs | Plain CSS rejected for slower iteration |
| **UI Primitives** | Radix UI Dialog `1.1.15`, Dropdown Menu `2.1.16`, Tooltip `1.2.8` | Accessible drawers, dialogs, menus, and glossary/source disclosure | https://www.radix-ui.com/primitives | Heavy component kit rejected to preserve Zubda's brand |
| **Icons** | lucide-react `1.16.0` | Clean icon set for actions and controls | https://lucide.dev | Custom SVGs rejected unless a branded mark needs it |
| **Forms** | react-hook-form `7.76.0` + zod `4.4.3` | Onboarding, profile, pricing, admin validation | https://react-hook-form.com / https://zod.dev | Manual form state rejected for validation risk |
| **Animations** | framer-motion `12.39.0` | Subtle brief generation, drawer, card, and completion motion | https://motion.dev | Heavy animation frameworks rejected |
| **Charts / Visuals** | recharts `3.8.1` | Simple MVP charts if needed for watchboard/market context | https://recharts.org | Complex BI charting rejected for MVP |
| **Dates** | date-fns `4.2.1` | Delivery dates, timestamps, archive grouping | https://date-fns.org | Moment rejected due to size |
| **Currency Formatting** | Native `Intl.NumberFormat` | USD/AED/SAR/EGP display and in-brief conversion | https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat | Custom formatting rejected |

---

## 3. Backend Stack

| Technology | Version | Purpose | Docs | Alternative Considered |
|:-----------|:--------|:--------|:-----|:-----------------------|
| **Runtime** | Node.js `22.x` on Vercel | API routes, webhooks, scheduled jobs, AI pipeline | https://vercel.com/docs/functions | Separate server rejected for MVP |
| **Database** | Firestore via firebase `12.13.0` and firebase-admin `13.10.0` | Profiles, briefs, source stories, source logs, feedback, Stripe state, events | https://firebase.google.com/docs/firestore | Supabase rejected by product decision |
| **Auth** | Firebase Auth | Google login and magic link / email link login | https://firebase.google.com/docs/auth | Email/password rejected for MVP |
| **File Storage** | Firebase Storage later only if needed | Future generated assets or share images | https://firebase.google.com/docs/storage | Not needed for MVP core |
| **Payments** | Stripe Node `22.1.1`, Stripe API `2026-02-25.clover` | Checkout Sessions, Billing subscriptions, one-time lifetime purchase, webhooks, Customer Portal | https://docs.stripe.com | Manual payments rejected |
| **Email** | Resend `6.12.3` | Daily brief email and auth/product notifications if needed | https://resend.com/docs | Full report in email rejected |
| **AI: Gemini** | `@google/generative-ai` `0.24.1` | Low-cost summarization, classification, and possible brief synthesis | https://ai.google.dev/docs | Single-provider AI rejected |
| **AI: OpenAI** | openai `6.38.0` | Alternative models for comparison, synthesis, tone polish, quality checks | https://platform.openai.com/docs | Hardcoded OpenAI rejected |
| **Scheduling** | Vercel Cron | Shared daily source collection and generation jobs | https://vercel.com/docs/cron-jobs | Cloud Scheduler later if user-specific timing grows |
| **Analytics** | Firestore event logs | MVP event tracking without another vendor | https://firebase.google.com/docs/firestore | PostHog deferred |
| **FX** | Exchange-rate API, provider TBD | Daily or near-real-time in-brief currency conversion | TBD | Live FX checkout rejected |

---

## 4. Payments Architecture

### Plans

| Plan | Price | Stripe Mode | Entitlement |
|:-----|:------|:------------|:------------|
| Free | `$0` | None | Basic daily brief, 1 primary profile, up to 3 interest modules, limited watchlist/archive |
| Pro Monthly | `$7.99/month`, `AED 29/month`, `SAR 29/month` | Checkout Session `mode: subscription` | Active while subscription is active or trialing |
| Founder Lifetime | `$99`, `AED 399`, `SAR 399` | Checkout Session `mode: payment` | Lifetime entitlement unless refunded or admin revoked |

### Stripe Requirements
- Use Stripe Products and Prices.
- Use fixed localized prices for checkout, not live FX.
- Use Stripe Checkout for MVP.
- Use Stripe Customer Portal for billing management if simple.
- Store Stripe customer ID on `users/{userId}`.
- Store subscription and entitlement status in Firestore.
- Treat Stripe webhooks as the source of truth.
- Do not rely on client-side success redirects for entitlement activation.

### Required Webhook Events
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

---

## 5. AI Provider Strategy

### Provider Abstraction
Create a provider interface with Gemini and OpenAI adapters from day one.

Environment selects provider and models:
- `AI_PROVIDER=gemini | openai`
- `AI_SUMMARY_MODEL`
- `AI_CLASSIFICATION_MODEL`
- `AI_FINAL_BRIEF_MODEL`
- `AI_QUALITY_CHECK_MODEL`

### Routing
| Task | Model Strategy |
|:-----|:---------------|
| Source classification/tagging | Cheapest reliable model |
| Source summarization | Cheap model |
| Relevance scoring | Deterministic rules plus cheap model where useful |
| Final brief synthesis | Best cheap-enough model for Arabic quality and trust |
| Arabic tone polish | Better model only if needed |
| Quality check | Cheap model or deterministic validation |

### Cost Control Pipeline
1. Shared daily source collection across broad topics.
2. Normalize sources into reusable story objects.
3. Cache story objects in Firestore.
4. Score cached stories per user profile.
5. Generate personalized briefs from selected cached stories.
6. Store structured JSON, HTML, email summary, source log, delivery log, and feedback hooks.

Never research the whole internet separately for every user.

---

## 6. Development Tools

| Tool | Version | Purpose |
|:-----|:--------|:--------|
| **Package Manager** | pnpm `10.32.1` | Fast, strict dependency installs in the current local workspace |
| **Linter** | ESLint `9.39.4` + eslint-config-next `16.2.6` | Next.js and React code quality; pinned to the newest Next-compatible 9.x line |
| **Formatter** | Prettier `3.8.3` | Consistent formatting |
| **Testing** | Vitest `4.1.7` | Unit tests for data transforms, entitlement rules, provider routing |
| **E2E Testing** | Playwright `1.60.0` | Auth/onboarding/pricing/brief/browser flow checks |
| **Types** | `@types/node` `25.9.1`, `@types/react` `19.2.15`, `@types/react-dom` `19.2.3` | TypeScript support |

---

## 7. Environment Variables

```bash
# Application
NEXT_PUBLIC_APP_URL="https://zubda.ai"
APP_ENV="development"
CRON_SECRET="replace-with-random-secret"

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Firebase Admin
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_PRO_MONTHLY_USD="price_1TZBo3Gt2TNsj9pDMp8ZUMzA"
STRIPE_PRICE_PRO_MONTHLY_AED="price_1TZBo4Gt2TNsj9pDJBktubVa"
STRIPE_PRICE_PRO_MONTHLY_SAR="price_1TZBo6Gt2TNsj9pD28SOPkqO"
STRIPE_PRICE_FOUNDER_LIFETIME_USD="price_1TZBo7Gt2TNsj9pDIZ1BNyWl"
STRIPE_PRICE_FOUNDER_LIFETIME_AED="price_1TZBoEGt2TNsj9pDSW52A5on"
STRIPE_PRICE_FOUNDER_LIFETIME_SAR="price_1TZBoFGt2TNsj9pDJEhHsLUt"

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="morning@zubda.ai"

# AI
AI_PROVIDER="gemini"
GEMINI_API_KEY="..."
OPENAI_API_KEY="..."
AI_SUMMARY_MODEL="..."
AI_CLASSIFICATION_MODEL="..."
AI_FINAL_BRIEF_MODEL="..."
AI_QUALITY_CHECK_MODEL="..."

# FX
FX_API_KEY="..."
FX_PROVIDER="..."
```

---

## 8. Dependencies Lock

### Frontend
```json
{
  "@radix-ui/react-dialog": "1.1.15",
  "@radix-ui/react-dropdown-menu": "2.1.16",
  "@radix-ui/react-tooltip": "1.2.8",
  "@tailwindcss/postcss": "4.3.0",
  "date-fns": "4.2.1",
  "firebase": "12.13.0",
  "framer-motion": "12.39.0",
  "lucide-react": "1.16.0",
  "next": "16.2.6",
  "react": "19.2.6",
  "react-dom": "19.2.6",
  "react-hook-form": "7.76.0",
  "recharts": "3.8.1",
  "tailwindcss": "4.3.0",
  "zod": "4.4.3"
}
```

### Backend / Server
```json
{
  "@google/generative-ai": "0.24.1",
  "firebase-admin": "13.10.0",
  "openai": "6.38.0",
  "resend": "6.12.3",
  "stripe": "22.1.1"
}
```

### Dev
```json
{
  "@types/node": "25.9.1",
  "@types/react": "19.2.15",
  "@types/react-dom": "19.2.3",
  "eslint": "9.39.4",
  "eslint-config-next": "16.2.6",
  "playwright": "1.60.0",
  "prettier": "3.8.3",
  "typescript": "6.0.3",
  "vitest": "4.1.7"
}
```

---

## 9. Security Considerations

| Area | Approach |
|:-----|:---------|
| **Authentication** | Firebase Auth with Google and magic link / email link login |
| **Authorization** | Firestore Security Rules plus server-side Firebase Admin verification |
| **Payments** | Stripe webhooks are source of truth; verify webhook signatures; never trust client redirects |
| **Secrets** | Vercel environment variables only; never commit `.env` |
| **API Security** | Verify Firebase ID token on authenticated API routes |
| **Cron Security** | Require `CRON_SECRET` on scheduled endpoints |
| **Data Protection** | Store only necessary profile, source, feedback, and billing metadata |
| **Copyright** | No paywalled scraping; no long copied excerpts |
| **Rate Limiting** | Add per-user and per-IP throttles for expensive AI and billing endpoints |
| **Admin** | Admin routes require explicit admin claim or allowlist |

---

## 10. Version Upgrade Policy

| Type | Frequency | Process |
|:-----|:----------|:--------|
| **Major** | Quarterly review | Test in staging, review migration guides, verify auth/payment/cron flows |
| **Minor/Patch** | Monthly | Dependabot or manual review, run tests, smoke test |
| **Security** | ASAP | Patch immediately, verify deploy, review logs |
| **Stripe API** | Quarterly | Review Stripe changelog; avoid changing API version without webhook regression tests |
| **Firebase Rules** | Every schema change | Update rules and run access tests before deploy |
