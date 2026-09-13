// api/contact.js
// Vercel serverless function — receives the contact form POST, sends via Resend.
// Requires RESEND_API_KEY in Vercel environment variables.
// The sending domain (jasminaziz.co.uk) must be verified in your Resend account.

const RESEND_API = 'https://api.resend.com/emails';

const SERVICE_LABELS = {
  audit: 'Communications audit',
  ai: 'AI, trust and communications',
  'geo-audit': 'GEO audit',
  brand: 'Brand and positioning',
  campaign: 'Campaign strategy and plan',
  content: 'Content and editorial system',
  fractional: 'Fractional senior capacity',
  advisory: 'Advisory',
  'per-project': 'Per project',
  unsure: "I'm not sure yet",
};

// Escape user-supplied values before they are placed into an HTML email body.
// Without this, a crafted name/organisation/message is delivered as live markup
// into the notification email. The plain-text body needs no escaping.
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Shared HTML wrapper — cream background, cobalt accent bar, branded footer.
// The auto-reply passes showHeader = false: its signature carries the name instead.
function brandedHtml(bodyHtml, showHeader = true) {
  const header = showHeader
    ? `<!-- Header -->
        <tr><td style="padding-bottom:28px;">
          <p style="margin:0 0 4px;font-family:'Chillax',Arial,Helvetica,sans-serif;font-weight:700;font-size:28px;letter-spacing:-0.02em;color:#14110D;">Jasmin Aziz</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#706D68;letter-spacing:0.04em;">Strategic comms, AI built in.</p>
        </td></tr>`
    : '';
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @import url('https://api.fontshare.com/v2/css?f[]=chillax@700&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:#FAF8F4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;">
    <tr><td align="center" style="padding:48px 20px 0;">
      <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        ${header}

        <!-- Cobalt rule + body -->
        <tr><td style="border-top:2px solid #2D35C9;padding-top:28px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#14110D;">
          ${bodyHtml}
        </td></tr>

      </table>
    </td></tr>

    <!-- Footer — full-width cobalt bar -->
    <tr><td align="center" style="padding-top:40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#2D35C9;">
        <tr><td align="center" style="padding:16px 20px;">
          <a href="https://jasminaziz.co.uk" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.06em;color:#FAF8F4;text-decoration:none;">jasminaziz.co.uk</a>
        </td></tr>
      </table>
    </td></tr>

  </table>
</body>
</html>`;
}

function notificationHtml(fields) {
  const name = escapeHtml(fields.name);
  const organisation = escapeHtml(fields.organisation);
  const email = escapeHtml(fields.email);
  const serviceLabel = escapeHtml(fields.serviceLabel);
  const message = escapeHtml(fields.message);

  const messageBlock = message
    ? `<tr><td style="padding-top:20px;">
        <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#706D68;">Message</p>
        <p style="margin:0;white-space:pre-wrap;">${message}</p>
       </td></tr>`
    : '';

  const body = `
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr><td style="padding-bottom:20px;">
        <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#706D68;">Name</p>
        <p style="margin:0;">${name}</p>
      </td></tr>
      <tr><td style="padding-bottom:20px;">
        <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#706D68;">Organisation</p>
        <p style="margin:0;">${organisation}</p>
      </td></tr>
      <tr><td style="padding-bottom:20px;">
        <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#706D68;">Email</p>
        <p style="margin:0;"><a href="mailto:${email}" style="color:#2D35C9;text-decoration:none;">${email}</a></p>
      </td></tr>
      <tr><td style="padding-bottom:20px;">
        <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#706D68;">Enquiry type</p>
        <p style="margin:0;">${serviceLabel}</p>
      </td></tr>
      ${messageBlock}
    </table>`;

  return brandedHtml(body);
}

// The greeting uses the first word of the name only when it is purely letters
// (hyphens and apostrophes allowed), so the form cannot be used to put a link or
// other text into an email sent from this domain to a stranger. Anything else,
// including a title such as "Dr", falls back to a plain "Hi,".
const TITLES = ['dr', 'mr', 'mrs', 'ms', 'miss', 'mx', 'prof', 'rev', 'sir'];
function greeting(name) {
  const first = String(name || '').trim().split(/\s+/)[0] || '';
  const isName = /^[\p{L}'’-]{1,30}$/u.test(first) && !TITLES.includes(first.toLowerCase());
  return isName ? `Hi ${first.charAt(0).toUpperCase()}${first.slice(1)},` : 'Hi,';
}

// Email signature (design spec 7.14). The name and subline are a PNG so Chillax
// shows in every inbox; the links stay live text. The cream PNG matches this
// email's background. A changed image gets a new filename, never an overwrite.
const SIG_DOT = '<span style="color:#706D68;">&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>';
const SIGNATURE_HTML = `
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr><td style="padding:0 0 10px;"><img src="https://www.jasminaziz.co.uk/assets/email-signature-cream-2026-09.png" width="300" height="60" alt="Jasmin Aziz, strategic marketing, communications and AI" style="display:block;border:0;width:300px;height:60px;"></td></tr>
      <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;line-height:1.4;">
        <a href="https://www.jasminaziz.co.uk" style="color:#2D35C9;text-decoration:none;">jasminaziz.co.uk</a>${SIG_DOT}<a href="https://theeditai.co.uk" style="color:#2D35C9;text-decoration:none;">The Edit</a>${SIG_DOT}<a href="https://www.linkedin.com/in/jasmin-r-aziz/" style="color:#2D35C9;text-decoration:none;">LinkedIn</a>
      </td></tr>
    </table>`;

function autoReplyHtml(name) {
  const body = `
    <p style="margin:0 0 20px;">${escapeHtml(greeting(name))}</p>
    <p style="margin:0 0 20px;">Thank you for your message. I&rsquo;ll reply within two working days.</p>
    <p style="margin:0 0 20px;">From there, we&rsquo;ll usually book a discovery call. It&rsquo;s a chance to talk through what you&rsquo;re working on and whether I&rsquo;m the right person to help. If there&rsquo;s anything else I should know, just send it my way.</p>
    <p style="margin:0 0 32px;">In the meantime, feel free to explore
      <a href="https://theeditai.co.uk" style="color:#2D35C9;text-decoration:none;">The Edit</a>,
      the AI tools directory I built for charity, cultural and heritage comms teams. I also write on
      <a href="https://jasminaziz.substack.com" style="color:#2D35C9;text-decoration:none;">my Substack</a>
      about strategy, communications and where AI fits.</p>
    <p style="margin:0 0 16px;">Speak soon,</p>
    ${SIGNATURE_HTML}`;

  return brandedHtml(body, false);
}

async function send(payload) {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error('Resend error'), { status: res.status, body });
  }
  return res;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, organisation, email, service, message } = req.body || {};

  // Validate required fields (organisation is optional)
  const missing = ['name', 'email', 'service'].filter(
    (f) => !req.body[f] || !String(req.body[f]).trim()
  );
  if (missing.length) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const n = name.trim();
  const org = organisation ? String(organisation).trim() : '';
  const em = email.trim();
  const msg = message ? message.trim() : '';
  const serviceLabel = SERVICE_LABELS[service] || service;

  // Plain-text fallback for the notification
  const plainText = [
    `Name: ${n}`,
    `Organisation: ${org || 'Not given'}`,
    `Email: ${em}`,
    `Enquiry type: ${serviceLabel}`,
    msg ? `\nMessage:\n${msg}` : '',
  ].filter(Boolean).join('\n');

  // 1. Notification to Jasmin
  try {
    await send({
      from: 'Jasmin Aziz Site <contact@jasminaziz.co.uk>',
      to: ['hello@jasminaziz.co.uk'],
      reply_to: em,
      subject: `New enquiry \u2014 ${n}${org ? `, ${org}` : ''}`,
      text: plainText,
      html: notificationHtml({ name: n, organisation: org || 'Not given', email: em, serviceLabel, message: msg }),
    });
  } catch (err) {
    console.error('Notification send failed:', err.status, err.body);
    return res.status(502).json({ error: 'Failed to send message. Please try again.' });
  }

  // 2. Auto-reply to enquirer — non-critical; log failure but still return success
  try {
    await send({
      from: 'Jasmin Aziz <hello@jasminaziz.co.uk>',
      to: [em],
      subject: 'Thanks for getting in touch',
      text: `${greeting(n)}\n\nThank you for your message. I'll reply within two working days.\n\nFrom there, we'll usually book a discovery call. It's a chance to talk through what you're working on and whether I'm the right person to help. If there's anything else I should know, just send it my way.\n\nIn the meantime, feel free to explore The Edit (https://theeditai.co.uk), the AI tools directory I built for charity, cultural and heritage comms teams. I also write on my Substack (https://jasminaziz.substack.com) about strategy, communications and where AI fits.\n\nSpeak soon,\n\nJasmin Aziz\nStrategic marketing, communications & AI\nhttps://www.jasminaziz.co.uk`,
      html: autoReplyHtml(n),
    });
  } catch (err) {
    console.error('Auto-reply send failed:', err.status, err.body);
    // Do not surface this to the user — their enquiry was captured
  }

  return res.status(200).json({ ok: true });
};
