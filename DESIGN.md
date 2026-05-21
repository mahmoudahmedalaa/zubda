# Zubda Design Context

## Direction

Zubda should feel Arabic-first, mobile-first, warm, premium, GCC-fluent, and trustworthy. The current visual direction is Drahim-inspired clarity with Zubda's own intelligence layer: readable Arabic typography, spacious cards, soft blue-lavender atmosphere, bright cobalt action color, teal trust accents, and source-backed content blocks.

The design should feel like a sharp GCC friend giving you the real bottom line before your day starts.

## Scene

A busy UAE or Saudi professional opens Zubda on their phone in the morning before work. They are moving fast, probably between WhatsApp, email, LinkedIn, and meetings. The screen needs to feel calm, clear, and instantly useful, not dense or performative.

This means light-first, high readability, generous spacing, and finite progress through the brief.

## Visual Rules

- Use Arabic-first RTL layouts, not mirrored English layouts.
- Prefer large readable Arabic headings and short body lines.
- Use white or subtly tinted surfaces over a pale blue-lavender page background.
- Use cobalt blue for primary action and brand emphasis.
- Use teal for trust, source, and confidence signals.
- Use warning/risk colors sparingly for market pressure or alerts.
- Avoid generic purple gradients, dark AI glows, and noisy decoration.
- Avoid nested cards and repeated identical card grids.
- Avoid developer-facing helper copy in user UI.

## Typography

Primary UI fonts in the app:
- Readex Pro for Arabic readability.
- IBM Plex Sans Arabic for display emphasis where used.
- JetBrains Mono for numbers, dates, IDs, and market values.

Typography principles:
- Arabic body copy needs generous line height.
- Titles should not end with unnecessary full stops.
- Key statements should be short and confident.
- Company names, tickers, and source names can remain English where natural.
- Do not mix English labels into Arabic UI unless the term is naturally used that way.

## Color Tokens

Core tokens already live in `src/app/globals.css`.

Primary roles:
- Page background: `--color-paper`
- Surface: `--color-surface`
- Raised surface: `--color-surface-raised`
- Text: `--color-ink`
- Muted text: `--color-ink-muted`
- Borders: `--color-line`
- Brand blue: `--color-zubda-500`
- Trust teal: `--color-trust-500`
- Risk: `--color-risk`
- Warning: `--color-warning`

Use color deliberately. Zubda can use more than one accent, but each accent needs a job: action, trust, pressure, or data differentiation.

## Motion

Motion should be subtle, purposeful, and fast:
- Staggered section reveal.
- Soft card entrance.
- Gauge and chart animation.
- Tooltip and source drawer expansion.
- Feedback tap acknowledgement.
- Brief-ready success state.

Do not use bounce, elastic motion, decorative looping AI lines, or animations that make the app feel childish.

Respect reduced motion.

## Product Surfaces

Landing:
- Show the product clearly.
- Explain personalization, trust, and the morning ritual.
- Include menu, footer, pricing, sample brief, and clear CTA.
- Do not be too short or too abstract.

Login:
- Simple email/password and Google.
- Human Arabic error messages.
- Do not mention implementation details unless configuration is blocked.

Onboarding:
- One primary profile.
- Ask enough to make the brief personal: language, region, role, goals, interests, watchlist, communication style, personal context, depth, delivery time.
- Keep it mobile-friendly and skippable where optional.

Daily Brief:
- The brief has a beginning, middle, and end.
- Top area should show mood, metrics, source count, date, and depth.
- Include charts or numbers when they add meaning.
- Explain what the user should watch and why.
- Sources are visible through progressive disclosure.

Pricing:
- Three plans only: Free, Pro Monthly, Founder Lifetime.
- Currency selection should be a clean segmented or dropdown control, not repeated noisy price lines inside every card.
- Do not explain implementation mechanics to users.

## Quality Bar

The UI is successful if:
- The first screen explains Zubda in under 10 seconds.
- The Arabic feels natural and approachable.
- The brief can be scanned in five minutes.
- The app feels calmer than scrolling and sharper than a newsletter.
- The user sees why the brief is personal to them.
- Trust and sources are present without overwhelming the main read.
