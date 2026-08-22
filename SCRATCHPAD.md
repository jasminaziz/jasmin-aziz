# Jasmin Aziz Site — Scratchpad

## Session — 2026-08-22 (AI page shipped, GA4 removed, security fixes)

### Branch status
- **main** (`871b53f`) — production, live. Carries everything below.
- **services-descent** (`697e723`) — the ONLY remaining branch. Still unmerged,
  still pending a separate assessment. The AI page no longer depends on it.
- `ai-page`, `ai-launch-preview`, `remove-ga4`, `exposure-fix` — all merged or
  redundant, deleted local and remote.
- Backup tags kept: `backup/ai-page-prerebase` (pushed), `backup/main-preflight`.

### What happened
Merged as one merge commit after review. Six workstreams:

1. **AI page shipped.** `ai-page` rebased off `services-descent` onto `main`
   (one conflict, the Services anchor bar — kept main's "How I work", applied
   only the `AI training` → `AI` label change). Services item 05 redone against
   main's services.html. No services-descent code leaked across.
2. **GA4 removed site-wide**, nothing installed in its place. Legal privacy and
   cookie prose rewritten to match; last-updated bumped to August 2026.
3. **Copy sign-off applied** to Home ("What I do" sentence, About-me recency
   paragraph placed ahead of the About pointer), About (Background recency
   sentence — the June cut was NOT reinstated), Services (intro recency
   paragraph), AI page (pull-quote "Fluency, not fear, decides which way this
   goes." + proof line).
4. **Wiring completed.** The stranded "AI fluency training" set resolved across
   six places. Contact option → `ai`; `senior-comms-capacity` → `fractional`,
   which fixed a pre-existing broken anchor. All eight `/contact#…` anchors now
   preselect (verified live).
5. **Deploy hygiene.** Project files recovered from stash and committed;
   `.vercelignore` added; `tweaks-panel.jsx` and `image-slot.js` deleted. Eleven
   previously-or-potentially-exposed paths now 404 on production.
6. **Security.** `escapeHtml` in api/contact.js (verified end-to-end with an
   injection payload), CSP added, X-Frame-Options → DENY.

### Design decisions
- AI page H1 reduced to `clamp(36px, 6vw, 52px)` so About's 56px stays the
  largest H1 on the site; intro grid gap 72px → 80px to match the Services
  recipe; two dead CSS rules removed; the ochre closing accent stays a LEFT
  border on mobile, matching Services.
- The closing band is now hand-rolled three times (services, ai, homepage).
  Extraction into site.css was deliberately deferred rather than refactor a
  settled page without visual verification. **This is the next design debt.**

### Outstanding
- [ ] `services-descent` — assess and decide merge or abandon
- [ ] Contact form honeypot + rate limiting (June security audit, only findings
      still open besides headers now done)
- [ ] Stranger audit, still live: fractional definition sits ~1,800 words into
      Services; Fractional shape block has no "Right for" component; Campaign
      copy names deliverables not outcomes. NOTE: the audit's proposed fix for
      the fractional problem was to extend the homepage hero lead — ruled out,
      the hero does not change. Surface the existing definition earlier instead.
- [ ] Closing-band component extraction (see Design decisions)
- [ ] `llms.txt` Services line still describes the old five-service shape
- [ ] `favicon.png` is referenced in every page head but does not exist (404)

### Next step
Decide on `services-descent`. Everything else on the site is shipped and verified.

---

## Session — 2026-07-17/18 (AI page build)

### Branch status
- **main** — production, live at jasminaziz.co.uk
- **services-descent** — preview branch, NOT merged (unchanged this session)
- **ai-page** (`48eb20a` at session end) — NEW, branched off services-descent. NOT merged.
  Preview URL: `https://jasmin-aziz-git-ai-page-jasminazizs-projects.vercel.app/ai`

### What happened
Built a new page, `/ai` ("AI, trust and communications"), per the signed-off handover
`CONSULTANCY_AI-Page-Build-Handover_v1.html`. Copy went in verbatim first (confirmed by
site-copywriter agent — zero deviations), then Jasmin directed several rounds of design
and copy iteration on the live preview.

**Design, reused components:** page-intro spread (mirrors Services), heading-left/body-right
sections (mirrors About/Services), `.pull-quote`, `.who-section`/`.who-section--periwinkle`
tinted bands, `.pill`/`.pill-cobalt`, `.label`. One new component: a 2×2 numbered (01–04)
"four rooms" grid for the training section — built entirely from existing tokens.

**Iterations, in order:**
1. Initial build + all 5 nav changes (header/footer AI link on every page, homepage stack
   pill, Services item 05 slimmed to a pointer block keeping `id="ai-training"`, About
   sentence, sitemap.xml entry).
2. Design critique via site-design-check agent (see lessons.md re: agent stalls) — H1 too
   small/flat, four-rooms grid underdesigned. Fixed: H1 to 62px, numbered rooms, ochre band.
3. Jasmin: "wave is not fixed" + "h1 now is boring" — root-caused properly this time: two
   *adjacent* tinted `.who-section` bands were smearing the wave at their shared seam (first
   fix only suppressed one band's own wave, which wasn't the actual cause). Real fix: never
   let two tinted bands touch — put a cream section between them. Reinstated the asymmetric
   H1/lead spread with a cobalt "Get in touch →" pill anchored to the foot of the short column
   (fills the void with an intentional CTA instead of flattening the layout into a masthead).
4. Jasmin: drop the "governance theatre" pull-quote, cut copy down — copywriter agent proposed
   6 ranked trims (recommended 4, optional 2), Jasmin approved all 6, applied verbatim.
5. Jasmin: put "AI governance" section in the beige band (works cleanly now bands are
   non-adjacent), simplify the heading to "AI governance".
6. Jasmin: closing "Where to start" aside reworked to mirror Services' "Start here" block —
   eyebrow label, Chillax CTA heading, pill relabelled "Get in touch →", secondary
   "Or read more about how I work →" link, sticky on desktop.
7. Jasmin: closing lead-in reworded twice — "You don't know which of these you need
   beforehand." (dropped "and that's normal" as clumsy). "Replies within two working days"
   removed from the aside smallprint.

**Copy now diverges from the signed-off handover** (all at Jasmin's explicit direction):
removed the 'theatre' pull-quote; "AI your organisation can answer for" → "AI governance";
6 copywriter trims to the lead/governance/training-intro; reworded closing lead-in; dropped
the two-working-days reply line. Worth a copy read-through against the handover before merge.

### Outstanding
- [ ] Jasmin's review of the ai-page preview — merge to main pending her go-ahead
- [ ] Re-check the 6 copywriter trims against the actual voice-application spec once
      `~/AI Work/` permissions are fixed — the copywriter agent worked from the live
      Services page as a substitute reference this session (see lessons.md)
- [ ] Services descent branch still separately pending merge (unrelated, older work)

### Next step
Wait for Jasmin's review of the ai-page preview. On approval: merge ai-page → main
(services-descent is a separate, still-pending decision — confirm whether ai-page should
merge on top of it or be rebased onto main first, since it currently branches from
services-descent, not main).

---

## Session — 2026-06-18 (copy audit + services architecture rebuild)

### Branch status
- **main** (`70cd66e`) — production, live at jasminaziz.co.uk
- **services-descent** (`697e723`) — preview branch, NOT merged. Preview URL:
  `https://jasmin-aziz-git-services-descent-jasminazizs-projects.vercel.app/services`

### What happened

**Copy audit** — site-copywriter agent ran across all four pages. Verdict: services is a catalogue by shape, not just by word count. ~109 words of recoverable padding identified on services; minor cuts on about, homepage, contact. All cuts made and pushed to main (commit `cb3ae79`).

**Services layout audit** — site-design-check and site-stranger agents ran in parallel. Both landed on the same diagnosis independently: the page is built as a catalogue (four sections of equal visual weight, reader decides when to act) rather than a funnel. Harvey's original "indigestible" finding is a shape problem, not a word count problem.

**Opacity consistency pass** — Replaced `opacity: 0.X` on text with `color: var(--ink)` across all pages (services, homepage, about, contact). Lesson: `--ink-muted` is calibrated for 45% opacity only — it made text lighter, not equivalent. Full `--ink` matches About page body text and is the right call for body copy. `--ochre-pct` raised from 8 to 12 for clearer section separation. Commits `900cfc9`, `b90c017`, `70cd66e`.

**Services architecture rebuild** — Four structural moves built on `services-descent` branch:
1. Entry CTA ("Tell me what you're working on. You don't need to know which one yet.") lifted from bottom aside to directly after the intro — exit ramp for the already-sold buyer
2. Audit block promoted as "Start here" — periwinkle top accent (`border-top: 3px solid var(--periwinkle)`), `tier-label-line` eyebrow label, `service-block--entry` class
3. Engagement shapes heading given tier parity — `.tier-title` class (36px Chillax, periwinkle); anchor bar expanded from single "How I work" link to Fractional / Advisory / Per project / Process
4. Closing section wrapped in `.who-section--periwinkle` band — deliberate landing beat rather than a section that stops

### Next step
Review the preview at the URL above. Feedback → iterate on the branch → merge when approved.

### Outstanding (copy, from stranger audit 2026-06-15)
- [ ] Hero lead: add phrase explaining what "fractional" means at first glance
- [ ] Campaign strategy: add outgoing state (what changes after the engagement)
- [ ] AI training: add outgoing state
- [ ] Fractional "Right for": separate qualifying copy into scannable block
- [ ] Brand and Campaign pull-quotes on mobile: both restate body copy opener; need to work as standalone hooks on mobile (audit finding)

### Outstanding (design)
- [ ] About mobile: restore oval frame (border-radius: 999px on 1/1 crop → circle)
- [ ] Services: illustrations — trial on block 01 (audit), style approval, then all 5 blocks (`.svc-illus-slot` divs already in place)

### Outstanding (security, 2026-06-10, none are blockers)
- [ ] escapeHtml on user values in api/contact.js HTML email (highest priority)
- [ ] Content-Security-Policy header in vercel.json
- [ ] X-Frame-Options SAMEORIGIN → DENY
- [ ] Honeypot field on contact form
- [ ] 9-item manual console checklist in reports/site-security-2026-06-10.md
- [ ] Ratify or reject three learnings in ~/.claude/guides/website-build/LEARNINGS.md
- [ ] Commit reports/site-security-2026-06-10.md

---

## Session — 2026-06-18 (visual rhythm pass)

Full read-only audit of all four pages (Home, Services, About, Contact) completed at session start. Build plan proposed and approved for four items.

**Home — conversion routing:**
- Enquiry nudge pill added inside the diagnosis band (who-section--periwinkle), below "That's the work I do." using `.diag-nudge` class. Routes to /contact. Commits b90f3bf, 171f772.

**Home — portrait into hero:**
- `<image-slot>` custom element replaced with standard `<img>` (alt="Jasmin Aziz, photographed on Brighton beach"). image-slot.js script tag removed. React/ReactDOM dev builds + Babel from unpkg.com removed (they were loading on the live homepage). Commits b90f3bf.
- Portrait relocated from about-bridge section into the hero. Hero becomes a 2-column grid (`1fr 300px` desktop, `1fr 240px` ≤768px). At ≤640px: flex-column, portrait above H1, 3/2 landscape crop via `<picture>` element. Commits 3542d88, 3f06ed1.
- Landscape photo (`jasmin-headshot-landscape.jpg`, 299K) added for mobile horizontal oval. `<picture>` swaps source at ≤640px; `object-position: center` at mobile to match landscape composition. Commit d35177a.
- About-bridge section flattened to text-only; portrait not duplicated there.
- About page mobile circle fix (border-radius: 999px on square crop) discussed, paused for a later session.

**Services — visual rhythm:**
- Pull-quotes added to each service block sidebar using `.pull-quote svc-pull-quote` on `<blockquote>` elements. Five sentences supplied by Jasmin after copywriter agent drafted candidates. `.svc-illus-slot` empty divs added as zero-footprint illustration drop-in slots. Commit 7cbffc8.
- Pull-quotes restructured: promoted from inside `.svc-sidebar-cta` to direct grid siblings at `.svc-block-body` level. `.svc-main-col { grid-row: 1/-1 }` spans the sidebar rows on desktop. On mobile (≤768px), CSS `order` resequences to: pull-quote (1) → main copy (2) → CTA (3). Commits 833abfb.

**Design decisions made this session:**
- Pull-quotes belong in the sidebar, not the main content column (adding to main column worsens the imbalance).
- `<picture>` element is the right pattern for responsive art direction (different photos at different breakpoints).
- `grid-row: 1/-1` on the spanning column, with grid siblings for the stacking column, is the clean pattern for this layout.

**Remaining tasks — security audit (2026-06-10), none are blockers:**
- [ ] escapeHtml on user values in api/contact.js HTML email (highest priority)
- [ ] Content-Security-Policy header in vercel.json (draft in report)
- [ ] X-Frame-Options SAMEORIGIN → DENY (or frame-ancestors 'none' via CSP)
- [ ] Honeypot field on contact form
- [ ] Work through 9-item manual console checklist in reports/site-security-2026-06-10.md
- [ ] Ratify or reject three learnings in ~/.claude/guides/website-build/LEARNINGS.md
- [ ] Commit reports/site-security-2026-06-10.md

**Remaining tasks — copy (from stranger audit 2026-06-15):**
- [ ] Hero lead line: add phrase explaining what "fractional" means at first glance
- [ ] Campaign strategy description: add outgoing state (what changes after the engagement)
- [ ] AI training description: same
- [ ] Fractional "Right for" block: separate qualifying copy into scannable block

**Remaining tasks — design (from this session's build plan):**
- [ ] About mobile: restore oval frame (border-radius: 999px on 1/1 crop → circle)
- [ ] Services: illustrations — trial on block 01 (audit), style approval, then all 5 blocks

**Next logical step:** Services illustration trial (block 01), or About mobile circle fix (quick, one CSS line).

---

## Where we got to (2026-06-07 session 2)

Site is **live in production** at https://jasmin-aziz.vercel.app

- All five pages complete and deployed (index, services, about, contact, legal)
- Three WCAG AA contrast failures on services.html fixed
- GitHub: https://github.com/jasminaziz/jasmin-aziz (public, main branch)
- Vercel connected to GitHub — any push to main redeploys automatically

## Favicon — DONE (2026-06-07)

Replaced font-based SVG with a path-based SVG (`favicon (2).svg` → `favicon.svg`). The new version uses fully outlined SVG paths for the "JA" letterforms — no font dependency, renders correctly in all browsers. Committed and pushed; Vercel redeployed automatically. `favicon (2).svg` deleted (2026-06-07).

## Design context — DONE (2026-06-07)

`.impeccable.md` created in project root with full design context (users, brand personality, aesthetic direction, five design principles). Summary also appended to `.claude/CLAUDE.md` so it loads every session.

## Visual QA — in progress (2026-06-07)

Visual QA started. Pre-flight code fixes applied before browser review:

- `legal.html` — nav links hidden at ≤640px (no hamburger on this page; wordmark sufficient)
- `contact.html` — `.contact-direct-label` colour fixed: `var(--periwinkle)` → `var(--periwinkle-text)` (3.4:1 → 5.5:1 contrast)

390px homepage fixes applied to `index.html`:
- H1: `and&nbsp;communications` prevents "and" sitting alone on a line
- Hero spacing tightened: H1 margin-bottom 12px, hero-body padding-top 8px at ≤640px (was 48px combined gap)
- Hero lead: font-size increased to 1.125rem at ≤640px (was 1rem)
- Proof cards: padding increased to 36px 24px 32px; 24px gap restored before card-link button
- CTA grid gap: reduced to 20px at ≤640px (was 36px)
- CTA H2: `.mobile-br` break after "Tell me"; font-size 1.5rem at ≤640px; inline style removed
- Added `.mobile-br { display: none; }` utility class

**Footer at 390px**: structurally correct but Jasmin flagged visual drift to the left — needs follow-up description before fixing.

QA checklist generated and sent to Jasmin. Still to check: 640px, 768px, 900px, desktop on all five pages.

## Custom domain — DONE (2026-06-07)

Both domains live and HTTPS working:
- `jasminaziz.co.uk` — A record @ → 76.76.21.21 (GoDaddy) — returns HTTP 200
- `www.jasminaziz.co.uk` — CNAME www → cname.vercel-dns.com (GoDaddy)

Note: `vercel domains inspect` shows ✘ on nameservers — this just means nameservers haven't been transferred to Vercel. The A record + CNAME method is working correctly; ignore the ✘.

## Open Graph & Twitter Card — DONE (2026-06-07)

OG and Twitter Card meta tags added to all five pages. Committed and pushed (cd735f6).
- og:title, og:description, og:url, og:type, og:image on every page
- twitter:card, twitter:title, twitter:description, twitter:image on every page
- Branded OG image: `assets/og-image.png` (committed a772c90, 2026-06-07)
- OG description updated to: "Strategic communications for values-led organisations. Brand, positioning, campaigns, and fractional leadership. AI fluency built into delivery." (fb20c59)
- Homepage `<title>` updated to confirmed wording: "Jasmin Aziz | Strategic Communications Consultant"

## Mobile QA — 390px session 4 DONE (2026-06-08)

- index.html: email link removed below CTA button
- services.html: gap between intro and Services title tightened; gap between last button and Process section tightened
- about.html: portrait moved above text on mobile; changed to full-width 4:3 rounded rect (12px radius)
- contact.html: form reordered above email/LinkedIn on mobile — moved contact-direct links into separate `.contact-direct-links` grid child with explicit placement
- site.css: footer tagline margin-bottom reduced to 12px at ≤640px; hamburger bars now 3px tall with border-radius: 100px

## Mobile QA — 390px session 4 DONE (2026-06-08)

- index.html + services.html: H1 "and" → "&" on mobile via `.mobile-and` / `.mobile-amp` span pair
- CSS ordering bug fixed in index.html: global `.mobile-amp { display:none }` moved to before the ≤640px media query
- site.css + index.html: `overflow-x: clip` on html — fixes horizontal drag gap without breaking position:sticky nav
- site.css: footer centred at ≤480px (`text-align:center` on `.footer-grid`, `align-items:center` on `.footer-bottom`)
- index.html, services.html, about.html, contact.html: ↗ → ↗&#xFE0E; to prevent iOS emoji rendering
- services.html: `.svc-block-header` at ≤640px — column 80px→52px, gap 40px→16px, title 28px→24px
- services.html: "Process" eyebrow label removed from engagement section
- services.html: `how-section` padding-top 20px→64px on mobile to clear 48px wave; inline font-size:36px removed from "How an engagement starts" heading; heading made periwinkle + clamp size
- services.html: "Services" tier title colour changed to periwinkle
- about.html: portrait crop changed to 1/1 (square) at ≤640px
- about.html: CTA heading inline font-size removed — site.css responsive rule now applies
- index.html: "Every Tuesday" pill removed from Substack card; forced `<br class="mobile-br">` removed from CTA heading

## Desktop QA — session 1 DONE (2026-06-08)

**Homepage (index.html):**
- H1 increased to 68px; "&" used at all breakpoints (mobile-and/mobile-amp spans removed)
- Hero padding: `var(--sv)` top, `clamp(32px, 4vw, 64px)` bottom (asymmetric — wave eats ~48px of bottom)
- diff-section padding: restored to `calc(var(--sv) + 24px)` (100px) — middle ground
- about-section padding: `var(--sv)` top, 20px bottom
- proof-section top: 20px
- Diagnosis paragraphs: 18px / 0.78 opacity
- diff-paras body copy: 17px / 0.76 opacity
- Proof card buttons: "The Edit AI ↗" and "The Substack ↗"

**Services (services.html):**
- H1: "&" at all breakpoints (spans removed)
- Intro→Services gap tightened: svc-page-intro padding-bottom 32px, tier-head padding-top 32px
- Number→title gap: 40px→64px; titles centred against numbers (align-items: center)
- "How I Work" section bottom padding: 76px→40px
- "How an engagement starts" — full stop removed
- svc-intro-right body copy: 17px / 0.76 opacity

**Contact (contact.html):**
- Gap above "Prefer email?" closed (margin-top: 0 on first .contact-direct)
- "Or read the work first" section added: links to theeditai.co.uk and jasminaziz.substack.com
- contact-opener-sub: 16px / 0.70 opacity

## Session — 2026-06-08 (continued)

- Scroll-to-top button added to all five pages (cobalt circle, bottom-right, ≤900px only)
- Google Analytics 4 (G-D9C6CMZ6L7) added to all five pages; Plausible had no script tag — GA4 is first live analytics
- legal.html privacy + cookie policy updated to reflect GA4 accurately (cookies, data collection, opt-out link)
- "The Edit AI" linked in about.html body copy (AI fluency paragraph, second section)

## SEO pass — DONE (2026-06-08)

- vercel.json: non-www → www 301 redirect + security headers. Committed.
- All 87 internal hrefs updated to clean URL paths. Committed.
- Meta titles, descriptions, canonical tags, og:url updates — all five pages. Committed (b8a4dd4).
- robots.txt, sitemap.xml, llms.txt created in project root. Committed.

## AEO pass — DONE (2026-06-08)

- index.html: Person schema enhanced with description, knowsAbout, hasOccupation.
- services.html: FAQPage schema (6 Q&As) + Service schema (@graph, 5 services).
- Content review: no copy changes needed — structured data carries the factual load.
- Committed and pushed (f69752f).

## Branded 404 page — DONE (2026-06-08)

- `404.html` created in project root; Vercel serves it automatically for all unmatched routes
- Heading: Chillax 700 `clamp(2rem, 5vw, 3rem)` in `--periwinkle-text` — replaced `.label` which was too subtle
- Personal message from Jasmin: 3 paragraphs as body copy; email is a mailto: link
- CTA: `.pill.pill-cobalt` → `/`
- 30-second countdown auto-redirect; cancels on button click
- GA4 included to track 404 hits
- Committed and pushed (6e728bb)

## Session — 2026-06-08 (nav sizing)

- Nav wordmark increased: `1.125rem` (18px) → `1.375rem` (22px) — matches footer wordmark
- Nav links increased: `0.9375rem` (15px) → `1.125rem` (18px)
- Both changes applied in `site.css` and inline `<style>` in `index.html`
- Committed and pushed (f775a13)

## Session — 2026-06-08 (mobile footer / scroll-top investigation)

**Root cause identified but not yet fixed:**
- `index.html` has a large inline `<style>` block carrying ALL homepage-specific CSS
- This block loads after `site.css`, so its base-level rules override `site.css` `@media` rules of equal specificity
- The base-level `.footer-grid { grid-template-columns: 2fr 1fr 1fr }` in the inline style overrides `site.css`'s `@media (max-width: 480px)` single-column rule — this is why the footer stays left-aligned on iPhone despite site.css fixes
- Scroll-to-top button also affected: `body::after` grain overlay in the inline style has `z-index: 9000`; button has `z-index: 200` — button may be visually/interactively covered on homepage only
- Attempted fix (remove footer section from inline style) broke the site — reverted to `f775a13`

**Required fix (dedicated session):**
1. Audit the full inline `<style>` block in `index.html` against `site.css` — identify all rules that exist only in the inline block
2. Move those rules into `site.css`
3. Remove the inline `<style>` block entirely (or reduce to absolute homepage-only overrides)
4. Then apply targeted mobile footer centring in `site.css` — it will work correctly once the cascade conflict is gone
5. Raise `.scroll-top-btn` z-index to 9001 in `site.css`

Current production state: `f775a13` — nav sizing correct, footer still left-aligned on homepage at ≤480px, scroll-top button may not function on homepage.

## CSS refactor — DONE (2026-06-08 session 2)

- `index.html` inline `<style>` block (1292 lines) removed entirely
- `homepage.css` created with all homepage-specific styles (~430 lines)
- `index.html` now loads `site.css` then `homepage.css` — 381 lines of pure HTML
- Cascade conflict resolved: footer centring and scroll-top z-index both now work on homepage
- Commit: 1cea6f2

## Session — 2026-06-08 (code audit)

- legal.html: scroll-top-btn CSS added to inline block — button was unstyled (site.css not loaded on this page). Commit: e63a3da
- site.css: dead `.page-hero` / `.page-hero-h1` / `.page-hero-lead` block removed (~30 lines — no HTML file used these classes). Commit: d148544
- homepage.css: redundant `display:flex; flex-direction:column` removed from .proof-card 768px breakpoint — already set at base level. Commit: d148544
- bnjc-website + aziz-and-co `.claude/CLAUDE.md`: CSS architecture rules added (no page-level CSS files, shared layout/components, Tailwind only)

## Session - 2026-06-10 (security audit, site-security agent)

- First real test of the site-security agent. Full audit of this repo, report written to reports/site-security-2026-06-10.md (not committed yet).
- Verdict: safe to ship with named fixes. No secrets in working tree or git history (all 65 commits checked). Resend key handling confirmed clean.
- Five should-fix findings, in severity order:
  1. api/contact.js (lines 67, 75, 79, 83, 87): user input interpolated into the HTML email without escaping. Fix: escapeHtml helper applied to all user values.
  2. vercel.json: no Content-Security-Policy header. Draft CSP is in the report.
  3. index.html lines 339-372: tweaks-panel dev scripts (React/ReactDOM development builds + Babel from unpkg.com) still load on the live homepage. Remove or gate them.
  4. vercel.json line 15: X-Frame-Options SAMEORIGIN should be DENY (or frame-ancestors 'none' in the CSP).
  5. Contact form: no honeypot field, no rate limiting. Minimal fix is a CSS-hidden honeypot.
- Two accepted trade-offs recorded: GA4 measurement ID public in source; GA4 cookies without a consent banner (PECR residual risk).
- 9-item manual checklist in the report (Vercel env var name, Resend domain verification and key scope, kill-switch documentation, GA4 retention and IP anonymisation, GitHub Actions secrets, PECR review) with exact console paths.
- Three proposed learnings sitting in ~/.claude/guides/website-build/LEARNINGS.md awaiting ratify/reject.
- Note: no record of the May 2026 manual audit exists in this repo (history starts 2026-06-06), so the agent audited from scratch.

## Session — 2026-06-15 (stranger audit + copy changes)

**Stranger audit run** — site-stranger agent, full five-check pass. Report at reports/site-stranger-2026-06-15.md.

Key findings:
- The "fractional" definition exists in two places but both require significant scrolling to reach. Hero lead "Fractional or per project" names the format but doesn't answer what it means. Fix: surface the existing definition earlier — hero lead is the natural home.
- "Per project" in the hero and "One-off strategic input" in Services were mismatched names. Renamed to "Per project" throughout (services.html section, id, CTA href; contact.html dropdown option; JSON-LD FAQ text).
- Scope of hands-on skills (websites, paid campaigns, graphic design, wayfinding, etc.) not visible anywhere on the site. No portfolio by design (no independent consulting projects yet). Fix: expand About breadth paragraph + add hands-on delivery examples to Per project block.
- One weak line in proof section (sub-heading at 0.68 opacity). Not fixed this session.
- Tweaks-panel dev scripts (React dev build + Babel) still on homepage — mobile performance issue, flagged again from security audit. Not fixed this session.

**Copy changes made and committed:**
- about.html: Background paragraph expanded — "built marketing and communications functions from zero: websites, paid campaigns, content systems, graphic design, wayfinding."
- services.html: "One-off strategic input" → "Per project" (title, section id, CTA href, JSON-LD FAQ)
- services.html: Per project block — added two sentences: "This can be strategic thinking or hands-on delivery: a website rebuild, a content calendar, a signage plan, a campaign brief. If you have a defined job and need someone to do it well, this is the shape."
- contact.html: dropdown option updated to "Per project"

**All changes pushed (commits 7faa495, 63d3cf8, eb64733).**

## Session — 2026-06-15 continued (audit follow-ups)

Further changes from stranger audit, all committed and pushed:

- index.html: proof section sub-heading replaced — "If you'd like to see how I think before we speak." → "Both show how I think."
- index.html: "How I work" body copy and stack pill updated to "Per project" (the homepage still referenced the old name)
- index.html: framing sentence added to "How I work" — "Three engagement shapes, depending on what you need."
- api/contact.js: label map updated from `one-off-strategic-input` to `per-project`
- about.html: first-child/subsequent opacity distinction removed from credibility-body and personal-body — all paragraphs now full ink. Pattern violated the site's own no-opacity-on-text rule and read as accidental.

**Outstanding audit items not yet actioned:**
- Hero lead line: add phrase explaining what "fractional" means at first glance (highest remaining copy priority)
- Campaign strategy description: add outgoing state (what changes after the engagement)
- AI training description: same
- Fractional "Right for" block on Services: separate qualifying copy into scannable block

## Remaining tasks

Security audit follow-ups (2026-06-10), none are launch blockers but all should be done:
- [ ] escapeHtml on user values in the api/contact.js HTML email (highest priority)
- [ ] Add Content-Security-Policy header to vercel.json (draft in report)
- [ ] Remove or gate the tweaks-panel scripts in index.html (lines 339-372)
- [ ] X-Frame-Options SAMEORIGIN to DENY, or frame-ancestors 'none' via CSP
- [ ] Honeypot field on the contact form
- [ ] Work through the 9-item manual console checklist in reports/site-security-2026-06-10.md
- [ ] Ratify or reject the three learnings in ~/.claude/guides/website-build/LEARNINGS.md
- [ ] Commit reports/site-security-2026-06-10.md

## Future considerations

- **CMS (Sanity)** — worth revisiting if a blog, case studies, or portfolio section is added. Static HTML site would need a build step or a move to Next.js to integrate properly. No use case yet.

## Completed tasks

- Resend — DONE (2026-06-07)
- Custom domain — DONE (2026-06-07). jasminaziz.co.uk live, HTTPS working.
- Tidy up favicon (2).svg — DONE (2026-06-07)
- Branded OG card — DONE (2026-06-07). assets/og-image.png live across all five pages.

## Notes

- Contact form wired to Resend via `api/contact.js`. Sends to hello@jasminaziz.co.uk with reply-to set to the enquirer's email.
- `Jasmin Aziz Favicon Preview.html` is in project root but not committed to git.
