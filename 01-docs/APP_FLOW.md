# Application Flow & Navigation — Zubda / زبدة

> Zubda is a mobile-first, Arabic-first daily intelligence product. The flow must feel like one coherent morning ritual, not an endless feed.

## 1. Product UX Principles

1. **One coherent brief, not a feed** — Users should finish Zubda and feel: خلص، عرفت الزبدة.
2. **Arabic-first, not translated English** — Arabic copy must feel native, GCC-fluent, and modern.
3. **Personalization is the product** — Role, interests, region, watchlist, currency, delivery time, language mode, and feedback change the brief.
4. **Trust is visible but not noisy** — Source details, confidence, and fact vs interpretation live behind progressive disclosure.
5. **Every major item explains why it matters** — Use: وش السالفة؟ ليش يهمك؟ وش تراقب؟ وش أثرها عليك؟ المصدر.
6. **End with action** — Each brief leaves the user with what to watch, what to say, what changed, and what can be ignored.

## 2. Navigation Structure

### App Architecture
Hybrid web/PWA architecture: public marketing pages, auth/onboarding stack, authenticated app shell, brief reader, settings, pricing, and simple internal admin.

```
App Root
├── Public
│   ├── / — Landing Page
│   ├── /pricing — Pricing
│   └── /brief/sample — Public Sample Brief
├── Auth
│   ├── /login — Magic Link + Google
│   └── /auth/callback — Session Callback
├── Onboarding
│   ├── /onboarding/language
│   ├── /onboarding/region
│   ├── /onboarding/role
│   ├── /onboarding/goal
│   ├── /onboarding/interests
│   ├── /onboarding/watchlist
│   ├── /onboarding/currency
│   ├── /onboarding/depth
│   ├── /onboarding/delivery
│   └── /onboarding/preview
├── App
│   ├── /today — Today's Brief
│   ├── /briefs/[briefId] — Private Brief Detail
│   ├── /archive — Past Briefs
│   ├── /settings/profile — Personal Intelligence Profile
│   ├── /settings/delivery — Delivery + Notifications
│   ├── /settings/billing — Plan + Billing
│   └── /settings/sources — Source Preferences
├── Modals / Drawers
│   ├── Source Drawer — من وين جبناها؟
│   ├── Glossary Drawer — يعني إيش؟
│   ├── Feedback Sheet — هل كانت مفيدة؟
│   ├── Currency Quick Convert — بالعملة اللي تفهمها
│   └── Upgrade Prompt
└── Internal Admin
    ├── /admin/users
    ├── /admin/profiles
    ├── /admin/briefs
    ├── /admin/generation-runs
    ├── /admin/source-logs
    └── /admin/feedback
```

## 3. Public Screens

### Screen: Landing Page

**Route**: `/`  
**Access**: Public  
**Purpose**: Explain Zubda quickly and emotionally, then drive signup or sample brief exploration.

#### Hero Copy Direction
Primary Arabic:
> زبدة يومك، بدون زحمة.

Supporting Arabic:
> كل صباح، زبدة شخصية من الأخبار، السوق، التقنية، والمواضيع اللي تهمك.

English support:
> The bottom line on what matters to you.

Primary CTA:
> ابدأ زبدتك

Secondary CTA:
> جرب زبدة اليوم

#### Layout
```
┌────────────────────────────────────┐
│ Zubda / زبدة           Login       │
├────────────────────────────────────┤
│ زبدة يومك، بدون زحمة.              │
│ كل صباح، زبدة شخصية مما يهمك       │
│ [ابدأ زبدتك] [جرب زبدة اليوم]      │
│                                    │
│ Preview: phone-style brief panel   │
├────────────────────────────────────┤
│ What Zubda Does                    │
│ How It Works                       │
│ Example Brief Preview              │
│ Interest Modules                   │
│ Trust + Sources                    │
│ Pricing                            │
└────────────────────────────────────┘
```

#### Elements
| Element | Type | Behavior |
|:--------|:-----|:---------|
| Brand mark | Link | Returns to `/` |
| Login | Button | Opens `/login` |
| ابدأ زبدتك | Primary CTA | Opens `/login?intent=signup` |
| جرب زبدة اليوم | Secondary CTA | Opens `/brief/sample` |
| Example brief preview | Interactive preview | Shows collapsed sections: زبدة اليوم, راقب هذي, وش أثرها عليك؟ |
| Interest module chips | Static / interactive preview | Demonstrates configurable interests without becoming a setup form |
| Trust section | Content section | Shows source-backed, fact vs interpretation, and privacy cues |
| Pricing cards | Cards | Link to `/pricing` or signup |

#### States
- **Loading**: Skeleton for preview card; copy remains visible.
- **Empty**: Not applicable.
- **Error**: If sample preview fails, show: ما قدرنا نعرض المثال الآن. جرب بعد شوي.
- **Success**: CTA click transitions to auth or sample brief.

#### Navigation
- **Entry**: Direct URL, waitlist link, shared sample brief, search, social.
- **Exit**: `/login`, `/brief/sample`, `/pricing`.
- **Back**: Browser back.

### Screen: Pricing

**Route**: `/pricing`  
**Access**: Public  
**Purpose**: Communicate Free, Pro Monthly, and Founder Lifetime clearly.

#### Layout
```
┌────────────────────────────────────┐
│ Pricing header                     │
│ اختر الزبدة اللي تناسبك            │
├────────────────────────────────────┤
│ Free                               │
│ زبدة يومية بسيطة                   │
│ $0                                 │
│ [ابدأ مجانًا]                      │
├────────────────────────────────────┤
│ Pro Monthly                        │
│ تخصيص أعمق، أرشيف كامل            │
│ $7.99 / AED 29 / SAR 29            │
│ [جرّب Pro]                         │
├────────────────────────────────────┤
│ Founder Lifetime                   │
│ ادفع مرة وخلك من أوائل المؤسسين   │
│ $99 / AED 399 / SAR 399            │
│ [انضم للمؤسسين]                    │
└────────────────────────────────────┘
```

#### Elements
| Element | Type | Behavior |
|:--------|:-----|:---------|
| Currency selector | Segmented control | Displays USD, AED, SAR, EGP first |
| Free card | Pricing card | Starts signup |
| Pro card | Pricing card | Starts Stripe Checkout subscription flow |
| Founder Lifetime card | Pricing card | Starts Stripe Checkout one-time payment flow |
| Plan comparison | Compact table | Shows limits for interests, watchlist, archive, currency, search |

#### States
- **Loading**: Pricing skeleton if prices come from backend.
- **Error**: Show fixed fallback prices and a checkout retry state.
- **Success**: User enters Stripe Checkout or returns with payment pending until webhook confirms entitlement.

## 4. Authentication

### Screen: Login

**Route**: `/login`  
**Access**: Public  
**Purpose**: Low-friction passwordless entry.

#### Copy
Primary:
> ادخل بريدك ونرسل لك رابط الدخول.

Secondary:
> بدون كلمة مرور، بدون وجع راس.

#### Layout
```
┌─────────────────────────────┐
│ Zubda / زبدة                │
├─────────────────────────────┤
│ ادخل بريدك ونرسل لك الرابط  │
│ [ email@example.com       ] │
│ [أرسل الرابط]               │
│ ───────── أو ─────────      │
│ [Continue with Google]      │
└─────────────────────────────┘
```

#### Elements
| Element | Type | Behavior |
|:--------|:-----|:---------|
| Email input | Input | Validates email format |
| أرسل الرابط | Button | Sends magic link |
| Google sign-in | OAuth button | Starts Google auth |
| Terms copy | Inline text | Links to terms/privacy |

#### States
- **Loading**: نرسل لك الرابط...
- **Success**: شيك بريدك. أرسلنا لك رابط الدخول.
- **Error**: ما قدرنا نرسل الرابط. تأكد من البريد وجرب مرة ثانية.

#### Navigation
- **Entry**: Landing, pricing, expired session.
- **Exit**: `/auth/callback`, then `/onboarding/language` or `/today`.
- **Back**: Returns to originating public page.

## 5. Onboarding

### Flow Goal
Build one Personal Intelligence Profile without making the user feel trapped in a long form.

### Global Onboarding Rules
- Use chip selection, segmented controls, and short inputs.
- Show progress, but keep it gentle.
- Keep typing optional except email and watchlist.
- Allow skip for optional watchlist.
- Every step uses Arabic-first copy in Arabic mode.

### Step A: Language Mode

**Route**: `/onboarding/language`  
**Prompt**: بأي لغة تبي الزبدة؟

| Option | Meaning |
|:-------|:--------|
| عربي | Arabic UI and Arabic brief |
| English | English UI and English brief |
| Mixed | Arabic UI and Arabic explanation with natural English business terms |

### Step B: Country / Region

**Route**: `/onboarding/region`  
**Prompt**: وين نركز لك؟

Options: UAE, Saudi, Egypt, Qatar, Kuwait, Bahrain, Oman, Wider GCC, MENA, Global.

### Step C: Role

**Route**: `/onboarding/role`  
**Prompt**: وش أقرب وصف لك؟

Options: Consultant, Founder, Investor, Corporate / Strategy, Tech / Product, Government / Policy, Student, Creator, Fashion / Luxury, Other.

### Step D: Main Goal

**Route**: `/onboarding/goal`  
**Prompt**: ليش تبي زبدة كل صباح؟

Options:
- أبغى أكون مطّلع قبل الدوام
- أبغى أتابع السوق والاستثمار
- أبغى أفهم التقنية والذكاء الاصطناعي
- أبغى أتابع مجالي وعملائي
- أبغى كلام ينقال في الاجتماعات
- أبغى أقلل وقت التصفح

### Step E: Interest Modules

**Route**: `/onboarding/interests`  
**Prompt**: وش المواضيع اللي تهمك؟

Interest modules:
- Finance and investing
- AI and technology
- GCC business
- Global economy
- Energy and oil
- Sustainability and climate
- Startups and VC
- Real estate
- Fashion and luxury
- Retail and consumer trends
- Geopolitics
- Public sector and policy
- Sports business
- Healthcare
- User-defined topics

Rules:
- Free users may select up to 3 modules.
- Pro users may select more modules.
- If the user selects too many unrelated modules, ranking still keeps the brief concise.

### Step F: Watchlist

**Route**: `/onboarding/watchlist`  
**Prompt**: مين أو إيش تبغى نراقب لك؟

Examples: Nvidia, QQQ, Saudi market, AI regulation, LVMH, oil prices, UAE real estate, Ministry announcements.

### Step G: Currency

**Route**: `/onboarding/currency`  
**Prompt**: بأي عملة تحب نفهمك الأرقام؟

Primary options: USD, AED, SAR, EGP.  
Secondary options: QAR, KWD, BHD, OMR.

### Step H: Brief Depth

**Route**: `/onboarding/depth`  
**Prompt**: قد إيش تبيها مختصرة؟

| Depth | Copy | Behavior |
|:------|:-----|:---------|
| Quick | دقيقتين | Top 3-5 items, minimal context |
| Standard | خمس دقائق | Default; full daily brief structure |
| Deep | أعمق شوي | More sources, context, and explanation |

Default: Standard.

### Step I: Delivery Time

**Route**: `/onboarding/delivery`  
**Prompt**: متى توصلك الزبدة؟

Controls:
- Time picker
- Timezone confirmation
- Email delivery toggle on by default
- PWA push teaser disabled until P1

### Step J: Preview

**Route**: `/onboarding/preview`  
**Purpose**: Show the user how tomorrow's brief might feel.

#### Layout
```
┌────────────────────────────────────┐
│ خلّ زبدة تفهمك                     │
│ بناءً على اختياراتك...             │
├────────────────────────────────────┤
│ زبدة اليوم                         │
│ 3 preview bullets                  │
├────────────────────────────────────┤
│ راقب هذي                           │
│ 2 watchboard preview cards         │
├────────────────────────────────────┤
│ [ابدأ زبدتي]                       │
└────────────────────────────────────┘
```

#### Success
User lands on `/today` if a brief exists, or sees a "first brief scheduled" state.

## 6. Daily Brief Experience

### Screen: Today's Brief

**Route**: `/today`  
**Access**: Authenticated  
**Purpose**: The main product experience.

#### Section Order
1. Hero header
2. زبدة اليوم / Executive Snapshot
3. راقب هذي / Today's Watchboard
4. أثرها عليك / Personal Impact
5. حسب اهتماماتك / Topic Radar
6. Interest module sections as relevant
7. كلام ينقال / Talking Points
8. من وين جبناها؟ / Sources
9. يعني إيش؟ / Glossary
10. Completion state

#### Layout
```
┌────────────────────────────────────┐
│ Good morning + date                │
│ زبدة اليوم جاهزة                   │
│ Progress: 0% → 100%                │
├────────────────────────────────────┤
│ زبدة اليوم                         │
│ 3-5 bottom-line bullets            │
├────────────────────────────────────┤
│ راقب هذي                           │
│ Watchboard cards                   │
├────────────────────────────────────┤
│ أثرها عليك                         │
│ Personal impact cards              │
├────────────────────────────────────┤
│ حسب اهتماماتك                      │
│ Topic radar modules                │
├────────────────────────────────────┤
│ كلام ينقال                         │
│ Meeting-ready talking points       │
├────────────────────────────────────┤
│ خلصت زبدة اليوم                    │
│ [أرشيف] [عدّل اهتماماتك]          │
└────────────────────────────────────┘
```

### Major Story Component

Each major story uses:
- وش السالفة؟
- ليش يهمك؟
- مين يستفيد؟
- مين ممكن يتأثر؟
- وش تراقب؟
- بالعربي البسيط
- المصدر

#### Elements
| Element | Type | Behavior |
|:--------|:-----|:---------|
| Expand/collapse story | Disclosure | Opens detail layers without leaving the brief |
| Source chip | Button | Opens Source Drawer |
| Glossary term | Tooltip / drawer | Opens يعني إيش؟ explanation |
| Currency value | Inline conversion | Shows preferred and optional secondary currency |
| Feedback controls | Icon/button group | مفيد, مو مهم, أكثر من كذا, أقل من كذا, زودني عن الموضوع |
| Save card | Button | Pro feature; saves story or share card |

### Watchboard Card

```
┌────────────────────────────────────┐
│ الشيء اللي تراقبه                  │
│ تصريحات الفيدرالي                  │
├────────────────────────────────────┤
│ ليش مهم                            │
│ إذا كان الخطاب متشدد، ممكن...     │
│ التأثير المحتمل                    │
│ يضغط على شركات التقنية والنمو      │
│ مين يتأثر                          │
│ Nasdaq, QQQ, SMH                   │
│ بالعربي البسيط                     │
│ إذا الفائدة متوقع تبقى عالية...   │
└────────────────────────────────────┘
```

### Daily Brief States
- **Generating**: نجهز لك الزبدة... with progress stages: نجمع المصادر, نفلتر الزحمة, نرتب المهم لك, نراجع المصادر.
- **Ready**: زبدة اليوم جاهزة.
- **No high-signal update**: ما فيه شيء قوي اليوم في هذا الموضوع.
- **Partial brief**: بعض المصادر تأخرت، جهزنا لك أهم الموجود.
- **Error**: تعثر تجهيز الزبدة. حاول مرة ثانية أو نرسلها لك لما تجهز.
- **Completed**: خلصت زبدة اليوم. عندك الزبدة، بدون زحمة.

## 7. Archive

### Screen: Archive

**Route**: `/archive`  
**Access**: Authenticated  
**Purpose**: Let users revisit old briefs.

#### Copy
Title:
> زبداتك السابقة

#### Elements
| Element | Type | Behavior |
|:--------|:-----|:---------|
| Brief list | Date-grouped list | Opens `/briefs/[briefId]` |
| Topic filter | Filter chips | P1 or Pro |
| Search | Input | Pro; searches full archive |
| Upgrade prompt | Inline card | Appears when Free user reaches archive limit |

#### States
- **Empty**: أول زبدة لك بتظهر هنا بعد ما تجهز.
- **Free limit**: الأرشيف الكامل مع Pro.
- **Error**: ما قدرنا نجيب الأرشيف الآن.

## 8. Settings

### Screen: Profile Settings

**Route**: `/settings/profile`  
**Access**: Authenticated  
**Purpose**: Edit Personal Intelligence Profile.

Sections:
- Language mode
- Region
- Role
- Main goal
- Interest modules
- Watchlist
- Preferred currency
- Brief depth

### Screen: Delivery Settings

**Route**: `/settings/delivery`  
**Access**: Authenticated  
**Purpose**: Control email delivery and future push notification preferences.

Sections:
- Delivery time
- Timezone
- Email status
- PWA push status, disabled until supported

### Screen: Billing Settings

**Route**: `/settings/billing`  
**Access**: Authenticated  
**Purpose**: Show plan, limits, upgrade path, and payment status.

Sections:
- Current plan
- Usage limits
- Upgrade CTA
- Stripe Customer Portal link when available
- Stripe subscription / lifetime entitlement status

## 9. Drawers and Modals

### Source Drawer: من وين جبناها؟

Shows:
- Source title
- Publisher
- Source type
- Time/date
- Reliability label
- Why used
- Link

### Glossary Drawer: يعني إيش؟

Shows:
- Term
- Plain Arabic explanation
- Example in context
- Related terms

### Currency Quick Convert: بالعملة اللي تفهمها

Shows:
- Original amount
- Preferred currency conversion
- Secondary currency conversion if configured
- FX timestamp

### Feedback Sheet: هل كانت مفيدة؟

Options:
- مفيد
- مو مهم
- أكثر من كذا
- أقل من كذا
- زودني عن الموضوع

## 10. Internal Admin

### Admin Scope for MVP
Simple internal screens are allowed because generated intelligence needs monitoring.

Admin can:
- view users
- view profiles
- view generated briefs
- inspect failed generation
- resend brief
- manually trigger brief
- review feedback
- inspect source logs

Admin does not need a polished enterprise dashboard for MVP.

## 11. User Flows

### Flow 1: First-Time User
```
Landing
  ├─ ابدأ زبدتك
  ▼
Login
  ├─ Magic Link
  └─ Google
  ▼
Onboarding
  ├─ Language
  ├─ Region
  ├─ Role
  ├─ Goal
  ├─ Interests
  ├─ Watchlist
  ├─ Currency
  ├─ Depth
  ├─ Delivery Time
  └─ Preview
  ▼
Today / First Brief Scheduled
```

### Flow 2: Daily Brief Habit
```
Scheduled Email
  ├─ 5-bullet summary
  └─ Open full brief
      ▼
Private Brief Page
  ├─ Read sections
  ├─ Open sources / glossary
  ├─ Give feedback
  └─ Completion state
```

### Flow 3: Upgrade
```
Free User
  ├─ Hits interest/watchlist/archive limit
  ├─ Sees compact upgrade prompt
  ▼
Pricing
  ├─ Pro Monthly
  └─ Founder Lifetime
      ▼
Stripe Checkout
      ▼
Webhook confirms entitlement
      ▼
Plan becomes active in Firestore
```

### Flow 4: Feedback Loop
```
Brief Item
  ├─ مفيد
  ├─ مو مهم
  ├─ أكثر من كذا
  ├─ أقل من كذا
  └─ زودني عن الموضوع
      ▼
Feedback stored
      ▼
Future ranking adjusts
```

## 12. State Transitions

### Auth States
```
VISITOR → MAGIC_LINK_SENT → AUTHENTICATED
                              │
                              ├─ PROFILE_INCOMPLETE → ONBOARDING
                              └─ PROFILE_COMPLETE → TODAY
```

### Brief States
```
SCHEDULED → COLLECTING_SOURCES → RANKING → GENERATING → REVIEWING → READY
      │             │              │           │            │
      └─────────────┴──────────────┴───────────┴────────────┴── FAILED → RETRY
```

### Plan States
```
FREE → PRO_REQUESTED → PRO_ACTIVE
FREE → FOUNDER_REQUESTED → FOUNDER_ACTIVE
PRO_ACTIVE → CANCELLED → FREE_LIMITED
```

## 13. Error Handling UX

| Error Type | User-Facing Message | Action |
|:-----------|:---------------------|:-------|
| Network offline | اتصالك ضعيف. بنحاول نجيب الزبدة لما يرجع الاتصال. | Retry |
| Auth expired | انتهت الجلسة. ادخل مرة ثانية ونكمل من مكانك. | Login |
| Brief generation failed | تعثر تجهيز الزبدة. بنحاول مرة ثانية. | Retry / notify later |
| No high-signal topic update | ما فيه شيء قوي اليوم في هذا الموضوع. | Continue brief |
| Source unavailable | المصدر غير متاح الآن، لذلك خففنا الثقة في هذا البند. | Open sources |
| Permission denied | هذي الميزة ضمن Pro. | Upgrade |
| Archive limit | الأرشيف الكامل مع Pro. | Upgrade |
| Currency unavailable | ما قدرنا نحدث سعر الصرف الآن. نعرض آخر سعر محفوظ. | Continue |

## 14. Deep Linking

| Link Pattern | Target Screen | Parameters |
|:-------------|:--------------|:-----------|
| `/briefs/[briefId]` | Private brief detail | `briefId` |
| `/brief/sample` | Public sample brief | none |
| `/today` | Current daily brief | none |
| `/archive?topic=` | Archive filtered by topic | `topic` |
| `/settings/profile` | Profile settings | none |
| `/pricing?currency=` | Pricing page | `currency` |
