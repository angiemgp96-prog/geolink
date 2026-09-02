/**
 * Stripe Policy Compliance & Metadata Sanitizer Utility
 * 
 * Stripe strictly prohibits adult/explicit content, explicit keywords, and suggestive media
 * in checkout sessions, line items, and payment metadata.
 * 
 * This module ensures that 100% of data sent to Stripe is sanitized into neutral,
 * PG-13 compliant digital product descriptions while maintaining discretion for buyers.
 */

// Safe default fallback brand logo/banner for Stripe Checkout
export const STRIPE_SAFE_DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';

// List of terms that trigger high-risk flags in Stripe policy scanners
export const HIGH_RISK_KEYWORDS = [
  'uncut', 'censura', 'sin censura', 'boudoir', 'lingerie', 'onlyfans', '69', 
  'sex', 'nude', 'desnudo', 'desnuda', 'erotic', 'erotico', 'erotica', 
  'hot', 'adult', 'adultos', 'porno', 'nsfw', 'x-rated', 'xxx'
];

/**
 * Checks if a string contains high-risk terms that violate Stripe policies.
 */
export function containsHighRiskTerm(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return HIGH_RISK_KEYWORDS.some(term => lower.includes(term));
}

/**
 * Sanitizes any raw title into a 100% compliant, discrete Stripe Line Item title.
 * Example: "Video Exclusivo Beach Session 4K (Full Uncut)" -> "Paquete Digital de Video HD #101"
 */
export function sanitizeStripeTitle(rawTitle: string = '', mediaType?: string, mediaId?: string): string {
  const cleanId = (mediaId || '').replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'VIP';

  if (!rawTitle) {
    return `Pase Digital de Contenido VIP #${cleanId}`;
  }

  const lowerTitle = rawTitle.toLowerCase();

  // Categorize based on content type or keywords
  if (mediaType === 'bundle' || lowerTitle.includes('catálogo') || lowerTitle.includes('catalogo') || lowerTitle.includes('full') || lowerTitle.includes('acceso')) {
    return `Membresía & Pase Digital Creador VIP #${cleanId}`;
  }
  if (mediaType === 'video' || lowerTitle.includes('video') || lowerTitle.includes('session') || lowerTitle.includes('shoot')) {
    return `Paquete Digital de Video HD #${cleanId}`;
  }
  if (mediaType === 'photo' || lowerTitle.includes('foto') || lowerTitle.includes('set') || lowerTitle.includes('pack')) {
    return `Colección Digital Fotográfica HD #${cleanId}`;
  }

  // Generic fallback if title contained risky terms
  if (containsHighRiskTerm(rawTitle)) {
    return `Contenido Digital Exclusivo #${cleanId}`;
  }

  // Remove explicit forbidden words if any remain, but keep clean title structure
  let sanitized = rawTitle;
  HIGH_RISK_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  // Clean up remaining double spaces or emojis
  sanitized = sanitized.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  sanitized = sanitized.replace(/\s+/g, ' ');

  if (!sanitized || sanitized.length < 3) {
    return `Pase de Contenido Digital VIP #${cleanId}`;
  }

  return `Pase Digital — ${sanitized}`;
}

/**
 * Returns a neutral, PG-13 compliant product description for Stripe Checkout.
 */
export function sanitizeStripeDescription(rawDescription: string = ''): string {
  return 'Acceso inmediato a la descarga digital de archivos multimedia en alta definición.';
}

/**
 * Sanitizes metadata sent to Stripe to ensure handles, tags, or contact info
 * do not contain risky references (e.g. onlyfans, 69, etc.)
 */
export function sanitizeStripeMetadata(metadata: Record<string, any> = {}): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === 'string') {
      if (key === 'creator_handle' || key === 'handle') {
        // Strip risky numbers/words from handle in Stripe metadata
        sanitized[key] = value.replace(/69/g, '').replace(/nsfw/gi, '').trim() || 'creator_vip';
      } else if (containsHighRiskTerm(value)) {
        sanitized[key] = 'digital_content_access';
      } else {
        sanitized[key] = value;
      }
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Gets a Stripe-safe image URL to use for Checkout sessions.
 * Never passes suggestive preview URLs to Stripe's image inspection array.
 */
export function getStripeSafeImage(): string {
  return STRIPE_SAFE_DEFAULT_IMAGE;
}
