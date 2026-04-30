// src/lib/waLinks.js
// ─── WhatsApp number ────────────────────────────────────────
const WA_NUMBER = '6287848441575';

// ─── Template 1: Trial Class Inquiry ────────────────────────
const TRIAL_MSG = `Thank you for reaching out to Guru Nada to schedule a trial lesson. We have received your inquiry and are excited to help you begin your musical journey with us!

Our team will be in touch within one business day to finalize a schedule. Please provide these details:

*Student's Full Name:*

*Student's Age:*

*Instrument of Interest:*

*Any Previous Musical Experience:*
Yes / No
*) If yes, please mention the most recent exam grade or music lesson materials

*Your Preferred Day and Time for a Trial:*

Providing this information will allow us to prepare the best possible options for you.

We look forward to speaking with you soon!

Sincerely,
Guru Nada
www.gurunada.com`;

// ─── Template 2: Registration Follow-up ─────────────────────
const REGISTER_MSG = `REGISTRATION:

Thank you for your registration with Guru Nada. Your information has been received.

To complete your registration, please:

1. Sign the Parent Agreement: [Insert Link to Agreement]
2. Reply to this chat with your payment confirmation screenshot.

Our admin will process your registration and confirm your lesson schedule soon.

Thank you,
Guru Nada
www.gurunada.com`;

// ─── Exported links ──────────────────────────────────────────
export const WA_TRIAL    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(TRIAL_MSG)}`;
export const WA_REGISTER = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(REGISTER_MSG)}`;
