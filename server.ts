import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import { INITIAL_CREATORS, INITIAL_MEDIA_ITEMS } from "./src/data/mockData";
import { COUNTRIES_LIST } from "./src/data/countries";
import { CreatorProfile, MediaItem, PurchaseRecord, VisitorLocation } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Supabase Client Setup
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://eqpabbrmdssgoaaqtkgu.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcGFiYnJtZHNzZ29hYXF0a2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDk2NTMsImV4cCI6MjEwMTY4NTY1M30.K09vvdfxkuBxd64RuQey9KV13Yz20fBBPkbWQOGGodQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// In-Memory Data Store (Synchronized with Supabase DB)
let creators: CreatorProfile[] = [...INITIAL_CREATORS];
let mediaItems: MediaItem[] = [...INITIAL_MEDIA_ITEMS];
let purchases: PurchaseRecord[] = [];

// Data Mappers: Supabase <-> TypeScript
function fromSupabaseCreator(row: any): CreatorProfile {
  const initial = INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === row.handle?.toLowerCase());
  const initialSettings = initial?.paymentSettings || {};
  const dbSettings = row.payment_settings || row.data?.paymentSettings || {};

  return {
    id: row.id,
    handle: row.handle,
    name: row.name || row.handle,
    title: row.title || '',
    bio: row.bio || '',
    avatar: row.avatar || '',
    banner: row.banner || '',
    themeColor: row.data?.themeColor || initial?.themeColor || 'from-pink-600 via-purple-600 to-indigo-700',
    badge: row.badge || initial?.badge || 'TOP CREATOR',
    blockedCountries: Array.isArray(row.blocked_countries) ? row.blocked_countries : (row.data?.blockedCountries || initial?.blockedCountries || []),
    blockedMessage: row.blocked_message || row.data?.blockedMessage || initial?.blockedMessage || 'Contenido no disponible en tu región.',
    whatsappNumber: row.whatsapp_number || row.data?.whatsappNumber || initial?.whatsappNumber || '',
    links: (Array.isArray(row.links) && row.links.length > 0) ? row.links : (initial?.links || []),
    paymentSettings: {
      ...initialSettings,
      ...dbSettings,
      customPaymentLinks: (dbSettings.customPaymentLinks && dbSettings.customPaymentLinks.length > 0)
        ? dbSettings.customPaymentLinks
        : (initialSettings.customPaymentLinks || [])
    },
    createdAt: row.created_at || new Date().toISOString()
  };
}

function toSupabaseCreator(creator: CreatorProfile): any {
  return {
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
    data: {
      themeColor: creator.themeColor,
      blockedCountries: creator.blockedCountries,
      blockedMessage: creator.blockedMessage
    }
  };
}

function fromSupabaseMedia(row: any): MediaItem {
  return {
    id: row.id,
    creatorId: row.creator_id,
    creatorHandle: row.creator_handle,
    title: row.title,
    description: row.description || '',
    type: row.type || 'video',
    price: Number(row.price),
    currency: row.currency || 'USD',
    previewUrl: row.preview_url || row.data?.previewUrl || '',
    downloadUrl: row.content_url || row.download_url || row.data?.downloadUrl || '',
    fileSize: row.file_size || '',
    duration: row.duration || '',
    purchasesCount: row.sales_count || row.data?.purchasesCount || 0,
    isFeatured: row.data?.isFeatured || false,
    createdAt: row.created_at || new Date().toISOString()
  };
}

function toSupabaseMedia(item: MediaItem): any {
  return {
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
    data: {
      previewUrl: item.previewUrl,
      downloadUrl: item.downloadUrl,
      purchasesCount: item.purchasesCount,
      isFeatured: item.isFeatured
    }
  };
}

function fromSupabasePurchase(row: any): PurchaseRecord {
  return {
    id: row.id,
    token: row.token,
    mediaId: row.media_id,
    mediaTitle: row.media_title || '',
    creatorHandle: row.creator_handle || '',
    buyerEmail: row.buyer_email || '',
    buyerPhone: row.buyer_phone || '',
    amount: Number(row.amount || 0),
    currency: row.currency || 'USD',
    paymentMethod: row.payment_method || 'link',
    paymentId: row.payment_id || '',
    status: row.status || 'pending',
    ipAddress: row.ip_address || '',
    createdAt: row.created_at || new Date().toISOString(),
    downloadCount: row.download_count || 0,
    downloadUrl: row.download_url || '',
  };
}

function toSupabasePurchase(record: PurchaseRecord): any {
  return {
    id: record.id,
    token: record.token,
    media_id: record.mediaId,
    media_title: record.mediaTitle,
    creator_handle: record.creatorHandle,
    buyer_email: record.buyerEmail,
    buyer_phone: record.buyerPhone,
    amount: record.amount,
    currency: record.currency,
    payment_method: record.paymentMethod,
    payment_id: record.paymentId,
    status: record.status,
    ip_address: record.ipAddress || '',
    download_count: record.downloadCount || 0,
    download_url: record.downloadUrl,
    updated_at: new Date().toISOString(),
  };
}

async function savePurchase(record: PurchaseRecord) {
  const existingIdx = purchases.findIndex((p) => p.id === record.id || p.token === record.token);
  if (existingIdx >= 0) {
    purchases[existingIdx] = { ...purchases[existingIdx], ...record };
  } else {
    purchases.push(record);
  }

  try {
    const payload = toSupabasePurchase(record);
    const { error } = await supabase.from("purchases").upsert(payload);
    if (error) {
      console.warn("[Supabase Purchase Sync Error]", error);
    } else {
      console.log(`[Supabase DB] Purchase ${record.id} (${record.status}) saved for IP ${record.ipAddress}`);
    }
  } catch (err) {
    console.warn("[Supabase Purchase Sync Warning]", err);
  }
}

function getClientIp(req: express.Request): string {
  const rawIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "";
  return rawIp.replace(/^::ffff:/, '').trim();
}

// Initial Sync from Supabase on Startup
async function syncFromSupabase() {
  try {
    const { data: dbCreators, error: cErr } = await supabase.from("creators").select("*");
    if (!cErr && dbCreators && dbCreators.length > 0) {
      creators = dbCreators.map(fromSupabaseCreator);
      console.log(`[Supabase DB] Loaded ${creators.length} creator profiles.`);
    }

    // Load custom links from dedicated creator_links table in Supabase if exists
    try {
      const { data: dbLinks, error: lErr } = await supabase.from("creator_links").select("*");
      if (!lErr && dbLinks && dbLinks.length > 0) {
        dbLinks.forEach(row => {
          const creator = creators.find(c => c.handle.toLowerCase() === (row.creator_handle || '').toLowerCase());
          if (creator) {
            const existingIdx = creator.links.findIndex(l => l.id === row.id);
            const mappedLink = {
              id: row.id,
              title: row.title,
              url: row.url,
              icon: row.icon || 'Link',
              active: row.active !== false,
              clicks: row.clicks || 0,
            };
            if (existingIdx >= 0) {
              creator.links[existingIdx] = mappedLink;
            } else {
              creator.links.push(mappedLink);
            }
          }
        });
        console.log(`[Supabase DB] Loaded ${dbLinks.length} custom links from creator_links table.`);
      }
    } catch (lErr) {
      console.warn("[Supabase creator_links Sync Warning]", lErr);
    }

    // Load blocked IPs from dedicated blocked_ips table in Supabase if exists
    try {
      const { data: dbBlockedIps, error: bErr } = await supabase.from("blocked_ips").select("*");
      if (!bErr && dbBlockedIps && dbBlockedIps.length > 0) {
        dbBlockedIps.forEach(row => {
          if (row.ip_address) {
            blockedIps.add(row.ip_address.trim());
          }
        });
        console.log(`[Supabase DB] Loaded ${dbBlockedIps.length} blocked IP records.`);
      }
    } catch (bErr) {
      console.warn("[Supabase blocked_ips Sync Warning]", bErr);
    }

    // Load blocked devices from dedicated blocked_devices table in Supabase if exists
    try {
      const { data: dbBlockedDevices, error: dErr } = await supabase.from("blocked_devices").select("*");
      if (!dErr && dbBlockedDevices && dbBlockedDevices.length > 0) {
        dbBlockedDevices.forEach(row => {
          if (row.device_hash) {
            blockedDevices.add(row.device_hash.trim());
          }
        });
        console.log(`[Supabase DB] Loaded ${dbBlockedDevices.length} blocked device fingerprint records.`);
      }
    } catch (dErr) {
      console.warn("[Supabase blocked_devices Sync Warning]", dErr);
    }

    const { data: dbMedia, error: mErr } = await supabase.from("media_items").select("*");
    if (!mErr && dbMedia && dbMedia.length > 0) {
      mediaItems = dbMedia.map(fromSupabaseMedia);
      console.log(`[Supabase DB] Loaded ${mediaItems.length} media store items.`);
    }

    const { data: dbPurchases, error: pErr } = await supabase.from("purchases").select("*");
    if (!pErr && dbPurchases && dbPurchases.length > 0) {
      purchases = dbPurchases.map(fromSupabasePurchase);
      console.log(`[Supabase DB] Loaded ${purchases.length} purchase records.`);
    }
  } catch (err) {
    console.warn("[Supabase Sync Warning]", err);
  }
}

// Execute Supabase sync
syncFromSupabase();

// Helper: Map country code to Country Name & Flag
function getCountryDetails(code: string) {
  const match = COUNTRIES_LIST.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (match) return match;
  return { code: code.toUpperCase(), name: code.toUpperCase(), flag: '🌐' };
}

// Fast GeoIP Lookup Cache
const ipCountryCache = new Map<string, string>();

async function detectCountryCode(req: express.Request): Promise<string> {
  const simulatedCountry = (req.query.simulate_country || req.query.country) as string;
  if (simulatedCountry && simulatedCountry.trim() !== "") {
    return simulatedCountry.trim().toUpperCase();
  }

  const rawIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "";
  const clientIp = rawIp.replace(/^::ffff:/, '').trim();

  const isLocalIp = !clientIp || clientIp === "::1" || clientIp === "127.0.0.1" || clientIp.startsWith("192.168.") || clientIp.startsWith("10.") || clientIp.startsWith("172.");

  const cacheKey = isLocalIp ? "LOCAL_PUBLIC_IP" : clientIp;
  if (ipCountryCache.has(cacheKey)) {
    return ipCountryCache.get(cacheKey)!;
  }

  try {
    const lookupUrl = isLocalIp ? "https://api.country.is/" : `https://api.country.is/${clientIp}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(lookupUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.country) {
        const countryCode = data.country.toUpperCase();
        ipCountryCache.set(cacheKey, countryCode);
        return countryCode;
      }
    }
  } catch (err) {
    console.warn("[GeoIP Lookup Warning]", err);
  }

  // Fallback heuristics
  if (clientIp.startsWith("181.") || clientIp.startsWith("190.") || clientIp.startsWith("191.") || clientIp.startsWith("186.")) return "CO";
  if (clientIp.startsWith("80.") || clientIp.startsWith("81.")) return "ES";
  if (clientIp.startsWith("187.")) return "MX";

  return "CO"; // Default fallback for local testing
}

// ----------------------------------------------------
// 1. GEO-IP LOCATION & BLOCKING ENDPOINTS
// ----------------------------------------------------

/**
 * GET /api/geoip
 */
app.get("/api/geoip", async (req, res) => {
  const countryCode = await detectCountryCode(req);
  const details = getCountryDetails(countryCode);
  const simulatedCountry = req.query.simulate_country as string;

  res.json({
    ip: (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "Detected",
    countryCode: details.code,
    countryName: details.name,
    city: simulatedCountry ? "Simulated Location" : "Detected Location",
    isSimulated: Boolean(simulatedCountry),
  });
});

// Global Blocked Lists
const blockedIps = new Set<string>(["138.84.41.212"]);
const blockedDevices = new Set<string>();

/**
 * GET /api/creators/:handle/check-access
 */
app.get("/api/creators/:handle/check-access", async (req, res) => {
  const { handle } = req.params;
  let creator = creators.find((c) => c.handle.toLowerCase() === handle.toLowerCase());

  if (!creator) {
    try {
      const { data } = await supabase.from("creators").select("*").eq("handle", handle.toLowerCase()).single();
      if (data) {
        creator = fromSupabaseCreator(data);
      }
    } catch {}
  }

  if (!creator) {
    return res.status(404).json({ error: "Perfil de creador no encontrado" });
  }

  const countryCode = await detectCountryCode(req);
  const countryInfo = getCountryDetails(countryCode);
  const clientIp = getClientIp(req);
  const clientTz = (req.query.tz as string) || '';
  const deviceHash = (req.query.dh as string) || '';

  // 1. Device Fingerprint Hash Block Check
  const isDeviceBlocked = Boolean(deviceHash && blockedDevices.has(deviceHash.trim()));

  // 2. Anti-VPN Timezone Mismatch Heuristic:
  // If Colombia is blocked by creator, and visitor's device timezone is Colombia (Bogota / GMT-5),
  // but IP pretends to be from US/ES/FR etc. -> VPN BYPASS DETECTED!
  const isColombiaBlocked = (creator.blockedCountries || []).some(c => c.toUpperCase() === 'CO');
  const isColombianTimezone = clientTz.includes('Bogota') || clientTz.includes('GMT-5') || clientTz.includes('America/Guayaquil') || clientTz.includes('America/Lima');
  const isVpnBypass = isColombiaBlocked && isColombianTimezone && (countryCode !== 'CO');

  // 3. Explicit IP Block Check
  const isIpExplicitlyBlocked = blockedIps.has(clientIp) ||
    clientIp.startsWith("138.84.") ||
    (creator.blockedIps || []).includes(clientIp);

  const isBlocked = isDeviceBlocked || isVpnBypass || isIpExplicitlyBlocked || (creator.blockedCountries || []).some(
    (code) => code.toUpperCase() === countryCode.toUpperCase()
  );

  res.json({
    allowed: !isBlocked,
    visitorCountry: countryInfo.code,
    visitorCountryName: countryInfo.name,
    visitorCountryFlag: countryInfo.flag,
    blockedCountries: creator.blockedCountries || [],
    blockedMessage: creator.blockedMessage || "Contenido no disponible en tu región.",
    vpnDetected: isVpnBypass,
  });
});

/**
 * POST /api/creators/block-ip
 * Block a specific IP address dynamically and persist to Supabase blocked_ips and blocked_devices tables
 */
app.post("/api/creators/block-ip", async (req, res) => {
  const { handle, ipAddress, deviceHash, reason } = req.body;
  if (!ipAddress && !deviceHash) {
    return res.status(400).json({ error: "La dirección IP o Huella de dispositivo es obligatoria" });
  }

  if (ipAddress) {
    const cleanIp = ipAddress.trim();
    blockedIps.add(cleanIp);

    try {
      const payload = {
        id: `block_${cleanIp.replace(/[^a-z0-9]/gi, '_')}`,
        ip_address: cleanIp,
        creator_handle: handle || 'angelina69',
        reason: reason || 'Bloqueo manual desde Historial de Ventas',
        created_at: new Date().toISOString()
      };
      await supabase.from("blocked_ips").upsert(payload);
    } catch (err) {
      console.warn("[Supabase blocked_ips Save Warning]", err);
    }
  }

  if (deviceHash) {
    const cleanHash = deviceHash.trim();
    blockedDevices.add(cleanHash);

    try {
      const payload = {
        id: `dev_${cleanHash.replace(/[^a-z0-9]/gi, '_')}`,
        device_hash: cleanHash,
        creator_handle: handle || 'angelina69',
        reason: reason || 'Bloqueo por huella digital de dispositivo / VPN',
        created_at: new Date().toISOString()
      };
      await supabase.from("blocked_devices").upsert(payload);
    } catch (err) {
      console.warn("[Supabase blocked_devices Save Warning]", err);
    }
  }

  console.log(`[Block Action] IP '${ipAddress || 'none'}' and Device '${deviceHash || 'none'}' have been blocked.`);
  res.json({ success: true, message: `IP y Dispositivo bloqueados exitosamente y guardados en Supabase.` });
});

// ----------------------------------------------------
// 2. CREATORS PROFILE API
// ----------------------------------------------------

// Get all creators
app.get("/api/creators", (req, res) => {
  res.json(creators);
});

// Get creator profile by handle with active media items
app.get("/api/creators/:handle", (req, res) => {
  const { handle } = req.params;
  const creator = creators.find((c) => c.handle.toLowerCase() === handle.toLowerCase());

  if (!creator) {
    return res.status(404).json({ error: "Creador no encontrado" });
  }

  const items = mediaItems.filter((m) => m.creatorHandle.toLowerCase() === handle.toLowerCase());

  res.json({
    creator,
    mediaItems: items,
  });
});

// Create or update creator profile
app.post("/api/creators", async (req, res) => {
  const profileData: CreatorProfile = req.body;

  if (!profileData.handle || !profileData.name) {
    return res.status(400).json({ error: "El nombre y handle son obligatorios" });
  }

  profileData.handle = profileData.handle.toLowerCase().replace(/[^a-z0-9_]/g, "");

  const existingIndex = creators.findIndex((c) => c.handle === profileData.handle || c.id === profileData.id);

  if (existingIndex >= 0) {
    creators[existingIndex] = { ...creators[existingIndex], ...profileData };
  } else {
    profileData.id = profileData.id || `creator_${Date.now()}`;
    profileData.createdAt = new Date().toISOString();
    creators.push(profileData);
  }

  // Sync to Supabase
  try {
    const supabasePayload = toSupabaseCreator(profileData);
    // Sync links to dedicated creator_links table in Supabase
    if (Array.isArray(profileData.links) && profileData.links.length > 0) {
      try {
        const linksPayload = profileData.links.map(link => ({
          id: link.id,
          creator_handle: profileData.handle,
          title: link.title,
          url: link.url,
          icon: link.icon,
          active: link.active !== false,
          clicks: link.clicks || 0,
        }));
        await supabase.from("creator_links").upsert(linksPayload);
      } catch (linkErr) {
        console.warn("[Supabase creator_links Sync Warning]", linkErr);
      }
    }
  } catch (err) {
    console.error("[Supabase Error]", err);
  }

  res.json({ success: true, creator: profileData });
});

// ----------------------------------------------------
// 3. MEDIA STORE ITEMS API
// ----------------------------------------------------

// Add or update media item
app.post("/api/media", async (req, res) => {
  const item: MediaItem = req.body;

  if (!item.title || !item.price || !item.creatorHandle) {
    return res.status(400).json({ error: "Título, precio y creador son requeridos" });
  }

  const existingIndex = mediaItems.findIndex((m) => m.id === item.id);

  if (existingIndex >= 0) {
    mediaItems[existingIndex] = { ...mediaItems[existingIndex], ...item };
  } else {
    item.id = item.id || `media_${Date.now()}`;
    item.purchasesCount = 0;
    item.createdAt = new Date().toISOString();
    mediaItems.push(item);
  }

  // Sync to Supabase
  try {
    const supabasePayload = toSupabaseMedia(item);
    await supabase.from("media_items").upsert(supabasePayload);
  } catch (err) {
    console.error("[Supabase Media Sync Error]", err);
  }

  res.json({ success: true, item });
});

// Delete media item
app.delete("/api/media/:id", async (req, res) => {
  const { id } = req.params;
  mediaItems = mediaItems.filter((m) => m.id !== id);

  try {
    await supabase.from("media_items").delete().eq("id", id);
  } catch (err) {
    console.error("[Supabase Media Delete Error]", err);
  }

  res.json({ success: true, message: "Contenido eliminado" });
});

// ----------------------------------------------------
// 4. PAYMENTS & UNLOCKING ENGINE
// ----------------------------------------------------

/**
 * Mercado Pago API Preference Creation
 * POST /api/payments/mercadopago/create-preference
 */
app.post("/api/payments/mercadopago/create-preference", async (req, res) => {
  try {
    const { mediaId, buyerEmail, buyerPhone } = req.body;
    let media = mediaItems.find((m) => m.id === mediaId);
    if (!media && (mediaId === 'acceso_full_cat_actual' || mediaId?.includes('acceso_full'))) {
      media = INITIAL_MEDIA_ITEMS.find(m => m.id === 'acceso_full_cat_actual') || {
        id: 'acceso_full_cat_actual',
        creatorId: 'creator_1',
        creatorHandle: 'angelina69',
        title: '👑 ACCESO FULL — Desbloquear Catálogo Actual',
        description: 'Acceso inmediato a todas las fotos y videos publicados hasta la fecha.',
        type: 'bundle',
        price: 50,
        currency: 'USD',
        previewUrl: 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg',
        downloadUrl: 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg',
        fileSize: 'COMPLETO',
        duration: 'ILIMITADO',
        purchasesCount: 920,
        isFeatured: true,
        createdAt: new Date().toISOString()
      };
    }

    if (!media) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }

    const creator = creators.find((c) => c.handle.toLowerCase() === media.creatorHandle.toLowerCase())
      || INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === media.creatorHandle.toLowerCase());

    // Usar Token de Mercado Pago real del usuario (evitar placeholders o tokens viejos con xxxxxx)
    let accessToken = creator?.paymentSettings?.mercadoPagoAccessToken?.trim();
    if (!accessToken || accessToken.includes("xxxxxx") || accessToken.length < 15) {
      accessToken = 'APP_USR-7257482411293311-080712-ada9bb187061cb3d57c277c19d3916bc-3553496952';
    }

    const purchaseId = `mp_purch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const unlockToken = `unlock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Create pending purchase record
    const record: PurchaseRecord = {
      id: purchaseId,
      token: unlockToken,
      mediaId: media.id,
      mediaTitle: media.title,
      creatorHandle: media.creatorHandle,
      buyerEmail: buyerEmail || "",
      buyerPhone: buyerPhone || "",
      amount: media.price,
      currency: media.currency,
      paymentMethod: "mercadopago",
      paymentId: purchaseId,
      status: "pending",
      ipAddress: getClientIp(req),
      createdAt: new Date().toISOString(),
      downloadCount: 0,
      downloadUrl: media.downloadUrl,
    };

    await savePurchase(record);

    const validEmail = buyerEmail && buyerEmail.trim().includes("@") ? buyerEmail.trim() : null;

    // Determinar la URL base HTTPS oficial del sitio en Render
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'https';
    const host = req.headers.host || 'geolink-3tze.onrender.com';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

    // Convertir a Pesos Colombianos (COP) para la cuenta de Mercado Pago Colombia ($1 USD ≈ $4.000 COP)
    const isUsd = media.currency === "USD";
    const copUnitPrice = isUsd ? Math.round(Number(media.price) * 4000) : Math.round(Number(media.price));

    // 1. Generar la preferencia oficial vía la API de Mercado Pago Colombia
    try {
      const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          items: [
            {
              id: String(media.id),
              title: String(media.title),
              quantity: 1,
              currency_id: "COP",
              unit_price: copUnitPrice,
            },
          ],
          ...(validEmail ? { payer: { email: validEmail } } : {}),
          auto_return: "approved",
          back_urls: {
            success: `${baseUrl}?payment=success&token=${unlockToken}`,
            failure: `${baseUrl}?payment=failure`,
            pending: `${baseUrl}?payment=pending`,
          },
          ...(baseUrl.startsWith("https") ? { notification_url: `${baseUrl}/api/payments/mercadopago/webhook` } : {}),
          external_reference: purchaseId,
        }),
      });

      if (mpResponse.ok) {
        const mpData = await mpResponse.json();
        return res.json({
          init_point: mpData.init_point || mpData.sandbox_init_point,
          preferenceId: mpData.id,
          purchaseId,
          unlockToken,
        });
      } else {
        const errJson = await mpResponse.json().catch(() => ({}));
        console.error("[MercadoPago API Error]:", errJson);
        return res.status(400).json({
          error: `Error de API MercadoPago: ${errJson.message || errJson.error || "Preferencias inválidas"}`
        });
      }
    } catch (err: any) {
      console.error("Error conectando con API MercadoPago:", err);
      return res.status(500).json({ error: "No se pudo conectar con la API de Mercado Pago." });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Error procesando Mercado Pago" });
  }
});

/**
 * Mercado Pago Webhook / Instant Payment Verification
 * POST /api/payments/mercadopago/webhook
 */
app.post("/api/payments/mercadopago/webhook", async (req, res) => {
  try {
    const { action, data, type } = req.body;
    const paymentId = data?.id || req.body?.id || req.query?.["data.id"] || req.query?.id;
    const externalRef = req.body?.external_reference || req.query?.external_reference;

    let match = purchases.find((p) => p.paymentId === paymentId || p.id === externalRef || p.id === paymentId);

    if (match) {
      match.status = "completed";
      const media = mediaItems.find((m) => m.id === match.mediaId);
      if (media) media.purchasesCount += 1;
      await savePurchase(match);
      sendWhatsAppReceipt(match);
    } else if (paymentId) {
      for (const creator of creators) {
        const token = creator.paymentSettings?.mercadoPagoAccessToken || process.env.MERCADOPAGO_ACCESS_TOKEN;
        if (token && (token.startsWith("APP_USR") || token.startsWith("TEST"))) {
          try {
            const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (mpRes.ok) {
              const mpPayment = await mpRes.json();
              const extId = mpPayment.external_reference;
              const status = mpPayment.status;
              match = purchases.find((p) => p.id === extId || p.token === extId);
              if (match && (status === "approved" || status === "accredited")) {
                match.status = "completed";
                const media = mediaItems.find((m) => m.id === match.mediaId);
                if (media) media.purchasesCount += 1;
                await savePurchase(match);
                sendWhatsAppReceipt(match);
                break;
              }
            }
          } catch {}
        }
      }
    }
  } catch (err) {
    console.error("[MercadoPago Webhook Error]", err);
  }

  res.status(200).send("OK");
});

/**
 * Helper: Obtener Access Token de PayPal REST API Live
 */
async function getPayPalAccessToken(clientId: string, clientSecret: string): Promise<string | null> {
  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    });

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    } else {
      const errText = await response.text();
      console.error("[PayPal OAuth Error]:", errText);
    }
  } catch (err) {
    console.error("[PayPal OAuth Fetch Error]:", err);
  }
  return null;
}

/**
 * PayPal API Create Order (Official PayPal Live REST API)
 * POST /api/payments/paypal/create-order
 */
app.post("/api/payments/paypal/create-order", async (req, res) => {
  try {
    const { mediaId, buyerEmail, buyerPhone } = req.body;
    let media = mediaItems.find((m) => m.id === mediaId);
    if (!media && (mediaId === 'acceso_full_cat_actual' || mediaId?.includes('acceso_full'))) {
      media = INITIAL_MEDIA_ITEMS.find(m => m.id === 'acceso_full_cat_actual') || {
        id: 'acceso_full_cat_actual',
        creatorId: 'creator_1',
        creatorHandle: 'angelina69',
        title: '👑 ACCESO FULL — Desbloquear Catálogo Actual',
        description: 'Acceso inmediato a todas las fotos y videos publicados hasta la fecha.',
        type: 'bundle',
        price: 50,
        currency: 'USD',
        previewUrl: 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg',
        downloadUrl: 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg',
        fileSize: 'COMPLETO',
        duration: 'ILIMITADO',
        purchasesCount: 920,
        isFeatured: true,
        createdAt: new Date().toISOString()
      };
    }

    if (!media) return res.status(404).json({ error: "Contenido no encontrado" });

    const creator = creators.find((c) => c.handle.toLowerCase() === media.creatorHandle.toLowerCase())
      || INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === media.creatorHandle.toLowerCase());

    const clientId = creator?.paymentSettings?.payPalClientId?.trim() 
      || 'BAA8Frtu5JFlsHO30PzjEf0J23mdxSEfhSCZbeZrGfcskv7jBXDkYQR5U4Tv3sUApF5z64ONWtUdGfwf44';
    const clientSecret = creator?.paymentSettings?.payPalClientSecret?.trim() 
      || 'EBQBiVbmbih6qKanhmwkI0RwbiHWKolXovHRMu2DSGcigFTkwHS5J5AafOqMMXJO46goCK2sWZjQNFDw';

    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'https';
    const host = req.headers.host || 'geolink-3tze.onrender.com';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

    const purchaseId = `pp_purch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const unlockToken = `unlock_pp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const record: PurchaseRecord = {
      id: purchaseId,
      token: unlockToken,
      mediaId: media.id,
      mediaTitle: media.title,
      creatorHandle: media.creatorHandle,
      buyerEmail: buyerEmail || "",
      buyerPhone: buyerPhone || "",
      amount: media.price,
      currency: "USD",
      paymentMethod: "paypal",
      paymentId: purchaseId,
      status: "pending",
      ipAddress: getClientIp(req),
      createdAt: new Date().toISOString(),
      downloadCount: 0,
      downloadUrl: media.downloadUrl,
    };

    await savePurchase(record);

    // Fetch OAuth Access Token from PayPal Live API
    const accessToken = await getPayPalAccessToken(clientId, clientSecret);

    if (accessToken) {
      try {
        const orderResponse = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
              {
                reference_id: purchaseId,
                description: media.title,
                amount: {
                  currency_code: "USD",
                  value: Number(media.price).toFixed(2),
                },
              },
            ],
            application_context: {
              brand_name: creator?.name || "Geolink Store",
              landing_page: "LOGIN",
              user_action: "PAY_NOW",
              return_url: `${baseUrl}?payment=paypal_success&token=${unlockToken}`,
              cancel_url: `${baseUrl}?payment=paypal_cancel`,
            },
          }),
        });

        if (orderResponse.ok) {
          const paypalOrder = await orderResponse.json();
          const approveLink = paypalOrder.links?.find((l: any) => l.rel === "approve")?.href;

          record.paymentId = paypalOrder.id;
          await savePurchase(record);

          return res.json({
            orderId: paypalOrder.id,
            approveUrl: approveLink || `https://www.paypal.com/checkoutnow?token=${paypalOrder.id}`,
            unlockToken,
            purchaseId,
            status: "CREATED",
          });
        } else {
          const errJson = await orderResponse.json().catch(() => ({}));
          console.error("[PayPal Create Order API Error]:", errJson);
        }
      } catch (err) {
        console.error("[PayPal API Call Error]:", err);
      }
    }

    // Fallback to PayPal.me link if API call fails
    const paypalLink = creator?.paymentSettings?.customPaymentLinks?.find((l) => l.url.includes("paypal") || l.name.toLowerCase().includes("paypal"))?.url
      || "https://www.paypal.com/paypalme/angieG473";
    const resolvedPaypalUrl = paypalLink.startsWith("http") ? paypalLink : `https://${paypalLink}`;

    res.json({
      orderId: purchaseId,
      approveUrl: resolvedPaypalUrl,
      unlockToken,
      purchaseId,
      status: "CREATED",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Error procesando PayPal" });
  }
});

/**
 * PayPal Capture & Confirm Payment (Official API Verification)
 * POST /api/payments/paypal/capture-order
 */
app.post("/api/payments/paypal/capture-order", async (req, res) => {
  try {
    const { orderId, unlockToken } = req.body;
    let record = purchases.find((p) => p.token === unlockToken || p.id === orderId || p.paymentId === orderId);

    if (!record && (unlockToken || orderId)) {
      try {
        const { data } = await supabase.from("purchases").select("*").or(`token.eq.${unlockToken || ''},id.eq.${orderId || ''},payment_id.eq.${orderId || ''}`).single();
        if (data) record = fromSupabasePurchase(data);
      } catch {}
    }

    if (!record) {
      return res.status(404).json({ error: "Orden de pago no encontrada" });
    }

    // If purchase is already completed
    if (record.status === "completed") {
      await savePurchase(record);
      return res.json({
        success: true,
        valid: true,
        status: "COMPLETED",
        purchase: record,
      });
    }

    const creator = creators.find((c) => c.handle.toLowerCase() === record.creatorHandle.toLowerCase())
      || INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === record.creatorHandle.toLowerCase());

    const clientId = creator?.paymentSettings?.payPalClientId?.trim() 
      || 'BAA8Frtu5JFlsHO30PzjEf0J23mdxSEfhSCZbeZrGfcskv7jBXDkYQR5U4Tv3sUApF5z64ONWtUdGfwf44';
    const clientSecret = creator?.paymentSettings?.payPalClientSecret?.trim() 
      || 'EBQBiVbmbih6qKanhmwkI0RwbiHWKolXovHRMu2DSGcigFTkwHS5J5AafOqMMXJO46goCK2sWZjQNFDw';

    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    const targetOrderId = record.paymentId || orderId;

    if (accessToken && targetOrderId && targetOrderId.length > 5 && !targetOrderId.startsWith("pp_purch_")) {
      try {
        // Attempt to capture payment order via PayPal Live REST API
        const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${targetOrderId}/capture`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (captureRes.ok) {
          const captureData = await captureRes.json();
          if (captureData.status === "COMPLETED" || captureData.status === "APPROVED") {
            record.status = "completed";
            const media = mediaItems.find((m) => m.id === record.mediaId);
            if (media) media.purchasesCount += 1;
            await savePurchase(record);
            sendWhatsAppReceipt(record);

            return res.json({
              success: true,
              valid: true,
              status: "COMPLETED",
              purchase: record,
            });
          }
        } else {
          // If already captured, verify order status from PayPal API
          const orderDetailRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${targetOrderId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (orderDetailRes.ok) {
            const orderDetail = await orderDetailRes.json();
            if (orderDetail.status === "COMPLETED" || orderDetail.status === "APPROVED") {
              record.status = "completed";
              const media = mediaItems.find((m) => m.id === record.mediaId);
              if (media) media.purchasesCount += 1;
              await savePurchase(record);
              sendWhatsAppReceipt(record);

              return res.json({
                success: true,
                valid: true,
                status: "COMPLETED",
                purchase: record,
              });
            }
          }
        }
      } catch (err) {
        console.error("[PayPal Capture Error]:", err);
      }
    }

    res.json({
      success: false,
      valid: false,
      status: record.status,
      error: "El pago no ha sido confirmado ni completado en la API oficial de PayPal.",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Error verificando orden PayPal" });
  }
});

/**
 * Confirm Custom Payment Link / Direct Verification
 * POST /api/payments/confirm-direct
 */
app.post("/api/payments/confirm-direct", async (req, res) => {
  const { mediaId, paymentMethod, referenceNumber, buyerEmail, buyerPhone } = req.body;
  const media = mediaItems.find((m) => m.id === mediaId);

  if (!media) return res.status(404).json({ error: "Contenido no encontrado" });

  const purchaseId = `direct_${Date.now()}`;
  const unlockToken = `unlock_dir_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const record: PurchaseRecord = {
    id: purchaseId,
    token: unlockToken,
    mediaId: media.id,
    mediaTitle: media.title,
    creatorHandle: media.creatorHandle,
    buyerEmail: buyerEmail || "cliente@ejemplo.com",
    buyerPhone: buyerPhone || "+5491100000000",
    amount: media.price,
    currency: media.currency,
    paymentMethod: paymentMethod || "link",
    paymentId: referenceNumber || purchaseId,
    status: "completed",
    ipAddress: getClientIp(req),
    createdAt: new Date().toISOString(),
    downloadCount: 0,
    downloadUrl: media.downloadUrl,
  };

  await savePurchase(record);
  media.purchasesCount += 1;

  sendWhatsAppReceipt(record);

  res.json({
    success: true,
    purchase: record,
    downloadUrl: `/api/media/download/${unlockToken}`,
  });
});

/**
 * GET /api/purchases/verify/:token
 * Verifies purchase token and returns download access info
 */
app.get("/api/purchases/verify/:token", async (req, res) => {
  const { token } = req.params;
  let purchase = purchases.find((p) => p.token === token || p.id === token);

  if (!purchase && token) {
    try {
      const { data } = await supabase.from("purchases").select("*").or(`token.eq.${token},id.eq.${token}`).single();
      if (data) purchase = fromSupabasePurchase(data);
    } catch {}
  }

  if (!purchase) {
    return res.status(404).json({
      valid: false,
      error: "Token de descarga inválido o compra no encontrada",
    });
  }

  // Si el pago aún no está marcado como completado, consultar a la API de Mercado Pago obligatoriamente
  if (purchase.status !== "completed" && purchase.paymentMethod === "mercadopago") {
    const creator = creators.find((c) => c.handle.toLowerCase() === purchase.creatorHandle.toLowerCase())
      || INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === purchase.creatorHandle.toLowerCase());

    const accessToken = creator?.paymentSettings?.mercadoPagoAccessToken?.trim() 
      || process.env.MERCADOPAGO_ACCESS_TOKEN?.trim()
      || 'APP_USR-7257482411293311-080712-ada9bb187061cb3d57c277c19d3916bc-3553496952';

    if (accessToken && accessToken.length > 5) {
      try {
        const mpSearchRes = await fetch(`https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(purchase.id)}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (mpSearchRes.ok) {
          const searchData = await mpSearchRes.json();
          const approvedPayment = searchData.results?.find((p: any) => p.status === "approved" || p.status === "accredited");
          if (approvedPayment) {
            purchase.status = "completed";
            purchase.paymentId = approvedPayment.id;
            const media = mediaItems.find((m) => m.id === purchase.mediaId);
            if (media) media.purchasesCount += 1;
            await savePurchase(purchase);
            sendWhatsAppReceipt(purchase);
          }
        }
      } catch (err) {
        console.error("[MercadoPago Search API Error]:", err);
      }
    }
  }

  // SI Y SOLO SI la API confirmó el pago aprobado, se valida la descarga
  if (purchase.status === "completed") {
    await savePurchase(purchase);
    return res.json({
      valid: true,
      purchase,
    });
  }

  res.json({
    valid: false,
    status: purchase.status,
    error: "El pago no ha sido acreditado ni confirmado por la API oficial.",
  });
});

/**
 * Manual Purchase Approval Endpoint
 * POST /api/purchases/approve-manual
 */
app.post("/api/purchases/approve-manual", async (req, res) => {
  try {
    const { token, purchaseId } = req.body;
    const targetKey = token || purchaseId;

    if (!targetKey) {
      return res.status(400).json({ error: "Se requiere un ID o Token de compra." });
    }

    const record = purchases.find((p) => p.token === targetKey || p.id === targetKey || p.paymentId === targetKey);

    if (record) {
      record.status = "completed";
      const media = mediaItems.find((m) => m.id === record.mediaId);
      if (media) media.purchasesCount += 1;
      await savePurchase(record);
      return res.json({ success: true, status: "completed", purchase: record });
    }

    // Search and update in Supabase
    try {
      const { data: dbRecord } = await supabase
        .from("purchases")
        .select("*")
        .or(`token.eq.${targetKey},id.eq.${targetKey},payment_id.eq.${targetKey}`)
        .single();

      if (dbRecord) {
        const mapped = fromSupabasePurchase(dbRecord);
        mapped.status = "completed";
        const media = mediaItems.find((m) => m.id === mapped.mediaId);
        if (media) media.purchasesCount += 1;
        await savePurchase(mapped);
        return res.json({ success: true, status: "completed", purchase: mapped });
      }
    } catch (dbErr) {
      console.warn("[Manual Approve DB Warning]", dbErr);
    }

    res.status(404).json({ error: "Compra no encontrada en los registros." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Error al aprobar la compra manualmente." });
  }
});

/**
 * GET /api/purchases/unlocked-items
 * Query Supabase & memory for completed purchases by visitor IP or passed tokens
 */
app.get("/api/purchases/unlocked-items", async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const tokensParam = (req.query.tokens as string || "").split(",").filter(Boolean);

    let dbMatches: PurchaseRecord[] = [];

    // 1. Fetch completed purchases from Supabase
    try {
      const { data: dbData, error } = await supabase.from("purchases").select("*").eq("status", "completed");
      if (!error && dbData && dbData.length > 0) {
        const mapped = dbData.map(fromSupabasePurchase);
        dbMatches = mapped.filter(p => 
          p.status === "completed" && (
            (clientIp && p.ipAddress === clientIp) ||
            (clientIp && p.ipAddress && clientIp.includes(p.ipAddress)) ||
            tokensParam.includes(p.token) ||
            tokensParam.includes(p.id)
          )
        );
      }
    } catch (dbErr) {
      console.warn("[Supabase Unlocked Items Warning]", dbErr);
    }

    // 2. Also check in-memory purchases
    const memMatches = purchases.filter(p => 
      p.status === "completed" && (
        (clientIp && p.ipAddress === clientIp) ||
        tokensParam.includes(p.token) ||
        tokensParam.includes(p.id)
      )
    );

    // Combine without duplicates
    const map = new Map<string, PurchaseRecord>();
    [...dbMatches, ...memMatches].forEach(p => map.set(p.id, p));
    const allMatches = Array.from(map.values());

    const hasFullAccess = allMatches.some(p => p.mediaId === 'acceso_full_cat_actual' || p.mediaId?.includes('acceso_full'));

    let unlockedMediaIds = Array.from(new Set(allMatches.map(p => p.mediaId)));
    const unlockedTokensMap: Record<string, string> = {};

    if (hasFullAccess) {
      const fullAccessPurchase = allMatches.find(p => p.mediaId === 'acceso_full_cat_actual' || p.mediaId?.includes('acceso_full'));
      const fullAccessToken = fullAccessPurchase?.token || 'full_access';
      mediaItems.forEach(item => {
        if (!unlockedMediaIds.includes(item.id)) {
          unlockedMediaIds.push(item.id);
        }
        unlockedTokensMap[item.id] = fullAccessToken;
      });
    } else {
      allMatches.forEach(p => {
        unlockedTokensMap[p.mediaId] = p.token;
      });
    }

    res.json({
      clientIp,
      unlockedMediaIds,
      unlockedTokensMap,
      purchases: allMatches
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Error al verificar compras por IP" });
  }
});

/**
 * GET /api/media/download/:token
 * SECURE DIGITAL DOWNLOAD ROUTE
 * Validates token and delivers/redirects to high quality photo or video file
 */
app.get("/api/media/download/:token", async (req, res) => {
  const { token } = req.params;
  let purchase = purchases.find((p) => (p.token === token || p.id === token) && p.status === "completed");

  if (!purchase && token) {
    try {
      const { data } = await supabase.from("purchases").select("*").or(`token.eq.${token},id.eq.${token}`).single();
      if (data && data.status === "completed") {
        purchase = fromSupabasePurchase(data);
      }
    } catch {}
  }

  if (!purchase || purchase.status !== "completed") {
    return res.status(403).send(`
      <div style="font-family: system-ui, sans-serif; text-align: center; padding: 50px; background: #030712; color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h2 style="color: #ef4444;">⛔ Enlace de Descarga Inválido o Pago No Confirmado</h2>
        <p style="color: #9ca3af;">No se pudo verificar un pago completado para esta descarga.</p>
        <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4f46e5; color: white; border-radius: 8px; text-decoration: none;">Volver a la Tienda</a>
      </div>
    `);
  }

  // Estricto: Máximo 1 descarga autorizada por token de compra
  if (purchase.downloadCount >= 1) {
    return res.status(403).send(`
      <div style="font-family: system-ui, sans-serif; text-align: center; padding: 50px; background: #030712; color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="font-size: 54px; margin-bottom: 20px;">🔒</div>
        <h2 style="color: #ef4444; margin-bottom: 12px; font-size: 24px;">Límite de Descarga Alcanzado</h2>
        <p style="color: #9ca3af; max-width: 440px; line-height: 1.6; font-size: 14px;">Este enlace ya ha sido utilizado para descargar el archivo previamente. Por razones de seguridad, cada compra autoriza <strong>máximo 1 descarga única</strong>.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">ID de Compra: ${purchase.id} · IP Comprador: ${purchase.ipAddress || 'Registrada'} · Descargas efectuadas: ${purchase.downloadCount}</p>
        <a href="/" style="display: inline-block; margin-top: 25px; padding: 12px 24px; background: #4f46e5; color: white; border-radius: 12px; text-decoration: none; font-weight: bold;">Volver a la Tienda</a>
      </div>
    `);
  }

  purchase.downloadCount += 1;
  await savePurchase(purchase);

  // Direct redirect or stream to high resolution media file URL
  res.redirect(purchase.downloadUrl);
});

// ----------------------------------------------------
// 5. ULTRAMSG / WHATSAPP INTEGRATION SERVICE
// ----------------------------------------------------

async function sendWhatsAppReceipt(record: PurchaseRecord) {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;

  if (!instanceId || !token || !record.buyerPhone) {
    console.log(`[WhatsApp Simulated Log] Confirmation message queued for ${record.buyerPhone}`);
    record.whatsappSent = true;
    return;
  }

  const downloadLink = `${process.env.APP_URL || "http://localhost:3000"}?unlock=${record.token}`;
  const message = `🎉 ¡Pago Confirmado con Éxito!\n\nHola, tu compra de "*${record.mediaTitle}*" ha sido verificada con éxito.\n\n👇 Haz clic en el enlace para descargar tu contenido en alta resolución:\n${downloadLink}\n\n¡Gracias por tu compra!`;

  try {
    const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        token,
        to: record.buyerPhone,
        body: message,
      }),
    });

    if (response.ok) {
      record.whatsappSent = true;
      console.log(`[UltraMsg WhatsApp] Message delivered successfully to ${record.buyerPhone}`);
    }
  } catch (err) {
    console.error("[UltraMsg WhatsApp Error]", err);
  }
}

/**
 * POST /api/whatsapp/send-confirmation
 * Manual or tested trigger for WhatsApp receipt message
 */
app.post("/api/whatsapp/send-confirmation", async (req, res) => {
  const { phone, mediaTitle, downloadToken } = req.body;
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;

  const downloadLink = `${process.env.APP_URL || "http://localhost:3000"}?unlock=${downloadToken}`;
  const messageText = `🎉 *¡Contenido Desbloqueado!*\n\nSe ha confirmado la compra de "${mediaTitle}".\n\n📥 Enlace directo de descarga:\n${downloadLink}`;

  if (instanceId && token) {
    try {
      const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token, to: phone, body: messageText }),
      });
      const data = await response.json();
      return res.json({ success: true, provider: "UltraMsg API", response: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.json({
    success: true,
    provider: "Simulated WhatsApp Service",
    message: `Mensaje enviado virtualmente a ${phone}`,
    preview: messageText,
  });
});

/**
 * GET /api/purchases
 * Get purchase history list for creator dashboard
 */
app.get("/api/purchases", (req, res) => {
  const creatorHandle = req.query.creator as string;
  let result = purchases;
  if (creatorHandle) {
    result = purchases.filter((p) => p.creatorHandle.toLowerCase() === creatorHandle.toLowerCase());
  }
  res.json(result);
});

// ----------------------------------------------------
// 6. VITE / STATIC MIDDLEWARE SETUP
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 GeoLink App Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
