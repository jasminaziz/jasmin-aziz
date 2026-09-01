# Site audit — asymmetric columns and eyebrow labels — 2026-08-31

**Scope:** all seven pages (`index.html`, `services.html`, `ai.html`, `about.html`, `contact.html`, `legal.html`, `404.html`), `site.css`, `homepage.css`, and the inline `<style>` blocks in `services.html`/`ai.html`/`about.html`/`contact.html`. Two tasks only: multi-column structures that can strand empty space, and every eyebrow-label instance. No copy changes proposed; no files edited.

**Tooling limit, stated per instructions:** I have Read, Glob, Grep and Write only — no browser, no renderer, no screenshot. Every claim about what a page LOOKS like is inference from CSS and content length, not observation of a rendered page. I label each finding OBSERVED IN CODE (the grid rule, the content that fills or doesn't fill it) or INFERRED ABOUT RENDERING (what I believe the browser does with it, including my own rough estimates of paragraph height from word counts). Every INFERRED finding needs visual confirmation at desktop width before anyone reports it fixed — this report is a candidate list, not a verified defect list.

**Relevant prior finding, already resolved.** `reports/ai-page-design-2026-08-31.md` diagnosed a 599px void in `ai.html`'s header (`align-items: stretch` + `justify-content: space-between` forcing surplus height into a single gap). Reading the current file, that fix is live: `.ai-intro-grid` now uses `align-items: start` (`ai.html:41`), the header carries one lead paragraph, and the other three paragraphs moved to `.ai-intro-body` below the grid at full width (`ai.html:78`, `315-319`). The code comment at `ai.html:30-34` documents why. This is the pattern I use below as the site's own working precedent for what "safe" asymmetry looks like — worth citing because it shows the discipline exists, and is not applied everywhere.

---

## TASK ONE — asymmetric columns that can strand empty space

Ranked by how much space I believe is at risk, highest first.

### 1. HIGH RISK — `services.html` service block 05 has a genuinely empty grid column (not just imbalanced — vacant)

**File/line:** `.svc-block-body` rule at `services.html:179-185`; block 05 markup at `services.html:677-690`.

**Grid declaration:**
```css
.svc-block-body {
  display: grid;
  grid-template-columns: 1fr 240px;
  column-gap: 64px;
  row-gap: 24px;
  align-items: start;
}
```

**What each column contains today, blocks 01-04 (audit, brand, campaign, content):** three grid children — `.svc-main-col` (main copy + "Right for" callout, `grid-row: 1/-1`), a `<blockquote class="pull-quote svc-pull-quote">`, and `.svc-sidebar-cta` (illustration slot + CTA pill). The 240px column is populated on every one of these four blocks.

**What block 05 contains:** `services.html:684-689` — a single `<div class="svc-main-col">` holding a two-sentence paragraph and a "See the AI work →" link. No pull-quote, no `.svc-sidebar-cta`. That is the *only* child in the grid.

**OBSERVED IN CODE:** with one auto-placed item and no explicit `grid-column` on it, `.svc-main-col` occupies column 1 only. Column 2 (240px, plus the 64px column-gap it reserves either side) receives no content at all.

**INFERRED ABOUT RENDERING:** at every viewport ≥769px (the `768px` breakpoint at `services.html:322-325` is the only place `.svc-block-body` collapses to one column), block 05 renders with roughly 300px of blank horizontal space to the right of two lines of text — inside a component pattern repeated five times on the page, where the other four instances are fully built out. Sitting between the same `<hr class="svc-rule">` dividers as its neighbours, it will read as an unfinished stub, not a deliberately short entry.

**Structural or incidental:** structural. The column exists because the shared grid rule was reused wholesale for a block whose content (a pointer to `/ai`, per the CLAUDE.md note that item 05 was "slimmed to a pointer block") was never going to fill a sidebar. The fix is not an alignment property — there's no sibling to align against. Reusing `.svc-block-body` for a two-line pointer is the mismatch.

**Structural remedy (not a property, per the brief's constraint):** either (a) don't reuse `.svc-block-body`'s two-column grid for this block — drop it to a single-column layout so there's no second track to leave empty, or (b) give it back genuine sidebar content (a pull-quote and CTA, matching 01-04) if the page wants block 05 to keep visual parity with its siblings. Both are content/structure decisions, not something `align-items` or `justify-content` can fix, because the cause is an absent second grid item, not a badly aligned one.

**Predicted post-fix state:** if (a), block 05 should read as full-width copy with no reserved right-hand track — measurable as `.svc-block-body` for `#ai-training` rendering at `grid-template-columns: 1fr` (or simply not using the grid class), with no 240px gap visible in a screenshot at 1024px+ width. If (b), the block should visually match 01-04's proportions. **Disproof:** a screenshot at ≥769px still showing a blank right-hand band beside block 05's text means the fix wasn't applied, or was applied to the wrong selector.

---

### 2. HIGH RISK (deferred) — `.svc-illus-slot` ships with no sizing contract, four times

**File/line:** CSS at `services.html:232-233` (`.svc-illus-slot {}` — literally empty, with the comment "Illustration drop-in slot — no footprint until populated"); markup at `services.html:584, 612, 640, 668`.

**OBSERVED IN CODE:** the rule has no `min-height`, `max-height` or `aspect-ratio`. This is a direct, current, live match to the ratified 18 June 2026 design learning (site-design-check): *"placeholder slots carry a sizing contract... in the session they are created. A zero-footprint slot is a deferred structural problem."* This one predates that ratification (it's been in the tree since the 2026-06-18 session per `SCRATCHPAD.md`) and has not been revisited since the rule was ratified 4 July 2026.

**Why this belongs in a column-stranding audit, not just a placeholder audit:** today it strands *no* space (zero footprint means the sidebar column in blocks 01-04 is sized by the pull-quote and CTA pill alone). The risk is what happens the moment anyone drops an illustration in: the sidebar column's height will jump by whatever the image's natural height is, with nothing in the CSS constraining it — so the first populated block could suddenly run taller or shorter than its four siblings, on a page where all five blocks currently sit at visually comparable heights because they're all built from the same two elements (pull-quote + pill). This is the structural imbalance risk deferred to whoever populates the slot next, exactly as the ratified learning describes.

**Structural remedy:** give `.svc-illus-slot` an explicit `aspect-ratio` (matching whatever image ratio design intends) or a `min-height`/`max-height` pair, in the same session the first real illustration is dropped in — not before, since there's no image to size against yet, but the rule should exist before block 01 gets its trial illustration (per the still-open backlog item in `SCRATCHPAD.md`: "Services: illustrations — trial on block 01... `.svc-illus-slot` divs already in place").

**Predicted post-fix state:** `.svc-illus-slot` carries a non-zero `aspect-ratio` or `min-height` the moment it's first populated; the four sidebar columns (01-04) stay within a bounded height range of each other rather than diverging by whatever each dropped-in image happens to be. **Disproof:** an illustration lands in block 01 and the sidebar column visibly changes height relative to blocks 02-04 with no corresponding CSS change — that would show the slot took its size from unconstrained image intrinsic dimensions, not a locked contract.

---

### 3. MEDIUM RISK — `contact.html` two-row grid strands space below the direct-contact links

**File/line:** `.contact-layout` at `contact.html:28-40`.

```css
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 480px;
  grid-template-rows: auto auto;
  column-gap: 96px;
  row-gap: 40px;
  align-items: start;
}
.contact-intro      { grid-column: 1; grid-row: 1; }
.contact-form-col   { grid-column: 2; grid-row: 1 / 3; }
.contact-direct-links { grid-column: 1; grid-row: 2; }
```

**What each cell contains (desktop ≥901px, before the `900px` collapse at `contact.html:284-293`):**
- `.contact-intro` (col 1, row 1): H1 (`contact.html:377`, up to 2 lines) + two paragraphs (`378-379`).
- `.contact-form-col` (col 2, spans rows 1-2): the full enquiry form — five `.form-group` fields (name, organisation, email, service select, message textarea) plus submit button and a note line (`383-427`).
- `.contact-direct-links` (col 1, row 2): two `.contact-direct` blocks — "Connect on LinkedIn" + one link, "Or read the work first" + two links (`435-447`).

**INFERRED ABOUT RENDERING:** the spanning form column is the tallest single element on the page — five inputs plus a multi-row textarea plus a submit button is comfortably 550-650px. The left column's two pieces combined (intro + direct-links) are shorter. Because `.contact-form-col` spans both rows and CSS grid must make row 1 + gap + row 2 tall enough to fit it, row 2 will expand beyond what `.contact-direct-links`' own content needs, and with `align-items: start` that content sits at the top of the expanded row 2 — leaving blank space below it, beside the lower part of the form.

**Structural or incidental:** structural but comparatively benign — this is a legitimate case of "one column is inherently shorter than a form," not a broken component. It's flagged as medium rather than high because there's no floating CTA or heading stranded mid-void the way block 05's grid strands an entire missing column; it's just white space at the foot of a sidebar, which is a common and often acceptable editorial outcome.

**Structural remedy, if confirmed a problem visually:** the remedy is content, not alignment — either give `.contact-direct-links` a third block (there is precedent: About's equivalent closing block, `.find-links`, carries two full `.find-link-row` entries with descriptions, not just bare links), or reduce the vertical rhythm inside the form so its height comes down closer to the left column's. Do not reach for `align-items` or `justify-content` here; that would only relocate the same surplus, not remove it.

**Predicted post-fix state:** if content is added to `.contact-direct-links`, the gap between the bottom of that block and the section's bottom padding should shrink to roughly the same order as the gap on the right (form to submit-note). **Disproof:** a screenshot showing the left column still ending well above the form's foot after the "fix" means the added content wasn't enough, or the wrong element was touched.

---

### 4. MEDIUM RISK — `index.html` hero portrait column is fixed-height against variable text, mitigated by centring

**File/line:** `.hero-grid` at `homepage.css:71-76`; markup at `index.html:107-127`.

```css
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 64px;
  align-items: center;
}
```

**What each column contains:** left — H1 (up to `var(--h1-size)` = 68px, two lines per the `<br class="h1-br">` at `index.html:110`) + lead paragraph + one pill. Right — a `<picture>` portrait, `aspect-ratio: 3/4` on the fixed 300px column width (`homepage.css:78-85`), which computes to a fixed ≈400px-tall box regardless of what the left column does.

**INFERRED ABOUT RENDERING:** the portrait's height doesn't depend on sibling content (aspect-ratio locks it), so this is the reverse of the AI-page failure — here the *image* column is the fixed one. `align-items: center` (not `stretch`) means if the text column's natural height is less than ~400px, the shorter block is vertically centred within the row rather than pinned to the top: surplus space splits roughly evenly above and below the H1/lead/pill group, rather than collecting as a single one-sided gap. This is the same mitigation that avoided the AI-page problem, applied here deliberately (or by luck) rather than by the `start`-alignment route.

**Structural or incidental:** structural — the image's aspect-ratio is inherently a different sizing rule to flowing text, so some imbalance here is unavoidable by design. The risk is narrower than it looks: it only becomes visible as an asymmetric (not merely centred) gap if the H1 wraps to three lines at a width where the `<br class="h1-br">` (shown only `641-900px` per `homepage.css:360`) still forces an early break, pushing the text column past ~400px and inverting which side is being centred against which. Worth a targeted visual check specifically in the 641-900px band.

**No fix proposed** — this is currently the site's better-behaved version of the pattern (centred, not stretched), flagged for visual confirmation rather than as a defect.

---

### 5. LOW RISK — `about.html` hero grid, a working positive precedent

**File/line:** `.about-hero-grid` at `about.html:42-47`; markup at `about.html:431-462`.

Same shape as #4 (text column vs. fixed-ratio portrait, `1fr 320px`, `align-items: start` this time) but the CSS comment at `about.html:59` states the intent directly: *"About hero — lede + facts + pills, balancing the portrait column."* By my estimate, the left column (H1 + lede, max-width 560px + three-column facts strip with top/bottom rules + pill row) runs to roughly 390-400px, close to the portrait's `320px × 4/3 ≈ 427px`. Cited as evidence the site can and does build both sides of a two-column spread to match on purpose — the standard the other findings above fall short of. No fix proposed; flagged for contrast only.

---

### 6. LOW RISK — the site's repeated "heading-only label column beside a body column" pattern is structural by design, and consistently built

**Files/lines:** `about.html` `.credibility-grid` (169-174) and `.personal-inner` (238-243); `ai.html` `.ai-grid` (84-89, used at 327 for the governance section); `services.html`'s dead `.how-grid` (282-287, 351-354) and `.tier-head-grid` (108-114) which are defined but never referenced in any HTML on the page (confirmed by grep — no `class="how-grid"` or `class="tier-head-grid"` exists anywhere in the markup).

All the *live* instances of this `1fr 2fr` / `5fr 4fr`-adjacent shape use `align-items: start`, never `stretch`, and the short column is a heading alone (About's `<h2>Background</h2>`, `<h2>The work, in practice</h2>`; AI's `<h2>AI governance</h2>`) sitting beside several hundred pixels of running body copy. `ai.html:80-81` names this explicitly as "the site's native section pattern (About credibility, Services how-grid)." Because the label column never stretches and never anchors a CTA that needs a fixed position, the imbalance reads as a magazine department head beside its copy, not a stranded void — this is the "structural, not incidental" case the brief distinguishes, and it's applied consistently across the two pages that use it.

**Worth noting, not fixing:** `about.html`'s CSS also carries three *dead* `.label`-inside-grid rules (`.credibility-grid .label` at `about.html:176`, `.personal-inner .label` at `about.html:245`, and an entirely unused `.find-work-grid`/`.find-work-section` block at `about.html:264-276`) — none of these classes appear in the page's actual HTML. Background and "The work, in practice" ship with a bare `<h2>` and no eyebrow at all. This matters for Task Two below: it shows the site has already, elsewhere, chosen to drop the eyebrow when the heading can carry itself.

---

### 7. LOW RISK — `.cta-grid` and `.footer-grid`, both mitigated by their own rules

- `site.css:543-548` `.cta-grid` (`1fr 1fr`, `align-items: center`) — same centring mitigation as hero-grid (#4): the shorter `.cta-right` paragraph is vertically centred against the taller `.cta-left` (label + heading + pill), not stretched or top-pinned into a void.
- `site.css:411-417` `.footer-grid` (`2fr 1fr 1fr`, no `align-items` set, so the CSS default `stretch` applies) — the brand column (wordmark + tagline + email, ≈120px) is shorter than the nav column (up to 5 links on pages that include AI in the footer nav, ≈250px+). `stretch` on a grid item only affects the invisible box height, not where child content sits inside a plain `<div>` with no background or border — so there is no visible seam or gap to strand. No fix proposed.

Not covered further: `.svc-block-header` (`services.html:151-157`, `80px 1fr`, `align-items: center`) is a fixed numeral beside a title — the numeral is inherently short by design, same category as `about.html`'s facts strip; `about-facts` (`about.html:70-78`) is three equal `1fr` columns of matched content, not an asymmetric pair. `legal.html` and `404.html` have no multi-column grid at all (confirmed by grep — zero `display: grid` rules in either file).

---

## TASK TWO — eyebrow inventory

"Eyebrow" here = the small uppercase label pattern (`.label` and its bespoke siblings: 10-11px Plus Jakarta Sans 600, uppercase, wide tracking, periwinkle-text or a variant). I exclude `.form-label` (contact.html's five field labels) and `.footer-col-label`'s job is close enough to a genuine UI convention that I treat it separately at the end — both are noted but judged on different terms than a decorative section eyebrow.

| # | Class | File : line | Text | Sits above / beside | Real work or decorative? | Verdict |
|---|---|---|---|---|---|---|
| 1 | `.label` | `index.html:157` | "Services" | 5 `.stack-pill` service links | Categorises a genuine set of 5 items | **Keep** |
| 2 | `.label.stack-label` | `index.html:181` | "Engagement" | 3 `.stack-pill` engagement-shape links | Categorises a genuine set of 3 items; mirrors #1 | **Keep** |
| 3 | `.label` | `index.html:204` | "Read the work" | `<h2>Two places to read the work.</h2>` immediately below | Near-restates the heading it sits above — "Read the work" / "Two places to read the work" say the same thing twice in two type styles | **Retire** |
| 4 | `.label` | `index.html:230` | "Get in touch" | `<h2>Tell me what you're working on.</h2>` | Labels a single CTA, not a set — nothing to categorise; the heading + pill already carry the section's job | **Retire** |
| 5 | `.label` | `services.html:762` | "Start here" | Sticky aside CTA heading, inside a bordered/accent-marked block distinct from the body copy beside it | Marks a genuinely different UI region (the entry point among several possible next steps) | **Keep** |
| 6 | `.label` | `ai.html:392` | "Start here" | Same component, same page family, identical wording to #5 | Same as #5 — consistent reuse across pages | **Keep** |
| 7 | `.label` | `about.html:511` | "Or read the work first" | `.find-links` — two `.find-link-row` entries (The Edit, The Substack) | Categorises a genuine 2-item set, distinguishing it from the "Get in touch" pill beside it | **Keep** |
| 8 | `.svc-right-for-label` | `services.html:576, 604, 632, 660` | "Right for" (×4) | A qualifying paragraph inside each of the four built-out service blocks | Content-typing label distinguishing "what this is" copy from "who it's for" copy within one block — functions like a "Note:" flag | **Keep** |
| 9 | `.about-fact-label` | `about.html:439, 443, 447` | "Based in" / "Practice" / "Background" | Three fact values in a spec-sheet strip | Genuine key:value labelling — the values are close to unreadable without them | **Keep — strongest case on the site** |
| 10 | `.contact-direct-label` | `contact.html:437, 441` | "Connect on LinkedIn" / "Or read the work first" | Two stacked direct-contact blocks | Distinguishes two different contact paths, same job as #7 | **Keep** |
| 11 | `.form-box-label` | `contact.html:385` | "Enquiry form" | Top of the dark form card | Weakest "keep": only one form on the page, so nothing to distinguish it from, but it does orient the reader that the dark card is a form before they reach the first input | **Keep, marginal** |
| 12 | `.form-label` (×5) | `contact.html:389, 394, 399, 404, 420` | "Your name" etc. | Individual form inputs | Accessibility-required field labels, not a decorative section eyebrow — different category, out of scope for the AI-tell critique | **Not applicable — exclude from this audit** |
| 13 | `.footer-col-label` | 12 instances across all 6 pages with a footer (`index.html:256,266`; `services.html:787,797`; `ai.html:417,427`; `about.html:541,551`; `contact.html:464,474`; `404.html:119,129`) | "Navigation" / "Elsewhere" | Two link groups in every footer | Standard, expected footer convention distinguishing internal nav from external "elsewhere" links; nobody reads a footer for a site's point of view | **Keep, uniformly** |

**Dead eyebrow CSS, not rendered anywhere (noted for completeness, not scored):** `.tier-label-line` (`services.html:116-125`, never used in markup — likely a leftover from the unmerged `services-descent` branch's "Start here" work per `CLAUDE.md`'s note on that branch); `.credibility-grid .label`, `.personal-inner .label`, `.find-work-grid .label`/`.find-work-section` (`about.html:176, 245, 264-276`, none referenced in the page's actual HTML).

### Is the pattern overused?

Not systemically. Of 29 live eyebrow-family instances, 25 are doing real categorising or key:value work (labelling a set of 2 or more items, or a specific fact/field). Only two — both on the homepage, both in the site's two "closing" widgets — are decorative restatement of an adjacent headline: `index.html:204` ("Read the work" atop "Two places to read the work") and `index.html:230` ("Get in touch" atop "Tell me what you're working on."). That is the generic-SaaS tell Jasmin is naming: label + headline + pill is the single most recognisable closing-section template on the web, and these two instances are the site's clearest matches to it.

### Retiring #3 and #4: does it create inconsistency?

No — retiring them makes the site **more** internally consistent, not less, on two counts already visible in the code:

1. **About's most confident sections already ship without an eyebrow.** `about.html`'s "Background" and "The work, in practice" sections (`about.html:472, 489`) use a bare `<h2>` with no `.label` above it, and the CSS rules that would style one in that position (`.credibility-grid .label`, `.personal-inner .label`) are dead — never applied. The site has already established, on its most editorial page, that a strong heading doesn't need an eyebrow underneath it.
2. **The CTA section already disagrees with itself.** `index.html` and `about.html` both use the identical `.cta-section` / `.cta-grid` / `.cta-left` structure (`site.css:543-557`) for their closing "Tell me what you're working on." block. `index.html:230` has a `.label` ("Get in touch") before the heading; `about.html:504-509`'s equivalent block does not — same component, same heading text, one page adds the eyebrow and the other doesn't. This is a live inconsistency today. Retiring `index.html:230` resolves it in About's direction, not the reverse.

`index.html:204`'s "Read the work" has no cross-page precedent to compare against (the homepage is the only page with a proof-cards section), so its retirement is judged purely on the tautology with its own adjacent heading, not on consistency grounds.

**Predicted post-fix state (both retirements are DOM removals, not property changes, matching what caused the finding):** removing `index.html:204` and `230` should leave the proof section reading "Two places to read the work." directly as the section's only heading-level element, and the CTA section reading "Tell me what you're working on." the same way — both now matching the unlabelled pattern already live in About's Background/personal sections and About's own CTA-left block. **Disproof:** if either heading reads orphaned or under-weighted once the eyebrow above it is gone (i.e., the section suddenly needs more visual anchoring than the `.section-head` alone provides), that would mean the eyebrow was doing more work than this audit credited it for, and the retirement should be reconsidered rather than just reapplied.

---

## Summary

**Task One, ranked:** (1) services.html block 05's genuinely empty 240px column — highest risk, confirmed in code as a missing grid child, not merely an imbalance; (2) the four `.svc-illus-slot` zero-footprint placeholders, a live instance of the ratified 18 June 2026 sizing-contract rule, deferred rather than violated today; (3) contact.html's spanning form column stranding space below the direct-contact links; (4) index.html's hero-grid, mitigated by centring but worth a visual check in the 641-900px band; (5)-(7) either positive precedents (about.html hero, services.html intro grid) or patterns with no visible footprint to strand (footer-grid, cta-grid, the label-only 1fr/2fr family).

**Task Two:** 25 of 29 live eyebrow instances are functional (set-labelling or key:value); 2 on the homepage (proof section, CTA section) are decorative restatement and are the site's clearest generic-SaaS tell; retiring them resolves an existing cross-page inconsistency with about.html rather than creating one. Form-field labels and footer nav-group labels are excluded from the "AI tell" judgment as a different, non-decorative category.

All findings above are OBSERVED IN CODE for the grid/CSS rules and content presence; all statements about rendered gap sizes, line counts, and visual balance are INFERRED ABOUT RENDERING and need confirmation in a real browser at desktop and the 641-900px band before being reported as fixed or unfixed.
