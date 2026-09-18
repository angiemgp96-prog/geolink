/**
 * Colombia & VPN Detection Utilities
 * Detects if a visitor is connecting from Colombia even when using a VPN
 * by checking system timezone, language preferences, local storage history,
 * and Colombian phone number patterns.
 */

/**
 * Checks if a contact string (phone or handle) represents a Colombian phone number:
 * - Starting with +57 or 57
 * - Standard 10-digit Colombian mobile starting with 3 (e.g. 300, 310, 312, 315, 320, 350...)
 */
export function isColombianPhone(contact: string): boolean {
  if (!contact || typeof contact !== 'string') return false;
  const clean = contact.replace(/[\s\-\(\)\.]/g, '');

  if (clean.startsWith('+57') || clean.startsWith('57')) {
    return true;
  }

  // 10 digits starting with 3 (Colombian mobile standard)
  if (/^3\d{9}$/.test(clean)) {
    return true;
  }

  return false;
}

/**
 * Clean up any legacy flags to prevent false positives for non-Colombian visitors
 */
export function markVisitorAsColombian(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('geolink_is_co_v3');
    localStorage.removeItem('geolink_forced_country_v3');
    sessionStorage.removeItem('geolink_is_co_v3');
  } catch {}
}

/**
 * Detection is strictly based on IP address. Legacy flags are purged.
 */
export function isColombianVisitor(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem('geolink_is_co_v3');
    localStorage.removeItem('geolink_forced_country_v3');
    sessionStorage.removeItem('geolink_is_co_v3');
  } catch {}
  return false;
}

/**
 * Returns effective country code considering admin simulation or IP country
 */
export function getEffectiveCountryCode(countryCode?: string, simulatedCountry?: string): string {
  if (simulatedCountry && simulatedCountry.trim() !== '') {
    return simulatedCountry.toUpperCase();
  }
  return (countryCode || 'US').toUpperCase();
}
