# Jasmin Aziz — Design System Instructions

## Working File
The canonical homepage is `jasminaziz-homepage v2.html`. Always iterate this file.
`jasminaziz-homepage ORIGINAL.html` is a frozen reference — do not edit it.

## Site Pages
- `jasminaziz-homepage v2.html` — Homepage (canonical working file)
- `services.html` — Services
- `about.html` — About
- `contact.html` — Contact
- `legal.html` — Privacy / Cookies / Terms

All pages share the same nav, footer, grain overlay, and token system.

## Mobile-First Mandate
Every UI iteration must be fully responsive. This is non-negotiable.

**Breakpoints:**
- `900px` — H1 type scale reduction
- `768px` — All 2-col grids collapse to 1-col; proof cards stack
- `640px` — Hamburger nav (56px height); reduced section/hero padding
- `480px` — Footer single column; footer-bottom stacks vertically

**Layout tokens — always use these, never hardcode px gutters or section padding:**
```css
--gutter: clamp(20px, 5vw, 56px);   /* horizontal container padding — 20px@390px → 56px@1120px+ */
--sv:     clamp(44px, 7vw, 76px);   /* section vertical padding */
```

**Container:**
```css
.wrap { max-width: 1140px; margin: 0 auto; padding: 0 var(--gutter); }
```

**Touch targets:**
- All `<a>` and `<button>` elements: `min-height: 44px`
- `.svc-pill`, `.stack-pill`: `min-height: 48px`
- Every hover state must have a matching `:active` state for touch feedback

**Nav:**
- Desktop (>640px): inline pill links in cobalt bar, 64px height
- Mobile (≤640px): hamburger button + slide-down drawer, 56px height
- Drawer: `max-height: 0 → 240px` transition, sticky at `top: 56px`

**Never use:**
- `white-space: nowrap` on pill links that contain long strings
- Hardcoded `padding` in inline `style=""` attributes on sections (not overridable by media queries)
- Fixed pixel gutters like `padding: 0 56px` — use `var(--gutter)` instead

## Brand & Palette
```
--cobalt:     #2D35C9   primary brand, nav, CTAs
--periwinkle: #7B7FD4   secondary, labels, stack pills
--ochre:      #C99A2C   accent, pricing, left borders
--ink:        #14110D   all body text
--cream:      #FAF8F4   page background
```

**Accessible text tokens — always use these, never use CSS opacity to mute text:**
```
--periwinkle-text: #5255B5   5.5:1 on cream
--ochre-text:      #7A5C0C   5.4:1 on cream
--ink-muted:       #706D68   4.8:1 on cream
--cream-muted:     #A5A09A   7.4:1 on ink
--rule:            rgba(20,17,13,0.09)   hairline borders on cream
```

## Typography
- **Display / headings:** Chillax 700 (`font-family: 'Chillax', 'Helvetica Neue', sans-serif`)
- **UI / labels / pills:** Plus Jakarta Sans 500–600
- **Body / long-form:** Source Serif 4 400
- H1 is always Chillax Bold, fluid via `clamp()`. Minimum 32px on mobile.
- Body text minimum 16px on mobile. Never smaller.
- Section heads: `clamp(24px, 7vw, 36px)` on mobile.

## Component Patterns
- **`.who-grid`** (1fr 2fr label+body): label col disappears at ≤768px; label renders above body in DOM order
- **`.diff-body-grid`** (1fr 1fr copy+pills): collapses to 1-col at ≤768px
- **`.proof-cards`**: full-bleed (no `.wrap`), 2-col desktop, 1-col mobile
- **`.footer-grid`** (2fr 1fr 1fr): brand spans full width at ≤768px, all 1-col at ≤480px
- **`.pill`**: `min-height: 44px`, `:active` matches `:hover`
- **`.stack-pill`**: `border: 1px solid rgba(123,127,212,0.3)`, hover fills cobalt
- **`.who-section`**: ochre-tinted band with SVG wave pseudo-elements (48px, top + bottom)
- **`.who-section--periwinkle`**: periwinkle-tinted variant, same wave treatment

## Aesthetic Rules
- Grain overlay: always present as `body::after` pseudo-element, `opacity: 0.035`
- Wave section separators: SVG mask pseudo-elements on `.who-section`
- No emoji. No rounded-corner accent-border containers. No gradient backgrounds.
- Ochre left borders for pull quotes and pricing callouts only.
- Bold Chillax numbers as editorial decoration where used.

## Claude Code Handoff Note
A full handoff package lives in `handoff/`. It contains:
- `jasminaziz-homepage v2.html` — design reference
- `README.md` — complete pixel spec (every colour, font size, spacing, grid, breakpoint, interaction, ARIA)
- `assets/` — all images including portrait
- `image-slot.js` — drag-drop image web component
- `screenshots/` — rendered reference screenshot

Before handing to Claude Code: download the `handoff/` folder as a zip and upload it. Tell Claude Code: *"Implement `jasminaziz-homepage v2.html` pixel-perfectly. Use README.md as the spec."*

The CSS component documentation block at the top of v2 also serves as an inline spec.
