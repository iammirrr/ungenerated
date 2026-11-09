# ASO: being found, then being picked

App Store Optimisation has two halves: **search** (the words the listing ranks for) and **conversion** (the icon,
screenshots and preview that make someone tap Get). This is the search half in numbered steps, built on RespectASO, a
free open-source keyword tool. The conversion half is the rest of this skill.

Written in November 2026. Apple changes limits and indexing quietly: anything marked **verify** must be
checked against App Store Connect Help before you rely on it.

## 1. Install RespectASO

- Get it from github.com/respectlytics/respectaso (v3.1.2, October 2026). It's a free Mac app (Apple silicon, macOS
  12+), licensed AGPL-3.0. Link to it and drive it; never copy its code into an app or a skill.
- **Optional, free: connect Apple Ads.** With an Apple Ads account and its API key, RespectASO shows Apple's own
  weekly search popularity instead of its estimate. Worth it if the owner has or will open an Apple Ads account.
- **Optional, paid: Pro** ($19 for 3 months). Adds an MCP server so Claude can run searches itself
  (`/Applications/RespectASO.app/Contents/MacOS/respectaso-mcp`, 32 tools), top search terms, 1,000 keywords per
  search, AI tools and a rival tracker. After installing, check whether the MCP answers on the free edition too.
- What each edition gives is in `references/aso-tools.md`.

## 2. Pick the countries

- Run RespectASO's **opportunity finder** across the 175 storefronts with the app's main words. It ranks countries by
  popularity against difficulty.
- Start with the countries where the app already works (its language, its content, its prices) and the finder shows
  room. Add more later, one at a time.
- **Each storefront has its own listing languages.** Apple's list says which localizations a storefront shows; for
  example India offers English (India) and Hindi, Pakistan English (U.K.), the United States English (U.S.). Each extra
  language a storefront offers is another full set of title, subtitle and keyword field to fill. Whether a storefront
  also ranks the words of its other languages (for example Spanish words in the U.S.) is **verify** before you plan on it.

## 3. List seed words

- From the app's concept and features (`ungenerated-foundation` › app concept, `references/app-concept.md`): what it
  does, the problem it solves, who uses it, the job it replaces.
- **In the ways people really search**, per country: English, the local language, and mixed forms (Hinglish for
  India: "reel script likhne wala app"; transliterated words). Localisation means the words they type, not a
  translation of yours.
- Include the plain verbs and nouns people use, not the app's own coined words. Nobody searches a feature's brand
  name.
- 30–60 seeds per country is enough to start.

## 4. Search them

- **Pro:** Claude runs the searches through the MCP, per country.
- **Free:** the owner searches 3 keywords at a time and exports a CSV; Claude reads it.
- For each word, keep: popularity (1–100), difficulty (with the top 5/10/20 tiers), the estimated downloads, and the
  top 10 apps ranking for it.
- Look at those top apps: if they're giants with thousands of ratings, the word is not winnable yet.

## 5. Choose

- **Relevant + popular enough + winnable.** All three. A popular word the app doesn't answer brings installs that
  churn and ratings that hurt.
- **A new app starts with long-tail phrases** (three or four words, lower popularity, low difficulty) and climbs to the
  short head words as it earns ratings and downloads.
- Group the chosen words by meaning, so each field tells one story.

## 6. Write the fields, per language

| Field | Limit | Indexed for search |
|---|---|---|
| App name (title) | 30 characters | yes, the strongest |
| Subtitle | 30 characters | yes |
| Keyword field | 100 characters (**verify** how non-Latin scripts count) | yes, never shown |
| Promotional text | 170 characters | no; can change without an update |
| Description | 4,000 characters | no, on iOS |

- **Title:** the brand name plus the most important phrase that fits. Keep it readable, not a keyword list.
- **Subtitle:** the benefit in plain words, carrying the next phrases.
- **Keyword field:** single words separated by commas with **no spaces**. Apple combines words across the title,
  subtitle and keyword field, so:
  - **never repeat** a word that is already in the title or subtitle, or in the field itself
  - no plurals of words already there
  - no competitor brand names (they risk rejection and rarely convert)
  - no category name, no "app", no filler words
- **Description and promotional text** are for people: the first lines show above "more". Write them in the app's
  voice (`ungenerated-foundation` › human copy, `references/human-copy.md`), not for search.
- **In-app purchase names** and **in-app event names** are shown on the store and may help search (**verify**); name
  them in plain words.

## 7. Conversion

Ranking only gets the app shown. The listing has to be picked:

- **The icon** (`ungenerated-icons` › app icon): read at a glance beside the competitors in the search results.
- **The first three screenshots** carry the decision; they show in search results (`references/screenshots.md`).
- **The preview video** autoplays muted (`references/trailer.md`).
- **The banners** for the product page header and search results (`references/banners.md`).
- **Ratings:** ask with the system review prompt right after a real success moment, never on launch or after an
  error.
- **Custom Product Pages** per audience or ad, each with its own screenshots, preview and banner; **Product Page
  Optimization** to test the icon, screenshots and preview against the original. See `references/aso-tools.md`.

## 8. Track

- Track the chosen words' ranks **weekly** in RespectASO, per country.
- Change keywords **only with an app update** (the title, subtitle and keyword field are locked to a version).
- **Judge a change after 2–4 weeks**, not after two days. Change a few words at a time, so you know which change did it.
- Read App Store Connect's analytics beside it: impressions from search, product page views, conversion rate.

## 9. Repeat per locale

Every extra language a storefront offers is another full set of fields: research it from step 3 with that language's
real search words, not a translation of the English set.

## What to hand the owner

A table per country and language: the chosen words with popularity and difficulty, the three fields as they'll be
pasted (with character counts), what changed from last time and why, and the date to judge it. Ask the owner to edit
the words before they go into App Store Connect.
