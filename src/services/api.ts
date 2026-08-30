import { createClient } from '@supabase/supabase-js';
import { CreatorProfile, MediaItem, PurchaseRecord, VisitorLocation, VisitorLead, PaymentMethodsVisibility } from '../types';

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
            is_extra_premium: Boolean(item.isExtraPremium),
          data: { ...item, isExtraPremium: Boolean(item.isExtraPremium) }
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
  async createMercadoPagoPreference(mediaId: string, buyerEmail: string, buyerPhone: string, price?: number) {
    const res = await fetch('/api/payments/mercadopago/create-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaId, buyerEmail, buyerPhone, price })
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
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        await supabase.from('visitor_leads').delete().lt('created_at', oneDayAgo);

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
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    if (isSupabaseConfigured()) {
      try {
        // 1. Purga automática de registros de más de 24 horas en Supabase
        await supabase.from('visitor_leads').delete().lt('created_at', oneDayAgo);

        // 2. Consulta directa de registros de las últimas 24 horas ordenados por fecha descendente sin el tope de 1000
        const { data, error } = await supabase
          .from('visitor_leads')
          .select('*')
          .gte('created_at', oneDayAgo)
          .order('created_at', { ascending: false })
          .limit(50000);

        if (!error && data) {
          return data.map((row: any) => ({
            id: row.id,
            contactInfo: row.contact_info || '',
            countryCode: row.country_code || '',
            deviceHash: row.device_hash || '',
            createdAt: row.created_at || new Date().toISOString(),
            ip: row.ip || '',
            vpnStatus: row.vpn_status || 'normal'
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch visitor_leads error:', err);
      }
    }

    try {
      const res = await fetch('/api/visitor-leads');
      if (res.ok) {
        const list: VisitorLead[] = await res.json();
        if (Array.isArray(list)) {
          const oneDayAgoMs = Date.now() - 24 * 60 * 60 * 1000;
          return list.filter(lead => {
            const time = new Date(lead.createdAt || (lead as any).created_at).getTime();
            return isNaN(time) || time >= oneDayAgoMs;
          });
        }
      }
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
  },

  async getPaymentMethodsVisibility(): Promise<PaymentMethodsVisibility> {
    const defaultVis: PaymentMethodsVisibility = {
      mercadopago: true,
      paypal: true,
      paypal_telegram: true,
      nequi_usa: true,
    };
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('payment_methods_visibility')
          .select('*')
          .limit(1);
        if (!error && data && data.length > 0) {
          const row = data[0];
          return {
            mercadopago: typeof row.mercadopago === 'boolean' ? row.mercadopago : true,
            paypal: typeof row.paypal === 'boolean' ? row.paypal : true,
            paypal_telegram: typeof row.paypal_telegram === 'boolean' ? row.paypal_telegram : true,
            nequi_usa: typeof row.nequi_usa === 'boolean' ? row.nequi_usa : true,
          };
        }
      } catch (err) {
        console.warn('Supabase fetch payment_methods_visibility warning:', err);
      }
    }

    try {
      const res = await fetch('/api/settings/payment-methods-visibility');
      if (res.ok) {
        const data = await res.json();
        if (data.visibility) {
          return {
            mercadopago: typeof data.visibility.mercadopago === 'boolean' ? data.visibility.mercadopago : true,
            paypal: typeof data.visibility.paypal === 'boolean' ? data.visibility.paypal : true,
            paypal_telegram: typeof data.visibility.paypal_telegram === 'boolean' ? data.visibility.paypal_telegram : true,
            nequi_usa: typeof data.visibility.nequi_usa === 'boolean' ? data.visibility.nequi_usa : true,
          };
        }
      }
    } catch {}

    return defaultVis;
  },

  async updatePaymentMethodsVisibility(visibility: PaymentMethodsVisibility): Promise<PaymentMethodsVisibility> {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('payment_methods_visibility').upsert({
          id: 'default',
          mercadopago: visibility.mercadopago,
          paypal: visibility.paypal,
          paypal_telegram: visibility.paypal_telegram,
          nequi_usa: visibility.nequi_usa,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      } catch (err) {
        console.warn('Supabase update payment_methods_visibility warning:', err);
      }
    }

    try {
      const res = await fetch('/api/settings/payment-methods-visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.visibility) return data.visibility;
      }
    } catch {}

    return visibility;
  },


  // Telegram VIP Unlock Links & Manual Approvals
  async createCustomMediaUnlockLink(mediaId: string, contactInfo: string, customCode?: string): Promise<{ code: string; link: string; token: string }> {
    const code = customCode && customCode.trim() ? customCode.trim() : Math.random().toString(36).substring(2, 8);
    const unlockToken = `unlock_tg_${code}_${Date.now()}`;
    const reqId = `tg_purch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('purchases').insert({
          id: reqId,
          token: unlockToken,
          media_id: mediaId,
          buyer_email: contactInfo.trim() || 'Telegram VIP',
          buyer_phone: contactInfo.trim(),
          payment_method: 'telegram_manual',
          status: 'approved',
          created_at: new Date().toISOString(),
          approved_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase createCustomMediaUnlockLink warning:', err);
      }
    }

    try {
      await fetch('/api/purchases/approve-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: unlockToken, purchaseId: reqId, mediaId, buyerEmail: contactInfo })
      });
    } catch {}

    const host = typeof window !== 'undefined' ? window.location.origin : 'https://geolink-1.onrender.com';
    const link = `${host}/?unlock=${unlockToken}`;
    return { code, link, token: unlockToken };
  },

  // 6. Colombia Page Access Control ($30 USD / $105.000 COP)
  async saveColombiaAccessRequest(contactInfo: string, method: string = 'nequi'): Promise<boolean> {
    let deviceHash = '';
    try {
      deviceHash = localStorage.getItem('geolink_device_fingerprint') || '';
    } catch {}

    const reqId = `co_acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('colombia_page_access').insert({
          id: reqId,
          contact_info: contactInfo.trim(),
          device_hash: deviceHash,
          payment_method: method,
          status: 'pending',
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase colombia_page_access save warning:', err);
      }
    }

    try {
      await fetch('/api/colombia-page-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reqId, contactInfo, method, deviceHash })
      });
    } catch {}

    return true;
  },

  async getColombiaAccessRequests(): Promise<any[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('colombia_page_access')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && data) {
          return data.map((row: any) => ({
            id: row.id,
            contactInfo: row.contact_info || '',
            ipAddress: row.ip_address || '',
            deviceHash: row.device_hash || '',
            paymentMethod: row.payment_method || 'nequi',
            status: row.status || 'pending',
            createdAt: row.created_at || new Date().toISOString()
          }));
        }
      } catch (err) {
        console.warn('Supabase colombia_page_access fetch error:', err);
      }
    }

    try {
      const res = await fetch('/api/colombia-page-access');
      if (res.ok) return await res.json();
    } catch {}

    return [];
  },

  async approveColombiaAccessRequest(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('colombia_page_access')
          .update({ status: 'approved', approved_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase approve colombia_page_access warning:', err);
      }
    }

    try {
      const res = await fetch(`/api/colombia-page-access/${id}/approve`, { method: 'POST' });
      return res.ok;
    } catch {}

    return true;
  },

  async checkColombiaAccessApproved(deviceHash?: string): Promise<boolean> {
    let hash = deviceHash || '';
    if (!hash) {
      try {
        hash = localStorage.getItem('geolink_device_fingerprint') || '';
      } catch {}
    }

    // 1. Verificación en Supabase por dispositivo o aprobación previa
    if (isSupabaseConfigured()) {
      try {
        if (hash) {
          const { data } = await supabase
            .from('colombia_page_access')
            .select('id, status')
            .eq('device_hash', hash)
            .eq('status', 'approved')
            .limit(1);

          if (data && data.length > 0) {
            try { localStorage.setItem('geolink_colombia_page_unlocked', 'true'); } catch {}
            return true;
          }
        }
      } catch (err) {
        console.warn('Supabase check Colombia access warning:', err);
      }
    }

    // 2. Verificación si retornó con token verificado de Mercado Pago o PayPal
    try {
      const savedTokensRaw = localStorage.getItem('geolink_unlocked_tokens');
      const savedTokens: string[] = savedTokensRaw ? JSON.parse(savedTokensRaw) : [];
      if (savedTokens.length > 0) {
        const res = await this.getUnlockedItems(savedTokens);
        if (res.unlockedMediaIds?.includes('acceso_pagina_colombia')) {
          try { localStorage.setItem('geolink_colombia_page_unlocked', 'true'); } catch {}
          return true;
        }
      }
    } catch {}

    // Si no está verificado en Supabase ni por compra aprobada, eliminar cualquier marca local obsoleta
    try {
      localStorage.removeItem('geolink_colombia_page_unlocked');
    } catch {}

    return false;
  },

  async checkColombiaCustomCode(code: string): Promise<boolean> {
    if (!code || !code.trim()) return false;
    const cleanCode = code.trim();

    let deviceHash = '';
    try {
      deviceHash = localStorage.getItem('geolink_device_fingerprint') || '';
      if (!deviceHash && typeof window !== 'undefined') {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
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

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('colombia_page_access')
          .select('id, status, custom_code, device_hash')
          .eq('custom_code', cleanCode)
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];

          // CANDADO ESTRICTO DE 1 SOLO DISPOSITIVO:
          // Si el código ya fue vinculado a otro dispositivo anterior y no coincide con el actual, DENEGAR ACCESO.
          if (row.device_hash && row.device_hash.trim() !== '') {
            if (deviceHash && row.device_hash.trim() !== deviceHash.trim()) {
              console.warn('Acceso VIP denegado: Este enlace ya fue utilizado en otro dispositivo.', {
                boundDevice: row.device_hash,
                currentDevice: deviceHash
              });
              return false;
            }
          }

          // Si es el primer clic, vincular permanentemente la huella digital del dispositivo actual
          try {
            await supabase
              .from('colombia_page_access')
              .update({
                status: 'approved',
                device_hash: row.device_hash || deviceHash,
                approved_at: new Date().toISOString()
              })
              .eq('id', row.id);
          } catch {}

          try {
            localStorage.setItem('geolink_colombia_page_unlocked', 'true');
          } catch {}
          return true;
        }
      } catch (err) {
        console.warn('Supabase checkColombiaCustomCode warning:', err);
      }
    }

    return false;
  },

  async createColombiaCustomAccessLink(contactInfo: string, customCode?: string): Promise<{ code: string; link: string }> {
    const code = customCode && customCode.trim() ? customCode.trim() : Math.random().toString(36).substring(2, 8);
    const reqId = `co_link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('colombia_page_access').insert({
          id: reqId,
          contact_info: contactInfo.trim() || 'Acceso Directo Telegram',
          custom_code: code,
          payment_method: 'manual',
          status: 'approved',
          created_at: new Date().toISOString(),
          approved_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase createColombiaCustomAccessLink warning:', err);
      }
    }

    const host = typeof window !== 'undefined' ? window.location.origin : 'https://geolink-1.onrender.com';
    const link = `${host}/?access=${code}`;
    return { code, link };
  },

  async getGlobalDiscount(handle: string = 'angelina69'): Promise<{ discountPercentage: number; colombiaMultiplier: number }> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('global_discounts')
          .select('discount_percentage, colombia_multiplier, is_active')
          .eq('creator_handle', handle)
          .limit(1);

        if (!error && data && data.length > 0) {
          const row = data[0];
          return {
            discountPercentage: row.is_active ? (Number(row.discount_percentage) || 0) : 0,
            colombiaMultiplier: row.colombia_multiplier !== null && row.colombia_multiplier !== undefined ? Number(row.colombia_multiplier) : 7
          };
        }
      } catch (err) {
        console.warn('Supabase getGlobalDiscount warning:', err);
      }
    }

    try {
      const res = await fetch(`/api/creators/${encodeURIComponent(handle)}/discount`);
      if (res.ok) {
        const result = await res.json();
        return {
          discountPercentage: Number(result.discountPercentage) || 0,
          colombiaMultiplier: result.colombiaMultiplier !== undefined ? Number(result.colombiaMultiplier) : 7
        };
      }
    } catch {}

    return { discountPercentage: 0, colombiaMultiplier: 7 };
  },

  async saveGlobalDiscount(percentage: number | null, multiplier: number | null = 7, handle: string = 'angelina69'): Promise<boolean> {
    const cleanPercentage = percentage && Number(percentage) > 0 ? Number(percentage) : 0;
    const cleanMultiplier = multiplier !== null && multiplier !== undefined && Number(multiplier) > 0 ? Number(multiplier) : null;

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('global_discounts').upsert({
          creator_handle: handle,
          discount_percentage: cleanPercentage,
          colombia_multiplier: cleanMultiplier,
          is_active: cleanPercentage > 0,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase saveGlobalDiscount warning:', err);
      }
    }

    try {
      await fetch(`/api/creators/${encodeURIComponent(handle)}/discount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountPercentage: cleanPercentage, colombiaMultiplier: cleanMultiplier })
      });
    } catch {}

    return true;
  }
};
