# GEO readiness audit — jasminaziz.co.uk (re-run)

Run date: 11 September 2026 · Methodology v1, dated 3 September 2026 (8 days old, within the quarterly re-check window — no re-check flag needed).

This is a re-run against a narrower scope than the same-day earlier audit: the brief names exactly four priority pages (Home, Services, AI, About), not all six sitemap URLs, and Check 3 carries no peer set this time. An earlier report exists at `reports/site-geo-2026-09-11.md`, produced earlier the same day. It is read and compared below rather than reconstructed from memory.

**What moved since the earlier report, on the four pages both reports cover:** nothing, on every scored row. Services and About were both edited on the live site between the two runs (`services.html` last-modified today at 14:24:42 UTC, `about.html` at 14:00:51 UTC — both after the earlier report's file timestamp of 18:05 for the report itself is not proof of fetch order, so this is stated as a live-edit observation, not a before/after diff) — the GEO audit pull-quote ("Being cited starts with being mentioned.") sits on Services now, and About carries an added sentence on UK Jewish communal career background. Neither edit touches an unattributed quote, adds a source, or moves a buried claim, so no row's score changes. The two open recommendations from the earlier report — attribute the Services pull-quotes, and move the "Who do you work with?" answer out of FAQPage JSON-LD into visible copy — are both still outstanding, confirmed against the live JSON-LD below.

## Verdict

Answer engines can reach all four priority pages. robots.txt carries a single wildcard group, `Allow: /`, with no per-bot group and no disallow, so Googlebot, OAI-SearchBot, ChatGPT-User, PerplexityBot and Bingbot all pass on all four pages; none returned a blocking header or a meta robots tag, and all four resolved with a single 200, no redirect.

The pages score well on readable prose, fan-out readiness and keyword stuffing, but score 0 on statistics with a stated source everywhere, 0 on cited sources everywhere, and 0 or 1 on quotations depending on the page. Every outbound link on these four pages goes to Jasmin's own other properties (The Edit, the Substack, her LinkedIn profile) or the AI-use policy template, none of it third-party credible material — this is a site built to read fluently and answer sub-questions early, not yet built to hand an answer engine a sourced number or an attributed quotation.

The single edit that would move the most checks: attribute the six pull-quotes on the Services page to Jasmin Aziz by name. They already read as direct statements; naming their source turns six thin, unattributed lines into scored quotations on one priority page, for the smallest possible edit, and it is the same finding as the earlier report because it has not been made.

## Check 1: Crawler access for answer engines

robots.txt (fetched live):
```
User-agent: *
Allow: /
Sitemap: https://www.jasminaziz.co.uk/sitemap.xml
```
One group, applying to every bot since none of the five named bots has its own group. `Allow: /` is the longest (only) matching rule for every path, so every bot is allowed on every page.

| Page | Googlebot | OAI-SearchBot | ChatGPT-User | PerplexityBot | Bingbot | Final status | X-Robots-Tag | Meta robots |
|---|---|---|---|---|---|---|---|---|
| / | Pass | Pass | Pass | Pass | Pass | 200 (no redirect) | none | none |
| /services | Pass | Pass | Pass | Pass | Pass | 200 (no redirect) | none | none |
| /ai | Pass | Pass | Pass | Pass | Pass | 200 (no redirect) | none | none |
| /about | Pass | Pass | Pass | Pass | Pass | 200 (no redirect) | none | none |

No block on GPTBot or Google-Extended was found either; there is nothing here for that training-data note to attach to, but it is recorded because the table asks for it: were such a block added later, it would be a training-data choice, not an answer-visibility one, and should not be "fixed" by mistake.

Blind spot: robots.txt and meta tags are all that curl can see. A firewall or CDN rule blocking bots by user agent would be invisible from here — Vercel is the host (seen in response headers) and nothing in the fetched headers suggests bot-filtering, but this method cannot rule it out. Whether Google has actually indexed these pages is a `site:` search, listed under manual checks below.

## Check 2: Content scorecard

Anchors used, as section A sets none: 0 absent; 1 present but thin (unattributed, a single instance, or buried below where the page makes its main claims); 2 present and carrying the page's main claims. No facts sheet or approved question set was supplied for this run, so the fan-out score is **provisional**: sub-questions below are drafted by me from each page's own content, for Jasmin to correct.

| Page | Quotations | Stats w/ source | Cited sources | Fan-out (provisional) | Readable prose | Stuffing (reverse) |
|---|---|---|---|---|---|---|
| Home (/) | 0 | 0 | 0 | 2 | 2 | 2 |
| Services (/services) | 1 | 0 | 0 | 2 | 2 | 2 |
| AI (/ai) | 1 | 0 | 0 | 2 | 2 | 2 |
| About (/about) | 0 | 0 | 0 | 1 | 2 | 2 |

All four pages returned full body text; the scorecard ran on all of them (no rendering finding to hand to site-gates here).

### Home (/)

- **Direct quotations**: 0. No passage found. There is no blockquote or attributed statement anywhere on the page; every claim runs as plain first-person prose ("My strongest work is brand foundations...").
- **Statistics with a stated source**: 0. No passage found. "Six years of brand and marketing leadership for a multi-site community organisation" is a personal duration fact, not a sourced statistic.
- **Cited sources**: 0. Outbound links go only to Jasmin's own other properties — `theeditai.co.uk`, `jasminaziz.substack.com`, and her own LinkedIn profile — self-referential, not third-party credible material.
- **Fan-out readiness (provisional sub-questions)**: What does Jasmin Aziz do? What sectors/organisations does she work with? What engagement shapes are available? What is her background? Where can I read more of her thinking? Scored 2: "My strongest work is brand foundations: positioning, identity, tone of voice, mission, vision, and values. I build and lead marketing and communications functions from inside the team" opens "What I do" and answers the first sub-question directly and early; "Three engagement shapes, depending on what you need" opens "How I work" and answers the third directly; "I've built brands from zero and led marketing and communications strategies across charity and commercial... Most recently: six years..." opens "About me" and answers the fourth directly; "Two places to read the work" opens the final section and answers the fifth.
- **Readable prose**: 2. "A pattern shows up across values-led organisations. Activity is full. Output is steady." Plain, active, no jargon.
- **Keyword stuffing**: 2. 582 running words; "AI" appears 12 times (2.1%) but a share of those are nav links repeated in the template, not stuffed prose; "communications" appears 9 times across distinct sections.

Edits, in order:
1. Format one of the page's existing first-person claims (for example, the sentence closing "What I do") as an attributed pull-quote, naming Jasmin Aziz as the source, matching the pattern already used on Services and AI — moves **Direct quotations**. Depends on nothing beyond a formatting decision.
2. Add one outbound citation to independent, credible material behind an existing claim (for example, the "values-led organisations" framing or the AI-fluency claim) — moves **Cited sources**. Depends on Jasmin identifying a specific external source she is willing to link to; none is proposed here.
3. Add one stated, sourced statistic. Since there are no signed clients yet, this cannot be a client outcome figure — it depends on Jasmin sourcing a citable published statistic (for example, on nonprofit marketing capacity or AI adoption in the sector) that she is willing to stand behind — moves **Statistics with a stated source**.

### Services (/services)

- **Direct quotations**: 1. Six pull-quotes appear in the live HTML (`<blockquote class="pull-quote svc-pull-quote">`), one per service block: "There is a gap between what you produce and what the organisation needs. I find it."; "You can't govern what you haven't found."; "Being cited starts with being mentioned."; "I do the strategic thinking underneath the brand before any design begins."; "I develop the strategy that holds the campaign together."; "Most teams produce content reactively because the system isn't there. This is that system." All six read as first-person statements but carry no attribution line on the page itself — thin, not carrying the page's main claims as a sourced quotation would.
- **Statistics with a stated source**: 0. No passage found.
- **Cited sources**: 0. No passage found. All outbound links go to `theeditai.co.uk`, `jasminaziz.substack.com` and Jasmin's own LinkedIn profile — the same self-referential set as Home.
- **Fan-out readiness (provisional sub-questions)**: What is a communications audit? What does the AI/governance service include? What is a GEO audit? What are the engagement shapes? How does an engagement start, and what does it cost? Scored 2: "A strategic review of your marketing and communications function" opens the audit block; "Governance starts with finding where AI is already in use... Training runs the other way" opens the AI block; "A fixed-scope audit of how visible, and how accurately, your organisation appears in AI search and answer engines such as ChatGPT, Perplexity and Google's AI Overviews" opens the GEO block and names the actual engines; "Pricing is scoped per project and arrives at proposal stage" answers the cost question early in the "Services" intro. Note, unchanged from the earlier report: "Who do you work with?" is answered in the page's FAQPage JSON-LD ("Organisations that hold sensitive data and answer to a board. My experience is in charity, heritage and the third sector, but the problem is not particular to them...") but not in the visible body copy — under this row that does not count, since a passage is body text a reader (and this audit) can see, not a structured-data field.
- **Readable prose**: 2. "Some organisations need a defined piece of work: a brand built, a campaign planned, a function audited and put back on course."
- **Keyword stuffing**: 2. 1,206 running words; "strategic" 13 times (1.1%), "AI" 15 times (1.2%), "communications" 12 times (1.0%), all spread across six distinct service descriptions, not repeated stuffing.

Edits, in order:
1. Attribute the six pull-quotes to Jasmin Aziz by name — moves **Direct quotations**, the single most efficient edit on the site since it touches six instances on one page in one move. This is the earlier report's top recommendation, still open.
2. Move the "Who do you work with?" answer out of the FAQPage JSON-LD and into visible body copy near the top of the Services tier — moves **Fan-out readiness**. Also still open from the earlier report.
3. Add one outbound citation to independent credible material behind a claim already made here (for example, a definitional source for DPIA in the AI block, or a published source on AI Overview citation patterns in the GEO block) — moves **Cited sources**. Depends on Jasmin identifying and approving a specific external source.

### AI (/ai)

- **Direct quotations**: 1. One pull-quote in the live HTML: "Fluency, not fear, decides which way this goes." — present, unattributed on the page. (The earlier report found two; "You can't govern what you haven't found." has since moved to a Services pull-quote and now sits as plain prose here — "including the tools nobody approved, because you can't govern what you haven't found" — so the row's score is unchanged but the count of instances has fallen from two to one.)
- **Statistics with a stated source**: 0. No passage found.
- **Cited sources**: 0. Links go to The Edit and the AI-use policy template (`theeditai.co.uk/policy-template`), both Jasmin's own properties.
- **Fan-out readiness (provisional sub-questions)**: What is AI governance and why does it matter? What training do you offer? Who is this AI work for? Is there a free resource? How do I get started? Scored 2: "I work with chief executives, senior teams and boards on adopting AI responsibly and being able to answer for it" opens the governance section directly; "Most AI training makes a room feel busy for a day and changes nothing by Friday. Mine is built on your team's actual tasks" opens the training section; "You don't know which of these you need beforehand. The discovery call exists to work it out" opens "Where to start" and answers "how do I get started" directly; "Get the AI-use policy template" answers the free-resource sub-question directly. "Who is this for" is still answered only inside the framing lead paragraph ("If you hold sensitive data and answer to a board, the stakes run higher than most...") rather than as its own early sentence under a heading — thinner than the rest, but the page's main claims are covered.
- **Readable prose**: 2. "Your organisation is already using AI, whether or not the board has decided to."
- **Keyword stuffing**: 2. 809 running words; "AI" appears 20 times (2.5%), expected for a page about AI, spread across distinct sections rather than repeated in a block.

Edits, in order:
1. Attribute the pull-quote ("Fluency, not fear, decides which way this goes.") to Jasmin Aziz by name — moves **Direct quotations**.
2. Give "who this work is for" its own direct opening sentence under the "AI governance" heading, mirroring the "Right for" language already used on the Services page's AI block, rather than leaving it inside the framing paragraph — moves **Fan-out readiness**.
3. Add a stated, sourced statistic (for example, on the proportion of teams already using unapproved AI tools, from a published survey) into the governance section — moves **Statistics with a stated source**. Depends on Jasmin sourcing and approving a specific citable figure; none is proposed here.

### About (/about)

- **Direct quotations**: 0. No passage found. The page is first-person narrative but nothing is set out as an attributed quotation.
- **Statistics with a stated source**: 0. No passage found. "Ten years across charity, heritage, and the third sector" and "six years leading brand and marketing" are personal facts, not statistics with a stated source.
- **Cited sources**: 0. Links go to The Edit and Substack, both self-referential.
- **Fan-out readiness (provisional sub-questions)**: What is her professional background? What sectors does she work in? Where is she based? What is her approach to the work? Where can I see her work? Scored 1: "Based in London · Brighton" and "Background: Charity, heritage, third sector" sit in a facts strip at the very top of the page, answering location and sector well; "What I'm doing inside a strategic marketing and communications engagement is interpretation" opens "The work, in practice" directly. But the page's fuller factual claim about background — "Ten years across charity, heritage, and the third sector, working inside organisations where strategy has to hold across competing priorities" — arrives only in the second paragraph of "Background", behind a narrative opener ("My instinct for this work started in museums..."), which the row's own anchor treats as buried below the section's main claim rather than carrying it. This is unchanged from the earlier report; the sentence added since then ("Much of my career has run through UK Jewish communal life...") sits after the ten-years claim and does not move it earlier.
- **Readable prose**: 2. "My instinct for this work started in museums. I learned how to find language for objects and stories from another time that could land for someone standing in front of them now."
- **Keyword stuffing**: 2. 653 running words, no repeated block found.

Edits, in order:
1. Open the "Background" section with the direct factual claim ("Ten years across charity, heritage, and the third sector...") ahead of the narrative lede, so the passage that answers "what is her background" sits in the first lines — moves **Fan-out readiness**. Still open from the earlier report.
2. Add a quotation attributed to a named source. Since there are no signed clients yet, this cannot be a client testimonial — it depends on Jasmin identifying a named former colleague or collaborator willing to be quoted, or on formatting one of her own existing statements as a named, attributed pull-quote — moves **Direct quotations**.
3. Add one outbound citation to independent credible material behind a claim already made (for example, background on what a DPIA is, or published data on charity communications capacity) — moves **Cited sources**. Depends on Jasmin identifying a specific external source.

## Check 3: Records and entity consistency

No facts sheet, in the section B sense (one page of ground truth for the accuracy check), was supplied for this run. The brief states some facts as background — sole-trader consultancy, not a registered charity or company, no signed clients — but these describe the engagement, not a client-supplied ground-truth document, so what follows compares the site's own pages and the public records against each other, with no ground truth to check either against. No peers were named for this run's Check 3.

**Companies House** (fetched `https://find-and-update.company-information.service.gov.uk/search?q=Jasmin+Aziz`): search returned "No results". Consistent with the brief's statement that Jasmin Aziz is not a registered company, though this is not confirmed by anything on the four priority pages themselves — none of Home, Services, AI or About states her trading status; that statement lives on the Legal page, which is outside this run's four-page scope.

**Charity Commission register**: the search page returned no usable result text in the raw HTML (815 characters, all search-form chrome) — it is a Liferay portal whose results render through a mechanism this curl-only method cannot see. **Listed as a manual check below rather than guessed at.**

**Wikipedia** (MediaWiki API, search for "Jasmin Aziz consultant"): no matching article. The nine results returned are unrelated (an airline founder named Aziz, a Manchester University alumni list, honours lists, a Middle Eastern Americans list, a Singapore election article). **No Wikipedia article exists.** The notability question is left to Jasmin, as the row requires.

**Wikidata** (`wbsearchentities` for "Jasmin Aziz"): zero results. **No Wikidata item exists.**

**Entity consistency across the four priority pages** (inference, as the row requires):
- The homepage's "About me" section states "I've built brands from zero and led marketing and communications strategies **across charity and commercial**", while the About page's own facts strip states "Background: **Charity, heritage, third sector**" with no mention of commercial work. This is a scope contradiction between two priority pages, both quoted in full above, not just a wording variance: one names a commercial-sector background, the other does not.
- The homepage meta description ("Strategic marketing and communications for values-led organisations...") and the About page lede ("Strategic marketing and communications consultant working with values-led organisations on the thinking underneath the work...") describe the practice in near-identical wording. The Person JSON-LD on the homepage describes the same practice differently again: "Strategic marketing and communications consultant working with **organisations that hold sensitive data and answer to a board**." Not a contradiction of fact, but a wording variance across the two places (visible prose vs structured data) an engine is most likely to draw a description from.
- No hard contradictions in name or location were found across the four pages fetched.

## Manual checks (not run here)

| Check | Who | Where |
|---|---|---|
| Google indexing (`site:jasminaziz.co.uk`) | Jasmin | Google Search, manually |
| Citation share and the accuracy check (engine runs, steps 3–5) | Jasmin (or the audit tool, once subscribed per section E) | Google AI Overviews, Google AI Mode, ChatGPT, Perplexity |
| Branded mentions off-site | Jasmin | General web search / a mentions tool |
| LinkedIn profile (linkedin.com/in/jasmin-r-aziz) — presence, currency, whether it names the practice consistently | Jasmin | linkedin.com, by hand |
| Reddit — whether Jasmin or her work is named in any relevant subreddit | Jasmin | reddit.com, by hand |
| YouTube — any video presence at all | Jasmin | youtube.com, by hand |
| Quora — any presence at all | Jasmin | quora.com, by hand |
| Charity Commission register — confirm no entry exists (raw HTML returned no usable result text) | Jasmin | register-of-charities.charitycommission.gov.uk, by hand |

## Method notes

- Fetch date: 11 September 2026, UK time, via `curl` only (GET), user agent `site-geo audit (jasminaziz.co.uk)`.
- Scoring anchors (section A sets none, so these were adopted and are stated here): 0 absent; 1 present but thin (unattributed, a single instance, or buried below the page's main claims); 2 present and carrying the page's main claims.
- Fan-out sub-questions are provisional throughout: no approved question set was supplied, so four sets of three-to-five sub-questions were drafted from each page's own content, for Jasmin to correct. Scores against them should be read as provisional until she does.
- No facts sheet (a one-page ground-truth document, per section B) was supplied, so Check 3 compares the priority pages and the public records against each other, with no ground truth to check either against. The brief's stated background facts (sole trader, not a registered charity or company, no signed clients) informed which edits could be recommended in Check 2, not the Check 3 comparison.
- Priority pages: exactly the four named in the brief (Home, Services, AI, About) — no substitution from the sitemap was needed this run.
- Firewall/CDN blind spot: robots.txt and per-page headers/meta tags are all this method can see. A firewall or CDN rule blocking a bot by user agent would not show up here, and is not ruled out by this audit.
- Evidence floor date: Methodology v1, 3 September 2026 — 8 days old at the time of this run, inside the quarterly re-check window, so no re-check flag is raised.
- Schema markup, JSON-LD and llms.txt were not scored and are not recommended, per the evidence floor's "Not a lever" rows. This site carries both; their SEO case, if any, belongs to site-gates under Gate 3, not to this report.
- No client testimonials or client outcome figures are recommended anywhere above, per the brief: there are no signed clients yet. Every edit above that depends on material not visible from the fetched pages says so explicitly.

## Proposed rows

None. Nothing in this brief asked for a check outside section A.

## URLs fetched

- https://www.jasminaziz.co.uk/robots.txt
- https://www.jasminaziz.co.uk/ (headers and body)
- https://www.jasminaziz.co.uk/services (headers and body)
- https://www.jasminaziz.co.uk/ai (headers and body)
- https://www.jasminaziz.co.uk/about (headers and body)
- https://find-and-update.company-information.service.gov.uk/search?q=Jasmin+Aziz
- https://register-of-charities.charitycommission.gov.uk/en/charity-search?p_p_id=uk_gov_ccew_onereg_charitydetails_web_portlet_CharityDetailsPortlet_INSTANCE_charityDetails&p_p_lifecycle=0&_uk_gov_ccew_onereg_charitydetails_web_portlet_CharityDetailsPortlet_INSTANCE_charityDetails_mvcRenderCommandName=%2Fsearch-results&_uk_gov_ccew_onereg_charitydetails_web_portlet_CharityDetailsPortlet_INSTANCE_charityDetails_keywords=Jasmin+Aziz
- https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Jasmin%20Aziz%20consultant&format=json&srlimit=5
- https://www.wikidata.org/w/api.php?action=wbsearchentities&search=Jasmin%20Aziz&language=en&format=json&limit=5
