# Zubda Data And API Strategy

## Current Recommendation

Use a cheap staged data stack first:

1. Free broad discovery: GDELT.
2. Official public sources: central banks, company investor relations, exchanges, government pages, OPEC, ministries.
3. Optional low-cost market/news API: Financial Modeling Prep.
4. Paid premium providers later only after retention or B2B demand is proven.

Do not start with Reuters, Bloomberg, FactSet, or LSEG unless we have a paying pilot that needs licensed professional content.

## Why

The first trust gap is not "more sources." It is freshness, source logging, fact-vs-interpretation separation, and no fake numbers. We can get enough signal for MVP by collecting public news and official sources centrally, caching them, validating them, and then generating personalized briefs from that cache.

## Cost Control

The app should not make live data calls every time a user opens a report.

Flow:

1. Cron collects shared source stories.
2. Stories are normalized and cached in Firestore.
3. User briefs are generated from cached story objects.
4. The web app reads stored briefs.

This keeps API cost tied to scheduled collection and generation, not page views.

## Sources

### GDELT

Role: free broad news discovery.

Pros:
- Free and open.
- Near-real-time global news monitoring.
- Good for discovering what topics are moving.

Cons:
- Not a licensed premium news feed.
- Needs filtering and validation.
- Should not be the only source for market numbers.

### Financial Modeling Prep

Role: optional market/news data once we add `FMP_API_KEY`.

Pros:
- Low-cost compared with enterprise providers.
- Has market news, fundamentals, crypto, forex, and commodity categories.
- Simple API for MVP.

Cons:
- Display/licensing terms matter if we redistribute data.
- Need source timestamps and validation rules.

### Official Sources

Role: highest-trust factual backbone.

Examples:
- Federal Reserve.
- Central Bank UAE.
- Saudi Central Bank.
- OPEC.
- Company investor relations.
- Exchange pages.
- Government portals.

### Premium Sources Later

Reuters/LSEG, Bloomberg, FactSet, AlphaSense, and similar providers should be considered later for:

- B2B pilots.
- Professional finance tiers.
- Licensed redistribution.
- Enterprise reliability requirements.

## JAIS / Arabic Models

JAIS is useful as a potential Arabic tone or localization model, not as the first production brain.

Possible later uses:
- Arabic tone polish.
- Arabic quality evaluator.
- Dialect/style benchmark against Gemini/OpenAI.
- Local or private model experiments through an OpenAI-compatible endpoint.

Do not use JAIS as the only model for factual synthesis until it is benchmarked. It does not solve source freshness, data accuracy, or market validation.

## What We Need From The Founder

Required soon:
- Firebase Admin credentials already configured in Vercel.
- Decide whether to create a free FMP account and share `FMP_API_KEY`.
- Decide whether to create Tavily or Brave Search API keys for broader web search.

Not required yet:
- Reuters/LSEG/Bloomberg.
- Paid Alpha Vantage.
- Self-hosted JAIS.
- Expensive vector database.

## Next Implementation Steps

1. Add source validation fields to `sourceStories`.
2. Add market data objects separate from story objects.
3. Add FMP quotes/news adapter behind `FMP_API_KEY`.
4. Add deterministic validation before briefs are marked `ready`.
5. Add admin review state for `needs_review`.
6. Add source freshness and last-checked labels to the brief UI.
