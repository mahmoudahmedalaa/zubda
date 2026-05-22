# Zubda Accuracy Guardrails

Zubda should never show a market number, factual claim, or dated insight as final unless it passed source, freshness, and consistency checks. If we cannot verify something, we either hide it, label it as unverified, or hold the brief for review.

## Immediate Rule

- Demo data can only appear on `/brief/sample`.
- Authenticated app pages must not show hardcoded live-looking prices.
- A daily brief can be marked `ready` only after validation passes.
- Every number in the UI needs a source, timestamp, and freshness window.

## Data Classes

- `market_price`: Brent, equities, ETFs, rates, FX, crypto, commodities.
- `official_fact`: central bank releases, company IR, government updates, filings.
- `news_claim`: publisher-reported story or analysis.
- `ai_interpretation`: Zubda's explanation of what the fact may mean.

## Market Data Standard

For important market numbers, use at least two independent checks:

- Primary market data provider.
- Secondary verification provider or exchange/source page.
- Last-updated timestamp.
- Tolerance rule, for example reject if sources differ by more than 0.5-1.0% for liquid instruments.
- Market-hours awareness, because delayed futures/equity prices are normal.

If a price cannot be verified:

- Do not display the price.
- Display qualitative wording only, for example "النفط تحت المتابعة" instead of a dollar value.
- Add an internal validation warning.

## Generation Pipeline

1. Collect sources.
2. Normalize stories and market data into structured objects.
3. Validate source freshness and required fields.
4. Score relevance against the user's profile.
5. Draft the brief.
6. Run deterministic checks:
   - no hardcoded demo values
   - no unsupported prices
   - no source older than allowed window unless clearly labeled
   - every major claim has a source
   - no contradiction between metrics and narrative
7. Run AI quality review:
   - Arabic tone check
   - factual consistency check against source objects only
   - hallucination check: reject claims not present in evidence
8. Store as `draft`, `needs_review`, or `ready`.
9. Only `ready` briefs can be emailed or shown as the main daily brief.

## Status Model

- `draft`: generated but not validated.
- `needs_review`: failed validation or has low-confidence facts.
- `ready`: passed validation and safe to show.
- `sample`: demo-only brief, never treated as a real daily report.

## Trust UX

The user-facing brief should show:

- Date of brief.
- Source count.
- Source drawer.
- Last checked timestamp for live market metrics.
- Confidence wording for interpretation, not fake certainty.

The internal admin view should show:

- Failed validation rules.
- Source timestamps.
- Market data providers used.
- AI quality check result.
- Regenerate and approve actions.

## Non-Negotiables

- No fake precise prices.
- No stale demo numbers in authenticated app pages.
- No AI-only market values.
- No publishing if the evidence set is empty.
- No "today" date on old facts unless the fact itself was refreshed today.
