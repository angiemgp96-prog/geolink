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
 * Permanently marks the current device/browser as a Colombian visitor in localStorage.
 * Once marked, subsequent visits stay locked to Colombia even if the user activates a VPN.
 */
export function markVisitorAsColombian(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('geolink_is_colombia', 'true');
    localStorage.setItem('geolink_forced_country', 'CO');
    sessionStorage.setItem('geolink_is_colombia', 'true');
  } catch {}
}

/**
 * Detects if the current visitor is Colombian, bypassing foreign VPN IP addresses.
 * A VPN only proxies network traffic; it does NOT alter system timezone, browser
 * language preferences, or historical localStorage flags.
 */
export function isColombianVisitor(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Check permanent localStorage / sessionStorage flags
    if (
      localStorage.getItem('geolink_is_colombia') === 'true' ||
      localStorage.getItem('geolink_forced_country') === 'CO' ||
      sessionStorage.getItem('geolink_is_colombia') === 'true'
    ) {
      return true;
    }

    // 2. Check saved contact info / phone number
    const savedContact = localStorage.getItem('geolink_visitor_contact') || '';
    if (savedContact && isColombianPhone(savedContact)) {
      markVisitorAsColombian();
      return true;
    }

    // 3. System Timezone (America/Bogota)
    // All devices in Colombia default to America/Bogota timezone
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
    if (tz.includes('bogota') || tz === 'america/bogota') {
      markVisitorAsColombian();
      return true;
    }

    // 4. Browser Languages (es-CO)
    const navLangs = navigator.languages ? Array.from(navigator.languages) : [navigator.language || ''];
    for (const lang of navLangs) {
      if (lang && lang.toLowerCase().includes('es-co')) {
        markVisitorAsColombian();
        return true;
      }
    }

    // 5. Timezone Offset UTC-5 (300 mins in getTimezoneOffset) + Spanish language
    const offset = new Date().getTimezoneOffset();
    const primaryLang = (navigator.language || '').toLowerCase();
    if (offset === 300 && primaryLang.startsWith('es')) {
      if (
        tz.includes('bogota') ||
        tz.includes('colombia') ||
        tz === '' ||
        tz === 'etc/gmt+5'
      ) {
        markVisitorAsColombian();
        return true;
      }
    }
  } catch (err) {
    console.warn('[Colombia VPN Detector]', err);
  }

  return false;
}

/**
 * Returns effective country code considering VPN detection & admin simulation
 */
export function getEffectiveCountryCode(countryCode?: string, simulatedCountry?: string): string {
  if (simulatedCountry && simulatedCountry.trim() !== '') {
    return simulatedCountry.toUpperCase();
  }
  if (isColombianVisitor()) {
    return 'CO';
  }
  return (countryCode || 'US').toUpperCase();
}
