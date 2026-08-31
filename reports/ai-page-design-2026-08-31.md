# AI page design audit — 2026-08-31

**Scope:** `ai.html` (route `/ai`) as it stands after today's two additions — The Edit paragraph in the intro lead, and the AI-use policy template link in the closing band.
**No prior design-check report exists for this page** — this is the first fidelity check against `.impeccable.md`, `jasminaziz-design-spec (1).md`, and the sitewide precedents in `services.html`, `about.html` and `site.css`. Nothing here is "persisting" or "corrected" from an earlier audit.

**Verdict: drifted in named places.** The page is faithful to the token system (every colour and family in its own `<style>` block resolves through `var()` — no hardcoded off-palette hex anywhere in `ai.html`'s own CSS) but has drifted structurally in the header composition and has one genuine token-fidelity failure that reaches production through an omission, not a wrong value. Neither is fatal; both are named below with the fix in spec terms.

---

## 1. The H1 area — concern confirmed, and the cause is today's edit

**What the code does.** `.ai-intro-grid` (`ai.html:35-40`) is a 5fr/4fr grid, `align-items: stretch`. `.ai-intro-head` (`ai.html:42-48`) is a flex column with `justify-content: space-between`. The comment above it (`ai.html:30-32`) states the intent plainly: *"The CTA anchors the foot of the left column so there is no void beneath the heading."*

That only works when the two columns are close in length. `align-items: stretch` forces the left column to match the right column's rendered height, and `space-between` then distributes whatever's left over as a single gap between the H1 and the pill. The size of that gap is not a fixed value — it's `(right-column height) − (H1 height) − (pill height)`. It has no ceiling.

**Why it's worse today than it was yesterday.** The lead column (`ai.html:302-307`) now runs four paragraphs, not three — SCRATCHPAD's D3 confirms the proof paragraph introducing The Edit was added today, after the "I use these tools every day" line. That paragraph added roughly a paragraph's worth of height to the right column and nothing to the left. Under `stretch` + `space-between`, every pixel of that growth becomes extra dead air between "AI, trust and communications" and the "Get in touch →" pill. The header didn't get sparser by accident today — it got sparser as a direct, mechanical consequence of the edit, because the layout couples the void's size to the lead copy's length.

The comment's claim ("no void beneath the heading") is now false on its own terms: there's no void *after* the pill, but there's a large one *between* the heading and its own call to action, which reads worse — the CTA no longer looks like it belongs to the H1, it looks like it landed near paragraph four on the right.

**The precedent this page claims to follow doesn't have this problem.** `services.html`'s `.svc-intro-grid` (`services.html:73-79`) is the same 5fr/4fr, 80px-gap header pattern — same family, same intent — but it uses `align-items: start`, not `stretch`, and it carries no CTA in the header column at all, so there's nothing to space-between. It simply lets the H1 column be shorter than the lead column and stop. That's the pattern `ai.html` should have inherited and didn't.

**The fix, in spec terms.** Two edits, both removals rather than additions, consistent with "solve constraints with type or space" (Design Principle 5):

- `ai.html:39` — `align-items: stretch` → `align-items: start`
- `ai.html:45` — `justify-content: space-between` → `justify-content: flex-start` (the existing `gap: 32px` on `ai.html:47` already does the job of holding the pill close to the H1 once the forced stretch is gone)

Effect: the pill sits a fixed 32px below the H1 regardless of how long the lead column runs. The left column ends up shorter than the right, which is normal editorial layout (a headline block sitting beside a longer paragraph is not itself a defect) rather than manufacturing an internal void. Update the stale rationale comment at `ai.html:30-32` to match once changed — it currently documents an intent the code no longer delivers.

**This is soft drift** — no named spec rule dictates header alignment behaviour — but it directly weakens the intent both the CSS comment and Jasmin state, and it has a same-page precedent (`services.html`) that already solves it correctly.

---

## 2. The Edit — the platforming concern is right, and there's an in-system component already built for it

**What the code does.** The Edit's only editorial mention on this page is a plain `<p>` in the lead column (`ai.html:306`): *"That judgement is public. I built and run [The Edit] ..."* — same font, same size, same paragraph rhythm as the three paragraphs around it. Visually it is indistinguishable from body copy. Jasmin's read is correct.

**A harder problem underneath the soft one.** There is no CSS rule anywhere in `ai.html` or `site.css` for an inline link inside body prose — no `.ai-lead a`, `.ai-body a`, or general `a` reset. That means the `<a href="https://theeditai.co.uk/">` at `ai.html:306` renders in the browser's default anchor colour (blue, underlined), not `var(--cobalt)`. This is a genuine **hard drift**: an off-palette colour reaching production, doing a job ("this is a link") the palette gives to cobalt everywhere else on the site — `.card-link`, `.cta-email`, `.ai-close-more`, `.find-link-arrow` are all consistently cobalt with a defined hover state. The same omission exists at `about.html:478` on the identical "I built and run The Edit" sentence, so this isn't new to today — it's a standing gap in the system that today's edit has now shipped a second instance of. Fix in spec terms: give inline body links `color: var(--cobalt); text-decoration: none` (matching `.ai-close-more`'s existing values at `ai.html:212-223`) at minimum, on both pages.

**The platforming fix already exists in the system — `about.html`'s `.find-link-row`.** `about.html:278-320` defines exactly the component this ask is for: a hairline-ruled row (`border-top/bottom: 1px solid var(--rule)`, the same token `.ai-room` already uses on this page at `ai.html:109`), a Chillax-bold name, a small serif/sans description, and a cobalt uppercase arrow (`Visit ↗`). It's live today at `about.html:513-517`, platforming The Edit and the Substack in exactly the register this page needs — distinct from prose, but built from tokens and rules the page already owns. No new colour, no new pill, no new component: reuse.

**Two achievable treatments, in order of how much they change:**

1. **Minimum (type/space only, no restructuring):** style the existing inline link cobalt (fixes the hard drift above) and set it off from the surrounding prose with a `.label`-style eyebrow above the paragraph plus the existing hairline rule — e.g. wrap the paragraph in a block with `border-top: 1px solid var(--rule); padding-top: 24px` (the identical values `.ai-room` already uses at `ai.html:110-111`) and an eyebrow using the existing `.label` class. This keeps the paragraph in its current reading position — respecting D3, which locked its placement "after the honesty line" today — while giving it a visible boundary the other three paragraphs don't have. Wording for the eyebrow is a copy decision, not mine to set; the container and rule are.

2. **Stronger (reuse `.find-link-row` wholesale):** lift The Edit out of the flowing paragraph entirely into a single `.find-link-row` instance directly under the intro grid, full width, before the governance section starts. This is the highest-impact option and it's zero-cost in design-system terms because the component, its states (`:hover`/`:active` at `about.html:296`) and its responsive collapse (`about.html:385-395`) are already built and already carry The Edit's name and framing once on this site. The trade-off: splitting one flowing sentence into a name + one-line description is a copy-structure decision (what goes in `.find-link-name` vs `.find-link-desc`), which sits with site-copywriter, not with me.

Recommend (2) if Jasmin wants the stronger visual break she's describing; (1) if the sentence must stay exactly as drafted today. Either clears the hard-drift link-colour issue as a side effect.

---

## 3. Briefer findings

**Visual rhythm and section pacing — mostly faithful.** The band sequence (cream intro → beige `.who-section` governance → cream `.ai-training` → periwinkle `.who-section--periwinkle` closing) correctly applies the ratified 18 June rule against stacking two tinted bands, and the comment at `ai.html:143-146` shows the builder knew why. No violation here — credit where due.

**Forbidden combination: periwinkle-on-its-own-tint in the closing band.** `.ai-close-head` (`ai.html:160-164`) sets `color: var(--periwinkle)` — the full accent value, not `--periwinkle-text` — and sits inside `.who-section--periwinkle` (`ai.html:371`), a band tinted `rgba(123,127,212,0.10)`, i.e. periwinkle heading text on periwinkle-tinted ground. The comment at `ai.html:152` claims this "mirrors the Services page closing beat," but it doesn't: `services.html`'s equivalent heading (`services.html:755`, same `color: var(--periwinkle)`) sits on plain, untinted `.how-section` (`services.html:273-276`, no background rule at all). The colour value is identical to the precedent; the background isn't. This is exactly the audit brief's named "accent colour on its own light tint" pattern, introduced here for the first time on the site. It's a small tint (10%) so the contrast cost is marginal, but it's a real, nameable deviation from the pattern the page claims to inherit. **Soft drift** — no locked numeric threshold is broken — but it's the kind of pattern-creep the forbidden-combinations rule exists to catch before it becomes precedent for the next page.

**Typographic hierarchy across the page's three section heads is inconsistent without a stated rule.** Governance H2 is fixed at 30px (`ai.html:83`); the training H2 runs up to 34px (`ai.html:147`); the closing H2 runs up to 36px (`ai.html:161`, matching the sitewide `.section-head` base at `site.css:313`). Three co-equal sections — governance, training, where-to-start — carry three different maximum sizes with no documented reason. Governance reads smallest of the three despite opening the page's substantive content. **Soft drift**, worth a rule (even an inline comment) if the variance is deliberate, or normalising to one size if it isn't.

**Closing band: two CTAs, not yet carried gracefully.** The band correctly avoids a second pill (per D3's locked decision and Design Principle 5) — that discipline is right. But the copy at `ai.html:377` frames the policy template as a real alternative to the call ("If a call feels early, start with the AI-use policy template instead"), while the markup buries that link third in a three-item stack of identical 11px uppercase links (`ai.html:384-388`) — indistinguishable in weight from the "read more about how I work" housekeeping link beside it. The design doesn't yet reflect the copy's own stated equivalence between the two paths. Fix in spec terms, no new tokens: reorder the template link to sit first in `.ai-close-smallprint`, directly under the pill, ahead of the email; optionally colour it `var(--cobalt)` via the existing `.ai-close-more` class (already applied to it) while leaving the email in the muted `--ink` default, so the page visually distinguishes "a second path forward" from "contact admin." **Soft drift** — spec doesn't mandate CTA-weighting rules — but it's a content/design mismatch worth closing before this page is called finished.

**No other palette, focus-state, or touch-target issues found.** Every colour in the page's own `<style>` block resolves through `var(--cobalt|--periwinkle|--ochre|--ink|--cream|--rule)` — no stray hex. `.pill-cobalt` states, focus rings, and 44px targets all match `site.css`'s locked values. Nav order matches the documented `Home · Services · AI · About · Contact`.

---

## Hard drift (spec/system violated) — fix first
1. Inline link colour omission (`ai.html:306`, mirrored at `about.html:478`) — off-palette default link colour reaching production. No CSS rule exists for body-copy inline links anywhere on the site.

## Soft drift (spec silent, intent weakened) — fix next
2. Header void, `.ai-intro-grid`/`.ai-intro-head` (`ai.html:35-48`) — today's copy growth exposed a structural coupling the page's own comment claims doesn't exist.
3. The Edit platforming — currently plain prose; `.find-link-row` (`about.html:278-320`) is the ready-made, zero-new-token fix.
4. Periwinkle-on-periwinkle-tint in the closing band (`ai.html:160-164` inside `ai.html:371`) — new instance of a named forbidden pattern, diverging from the precedent it claims to mirror.
5. Section-head size inconsistency across governance/training/closing (30px/34px/36px) with no stated rule.
6. Closing-band CTA weighting — copy claims equivalence between call and template; markup doesn't.

---

**The one-sentence point of view this page currently expresses:** a credible, text-led governance offer that undersells its own best piece of proof — The Edit sits in the copy as evidence but hasn't yet been given the visual confidence of a publication that built something and wants you to see it.
