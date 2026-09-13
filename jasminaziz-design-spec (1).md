# Jasmin Aziz: design specification

**What this is.** The description of what ships on jasminaziz.co.uk: tokens, type, layout, components, the visual layer and the rules that hold them together. site-design-check audits against it.

**Source of truth.** The live files are canonical: `index.html`, `services.html`, `ai.html`, `about.html`, `contact.html`, `legal.html`, `404.html`, `site.css`, `homepage.css`, and the `<style>` block in each page. Where this document and the code disagree, the code wins and this document is corrected in the same commit.

**Rewritten 12 September 2026** at the end of the look-and-feel pass (`reports/look-and-feel-audit-2026-09-12.md`). The previous version described a homepage file, a tweaks panel, unpkg React and Babel scripts, an `image-slot.js` component, and `portfolio.html` and `privacy.html` pages, none of which exist; it also carried a wrong contrast figure. Section 13 records what was removed and why, so none of it comes back by accident.

---

## 0. Working rules

1. **Static HTML, CSS and a little JS.** No framework, no build step, no dependencies. Served from the repo root on Vercel with `cleanUrls`.
2. **Fonts load from CDN** (Google Fonts and Fontshare). Never reference the local `Fonts/` directory.
3. **Three CSS layers.** `site.css` holds tokens and every shared component. `homepage.css` holds homepage-only components and is loaded after `site.css` on `index.html` only. Each inner page keeps its page-specific rules in its own `<style>` block. `legal.html` is isolated: it does not load `site.css` and repeats the values it needs, with a comment saying so.
4. **Sizes come from tokens.** Never set a font size in a `style=""` attribute, and never override `.section-head` per section. A new size needs a reason written beside it.
5. **No italic display styles.** Italic is allowed only for genuine emphasis inside a sentence or the title of a work. No italic leads, quotes, taglines or headings.
6. **No pull quotes.** Removed sitewide by Jasmin's ruling on 12 September 2026.
7. **No side stripes.** No `border-left` or `border-right` wider than 1px as a coloured accent on any callout, aside, quote or list item.
8. **Tracked capitals are for labels only**, at `--fs-label` (11px) or larger. Buttons and links are sentence case.
9. **No opacity on text.** Use the pre-blended tokens (`--ink-muted`, `--ochre-text`, `--periwinkle-text`, `--cream-muted`) or a solid rgba colour whose blended contrast has been computed.
10. **No new colours.** Solve constraints with type or space. The Edit's forest green is The Edit's alone and never appears here.
11. **The grain overlay is always present** (`body::after`, section 7.2).
12. **Two tinted bands are never adjacent**; separate them with a cream section. A band that is the last section before the footer has no bottom wave.
13. **Check layout at 390, 500, 641, 700, 768, 769, 860, 900, 901, 1024, 1130 and 1440**, not only a phone and a large desktop (section 12).

---

## 1. Pages and files

| Route | File | Loads | Notes |
|---|---|---|---|
| `/` | `index.html` | `site.css`, `homepage.css` | Inline nav script (the homepage does not load `nav.js`) |
| `/services` | `services.html` | `site.css` + page `<style>` | Anchor bar, six service blocks, three engagement shapes |
| `/ai` | `ai.html` | `site.css` + page `<style>` | AI, trust and communications |
| `/about` | `about.html` | `site.css` + page `<style>` | `.find-link-row` lives here |
| `/contact` | `contact.html` | `site.css` + page `<style>` | Form posts to `api/contact.js` |
| `/legal` | `legal.html` | own `<style>` only | Isolated: own nav (no hamburger) and footer |
| 404 | `404.html` | `site.css` + page `<style>` | 30-second redirect to `/` |

Scripts: `nav.js` (mobile drawer, on every page except the homepage and Legal), `scroll-top.js` (every page), the inline homepage nav script, and the contact form script (hash preselect plus submit). No third-party scripts. No analytics.

Assets: `assets/jasmin-headshot.jpg` (portrait, 640 by 853, 74KB; served on Home above 900px and on About), `assets/jasmin-headshot-landscape.jpg` (landscape, 1400 by 933; Home at 900px and below), the share cards `assets/og-brand-2026-09.png` and `assets/og-ai-2026-09.png`, the email signature images `assets/email-signature-2026-09.png` and `assets/email-signature-cream-2026-09.png` (section 7.14), and at the root `favicon.svg`, `favicon.ico` and `apple-touch-icon.png` (section 7.13). Card and touch-icon sources live in `assets-src/`, which never deploys. The 2.3MB source PNG, `assets/jasmin-headshot.png`, was deleted on 12 September 2026 once no page used it (it is in git history if the JPEG ever needs re-exporting).

---

## 2. External dependencies

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,500;0,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=chillax@700&display=swap" rel="stylesheet">
```

No italic cuts are requested (removed 12 September 2026 with the italic styles). Legal's own request loads Plus Jakarta Sans 500 only, so Legal uses weight 500 throughout. Fontshare has no `preconnect`; adding one for `api.fontshare.com` and `cdn.fontshare.com` is an open performance item.

The Content-Security-Policy in `vercel.json` allows styles from `fonts.googleapis.com` and `api.fontshare.com`, fonts from `fonts.gstatic.com` and **`cdn.fontshare.com`** (Fontshare serves its font files from a different host from its stylesheet), and images from `'self'` and `data:`. Inline SVG needs nothing further.

---

## 3. Tokens

### 3.1 Colour (`site.css :root`)

| Token | Value | Job |
|---|---|---|
| `--cobalt` | `#2D35C9` | Action: nav bar, primary pills, links |
| `--periwinkle` | `#7B7FD4` | Secondary emphasis: large numerals, the Substack card, the periwinkle band tint. Never small text |
| `--ochre` | `#C99A2C` | Warmth: the ochre band tint. Never text |
| `--ink` | `#14110D` | Text, footer ground |
| `--cream` | `#FAF8F4` | Page ground, text on cobalt and ink |
| `--rule` | `rgba(20,17,13,0.09)` | Hairlines on cream |
| `--periwinkle-text` | `#5255B5` | Periwinkle for text: labels, accent heads |
| `--ochre-text` | `#7A5C0C` | Ochre for text: the "Right for" label |
| `--ink-muted` | `#706D68` | Calibrated for ink at 45% only: `.cta-email`. Not a general muted body colour |
| `--cream-muted` | `#A5A09A` | Footer tagline on ink |

Band tints: ochre `rgba(201,154,44,calc(var(--ochre-pct) * 0.01))` with `--ochre-pct: 12`; periwinkle `rgba(123,127,212,0.10)`.

### 3.2 Layout

| Token | Value | |
|---|---|---|
| `--gutter` | `clamp(20px, 5vw, 56px)` | Horizontal container padding |
| `--sv` | `clamp(56px, 9vw, 96px)`; homepage `clamp(44px, 7vw, 76px)` | Section vertical padding |

Container: `.wrap { max-width: 1140px; margin: 0 auto; padding: 0 var(--gutter); }`.

### 3.3 Type scale (`site.css :root`, since 12 September 2026)

| Token | Value | Range | Used for |
|---|---|---|---|
| `--h1-size` (homepage only) | `68px` | cap for the display H1 | `homepage.css` |
| `--fs-h1` | `clamp(2.25rem, 5vw, 3.25rem)` | 36 to 52px | Every inner-page H1, including Legal (repeated literally) and 404 |
| `--fs-h2` | `clamp(1.75rem, 3.2vw, 2.5rem)` | 28 to 40px | `.section-head` and Services `.tier-title` |
| `--fs-h3` | `clamp(1.375rem, 2vw, 1.625rem)` | 22 to 26px | Service block titles, engagement-shape titles |
| `--fs-body` | `1.0625rem` | 17px | Body copy |
| `--fs-small` | `0.9375rem` | 15px | Buttons, links, aside notes |
| `--fs-label` | `0.6875rem` | 11px | Uppercase labels, the floor for tracked capitals |

Steps are at least 1.25x apart at every width: 52/40 = 1.30, 40/26 = 1.54, 26/17 = 1.53 at desktop; 36/28 = 1.29 and 28/22 = 1.27 at 390px.

---

## 4. Typography

### 4.1 Families

| Family | Weights | Stack | Role |
|---|---|---|---|
| Chillax | 700 | `'Chillax', 'Helvetica Neue', sans-serif` | Display and headings, nav, wordmark, list names, footer links |
| Source Serif 4 | 400 (optical size 8 to 60) | `'Source Serif 4', Georgia, serif` | Body and the diagnosis lead. Set on `body` |
| Plus Jakarta Sans | 500, 600 | `'Plus Jakarta Sans', sans-serif` | Buttons, links, labels, form UI, footer meta |

The secondary face was reviewed on 12 September 2026 and kept: the italics came from CSS rules, not the typeface, and a body-face change would have cascaded through every line-count-tuned layout.

### 4.2 The scale in use

| Element | Family | Weight | Size | Line-height | Tracking | Colour |
|---|---|---|---|---|---|---|
| `.hero-h1` (homepage) | Chillax | 700 | `clamp(2.75rem, 5vw, 68px)`; ≤900 `clamp(2.25rem, 7vw, 3.5rem)`; ≤640 `clamp(2rem, 9vw, 2.75rem)` | 1.05 | -0.03em | ink |
| Inner H1s (`.svc-page-h1`, `.ai-h1`, `.about-h1`, `.error-heading`, Legal `.page-subtitle`) | Chillax | 700 | `--fs-h1` | 1.0 to 1.05 | -0.03em | ink (404 heading in `--periwinkle-text`) |
| `.contact-h1` | Chillax | 700 | `min(var(--fs-h1), 3rem)`, capped so it holds two lines in its narrower column | 1.0 | -0.03em | ink |
| `.section-head` | Chillax | 700 | `--fs-h2` | 1.1 | -0.025em | ink; `.section-head--accent` uses `--periwinkle-text` |
| Services `.tier-title` | Chillax | 700 | `--fs-h2` | 1.1 | -0.025em | `--periwinkle-text` (5.95:1) |
| Legal `h2` | Chillax | 700 | 1.625rem | 1.15 | -0.02em | ink |
| `.svc-block-title`, `.shape-title` | Chillax | 700 | `--fs-h3` | 1.1 | -0.025em | ink |
| `.svc-block-num` | Chillax | 700 | 2.25rem; ≤640 1.75rem | 1 | -0.03em | raw periwinkle (large, decorative) |
| `.ai-room-num` | Chillax | 700 | 34px; ≤640 30px | 1 | -0.03em | raw periwinkle |
| `.close-aside-head` | Chillax | 700 | 1.5rem | 1.15 | -0.025em | ink |
| `.stack-pill` (homepage lists) | Chillax | 700 | 1.125rem | 1.2 | -0.015em | ink, cobalt on hover |
| `.find-link-name` | Chillax | 700 | 17px | | -0.015em | ink |
| Body paragraphs | Source Serif 4 | 400 | 16 to 17px; 15.5 to 16px at ≤640 | 1.65 to 1.72 | | ink |
| `.diag-lead` | Source Serif 4 | 400 | `clamp(1.5rem, 2.4vw, 2rem)`; 1.375rem at ≤768 | 1.3 | | ink |
| `.ai-lead p:first-child` (the AI page's opening paragraph) | Source Serif 4 | 400 | 18px; 17.5px at ≤640 | 1.68 | | ink |
| `.shape-def-term` (inside an `<h3>`) | Chillax | 700 | `--fs-h3` | | -0.02em | ink, cobalt on hover |
| `.ai-edit-head` (an `<h2>`) | Chillax | 700 | `clamp(1.5rem, 2.4vw, 2rem)` | 1.15 | -0.025em | cream on cobalt |
| `.pill` labels | Plus Jakarta Sans | 600 | `--fs-small` | 1.25 | | per variant |
| Links (`.close-aside-links a`, `.contact-direct a`, `.card-link`, `.cta-email`) | Plus Jakarta Sans | 600 | `--fs-small` | | | cobalt (`.cta-email` `--ink-muted`) |
| `.anchor-link` (Services) | Plus Jakarta Sans | 600 | 0.875rem | | | ink, cobalt underline on hover |
| `.label`, `.svc-right-for-label`, `.about-fact-label`, `.contact-direct-label`, `.footer-col-label`, form labels | Plus Jakarta Sans | 600 | `--fs-label` | | 0.12 to 0.13em, uppercase | `--periwinkle-text`, `--ochre-text`, or cream on ink |
| Footer contact, legal links, meta | Plus Jakarta Sans | 600 | 0.8125 to 0.875rem | | | `rgba(250,248,244,0.5)` on ink (solid colour, not opacity) |

Prose links inside paragraphs have no CSS rule: they carry `style="color:var(--cobalt);text-decoration:none;"`. Omit it and the link renders browser-default blue.

Measure: body copy stays at or under about 75 characters a line. Services block copy is held to `38rem`; the homepage About me prose to `42rem`; section bodies in the heading-left, body-right pattern are narrow enough by their grid.

---

## 5. Contrast (computed 12 September 2026)

| Pair | Ratio | Result |
|---|---|---|
| Ink body on cream | 17.74:1 | AAA |
| Ink body on ochre band (12%) | 16.13:1 | AAA |
| Ink body on periwinkle band (10%) | 16.02:1 | AAA |
| Cobalt links on cream | 8.03:1 | AAA |
| Cobalt links on periwinkle band | 7.25:1 | AAA |
| Cobalt links on ochre band | 7.30:1 | AAA |
| Cream on cobalt (pills, The Edit card) | 8.03:1 | AAA |
| Ink on periwinkle (Substack card) | 5.22:1 | AA |
| `--periwinkle-text` on cream | 5.95:1 | AA |
| `--periwinkle-text` on periwinkle band | 5.37:1 | AA |
| `--ochre-text` on cream | 5.89:1 | AA |
| `--ink-muted` on cream | 4.86:1 | AA |
| `--cream-muted` on ink | 7.26:1 | AAA |
| Cream at 50% on ink (footer meta and links) | 5.06:1 | AA |
| Cream at 70% on ink (form labels) | 8.99:1 | AAA |
| Cream at 62% on ink (form "optional" hint) | 7.23:1 | AAA |
| Periwinkle on ink (footer column labels) | 5.22:1 | AA |
| Raw periwinkle on cream | 3.40:1 | Large bold text only (numerals at 28px and up). Never body text or small labels |

One colour sits outside the palette: the contact form's error message is `#ff7f6e` (7.63:1 on the ink card), set by the form script in `contact.html`. It is functional, not decorative, and Jasmin kept it as the one documented exception (ruling 12 September 2026). The Edit's logo mark (section 7.8) keeps The Edit's own lime `#C8F04A`: it is another property's logo, drawn in its own colours, not a site colour, and is never used for text or any other element. Do not add others.

Cream on periwinkle is 3.40:1 and is not used for any text below large-bold size. It was the Substack card's body colour until 12 September 2026, and the old spec wrongly listed it as 5.5:1.

---

## 6. Layout and breakpoints

Desktop-first `max-width` queries at **900, 768, 640 and 480px**.

| Grid | Definition | Collapses |
|---|---|---|
| Homepage hero `.hero-grid` | `minmax(0, 1fr) 300px`, gap 64, centred | ≤900: flex column, portrait first as a 2/1 landscape capsule; ≤640: 3/2 |
| Diagnosis band `.diag-grid` | `minmax(0, 5fr) minmax(0, 6fr)`, gap 72: the lead left, the argument right | ≤768: one column, lead above |
| Homepage How I work `.shapes-row` | `minmax(0, 1.75fr) minmax(0, 1fr) minmax(0, 1fr)`, gap 48: Fractional's definition is three times the others' length | ≤768: one column |
| Homepage `.diff-body-grid` | `1fr 1fr`, gap 72 | ≤768: one column |
| Services intro `.svc-intro-grid` | `5fr 4fr`, gap 80 | ≤900: one column |
| Service and shape blocks | `minmax(0, 38rem) minmax(240px, 1fr)`, gap 64, two children placed in order | ≤768: one column, DOM order copy, Right for, CTA |
| Closing grids (`.how-process-grid`, `.ai-close-grid`) | `2fr 1fr`, gap 96 | ≤768: one column |
| AI header `.ai-intro-grid` | `5fr 4fr`, gap 80, start-aligned: H1 alone left; lead, one paragraph and CTA right | ≤900: one column |
| AI Edit panel `.ai-edit` | `minmax(0, 1fr) auto`, gap 48, end-aligned | ≤768: one column |
| AI training top `.ai-training-top` | `1fr 1fr`, column gap 48: the same tracks as the rooms grid below, heading left, intro right | ≤900: one column, intro capped at 720px |
| Heading-left, body-right (About, AI governance) | `1fr 2fr`, gap 80, start-aligned | ≤768: one column |
| About hero | `minmax(0, 1fr) 320px`, gap 72 | ≤768: `1fr 200px`; ≤640: column, portrait first |
| Contact `.contact-layout` | `minmax(0, 1fr) 480px`, form spans two rows | ≤900: one column |
| Footer `.footer-grid` | `2fr 1fr 1fr`, gap 56 | ≤768: brand full width; ≤480: one column, centred |

Rules learned the hard way:
- A text track beside a fixed-width column is `minmax(0, 1fr)`, never `1fr`. With `1fr`, an unbreakable phrase (the H1 joins "Strategic&nbsp;marketing") sets the track's minimum and pushes the fixed column off-screen; `html { overflow-x: clip }` then hides the overflow silently.
- Never use `grid-row: 1 / -1` in a grid without explicit rows: `-1` resolves to line 1 and the item spans one row.
- When a short column sits beside a long one, balance them with content, not alignment properties. `align-items` only decides where surplus height goes.

---

## 7. Components

### 7.1 Base
`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`, `html { scroll-behavior: smooth; overflow-x: clip; }`, `body { background: var(--cream); color: var(--ink); font-family: 'Source Serif 4'; overflow-x: hidden; }`.

### 7.2 Grain overlay
`body::after`: fixed, full-viewport SVG `feTurbulence` noise (baseFrequency 0.72, 4 octaves) at `opacity: 0.035`, `pointer-events: none`, `z-index: 9000`. It sits over every element, which is what gives flat colour a printed surface. Never remove it.

### 7.3 Navigation
`.site-nav`: sticky cobalt bar, 64px (56px at ≤640). Wordmark left in Chillax 1.375rem cream. Desktop links are Chillax 1.125rem cream in pill-shaped hit areas; the current page carries `.active` (cream at 20% fill, 35% border). At ≤640 the links hide and `.nav-toggle` (44px, three bars that animate to a cross) opens `.nav-drawer`, sticky at 56px, `max-height` 0 to 240px. Order everywhere: Home, Services, AI, About, Contact.

### 7.4 Pills (buttons)
`.pill`: inline-flex, `min-height: 44px`, `padding: 11px 22px`, radius 100px, Plus Jakarta Sans 600 at `--fs-small`, sentence case, 1px border at ink 50% (3:1 against cream). Hover and active fill cobalt with cream text.
`.pill-cobalt`: cobalt fill, cream text; hover and active ink.
Two variants only. The outline `.pill` is the secondary action (About hero, AI policy template); `.pill-cobalt` is the primary.

### 7.5 Section heads
`.section-head` at `--fs-h2`, ink. `.section-head--accent` swaps to `--periwinkle-text` for closing-section heads ("How an engagement starts", "Where to start").

### 7.6 Tinted bands and waves
`.who-section`: full-bleed ochre tint, `padding: var(--sv) 0`, with 48px wave caps above and below (`::before`, `::after`) masked by a fixed bezier (`M0,24 C160,4 320,44 480,24 …` across 1440 units). `.who-section--periwinkle` swaps the tint. A section following a band needs at least 64px top padding on mobile to clear the wave. `main > .who-section:last-child::after { display: none; }` stops a closing band painting its wave onto the footer. Never place two tinted bands next to each other.

### 7.7 Homepage lists (`.stack-pill`)
A hairline-ruled list in the `.find-link-row` idiom: each item a flex row, Chillax 1.125rem ink, `min-height: 52px`, a 1px `--rule` bottom border (the first item also a top border via `.label + .stack-pill`), and a cobalt "→" drawn by `::after` that moves 3px on hover. The class name is historical; it is no longer a pill.

### 7.7a Diagnosis band and How I work (homepage)
- The diagnosis band's three opening sentences are `.diag-lead` (Source Serif 4, `clamp(1.5rem, 2.4vw, 2rem)`, line-height 1.3) on the left; the rest of the argument runs on the right at body size. Words are verbatim from the voice spec's worked example; do not rewrite them without updating that spec. The band has no CTA of its own.
- How I work is one lead-in line ("Three engagement shapes, depending on what you need. Services lays out how each one runs.", with Services a link), then `.shapes-row`: three `.shape-def` columns, each a top hairline, a `.shape-def-term` link (Chillax at `--fs-h3`, cobalt arrow, 44px target) to its Services block, and the definition beneath. The columns are sized to their definitions so the row is as deep as its longest one, not five lines beside two.

### 7.8 Proof cards (homepage)
Full-bleed two-column grid (one column at ≤768). The Edit card: cobalt ground, cream text. The Substack card: periwinkle ground, **ink** text. Each ends in a `.card-link` (cream ground, cobalt text, `--fs-small`, sized to its label). Each carries its property's own logo, `.card-mark`, top right and level with the heading (52px in from the top and right; 36px and 28px at ≤768, right 24px at ≤480), 34px tall, inline SVG, `aria-hidden`: The Edit's is its favicon's three stacked capsules in its own lime (the favicon's cobalt square is the card's own cobalt, so it is omitted); Substack's is its mark in cream. The AI page's Edit panel carries the same Edit mark.

### 7.9 `.find-link-row` (About)
Three columns (name 160px, description, arrow) between hairlines; at ≤640 the name and arrow share a row and the description drops below. The arrow is Plus Jakarta Sans 0.875rem cobalt, sentence case ("Visit ↗").

### 7.10 Service and engagement-shape blocks (Services)
Header: numeral beside title (`auto 1fr`, gap 18, baseline). Body: `.svc-main-col` (the copy) and `.svc-side`. For services, `.svc-side` holds `.svc-right-for` then the CTA; for engagement shapes it holds the CTA. `.svc-side` is capped at 300px on desktop and full width when stacked; its pill goes full width at ≤768.
`.svc-right-for` is marginalia: a top hairline, the label "Right for" in `--ochre-text` at `--fs-label`, then 14.5px body text. No side stripe.

### 7.10a The Edit panel (`.ai-edit`, AI page)
Cobalt ground, cream text (8.0:1), 24px radius, padding `clamp(32px, 4vw, 52px)`, contained in the column grid. The Edit's logo mark, `.ai-edit-mark`, sits top right at the panel's padding (section 7.8); at ≤768 the heading takes 52px right padding to clear it. Opens with `.ai-edit-head` (Chillax `clamp(1.5rem, 2.4vw, 2rem)`: "Exploring AI tools for your team? Start with The Edit."), then `.ai-edit-desc` (the approved description, opening "An AI tools directory I built and run", which carries the ownership claim; max 40rem), then `.ai-edit-link` (cream pill, cobalt text, "The Edit ↗"). The panel sits inside the intro's wrap so the governance band's top wave lands on cream, not on cobalt.

### 7.11 Closing aside (`.close-aside`, Services and AI)
Top hairline, 24px padding, sticky at 140px on desktop (static at ≤768). Contents: `.label` "Start here", `.close-aside-head`, an optional `.close-aside-note`, the primary `.pill-cobalt` (full width at ≤768), then `.close-aside-links` (a hairline, then cobalt `--fs-small` links, 44px targets).

### 7.12 About facts, CTA section, contact form, footer, scroll-top
- `.about-facts`: three columns between hairlines, label plus value; one column at ≤760.
- `.cta-section` / `.cta-grid`: `1fr 1fr`, gap 88, centred; one column at ≤768.
- Contact form: ink card, radius 32px (24px at ≤640), labels in cream at 70% at `--fs-label`, inputs 16px at ≤640 (avoids the iOS zoom), cobalt submit in sentence case at `--fs-small` (hover ink, as `.pill-cobalt`).
- Footer: ink ground, three columns, Chillax links in cream at 88% (solid rgba, not opacity), column labels in periwinkle at `--fs-label`, legal links and meta in cream at 50%.
- `.scroll-top-btn`: 48px cobalt circle with a cream arrow, ink on hover, shown after 300px of scroll, hidden above 900px.

### 7.13 Icons and share cards (set 12 September 2026)
- **Favicon, kept by Jasmin's choice:** `favicon.svg`, a periwinkle circle with "JA" in cream, the Chillax 700 glyphs as outlined paths clipped to the circle (no font dependency since 7 June). Six redesigns were rendered at 16px on light and dark tab strips (ochre, periwinkle and ink rounded squares, a two-tone ink square, periwinkle and ochre circles with ink letters) and declined. If it is ever redesigned: never a cobalt square, which is The Edit's icon, often open in the next tab.
- **`favicon.ico`** (root): 16, 32 and 48px frames rendered from `favicon.svg`, transparent outside the circle. Linked with `sizes="32x32"` so browsers that read SVG prefer the SVG.
- **`apple-touch-icon.png`** (root, 180 by 180): the same periwinkle and cream JA on a full square, letters unclipped at 78% so they clear the iOS corner mask. iOS masks the corners itself and fills transparency with black, so it is never a circle on transparency. Source: `assets-src/apple-touch-icon.svg`.
- **Head links, every page (404 included):** `/favicon.ico` (sizes 32x32), `/favicon.svg`, `/apple-touch-icon.png`, all root-absolute so the 404 page finds them at any depth. No web manifest: nobody installs a consultancy site to a home screen, and Android's shortcut falls back to these icons.
- **Share cards, 1200 by 630 PNG, under 600KB, never SVG:** `assets/og-brand-2026-09.png` (Home, Services, About, Contact, Legal) and `assets/og-ai-2026-09.png` (AI). Both have a cobalt band with "Jasmin Aziz" and the domain in cream Chillax 700, name only (the icon beside the name was tried and declined). Brand: the homepage H1 in ink on cream beside the portrait oval. AI: the label "AI, trust and communications" in `--periwinkle-text`, then "AI governance and training for organisations without a technical team." in ink, on the AI page's closing-band tint (`#EDECF1`, periwinkle at 10% over cream). Chillax 700 only; no italics.
- **Why two cards, not six or one:** AI is a separate offer, linked on its own. Services shares the brand card: its H1 nearly repeats the homepage's, and its copy is due to change in the content pass.
- **Tags:** `og:image`, `og:image:width` 1200, `og:image:height` 630, `og:image:alt`, `twitter:image` and `twitter:image:alt` on every page with a card, absolute `www` URLs.
- **Changing a card means a new filename** (`og-<card>-YYYY-MM.png`), because platforms cache by URL; overwriting leaves the old card live for weeks. After a change, refresh the cache with LinkedIn's Post Inspector.
- **Regenerating (share cards):** `assets-src/og-cards.html?card=brand` or `?card=ai`, rendered by headless Chrome at exactly 1200 by 630: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=4000 --window-size=1200,630 --screenshot=assets/og-<card>-YYYY-MM.png "file://$PWD/assets-src/og-cards.html?card=<card>"`. The source loads the local Chillax file only to render; the site never does.

### 7.14 Email signature (set 13 September 2026)
- **Lockup as a PNG, links as live text.** "Jasmin Aziz" in Chillax 700, 24px, ink, over "Strategic marketing, communications & AI" in Source Serif 4 italic, 15px, `--periwinkle-text`, in a 300 by 60 box rendered at 2x (600 by 120). Email clients strip web fonts (Chillax shows only in Apple Mail), so the name is an image; the links below it stay text so each is clickable: jasminaziz.co.uk, The Edit, LinkedIn, in Arial 12px bold cobalt, separated by `•` in `--ink-muted`. No JA icon beside the name (one identity element per lockup).
- **The italic subline is this signature's own exception** to the sitewide no-italics rule, ruled by Jasmin on 13 September 2026. It does not extend to the site.
- **Two files, never transparent:** `assets/email-signature-2026-09.png` on white, for the Gmail signature on hello@; `assets/email-signature-cream-2026-09.png` on cream, for the enquiry auto-reply in `api/contact.js`. A transparent PNG would put ink text on a dark-mode inbox and vanish. Alt text on both: "Jasmin Aziz, strategic marketing, communications and AI".
- **The auto-reply drops its header name and tagline** (the cobalt rule stays) and closes with "Speak soon," and this signature, so the name appears once. The notification email to Jasmin keeps its header.
- **Changing the signature means a new filename**, as with the share cards: Gmail and inboxes cache images by URL.
- **Regenerating:** `assets-src/email-signature.html?bg=white` or `?bg=cream`: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --force-device-scale-factor=2 --virtual-time-budget=5000 --window-size=300,60 --screenshot=assets/email-signature-YYYY-MM.png "file://$PWD/assets-src/email-signature.html?bg=white"` (add `-cream` to the filename and use `?bg=cream` for the other). Source Serif 4 italic loads from Google Fonts at render time, Chillax from the local file. Check after rendering that no ink touches the image edge: the Chillax J sits left of its origin, which is why the source pads 2px.

---

## 8. The visual layer

**There is no illustration layer.** The visual layer is the portrait, the grain overlay, the wave-edged tinted bands, the ruled lists and the cobalt panels (the homepage proof cards and the AI page's Edit panel). Type and space do the rest. The Edit and Substack logos on those panels (section 7.8) are logos, added at Jasmin's request on 12 September 2026, not illustration.

**Marks were tried and rejected, 12 September 2026.** In-repo SVG "abstract editorial marks" built from the site's own motifs were drafted in three idioms (a line diagram, tinted fields, capsule rhythm), rendered in the real homepage band, and rejected by Jasmin. The marks, the six Services placements and the draw-on motion planned for them were all dropped. She is exploring sourced illustration separately; that decision is hers and has not been made.

**Rules for any future illustration**, from this pass and her feedback on other builds:
1. Decided by Jasmin on rendered pixels in the real page, never on a description.
2. Never a flat drawing standing in for a real object, never generic organic shapes, never faux-handmade texture, fake rotation or sticker affectation.
3. `aria-hidden="true"` when it restates what adjacent text already says.
4. Any slot carries a sizing contract (`aspect-ratio`, or a `min-height` and `max-height` pair) in the session it is created. No zero-footprint placeholders.
5. Measure the section height at 390 and 1440 before and after. On phones an image that pushes the offer further down is removed, not shrunk (the homepage band mark added 145px at 390px).
6. Design principle 2 in `.impeccable.md` stands unchanged: editorial over decorative.

**Motion.** None beyond hover and focus transitions and the mobile nav drawer. No entrance animation, parallax or scroll-triggered reveals. `prefers-reduced-motion` is honoured (section 9).

---

## 9. Interaction and focus states

- Every `:hover` has a matching `:active`.
- Transitions: 150 to 200ms `ease` on colour, background and border; 280 to 300ms on the nav toggle and drawer.
- Focus rings use `:focus-visible` only: 2px cobalt, 3px offset on cream; pills take a 100px radius on the ring; cream rings on cobalt pills, the nav and the footer.
- `prefers-reduced-motion: reduce` collapses animation and transition durations to 0.01ms and removes the drawer and toggle transitions.

## 10. Accessibility

- WCAG 2.2 AA is the floor. Contrast per section 5.
- Touch targets 44px minimum (48 to 52px for list rows and phone inputs).
- Skip link first in `<body>`; `<main id="main-content" tabindex="-1">`.
- Every `target="_blank"` link has `rel="noopener"` and a `.sr-only` " (opens in new tab)".
- `↗` is followed by `&#xFE0E;` so iOS renders it as text, not emoji.
- One H1 per page; headings do not skip levels.
- Marks are `aria-hidden="true"`: they restate an argument the adjacent text already makes.

## 11. Page structures

- **Home** (wordmark links to `/`): hero (H1, one CTA, portrait); diagnosis band (lead left, argument right); What I do (copy plus the ruled services list); How I work (ochre band: lead-in, three-shape definition row, closing line); About me; Two places to read the work (heading, then full-bleed proof cards); closing CTA; footer.
- **Services**: sticky anchor bar; intro (H1 left, intro right); Services (tier heading, intro, six blocks 01 to 06 in the settled order); How I work (ochre band, three shapes); How an engagement starts (body plus `.close-aside`); footer.
- **AI**: header (H1 left; lead, one short paragraph and the CTA right; stacked at ≤900); The Edit panel; AI governance (ochre band, heading left, body right); Training (heading left and intro right on the rooms' two columns, four numbered rooms, close); Where to start (periwinkle band: body plus the policy-template outline pill, `.close-aside`); footer.
- **About**: hero (H1, lede, facts, pills, portrait); rule; Background (heading left, body right); The work, in practice (ochre band); closing CTA with `.find-link-row`s; footer.
- **Contact**: intro and direct links left, form right; footer.
- **Legal**: isolated page, Chillax H1 and H2s, anchor pills, three policies.

## 12. Verifying a change

- Serve locally with `.claude/launch.json` (`jasmin-aziz-static`, port 4181) and reload with a query-string cache-buster; Python's server sends no cache headers.
- Headless Chrome is the quickest full-page capture, but it **cannot lay out below 500px**: asked for 390, it lays out at 500 and crops. Use the browser pane for 390, with the viewport forced and asserted inside the measurement.
- A hidden browser pane will not scroll and freezes transitions and animations. Count `requestAnimationFrame` firings before trusting any measurement of motion.
- Look at the page at desktop and mobile before reporting a visual fix. Measuring the property you changed only proves you changed it.

## 13. Removed, and why (do not reinstate without a decision)

| Removed | When | Why |
|---|---|---|
| Tweaks panel, React and Babel from unpkg, `image-slot.js` | June to August 2026 | Dev tooling on production; security surface |
| Google Analytics | 22 August 2026 | No analytics by decision; no consent banner needed |
| Homepage eyebrows "Read the work" and "Get in touch" | 31 August 2026 | Restated the headings beneath them |
| Italic pull quotes (six on Services, one on AI) | 12 September 2026 | Jasmin's ruling; they restated adjacent copy and propped up an empty sidebar |
| Every italic display style | 12 September 2026 | Read as ornament; decided against changing the typeface instead |
| Ochre side stripes on callouts and asides | 12 September 2026 | A template tell; replaced by hairlines and space |
| Tracked-capitals buttons and links (9.5 to 11px) | 12 September 2026 | The primary action was the quietest text on the page |
| Homepage hero subline | 12 September 2026 | Named formats without defining them; the "hero does not change" rule was reversed with its reason recorded in `.claude/CLAUDE.md` |
| Diagnosis band CTA | 12 September 2026 | A second CTA 400px after the hero's |
| Homepage "Engagement" list | 12 September 2026 | Duplicated the three terms now defined, and linked, in the How I work row |
| AI intro's three full-width paragraphs | 12 September 2026 | Cut to one approved paragraph; The Edit paragraph became its own panel |
| Self-drawn illustration marks and their motion | 12 September 2026 | Drafted in three idioms and rejected on sight (section 8) |
| `.h1-br` forced break | 12 September 2026 | Stranded "for" on its own line at 641 to 900px |
