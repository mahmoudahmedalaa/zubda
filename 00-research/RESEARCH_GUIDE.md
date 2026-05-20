# Research Summary — Zubda

> Completed on May 20, 2026. This document replaces the starter template with the working research baseline for the product.

## 1. Problem Validation

### What problem are we solving?
Zubda is an Arabic-first personal intelligence product that turns fragmented news, markets, industry updates, and global events into a personalized daily brief that explains what changed, why it matters, what to watch, and what it means for the user's work, money, and conversations.

### Who has this problem?
The first exact launch persona is a bilingual GCC-based ambitious professional, age 26-40, based primarily in the UAE and secondarily in Saudi Arabia, working in consulting, finance, tech, startups, government strategy, or corporate leadership.

This user is:
- mobile-first
- heavy on WhatsApp, LinkedIn, newsletters, and ChatGPT
- short on time
- expected to sound informed in meetings and conversations
- willing to pay if the product feels premium and useful every morning

### How do they solve it today?
They stitch together information manually from:
- Arabic aggregators such as [Nabd](https://nabdapp.com/?lang=en)
- business newsletters such as [EnterpriseAM](https://enterpriseam.com/ksa/newsletters/)
- regional publishers such as Asharq Business, Argaam, Arabian Business, Gulf Business, Zawya, CNBC Arabia, and The National
- global tools such as [Particle](https://particle.news/), [Ground News](https://ground.news/subscribe), [Feedly](https://docs.feedly.com/category/728-market-intelligence), and [Readless](https://www.readless.app/)
- workarounds such as WhatsApp groups, Telegram channels, X/Twitter lists, LinkedIn, Notion bookmarks, Perplexity, ChatGPT prompts, and colleagues
- premium professional tools such as Bloomberg, FactSet, Refinitiv, and AlphaSense for users who have access

### Why is the current solution inadequate?
Current options fail because they are usually:
- topic-personalized, not user-context-personalized
- English-first, even when the user thinks and communicates in Arabic or mixed Arabic/English
- focused on "what happened" instead of "why it matters to me"
- weak at connecting events to work, money, clients, industry exposure, and talking points
- noisy, fragmented, or low-trust

The real painful moment is the morning scroll:
- What actually matters today?
- What affects my work, industry, investments, or clients?
- What should I know before meetings?
- What is noise and what is signal?

## 2. User Research

### Target User Persona

| Field | Description |
|:---|:---|
| **Name** | Karim / Layan |
| **Age Range** | 26-40 |
| **Occupation** | Consultant, investor, banker, founder, product/tech professional, strategy manager, or policy professional |
| **Tech Comfort** | High |
| **Primary Device** | iPhone-heavy, but Android must be supported through web/PWA |
| **Key Pain Point** | News and intelligence are fragmented, noisy, and not tailored to what matters for work, money, and smart conversation |
| **Goal** | Understand what matters today in under 5 minutes and feel sharper in meetings, decisions, and professional conversations |

### Behavioral Notes
- Consumes a mix of Arabic and English content
- Often prefers Arabic explanation even when the source material is English
- Uses mobile as the main daily surface
- Needs a premium feeling, not a commodity feed

### User Interview Questions Asked / Answered
1. How do you currently handle this problem?
   Answer: via a patchwork of apps, newsletters, social feeds, WhatsApp groups, AI prompts, and colleagues.
2. What's the most frustrating part?
   Answer: it takes too long to connect the dots and decide what actually matters.
3. What have you tried that didn't work?
   Answer: generic news apps, one-size-fits-all newsletters, and shallow AI summaries.
4. How much time do you spend on this?
   Answer: enough that a 5-minute high-quality brief feels materially better than 30-45 minutes of scrolling.
5. What would a perfect solution look like?
   Answer: "I opened Zubda in the morning and in 5 minutes I understood what matters today better than I would after 45 minutes of scrolling."

## 3. Market Analysis

### Market Shape
This is not a generic consumer news play. It is closer to a premium daily intelligence product for high-agency professionals in GCC/MENA.

The initial wedge is:
- Arabic-first or bilingual
- professional and high-context
- daily habit driven
- explanation and decision relevance driven

### Demand Signals
- [Reuters Institute Digital News Report 2025](https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2025/dnr-executive-summary) highlights overload, skepticism toward AI-generated news, and demand for depth over commodity headlines.
- [Nabd](https://nabdapp.com/?lang=en) proves large demand for personalized Arabic news consumption.
- [EnterpriseAM](https://enterpriseam.com/ksa/newsletters/) proves demand for region-specific morning business briefings.
- [Particle](https://particle.news/) proves modern consumers will engage with AI-personalized summaries.
- [Feedly Market Intelligence](https://docs.feedly.com/category/728-market-intelligence) proves "intelligence" is a real product category, not just a media category.
- [Statista's MENA digital newspapers and magazines forecast](https://www.statista.com/outlook/amo/media/newspapers-magazines/digital-newspapers-magazines/mena) indicates the broader MENA digital news category remains commercially meaningful.

### TAM / SAM / SOM
These are directional and should be tightened once acquisition assumptions are modeled.

- **TAM**: Arabic-speaking and bilingual professionals across GCC/MENA and the diaspora who consume business, market, and industry intelligence digitally.
- **SAM**: Premium mobile-first professionals in UAE and Saudi Arabia who already pay for productivity, information, or niche professional tools.
- **SOM**: 50-100 active beta users in 6 weeks, then a few hundred engaged professionals in the first local growth loop if retention is strong.

### Trends
- News consumption is shifting to mobile, social, and notification-led behaviors.
- Users increasingly want summaries, but do not trust low-context or low-citation AI output.
- Arabic business and strategic explainability remains underserved relative to English markets.
- GCC professionals already work in mixed Arabic/English mental models, which makes a high-quality mixed-language product feel natural rather than niche.

## 4. Technical Feasibility

### Can we build this?
- [x] Required APIs and source access exist for an MVP based on open web, RSS, newsletters, and official sources
- [x] No platform restriction blocks the core feature because the first platform is a mobile-first web app / PWA
- [x] Data sources are available if the MVP avoids paywalled scraping
- [x] Performance requirements are achievable for a daily briefing product
- [x] Infrastructure can remain sustainable at MVP scale

### Product Definition for MVP
The product is not "news summarized." It is "your world interpreted."

The hero experience is:
- morning email trigger
- private web brief
- Arabic-first explanation
- visible sourcing
- clear "why this matters" chain
- archive and feedback loop

### Key Technical Risks

| Risk | Severity | Mitigation |
|:---|:---|:---|
| Arabic quality is weak or unnatural | High | Arabic-first review loop, careful prompt design, glossary support, human QA during prototype |
| Summaries feel generic and not personalized enough | High | Use profile + watchlist + region + role as first-class ranking inputs |
| Trust breaks due to uncited or low-confidence claims | High | Store per-item source metadata, show source links, separate fact from interpretation |
| Source ingestion quality is inconsistent | Medium | Prefer official sources, RSS, and stable newsletters first; avoid brittle scraping early |
| Interest-module scope expands too quickly | High | Launch one focused daily brief experience with many selectable interests, not separate vertical products |
| Delivery timing and scheduler reliability | Medium | Start with email + private web brief before push complexity |

## 5. Business Model Canvas (MVP)

| Element | Decision |
|:---|:---|
| **Revenue Model** | Freemium subscription |
| **Pricing** | Free tier, $7.99/month Pro, and limited $99 Founder Lifetime early-access offer with localized display pricing |
| **Key Cost Drivers** | LLM inference, ingestion/processing, hosting, email delivery, search/storage, monitoring, and editorial QA during the prototype stage |
| **Distribution** | Mobile-first web app / PWA + email-triggered daily brief |
| **Unfair Advantage** | Arabic-first strategic intelligence, mixed-language explainability, vertical relevance, and a premium daily habit rather than generic aggregation |

### MVP Monetization Stance
- No ads
- No lead-gen detours
- No data-selling trust erosion
- B2B team intelligence comes later if the individual habit proves strong

## 6. Go / No-Go Decision

- [x] The problem is real and validated enough to prototype
- [x] The target user is clearly defined
- [x] There is a plausible competitive wedge
- [x] The technical approach is feasible
- [x] The business model can be tested without huge upfront cost
- [x] The project has a realistic 2-week prototype and 6-week MVP path

**Decision**: GO

## 7. Launch Thesis

### Product Name
Zubda

### Core Promise
Every morning, Zubda gives the user a personalized intelligence brief that connects global events to their world.

### Launch Experience
Zubda should not force users into rigid vertical products. The launch experience is one Personal Intelligence Profile per user, with configurable interest modules.

Supported interest modules include:
- finance and investing
- AI and technology
- GCC business
- global economy
- energy and oil
- sustainability and climate
- startups and venture capital
- real estate
- fashion and luxury
- retail and consumer trends
- geopolitics
- public sector and policy
- sports business
- healthcare
- user-defined topics, companies, assets, brands, countries, and watchlists

### Core MVP Outcome
After the first successful session, the user has:
- created a personal intelligence profile
- selected language mode
- selected interests and watchlist
- selected delivery time
- received a personalized daily brief
- understood what matters today, why it matters, what to watch, and what to say
- saved the brief in an archive

### Week 6 Success Criteria
- 50-100 active beta users
- 45-60% email open rate
- 35-50% meaningful read rate
- 40%+ of users opening at least 3 briefs per week
- 20%+ of users leaving at least one feedback signal
- 5-10 users willing to pay or join a paid pilot
- at least 10 users who say they would miss the product if it disappeared
