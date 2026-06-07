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

  const serviceLabel = SERVICE_LABELS[service] || service;

  const emailBody = [
    `Name: ${name.trim()}`,
    `Organisation: ${organisation.trim()}`,
    `Email: ${email.trim()}`,
    `Enquiry type: ${serviceLabel}`,
    message && message.trim() ? `\nMessage:\n${message.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  let resendRes;
  try {
    resendRes = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Jasmin Aziz Site <contact@jasminaziz.co.uk>',
        to: ['hello@jasminaziz.co.uk'],
        reply_to: email.trim(),
        subject: `New enquiry — ${name.trim()}, ${organisation.trim()}`,
        text: emailBody,
      }),
    });
  } catch (err) {
    console.error('Resend network error:', err);
    return res.status(502).json({ error: 'Failed to send message. Please try again.' });
  }

  if (!resendRes.ok) {
    const body = await resendRes.json().catch(() => ({}));
    console.error('Resend API error:', resendRes.status, body);
    return res.status(502).json({ error: 'Failed to send message. Please try again.' });
  }

  return res.status(200).json({ ok: true });
};
