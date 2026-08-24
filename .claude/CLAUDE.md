# Jasmin Aziz Site — Claude Instructions

## Deployment
- GitHub: https://github.com/jasminaziz/jasmin-aziz (public)
- Production: https://jasminaziz.co.uk (custom domain, live 2026-06-07)
- Vercel alias: https://jasmin-aziz.vercel.app (also works)
- Static HTML/CSS/JS — no build step, no framework
- Push to main → automatic Vercel redeploy

## Key facts
- Homepage file is `index.html` (renamed from "jasminaziz-homepage v2.html")
- Fonts load from CDN — never reference the local Fonts/ directory
- Contact form wired to Resend via api/contact.js — branded HTML notification to hello@jasminaziz.co.uk and auto-reply to enquirer
- Analytics: NONE. Google Analytics was removed site-wide on 2026-08-22 and nothing installed in its place. The site sets no tracking cookies and shows no consent banner; the Legal page says so. Do not reinstate analytics without an explicit decision.
- Scroll-to-top: scroll-top.js loaded on all six pages; styles in site.css; hidden at ≥901px
- vercel.json: cleanUrls + non-www → www 301 redirect (host-matched) + security headers on all routes, including a Content-Security-Policy and X-Frame-Options: DENY (added 2026-08-22). CSP gotcha: Fontshare serves its stylesheet from api.fontshare.com but its font files from cdn.fontshare.com — font-src must name the cdn host or Chillax fails sitewide.
- .vercelignore: keeps project/reference files out of the deploy (`*.md`, `reports/`, `tasks/`, the build handover .html). Verified to apply to Git-based deploys. Anything non-site added to the repo MUST be covered by it — before this existed, STATUS.md, the design spec and two dev files were live and crawlable on production.
- Contact form option values are a two-file contract: `/contact#<value>` preselects via `preselectFromHash()` in contact.html, and `SERVICE_LABELS` in api/contact.js maps the same values to the enquiry-email label. Renaming an option means changing BOTH, or the notification email prints the raw value. After any change, re-check every `/contact#…` anchor against the option list.
- api/contact.js escapes user input (`escapeHtml`) before it enters the HTML notification email. Keep it that way. Still outstanding: honeypot and rate limiting.
- Internal links: all .html hrefs updated to clean URL paths (/services, /about, /contact, /legal, /)
- SEO: complete — meta titles, descriptions, canonical tags, og:url, JSON-LD, robots.txt, sitemap.xml, llms.txt all done and pushed
- AEO: complete — Person schema enhanced (description, knowsAbout, hasOccupation) on index.html; FAQPage + Service schemas on services.html
- 404 page: 404.html in project root — branded, Chillax heading, 30s auto-redirect to /
- CSS architecture: three files. `site.css` — shared styles (nav, footer, tokens, body, scroll-top, who-section, pills). `homepage.css` — homepage-only components (hero, hero-grid, diff, proof cards, stack pills, etc.); also overrides `--sv: clamp(44px, 7vw, 76px)` and adds `--h1-size: 68px`. `index.html` loads both in order. Inner pages load `site.css` only. `services.html` has its own inline `<style>` block for page-specific components — new services CSS goes there, never in site.css.
- Hero portrait: `<picture>` element in `.hero-portrait-wrap`. Desktop/tablet source: `assets/jasmin-headshot.png` (portrait, 3/4 oval, border-radius: 999px). Mobile source (≤640px): `assets/jasmin-headshot-landscape.jpg` (landscape, 3/2 capsule, object-position: center). Hero is a 2-col grid (`1fr 300px` desktop, `1fr 240px` ≤768px, flex-column at ≤640px).
- Services page structure: each `.svc-block-body` has three direct grid children — `.svc-main-col` (copy + right-for, `grid-row: 1/-1` on desktop), `<blockquote class="pull-quote svc-pull-quote">` (sidebar row 1), `.svc-sidebar-cta` (sidebar row 2, contains `.svc-illus-slot` + CTA pill). On mobile, CSS `order` resequences: pull-quote (1) → main copy (2) → CTA (3).
- About-bridge section (index.html) is text-only — portrait was relocated to the hero. Do not add an image back here.
- `--ink-muted` (#706D68) is calibrated for ink at 45% opacity only. Body copy uses `color: var(--ink)` directly. Do not use `--ink-muted` as a general muted text token — it is lighter than 68–76% opacity muting and will look wrong on body copy.
- Services architecture rebuild: `services-descent` branch (2026-06-18), unmerged and STALE — do not merge as-is (see warning below). Four moves: (1) entry CTA after intro, (2) audit "Start here" with periwinkle accent, (3) shapes heading parity (tier-title class, Fractional/Advisory/Per project in anchor bar), (4) periwinkle closing band on How an engagement starts.
- Reports (now committed, and .vercelignore'd so they never deploy): `reports/site-security-2026-06-10.md` and `reports/site-stranger-2026-06-15.md`. Read the security one before any security-related work. Status as of 2026-08-22: escapeHtml, CSP and X-Frame-Options DENY are DONE; the unpkg/tweaks-panel finding is closed by deletion; both "accepted trade-offs" are retired with GA4. Only honeypot + rate limiting remain open. Stranger audit still live on three points: the fractional definition sits ~1,800 words into Services, the Fractional shape block has no "Right for" component, and Campaign copy names deliverables not outcomes — note its proposed fix (extend the homepage hero lead) is ruled out, the hero does not change.
- **`services-descent` merge warning (2026-08-24).** The branch predates the AI page, the GA4 removal and the security fixes. Merging it as-is would (a) delete `ai.html` entirely and (b) re-narrow `index.html:153` — its version reads "across hospitality, fundraising, early years, wellness, events, and cultural programming, inside charity, heritage, and third-sector organisations", which is narrower than what is live and would silently undo any buyer-definition widening. Rebase onto main and take only the four services moves; never fast-forward or merge the whole branch.
- AI page: `/ai` (ai.html) — "AI, trust and communications". LIVE on main since 2026-08-22. It was rebased off services-descent onto main and shipped independently; services-descent remains unmerged and unrelated.
- Nav order (all pages): Home · Services · AI · About · Contact.
- Career length is **nine years**, corrected and deployed 2026-08-24 in `about.html:7`, `about.html:476` and `llms.txt:10`. It previously read "eight", which was accurate when written on 2026-06-06.
- **Self-updating facts need revalidation, not inheritance.** "Nine years", the "six years" on the multi-site community organisation engagement, and any "most recently" claim all drift with time. The years count was written 2026-06-06, was correct then, and went stale across fourteen months and three agent audits — none of which check facts about Jasmin, only code and copy quality. Re-confirm these with her at each wrap; never carry them forward unasked.
- Services item 05 slimmed to a pointer block linking to `/ai` (kept `id="ai-training"` so existing anchors resolve).
- About: one sentence added to the Background paragraph on Jewish communal career background — the only such reference on the site; rest of the site (including the AI page) stays sector-neutral.
- Design rule: never stack two tinted `.who-section` bands directly adjacent — their wave pseudo-elements smear at the shared seam. Always separate tinted bands with a cream section (see ai.html: cream → beige → cream → periwinkle).
- See SCRATCHPAD.md for current status and next steps
- See tasks/lessons.md for corrections from previous sessions

## Design Context

### Users
Potential clients — decision-makers at organisations that hold sensitive data and answer to a board. Charity, cultural and heritage organisations are one instance of that shape, not the definition of it. **This repo is public: the named target sectors and the commercial rationale are deliberately not recorded here. They are in `~/AI Work/memory/decisions.md`, 2026-08-24 entry — read it before any positioning or copy work.** They arrive mid-decision — vetting, not browsing — assessing whether Jasmin understands their world and whether they'd want to work with her. Job to be done: form a confident "yes, let's talk", or rule her out efficiently. (Buyer definition widened 2026-08-24; previously "charity and purpose-led organisations".)

### Sector language rule (2026-08-24)
Charity/heritage/third-sector language on this site does one of two jobs. They are not the same job.

- **CREDENTIAL** — named sector experience, nine years, proof she has actually done the work. This earns trust and it stays. Removing it makes the site weaker, not wider.
- **GATE** — service definitions scoped to charities, present-tense audience statements naming only the third sector, examples citing one kind of organisation. This costs buyers who share the problem.

The same words do either job depending on where they sit. Rules of thumb: past tense, or labelled "Background", is usually credential; present-tense scoping of the practice is usually a gate. Widen where the site defines the *problem*; do not widen where it names *who she has worked for*, because there is no non-charity client evidence yet. Full instance-by-instance inventory: session 2026-08-24.

### Brand Personality
**Grounded. Rigorous. Human.** Credibility is the foundation; warmth is the differentiator.

### Aesthetic Direction
Reference: personal brand / thought leader (Anne-Laure Le Cunff, Tiago Forte). Typographically confident, intellectually engaged, warm without being casual.

Anti-references: generic agency/template, corporate/buttoned-up, startup/tech-bro, overly personal/informal.

### Design Principles
1. **Credibility before charm.** Expertise and substance first; warmth softens, never leads.
2. **Editorial over decorative.** Typography does the heavy lifting — contrast, weight, spacing before adding visuals.
3. **No templates, no defaults.** Every component should feel considered, not borrowed wholesale.
4. **Accessible by default.** WCAG AA is the floor. Pre-blended text tokens always (--ink-muted, --ochre-text, --periwinkle-text). Never opacity on text. 44px touch targets. Reduced motion support.
5. **Restrained palette, deliberate usage.** Cobalt = action. Ochre = warmth/attention. Periwinkle = secondary emphasis. No new colours. Solve constraints with type or space.
