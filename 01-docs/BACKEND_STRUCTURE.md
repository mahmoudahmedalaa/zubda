# Backend Architecture & Database Structure — Zubda / زبدة

> Firebase is the backend system of record for MVP. Stripe webhooks are the source of truth for payment state. AI generation must use cached source stories and provider abstraction to control cost.

## 1. Architecture Overview

| Dimension | Decision |
|:----------|:---------|
| **Pattern** | Next.js API routes + Firebase BaaS + server-side generation jobs |
| **Auth Strategy** | Firebase Auth: Google + magic link / email link |
| **Database** | Firestore |
| **Payments** | Stripe Checkout, Stripe Billing, Customer Portal, webhooks |
| **Email** | Resend daily trigger email |
| **AI** | Gemini/OpenAI provider abstraction with model routing |
| **Scheduling** | Vercel Cron for MVP |
| **Data Flow** | Source collection → source normalization → cached stories → user relevance scoring → personalized brief generation → email delivery |
| **Caching** | Normalized `sourceStories` in Firestore; generated `briefs` stored per user |

## 2. Firestore Collections

### Collection: `users`

Document ID: Firebase Auth `uid`

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| email | string | yes | Auth email |
| displayName | string | no | User display name |
| photoURL | string | no | Google profile image |
| primaryProfileId | string | no | Active profile ID |
| stripeCustomerId | string | no | Stripe customer ID |
| plan | `free \| pro_monthly \| founder_lifetime` | yes | Current plan |
| entitlementStatus | `free \| active \| past_due \| canceled \| lifetime` | yes | App access state |
| subscriptionStatus | string | no | Raw Stripe subscription status |
| subscriptionId | string | no | Stripe subscription ID |
| currentPeriodEnd | timestamp | no | Subscription period end |
| lifetimePurchasedAt | timestamp | no | Founder Lifetime purchase time |
| billingCurrency | `USD \| AED \| SAR \| EGP \| QAR \| KWD \| BHD \| OMR` | no | Checkout/display currency |
| role | `user \| admin` | yes | App authorization role |
| createdAt | timestamp | yes | Creation time |
| updatedAt | timestamp | yes | Last update |

### Collection: `profiles`

One primary profile per user in MVP. Data model supports multiple profiles later.

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| userId | string | yes | Owner `uid` |
| name | string | yes | Defaults to `Primary profile` |
| isPrimary | boolean | yes | True for MVP profile |
| languageMode | `arabic \| english \| mixed` | yes | Brief/UI preference |
| region | string | yes | UAE, Saudi, Egypt, etc. |
| role | string | yes | Consultant, founder, investor, etc. |
| mainGoals | string[] | yes | Why user wants the brief |
| interestModuleIds | string[] | yes | Selected interests |
| userDefinedTopics | string[] | no | Custom topics |
| watchlistIds | string[] | no | Related watchlist items |
| preferredCurrency | string | yes | USD/AED/SAR/EGP first |
| secondaryCurrency | string | no | Optional second currency |
| briefDepth | `quick \| standard \| deep` | yes | Default `standard` |
| deliveryTime | string | yes | HH:mm local time |
| timezone | string | yes | IANA timezone |
| sourcePreferences | map | no | Future source controls |
| createdAt | timestamp | yes | Creation time |
| updatedAt | timestamp | yes | Last update |

### Collection: `interestModules`

Seeded system collection.

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| slug | string | yes | `finance-investing`, `ai-technology`, etc. |
| nameEn | string | yes | English label |
| nameAr | string | yes | Arabic label |
| description | string | no | Short explanation |
| defaultSourceCategories | string[] | yes | Source categories |
| isActive | boolean | yes | Available in onboarding |
| sortOrder | number | yes | Display order |

### Collection: `watchlists`

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| userId | string | yes | Owner |
| profileId | string | yes | Profile |
| type | `company \| topic \| asset \| country \| market \| brand \| person \| other` | yes | Watch item type |
| label | string | yes | User-facing label |
| normalizedKey | string | yes | Lowercase/searchable key |
| aliases | string[] | no | Alternate names |
| metadata | map | no | Ticker, region, sector, etc. |
| createdAt | timestamp | yes | Creation time |
| updatedAt | timestamp | yes | Last update |

### Collection: `sourceStories`

Shared normalized story objects. These are collected once and reused across users.

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| title | string | yes | Story title |
| summary | string | yes | Normalized source summary |
| sourceUrl | string | yes | Canonical source URL |
| publisher | string | yes | Publisher/source name |
| sourceType | `official \| rss \| newsletter \| open_web \| user_source` | yes | Source class |
| publishedAt | timestamp | yes | Source timestamp |
| collectedAt | timestamp | yes | Collection timestamp |
| topicTags | string[] | yes | AI/deterministic topic tags |
| regionTags | string[] | yes | Relevant regions |
| entityTags | string[] | no | Companies/assets/people |
| reliabilityLabel | `high \| medium \| low` | yes | Source confidence |
| relevanceSignals | map | no | Scoring signals |
| language | string | no | Source language |
| rawExcerpt | string | no | Short compliant excerpt only |
| createdAt | timestamp | yes | Creation time |
| updatedAt | timestamp | yes | Last update |

### Collection: `briefs`

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| userId | string | yes | Owner |
| profileId | string | yes | Profile used |
| dateKey | string | yes | `YYYY-MM-DD` |
| status | `scheduled \| generating \| ready \| failed \| partial` | yes | Brief lifecycle |
| languageMode | string | yes | Language used |
| depth | string | yes | Brief depth |
| preferredCurrency | string | yes | Currency used |
| sourceStoryIds | string[] | yes | Included source stories |
| structuredBrief | map | yes | Full JSON brief |
| html | string | no | Rendered brief HTML if stored |
| emailSummary | string[] | yes | 5-bullet email summary |
| readProgress | number | no | 0-100 |
| generatedAt | timestamp | no | Completion time |
| failedReason | string | no | Failure detail |
| createdAt | timestamp | yes | Creation time |
| updatedAt | timestamp | yes | Last update |

### Collection: `sourceLogs`

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| briefId | string | yes | Brief |
| sourceStoryId | string | yes | Source story |
| userId | string | yes | Owner |
| reasonIncluded | string | yes | Why selected for this user |
| confidence | `high \| medium \| low` | yes | Evidence strength |
| factVsInterpretation | `fact \| interpretation \| mixed` | yes | Trust label |
| createdAt | timestamp | yes | Creation time |

### Collection: `deliveryLogs`

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| userId | string | yes | Recipient |
| profileId | string | yes | Profile |
| briefId | string | yes | Brief |
| channel | `email \| push` | yes | MVP uses email |
| status | `queued \| sent \| failed \| opened` | yes | Delivery status |
| resendMessageId | string | no | Resend ID |
| sentAt | timestamp | no | Send time |
| openedAt | timestamp | no | Open time if tracked |
| error | string | no | Failure reason |
| createdAt | timestamp | yes | Creation time |

### Collection: `feedback`

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| userId | string | yes | Owner |
| profileId | string | yes | Profile |
| briefId | string | yes | Brief |
| sourceStoryId | string | no | Story/item feedback |
| feedbackType | `useful \| not_useful \| too_much \| too_little \| more_like_this` | yes | Feedback signal |
| note | string | no | Optional note |
| createdAt | timestamp | yes | Creation time |

### Collection: `plans`

Seeded plan metadata for gating.

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| plan | `free \| pro_monthly \| founder_lifetime` | yes | Plan key |
| maxInterestModules | number | yes | Free = 3, Pro/Lifetime = higher |
| maxWatchlistItems | number | yes | Plan limit |
| archiveDays | number \| null | yes | Free = 3-7, Pro/Lifetime = null |
| archiveSearch | boolean | yes | Pro feature |
| currencyConversion | boolean | yes | Pro feature |
| customDeliveryTime | boolean | yes | Pro feature |
| deeperBrief | boolean | yes | Pro feature |

### Collection: `stripeEvents`

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| eventId | string | yes | Stripe event ID, also document ID |
| type | string | yes | Stripe event type |
| processed | boolean | yes | Idempotency flag |
| userId | string | no | Resolved app user |
| stripeCustomerId | string | no | Customer |
| subscriptionId | string | no | Subscription |
| payload | map | yes | Sanitized event payload |
| receivedAt | timestamp | yes | Webhook receive time |
| processedAt | timestamp | no | Processing time |
| error | string | no | Processing error |

### Collection: `generationJobs`

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| jobType | `source_collection \| story_normalization \| brief_generation \| email_delivery` | yes | Job type |
| status | `queued \| running \| succeeded \| failed` | yes | Job status |
| dateKey | string | yes | Job date |
| userId | string | no | User if per-user |
| profileId | string | no | Profile if per-profile |
| startedAt | timestamp | no | Start time |
| finishedAt | timestamp | no | End time |
| error | string | no | Failure reason |
| createdAt | timestamp | yes | Creation time |

### Collection: `adminLogs`

| Field | Type | Required | Description |
|:------|:-----|:---------|:------------|
| adminUserId | string | yes | Admin actor |
| action | string | yes | Admin action |
| targetType | string | yes | User, brief, job, etc. |
| targetId | string | yes | Target document |
| metadata | map | no | Extra data |
| createdAt | timestamp | yes | Action time |

## 3. API Endpoints

### Auth / User

Firebase client SDK handles sign-in. Server routes verify Firebase ID tokens.

#### GET `/api/me`
- **Access**: Authenticated
- **Response 200**: `{ user, profile, entitlement }`
- **Errors**: 401, 404

#### PATCH `/api/profile`
- **Access**: Authenticated
- **Body**: profile fields from onboarding/settings
- **Response 200**: `{ profile }`
- **Side Effects**: Updates `profiles/{profileId}` and `users/{userId}.primaryProfileId`

### Pricing / Stripe

#### POST `/api/stripe/checkout`
- **Access**: Authenticated
- **Body**: `{ plan: "pro_monthly" | "founder_lifetime", currency: "USD" | "AED" | "SAR" }`
- **Validation**: plan and currency must map to configured Stripe price ID
- **Response 200**: `{ url }`
- **Side Effects**: Creates Stripe customer if needed; creates Checkout Session

Rules:
- Pro Monthly uses Checkout Session `mode: "subscription"`.
- Founder Lifetime uses Checkout Session `mode: "payment"`.
- Pass Firebase `userId` in Checkout metadata.
- Do not activate entitlement here.

#### POST `/api/stripe/webhook`
- **Access**: Public with Stripe signature verification
- **Body**: raw Stripe event payload
- **Response 200**: `{ received: true }`
- **Side Effects**: Stores `stripeEvents/{eventId}` idempotently and updates user entitlement state

Required event handling:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

#### POST `/api/stripe/customer-portal`
- **Access**: Authenticated Pro/Lifetime user with Stripe customer ID
- **Response 200**: `{ url }`
- **Side Effects**: Creates Stripe Customer Portal session

### Briefs

#### GET `/api/briefs/today`
- **Access**: Authenticated
- **Response 200**: `{ brief }`
- **Behavior**: Returns latest ready brief for user or current generation state

#### GET `/api/briefs/:briefId`
- **Access**: Authenticated owner
- **Response 200**: `{ brief, sourceLogs }`

#### GET `/api/archive`
- **Access**: Authenticated
- **Query Params**: `limit`, `cursor`, `topic`
- **Response 200**: `{ briefs, nextCursor, entitlement }`
- **Gating**: Free users see only last 3-7 briefs; Pro/Lifetime see full archive

#### POST `/api/feedback`
- **Access**: Authenticated
- **Body**: `{ briefId, sourceStoryId?, feedbackType, note? }`
- **Response 201**: `{ feedback }`
- **Side Effects**: Stores feedback and emits analytics event

### Generation and Delivery

#### POST `/api/cron/source-collection`
- **Access**: Requires `CRON_SECRET`
- **Purpose**: Collect broad daily source data once per day

#### POST `/api/cron/normalize-stories`
- **Access**: Requires `CRON_SECRET`
- **Purpose**: Create/update `sourceStories`

#### POST `/api/cron/generate-briefs`
- **Access**: Requires `CRON_SECRET`
- **Purpose**: Score cached stories and generate user briefs

#### POST `/api/cron/send-brief-emails`
- **Access**: Requires `CRON_SECRET`
- **Purpose**: Send Resend email triggers with 5-bullet summary and CTA

#### POST `/api/admin/briefs/:briefId/resend`
- **Access**: Admin
- **Purpose**: Resend a brief email

#### POST `/api/admin/briefs/generate`
- **Access**: Admin
- **Purpose**: Manually trigger brief generation for a user/profile

## 4. Entitlement Rules

### Free
- 1 daily brief
- 1 primary profile
- basic personalization
- up to 3 interest modules
- limited watchlist
- limited archive, last 3-7 briefs
- source links
- basic Arabic/English/Mixed mode

### Pro Monthly
Active when Stripe subscription is `active` or `trialing`.

Includes:
- full personalization
- more interest modules
- larger watchlist
- portfolio/watchlist support
- deeper brief option
- full archive
- archive search
- delivery-time customization
- glossary/tooltips
- currency conversion inside briefs
- richer brief visuals
- future second profile when profile switching is added

### Founder Lifetime
Active after successful one-time payment unless refunded or admin revoked.

Includes same entitlement as Pro.

### Entitlement State Mapping

| Stripe State | Firestore `plan` | Firestore `entitlementStatus` |
|:-------------|:-----------------|:------------------------------|
| No Stripe customer | `free` | `free` |
| Checkout completed for subscription | `pro_monthly` | `active` |
| Subscription active/trialing | `pro_monthly` | `active` |
| Subscription past_due | `pro_monthly` | `past_due` |
| Subscription canceled/deleted | `free` | `canceled` |
| Lifetime payment succeeded | `founder_lifetime` | `lifetime` |
| Lifetime refunded/admin revoked | `free` | `canceled` |

## 5. AI Generation Pipeline

### Step 1: Shared Source Collection
Collect once per day across:
- GCC business
- AI/tech
- markets
- economy
- energy
- geopolitics
- selected interest modules

### Step 2: Source Normalization
Create `sourceStories` with:
- title
- summary
- source URL
- publisher
- timestamp
- topic tags
- region tags
- entity tags
- source reliability
- relevance signals

### Step 3: Cache Story Objects
Store normalized story objects in Firestore and reuse across users.

### Step 4: Relevance Scoring
Score by:
- user interests
- region
- role
- watchlist
- selected modules
- currency/finance relevance
- source reliability
- novelty

### Step 5: Personalized Brief Generation
Generate a structured brief from selected cached stories.

### Step 6: Store Outputs
Store:
- structured brief JSON
- HTML brief if generated server-side
- email summary
- source log
- delivery log
- feedback hooks

## 6. Authentication and Authorization

### Auth Providers
- Google login
- Magic link / email link login
- Email/password not required for MVP
- Apple login out of scope unless extremely easy

### Server Verification
All authenticated server routes must verify Firebase ID token with Firebase Admin SDK.

### Authorization Levels
| Level | Routes | Required |
|:------|:-------|:---------|
| Public | Landing, pricing, login, sample brief, Stripe webhook | No user session; webhook requires Stripe signature |
| Authenticated | Profile, today, briefs, archive, feedback, checkout | Valid Firebase ID token |
| Pro/Lifetime | Full archive, larger watchlist, currency conversion, deeper brief | Active entitlement |
| Admin | `/admin/*`, manual generation/resend | Admin role/claim |

## 7. Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "currency", "message": "Unsupported currency" }]
  }
}
```

### Error Codes
| Code | HTTP | When |
|:-----|:-----|:-----|
| VALIDATION_ERROR | 400 | Invalid input |
| UNAUTHORIZED | 401 | Missing/expired Firebase token |
| FORBIDDEN | 403 | Insufficient entitlement/admin permissions |
| NOT_FOUND | 404 | Resource does not exist or user cannot access it |
| CONFLICT | 409 | Duplicate generation or already-processed Stripe event |
| RATE_LIMITED | 429 | Too many requests |
| STRIPE_ERROR | 502 | Stripe API failure |
| AI_PROVIDER_ERROR | 502 | Gemini/OpenAI failure |
| SERVER_ERROR | 500 | Unexpected failure |

## 8. Security

| Measure | Implementation |
|:--------|:---------------|
| **Firebase Auth** | Google + email link; verify ID token server-side |
| **Firestore Rules** | Users can only read/write own profile, briefs, feedback; admin routes server-only |
| **Stripe Webhooks** | Verify `STRIPE_WEBHOOK_SECRET`; store event IDs for idempotency |
| **Checkout Security** | Create sessions server-side only; use configured price IDs only |
| **Cron Security** | Require `CRON_SECRET` |
| **Input Validation** | Zod schemas for API payloads |
| **Source Safety** | No paywalled scraping; short excerpts only |
| **Secrets** | Vercel env vars only; never commit keys |
| **Admin Logging** | Write `adminLogs` for manual generation, resend, entitlement changes |
