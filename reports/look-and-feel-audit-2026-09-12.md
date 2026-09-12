# Look and feel audit, jasminaziz.co.uk, 12 September 2026

Production audited: `main` at `5cab8bd`, https://www.jasminaziz.co.uk, all five routes plus Legal and 404.
Evidence images: `reports/look-and-feel-2026-09-12/` (fourteen captures, numbered as cited below).

## Verdict

**Not safe to carry client work as it stands, and fixable without touching the palette, the three typefaces or the voice.**

Two things are broken today. On any screen between 641px and about 1,128px wide (tablets, most small laptops) the homepage photograph is cut off the right edge. And the Services layout never worked the way its code says: the sidebar holds only the italic pull quote, so the pull quotes Jasmin wants gone are propping up six columns that would otherwise be empty.

Beyond the defects, the site reads as a competent template in a considered palette, and that impression is traceable to three devices rather than to taste: primary buttons set in 9.5px tracked capitals, an italic pull-quote device that mostly repeats the copy beside it, and ochre side stripes used as a callout on every block. Remove those, give the type scale a rule, add a visual layer with an argument behind it, and the site stops looking machine-made. site-design-check's one-line read is the right one: "a magazine's typesetting wrapped around a spec sheet's structure."

## How this was run

1. **Rendered first.** Production captured with headless Chrome 152 at 1440, 1024, 860, 700 and 500px, cropped at the footer, sliced to viewport height, and measured in the in-app browser pane with the viewport forced and asserted inside every measurement. Cross-check: the homepage at 1440 measures 3,799px in headless and 3,805px in the pane.
2. **A tooling trap caught and closed.** Headless Chrome cannot lay out below 500px: asked for 390, it lays out at 500 and crops to 390 (proved with a page that prints its own width). A first 390 capture set showed clipped text and no hamburger, which looked like a mobile defect and was fiction. It was discarded. Mobile evidence here is the pane at 390 plus honest 500px captures.
3. **Two agents, blind to each other, given the captures.** Their Read tool opens images, so for the first time they could see the page. site-design-check ran the art-director test and the type-system inventory, told explicitly not to score against the stale spec. site-stranger ran the five-second test and the section-by-section "does this earn its place". Every agent claim below was checked against the tree or a measurement before it was used; three were wrong and are corrected in the notes at the end.
4. **Deterministic checks by grep** for impeccable's banned patterns (side stripes, gradient text, tiny uppercase labels, inline styles), rather than pulling its detector package from npm.

Every finding below carries a label: **OBSERVED** (seen in a capture and confirmed in code or by measurement), **CODE** (a rule read in the tree, not visible as a defect on its own), or **INFERRED**.

---

## Findings, ranked by what each costs the site

### 1. Homepage portrait clipped between 641px and 1,128px. OBSERVED

- **Where:** `index.html:110` joins "Strategic&nbsp;marketing" and "communications&nbsp;for" with non-breaking spaces; `homepage.css:71` fixes the portrait track at `300px` (240px at 768 and below); `site.css:36` sets `overflow-x: clip`; `homepage.css:357-360` forces a `.h1-br` line break at 641-900px.
- **Rendered:** the unbreakable "Strategic marketing" sets the text column's minimum width above its `1fr` track, so the fixed portrait column is pushed past the screen. At 700px the text column measures 472px against an allotted 350, and the portrait's right edge sits at 787px on a 700px screen. At 1024 it ends 46px past the edge. At 1130 it fits. `overflow-x: clip` means nothing scrolls: the photo is simply sliced. In 641-900 the H1 also runs five lines with "for" alone on one. Captures 02, 03.
- **Cost:** the site's one photograph, cut through the face, at the widths a board member opens a link on. Invisible to anyone who checks only a phone and a large desktop.
- **Fix in spec terms:** the hero text column is `minmax(0, 1fr)` and the H1 size is tied to the viewport so the longest unbreakable run always fits its column (roughly `clamp(2.75rem, 5vw, 4.25rem)` above 900px); at 900px and below the hero stacks with the portrait above, as it already does on phones; `.h1-br` is deleted. Verified at 641, 700, 768, 769, 860, 900, 901, 1024, 1128, 1130 and 1440 before it is called fixed.

### 2. Services: the sidebar holds nothing but the pull quote. OBSERVED

- **Where:** `services.html:179-189`. `.svc-main-col { grid-row: 1 / -1 }` inside a grid with no explicit rows resolves to a single row, so `.svc-sidebar-cta` auto-places into column 1, row 2.
- **Rendered:** on all six blocks the CTA sits under the copy (left edge 206px, same as the copy) and the 240px sidebar holds only the italic quote, then 300 to 400px of cream. Captures 06, 07. The three engagement-shape blocks further down put their CTA in the right column, so the page runs two opposite patterns. Capture 08.
- **Cost:** this is the "two-column structure needs to be consistent" concern, and it is a bug, not a taste call. It also means **removing the pull quotes empties the sidebar on all six blocks**, not just changes what it is for. The two changes have to land together.
- **Fix in spec terms:** one block grid for services and engagement shapes alike, with every child placed explicitly: copy and CTA in the main column, and the sidebar carrying real content (the "Right for" line and the service's mark, see finding 9). `.svc-illus-slot` is replaced by that placement with a stated aspect ratio, which closes the zero-footprint slot finding open since 18 June, now six instances.

### 3. The primary buttons are the quietest text on the page. OBSERVED

- **Where:** `site.css:272-290`, `.pill` label at `0.594rem` (9.5px), uppercase, 0.14em tracking. It is the label on every CTA on the site. Fourteen rules set text at 10px or under; tracked capitals also carry the stack pills, anchor bar, card links, email links and labels.
- **Rendered:** "SEE HOW I WORK", "DISCUSS AN AUDIT", "GET IN TOUCH" all read as fine print inside a large blue capsule. Captures 01, 07.
- **Cost:** the single strongest "coded" signal on the site. A wall of small tracked capitals is the default output of a component library, and it makes the one thing asking for the sale the least legible thing on screen.
- **Fix in spec terms:** CTA labels in sentence case, Plus Jakarta Sans 600 at 15px, no tracking. Tracked capitals kept only for true labels (Right for, the About fact labels, footer column labels, form labels) at 11px minimum. The homepage stack pills become a ruled list in the site's existing `.find-link-row` idiom rather than a column of outlined tag capsules.

### 4. The italic pull-quote device, and italics generally. OBSERVED

- **Where:** italic is set by **seven rules in four files**, not three: `homepage.css:36` `.hero-lead`; `site.css:328` `.pull-quote p` and `site.css:437` `.footer-tagline`; `legal.html:131` `.page-subtitle`, `legal.html:192` `h2`, `legal.html:234` `.placeholder` (unused, dead); `contact.html:269` `.form-confirmation p`. Pull quotes appear six times on Services and once on AI (`ai.html:346`).
- **Rendered:** the quotes repeat their own block copy; blocks 05 and 06 repeat sentences that sit verbatim beside them (capture 08). Legal's H1 and every H2 are italic serif, a different voice from every other page (capture 13).
- **Cost:** restated content is an AI-writing tell in design form, and it is the device Jasmin has already said she does not like.
- **Fix in spec terms:** all seven rules go. Pull quotes removed sitewide; the hero lead goes with the subline (decision 2); footer tagline roman; Legal's headings move to Chillax on the shared scale; form confirmation roman; the dead `.placeholder` rule deleted. Italic survives only as genuine in-sentence emphasis or a title of a work, never as a display style.

### 5. Ochre side stripes as the callout device. CODE and OBSERVED

- **Where:** `site.css:322` (pull quote), `services.html:199` (`.svc-right-for`), `services.html:781` (closing aside, inline), `ai.html:186` (closing aside).
- **Rendered:** on a phone every service block carries two stacked stripes, twelve on the page (capture 14).
- **Cost:** a coloured left border on a callout is one of the most recognisable template tells, and the stale spec itself says ochre left borders are for pull quotes only.
- **Fix in spec terms:** no side stripes anywhere. "Right for" becomes a labelled line in the sidebar; the closing asides use a hairline top rule and space. Ochre's role moves to the marks and the tinted band.

### 6. Type scale with no rule, and one inversion Jasmin has already seen. OBSERVED

- **Where:** `services.html:127` `.tier-title` "Services" at 36px in raw periwinkle (3.40:1, passing only as large text) sits under a 52px H1 and above `services.html:159` numerals at 72px. Section heads elsewhere run 30px (`ai.html:103`, About), clamp to 34px (`ai.html:167`), clamp to 36px (`ai.html:180`, `site.css:310`), plus inline overrides on the homepage and Services.
- **Rendered:** the "Services" heading is visibly smaller than the "01" it heads (capture 06). This is why it reads too small: not its absolute size, its neighbours.
- **Fix in spec terms:** a stated scale as tokens in `site.css` (display, H1, H2, H3, body, small, label) with at least 1.25x between steps, applied everywhere including Legal; section heads one size sitewide; service numerals demoted to sit below the H2, not above it; headings in ink or `--periwinkle-text`, never raw periwinkle. Inline font sizes on the lines this work touches move into classes.

### 7. One live accessibility failure. OBSERVED

- **Where:** `homepage.css:293`, cream body text on the periwinkle Substack card.
- **Measured:** 3.40:1 for 15.5px body copy, under the 4.5:1 AA floor. The stale spec's table claims 5.5:1 for this pair; the claim is false. Capture 05.
- **Fix in spec terms:** ink text on periwinkle (5.22:1) for the body copy, or restructure the card; no new colour. The corrected pair goes into the spec's contrast table.

### 8. The homepage repeats one composition and has no image after the hero. OBSERVED

- **Where:** `index.html:149` and `:174`, What I do and How I work, both `.diff-body-grid`: copy left, stack of outlined uppercase pills right, back to back (capture 04). About me runs at a roughly 1,010px measure at 1440 (`index.html:193`). The proof-card buttons carry a fixed `width: 13rem` (`homepage.css:299`) with the label left-aligned, leaving dead space inside the pill (capture 05).
- **Cost:** monotone rhythm, every section the same shape, reads as assembled rather than composed. The only picture on the site is one portrait, used on two pages.
- **Fix in spec terms:** How I work gets its own composition (the three shapes as a definition row, words unchanged); body measure capped at 65 to 70ch sitewide; card buttons size to their label. The visual layer (finding 9) supplies the image the homepage lacks.

### 9. No visual layer. OBSERVED

The site has one photograph and no illustration. site-design-check inventoried what the rendered site already owns: the bespoke wave edge, the grain overlay, the numeral-as-graphic, the capsule crop. Built from those, a small set of **diagrammatic marks** can carry the practice's defining idea, the gap between what is produced and what is needed, instead of decorating it. Where marks earn a place: the homepage diagnosis band (which has a measured 364px empty strip on its right at 1440, capture 01), the Services sidebar in place of the quotes, and the AI page header. Where they would be decoration: beside body copy with no job, behind CTAs, in the footer. Jasmin's history on other builds sets the hard edge: no objects drawn flat, no organic blobs, no faux-handmade texture. Detail and the risk are in the plan.

### 10. AI page: The Edit and the policy template are under-platformed. OBSERVED

- **The Edit** sits as an inline link in the third body paragraph (`ai.html:330`), cobalt text in grey prose (capture 09). About already platforms it properly with `.find-link-row`; the homepage gives it a full cobalt card. The AI page, where it is the proof, gives it the least.
- **The policy template** was moved first in the smallprint on 31 August as recommended, but `.ai-close-smallprint a` (`ai.html:215`, specificity 0,1,1) outranks `.ai-close-more` (`ai.html:232`, 0,1,0), so it renders in ink, indistinguishable from the email address under it (capture 10). The prose beside it calls it a real alternative to a call; the design says fine print. The 31 August decision that "the site has one pill variant" was also wrong: the outline `.pill` exists and is used on About.
- **Fix in spec terms:** The Edit lifted into its own panel built from the homepage proof card, using approved strings; the template gets an outline `.pill` of its own directly under the primary one.

### 11. AI page header and body align to nothing. OBSERVED

- **Where:** `ai.html:90`, `.ai-intro-body { max-width: 760px }` under a 5fr/4fr header.
- **Rendered:** at 1440 the body runs 206px to 964px while the lead's column starts at 813px, so the body's right edge sits mid-column and aligns with neither (capture 09). This is the "left-aligned text leaving too much gap on the right". At 769 to 900px the old void returns: the lead narrows to about 280px and runs eleven lines beside a two-item H1 column (capture 12).
- **Fix in spec terms:** every text block starts and ends on a grid line; the intro body shortens (decision 1) and the header's short column carries the page's mark, so the two columns are balanced by content rather than by alignment properties.

### 12. Smaller defects. OBSERVED unless marked

- AI closing band's bottom wave paints a lighter scalloped strip onto the ink footer: the periwinkle band is the last section before the footer and `site.css:373` extends its wave 48px down (capture 11). Fix: no wave below a band that meets the footer.
- Contact's "read the work" links render as grey uppercase, not the cobalt Chillax their class defines: `contact.html:112` `.contact-direct a` outranks `contact.html:82` `.bridge-link`. CODE, visible in `contact-1440.png`.
- AI section heads at 30, 34 and 36px across three co-equal sections: still live, closed by finding 6.
- The Services "How I work" intro wraps at its 640px cap with "of them." alone (`services.html:136`, `:721`, capture 08): closed by finding 2's shared grid.

---

## Page length, measured (390px phone, in the pane)

| Page | Height | Phone screens | Words in `<main>` |
|---|---|---|---|
| Home | 5,279px | 6.3 | 519 |
| Services | 8,761px | 10.4 | 1,144 |
| AI | 5,448px | 6.5 | 746 |
| About | 4,832px | 5.7 | 591 |

Services against the benchmark services page (650 to 700 words) is 1,144. Each service block is about 707px on a phone, most of a screen. "Fractional" is first named in rendered Services at word 768, and its block starts 5,286px down (6.3 screens). On the homepage it is named in the hero and defined in How I work from about 2.5 screens down; What I do starts at 1.47 screens. These numbers are the baseline the build will be measured against.

---

## Jasmin's concerns, mapped

| Concern | Finding | Status |
|---|---|---|
| Does the H1 need the subline | 4, decision 2 | Recommend it goes |
| Is the diagnosis band needed | 8, 9, decision 2 | Recommend it stays, rebuilt |
| Homepage needs an image | 8, 9 | Diagnosis band mark |
| Services sub-copy too long; cut "Most engagements draw on more than one." | decision 1 | In scope, verbatim cut |
| Services H2 too small | 6 | Confirmed: an inversion against the numerals |
| "Recent engagements span..." line | decision 1 | Needs Jasmin's ruling; recommendation given |
| Remove italic pull quotes entirely | 2, 4 | Confirmed; must land with the grid rebuild |
| Two-column structure inconsistent; "Three engagement shapes" gap | 2, 12 | Confirmed as a grid bug plus a width cap |
| AI link to cover fluency training as well as governance | decision 1 | Which link is meant needs confirming |
| AI header body sits oddly on desktop | 11 | Confirmed; aligns to no grid line |
| The Edit deserves a bigger platform | 10 | Confirmed |
| Policy template link clearer | 10 | Confirmed, plus a specificity bug |
| Cut the GEO line in "Where to start" | decision 1 | In scope, verbatim cut |
| AI page needs less text | 11, decision 1 | Cut list to be shown before and after |
| Visuals read AI-generated or coded | 3, 4, 5, 8 | Confirmed; three nameable devices |
| Change the secondary font to lose italics | 4, decision 3 | Recommend no; remove the seven rules |
| Cut text on mobile | page length table | Cuts apply at every width, measured |
| Illustrations and motion | 9 | Direction in the plan, gated on pixels |

## The two August reports: what survives

| Finding | Status now |
|---|---|
| AI header void (stretch plus space-between) | Resolved at 1440; recurs at 769-900 (finding 11) |
| Inline link colour omission | Resolved: inline cobalt on both pages |
| The Edit platforming on AI | Still live (finding 10) |
| Periwinkle heading on its own tint | Resolved: now `--periwinkle-text`; Services siblings still raw periwinkle (finding 6) |
| AI section heads 30/34/36px | Still live (finding 6) |
| Closing-band CTA weighting | Half done: reordered, colour cancelled by specificity (finding 10) |
| Services block 05 empty column | Resolved for block 05; the same emptiness is latent on all six (finding 2) |
| `.svc-illus-slot` no sizing contract | Still live, now six instances (finding 2) |
| Contact form column stranding space | Not a defect in capture: the direct links fill the left column adequately at 1440 |
| Hero grid "mitigated by centring", check 641-900 | Wrong in both directions: broken from 641 to 1,128 (finding 1) |
| Homepage eyebrows at `:204` and `:230` | Resolved 31 August (the brief lists them as unactioned) |

## The brief's claims, checked

- "Italic in exactly three places": seven rules in four files (finding 4).
- "Fractional defined roughly 1,800 words in": word 768 of the rendered page; the 1,800 figure counts markup or JSON-LD. The finding stands either way.
- Eyebrows at `index.html:204` and `:230` unactioned: retired on 31 August.
- `.svc-illus-slot` in blocks 01 to 04: now six instances across 01 to 06.
- Block 05's vacant column: fixed on 31 August, but latent on every block because of the grid bug.

## What is working, and stays

- The palette, the three families, and Chillax at display size. The H1 at 1440 is confident and specific.
- The grain overlay and the bespoke wave edge: the two things that already make the site feel made rather than generated.
- The About hero and the Contact page, both balanced by content rather than by alignment tricks.
- `.find-link-row`: the site's best editorial component, and the model for the stack pills and The Edit.
- The voice. site-stranger's check found the best lines pass the "a competitor could not paste this" test ("Sceptics are welcome in every room; most of their objections are right"). The weakest single phrase is "senior perspective" in the Advisory block (`services.html:743`).

## Parked, not in this pass

- Content and conversion work from the peer benchmark: testimonials, a `/geo` page, a writing-elsewhere list, booking link, symptom-led service copy, a resources page.
- A benchmark-style Services rewrite to 650 to 700 words with deliverables and method per service. This pass builds a layout that structure can drop into later.
- Stranger findings that are copy, not look and feel: the engagement shapes lack a "Right for" line; Campaign names deliverables rather than outcomes.
- "Across charity and commercial" on the homepage against "charity, heritage, and the third sector" on About: a positioning question, Jasmin's.
- Abi Aldridge's newsletter "The Charity Comms Edit" sitting close to The Edit's name.

## Notes on the agents' reports

- site-design-check said `.impeccable.md` does not exist. It does; its glob skipped dotfiles. (Separately, impeccable's own context loader renamed that file to an untracked `PRODUCT.md` during this session without saying so; restored byte-identical before anything was committed.)
- site-design-check said the homepage portrait is fully visible at 700px and the 641-900 band is fine. Measured: clipped at 700 (right edge 787px on a 700px screen).
- site-design-check gave `.about-fact-label` as 9px; it is 10px (`about.html:89`).
- site-stranger said the diagnosis band pushes What I do to "screen 3" on mobile and defines fractional at 2.9 screens. Measured at 390: What I do starts at 1.47 screens; the definition from about 2.5.
- Both agents' full reports were kept outside the repo; this document is the consolidation.
