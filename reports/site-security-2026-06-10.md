# Site Security Audit - jasminaziz.co.uk
**Date:** 2026-06-10
**Auditor:** site-security agent (Claude Sonnet 4.6)
**Repo:** github.com/jasminaziz/jasmin-aziz (public)
**Stack:** Static HTML/CSS/JS, Vercel, Resend (api/contact.js serverless), Google Analytics 4
**Previous report:** None. First audit by this agent.

---

## Verdict

**Safe to ship with named fixes.**

No secrets are exposed in the working tree or in git history. The Resend API key is correctly held server-side in Vercel environment variables and never appears in any committed file. The fundamental secrets hygiene is sound.

Three findings require attention before this site can be considered fully hardened: (1) a missing Content Security Policy header, which is a should-fix rather than a blocker given the site's static nature; (2) unescaped user input rendered as raw HTML in the notification email, which creates a stored HTML injection risk in Jasmin's inbox; and (3) no honeypot or rate limiting on the contact form endpoint. None of these are critical for a five-page consultancy site at current scale, but all three should be addressed.

The tweaks-panel development tooling committed to the public repo and loaded on the live homepage is noted separately as a should-fix.

---

## Findings in Severity Order

---

### SHOULD FIX 1 - Unescaped user input in HTML email (api/contact.js, lines 67, 75, 79, 83, 87)

User-supplied values (name, organisation, email, message) are interpolated directly into an HTML template literal and sent as the HTML body of the notification email to hello@jasminaziz.co.uk. There is no HTML entity escaping applied before interpolation.

**Specific lines:**
- `api/contact.js:67` - `${message}` inside a `<p>` tag
- `api/contact.js:75` - `${name}` inside a `<p>` tag
- `api/contact.js:79` - `${organisation}` inside a `<p>` tag
- `api/contact.js:83` and `83` - `${email}` inside an `<a href="mailto:...">` and as link text

An attacker submitting a contact form with a payload such as `<img src=x onerror=alert(1)>` in the name or message field will have that payload delivered unescaped into an HTML email that Jasmin reads in her email client. Whether this executes depends on the email client's HTML rendering behaviour. Most modern clients (Gmail, Outlook) strip script tags but may still render injected images or styled content. The real risk here is crafted phishing content being injected into what appears to be a legitimate notification from Jasmin's own site.

The fix is to add an `escapeHtml` helper to `api/contact.js` that replaces `&`, `<`, `>`, `"`, and `'` with their HTML entities, and to apply it to all user-supplied values before they are placed into the HTML template. The plain-text email body is not affected because it uses string concatenation without HTML rendering.

**Supabase:** Not applicable - this project does not use Supabase.

---

### SHOULD FIX 2 - Content Security Policy absent (vercel.json)

`vercel.json` contains `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. It does not contain a `Content-Security-Policy` header.

The site loads resources from the following third-party origins:
- `https://fonts.googleapis.com` (stylesheet)
- `https://fonts.gstatic.com` (font files)
- `https://api.fontshare.com` (stylesheet and font files)
- `https://www.googletagmanager.com` (GA4 script)
- `https://www.google-analytics.com` (GA4 data endpoint, loaded by gtag.js at runtime)
- `https://unpkg.com` (React, ReactDOM, Babel Standalone - only on index.html)

Without a CSP, there is no browser-enforced control over which scripts and origins the page may load. A CSP would not prevent a determined attacker with write access to the repo, but it constrains the blast radius of any XSS vector.

The site uses inline `<script>` blocks for the nav toggle, form submission handler, and GA4 initialisation, meaning any CSP will require `'unsafe-inline'` for `script-src` unless those are refactored. This is a known constraint of the static HTML architecture and does reduce the XSS protection CSP provides. Even so, a CSP adds value by blocking unexpected external origins and providing a documented allow-list.

Note: `unpkg.com` is currently in the allow-list needed for `index.html`. See SHOULD FIX 3 for the separate finding on the presence of those scripts in production.

**Draft CSP for this site:**
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://unpkg.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com;
font-src 'self' https://fonts.gstatic.com https://api.fontshare.com;
img-src 'self' data: https:;
connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net;
frame-ancestors 'none'
```

`frame-ancestors 'none'` would supersede `X-Frame-Options: SAMEORIGIN`, which is itself a should-fix as noted below.

---

### SHOULD FIX 3 - Development tooling (tweaks panel and React/Babel CDN scripts) shipped to production (index.html, lines 339-372)

`index.html` loads three large scripts from `unpkg.com` in production:
- `react@18.3.1/umd/react.development.js` (the non-minified development build)
- `react-dom@18.3.1/umd/react-dom.development.js` (the non-minified development build)
- `@babel/standalone@7.29.0/babel.min.js`

These serve the `tweaks-panel.jsx` component, which is a visual design tool for adjusting H1 size and ochre tint. The panel is hidden by default (`if (!open) return null;` in `tweaks-panel.jsx:230`) and only opens when it receives a `__activate_edit_mode` postMessage from a parent frame. On the public live site it is not visible and cannot be activated by a visitor without sending that specific postMessage.

However, the concerns are:

1. The development builds of React and ReactDOM are substantially larger than their production counterparts and include verbose runtime warnings. This adds unnecessary payload to every homepage load.
2. Three large CDN scripts (`unpkg.com`) are loaded on the public homepage for a tool that has no function for real visitors. If `unpkg.com` ever served a compromised package (supply chain attack), every homepage visitor would execute it.
3. Even with SRI hashes present (which they are, correctly), `unpkg.com` is an additional origin that must be allow-listed in any future CSP, widening the attack surface unnecessarily.

The integrity hashes are present and correct on all three scripts (verified at lines 340-342). This mitigates the supply chain risk but does not eliminate the performance cost or the unnecessary origin exposure.

The fix is to either remove the tweaks panel from the production codebase entirely (the site's design is complete per STATUS.md) or to move these scripts behind an environment-gated block that does not load in production.

---

### SHOULD FIX 4 - X-Frame-Options set to SAMEORIGIN rather than DENY (vercel.json, line 15)

`vercel.json:15` sets `X-Frame-Options: SAMEORIGIN`. For a public consultancy site with no legitimate iframe-embedding use case, the correct value is `DENY`. `SAMEORIGIN` permits the page to be framed by pages served from the same origin, which provides no benefit here and offers marginally weaker clickjacking protection.

If a CSP is added with `frame-ancestors 'none'` (see SHOULD FIX 2), this header becomes redundant. The fix is either to change `SAMEORIGIN` to `DENY` now, or to replace `X-Frame-Options` entirely with `frame-ancestors 'none'` in the CSP.

---

### SHOULD FIX 5 - No honeypot field and no rate limiting on the contact form

The contact form at `contact.html` and its handler `api/contact.js` have no honeypot field and no rate limiting. Vercel serverless functions do not provide built-in rate limiting at the function level.

At current scale (a personal consultancy site), the practical risk is low: a bot could spam the form and trigger Resend API calls, potentially consuming the free-tier sending quota and filling Jasmin's inbox. The Resend free tier allows 100 emails per day; a targeted spam run could exhaust this.

A minimal fix without adding a third-party service is a hidden honeypot field: a form field that real users cannot see or fill in (hidden via CSS, not `type="hidden"`). If the server receives a non-empty value in that field, it returns 200 (to avoid leaking the honeypot's existence to bots) but skips sending. This catches naive bots that fill all fields.

Rate limiting requires either a Vercel Pro plan (which provides edge middleware) or an external service such as Upstash Redis with atomic counters. This is not a pre-launch blocker at current scale but should be added if the site receives meaningful traffic or targeted spam.

---

## Accepted Trade-offs

---

### ACCEPTED TRADE-OFF 1 - GA4 measurement ID (G-D9C6CMZ6L7) in public HTML source

The GA4 measurement ID is committed to all five HTML files and visible in the page source of the public GitHub repo. This is standard practice for GA4: the measurement ID is not a secret; it is designed to be public. It cannot be used to access GA4 data, which requires OAuth authentication. An attacker could theoretically send phantom events to the GA4 property using the Measurement Protocol, polluting analytics data, but this is a known and accepted limitation of GA4's architecture and not specific to this site.

**Residual risk:** GA4 data quality could be degraded by deliberate spam hits using the public measurement ID. Mitigation is available in GA4 admin (filters for known IP ranges, internal traffic definitions) but is not required at current scale.

---

### ACCEPTED TRADE-OFF 2 - Cookie-setting analytics without a consent banner (GA4)

The site uses Google Analytics 4, which sets `_ga` and `_ga_*` cookies and collects IP address and device data. The legal basis stated in `legal.html` is legitimate interests. No cookie consent banner is shown.

Under the UK's Privacy and Electronic Communications Regulations (PECR), analytics cookies that are not strictly necessary require either consent or an exemption. The ICO's current guidance permits relying on legitimate interests for analytics in some circumstances, but this is a contested area. The site discloses GA4 usage clearly in its cookie and privacy policies at `/legal`.

**Residual risk:** If ICO guidance tightens or the site is reviewed, the absence of a consent mechanism for GA4 cookies could require remediation. This is a compliance risk, not a technical security risk.

---

## Confirmed Clean

The following were checked and confirmed clean. Each is stated so because it was verified from the filesystem and git history, not assumed.

**Secrets in working tree:** No API keys, tokens, or credentials found in any committed file. Searched for patterns: `re_` (Resend), `AIzaSy` (Google), `sk-ant` (Anthropic), `eyJhbGci` (JWT), `supabase.co`, and generic assignment patterns. All clean.

**Secrets in git history:** Full history searched across all 65 commits. No `.env` file was ever committed. The `.env` and `.env.local` entries were absent from `.gitignore` in the initial commit (commit `f4c9f62`, 2026-06-06) and added in commit `1ff217a` (2026-06-07). Crucially, no `.env` file appeared in the repository tree at any point between those commits. The window of exposure existed in the `.gitignore` configuration, not in any actual committed secret. Clean.

**Resend API key handling:** `api/contact.js` reads the key exclusively from `process.env.RESEND_API_KEY` (line 115). The key is never hardcoded. In full git history of `api/contact.js` across three commits (fff7bb7, 37f3253, de53fc8), no key value appears. Clean.

**Variable name match:** `api/contact.js` references `process.env.RESEND_API_KEY`. The CLAUDE.md documents the key as `RESEND_API_KEY` in Vercel environment variables. Names match. The Vercel dashboard value cannot be verified from the filesystem; this is listed in the manual checklist below.

**VITE_ variable exposure:** Not applicable. This is a static HTML site with a serverless API function. There are no VITE_ variables; no build process compiles environment variables into a public bundle.

**Supabase:** Not applicable. This project does not use Supabase.

**Make.com:** Not applicable. This project does not use Make.com.

**SRI hashes on unpkg scripts:** Present and syntactically correct on all three scripts at `index.html:340-342`. (Note: the scripts themselves are still a should-fix per SHOULD FIX 3 above.)

**`.gitignore` coverage:** The current `.gitignore` includes `.env` and `.env.local`. The file also excludes `.vercel`, `.DS_Store`, `design-download.tar.gz`, `jasmin-aziz-design-system/`, `.claude/`, and `Fonts/`. Coverage is adequate.

**`www` canonical redirect:** Confirmed in `vercel.json:3-9`. The redirect uses a host condition matching `jasminaziz.co.uk` and issues a 301 to `https://www.jasminaziz.co.uk/$1`. This correctly canonicalises the non-www domain.

**Security headers present:** `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` are all present and correctly set. The absence of CSP and the SAMEORIGIN value for X-Frame-Options are noted as SHOULD FIX 2 and SHOULD FIX 4 above.

**Input validation in API handler:** Required fields (name, organisation, email, service) are validated server-side in `api/contact.js:133-144`. A basic email format regex is applied. Values are trimmed before use. Server-side validation is present and correct. The HTML injection gap noted in SHOULD FIX 1 is a rendering concern, not a validation gap.

**Service label lookup:** `api/contact.js:151` resolves the `service` field through a fixed lookup object before use, which prevents arbitrary service labels from being injected. If the submitted value is not in the lookup, the raw value is used as a fallback. This is acceptable given the field is a constrained dropdown on the client.

---

## Not Applicable

The following checklist items from the authority document do not apply to this project and are noted as such rather than silently omitted:

- **Supabase RLS** - not applicable, no Supabase
- **VITE_ variable exposure** - not applicable, no build tool or environment variable bundle
- **Make.com automation security** - not applicable, no Make.com
- **Google Sheets API key restriction** - not applicable, no Sheets integration
- **Anthropic API key** - not applicable, no Anthropic API in this project
- **Subscriber capture form** - not applicable, no subscriber form (only a contact form; data is not stored in a database)

---

## Manual Checklist

These items cannot be verified from the filesystem. Each includes the exact console location to check.

**1. Resend API key present and correctly named in Vercel**
Verify that an environment variable named exactly `RESEND_API_KEY` (no prefix) exists in the Vercel project for the Production environment. A mismatch or absence causes all contact form submissions to fail with a 502 silently.
Location: Vercel dashboard > Project "jasmin-aziz" > Settings > Environment Variables.

**2. Resend sending domain verified**
The `api/contact.js` sends from `contact@jasminaziz.co.uk` and `hello@jasminaziz.co.uk`. If the domain `jasminaziz.co.uk` is not verified in Resend, emails will fail or be rejected.
Location: Resend dashboard (resend.com/domains) > confirm jasminaziz.co.uk shows "Verified".

**3. Resend API key scope**
Confirm the Resend API key in Vercel has only "Sending access" and not "Full access". A key with full access can read other domains and email logs on the account.
Location: Resend dashboard > API Keys > check permission level of the key in use.

**4. Kill-switch list**
There is no documented kill-switch list in the repository. If the Resend API key is compromised, the steps are: (a) revoke the key in Resend dashboard > API Keys > Delete; (b) create a new key; (c) update `RESEND_API_KEY` in Vercel environment variables; (d) trigger a redeployment. Between revocation and redeploy, the contact form will return a 502 error. This sequence should be documented.
Location to document: any file in the repository root or in `tasks/`.

**5. GA4 data retention setting**
The legal page states Google Analytics retains event data for 14 months. Confirm this is set correctly and not the default 2 months.
Location: Google Analytics admin (analytics.google.com) > Admin > Property Settings > Data Settings > Data Retention > set to 14 months.

**6. GA4 IP anonymisation**
Confirm that IP anonymisation is enabled in GA4 (GA4 anonymises IPs by default in most regions, but this should be confirmed given the legal page's data processing statements).
Location: Google Analytics admin > Data Streams > Web stream for jasminaziz.co.uk > configure tag settings.

**7. Vercel project visibility**
Confirm the Vercel project is not set to expose source maps or build logs publicly. For a static site this is low risk, but worth checking.
Location: Vercel dashboard > Project settings > General > confirm no public source map exposure.

**8. GitHub repo - no secrets in Actions or repository settings**
The repo is public. Confirm no GitHub Actions secrets or repository variables are set that contain live credentials.
Location: GitHub > jasminaziz/jasmin-aziz > Settings > Secrets and variables > Actions.

**9. Cookie consent and PECR compliance review**
The site uses GA4 without a consent mechanism, relying on legitimate interests. The ICO has not definitively approved this approach for analytics cookies. Before significant audience growth, consider seeking a legal opinion or adding an optional consent mechanism.
Location: Review ICO guidance at ico.org.uk/for-organisations/guide-to-pecr/guidance-on-the-use-of-cookies-and-similar-technologies/.

---

## Proposed Learnings for Ratification

The following are proposed additions to `~/.claude/guides/website-build/LEARNINGS.md`. These are genuine observations from this audit, not speculation. Jasmin should ratify or reject each.

**Learning A**
- Date: 2026-06-10
- Agent: site-security
- What happened: A static HTML site with a serverless API function (Vercel) used template literal interpolation to embed user form input directly into an HTML email body without HTML entity escaping. The plain-text fallback was clean; only the HTML body was affected.
- Proposed rule: Any serverless function that builds an HTML email from user input must apply HTML entity escaping (`&`, `<`, `>`, `"`, `'`) to all user-supplied values before interpolation. This applies regardless of the downstream email client, because the notification email is an attack surface even though it is internal.
- Guide: the-edit-security-checklist.md, under "Forms and input" or a new "API handlers" section.

**Learning B**
- Date: 2026-06-10
- Agent: site-security
- What happened: A development-only visual tweaks panel (React, ReactDOM development builds, Babel Standalone) was committed to the public repository and loaded on the live production homepage. The panel is correctly hidden by default and requires a postMessage to activate. SRI hashes are present. However, the development builds add significant payload, `unpkg.com` is an additional CDN origin that must be CSP-allow-listed, and the tooling serves no visitor-facing purpose.
- Proposed rule: Before marking a site as production-complete, audit `index.html` (or equivalent entry point) for any script tags that serve only development or design tooling purposes. These should be removed from the production codebase or gated behind a build-time environment check. A "ship checklist" item: "Are all script tags in `<head>` and before `</body>` required by real visitors?"
- Guide: website-build-roadmap-lovable-stack.md, Phase 7 (pre-launch checklist) or the-edit-security-checklist.md.

**Learning C**
- Date: 2026-06-10
- Agent: site-security
- What happened: The `.gitignore` file in the initial commit did not include `.env` or `.env.local`. These were added one day later in a separate commit. No `.env` file was actually committed in the interim, so no exposure occurred. However, the window existed.
- Proposed rule: The initial commit of any new project must include `.env` and `.env.local` in `.gitignore` before any other files are added. This is already documented for Lovable projects in the-edit-security-checklist.md but should be stated explicitly for Claude Code projects too, since Claude Code will create files on disk before `.gitignore` is set if the project is scaffolded incrementally.
- Guide: the-edit-security-checklist.md, under "Env hygiene", adding a note that this applies to Claude Code builds as well as Lovable.

---

*End of report. No code was modified. No keys were rotated or revoked. The only file created was this report.*
