// api/contact.js
// Vercel serverless function — receives the contact form POST, sends via Resend.
// Requires RESEND_API_KEY in Vercel environment variables.
// The sending domain (jasminaziz.co.uk) must be verified in your Resend account.

const RESEND_API = 'https://api.resend.com/emails';

const SERVICE_LABELS = {
  audit: 'Communications audit',
  brand: 'Brand and positioning',
  campaign: 'Campaign strategy and plan',
  content: 'Content and editorial system',
  'ai-training': 'AI fluency training',
  'senior-comms-capacity': 'Senior comms capacity',
  advisory: 'Advisory',
  'one-off-strategic-input': 'One-off strategic input',
  unsure: "I'm not sure yet",
};

// Shared HTML wrapper — cream background, cobalt accent bar, branded footer
function brandedHtml(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en-GB">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF8F4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4;">
    <tr><td align="center" style="padding:48px 20px;">
      <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Wordmark -->
        <tr><td style="padding-bottom:28px;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#14110D;">Jasmin Aziz</span>
        </td></tr>

        <!-- Cobalt rule + body -->
        <tr><td style="border-top:2px solid #2D35C9;padding-top:28px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:#14110D;">
          ${bodyHtml}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:36px;border-top:1px solid #E0DDD8;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#706D68;line-height:1.6;">
            Strategic communications &amp; AI fluency &nbsp;&middot;&nbsp;
            <a href="https://jasminaziz.co.uk" style="color:#706D68;text-decoration:none;">jasminaziz.co.uk</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function notificationHtml({ name, organisation, email, serviceLabel, message }) {
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

function autoReplyHtml(name) {
  const body = `
    <p style="margin:0 0 20px;">Thank you for getting in touch.</p>
    <p style="margin:0 0 20px;">I&rsquo;ve received your message and will reply within two working days. If it looks like a good fit, we&rsquo;ll book a discovery call from there.</p>
    <p style="margin:0 0 20px;">In the meantime, you might enjoy
      <a href="https://jasminaziz.substack.com" style="color:#2D35C9;text-decoration:none;">reading my newsletter</a>
      or
      <a href="https://www.theeditai.co.uk" style="color:#2D35C9;text-decoration:none;">exploring The Edit AI</a>,
      my resource for AI fluency in the charity sector.</p>
    <p style="margin:0 0 32px;">And if we&rsquo;re not already connected,
      <a href="https://www.linkedin.com/in/jasmin-r-aziz/" style="color:#2D35C9;text-decoration:none;">let&rsquo;s connect on LinkedIn</a>.</p>
    <p style="margin:0;">Jasmin</p>`;

  return brandedHtml(body);
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

  // Validate required fields
  const missing = ['name', 'organisation', 'email', 'service'].filter(
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
  const org = organisation.trim();
  const em = email.trim();
  const msg = message ? message.trim() : '';
  const serviceLabel = SERVICE_LABELS[service] || service;

  // Plain-text fallback for the notification
  const plainText = [
    `Name: ${n}`,
    `Organisation: ${org}`,
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
      subject: `New enquiry \u2014 ${n}, ${org}`,
      text: plainText,
      html: notificationHtml({ name: n, organisation: org, email: em, serviceLabel, message: msg }),
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
      subject: 'Thanks for getting in touch \u2014 Jasmin Aziz',
      text: `Thank you for getting in touch.\n\nI've received your message and will reply within two working days. If it looks like a good fit, we'll book a discovery call from there.\n\nIn the meantime, you might enjoy reading my newsletter (https://jasminaziz.substack.com) or exploring The Edit AI (https://www.theeditai.co.uk), my resource for AI fluency in the charity sector.\n\nAnd if we're not already connected, let's connect on LinkedIn (https://www.linkedin.com/in/jasmin-r-aziz/).\n\nJasmin`,
      html: autoReplyHtml(n),
    });
  } catch (err) {
    console.error('Auto-reply send failed:', err.status, err.body);
    // Do not surface this to the user — their enquiry was captured
  }

  return res.status(200).json({ ok: true });
};
