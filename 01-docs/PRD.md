# Product Requirements Document (PRD) — Zubda / زبدة

> The source of truth for what Zubda is building and why. Every implementation decision should trace back to this document and the research files in `00-research/`.

## 1. Overview

### Product Name
Zubda / زبدة

Use `Zubda` in English contexts and `زبدة` in Arabic UI and marketing.

### Tagline
- Arabic: الزبدة مما يهمك
- English: The bottom line on what matters to you.

### One-Line Description
Zubda is an Arabic-first personal intelligence product that creates a daily brief around each user's interests, region, work, watchlist, currency, and goals.

### Problem Statement
Ambitious GCC and MENA professionals are drowning in fragmented news, markets, LinkedIn posts, newsletters, WhatsApp forwards, and shallow AI summaries. They need a daily product that tells them what changed, why it matters, what to watch, and what it means for their work, money, industry, or conversations.

### Product Framing
Zubda is not a generic news app, finance app, fashion app, or newsletter app. It is a personalized Arabic-first daily intelligence engine.

The product principle is:
> Let users build their world, then give them the zubda of that world every morning.

### Target User
The first launch persona is a bilingual GCC-based ambitious professional, age 26-40, based primarily in UAE and Saudi Arabia, working in consulting, finance, technology, startups, government strategy, corporate strategy, investing, or leadership.

They are mobile-first, heavy WhatsApp and LinkedIn users, comfortable with ChatGPT and newsletters, and want to sound informed without wasting 30-45 minutes scrolling every morning.

---

## 2. Goals & Success Metrics

### Business Goals

| Goal | Metric | Target (MVP) |
|:-----|:-------|:-------------|
| User Acquisition | Active beta users | 50-100 users by week 6 |
| Engagement | Email/open rate | 45-60% open rate |
| Engagement | Meaningful read rate | 35-50% read at least 60% of a brief |
| Retention | Weekly habit | 40%+ of active users open 3+ briefs per week |
| Feedback | Product signal | 20%+ of users leave at least one feedback signal |
| Revenue | Willingness to pay | 5-10 users willing to pay or actually paying |
| Qualitative | Must-have signal | 10 users say they would miss Zubda if it disappeared |

### User Goals
1. As a busy professional, I want a short personalized daily brief so that I know what matters before meetings and conversations.
2. As a bilingual Arabic/English user, I want Arabic-first explanations with natural English business terms so that the brief matches how I actually think and work.
3. As an investor or strategy professional, I want watchlist and currency-aware context so that big numbers, market moves, and company updates are easier to understand.
4. As a user with mixed interests, I want one coherent brief across my world so that I do not need separate apps or newsletters for every topic.
5. As a trust-conscious reader, I want sources and reasoning shown clearly so that I can separate fact, interpretation, and uncertainty.

---

## 3. Feature Prioritization

### P0 — Must Have for Launch

#### Feature 1: Auth and Personal Intelligence Profile
- **What**: Users sign in and create one primary profile containing language, region, role, goals, interests, watchlist, brief depth, delivery time, and preferred currency.
- **User Story**: As a new user, I want to quickly tell Zubda what matters to me so that my first brief feels personally relevant.
- **Acceptance Criteria**:
  - [ ] User can sign in with magic link.
  - [ ] User can sign in with Google.
  - [ ] User can choose Arabic, English, or Mixed language mode.
  - [ ] User can select country/region, role, main goal, interest modules, delivery time, brief depth, and preferred currency.
  - [ ] User can add a watchlist of companies, topics, assets, brands, countries, or markets.
  - [ ] System creates exactly one primary profile per user for MVP.
  - [ ] Data model can support multiple profiles later without forcing that UI into MVP.
- **Edge Cases**:
  - Returning user with incomplete profile resumes onboarding.
  - User skips optional portfolio/watchlist and still receives a useful brief.
  - Arabic, English, and Mixed modes preserve brand and business terms correctly.

#### Feature 2: Configurable Interest Modules
- **What**: Users can select multiple interest modules that feed one personalized daily brief.
- **User Story**: As a user with overlapping interests, I want Zubda to combine my work, market, region, and personal interests into one coherent brief.
- **Acceptance Criteria**:
  - [ ] MVP supports finance and investing, AI and technology, GCC business, global economy, energy and oil, sustainability and climate, startups and venture capital, real estate, fashion and luxury, retail and consumer trends, geopolitics, public sector and policy, sports business, healthcare, and user-defined topics.
  - [ ] Free plan can select up to 3 interest modules.
  - [ ] Pro plan can select more interest modules.
  - [ ] Interest modules influence source selection, ranking, and "why this matters" explanations.
  - [ ] Zubda produces one daily brief, not separate vertical products.
- **Edge Cases**:
  - User selects too many unrelated interests; the brief still prioritizes the highest-signal items.
  - User-defined topics do not map cleanly to sources; system shows a useful fallback.

#### Feature 3: Daily Personalized Brief
- **What**: A mobile-first private web brief generated around the user's profile.
- **User Story**: As a returning user, I want to open Zubda each morning and understand the bottom line in about 5 minutes.
- **Acceptance Criteria**:
  - [ ] Brief includes Executive Snapshot, Today's Watchboard, Personal Impact, Topic Radar, Talking Points, Sources, and Glossary/tooltips.
  - [ ] Default depth is Standard.
  - [ ] Quick and Deep can exist as profile settings if simple, but Standard is the primary MVP experience.
  - [ ] Brief supports Arabic, English, and Mixed modes.
  - [ ] Mixed mode uses Arabic UI and explanations while preserving natural English company names, source titles, and business/finance/tech terms.
  - [ ] Each brief opens on mobile and desktop through a private authenticated web page.
- **Edge Cases**:
  - No high-signal updates for a topic; brief says so clearly instead of hallucinating importance.
  - User has a narrow watchlist; brief balances watchlist relevance with broader daily context.

#### Feature 4: Source Trust and Explainability
- **What**: Every major insight includes visible sources and a reasoning chain.
- **User Story**: As a reader, I want to know where an insight came from and why Zubda included it so that I can trust the brief.
- **Acceptance Criteria**:
  - [ ] Every major item stores source title, source URL, source type, timestamp, reliability label, and reason included.
  - [ ] Major insights show What happened, Source, Why it matters, Who benefits, Who is pressured, What to watch, and confidence/evidence strength.
  - [ ] System labels fact versus interpretation where relevant.
  - [ ] Product does not scrape paywalled content.
  - [ ] Product does not reproduce long copyrighted content.
  - [ ] Sources come from open web, RSS/newsletters, official sources, and user-provided sources where legally accessible.
- **Edge Cases**:
  - Source is unavailable or stale; item is downgraded or excluded.
  - Conflicting sources exist; brief indicates uncertainty.

#### Feature 5: Scheduled Delivery, Archive, and Feedback
- **What**: Users receive an email trigger at their selected time, open a private web brief, view past briefs, and give feedback.
- **User Story**: As a user building a morning habit, I want Zubda to arrive reliably and learn what I find useful.
- **Acceptance Criteria**:
  - [ ] User receives a scheduled email with a 5-bullet summary and a button to open the full private brief.
  - [ ] User can view an archive of past briefs.
  - [ ] Free users have limited archive access, initially last 3-7 briefs.
  - [ ] Pro users have full archive access.
  - [ ] User can mark items useful, not useful, too much, too little, or more like this.
  - [ ] Feedback informs future relevance scoring.
- **Edge Cases**:
  - Scheduled generation fails; system retries and logs the failure.
  - User changes delivery time; next schedule updates correctly.

#### Feature 6: Pricing, Plans, and Currency-Aware Experience
- **What**: Zubda launches with Free, Pro Monthly, and Founder Lifetime plan structure, real Stripe Checkout, webhook-driven entitlements, plus profile-level currency preferences for pricing display and in-brief conversion.
- **User Story**: As a GCC/MENA user, I want pricing and financial values shown in currencies I understand.
- **Acceptance Criteria**:
  - [ ] Pricing page shows Free, Pro Monthly, and Founder Lifetime.
  - [ ] Free plan includes 1 daily brief, 1 primary profile, basic personalization, up to 3 interest modules, limited watchlist, limited archive, basic language modes, and source links.
  - [ ] Pro Monthly includes full personalization, more interest modules, larger watchlist, watchlist/portfolio support, deeper brief option, full archive, archive search, delivery-time customization, glossary/tooltips, and currency conversion inside briefs.
  - [ ] Founder Lifetime includes Pro access as a limited early supporter offer.
  - [ ] Recommended prices are $0 Free, $7.99/month Pro, and $99 one-time Founder Lifetime.
  - [ ] Localized display pricing supports USD, AED, SAR, and EGP first, with QAR, KWD, BHD, and OMR prepared later.
  - [ ] Checkout pricing uses fixed localized product prices, not constantly changing live FX.
  - [ ] In-app currency conversion uses exchange-rate data updated daily or near-real-time.
  - [ ] Stripe Checkout supports Pro Monthly subscriptions and Founder Lifetime one-time payments.
  - [ ] Stripe webhooks activate and update plan entitlements in Firestore.
  - [ ] Billing/account status is visible in app settings.
- **Edge Cases**:
  - User region and currency do not match; user preference wins for in-brief values.
  - Client-side success redirect fails; Stripe webhook still activates entitlement.
  - Subscription payment fails; entitlement moves to past_due and billing UI shows recovery path.

---

### P1 — Should Have (v1.1)

| Feature | User Story | Complexity |
|:--------|:-----------|:-----------|
| PWA push notifications | As a mobile user, I want a push reminder when my brief is ready | Medium |
| Save/share brief cards | As a user, I want to save or share a clean brief card without exposing my full private brief | Medium |
| Multiple saved profiles | As a Pro user, I want separate profiles like Work Brief, Investing Brief, and Founder Brief | High |
| Ask Zubda follow-up | As a user, I want to ask a follow-up question about today's brief | High |

### P2 — Nice to Have (Future)

| Feature | User Story | When |
|:--------|:-----------|:-----|
| Audio briefs | As a commuter, I want to listen to my daily brief | v1.2 / v2.0 |
| WhatsApp / Telegram delivery | As a GCC user, I want my brief delivered where I already check messages | v1.2 / v2.0 |
| Native iOS and Android apps | As a daily user, I want a polished native app with native notifications | v2.0 |
| Team intelligence briefs | As a company, I want shared team briefings and admin controls | v2.0 |
| Premium licensed sources | As a power user, I want deeper source coverage from premium content partners | v2.0 |
| Advanced archive chat | As a user, I want to query my historical briefs and watchlists | v2.0 |

### Out of Scope for 6-Week MVP
- Native iOS app
- Native Android app
- Full WhatsApp delivery
- Full Telegram delivery
- Team dashboards
- Enterprise admin panel
- Audio briefs or podcast generation
- Premium licensed sources
- Full marketplace of sources
- Apple login unless very low effort
- In-app purchases
- Multiple saved profiles per user
- Social feeds or user-to-user sharing
- Advanced AI chat over archive
- Complex portfolio analytics
- Real-time market terminal functionality
- Full Arabic dialect personalization by country
- Complex notification center
- B2B workspace features
- Annual pricing

---

## 4. User Scenarios

### Scenario 1: First-Time User
1. User lands on Zubda from a waitlist invite or shared link.
2. User signs in with magic link or Google.
3. User selects language mode: Arabic, English, or Mixed.
4. User selects country/region, role, main goal, preferred currency, brief depth, and delivery time.
5. User selects interest modules and adds optional watchlist items.
6. Zubda creates one Personal Intelligence Profile.
7. User receives or previews the first Standard daily brief.
8. **Success**: User feels, "This is the bottom line on what matters to me."

### Scenario 2: Returning User
1. User receives morning email at selected time.
2. Email shows a 5-bullet summary.
3. User taps the CTA and opens the private mobile web brief.
4. User scans Executive Snapshot, Watchboard, Personal Impact, Topic Radar, Talking Points, Sources, and Glossary.
5. User marks useful / not useful / more like this on at least one item.
6. **Success**: User understands the day in about 5 minutes and has one or two talking points for work.

### Scenario 3: Pro / Founder User
1. User upgrades to Pro Monthly or Founder Lifetime through Stripe Checkout.
2. User expands interest modules and watchlist.
3. User enables deeper brief option or full archive access.
4. User sees currency conversions inside relevant brief items.
5. User searches archive or reviews older briefs.
6. **Success**: User uses Zubda as a recurring professional intelligence habit, not a one-off summary tool.

---

## 5. Technical Constraints

| Constraint | Decision | Rationale |
|:-----------|:---------|:----------|
| Platform | Mobile-first web app / PWA | Fastest path to iPhone, Android, and desktop without App Store friction |
| Distribution | Email trigger + private web brief | Email creates habit; web brief enables premium layout, RTL, sources, archive, and rapid iteration |
| Auth method | Magic link + Google | Low friction for professional users and avoids password complexity in MVP |
| Profile model | One primary profile per user | Keeps MVP simple while supporting many interests inside one profile |
| Future profile model | Multiple profiles later | Data model should support Work / Investing / Founder style profiles later |
| Language modes | Arabic, English, Mixed | Arabic-first is core; mixed mode reflects real GCC business behavior |
| Default depth | Standard | Main experience should be a 5-minute high-quality brief |
| Data storage | Cloud database | Profiles, briefs, sources, feedback, archives, and billing state need durable storage |
| Source policy | Open web, RSS/newsletters, official sources, user-provided sources | Avoids paywall and copyright risk while proving product value |
| Monetization | Freemium + Pro Monthly + Founder Lifetime | Tests recurring revenue and early supporter demand |
| Checkout | Stripe Checkout from day one | Zubda needs real subscription state, lifetime purchase, plan gating, webhook handling, and billing status at launch |
| Payment state | Stripe webhooks are source of truth | Client redirects are not trusted for entitlement activation |
| Product pricing FX | Fixed localized prices | Keeps billing clear and avoids volatile checkout pricing |
| In-brief FX | Daily or near-real-time exchange-rate data | Makes financial values more useful for GCC/MENA users |
| Offline support | Not required for MVP | Briefs are generated server-side and opened through private web links |
| Push notifications | Optional / P1 | Email is enough for prototype and early MVP |

---

## 6. Launch Strategy

### MVP Scope
- **Features**: P0 only
- **Platform**: Mobile-first web app / PWA
- **Timeline**: Usable prototype in 2 weeks; real MVP in 6 weeks
- **Distribution**: Waitlist / invite link, email delivery, private web brief

### 2-Week Prototype Goal
Prove that the daily brief experience feels valuable.

Prototype includes:
- landing/waitlist flow
- onboarding form
- one primary profile
- selected interest modules
- semi-automated brief generation
- mobile web brief page
- email delivery
- basic archive
- Arabic-first sample brief
- pricing page with Free, Pro Monthly, and Founder Lifetime
- Stripe Checkout for Pro Monthly and Founder Lifetime
- Stripe webhook entitlement activation

### 6-Week MVP Goal
Prove repeat usage, trust, and willingness to pay.

MVP includes:
- user accounts
- full profile setup
- daily scheduler
- automated generation pipeline
- personalized private brief pages
- Arabic/English/Mixed mode
- source logging and explainability
- email delivery fallback
- archive/history
- feedback buttons
- currency preference and in-brief conversion
- pricing page, Stripe Checkout, Stripe webhooks, and plan gating
- admin monitoring for generated briefs

### Launch Checklist
- [ ] All P0 features tested on mobile and desktop browsers.
- [ ] Arabic RTL and Mixed mode reviewed manually.
- [ ] Source links and source logs verified.
- [ ] Generated brief avoids paywalled copying and long copyrighted excerpts.
- [ ] Email delivery tested across major clients.
- [ ] Magic link and Google auth tested.
- [ ] Pricing page and plan gating tested.
- [ ] Currency display tested for USD, AED, SAR, and EGP.
- [ ] Analytics configured for open rate, read depth, feedback, retention, and upgrade intent.
- [ ] Privacy policy and terms drafted.
- [ ] Support email set up.

---

## 7. Brand and Voice

### Brand Personality
Sharp and modern, with GCC-fluent personality.

Zubda should feel:
- Arabic-first
- smart but approachable
- direct
- witty without becoming childish
- premium enough for professionals
- casual enough to feel alive
- far away from stiff corporate newsletter language

### Voice Guidance
Use phrases like:
- الزبدة
- وش السالفة؟
- عطني الزبدة
- بدون زحمة
- بدون حشو
- اللي يهمك
- وش تراقب اليوم؟
- يعني إيش؟
- بالعربي البسيط

Do not turn the product into a meme app. The tone blend is 60% sharp and useful, 25% approachable GCC personality, and 15% premium intelligence.
