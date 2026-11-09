# ASO tools

Two kinds: a keyword tool to find the words, and Apple's own tools to measure and test the listing. Start free; pay
only when the free edition is the bottleneck.

## RespectASO

github.com/respectlytics/respectaso · v3.1.2 (October 2026) · free, open source (AGPL-3.0) · Mac app, Apple silicon,
macOS 12+. Link to it and drive it; never copy its code.

| | Free | With Apple Ads (free key) | Pro ($19 / 3 months) |
|---|---|---|---|
| Keyword popularity (1–100) | estimated | Apple's real weekly popularity | as connected |
| Difficulty, with top 5 / 10 / 20 tiers | yes | yes | yes |
| Download estimates | yes | yes | yes |
| Top 10 competitors per word | yes | yes | yes |
| Country opportunity finder (175 storefronts) | yes | yes | yes |
| Rank tracking, history, CSV export | yes | yes | yes |
| Keywords per search | 3 | 3 | 1,000 |
| Top search terms | | | yes |
| MCP server for Claude (32 tools) | check after install | check after install | yes |
| AI tools, rival tracker | | | yes |

- **Free** is enough to research one country by hand: the owner searches three words at a time and exports a CSV.
- **Apple Ads** needs an Apple Ads account and an API key made in it. No ad spend is needed to read popularity.
- **Pro** is worth it when researching several countries or languages, because Claude can run the searches itself
  through the MCP (`/Applications/RespectASO.app/Contents/MacOS/respectaso-mcp`).

## Apple's own

**App Store Connect › Analytics.** Impressions, product page views, conversion rate, downloads and sources (App Store
search, browse, web referrers, app referrers), per territory and per version. The truth about what changed after an
update: compare the 2–4 weeks before and after.

**Apple Ads popularity.** The Apple Ads console shows Apple's own popularity for search terms when you set up a search
campaign. It's the same number RespectASO reads with the key.

**Custom Product Pages.** Extra versions of the product page, each with its own screenshots, preview video, promotional
text and banners, reached by their own link (ads, social, a website section) and, where Apple allows it, by chosen search keywords (**verify**). Use
one per audience: a creator page, a student page. Check the current limit on how many you can have.

**Product Page Optimization.** A/B tests of the icon, screenshots and preview video against the original page, on a
share of the traffic, for up to 90 days (**verify** the current length and number of treatments). Test one thing at a
time; an icon test needs the alternative icons in the app binary.

**In-app events.** Timed events (a challenge, a new season, a live session) shown on the product page, in search and
in editorial. Each has a card and a details image or video (`references/banners.md`). They can bring people back as well
as bring new ones.

**Promotional text.** 170 characters at the top of the description, changeable any time without an update. Use it for
what's new this week; it isn't indexed.

**Creative assets (Asset Library).** The product page header and search-result banners, approved without an app
update. See `references/banners.md`.

## Not needed

- Paid ASO suites at hundreds a month, before the app has ratings or a budget. RespectASO plus Apple's own covers a new
  app.
- Review-farming or keyword-stuffing services. They break the App Store's rules and get apps removed.
