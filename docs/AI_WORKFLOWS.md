# Zubda AI Workflows

## Goal

Zubda uses AI to turn sourced public information into a personal Arabic brief. The AI should not invent the user's identity, invent facts, or search randomly per user. It should work from structured inputs, source logs, and explicit user profile signals.

## User Inputs

Required onboarding signals:
- Role or custom role.
- Region focus.
- Main goals.
- Interest modules.

Optional onboarding signals:
- Watchlist: companies, assets, countries, sectors, brands, people, topics.
- Personal context: what the user does, decisions they care about, what they do not care about.
- Communication style.
- Language mode.
- Brief depth.
- Delivery time.
- Source preferences and avoid topics for paid plans.

Currency is not a personalization engine input. Currency belongs to billing and optional in-brief number conversion only.

## Pipeline

1. Shared source collection
   - Collect open web, RSS, official sources, government sources, company IR, central banks, exchanges, and accessible newsletters.
   - Do not scrape paywalled content.
   - Store source URL, publisher, timestamp, source type, reliability label, and raw title.

2. Source normalization
   - Convert each source into a story object.
   - Required fields: title, short summary, facts, source URL, publisher, timestamp, topic tags, region tags, entity tags, reliability label.
   - Keep fact extraction separate from interpretation.

3. Relevance scoring
   - Score stories against role, goals, region focus, interests, watchlist, source preferences, avoid topics, source reliability, and novelty.
   - Avoid topics can only down-rank or exclude; they must not add new assumptions.

4. Brief synthesis
   - Select a small set of high-signal stories.
   - Generate one coherent brief with: what happened, why it matters, what to watch, personal impact, talking points, glossary, sources.
   - Keep Arabic natural, GCC-friendly, and readable.

5. Quality gate
   - Check that every major claim maps to a source.
   - Check that interpretation is labeled as interpretation.
   - Check that Arabic is not translated-English or overly formal.
   - Reject output if it includes unsupported facts, fake numbers, fake sources, or invented user details.

6. Delivery
   - Store structured brief JSON, source logs, email summary, delivery log, and feedback hooks.
   - Email is a trigger with a short summary and CTA. The full interactive brief lives in the private web page.

## Model Routing

Cheap model:
- Classification.
- Tagging.
- Source summarization.
- Glossary draft.
- First-pass relevance.

Better cheap-enough model:
- Final brief synthesis.
- Arabic tone pass.
- Quality check when deterministic checks are not enough.

Arabic specialist model:
- Optional benchmark route for Arabic tone polishing.
- ALLaM can be tested through an OpenAI-compatible endpoint, but should not be the sole source of reasoning until evaluated against Gemini/OpenAI on factuality, Arabic quality, and cost.

## Guardrails

The AI must:
- Use only provided sources and approved story objects.
- Cite source IDs for each major insight.
- Separate facts from interpretation.
- Say when evidence is weak.
- Preserve user-provided company names and watchlist terms.
- Keep Arabic natural and concise.

The AI must not:
- Invent sources.
- Invent market numbers.
- Claim certainty on forecasts.
- Create user traits from stereotypes.
- Use paywalled text.
- Generate a long generic newsletter.
- Over-personalize from one vague phrase.

## Retrieval And RAG

Zubda's first RAG layer should be practical:
- Firestore `sourceStories` for normalized stories.
- Firestore `sourceLogs` for source provenance.
- Firestore profile data for user signals.
- Optional vector search later for archive search and source similarity.

For MVP, deterministic tags plus structured Firestore queries are enough. Vector search should come later when we have enough story volume and archive history.

## Arabic Quality

Use a small approved copy dictionary for repeated UI and brief labels:
- الزبدة
- وش السالفة؟
- ليش يهمك؟
- وش تراقب؟
- وش أثرها عليك؟
- بالعربي البسيط
- من وين جت؟

Avoid:
- overly formal phrases like `هل أستطيع`
- translated-English labels
- mixed English UI labels unless the user selected English
- meme-heavy copy that hurts trust

## Evaluation

Each generated brief should be checked for:
- Source coverage.
- Unsupported claims.
- Arabic tone.
- User relevance.
- Read length by selected depth.
- Repeated sections.
- Clear next watch item.
- At least one useful number or chart when relevant.
