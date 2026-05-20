# Frontend Design System & Guidelines — Zubda / زبدة

> This document turns the Zubda brand brief into concrete UI rules. It should guide implementation, screenshots, QA, and future design decisions.

## 1. Design Principles

1. **Arabic-first, GCC-native** — The product must feel designed in Arabic, not translated into Arabic.
2. **One daily ritual** — The UI should guide users through a finite brief with a clear end state.
3. **Warm intelligence** — Premium and useful, but alive enough to feel like a sharp GCC friend.
4. **Trust by design** — Sources, confidence, and fact vs interpretation are visible through clean disclosure.
5. **Personalization feels made for me** — Interests, watchlist, region, role, currency, and feedback appear in the interface.
6. **Scannable in five minutes** — Cards, headings, and progressive disclosure beat long walls of text.

## 2. Design Inspiration and Benchmarks

| Reference | What to Learn | What Not to Copy |
|:----------|:--------------|:-----------------|
| Drahim / دراهم | Friendly local Arabic tone, trust cues, complex financial ideas made simple | Do not make Zubda look like a finance tracker or bank |
| Thmanyah / ثمانية | Premium Arabic editorial identity, spacing, typography, confident content hierarchy | Do not make Zubda publisher-led or static |
| Nabd / نبض | Mobile-first Arabic topic selection and notification habit | Do not become an endless headline aggregator |
| Particle | Multi-source synthesis, summary layers, source transparency, future follow-up questions | Do not feel English-first or overcomplicate every story |
| Duolingo / Headway / Blinkist | Daily completion, progress cues, bite-sized learning | Do not become childish or gamified |
| Spotify Daylist / Wrapped | Personalized language and "made for you" feeling | Do not add delight at the cost of speed and clarity |
| Notion | Clean modular content blocks and calm scanning | Do not become plain or generic |
| Linear / Raycast | Speed, polish, keyboard quality for later dashboard use | Do not over-optimize desktop before mobile |

## 3. Visual Direction

### Chosen Direction
Drahim-inspired Arabic clarity with Zubda intelligence.

The UI should combine:
- pale blue/lavender app background
- crisp white cards
- large rounded Arabic typography
- bright cobalt/blue primary action color
- teal trust accents
- generous spacing and pill-shaped controls
- short Arabic copy that is easy to scan on mobile

Avoid:
- generic SaaS purple gradients
- childish illustration
- AI-glow visuals
- financial terminal darkness everywhere
- government portal styling
- old newspaper texture
- beige-only or desert-only palettes

## 4. Color System

Use HSL tokens so implementation can tune lightness while preserving hue. The base mode is light and warm. Dark mode is allowed later, but MVP should be light-first.

### Brand Tokens

```css
:root {
  --color-paper: hsl(232 100% 99%);
  --color-surface: hsl(0 0% 100%);
  --color-surface-raised: hsl(0 0% 100%);
  --color-ink: hsl(228 25% 9%);
  --color-ink-muted: hsl(221 13% 55%);
  --color-line: hsl(225 31% 89%);

  --color-zubda-50: hsl(235 100% 97%);
  --color-zubda-100: hsl(236 100% 93%);
  --color-zubda-200: hsl(236 96% 86%);
  --color-zubda-300: hsl(236 94% 76%);
  --color-zubda-400: hsl(237 97% 68%);
  --color-zubda-500: hsl(237 97% 61%);
  --color-zubda-600: hsl(238 78% 53%);
  --color-zubda-700: hsl(239 66% 45%);
  --color-zubda-800: hsl(240 58% 36%);
  --color-zubda-900: hsl(241 53% 27%);

  --color-trust-50: hsl(166 54% 95%);
  --color-trust-100: hsl(166 48% 88%);
  --color-trust-200: hsl(166 43% 76%);
  --color-trust-300: hsl(166 40% 62%);
  --color-trust-400: hsl(167 45% 46%);
  --color-trust-500: hsl(169 64% 31%);
  --color-trust-600: hsl(171 72% 25%);
  --color-trust-700: hsl(172 78% 19%);
  --color-trust-800: hsl(174 76% 14%);
  --color-trust-900: hsl(176 70% 10%);

  --color-risk: hsl(350 58% 42%);
  --color-warning: hsl(32 90% 48%);
  --color-success: hsl(153 57% 34%);
  --color-info: hsl(205 62% 38%);
}
```

### Semantic Mappings

| Use | Token |
|:----|:------|
| Main background | `--color-paper` |
| Cards and panels | `--color-surface`, `--color-surface-raised` |
| Primary text | `--color-ink` |
| Secondary text | `--color-ink-muted` |
| Borders and dividers | `--color-line` |
| Primary CTA | `--color-ink` background with paper text |
| Highlight / zubda emphasis | `--color-zubda-500` |
| Source / trust indicators | `--color-trust-500` |
| Risk / pressure | `--color-risk` |
| Warning / attention | `--color-warning` |

## 5. Typography

### Font Strategy
- Arabic primary: `Noto Kufi Arabic` for UI and display text.
- Arabic companion: `Readex Pro` for Latin/company names and mixed labels where needed.
- Drahim uses a rounded Montserrat-Arabic style; Zubda approximates that readability with licensed Google fonts for MVP.
- Monospace/numbers: `JetBrains Mono` for aligned amounts, FX values, timestamps, and IDs.

If a premium Arabic font such as Thmanyah's font is used, confirm licensing and loading performance before adopting it. Do not block MVP on custom font complexity.

### Type Scale

```css
--font-arabic: "IBM Plex Sans Arabic", "Noto Sans Arabic", system-ui, sans-serif;
--font-latin: "Satoshi", "Manrope", system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

--text-caption: 0.8125rem; /* 13px */
--text-body: 0.9375rem;    /* 15px */
--text-body-lg: 1.0625rem; /* 17px */
--text-h3: 1.1875rem;      /* 19px */
--text-h2: 1.375rem;       /* 22px */
--text-h1: 1.75rem;        /* 28px */
--text-display: 2.25rem;   /* 36px */

--leading-caption: 1.45;
--leading-body: 1.75;
--leading-heading: 1.25;
```

Rules:
- Do not use negative letter spacing.
- Do not scale font size with viewport width.
- Arabic body text needs generous line height.
- Mixed Arabic/English sentences must be tested manually.
- Numbers and currencies should use `font-variant-numeric: tabular-nums`.

## 6. Layout and Spacing

### Spacing Scale

```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-10: 2.5rem;
--space-12: 3rem;
--space-16: 4rem;
```

### Radius and Shadows

```css
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 10px;
--radius-pill: 999px;

--shadow-card: 0 1px 2px hsl(210 17% 9% / 0.06), 0 8px 24px hsl(210 17% 9% / 0.06);
--shadow-drawer: 0 16px 48px hsl(210 17% 9% / 0.18);
```

Rules:
- Cards should usually use large friendly radii (`24px-32px`) on mobile.
- Do not put cards inside cards.
- Use full-width page bands or unframed sections rather than floating section cards.
- Brief content should be constrained to a comfortable reading width on desktop.
- Mobile is the primary consumption viewport.

## 7. Component Patterns

### Landing Hero

```
┌────────────────────────────────────┐
│ Zubda / زبدة           Login       │
├────────────────────────────────────┤
│ زبدة يومك، بدون زحمة.              │
│ كل صباح، زبدة شخصية مما يهمك       │
│ [ابدأ زبدتك] [جرب زبدة اليوم]      │
│                                    │
│ phone-style brief preview          │
└────────────────────────────────────┘
```

Guidelines:
- Hero must make `Zubda / زبدة` visible in the first viewport.
- Avoid generic AI gradients.
- The sample brief preview should show the product, not decorative abstraction.

### Onboarding Step

```
┌────────────────────────────────────┐
│ Step 5 of 10                       │
│ وش المواضيع اللي تهمك؟             │
├────────────────────────────────────┤
│ [AI and technology] [GCC business] │
│ [Finance] [Energy] [Real estate]   │
│ [Fashion/luxury] [User-defined]    │
├────────────────────────────────────┤
│ [رجوع]                  [التالي]  │
└────────────────────────────────────┘
```

Guidelines:
- Use chips and segmented controls over long forms.
- Keep sticky bottom navigation on mobile.
- Explain limits only when they matter.

### Daily Brief Story Card

```
┌────────────────────────────────────┐
│ وش السالفة؟                        │
│ Short factual summary              │
├────────────────────────────────────┤
│ ليش يهمك؟                          │
│ Personal relevance based on profile│
├────────────────────────────────────┤
│ وش تراقب؟                          │
│ Specific watch item                │
├────────────────────────────────────┤
│ [من وين جبناها؟] [يعني إيش؟]      │
│ [مفيد] [مو مهم] [زودني]            │
└────────────────────────────────────┘
```

Guidelines:
- Use disclosure for deeper source details.
- Keep the main card scannable.
- Every story should have a reason for inclusion.

### Watchboard Card

```
┌────────────────────────────────────┐
│ راقب هذي                           │
│ تصريحات الفيدرالي                  │
│ ليش مهم: قد تضغط على أسهم النمو    │
│ مين يتأثر: Nasdaq, QQQ, SMH        │
└────────────────────────────────────┘
```

Guidelines:
- Designed for quick morning scanning.
- Use stable card dimensions to avoid layout shift.
- Make numbers and assets readable in mixed mode.

### Source Drawer

```
┌────────────────────────────────────┐
│ من وين جبناها؟                     │
├────────────────────────────────────┤
│ Source title                       │
│ Publisher · Time · Source type     │
│ Why used                           │
│ Reliability label                  │
│ [Open source]                      │
└────────────────────────────────────┘
```

Guidelines:
- Progressive disclosure keeps trust available without overloading the brief.
- Source links must be visible for major insights.

### Pricing Card

```
┌────────────────────────────────────┐
│ Pro Monthly                        │
│ زبدة أعمق ومخصصة أكثر              │
│ AED 29 / month                     │
│ Full archive · Watchlist · FX      │
│ [جرّب Pro]                         │
└────────────────────────────────────┘
```

Guidelines:
- Three plans only: Free, Pro Monthly, Founder Lifetime.
- Use fixed localized display prices for checkout.
- Keep Founder Lifetime urgent but not aggressive.

## 8. Component Inventory

Required MVP components:
- Landing hero
- Auth screen
- Onboarding wizard
- Interest module selector
- Watchlist input
- Currency selector
- Delivery time selector
- Brief preview card
- Daily brief page
- Executive snapshot card
- Watchboard cards
- Personal impact cards
- Topic radar cards
- Source drawer
- Glossary tooltip / drawer
- Feedback buttons
- Archive list
- Pricing cards
- Profile settings
- Error / retry states
- Empty states
- Loading / generation states

## 9. Motion Guidelines

Use motion sparingly and with purpose.

| Type | Duration | Use |
|:-----|:---------|:----|
| Press feedback | 90-120ms | Buttons, chips, feedback taps |
| Card entrance | 180-240ms | Brief sections appearing |
| Drawer transition | 220-280ms | Source and glossary drawers |
| Generation progress | 800-1200ms stages | Brief preparation state |
| Completion moment | 600-900ms | خلصت زبدة اليوم |

Rules:
- Animate `opacity` and `transform`.
- Respect `prefers-reduced-motion`.
- Avoid decorative motion that slows reading.
- Feedback taps can use a small scale/opacity response.

## 10. RTL and Mixed-Language Requirements

Arabic UI must be true RTL:
- right-aligned layout
- correct punctuation flow
- correct number and currency display
- mixed English company/source names handled naturally
- source titles readable
- charts and tooltips tested in RTL
- forms and navigation mirrored correctly
- dates and times localized

Mixed mode example:
> مزاج السوق اليوم يميل للحذر بسبب ارتفاع Treasury yields.

Plain Arabic explanation:
> عندما ترتفع عوائد السندات، عادةً تتأثر أسهم النمو مثل شركات التقنية لأنها تصبح أقل جاذبية للمستثمرين.

## 11. Microcopy

| Generic Copy | Zubda Copy |
|:-------------|:-----------|
| Executive Summary | زبدة اليوم |
| Market Impact | وش أثرها عليك؟ |
| What to Watch | راقب هذي |
| Source Links | من وين جبناها؟ |
| Glossary | يعني إيش؟ |
| Feedback | هل كانت مفيدة؟ |
| Customize your profile | خلّ زبدة تفهمك |
| No high-signal update today | ما فيه شيء قوي اليوم في هذا الموضوع. |
| Loading | نجهز لك الزبدة... |
| Pricing Free | زبدة يومية بسيطة |
| Pricing Pro | تخصيص أعمق، أرشيف كامل، واهتمامات أكثر |
| Founder Lifetime | ادفع مرة وخلك من أوائل المؤسسين |

## 12. Accessibility

- Color contrast must meet WCAG AA.
- Touch targets must be at least 44px.
- Buttons and icon buttons need accessible labels in current language.
- Drawers require focus management and Escape close on desktop.
- Forms require labels, inline validation, and screen-reader readable errors.
- Do not rely on color alone for risk, trust, or confidence.
- Reduced motion preference must disable non-essential animation.
- Arabic and English screen-reader labels must be tested for primary flows.

## 13. Responsive Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

Rules:
- Mobile-first by default.
- Daily brief should feel best on phone.
- Desktop should provide more breathing room, not a completely different product.
- Admin pages can be denser and more utilitarian.

## 14. Library Direction

Exact package versions are locked in `01-docs/TECH_STACK.md`. The design system preference is:

| Need | Preferred Direction |
|:-----|:--------------------|
| App framework | Next.js / React web PWA unless tech stack changes |
| Styling | Tailwind CSS with CSS variables |
| Accessible primitives | Radix UI or shadcn/ui patterns |
| Icons | Lucide icons |
| Forms | React Hook Form + Zod |
| Charts | Recharts or Tremor-style primitives for simple MVP visuals |
| Motion | Framer Motion or CSS transitions for restrained motion |
| Dates | date-fns with locale support |
| Currency | `Intl.NumberFormat` plus backend FX source |
| Email | React Email-style templates if stack supports it |

Rules:
- Prefer maintained libraries over custom widgets.
- Avoid heavy charting until brief data proves it needs charts.
- Do not introduce a component library that fights RTL.

## 15. Design QA Checklist

- [ ] First viewport clearly says Zubda / زبدة.
- [ ] Landing page explains the product in under 10 seconds.
- [ ] Arabic copy feels native, not translated.
- [ ] Daily brief is scannable in 5 minutes.
- [ ] Brief has a clear end state.
- [ ] No infinite-feed behavior.
- [ ] Source drawer is easy to find but does not clutter the main card.
- [ ] Mixed Arabic/English text renders naturally.
- [ ] Currency values display correctly for USD, AED, SAR, and EGP.
- [ ] Mobile layout works with one thumb.
- [ ] Empty, loading, and error states use Zubda voice.
- [ ] Pricing stays simple: Free, Pro Monthly, Founder Lifetime.
