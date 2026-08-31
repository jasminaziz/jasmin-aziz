# Lessons — Jasmin Aziz Site

## Git root check before committing (2026-06-06)
The Developer directory had its own .git from a previous initialisation.
Running `git rev-parse --show-toplevel` inside the project showed the root
was ~/Developer, not ~/Developer/jasmin-aziz. Always check this before
staging any files — otherwise commits land in the wrong repo.
Fix: `git init` inside the project folder creates a nested repo that takes
precedence for all commands run within it.

## Filenames with spaces break Vercel root serving (2026-06-06)
The homepage was named `jasminaziz-homepage v2.html`. Vercel has no
`index.html` and serves a 404 at `/`. Always rename the homepage to
`index.html` before deploying a static site to Vercel. Remember to update
all cross-links (grep for the old filename first — there were 12 occurrences
across five files).

## WCAG contrast — never use opacity on text (2026-06-06)
Three failures on services.html used raw brand tokens or opacity to
mute text colours. Always use the pre-blended a11y text tokens:
- --ink-muted (not opacity on --ink)
- --ochre-text (not --ochre)
- --periwinkle-text (not --periwinkle)
These are defined in CLAUDE.md and the design spec.

## .gitignore before first commit on this project (2026-06-06)
This project has large files (design-download.tar.gz ~27MB,
jasmin-aziz-design-system/ ~100+ files, Fonts/ directory) that must
never be committed. Always create .gitignore before `git add` on this repo.

## Legal page needs explicit mobile nav handling (2026-06-07)
legal.html uses its own isolated stylesheet — it does not load site.css and has no hamburger nav.
At 390px the three inline nav links overflowed (estimated ~391px needed vs ~350px available).
Fix: hide `.nav-list` at ≤640px via a media query on that page. Wordmark alone is sufficient on a legal page.
Always check isolated pages (legal, error pages) separately — they don't inherit the shared nav behaviour.

## Inline styles override responsive media queries (2026-06-07)
The CTA H2 had `style="font-size:2.5rem;"` which silently overrode every media query font-size rule.
The 640px and 768px responsive rules were doing nothing. Fix: remove the inline style; use a CSS class rule instead.
Always check for inline styles on elements that should be responsive.

## &nbsp; technique for controlling heading line breaks (2026-06-07)
"and&nbsp;communications" prevents a line break between "and" and the following word.
Use `word&nbsp;word` in markup when two words must always wrap together to avoid orphaned small words on their own line.
For mobile-only forced breaks, use `<br class="mobile-br">` with `.mobile-br { display: none; }` and show it at ≤640px.

## Check all pages for raw --periwinkle on cream backgrounds (2026-06-07)
contact.html `.contact-direct-label` used `color: var(--periwinkle)` (#7B7FD4 = 3.4:1 on cream) — fails WCAG AA at 10px.
Always use `--periwinkle-text` (#5255B5 = 5.5:1) for periwinkle-coloured text on cream backgrounds.
The site.css `.label` class already uses `--periwinkle-text` correctly; the miss was in a page-specific class.

## Vercel static sites support api/ serverless functions with no build config (2026-06-07)
Place any .js file inside api/ at the project root. Vercel auto-detects it as a serverless function
with no vercel.json changes needed. Body parsing for application/json is automatic. fetch() is
available natively (Node.js 24 default). No npm packages required for a simple Resend call.

## Custom fonts in HTML email: Apple Mail only (2026-06-07)
@import in a <style> block loads Chillax in Apple Mail and iOS Mail, but Gmail and Outlook strip it.
The name renders in bold Arial everywhere else. Always flag this limitation before building branded
email headers that rely on custom fonts — Jasmin accepted the trade-off here.

## Auto-reply emails should be non-critical (2026-06-07)
When a contact form sends two emails (notification + auto-reply), treat the auto-reply as non-critical.
If it fails, log the error server-side but still return 200 to the user — their enquiry was captured.
Only the notification to the site owner should be a hard failure that surfaces to the user.

## /plugin install is not a Claude Code CLI command (2026-06-07)
The user tried `/plugin install frontend-design@claude-plugins-official`. This is not a valid command.
Clarify that skills already available via the Skill tool need no installation. If the user wants to run
a shell command, they should prefix it with ! in the prompt.

## Vercel CLI --project flag not supported on v50 (2026-06-07)
`vercel domains add jasminaziz.co.uk --project jasmin-aziz` returned "unknown or unexpected option: --project".
Fix: run the command from inside the project directory — the .vercel folder handles project linkage automatically.
Upgrade to latest CLI to avoid similar flag compatibility issues: `npm i -g vercel@latest`.

## DNS for custom domains: A record for apex, CNAME for www (2026-06-07)
GoDaddy (and most registrars) only allow one A record per name.
The correct pattern for Vercel custom domains:
- Apex (jasminaziz.co.uk): A record @ → 76.76.21.21
- Subdomain (www.jasminaziz.co.uk): CNAME www → cname.vercel-dns.com
Do not use an A record for www — use CNAME. The Vercel CLI may suggest A for both, but CNAME is correct for subdomains.

## vercel domains inspect ✘ on nameservers is expected with A record + CNAME (2026-06-07)
When using A record + CNAME to point a domain to Vercel (rather than transferring nameservers),
`vercel domains inspect` shows ✘ next to both nameserver rows. This is not a failure — it just
means nameservers haven't been transferred. If `dig` shows the correct A/CNAME records and
`curl -sI https://domain` returns 200, the domain is live. Ignore the ✘.

## DOM reorder on mobile: use separate grid children, not CSS order on sub-elements (2026-06-07)
When mobile layout needs a different element order than desktop (e.g. form before email links),
the cleanest approach is to make each logical group its own direct child of the grid container,
then use explicit grid-column/grid-row placement on desktop and let mobile collapse naturally
via grid-template-columns: 1fr. Using CSS `order` only works cleanly when the elements to
reorder are direct siblings — it cannot reorder elements nested inside a shared parent.

## CSS global hide rules must come before the media query that shows them (2026-06-08)
`.mobile-amp { display: none }` was placed after the `@media (max-width: 640px)` block that set `display: inline`. The later rule won, so the element was always hidden on mobile. Fix: move global hide rules to appear BEFORE all media queries that conditionally show the element. This affected index.html but not services.html — the difference was purely ordering.

## overflow-x: clip is safer than overflow-x: hidden on the html element (2026-06-08)
`overflow-x: hidden` on `html` creates a new scroll container, which can break `position: sticky` and cause a gap at the top of the page. `overflow-x: clip` clips overflow without creating a new formatting context — sticky elements behave correctly. Use `overflow-x: clip` on `html` and `overflow-x: hidden` on `body`.

## who-section wave needs 64px clearance below it (2026-06-08)
`who-section::after` in site.css is a wave pseudo-element 48px tall, positioned at `bottom: -48px`. Any section that follows needs `padding-top` of at least 64px on mobile to avoid the wave overlapping content. The mobile override of `padding-top: 20px` on `.how-section` was less than the wave height and caused visible overlap.

## ↗ character renders as emoji on iOS — use variation selector-15 (2026-06-08)
U+2197 (↗) is claimed by Apple's emoji font on iOS. Append `&#xFE0E;` (variation selector-15) immediately after the character to force text rendering: `↗&#xFE0E;`. No visual change on desktop. Apply to every instance across all pages — the footer Elsewhere links appear on 4 of the 5 pages.

## Wave-compensation padding: calc(--sv + 48px) is usually excessive (2026-06-08)
`calc(var(--sv) + 48px)` = 124px at desktop. 76px (just `--sv`) already clears a 48px wave pseudo-element by 28px — content never gets covered. The +48px extra creates visible dead space. Middle ground `calc(var(--sv) + 24px)` = 100px is better when breathing room is needed. Check sections around who-section waves before adding extra compensation.

## Hero padding is asymmetric when a wave-section follows (2026-06-08)
`padding: X 0` applies X to both top and bottom. But the who-section `::before` wave extends 48px above the section boundary into the hero's bottom padding. Visible cream below the hero CTA = CSS bottom padding − 48px. Split padding to `X top / Y bottom` when the visual balance matters.

## Use "&" at all breakpoints — drop span pairs when not needed (2026-06-08)
The `.mobile-and`/`.mobile-amp` span pair was introduced to show "and" on desktop and "&" on mobile. When the user decides "&" is preferred everywhere, just use `&amp;` directly in the markup and remove the spans. Simpler HTML, no CSS rules to maintain. Apply the same check to services.html when doing homepage.

## Proof card buttons: use brand name not URL (2026-06-08)
"theeditai.co.uk ↗" and "jasminaziz.substack.com ↗" were too long and domain-literal. "The Edit AI ↗" and "The Substack ↗" match the card headings and read better as CTAs. Use descriptive names, not URLs, for card-link button text.

## Grep for script tags, not just text, when switching analytics providers (2026-06-08)
Plausible was referenced in legal.html body text but had no `<script>` tag anywhere in the codebase.
Searching for "plausible" found only the privacy policy paragraphs, not a live tracking snippet.
Always grep for the actual script tag (`<script.*plausible`, `<script.*gtag`, etc.) separately from text references.
Switching analytics also requires updating the legal/privacy policy — and the new copy must be accurate.
GA4 sets cookies and collects personal data; Plausible does not. These are not interchangeable statements.

## Shared JS for features that span pages without a common script (2026-06-08)
nav.js was not loaded on index.html (homepage has a different nav structure).
When adding a feature that needs JS on all pages, create a dedicated shared file (e.g. scroll-top.js)
rather than adding to nav.js. Load it on every page independently. The guard `if (!btn) return`
keeps it safe even if the HTML element is ever missing.

## Always check vercel.json before adding config (2026-06-08)
`cleanUrls: true` was already present in vercel.json before this session started. If you add it again you get a duplicate key — silently ignored but messy. Always read vercel.json first.

## vercel.json hostname redirects use `has: host` (2026-06-08)
To redirect one hostname to another (e.g. non-www → www), use:
```json
{ "source": "/(.*)", "has": [{ "type": "host", "value": "jasminaziz.co.uk" }],
  "destination": "https://www.jasminaziz.co.uk/$1", "permanent": true }
```
The `has` condition scopes the redirect to the bare-apex host only — www is unaffected and won't loop.

## robots.txt/sitemap.xml go in project root for static sites (2026-06-08)
`/public` is a Next.js/framework convention, not a Vercel one. For a static HTML site deployed from the project root, put robots.txt, sitemap.xml, and llms.txt directly in the root. Vercel serves them at the right paths automatically.

## Use sed for mass href replacements, not individual Edit calls (2026-06-08)
87 href attributes across 5 files were updated in one sed loop. Using `replace_all: true` Edit calls would have required ~75 round trips. Use Bash sed for bulk pattern replacement when the count is >10 and patterns are uniform. Anchored patterns (e.g. `href="services.html"` with closing quote) do not partially match anchored variants like `href="services.html#audit"` so order doesn't matter.

## og:url and og:image should use www when www is canonical (2026-06-08)
After establishing www as canonical, og:url still pointed to non-www + .html. These should be updated to www + clean paths at the same time as canonical link tags. Don't leave og: tags pointing to the non-canonical origin.

## HTML attributes need &amp; not bare & (2026-06-08)
In `content=""` attribute values, `&` must be encoded as `&amp;`. Bare `&` in attributes is technically invalid HTML. Applied consistently in meta title content values throughout.

## .label is too subtle for a 404 heading — use a Chillax display heading (2026-06-08)
The `.label` class is 11px uppercase Plus Jakarta Sans — visually fine as a section eyebrow, but too small to signal a 404 clearly. First version used `.label` and Jasmin flagged it as "way too subtle".
Fix: use a custom `.error-heading` class — Chillax 700, `clamp(2rem, 5vw, 3rem)`, `--periwinkle-text`. Same colour family as `.label` but proper heading weight and size.
Rule: any standalone error or status page needs a heading at display scale, not eyebrow scale.

## WebFetch returns a tool error on non-200 status — can't verify 404 pages this way (2026-06-08)
Attempted `WebFetch` on a non-existent URL to confirm the branded 404 was live. It returned a tool error ("Request failed with status code 404") rather than the page content.
Fix: for 404 verification, use the Vercel MCP `list_deployments` / `get_deployment` to confirm the build is live, then ask Jasmin to test in browser.

## Sub-2px type size changes are imperceptible — jump at least 3px (2026-06-08)
Nav links were increased from 0.9375rem (15px) to 1rem (16px). Jasmin reported no visible change.
A 1px difference in font-size at small sizes is below the threshold of perception.
Fix: increase to 1.125rem (18px) — 3px jump, clearly visible.
Rule: when scaling nav or UI type, move at least 2–3px. Anything less is wasted.

## index.html carries ALL homepage CSS in an inline <style> block — never remove sections without replacing in site.css first (2026-06-08)
The homepage was built with all its CSS inline. This inline block loads AFTER site.css so base-level inline rules silently override site.css @media rules of equal specificity (last-in-source wins, media queries do not increase specificity). Attempting to remove the footer section from the inline style caused the footer to lose all styling because site.css was not verified to carry all styles beforehand. Fix: any refactor of the inline style must be a full migration — move all CSS to site.css first, then remove the inline block. Never remove a partial section.

## Vercel deployments only trigger when commits are pushed to GitHub (2026-06-08)
Multiple fix commits were made locally and appeared to be "live" but Vercel had not redeployed because `git push` had not been run. `git log --oneline origin/main` vs `git log --oneline` will reveal unpushed commits. Always push immediately after committing on this project, and verify with Vercel MCP `list_deployments` before telling Jasmin to check the site.

## Check git push output AND Vercel deployment list before declaring a fix live (2026-06-08)
Even after a successful `git push`, Vercel may take 1–2 minutes to redeploy. Use the Vercel MCP `list_deployments` tool to confirm the latest commit SHA is in a `READY` deployment before asking Jasmin to verify. If `state` is not `READY`, the old version is still serving.

## Always check whether site.css is actually linked before editing it (2026-06-08)
`site.css` was not linked in `index.html` at all — the inline `<style>` block was the only stylesheet on the homepage. A z-index fix applied to site.css had zero effect on the homepage because the file wasn't loaded. Before debugging a CSS issue, grep for `site.css` (or whatever shared stylesheet) in the page's `<head>` to confirm it's actually linked.

## The safe fix for inline CSS cascade conflicts is extraction, not targeted edits (2026-06-08)
When a page's only stylesheet is a large inline `<style>` block, targeted 2-line fixes can mask the structural problem. The correct fix is: create an external CSS file for page-specific styles, link both the shared and page-specific files, and remove the inline block entirely. This also makes the HTML readable — index.html went from 1672 lines to 381 lines of pure HTML.

## Isolated pages must duplicate shared component CSS (2026-06-08)
legal.html intentionally does not load site.css (no hamburger nav). This means any CSS that lives only in site.css — including the scroll-top button styles — is invisible on that page. The scroll-top button existed in the HTML and scroll-top.js was loaded, but the button had no styles at all.
Fix: copy the relevant CSS block into the page's inline style block with a comment explaining why it's duplicated. Rule: whenever adding a feature to site.css that relies on a shared HTML element (button, overlay, etc.), check whether legal.html or any other isolated page also uses that element.

## Dead CSS accumulates silently in iterative builds (2026-06-08)
After many sessions of fixes and refactoring, site.css had a full `.page-hero` / `.page-hero-h1` / `.page-hero-lead` block (~30 lines) that was never used in any HTML file. Each inner page had developed its own heading structure instead. Dead rules cause no visible problems but add noise and confusion.
Fix: removed the block entirely (commit d148544). Rule: after any major refactor, grep for selectors in the CSS across all HTML files to confirm they're still in use.

## SVG favicons do not render @font-face (2026-06-06)
Browsers do not load custom fonts declared inside SVG favicons via @font-face.
Embedding a Chillax base64 font in favicon.svg produced an invisible "JA" —
the circle rendered but the text did not. Even a plain system-font SVG text
element was unreliable. For favicons, use PNG. To generate one without
external tools: `pip3 install Pillow` then draw the circle and text in Python.
Alternatively use an online generator (favicon.io) with the spec:
periwinkle #7B7FD4 circle, cream #FAF8F4 "JA", bold sans-serif.

## Confirm the target repo before spawning project agents from a non-repo directory (2026-06-10)
A site-security run was requested against "this repository" from a session started in ~/Downloads,
which is not a git repository. No local repo matched the described history (a May 2026 audit), so the
target had to be confirmed with Jasmin before spawning. Rule: when a session starts outside a project
folder, identify and confirm the target repo (and check its git history matches the description) before
launching any agent whose run is expensive or whose report depends on the right target.

## Agent reports do not reliably follow style constraints — check before relaying (2026-06-10)
The site-security agent used em dashes in its report headings despite an explicit "no em dashes"
instruction in its prompt. Fixed post-hoc with sed (punctuation only, content untouched).
Rule: after any subagent writes a deliverable for Jasmin, grep it for em dashes (and check UK English)
before relaying. Do not assume the prompt constraint was honoured.

## Security audit follow-ups live in SCRATCHPAD.md and the report (2026-06-10)
reports/site-security-2026-06-10.md is the authority for the five should-fix findings, two accepted
trade-offs, and the 9-item manual console checklist. Read it before doing any security-related work
on this project. The escapeHtml fix in api/contact.js is the highest-priority item.

## Opacity on text reads as accidental at subtle differences (2026-06-15)
The About page used `opacity: 1` on first paragraphs and `opacity: 0.72` on subsequent ones to create
lead-paragraph hierarchy. Jasmin noticed it looked unintentional. The site's own design rule (in site.css)
says never use CSS opacity to mute text — use pre-blended tokens instead. At 1.0 vs 0.72, the contrast
is too subtle to read as a deliberate typographic choice. Fix: use a single consistent value for all
body paragraphs in a section. The section heading already provides hierarchy.
Rule: if a typographic opacity difference has to be pointed out to be noticed, it's not working.

## Rename all instances of a term before committing — grep every file (2026-06-15)
"One-off strategic input" was renamed to "Per project" in services.html and contact.html but the
homepage (index.html) still referenced the old name in two places: body copy and a stack pill href.
Only caught on review in the next session. Rule: after any rename, grep the full project for the old
string before committing. `grep -rn "old-term" ~/Developer/project/` takes ten seconds and catches misses.

## Pull-quotes fix dead sidebar space — put them in the sidebar, not the main column (2026-06-18)
When a two-column layout has dead space in the narrow column, adding visual elements to the
wide column makes the imbalance worse, not better. A pull-quote added to the main copy column
makes the left column taller while the sidebar stays equally empty. The fix must go where the
dead space is. On services.html, the correct placement is inside the 240px sidebar column —
above the CTA pill, filling the space that was empty.

## <picture> is the right element for responsive art direction (2026-06-18)
When mobile and desktop need different image compositions (not just different sizes), use `<picture>`
with a `<source media="(max-width: Xpx)" srcset="...">` and `<img>` fallback. The portrait photo
works in a tall 3/4 oval on desktop; the landscape photo works in a horizontal oval on mobile.
`srcset` alone only changes size, not composition. `object-position` should be set per breakpoint
in CSS to match the focal point of whichever image is loading.

## grid-row: 1/-1 on a spanning column requires grid-row: auto reset at mobile (2026-06-18)
To make a left column span both rows of a 2-row sidebar on desktop, use `grid-row: 1 / -1` on the
spanning element. At mobile (single-column grid), this property must be reset with `grid-row: auto`
or CSS `order` will not work correctly — explicitly placed items ignore `order` and are placed first
regardless. Always pair `grid-row: 1/-1` with a mobile reset in the responsive block.

## Custom element components without a reliable fallback are fragile on production pages (2026-06-18)
`<image-slot>` is an omelette design tool component. It renders the `src` attribute image on the
live site (without the runtime), but inside a shadow DOM with `alt=""` on the internal `<img>`.
External CSS does not apply to shadow DOM internals. If the JS fails to register the custom element,
nothing renders. Use a standard `<img>` element in production HTML; custom components are for
design-tool contexts only. The fix was a straight swap — no CSS changes needed, `.about-portrait`
applied correctly to `<img>`.

## Dev scripts must not be on the live homepage (2026-06-18)
React development builds and Babel standalone from unpkg.com were loading on every production page
visit. These are large files with no production value and a security surface area. The CSS variables
they were setting (`--h1-size`, `--ochre-pct`) already had their defaults in `homepage.css :root` —
removing the scripts had zero visual effect. Before shipping any page, grep for `development.js`,
`babel.min.js`, and unpkg.com to confirm no dev-only scripts remain.

## --ink-muted is calibrated for 45% opacity only — not a general muted text token (2026-06-18)
`--ink-muted` (#706D68) is defined in site.css as "replaces ink @45% opacity". The services page
was using opacity values of 0.68–0.76, which produce a much darker result than #706D68. Switching
from `opacity: 0.X` to `color: var(--ink-muted)` made the text noticeably lighter, not equivalent.
For body copy on cream, use `color: var(--ink)` directly. `--ink-muted` is only correct when the
design intent is specifically 45% opacity muting (e.g. very secondary UI labels).
Rule: before replacing an opacity value with a token, check what opacity that token was calibrated
for. The comment in site.css says "replaces ink @45% opacity" — trust the comment.

## For significant layout changes: build on a preview branch, not main (2026-06-18)
When a layout change is substantial enough that the user wants to see it before it goes live
(multiple structural moves, page architecture rebuilds), create a named git branch, build there,
push, and share the Vercel preview URL. Vercel automatically builds a preview deployment for
every branch push. The branch preview URL updates on every subsequent push to that branch.
The pattern: `git checkout -b branch-name` → build → `git push -u origin branch-name` → share URL.
Main stays clean until Jasmin approves the preview.

## Verify agent findings against live files before acting on them (2026-06-15)
The site-stranger agent flagged a sentence on the contact page using American spelling: "A basic
understanding of organizational challenges is sufficient to begin a conversation." That sentence does
not exist in contact.html — the agent hallucinated it. The actual copy was already warm and UK English.
Rule: before fixing any specific copy or code issue flagged by an agent, grep for it first. If it's
not there, the agent invented it.

## Never stack two tinted .who-section bands directly adjacent (2026-07-18)
On ai.html, the ochre "training" band sat directly above the periwinkle closing band. Both use the
same `::before`/`::after` wave pseudo-elements at their top/bottom edges, so where the two bands
touched, the waves overlapped and smeared into an ugly double-wave. Jasmin flagged "wave is not
fixed" after a first attempt that only suppressed one band's own `::after` — that fix addressed the
wrong cause (a single band's wave) rather than the actual one (two translucent bands touching).
Fix: keep tinted bands separated by at least one cream section, so each band's wave feathers into
plain cream on both sides. Applied on ai.html as cream → ochre (governance) → cream (training) →
periwinkle (close). Rule: before adding a second `.who-section` band to a page that already has
one, check whether they'll end up adjacent — if so, either merge them into one band or insert a
cream section between them.

## Filling a "gap under the heading" — don't kill an asymmetric spread to fix it (2026-07-18)
The ai.html intro used a Services-style spread (H1 left, lead right). Jasmin found the space below
a short H1 looked like an empty void. First fix collapsed it to a boring full-width masthead
(H1 + rule + lead stacked) — Jasmin called it out as "boring" on the next round. Better fix: keep
the asymmetric spread but anchor a CTA pill to the foot of the short column (flex column,
justify-content: space-between), so the space reads as intentional composition, not a hole.
Rule: when a two-column spread has visual dead space in the short column, fill it with a component
(CTA, secondary heading, etc.) rather than abandoning the asymmetry.

## Report-writing subagents (site-design-check, site-gates) stalled 3x on the 600s watchdog this session (2026-07-17)
Three separate attempts to run site-design-check / site-gates with instructions to "write a dated
report to reports/" all failed with "Agent stalled: no progress for 600s". A fourth attempt with an
explicit instruction to return the full critique in the agent's final message — and NOT write any
report file — completed successfully in ~3 minutes. Cause not confirmed, but the pattern is
consistent: file-writing report agents are unreliable in this environment right now.
Rule: if a report-writing subagent stalls once, don't just retry identically — retry with the report
file write removed from its instructions and ask it to return everything inline instead.

## ~/AI Work/ is inaccessible to file tools this session — EPERM, not a missing file (2026-07-18)
Both a subagent (reading the voice-application-spec for a copy review) and the main session
directly (writing to ~/AI Work/memory/*.md during /wrap) hit EPERM ("operation not permitted") on
paths under ~/AI Work/, via both the Read/Write tools and Bash `ls`/`cat`. This is a filesystem
permission wall (likely macOS TCC/Full Disk Access), not an absent-file situation — do not
substitute assumed content or silently skip; flag it plainly to Jasmin so she can fix the
permission (or grant it) for next session, and note in any wrap summary that global memory
writes did not happen.

## Vercel preview URLs are SSO-protected — external fetches verify nothing (2026-08-22)
Fetching a preview URL with curl returned HTTP 200 and a page containing zero
`gtag` hits, which looked like a clean verification. It was a Vercel SSO login
page. Deployment Protection 302s unauthenticated requests to
`vercel.com/sso-api`, so every page returns identical ~477kb of Vercel HTML.
Fix: before trusting any preview fetch, check for the redirect —
`curl -sI <url> | grep -i location` — and if it points at `sso-api`, say the
check could not be run rather than reporting its result. Verify at source level
instead and hand Jasmin a review checklist. Production (post-merge) is public
and can be checked normally.

## `.vercelignore` does apply to Git-based deploys (2026-08-22)
The docs do not state this either way. Verified empirically after merge: all
eleven excluded paths returned 404 on production. Safe to rely on for keeping
project files out of a static deploy. Note it matches by pattern only — it will
not catch a `.jsx`/`.js` dev file unless named, so deleting dead files is a
separate action from adding the ignore rule.

## This repo had NO deploy-exclusion mechanism (2026-08-22)
Before this session, `STATUS.md`, `CLAUDE (1).md`, `jasminaziz-design-spec (1).md`,
`tweaks-panel.jsx` and `image-slot.js` were all live and crawlable on production
(HTTP 200), with robots.txt allowing all. Committing `reports/site-security-*.md`
would have published a security audit of the site. Fix: `.vercelignore` covering
`*.md`, `reports/`, `tasks/` and the handover `.html`. Always check what a static
repo actually serves before committing reference material into it.

## Contact form option values are a two-file contract (2026-08-22)
`/contact#<value>` preselects via `preselectFromHash()` in contact.html, and
`SERVICE_LABELS` in `api/contact.js` maps the same values to the enquiry-email
label. Renaming an option requires changing both. Renaming only the form meant
the notification email would have printed the raw value ("ai") instead of the
label — caught by running the handler with a mocked `fetch` rather than by
reading the diff. Also found `#fractional` had never matched an option
(`senior-comms-capacity`), so that CTA silently failed to preselect since launch.
Fix: after any option change, grep both files and re-run the anchor/option
cross-check.

## Fontshare CSP: font files come from a different host than the stylesheet (2026-08-22)
The June security audit's draft CSP listed `api.fontshare.com` under `font-src`.
That is the *stylesheet* host; the `@font-face` rules point at
`cdn.fontshare.com`. Shipping the draft as written would have blocked Chillax
sitewide — the wordmark and every heading. Fix: fetch the font CSS and read the
actual `src:` URLs before writing any `font-src`. Verified post-deploy with
`document.fonts.check()`.

## Blank screenshots mean the Browser pane is hidden, not a layout bug (2026-08-22)
Screenshots came back as empty cream while the DOM clearly held content. The
cause was the Browser pane being hidden, which pauses painting; `computer` then
times out with that message. Fix: don't diagnose layout from blank screenshots —
use `javascript_tool` DOM queries (getBoundingClientRect, getComputedStyle,
document.fonts) which stay reliable, and only reach for screenshots when the
pane is confirmed visible.

## Report-writing subagents: the 600s stall did NOT recur (2026-08-22)
The site-design-check agent was asked to write a report to a scratchpad path
*and* return its full findings in the final message. It completed in ~4 minutes
with no stall. The belt-and-braces instruction ("write the file AND return the
critique in your final message") appears to be the reliable pattern — better
than instructing it not to write a file at all.

## Vercel preview SSO recurred — a 200 is not verification (2026-08-24)
The 2026-08-22 lesson above repeated exactly. Both preview URLs for
`preview/buyer-definition` returned **HTTP 200 with ~478KB of Vercel login
page**. A status-code check reads as a clean pass. Only a body check catches it.
The working test, used this session:
```
grep -qi "vercel.com/sso\|Authentication Required\|_vercel/sso" page.html
```
Rule: never report a URL as verified on status code alone. Grep the body for a
string that only the real page contains — a known heading, the `<title>`, the
specific copy you changed. Applies to production too, not just previews.

## Correcting a shared sentence must not force an unrelated decision (2026-08-24)
Two of the three "eight years" instances had the number and the sector wording
in the same sentence. I first wrote that fixing the number "forces" the
sector decision — it does not. Change the token you were asked to change and
leave the rest byte-identical, then say the other decision is still open.
When an edit could pre-empt a decision that is Jasmin's, make the smaller edit.

## `npx vercel ls` triggers an interactive OAuth login (2026-08-24)
Expected a read-only list. The CLI found no credentials and started a device
login flow, which completed — the machine now holds Vercel CLI credentials it
did not have at session start. Treat any `npx vercel` invocation as potentially
state-changing on first use in a session, and say so before running it.

## Hard-coded career-year counts drift silently (2026-08-24)
"Eight years" was written in the initial commit on 2026-06-06, was accurate
then, and went stale by one year across fourteen months and three agent audits
— none of which check facts about Jasmin, only code and copy quality. Any
self-updating claim (years of experience, number of clients, "most recently")
needs a revalidation note in the project CLAUDE.md, or it inherits forever.

## Ask when a short instruction does not parse (2026-08-24)
"Commit Unmean." matched nothing in the repo or her project list, and the tree
was already clean. One plausible reading was "push to main" — the exact action
she had fenced off. Asking cost one turn. Guessing risked an unreviewed
production deploy. When a terse instruction is ambiguous AND one reading is
outward-facing, always ask.

## Instruction-layer files re-narrow the site even after the site is fixed (2026-08-24)
`.claude/CLAUDE.md` and `.impeccable.md` both defined the audience as "charity
and purpose-led organisations". Left alone, every future copy pass would have
walked back any widening. Fixing them was the highest-compounding item in the
whole plan and cost two paragraphs in files that never deploy. When positioning
changes, audit the agent instructions before the site copy — and note that
`.claude/` is gitignored, so changes there are local-only and unbacked-up.

## During deploy propagation, a single body fetch is not verification either (2026-08-31)
A wait-loop confirmed new copy live on `/ai`, then the very next `curl` of the
same URL returned the OLD paragraph. Not a failed deploy: a stale CDN edge
served mid-propagation. Three immediate refetches all showed the new copy.
The 2026-08-22 lesson says a status code is never verification. This extends it:
during the propagation window a single body fetch is not either. Fetch the page
2-3 times and require agreement before reporting, and if one disagrees, check
whether it also still contains the string you replaced. If it does, it is a
stale edge, not a failure.

## Scope constraint checks to the files you changed (2026-08-31)
Ran the no-em-dash / no-counts checks with a bare `git diff` while SCRATCHPAD.md
was also modified. The register's own prose contains dates, em dashes and the
phrase "The Edit AI", so the check reported 5 em dashes and a naming violation
in copy that had none. Always scope the guard to the files under review
(`git diff -- ai.html`), or a docs file will fail a copy rule it was never
subject to.

## Never report a visual fix without looking at the page (2026-08-31)
The AI page header had a ~600px void beside the H1. site-design-check
diagnosed the mechanism correctly (`align-items: stretch` plus
`justify-content: space-between`) and prescribed changing them. I applied it,
measured the gap between H1 and pill as 32px, and reported it fixed. Jasmin
looked and said "still a massive gap" — correctly. The alignment property only
decides WHERE surplus height goes, never whether there is any. The real cause
was a 599px content imbalance: four paragraphs in the header's right column
against an H1-and-pill column. `start` moved the void below the pill instead of
above it.

Two rules from this:
1. Measuring the property you changed only proves you changed it. Before
   reporting any visual fix, render the page and look, at desktop and mobile.
   A `file://` open will not do: relative stylesheets do not load and you get
   the unstyled fallback. Start a local server (`.claude/launch.json` +
   preview_start) and screenshot.
2. The disproof is often already in your own output. The same call that told me
   the gap was 32px also returned `headColHeight: 149`; comparing that to the
   grid height would have shown the 599px immediately. Read every number you
   asked for, not just the one you were hoping about.

## An advisory agent's fix is a hypothesis, not a result (2026-08-31)
site-design-check has tools Read, Glob, Grep, Write and no browser. It reviews
"look and feel" by reading CSS, so any claim about what the page LOOKS like is
inference, not observation. Its diagnoses verified 4/4 against the tree and it
caught a real live bug (an inline link rendering browser-default #0000EE
because no `<a>` rule exists anywhere). But it prescribed a remedy without
predicting the resulting state, and its own report contained the disproof: it
noted that services.html has no CTA in the header column "so nothing gets
stretched", which is exactly why the comparison did not hold.
Rule: verify an advisory agent's DIAGNOSIS against the tree, and verify its
REMEDY against the rendered page. They are two different checks and passing the
first says nothing about the second. Agent definition updated the same day to
require a predicted post-fix state and an observed/inferred label per finding.
