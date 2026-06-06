# Jasmin Aziz — Complete Design Specification
## Source of truth: `jasminaziz-homepage v2.html`
### For Claude Code handoff — paste into project CLAUDE.md

---

## 0. Favicon

### File
`favicon.svg` — self-contained SVG with `Chillax-Bold.otf` embedded as a base64 `@font-face`. No external font requests.

### Spec
| Property | Value |
|---|---|
| Shape | Circle, `r="16"`, `cx="16" cy="16"`, `viewBox="0 0 32 32"` |
| Background | `#7B7FD4` (periwinkle) |
| Text | `JA`, `fill="#FAF8F4"` (cream) |
| Font | Chillax Bold 700, embedded base64 OTF |
| Font-size | `32` (oversize — crowds and clips to circle) |
| textLength | `29` — forces edge-to-edge horizontal span |
| lengthAdjust | `spacingAndGlyphs` |
| Position | `x="17" y="26"` (slightly right of centre, baseline low) |
| Clip | `<clipPath>` on `<circle cx="16" cy="16" r="16">` applied to text |

### HTML link tag (all pages)
```html
<link rel="icon" type="image/svg+xml" href="favicon.svg">
```

### Pages with favicon installed
- `jasminaziz-homepage v2.html`
- `about.html`
- `services.html`
- `contact.html`
- `legal.html`
- `portfolio.html`
- `privacy.html`

### Notes
- SVG favicons with embedded `@font-face` render correctly in modern browsers when loaded as `<link rel="icon">`. They do **not** render the embedded font when loaded via `<img src>` — use inline SVG or `<object>` for previewing.
- No `.ico` fallback defined. Add `<link rel="alternate icon" href="favicon.ico">` if IE11 support is needed (not required for this project).
- No `<link rel="apple-touch-icon">` defined. Add a 180×180px PNG if Apple home-screen icon support is needed.

---

## 0. Working Rules

- **Canonical file**: `jasminaziz-homepage v2.html` (1572 lines). Do not edit `jasminaziz-homepage ORIGINAL.html` — frozen reference only.
- **Language locale**: `en-GB` (`<html lang="en-GB">`)
- **Page title**: `Jasmin Aziz — Strategic Communications Consultancy`
- **Mobile-first mandate**: every UI change must be fully responsive across all four breakpoints.
- **Never hardcode gutters or section padding** in inline `style=""` attributes — always use `var(--gutter)` and `var(--sv)`.
- **Never use `white-space: nowrap`** on pill elements containing strings longer than ~20 characters.
- **No emoji. No gradient backgrounds. No rounded-corner containers with left-border accents. No Inter or Roboto.**
- **Ochre left borders** (`border-left: 2px solid var(--ochre)`) are used only for `.pull-quote`. Not decorative elsewhere.
- **Grain overlay** (`body::after`) must always be present at `opacity: 0.035`. Never remove.

---

## 1. External Dependencies

### 1.1 Fonts (must load in this order, in `<head>`)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,500;0,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=chillax@700&display=swap" rel="stylesheet">
```

### 1.2 Runtime scripts (bottom of `<body>`, in this order)

```html
<script src="image-slot.js"></script>

<!-- Tweaks panel — React + Babel with pinned integrity hashes -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"
  integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L"
  crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"
  integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm"
  crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
  integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y"
  crossorigin="anonymous"></script>
<script type="text/babel" src="tweaks-panel.jsx"></script>
```

`image-slot.js` — web component (`<image-slot>`) for drag-and-drop portrait placeholder.
`tweaks-panel.jsx` — React Tweaks panel with `useTweaks()`, `TweaksPanel`, `TweakSection`, `TweakSlider`.

---

## 2. Design Tokens

### 2.1 CSS Custom Properties (`:root`)

```css
:root {
  /* ── Brand palette ────────────────────────────────── */
  --cobalt:     #2D35C9;   /* Primary — nav, primary CTAs, hover fills */
  --periwinkle: #7B7FD4;   /* Secondary — labels, stack-pill borders, periwinkle band */
  --ochre:      #C99A2C;   /* Accent — section rule, pull-quote border, who-section tint */
  --ink:        #14110D;   /* Body text, headings on cream, footer bg */
  --cream:      #FAF8F4;   /* Page bg, text on dark surfaces */
  --rule:       rgba(20,17,13,0.09);  /* Borders on cream bg */

  /* ── A11Y text tokens — pre-blended hex, never use opacity on text ── */
  --periwinkle-text: #5255B5;  /* 5.5:1 on cream — labels, stack-pill text */
  --ochre-text:      #7A5C0C;  /* 5.4:1 on cream — svc-price label */
  --ink-muted:       #706D68;  /* 4.8:1 on cream — cta-email default */
  --cream-muted:     #A5A09A;  /* 7.4:1 on ink   — footer tagline */

  /* ── Layout tokens ────────────────────────────────── */
  --gutter: clamp(20px, 5vw, 56px);  /* Horizontal container padding: 20px @ 390px → 56px @ 1120px */
  --sv:     clamp(44px, 7vw, 76px);  /* Section vertical padding: 44px min → 76px max */

  /* ── Tweakable tokens (driven by Tweaks panel) ──── */
  --h1-size:   56px;   /* Hero H1 font-size — range 32–80px, step 2 */
  --ochre-pct: 8;      /* Who-section ochre tint intensity — range 4–20, step 1 */
                       /* Applied as: rgba(201,154,44, calc(var(--ochre-pct) * 0.01)) */
}
```

### 2.2 Hard-coded colour values (not CSS variables — used inline in component rules)

| Value | Context |
|---|---|
| `rgba(250,248,244,0.18)` | Card tag background (both card colours) |
| `rgba(250,248,244,0.8)` | Card tag text (both card colours) |
| `rgba(250,248,244,0.72)` | `.card-year` on cobalt + periwinkle cards (4.8:1 ✓) |
| `rgba(250,248,244,0.78)` | `.proof-card-cobalt p` body (5.5:1 on cobalt ✓) |
| `rgba(250,248,244,0.82)` | `.proof-card-periwinkle p` body |
| `rgba(250,248,244,0.85)` | `.card-link` hover/active bg |
| `rgba(250,248,244,0.6)` | `.svc-price` colour on svc-pill hover |
| `rgba(250,248,244,0.2)` | Nav pill link hover bg |
| `rgba(250,248,244,0.35)` | Nav pill link hover border |
| `rgba(250,248,244,0.1)` | Drawer link hover bg |
| `rgba(250,248,244,0.08)` | Nav drawer top border |
| `rgba(250,248,244,0.07)` | Footer grid bottom border |
| `rgba(123,127,212,0.3)` | `.stack-pill` default border |
| `rgba(123,127,212,0.10)` | Periwinkle band bg (`.who-section--periwinkle`) |
| `rgba(201,154,44, calc(var(--ochre-pct) * 0.01))` | Ochre who-section bg + wave pseudo-elements |
| `rgba(20,17,13,0.5)` | `.pill` default border |
| `rgba(20,17,13,0.09)` | `--rule` — borders on cream bg |

---

## 3. Typography

### 3.1 Font families

| Family | Weights | Stack | Role |
|---|---|---|---|
| Chillax | 700 | `'Chillax', 'Helvetica Neue', sans-serif` | Display — H1, section heads, proof card H3, nav + drawer + footer links, wordmark, svc-pills |
| Plus Jakarta Sans | 500, 600 | `'Plus Jakarta Sans', sans-serif` | UI — labels, pills, stack-pills, card tags/years/links, svc-price, footer meta, cta-email |
| Source Serif 4 | 400, 400 italic (opsz 8–60) | `'Source Serif 4', Georgia, serif` | Body — hero lead, hero diagnosis, diff-paras, who-body, pull-quote, footer tagline |

`font-family` is set on `body` as Source Serif 4. All UI and display elements override explicitly — do not rely on inheritance.

### 3.2 Full type scale

| Element / class | Family | Weight | Size | Line-height | Letter-spacing | Notes |
|---|---|---|---|---|---|---|
| `.hero-h1` | Chillax | 700 | `var(--h1-size)` = 56px desktop | 1.05 | -0.03em | Fluid — see §6 breakpoints |
| `.section-head` | Chillax | 700 | `2.25rem` (36px) | 1.1 | -0.025em | `text-wrap: pretty` |
| `.cta-left .section-head` | Chillax | 700 | `2.5rem` (40px) inline override | 1.1 | -0.025em | Set via `style="font-size:2.5rem;"` |
| `.proof-section .section-head` | Chillax | 700 | `1.875rem` (30px) inline override | 1.1 | -0.025em | Set via `style="font-size:1.875rem;"` |
| `.proof-card h3` | Chillax | 700 | `2rem` (32px) | 1.05 | -0.03em | `margin-bottom: 14px` desktop, `16px` ≤768px |
| `.wordmark` | Chillax | 700 | `1.125rem` (18px) | — | -0.025em | — |
| `.footer-wordmark` | Chillax | 700 | `1.375rem` (22px) | — | -0.025em | — |
| `.nav-list a` | Chillax | 700 | `0.9375rem` (15px) | — | -0.01em | — |
| `.nav-drawer-list a` | Chillax | 700 | `1.25rem` (20px) | — | -0.02em | — |
| `.footer-nav-list a` | Chillax | 700 | `0.9375rem` (15px) | — | -0.01em | — |
| `.svc-pill` | Chillax | 700 | `0.8125rem` (13px) | — | -0.01em | CSS defined; used on other pages |
| `.hero-lead` | Source Serif 4 | 400 italic | `clamp(1.25rem, 2.4vw, 1.625rem)` | 1.4 | — | `color: var(--periwinkle-text)` |
| `.pull-quote p` | Source Serif 4 | 400 italic | `1.375rem` (22px) | 1.48 | — | Not on homepage; used on inner pages |
| `.footer-tagline` | Source Serif 4 | 400 italic | `0.9375rem` (15px) | — | — | `color: var(--cream-muted)` |
| `.hero-diagnosis p` | Source Serif 4 | 400 | `1.0625rem` (17px) | 1.68 | — | `opacity: 0.72`; last `<p>` overrides to `opacity: 1 !important` via `.hero-diagnosis-close` |
| `.who-body p` | Source Serif 4 | 400 | `1.0625rem` (17px) | 1.68 | — | `p+p: opacity: 0.68` |
| `.diff-paras p` | Source Serif 4 | 400 | `1.03125rem` (≈16.5px) | 1.68 | — | `opacity: 0.72`, `text-wrap: pretty` |
| `.proof-card p` | Source Serif 4 | 400 | `0.969rem` (≈15.5px) | 1.6 | — | Opacity via card-colour variant rules |
| `.label` | Plus Jakarta Sans | 600 | `0.6875rem` (11px) | — | 0.13em | Uppercase; `color: var(--periwinkle-text)`; always `display: block` |
| `.pill` | Plus Jakarta Sans | 500 | `0.594rem` (≈9.5px) | — | 0.14em | Uppercase |
| `.stack-pill` | Plus Jakarta Sans | 600 | `0.6875rem` (11px) | — | 0.1em | Uppercase; `color: var(--periwinkle-text)` |
| `.card-link` | Plus Jakarta Sans | 600 | `0.625rem` (10px) | — | 0.13em | Uppercase |
| `.card-tag` | Plus Jakarta Sans | 600 | `0.625rem` (10px) | — | 0.12em | Uppercase |
| `.card-year` | Plus Jakarta Sans | 600 | `0.625rem` (10px) | — | 0.13em | Uppercase |
| `.footer-col-label` | Plus Jakarta Sans | 600 | `0.625rem` (10px) | — | 0.13em | Uppercase; `color: var(--periwinkle)` (full value, not `--periwinkle-text`) |
| `.cta-email` | Plus Jakarta Sans | 600 | `0.6875rem` (11px) | — | 0.11em | Uppercase |
| `.footer-contact` | Plus Jakarta Sans | 600 | `0.6875rem` (11px) | — | 0.12em | Uppercase |
| `.footer-legal-link` | Plus Jakarta Sans | 600 | `0.625rem` (10px) | — | 0.12em | Uppercase |
| `.footer-meta` | Plus Jakarta Sans | 600 | `0.625rem` (10px) | — | 0.12em | Uppercase |
| `.svc-price` | Plus Jakarta Sans | 600 | `0.625rem` (10px) | — | 0.1em | Uppercase; `color: var(--ochre-text)` default |
| Inline body links | Plus Jakarta Sans | 600 | `0.6875rem` (11px) | — | 0.1em | Uppercase; `color: var(--cobalt); text-decoration: none` — used inside `.diff-paras`, `.about-bridge-grid`, `.cta-right` |
| Proof intro `<p>` | Source Serif 4 | 400 | `1rem` | 1.6 | — | `opacity: 0.68; max-width: 520px` — inline style |
| CTA right `<p>` | Source Serif 4 | 400 | `0.9375rem` | 1.65 | — | `opacity: 0.65` — inline style |
| Skip link (focused) | Plus Jakarta Sans | 700 | `0.875rem` | — | 0.04em | Not text-transformed |

---

## 4. Spacing Tokens

### 4.1 Container

```css
.wrap {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 var(--gutter);   /* 20px @ 390px → 56px @ 1120px */
}
```

### 4.2 Section padding

| Section | Top padding | Bottom padding |
|---|---|---|
| `.hero` | `var(--sv)` | `var(--sv)` |
| `.who-section` (all variants) | `var(--sv)` | `var(--sv)` |
| `.diff-section` | `calc(var(--sv) + 48px)` | `calc(var(--sv) + 48px)` |
| `.about-section` | `calc(var(--sv) + 48px)` | `clamp(20px, 3vw, 36px)` |
| `.proof-section` | `clamp(20px, 3vw, 36px)` | `clamp(24px, 3vw, 36px)` |
| `.cta-section` | `var(--sv)` | `var(--sv)` |
| `footer` | `clamp(48px, 7vw, 72px)` | `clamp(36px, 5vw, 52px)` |

The `+48px` offsets on `.diff-section` and `.about-section` compensate for the 48px wave pseudo-elements on adjacent `.who-section` bands intruding into neighbouring sections.

### 4.3 Key internal spacing (desktop defaults)

| Element | Value | Property |
|---|---|---|
| `.hero-h1` bottom margin | `clamp(20px, 3vw, 32px)` | `margin-bottom` |
| `.hero-intro` bottom margin | `clamp(44px, 6vw, 68px)` | `margin-bottom` |
| `.hero-lead` bottom margin | `36px` | `margin-bottom` |
| `.hero-lead` max-width | `720px` | `max-width` |
| `.hero-h1` max-width | `820px` | `max-width` |
| `.hero-diagnosis` max-width | `720px` | `max-width` |
| `.hero-diagnosis p + p` | `22px` | `margin-top` |
| `.hero-diagnosis-close` | `24px` | `margin-top` |
| `.who-body p + p` | `24px` | `margin-top` |
| `.diff-paras p + p` | `22px` | `margin-top` |
| `.svc-pill` gap | `8px` | `margin-bottom` |
| `.stack-pill` gap | `8px` | `margin-bottom` |
| `.svc-index .label` | `18px` | `margin-bottom` |
| `.stack-label` | `18px` | `margin-bottom` |
| `.section-head` below label | `18px` | `margin-bottom` (inline `style=""`) |
| `.proof-section .label` | `16px` | `margin-bottom` (inline `style=""`) |
| `.proof-section` intro `<p>` | `14px` top, `40px` bottom | `margin-top`, `margin-bottom` (inline) |
| `.proof-card` card-year | `24px` | `margin-bottom` |
| `.proof-card` h3 | `14px` | `margin-bottom` |
| `.card-link` | `40px` | `margin-top` (desktop, flex child) |
| `.cta-section` label | `20px` | `margin-bottom` (inline `style=""`) |
| `.cta-section` action row | `28px` | `margin-top` (inline `style=""`) |
| `.cta-right` flex gap | `18px` | `gap` |
| `.footer-wordmark` | `12px` | `margin-bottom` |
| `.footer-tagline` | `28px` | `margin-bottom` |
| `.footer-grid` | `52px` | `padding-bottom` |
| `.footer-nav-list li + li` | `4px` | `margin-top` |
| `.footer-bottom` | `28px` | `padding-top` |
| `.footer-legal` gap | `22px` | `gap` |
| `.pull-quote` | `4px 0 4px 28px` | `padding` |
| `.pull-quote` bottom | `36px` | `margin-bottom` |
| `.about-bridge-grid .diff-paras` | `20px` | `margin-top` (inline `style=""`) |
| `.section-rule` | `clamp(40px, 5vw, 64px)` | `padding` top + bottom |

### 4.4 Grid gaps

| Grid | Desktop gap | ≤768px gap | ≤480px gap |
|---|---|---|---|
| `.who-grid` | `80px` | `16px` | — |
| `.diff-body-grid` | `72px` | `40px` | — |
| `.about-bridge-grid` | `72px` | `36px` | — |
| `.cta-grid` | `88px` | `36px` | — |
| `.footer-grid` | `56px` | `40px` | `32px` |
| `.nav-list` item gap | `6px` | — | — |

---

## 5. Components

### 5.1 Global reset

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--cream);
  color: var(--ink);
  font-family: 'Source Serif 4', Georgia, serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
```

### 5.2 Grain overlay

```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG fractalNoise, baseFrequency=0.72, numOctaves=4 */
  opacity: 0.035;
  pointer-events: none;
  z-index: 9000;
}
```

Always present. z-index 9000 sits above all page content but below focus rings (which use native outline, not z-index).

### 5.3 `.site-nav` (primary navigation)

```
Structure: <nav class="site-nav"> — sticky, top: 0, z-index: 200
  <a class="wordmark"> — left
  <ul class="nav-list"> — right (desktop only, hidden ≤640px)
  <button class="nav-toggle"> — right (mobile only, shown ≤640px)
```

```css
.site-nav {
  background: var(--cobalt);
  padding: 0 var(--gutter);
  height: 64px;          /* → 56px at ≤640px */
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 200;
}
```

Nav destination links: `services.html`, `about.html`, `contact.html`

### 5.4 `.nav-drawer` (mobile navigation)

```
Structure: <nav class="nav-drawer" id="nav-drawer"> — sibling to .site-nav
  Sticky at top: 56px, z-index: 199
  Hidden desktop (display: none), shown ≤640px (display: block)
  Animated via max-height: 0 → 240px
```

JS state classes:
- `.nav-drawer.open` — `max-height: 240px`
- `.site-nav.nav-open` — triggers hamburger → × animation on bars

JS events handled: `toggle.click`, `keydown[Escape]`, drawer `a.click` (close on tap), `document.click` outside (close)

ARIA: `aria-expanded` on toggle button, `aria-hidden` on drawer, `aria-label` toggled between `"Open navigation"` / `"Close navigation"`

### 5.5 `.nav-toggle` (hamburger button)

```
44×44px. 3 × `.nav-toggle-bar` spans (22×2px, border-radius 1px).
Gap between bars: 5px.
```

Bar animations on `.site-nav.nav-open`:
```css
bar:nth-child(1): transform: translateY(7px) rotate(45deg)
bar:nth-child(2): opacity: 0; transform: scaleX(0)
bar:nth-child(3): transform: translateY(-7px) rotate(-45deg)
transition: transform 280ms ease, opacity 280ms ease
transform-origin: center
```

### 5.6 `.pill` (base outline pill)

```css
display: inline-flex;
align-items: center;
justify-content: center;
border: 1px solid rgba(20,17,13,0.5);
border-radius: 100px;
padding: 11px 26px;
min-height: 44px;
white-space: nowrap;
transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
```

### 5.7 `.pill-cobalt` (filled primary CTA — extends `.pill`)

```css
background: var(--cobalt);
color: var(--cream);
border-color: var(--cobalt);
```

### 5.8 `.svc-pill` (service index pill — CSS defined, used on inner pages)

```css
display: flex;
align-items: center;
justify-content: space-between;
border: 1px solid var(--rule);
border-radius: 100px;
padding: 12px 18px 12px 20px;
min-height: 48px;
white-space: nowrap;   /* → normal at ≤768px */
margin-bottom: 8px;
transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
```

`.svc-price` child: `color: var(--ochre-text)` default; `color: rgba(250,248,244,0.6)` on parent hover/active.

### 5.9 `.stack-pill` (capability / engagement pills)

```css
display: flex;
align-items: center;
border: 1px solid rgba(123,127,212,0.3);
border-radius: 100px;
padding: 12px 20px;
min-height: 44px;
color: var(--periwinkle-text);
margin-bottom: 8px;
transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
```

Mobile: `width: 100%`

### 5.10 `.who-section` (full-width tinted band)

```css
padding: var(--sv) 0;
background: rgba(201,154,44, calc(var(--ochre-pct) * 0.01));
position: relative;
overflow: visible;   /* allows wave pseudo-elements to intrude into neighbours */
```

Wave pseudo-elements:
- `::before` — top edge, `top: -48px`, height `48px`, same background, SVG mask (concave wave pointing up into previous section)
- `::after` — bottom edge, `bottom: -48px`, height `48px`, same background, SVG mask (concave wave pointing down into next section)

**Periwinkle variant** (diagnosis band):
```css
.who-section--periwinkle {
  background: rgba(123,127,212,0.10);
}
.who-section--periwinkle::before,
.who-section--periwinkle::after {
  background: rgba(123,127,212,0.10);
}
```

### 5.11 `.who-grid` (CSS defined, used on inner pages — homepage uses `.diff-body-grid`)

```css
display: grid;
grid-template-columns: 1fr 2fr;
gap: 80px;
align-items: start;
/* → grid-template-columns: 1fr; gap: 16px; at ≤768px */
```

### 5.12 `.diff-body-grid` (used for "What I do", "How I work", and About copy layouts)

```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 72px;
align-items: start;
/* → grid-template-columns: 1fr; gap: 40px; at ≤768px */
```

### 5.13 `.about-bridge-grid`

```css
display: grid;
grid-template-columns: 1.6fr 1fr;
gap: 72px;
align-items: center;
/* → grid-template-columns: 1fr; gap: 36px; at ≤768px */
```

### 5.14 `.about-portrait` / `<image-slot>`

```css
width: 300px;
height: 300px;
border: 1px solid var(--rule);
border-radius: 50%;   /* circle */
display: block;
/* → 200px × 200px at ≤768px */
```

On mobile (≤768px): `justify-content: flex-start` on `.about-portrait-wrap` (portrait left-aligns).

```html
<image-slot
  id="home-portrait"
  class="about-portrait"
  shape="circle"
  src="assets/jasmin-headshot.png"
  placeholder="Drop a portrait"
  role="img"
  aria-label="Portrait of Jasmin Aziz">
</image-slot>
```

### 5.15 `.proof-cards` (full-bleed — no `.wrap` parent)

```css
display: grid;
grid-template-columns: 1fr 1fr;
/* → grid-template-columns: 1fr at ≤768px */
```

`.proof-card` padding: `52px 52px 48px` desktop → `36px 28px 32px` ≤768px → `28px 20px 24px` ≤480px.

On mobile (≤768px): `display: flex; flex-direction: column`. Body `<p>` gets `flex: 1` to push `.card-link` to bottom.

### 5.16 `.card-tag`

```css
position: absolute;
top: 22px; right: 22px;   /* → top: 16px; right: 16px; at ≤480px */
border-radius: 100px;
padding: 7px 16px;         /* → 5px 12px at ≤480px */
font-size: 0.625rem;       /* → 0.5625rem at ≤480px */
```

Colours: `.card-tag-cobalt` and `.card-tag-periwinkle` both use `background: rgba(250,248,244,0.18); color: rgba(250,248,244,0.8)`.

Currently only the periwinkle card renders a `.card-tag` on the homepage ("Every Tuesday").

### 5.17 `.card-link`

```css
display: inline-flex;
align-items: center;
border-radius: 100px;
padding: 11px 22px;
min-height: 44px;
margin-top: 40px;          /* reset to 0 at ≤768px via align-self: flex-start */
border: 1px solid transparent;
transition: background 200ms ease, color 200ms ease;
```

Cobalt card: `color: var(--cobalt); background: var(--cream); border-color: var(--cream)`
Periwinkle card: same values (cobalt on cream = 8.0:1 ✓)

### 5.18 `.cta-email`

```css
color: var(--ink-muted);
text-decoration: none;
min-height: 44px;
display: inline-flex;
align-items: center;
transition: color 150ms ease;
```

### 5.19 `footer` and `.footer-grid`

```css
footer { background: var(--ink); }
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 56px;
  padding-bottom: 52px;
  border-bottom: 1px solid rgba(250,248,244,0.07);
}
```

At ≤768px: `grid-template-columns: 1fr 1fr; gap: 40px`. Brand col: `grid-column: 1 / -1`.
At ≤480px: `grid-template-columns: 1fr; gap: 32px`. Brand col: `grid-column: auto` (cancels span-full).

### 5.20 `.footer-bottom`

```css
display: flex;
justify-content: space-between;
align-items: center;
padding-top: 28px;
/* → flex-direction: column; align-items: flex-start; gap: 12px; at ≤480px */
```

### 5.21 `.footer-contact`

```css
color: var(--cream);
opacity: 0.5;
min-height: 44px;
display: inline-flex;
align-items: center;
/* No hover/active state defined — static link */
```

### 5.22 `.section-rule` (CSS defined, not on homepage — used on inner pages)

```css
display: flex;
justify-content: center;
padding: clamp(40px, 5vw, 64px) 0;
```

`::after`: `width: 200px; height: 2px; background: var(--ochre); border-radius: 1px`

### 5.23 `.pull-quote` (CSS defined, not on homepage — used on inner pages)

```css
border-left: 2px solid var(--ochre);
padding: 4px 0 4px 28px;
margin-bottom: 36px;
/* p: Source Serif 4, 400 italic, 1.375rem, line-height 1.48 */
/* p: ≤640px → font-size 1.125rem; padding-left 20px */
```

### 5.24 `.wave-sep` and `.svc-wave` (CSS defined, not on homepage)

```css
.wave-sep { display: block; width: 100%; line-height: 0; overflow: hidden; }
.wave-sep svg { width: 100%; height: 48px; display: block; }
.svc-wave svg { width: 100%; height: 28px; display: block; }
```

### 5.25 Tweaks panel

Two tweaks wired via `useTweaks(TWEAK_DEFAULTS)`:

| Tweak | Key | Default | Min | Max | Step | Unit | CSS property |
|---|---|---|---|---|---|---|---|
| H1 size | `h1Size` | `56` | `32` | `80` | `2` | `px` | `--h1-size` |
| Ochre tint | `ochrePct` | `8` | `4` | `20` | `1` | `%` | `--ochre-pct` |

---

## 6. Interaction States

All transitions respect `@media (prefers-reduced-motion: reduce)` — all durations collapse to `0.01ms !important`. Nav drawer and toggle bar transitions set to `none` explicitly.

### 6.1 `.pill` (outline pill)

| State | Background | Border | Color |
|---|---|---|---|
| Default | `transparent` | `rgba(20,17,13,0.5)` | `var(--ink)` |
| Hover | `var(--cobalt)` | `var(--cobalt)` | `var(--cream)` |
| Active | = Hover | = Hover | = Hover |
| Focus-visible | `transparent` | `rgba(20,17,13,0.5)` | `var(--ink)` + cobalt outline (see §7) |

`transition: background 200ms ease, color 200ms ease, border-color 200ms ease`

### 6.2 `.pill-cobalt` (filled CTA)

| State | Background | Border | Color |
|---|---|---|---|
| Default | `var(--cobalt)` | `var(--cobalt)` | `var(--cream)` |
| Hover | `var(--ink)` | `var(--ink)` | `var(--cream)` |
| Active | = Hover | = Hover | = Hover |
| Focus-visible | `var(--cobalt)` | `var(--cobalt)` | `var(--cream)` + cream outline (see §7) |

`transition: background 200ms ease, color 200ms ease, border-color 200ms ease`

### 6.3 `.svc-pill`

| State | Background | Border | Color | `.svc-price` color |
|---|---|---|---|---|
| Default | `transparent` | `var(--rule)` | `var(--ink)` | `var(--ochre-text)` |
| Hover | `var(--cobalt)` | `var(--cobalt)` | `var(--cream)` | `rgba(250,248,244,0.6)` |
| Active | = Hover | = Hover | = Hover | = Hover |

`transition: background 200ms ease, color 200ms ease, border-color 200ms ease`
`.svc-price` also gets `transition: color 200ms ease`

### 6.4 `.stack-pill`

| State | Background | Border | Color |
|---|---|---|---|
| Default | `transparent` | `rgba(123,127,212,0.3)` | `var(--periwinkle-text)` |
| Hover | `var(--cobalt)` | `var(--cobalt)` | `var(--cream)` |
| Active | = Hover | = Hover | = Hover |
| `.stack-pill-active` (class) | = Hover | = Hover | = Hover |

`transition: background 200ms ease, color 200ms ease, border-color 200ms ease`

### 6.5 `.nav-list a` (desktop nav)

| State | Background | Border | Color |
|---|---|---|---|
| Default | `transparent` | `1px solid transparent` | `var(--cream)` |
| Hover | `rgba(250,248,244,0.2)` | `rgba(250,248,244,0.35)` | `var(--cream)` |
| Active | = Hover | = Hover | = Hover |
| Focus-visible | `rgba(250,248,244,0.2)` | `rgba(250,248,244,0.35)` | `var(--cream)` + cream outline (see §7) |

`transition: background 200ms ease, border-color 200ms ease`

### 6.6 `.nav-toggle`

| State | Style |
|---|---|
| Default | No bg, no border, `color: var(--cream)` |
| Focus-visible | `outline: 2px solid rgba(250,248,244,0.6); outline-offset: 2px; border-radius: 6px` |

Bar animations on `.site-nav.nav-open`:
- bar 1: `transform: translateY(7px) rotate(45deg)`
- bar 2: `opacity: 0; transform: scaleX(0)`
- bar 3: `transform: translateY(-7px) rotate(-45deg)`

`transition: transform 280ms ease, opacity 280ms ease`

### 6.7 `.nav-drawer-list a`

| State | Background |
|---|---|
| Default | `transparent` |
| Hover | `rgba(250,248,244,0.1)` |
| Active | = Hover |

`transition: background 150ms ease`

Drawer open/close: `max-height: 0 → 240px`, `transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1)`

### 6.8 `.card-link`

| State | Background (both card colours) |
|---|---|
| Default | `var(--cream)` |
| Hover | `rgba(250,248,244,0.85)` |
| Active | = Hover |

`transition: background 200ms ease, color 200ms ease`

### 6.9 `.cta-email`

| State | Color |
|---|---|
| Default | `var(--ink-muted)` (#706D68) |
| Hover | `var(--ink)` |
| Active | = Hover |

`transition: color 150ms ease`

### 6.10 `a.footer-wordmark`

| State | Opacity |
|---|---|
| Default | `1` |
| Hover | `0.85` |
| Active | = Hover |

`transition: opacity 150ms ease`

### 6.11 `.footer-nav-list a`

| State | Opacity |
|---|---|
| Default | `0.88` |
| Hover | `1` |
| Active | = Hover |

`transition: opacity 150ms ease`

### 6.12 `.footer-legal-link` and `.footer-contact`

| State | Opacity |
|---|---|
| Default | `0.5` |
| Hover | `1` (only `.footer-legal-link` — `.footer-contact` has no hover) |
| Active | = Hover |

`.footer-legal-link`: `transition: opacity 150ms ease`

---

## 7. Focus States

All rings use `:focus-visible`, never bare `:focus`. Never write `outline: none` without a replacement.

| Context | Outline | Offset | Border-radius on ring |
|---|---|---|---|
| Default (cream bg) | `2px solid var(--cobalt)` | `3px` | — |
| `.pill`, `.svc-pill`, `.stack-pill`, `.nav-drawer-list a` | `2px solid var(--cobalt)` | `3px` | `100px` |
| `.pill-cobalt` | `2px solid var(--cream)` | `3px` | `100px` |
| `.site-nav` all elements | `2px solid rgba(250,248,244,0.9)` | `2px` | — |
| `.nav-list a` (additionally sets bg + border) | `2px solid rgba(250,248,244,0.9)` | `2px` | `100px` |
| `.nav-toggle` | `2px solid rgba(250,248,244,0.6)` | `2px` | `6px` |
| `.card-link` (cobalt + periwinkle) | `2px solid var(--cobalt)` | `3px` | `100px` |
| `footer` all elements | `2px solid rgba(250,248,244,0.9)` | `3px` | — |
| `footer` nav + legal links | `2px solid rgba(250,248,244,0.9)` | `3px` | `2px` |
| `.skip-link:focus` | `2px solid var(--cream)` | `2px` | `4px` |

---

## 8. Accessibility

### 8.1 Touch targets

- All `<a>` and `<button>`: `min-height: 44px`
- `.svc-pill`, `.stack-pill`: `min-height: 48px`
- `.wordmark`, `.cta-email`, `.footer-contact`, `.footer-nav-list a`, `.footer-legal-link`: all `min-height: 44px` via `display: inline-flex; align-items: center`
- Every `:hover` has a matching `:active` — no exceptions

### 8.2 Skip link

```html
<a class="skip-link" href="#main-content">Skip to content</a>
```

Visually hidden until `:focus`. Appears at `position: fixed; top: 12px; left: 12px` on focus. `background: var(--cobalt); color: var(--cream); border-radius: 4px`.

### 8.3 Main landmark

```html
<main id="main-content" tabindex="-1">
```

`tabindex="-1"` allows skip link to programmatically focus `<main>`.

### 8.4 Screen reader utility

```css
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

Use for `(opens in new tab)` text on all `target="_blank"` links.

### 8.5 External links

All `target="_blank"` links use `rel="noopener"` and include a `.sr-only` "(opens in new tab)" span.

### 8.6 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .nav-drawer    { transition: none; }
  .nav-toggle-bar { transition: none; }
}
```

### 8.7 Colour contrast (verified pairs)

| Text | Background | Ratio | WCAG |
|---|---|---|---|
| `--periwinkle-text` (#5255B5) | `--cream` (#FAF8F4) | 5.5:1 | AA ✓ |
| `--ochre-text` (#7A5C0C) | `--cream` | 5.4:1 | AA ✓ |
| `--ink-muted` (#706D68) | `--cream` | 4.8:1 | AA ✓ |
| `--cream-muted` (#A5A09A) | `--ink` (#14110D) | 7.4:1 | AA ✓ |
| `cream@78%` on cobalt | — | 5.5:1 | AA ✓ |
| `cream@72%` on cobalt | — | 4.8:1 | AA ✓ |
| `cream@82%` on periwinkle | — | 5.5:1 | AA ✓ |
| `var(--cobalt)` on `var(--cream)` | — | 8.0:1 | AAA ✓ |
| `var(--periwinkle)` on `var(--ink)` | — | 5.3:1 | AA ✓ |
| `cream@50%` (#706D68 equiv) on `--ink` | — | 4.75:1 | AA ✓ |
| `cream@88%` on `--ink` | — | — | AA ✓ |

---

## 9. Responsive Breakpoints

Desktop-first approach (`max-width` media queries).

### 9.1 900px — H1 type scale

```css
.hero-h1 { font-size: clamp(2.25rem, 7vw, 3.5rem); }  /* 36px → 56px */
```

### 9.2 768px — Major grid collapses

- `.hero-body { padding-top: 28px }`
- `.hero-intro { margin-bottom: 36px }`
- `.hero-diagnosis p { font-size: 1rem }`
- `.svc-pill { width: 100%; white-space: normal }`
- `.who-grid → grid-template-columns: 1fr; gap: 16px`
- `.diff-body-grid → grid-template-columns: 1fr; gap: 40px`
- `.stack-pill { width: 100% }`
- `.about-bridge-grid → grid-template-columns: 1fr; gap: 36px`
- `.about-portrait-wrap { justify-content: flex-start }`
- `.about-portrait → 200px × 200px`
- `.proof-cards → grid-template-columns: 1fr`
- `.proof-card → display: flex; flex-direction: column; padding: 36px 28px 32px; min-height: unset`
- `.proof-card p → flex: 1; margin-bottom: 28px`
- `.card-link → align-self: flex-start; margin-top: 0`
- `.cta-grid → grid-template-columns: 1fr; gap: 36px`
- `.cta-left .section-head → font-size: clamp(1.75rem, 6vw, 2.5rem)`
- `.footer-grid → grid-template-columns: 1fr 1fr; gap: 40px; padding-bottom: 40px`
- `.footer-grid > div:first-child → grid-column: 1 / -1`

### 9.3 640px — Mobile nav + spacing reductions

- `.site-nav { height: 56px }`
- `.nav-list { display: none }`
- `.nav-toggle { display: flex }`
- `.nav-drawer { display: block }`
- `.hero-h1 { font-size: clamp(2rem, 9vw, 2.75rem); letter-spacing: -0.02em }` (32px → 44px)
- `.hero-lead { font-size: 1rem; margin-bottom: 28px }`
- `.section-head { font-size: clamp(1.5rem, 7vw, 2.25rem) }`
- `.who-body p { font-size: 1rem }`
- `.diff-paras p { font-size: 1rem }`
- `.pull-quote p { font-size: 1.125rem }`
- `.pull-quote { padding-left: 20px }`
- `.proof-section .section-head { font-size: clamp(1.375rem, 6vw, 1.875rem) }`
- `.cta-left .section-head { font-size: clamp(1.625rem, 7vw, 2.25rem) }`

### 9.4 480px — Footer + small screen fixes

- `.footer-grid → grid-template-columns: 1fr; gap: 32px`
- `.footer-grid > div:first-child → grid-column: auto` (cancels 768px span-full)
- `.footer-bottom → flex-direction: column; align-items: flex-start; gap: 12px`
- `.proof-card { padding: 28px 20px 24px }`
- `.card-tag { top: 16px; right: 16px; font-size: 0.5625rem; padding: 5px 12px }`

### 9.5 H1 fluid type reference

| Viewport | Font-size value | Effective range |
|---|---|---|
| >900px | `var(--h1-size)` = 56px | Fixed (tweakable 32–80px) |
| ≤900px | `clamp(2.25rem, 7vw, 3.5rem)` | 36px → 56px |
| ≤640px | `clamp(2rem, 9vw, 2.75rem)` | 32px → 44px |

---

## 10. Page Structure and DOM Order

```
<html lang="en-GB">
<head>
  Google Fonts (Plus Jakarta Sans + Source Serif 4)
  Fontshare (Chillax 700)
  <style> ... all CSS ... </style>
</head>
<body>

  <a class="skip-link" href="#main-content">           ← skip nav, always first

  <nav class="site-nav" aria-label="Primary">          ← sticky top:0, z-index:200
    <a class="wordmark">
    <ul class="nav-list">                              ← desktop only
    <button class="nav-toggle" aria-expanded="false">  ← mobile only

  <nav class="nav-drawer" id="nav-drawer"              ← mobile only, sticky top:56px
       aria-hidden="true" aria-label="Mobile">

  <main id="main-content" tabindex="-1">

    ── Inside .wrap ──────────────────────────────────
    <section class="hero">
      <h1 class="hero-h1">
      <div class="hero-body">
        <div class="hero-intro">
          <p class="hero-lead">
          <a class="pill pill-cobalt">

    ── Full-bleed (no .wrap) ─────────────────────────
    <section class="who-section who-section--periwinkle">
      <div class="wrap">
        <div class="hero-diagnosis">   ← max-width 720px
          <p> × 2 (opacity 0.72)
          <p class="hero-diagnosis-close"> (opacity 1 !important)

    ── Inside .wrap ──────────────────────────────────
    <section class="diff-section">    ← "What I do"
      <div class="diff-body-grid">
        <div>
          <h2 class="section-head">
          <div class="diff-paras">
        <div class="svc-index">
          <span class="label">Services
          <a class="stack-pill"> × 5

    ── Full-bleed (no .wrap) ─────────────────────────
    <section class="who-section">     ← "How I work" (ochre tint)
      <div class="wrap">
        <div class="diff-body-grid">
          <div>
            <h2 class="section-head">
            <div class="diff-paras">
          <div>
            <span class="label stack-label">Engagement
            <a class="stack-pill"> × 3

    ── Inside .wrap ──────────────────────────────────
    <section class="about-section">
      <div class="about-bridge-grid">
        <div>
          <h2 class="section-head">About me
          <div class="diff-paras">
        <div class="about-portrait-wrap">
          <image-slot class="about-portrait">

    <section class="proof-section">   ← header only, inside .wrap
      <span class="label">Read the work
      <h2 class="section-head">
      <p> ← intro text, inline styles

    ── Full-bleed (no .wrap) ─────────────────────────
    <div class="proof-cards">
      <div class="proof-card proof-card-cobalt">
        <h3>The Edit AI
        <p>
        <a class="card-link">theeditai.co.uk ↗

      <div class="proof-card proof-card-periwinkle">
        <span class="card-tag card-tag-periwinkle">Every Tuesday
        <h3>The Substack
        <p>
        <a class="card-link">jasminaziz.substack.com ↗

    ── Inside .wrap ──────────────────────────────────
    <section class="cta-section">
      <div class="cta-grid">
        <div class="cta-left">
          <span class="label">Get in touch
          <h2 class="section-head">
          <div> (flex column, gap 16px)
            <a class="pill pill-cobalt">Get in touch →
            <a class="cta-email">hello@jasminaziz.co.uk

        <div class="cta-right">
          <p> (inline styles: 15px, opacity 0.65)
            inline links to services.html and about.html

  </main>

  <footer>
    <div class="wrap">
      <div class="footer-grid">
        <div>                          ← brand col (spans full-width ≤768px)
          <a class="footer-wordmark">Jasmin Aziz
          <span class="footer-tagline">
          <a class="footer-contact">hello@jasminaziz.co.uk

        <div>                          ← Navigation col
          <span class="footer-col-label">Navigation
          <ul class="footer-nav-list">
            Home / Services / About / Contact

        <div>                          ← Elsewhere col
          <span class="footer-col-label">Elsewhere
          <ul class="footer-nav-list">
            The Edit AI ↗ / Substack ↗ / LinkedIn ↗

      <div class="footer-bottom">
        <span class="footer-meta">© 2026 Jasmin Aziz
        <div class="footer-legal">
          <a class="footer-legal-link">Privacy
          <a class="footer-legal-link">Cookies
          <a class="footer-legal-link">Terms

  <script src="image-slot.js">
  React + ReactDOM + Babel (CDN, pinned integrity hashes)
  <script type="text/babel" src="tweaks-panel.jsx">
  <script type="text/babel"> TweaksApp (inline) </script>

</body>
```

---

## 11. Internal Navigation Paths

| Link text | href |
|---|---|
| Services (nav + footer) | `services.html` |
| About (nav + footer) | `about.html` |
| Contact (nav + footer) | `contact.html` |
| Home (footer) | `jasminaziz-homepage.html` |
| Privacy | `legal.html#privacy` |
| Cookies | `legal.html#cookies` |
| Terms | `legal.html#terms` |
| Communications audit | `services.html#audit` |
| Brand and positioning | `services.html#brand` |
| Campaign strategy and plan | `services.html#campaign` |
| Content and editorial system | `services.html#content` |
| AI fluency training | `services.html#ai-training` |
| Fractional | `services.html#fractional` |
| Advisory | `services.html#advisory` |
| One-off strategic input | `services.html#one-off-strategic-input` |
| Contact email | `mailto:hello@jasminaziz.co.uk` |

External (all `target="_blank" rel="noopener"` + `.sr-only` span):

| Link text | href |
|---|---|
| theeditai.co.uk ↗ | `https://www.theeditai.co.uk/` |
| jasminaziz.substack.com ↗ | `https://jasminaziz.substack.com` |
| LinkedIn ↗ | `https://www.linkedin.com/in/jasmin-r-aziz/` |

---

## 12. CSS Classes Defined But Not Rendered on Homepage

The following classes are in `v2.html`'s `<style>` block but not used in the homepage HTML — they are reserved for inner pages (`services.html`, `about.html`, etc.) or for variant layouts:

| Class | Purpose |
|---|---|
| `.who-grid` | 1fr 2fr label + body grid — used on inner pages |
| `.svc-pill` | Category nav pill with right-aligned price label |
| `.svc-price` | Price label inside `.svc-pill` |
| `.svc-index .label` | Label spacing rule for svc-index container |
| `.svc-wave` | 28px wave SVG separator |
| `.wave-sep` | 48px wave SVG separator |
| `.pull-quote` | Ochre-bordered italic block quote |
| `.section-rule` | Centred 200px ochre horizontal rule |
| `.who-body` | Body copy inside `.who-grid` |
| `.card-year` | Small year label above proof card h3 |
| `.stack-pill-active` | JS-applied active state on stack-pills |
| `.who-section--periwinkle` | Periwinkle band variant (used on homepage for diagnosis, may appear elsewhere) |

---

## 13. Inline Style Attributes on Homepage

These values are set via `style=""` in HTML and are not in the stylesheet — component-specific overrides that must not be broken:

| Element | Inline style |
|---|---|
| `section.diff-section .section-head` | `style="margin-bottom:18px;"` |
| `section.who-section .section-head` | `style="margin-bottom:18px;"` |
| `section.diff-section .svc-index .label` | `style="margin-bottom:18px;"` |
| `section.who-section .stack-label` | `style="margin-bottom:18px;"` |
| `section.about-section .diff-paras` | `style="margin-top:20px;"` |
| `section.proof-section .label` | `style="margin-bottom:16px;"` |
| `section.proof-section .section-head` | `style="font-size:1.875rem;"` |
| `section.proof-section intro <p>` | `style="font-size:1rem;line-height:1.6;opacity:0.68;margin-top:14px;margin-bottom:40px;max-width:520px;text-wrap:pretty;"` |
| `.cta-left .section-head` | `style="font-size:2.5rem;"` |
| `.cta-left .label` | `style="margin-bottom:20px;"` |
| `.cta-left` action row `<div>` | `style="margin-top:28px;display:flex;flex-direction:column;align-items:flex-start;gap:16px;"` |
| `.cta-right <p>` | `style="font-size:0.9375rem;line-height:1.65;opacity:0.65;text-wrap:pretty;"` |
| Inline links inside `.diff-paras`, `.cta-right` | `style="color:var(--cobalt);text-decoration:none;"` (Plus Jakarta Sans 600, 0.6875rem, 0.1em tracking, uppercase) |
