import { createClient } from '@supabase/supabase-js';
import { CreatorProfile, MediaItem, PurchaseRecord, VisitorLocation, VisitorLead } from '../types';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://eqpabbrmdssgoaaqtkgu.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcGFiYnJtZHNzZ29hYXF0a2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDk2NTMsImV4cCI6MjEwMTY4NTY1M30.K09vvdfxkuBxd64RuQey9KV13Yz20fBBPkbWQOGGodQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const api = {
  // 1. Geo-IP Location & Access Check
  async getVisitorLocation(simulatedCountry?: string): Promise<VisitorLocation> {
    try {
      const url = simulatedCountry 
        ? `/api/geoip?simulate_country=${encodeURIComponent(simulatedCountry)}`
        : '/api/geoip';
      const res = await fetch(url);
      if (!res.ok) throw new Error('GeoIP fetch error');
      return await res.json();
    } catch {
      return {
        ip: '181.16.2.44',
        countryCode: simulatedCountry || 'US',
        countryName: simulatedCountry === 'ES' ? 'España' : simulatedCountry === 'AR' ? 'Argentina' : 'Estados Unidos',
        city: 'Simulated Location',
        isSimulated: Boolean(simulatedCountry)
      };
    }
  },

  async checkAccess(handle: string, countryCode?: string) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      let deviceHash = '';
      try {
        deviceHash = localStorage.getItem('geolink_device_fingerprint') || '';
        if (!deviceHash && typeof window !== 'undefined') {
          const rawFp = [navigator.userAgent, screen.width, screen.height, screen.colorDepth, navigator.language, tz].join('|');
          let hash = 0;
          for (let i = 0; i < rawFp.length; i++) {
            hash = (hash << 5) - hash + rawFp.charCodeAt(i);
            hash |= 0;
          }
          deviceHash = `dev_${Math.abs(hash).toString(36)}`;
          localStorage.setItem('geolink_device_fingerprint', deviceHash);
        }
      } catch {}

      const params = new URLSearchParams();
      if (countryCode) params.set('country', countryCode);
      if (tz) params.set('tz', tz);
      if (deviceHash) params.set('dh', deviceHash);

      const url = `/api/creators/${encodeURIComponent(handle)}/check-access?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Access check error');
      return await res.json();
    } catch {
      return {
        allowed: true,
        visitorCountry: countryCode || 'US',
        visitorCountryName: 'Estados Unidos',
        visitorCountryFlag: '🇺🇸',
        blockedCountries: [],
        blockedMessage: 'Contenido disponible'
      };
    }
  },

  // 2. Creator Profiles
  async getCreators(): Promise<CreatorProfile[]> {
    try {
      const res = await fetch('/api/creators');
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API fetch fallback:', e);
    }
    return [];
  },

  async getCreator(handle: string): Promise<{ creator: CreatorProfile; mediaItems: MediaItem[] }> {
    const res = await fetch(`/api/creators/${encodeURIComponent(handle)}`);
    if (!res.ok) throw new Error('Creator profile not found');
    return await res.json();
  },

  async saveCreator(creator: CreatorProfile): Promise<CreatorProfile> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('creators').upsert({
          id: creator.id,
          handle: creator.handle,
          name: creator.name,
          title: creator.title,
          bio: creator.bio,
          avatar: creator.avatar,
          banner: creator.banner,
          badge: creator.badge,
          blocked_countries: creator.blockedCountries || [],
          blocked_message: creator.blockedMessage || 'Contenido no disponible en tu región.',
          whatsapp_number: creator.whatsappNumber || '',
          links: creator.links || [],
          payment_settings: creator.paymentSettings || {},
          data: creator
        });
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      }
    }

    const res = await fetch('/api/creators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creator)
    });
    const data = await res.json();
    return data.creator;
  },

  // 3. Media Items
  async saveMediaItem(item: MediaItem): Promise<MediaItem> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('media_items').upsert({
          id: item.id,
          creator_id: item.creatorId || 'creator_1',
          creator_handle: item.creatorHandle,
          title: item.title,
          description: item.description,
          type: item.type,
          price: item.price,
          currency: item.currency,
          preview_url: item.previewUrl,
          content_url: item.downloadUrl,
          file_size: item.fileSize,
          duration: item.duration,
          sales_count: item.purchasesCount || 0,
          data: item
        });
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      }
    }

    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const data = await res.json();
    return data.item;
  },

  async deleteMediaItem(id: string): Promise<boolean> {
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // 4. Payment Integrations
  async createMercadoPagoPreference(mediaId: string, buyerEmail: string, buyerPhone: string) {
    const res = await fetch('/api/payments/mercadopago/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaId, buyerEmail, buyerPhone })
    });
    return await res.json();
  },

  async createPayPalOrder(mediaId: string, buyerEmail?: string, buyerPhone?: string) {
    try {
      const res = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, buyerEmail, buyerPhone })
      });
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return { error: 'El servidor está desplegando la última actualización de PayPal. Intenta de nuevo en 30 segundos.' };
      }
    } catch (err: any) {
      return { error: err.message || 'Error de conexión con el servidor.' };
    }
  },

  async capturePayPalOrder(orderId: string, unlockToken: string) {
    try {
      const res = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, unlockToken })
      });
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return { error: 'Error procesando la respuesta del servidor.' };
      }
    } catch (err: any) {
      return { error: err.message || 'Error de conexión con el servidor.' };
    }
  },

  async confirmDirectPayment(mediaId: string, paymentMethod: string, referenceNumber: string, buyerEmail: string, buyerPhone: string) {
    const res = await fetch('/api/payments/confirm-direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaId, paymentMethod, referenceNumber, buyerEmail, buyerPhone })
    });
    return await res.json();
  },

  async verifyPurchase(token: string, autoApprove?: boolean) {
    const url = `/api/purchases/verify/${token}${autoApprove ? '?auto=true' : ''}`;
    const res = await fetch(url);
    return await res.json();
  },

  async approvePurchaseManual(tokenOrId: string) {
    const res = await fetch('/api/purchases/approve-manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenOrId, purchaseId: tokenOrId })
    });
    return await res.json();
  },

  async blockIp(handle: string, ipAddress: string, deviceHash?: string) {
    if (isSupabaseConfigured()) {
      try {
        if (ipAddress) {
          const cleanIp = ipAddress.trim();
          await supabase.from('blocked_ips').upsert({
            id: `block_${cleanIp.replace(/[^a-z0-9]/gi, '_')}`,
            ip_address: cleanIp,
            creator_handle: handle || 'angelina69',
            reason: 'Bloqueo manual desde Historial de Ventas',
            created_at: new Date().toISOString()
          });
        }
        if (deviceHash) {
          const cleanHash = deviceHash.trim();
          await supabase.from('blocked_devices').upsert({
            id: `dev_${cleanHash.replace(/[^a-z0-9]/gi, '_')}`,
            device_hash: cleanHash,
            creator_handle: handle || 'angelina69',
            reason: 'Bloqueo por huella digital de dispositivo / VPN',
            created_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Supabase direct block error:', err);
      }
    }

    const res = await fetch('/api/creators/block-ip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, ipAddress, deviceHash })
    });
    return await res.json();
  },

  async getPurchases(creatorHandle?: string): Promise<PurchaseRecord[]> {
    const url = creatorHandle ? `/api/purchases?creator=${encodeURIComponent(creatorHandle)}` : '/api/purchases';
    const res = await fetch(url);
    if (res.ok) return await res.json();
    return [];
  },

  async sendWhatsAppConfirmation(phone: string, mediaTitle: string, downloadToken: string) {
    const res = await fetch('/api/whatsapp/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, mediaTitle, downloadToken })
    });
    return await res.json();
  },

  async saveVisitorLead(contactInfo: string, countryCode?: string) {
    let deviceHash = '';
    try {
      deviceHash = localStorage.getItem('geolink_device_fingerprint') || '';
    } catch {}

    if (isSupabaseConfigured()) {
      try {
        const leadObj = {
          id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          contact_info: contactInfo.trim(),
          country_code: countryCode || '',
          device_hash: deviceHash,
          created_at: new Date().toISOString()
        };
        await supabase.from('visitor_leads').upsert(leadObj);
      } catch (err) {
        console.warn('Supabase lead save warning:', err);
      }
    }

    const res = await fetch('/api/visitor-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactInfo, countryCode, deviceHash })
    });
    return await res.json();
  },

  async getVisitorLeads(): Promise<VisitorLead[]> {
    try {
      const res = await fetch('/api/visitor-leads');
      if (res.ok) return await res.json();
    } catch {}
    return [];
  },

  async getUnlockedItems(tokens?: string[]): Promise<{
    clientIp: string;
    unlockedMediaIds: string[];
    unlockedTokensMap: Record<string, string>;
    purchases: PurchaseRecord[];
  }> {
    try {
      const tokensParam = tokens && tokens.length > 0 ? `?tokens=${encodeURIComponent(tokens.join(','))}` : '';
      const res = await fetch(`/api/purchases/unlocked-items${tokensParam}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Error fetching unlocked items:', err);
    }
    return { clientIp: '', unlockedMediaIds: [], unlockedTokensMap: {}, purchases: [] };
  },

  async getLeadCaptureSetting(): Promise<boolean> {
    try {
      const res = await fetch('/api/settings/lead-capture');
      if (res.ok) {
        const data = await res.json();
        return typeof data.requireLeadCapture === 'boolean' ? data.requireLeadCapture : true;
      }
    } catch {}
    return true;
  },

  async updateLeadCaptureSetting(requireLeadCapture: boolean): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('lead_capture_settings').upsert({
          id: 'default',
          require_lead_capture: requireLeadCapture,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase lead capture update warning:', err);
      }
    }

    try {
      const res = await fetch('/api/settings/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requireLeadCapture })
      });
      if (res.ok) {
        const data = await res.json();
        return data.requireLeadCapture;
      }
    } catch {}
    return requireLeadCapture;
  }
};
