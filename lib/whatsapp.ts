/**
 * Single source of truth for the brand's WhatsApp contact.
 *
 * The number is stored in E.164 form without the leading `+` (as wa.me expects).
 * Local Egyptian form 01122742408 → international 20 1122742408.
 */
export const WHATSAPP_NUMBER = '201122742408';

/** Build a wa.me deep link with a pre-filled message. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
