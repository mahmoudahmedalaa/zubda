# Implementation Plan & Build Sequence — Zubda / زبدة

> This is the execution plan for a professional MVP: Firebase backend, Stripe from day one, mobile-first PWA, daily private web brief, source-backed AI pipeline.

## Overview

| Field | Value |
|:------|:------|
| **Project** | Zubda / زبدة |
| **Prototype Target** | 2 weeks |
| **MVP Target** | 6 weeks |
| **Approach** | Documentation-first, verify after every step, ship a real payment/auth/data foundation |
| **Primary Platform** | Mobile-first Next.js web/PWA |
| **Backend** | Firebase Auth + Firestore + Firebase Admin in Next.js API routes |
| **Payments** | Stripe Checkout + Billing + webhooks from day one |
| **AI** | Gemini/OpenAI provider abstraction with cached source-story pipeline |

## Build Rules

1. Code follows `01-docs/`, not chat memory.
2. Stripe webhooks are the source of truth for plan entitlements.
3. Firebase is the source of truth for users, profiles, briefs, source logs, events, and billing state.
4. Do not build manual payment workarounds.
5. Do not hardcode OpenAI-only architecture.
6. Build one primary profile per user with many interest modules.
7. Test after every step: typecheck, lint, unit tests where relevant, browser smoke test for UI.
8. Keep the product mobile-first and Arabic-first.

---

## Phase 1: Foundation

### Step 1.1 — Next.js Project Setup
**Duration**: 0.5-1 day  
**Goal**: Running Next.js app with pinned dependencies and quality tooling.

**Context**
- `01-docs/TECH_STACK.md`
- `01-docs/FRONTEND_GUIDELINES.md`

**Tasks**
- [x] Initialize Next.js app with TypeScript.
- [x] Install pinned dependencies from `TECH_STACK.md`.
- [x] Configure Tailwind CSS tokens and RTL-friendly base styles.
- [x] Configure ESLint, Prettier, Vitest, and Playwright.
- [x] Add `.env.example` using `TECH_STACK.md`.
- [x] Add route skeletons from `APP_FLOW.md`.

**Success Criteria**
- [x] `pnpm install` succeeds.
- [x] `pnpm lint` succeeds.
- [x] `pnpm typecheck` succeeds.
- [x] Local dev server loads landing route.

### Step 1.2 — Firebase Project and App Wiring
**Duration**: 0.5-1 day  
**Goal**: Firebase Auth, Firestore, and Admin SDK ready.

**Context**
- `01-docs/TECH_STACK.md`
- `01-docs/BACKEND_STRUCTURE.md`

**Tasks**
- [x] Create/use Firebase project for Zubda.
- [x] Add Firebase client config.
- [x] Add Firebase Admin SDK server helper.
- [x] Create typed Firestore collection constants.
- [x] Add emulator-friendly config if practical.
- [x] Draft initial Firestore security rules.

**Success Criteria**
- [x] Client can initialize Firebase once env vars are present.
- [ ] Server route can verify admin credentials.
- [ ] Firestore read/write smoke test passes in dev.
- [x] No secrets are committed.

**Status Note**
- Firebase project `zubda-d075c` and Web app `Zubda Web` exist.
- Public SDK config is wired in `.env.example` and local `.env.local`.
- Firestore API currently returns disabled/403 from CLI; enable Firestore API and confirm database region before rules/read-write smoke tests.

### Step 1.3 — Base Design System
**Duration**: 0.5-1 day  
**Goal**: Zubda visual system exists before feature UI.

**Context**
- `01-docs/FRONTEND_GUIDELINES.md`
- `01-docs/APP_FLOW.md`

**Tasks**
- [ ] Implement CSS variables for color, type, spacing, radius, shadows.
- [ ] Add Arabic-first font setup.
- [ ] Build base layout shell.
- [ ] Build core primitives: button, chip, card, drawer, tooltip, input, segmented control.
- [ ] Add loading, empty, and error state components using Zubda copy.

**Success Criteria**
- [ ] Components render on mobile and desktop.
- [ ] RTL mode works for sample Arabic content.
- [ ] No card-inside-card layout pattern.

---

## Phase 2: Auth and Profile

### Step 2.1 — Firebase Auth
**Duration**: 1 day  
**Goal**: Google login and magic link / email link login.

**Context**
- `01-docs/APP_FLOW.md` Auth section
- `01-docs/BACKEND_STRUCTURE.md` Auth / User endpoints

**Tasks**
- [ ] Configure Firebase Auth providers.
- [x] Build `/login` screen.
- [x] Implement email link login.
- [x] Implement Google login.
- [x] Add auth callback handling.
- [x] Add server-side token verification helper.

**Success Criteria**
- [ ] User can sign in with Google.
- [ ] User can sign in with magic link.
- [x] Authenticated API route rejects missing/invalid tokens.

### Step 2.2 — Personal Intelligence Profile Onboarding
**Duration**: 1.5-2 days  
**Goal**: One primary profile per user with all MVP personalization fields.

**Context**
- `01-docs/PRD.md` Feature 1 and Feature 2
- `01-docs/APP_FLOW.md` Onboarding
- `01-docs/BACKEND_STRUCTURE.md` `profiles`, `interestModules`, `watchlists`

**Tasks**
- [ ] Seed `interestModules`.
- [x] Build onboarding wizard: language, region, role, goal, interests, watchlist, currency, depth, delivery, preview.
- [x] Save profile to Firestore.
- [x] Enforce Free plan limits in UI and server validation.
- [ ] Add profile settings screen for edits.

**Success Criteria**
- [ ] New authenticated user with no profile is routed to onboarding.
- [ ] Completed profile routes to `/today`.
- [ ] Free user cannot exceed 3 interest modules.
- [ ] Profile data persists in Firestore.

---

## Phase 3: Stripe Payments and Entitlements

### Step 3.1 — Stripe Products, Prices, and Checkout
**Duration**: 1 day  
**Goal**: Real Stripe Checkout for Pro Monthly and Founder Lifetime.

**Context**
- `01-docs/TECH_STACK.md` Payments Architecture
- `01-docs/BACKEND_STRUCTURE.md` Pricing / Stripe endpoints
- `01-docs/PRD.md` Feature 6

**Tasks**
- [ ] Create Stripe products and prices for Pro Monthly and Founder Lifetime.
- [ ] Add configured price IDs to env.
- [x] Build pricing page.
- [x] Implement `/api/stripe/checkout`.
- [x] Create/reuse Stripe customer and store `stripeCustomerId`.
- [x] Start Checkout Session for subscription or one-time payment.

**Success Criteria**
- [ ] Free plan CTA starts signup.
- [ ] Pro Monthly starts Stripe subscription checkout.
- [ ] Founder Lifetime starts Stripe one-time checkout.
- [ ] Checkout metadata includes Firebase `userId`.

### Step 3.2 — Stripe Webhooks and Plan Gating
**Duration**: 1.5-2 days  
**Goal**: Firestore entitlement state updates from Stripe webhooks.

**Context**
- `01-docs/BACKEND_STRUCTURE.md` `users`, `stripeEvents`, Entitlement Rules
- Stripe skill guidance: Checkout Sessions for payments/subscriptions; webhooks as source of truth

- [x] Implement raw-body Stripe webhook route.
- [x] Verify Stripe webhook signatures.
- [x] Store `stripeEvents/{eventId}` idempotently.
- [x] Handle required subscription and payment events.
- [x] Update `users/{userId}` plan and entitlement fields.
- [x] Add billing settings page.
- [x] Add Customer Portal route if configuration is ready.
- [ ] Add entitlement helper used by UI/API gates.

**Success Criteria**
- [ ] Successful Pro checkout activates `pro_monthly` entitlement.
- [ ] Successful Founder checkout activates `founder_lifetime` entitlement.
- [ ] Failed invoice moves entitlement to `past_due`.
- [ ] Deleted subscription removes Pro entitlement.
- [ ] Client redirect alone does not activate plan.

---

## Phase 4: Brief Data and AI Pipeline

### Step 4.1 — AI Provider Abstraction
**Duration**: 1 day  
**Goal**: Gemini/OpenAI adapters with configurable model routing.

**Context**
- `01-docs/TECH_STACK.md` AI Provider Strategy
- `01-docs/BACKEND_STRUCTURE.md` AI Generation Pipeline

**Tasks**
- [ ] Define AI provider interface.
- [ ] Implement Gemini adapter.
- [ ] Implement OpenAI adapter.
- [ ] Add model config via env.
- [ ] Add deterministic fallback validation helpers.
- [ ] Add tests for provider routing.

**Success Criteria**
- [ ] App can switch provider using `AI_PROVIDER`.
- [ ] Summary/classification/final brief/quality check use separate model configs.
- [ ] Unit tests cover provider selection and missing-env errors.

### Step 4.2 — Source Collection and Story Normalization
**Duration**: 2-3 days  
**Goal**: Shared source story cache exists before personalized generation.

**Context**
- `01-docs/BACKEND_STRUCTURE.md` `sourceStories`, generation jobs
- `00-research/COMPETITOR_ANALYSIS.md`

**Tasks**
- [ ] Define initial open web/RSS/official source list.
- [ ] Implement source collection job.
- [ ] Normalize sources into `sourceStories`.
- [ ] Add tags: topics, regions, entities, reliability.
- [ ] Store collection/generation job logs.
- [ ] Avoid paywalled scraping and long copied excerpts.

**Success Criteria**
- [ ] Cron-protected endpoint can collect sources.
- [ ] Story objects are cached in Firestore.
- [ ] Story objects contain source URL, publisher, timestamp, tags, reliability.

### Step 4.3 — Relevance Scoring and Brief Generation
**Duration**: 2-3 days  
**Goal**: Generate structured personalized briefs from cached stories.

**Context**
- `01-docs/PRD.md` Feature 3 and Feature 4
- `01-docs/APP_FLOW.md` Daily Brief Experience
- `01-docs/BACKEND_STRUCTURE.md` `briefs`, `sourceLogs`

**Tasks**
- [ ] Implement relevance scoring against profile fields.
- [ ] Select top stories for each user.
- [ ] Generate structured brief JSON.
- [ ] Generate email summary.
- [ ] Store `briefs` and `sourceLogs`.
- [ ] Add quality checks for missing sources, weak Arabic, and unsupported claims.

**Success Criteria**
- [ ] Generated brief includes required sections.
- [ ] Major insight has source log and why-included reason.
- [ ] No story appears without source metadata.
- [ ] Failed generation writes useful failure state.

---

## Phase 5: Product Experience

### Step 5.1 — Daily Brief Reader
**Duration**: 2 days  
**Goal**: Mobile-first private web brief.

**Context**
- `01-docs/APP_FLOW.md` Daily Brief
- `01-docs/FRONTEND_GUIDELINES.md`

**Tasks**
- [ ] Build `/app/today` redirect/loading behavior.
- [ ] Build `/app/briefs/[briefId]`.
- [ ] Render Executive Snapshot, Watchboard, Personal Impact, Topic Radar, Talking Points, Sources, Glossary.
- [ ] Add Source Drawer and Glossary Drawer.
- [ ] Add feedback controls.
- [ ] Add completion state.

**Success Criteria**
- [ ] Authenticated owner can view brief.
- [ ] Non-owner cannot view brief.
- [ ] Arabic RTL and Mixed mode render correctly.
- [ ] Brief is scannable on mobile.

### Step 5.2 — Resend Email Delivery
**Duration**: 1 day  
**Goal**: Daily email trigger with private brief CTA.

**Context**
- `01-docs/APP_FLOW.md` Daily Brief Habit
- `01-docs/TECH_STACK.md` Resend env vars

**Tasks**
- [ ] Build daily brief email template.
- [ ] Implement `/api/cron/send-brief-emails`.
- [ ] Store `deliveryLogs`.
- [ ] Track email sent/opened where available.
- [ ] Keep full report out of email.

**Success Criteria**
- [ ] Email includes 5-bullet summary, top watch item, top personal impact, CTA.
- [ ] CTA opens private web brief.
- [ ] Delivery success/failure is logged.

### Step 5.3 — Archive, Feedback, and Currency Conversion
**Duration**: 2 days  
**Goal**: Retention loop and Pro value surfaces.

**Context**
- `01-docs/APP_FLOW.md` Archive, Feedback, Currency Quick Convert
- `01-docs/BACKEND_STRUCTURE.md` `feedback`, `deliveryLogs`, `plans`

**Tasks**
- [ ] Build `/archive`.
- [ ] Enforce Free archive limit.
- [ ] Implement feedback API and UI.
- [ ] Implement FX provider wrapper.
- [ ] Add preferred-currency display in brief values.
- [ ] Store analytics events in Firestore.

**Success Criteria**
- [ ] Feedback writes to Firestore.
- [ ] Archive gating works by entitlement.
- [ ] Currency conversion displays FX timestamp.
- [ ] Basic events are logged.

---

## Phase 6: Admin and Operations

### Step 6.1 — MVP Admin Monitoring
**Duration**: 1-2 days  
**Goal**: Simple internal tooling for generated intelligence.

**Context**
- `01-docs/APP_FLOW.md` Internal Admin
- `01-docs/BACKEND_STRUCTURE.md` `adminLogs`, `generationJobs`

**Tasks**
- [ ] Add admin route guard.
- [ ] Build user/profile viewer.
- [ ] Build generated brief viewer.
- [ ] Build generation-job viewer.
- [ ] Build source-log viewer.
- [ ] Add resend brief action.
- [ ] Add manual generate action.

**Success Criteria**
- [ ] Admin can inspect failed generation.
- [ ] Admin can resend brief.
- [ ] Admin actions write `adminLogs`.

### Step 6.2 — Vercel Deployment and Cron
**Duration**: 1 day  
**Goal**: Staging deployment with real env vars and scheduled jobs.

**Context**
- `01-docs/TECH_STACK.md`
- `03-workflows/DEPLOYMENT.md`

**Tasks**
- [ ] Link Vercel project.
- [ ] Add all required environment variables.
- [ ] Configure Vercel Cron routes.
- [ ] Configure Stripe webhook endpoint.
- [ ] Configure Firebase authorized domains.
- [ ] Configure Resend domain/sender.

**Success Criteria**
- [ ] Staging deploy works.
- [ ] Stripe webhook receives test event.
- [ ] Cron endpoint rejects missing `CRON_SECRET`.
- [ ] Cron endpoint succeeds with valid secret.

---

## Phase 7: Testing and Launch Readiness

### Step 7.1 — Critical Tests
**Duration**: 2-3 days  
**Goal**: Cover high-risk paths before beta.

**Test Targets**
- Auth token verification
- Profile validation
- Entitlement mapping
- Stripe webhook idempotency
- AI provider routing
- Source-story normalization
- Brief generation validation
- Archive gating
- Currency formatting

**Success Criteria**
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm test` passes.
- [ ] Stripe webhook test fixtures pass.

### Step 7.2 — Browser E2E
**Duration**: 1-2 days  
**Goal**: Verify the product journey in a real browser.

**Flows**
- Landing → login → onboarding → today
- Pricing → Stripe Checkout test mode → webhook entitlement
- Today brief → source drawer → glossary → feedback
- Archive Free limit → upgrade prompt
- Billing settings → customer portal

**Success Criteria**
- [ ] Playwright verifies core routes.
- [ ] Mobile viewport screenshots are reviewed.
- [ ] Arabic RTL is manually checked.

### Step 7.3 — Beta Launch Checklist
**Duration**: 1 day  
**Goal**: Ready for 50-100 beta users.

**Tasks**
- [ ] Privacy policy and terms drafted.
- [ ] Support email configured.
- [ ] Stripe test mode fully verified.
- [ ] Stripe live mode configured when ready.
- [ ] Firebase rules reviewed.
- [ ] Source/copyright behavior reviewed.
- [ ] Logging/monitoring checked.

---

## Milestones

| Milestone | Target | Deliverables |
|:----------|:-------|:-------------|
| **Foundation** | Days 1-3 | Next.js app, Firebase, design system, env scaffolding |
| **Auth/Profile** | Days 4-6 | Google/magic link auth, onboarding, primary profile |
| **Payments** | Days 7-9 | Pricing, Stripe Checkout, webhooks, entitlements |
| **Prototype Brief** | Week 2 | Source cache, generated sample/personal brief, email trigger |
| **MVP Core** | Weeks 3-5 | Daily generation, private brief, archive, feedback, currency, admin |
| **Beta Launch** | Week 6 | Tests, staging/prod deploy, 50-100 beta users |

## Risk Mitigation

| Risk | Impact | Mitigation |
|:-----|:-------|:-----------|
| Stripe entitlement bugs | Critical | Webhook-first state, idempotent `stripeEvents`, fixtures/tests |
| AI costs spike | High | Shared source cache, model routing, no per-user web research |
| Arabic quality feels weak | High | Mixed-mode QA, prompt tests, optional tone-polish model |
| Source trust breaks | High | Required source logs, no source means no major insight |
| Firebase rules too permissive | Critical | Explicit rules and server-side admin routes |
| Cron timing gets complex | Medium | Vercel Cron for MVP; Cloud Scheduler/Run later |
| Scope creep | High | P0 only; no native apps, WhatsApp, audio, teams, multiple profiles |

## First Build Task

When ready to start implementation, begin with:

> Read `AGENTS.md`, then read `01-docs/PRD.md`, `01-docs/APP_FLOW.md`, `01-docs/TECH_STACK.md`, `01-docs/FRONTEND_GUIDELINES.md`, `01-docs/BACKEND_STRUCTURE.md`, and `01-docs/IMPLEMENTATION_PLAN.md`. Execute Phase 1 Step 1.1 only: initialize the Next.js app with pinned dependencies, Tailwind tokens, lint/typecheck/test scripts, and route skeletons. Do not set up Stripe/Firebase yet except env placeholders. Verify with install, lint, typecheck, and local browser smoke test.
