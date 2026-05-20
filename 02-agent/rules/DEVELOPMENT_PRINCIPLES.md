# Development Principles — Zubda / زبدة

> Persistent implementation rules for future agents. Use these alongside `CODE_QUALITY.md`, `SECURITY.md`, and the product docs in `01-docs/`.

## 1. Docs Drive Product Decisions

Before implementing product behavior, read:
- `01-docs/PRD.md`
- `01-docs/APP_FLOW.md`
- `01-docs/FRONTEND_GUIDELINES.md`
- `01-docs/TECH_STACK.md`
- `01-docs/BACKEND_STRUCTURE.md`

If implementation pressure conflicts with product docs, pause and update the docs or ask for a decision.

## 2. Library-First Development

Use proven packages for common product primitives:
- auth flows
- forms and validation
- accessible dialogs/drawers
- email templates
- scheduling
- currency formatting
- charts
- RTL-safe UI primitives

Build custom components only when they express Zubda's product-specific brief, source, glossary, watchlist, or feedback patterns.

## 3. Arabic-First UX

Zubda is not English UI translated into Arabic.

Implementation must support:
- true RTL layout
- Arabic-first microcopy
- mixed Arabic/English sentences
- localized dates, times, and currencies
- natural rendering of English company names and financial terms inside Arabic text

## 4. One Brief, Not a Feed

Do not drift into infinite scroll or generic aggregation.

The core screen is one daily brief with:
- beginning
- structured middle
- end state
- source transparency
- feedback loop

Users should feel: خلص، عرفت الزبدة.

## 5. Trust Is a Product Primitive

Every major insight should store and expose:
- source title
- source URL
- source type
- timestamp
- reliability label
- why it was included
- confidence or evidence strength where relevant

Do not scrape paywalled content. Do not reproduce long copyrighted content.

## 6. Personalization Is the Product

The brief must be shaped by:
- language mode
- country/region
- role
- main goal
- interest modules
- watchlist
- preferred currency
- brief depth
- delivery time
- feedback

Do not hardcode rigid vertical products such as "finance brief" or "fashion brief." The user has one primary profile with many interests.

## 7. Mobile-First, Desktop-Compatible

The daily consumption surface is phone-first. Desktop should work cleanly for onboarding, archive, settings, and admin, but mobile reading quality comes first.

## 8. Premium but Alive

The UI should feel sharp, modern, GCC-fluent, and useful. Avoid:
- generic SaaS purple gradients
- stiff corporate dashboard tone
- government portal styling
- meme-app behavior
- endless news-feed patterns

## 9. Money and Currency Rules

Use fixed localized prices for checkout. Use exchange-rate data for in-app conversion.

Stripe is required from day one:
- Use Checkout Sessions for Pro Monthly and Founder Lifetime.
- Use Stripe Billing for recurring subscription state.
- Use webhooks as the source of truth for entitlement activation.
- Store Stripe customer, subscription, plan, and entitlement state in Firestore.
- Do not build manual payment workarounds.

Support these display currencies in the product model:
- USD
- AED
- SAR
- EGP
- QAR
- KWD
- BHD
- OMR

Use `Intl.NumberFormat` for display and preserve FX timestamps for converted values.

## 10. MVP Scope Discipline

Do not build these in the 6-week MVP unless the docs are updated:
- native iOS app
- native Android app
- WhatsApp delivery
- Telegram delivery
- team dashboards
- enterprise workspace features
- audio briefs
- marketplace of sources
- full real-time chat over archive
- annual pricing
- multiple saved profiles per user
