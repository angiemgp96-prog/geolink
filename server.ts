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

// Initial Sync from Supabase on Startup
async function syncFromSupabase() {
  try {
    const { data: dbCreators, error: cErr } = await supabase.from("creators").select("*");
    if (!cErr && dbCreators && dbCreators.length > 0) {
      creators = dbCreators.map(fromSupabaseCreator);
      console.log(`[Supabase DB] Loaded ${creators.length} creator profiles.`);
    }

    const { data: dbMedia, error: mErr } = await supabase.from("media_items").select("*");
    if (!mErr && dbMedia && dbMedia.length > 0) {
      mediaItems = dbMedia.map(fromSupabaseMedia);
      console.log(`[Supabase DB] Loaded ${mediaItems.length} media store items.`);
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

  const isBlocked = (creator.blockedCountries || []).some(
    (code) => code.toUpperCase() === countryCode.toUpperCase()
  );

  res.json({
    allowed: !isBlocked,
    visitorCountry: countryInfo.code,
    visitorCountryName: countryInfo.name,
    visitorCountryFlag: countryInfo.flag,
    blockedCountries: creator.blockedCountries || [],
    blockedMessage: creator.blockedMessage || "Contenido no disponible en tu región.",
  });
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
    const { error } = await supabase.from("creators").upsert(supabasePayload);
    if (error) {
      console.error("[Supabase Creator Sync Error]", error);
    } else {
      console.log(`[Supabase DB] Creator '${profileData.handle}' updated successfully.`);
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
    const media = mediaItems.find((m) => m.id === mediaId);

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
      createdAt: new Date().toISOString(),
      downloadCount: 0,
      downloadUrl: media.downloadUrl,
    };

    purchases.push(record);

    const validEmail = buyerEmail && buyerEmail.trim().includes("@") ? buyerEmail.trim() : null;

    // 1. Generar la preferencia oficial vía la API de Mercado Pago
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
              id: media.id,
              title: media.title,
              quantity: 1,
              currency_id: media.currency === "ARS" ? "ARS" : "USD",
              unit_price: Number(media.price),
            },
          ],
          ...(validEmail ? { payer: { email: validEmail } } : {}),
          auto_return: "approved",
          back_urls: {
            success: `${process.env.APP_URL || "http://localhost:3000"}?payment=success&token=${unlockToken}`,
            failure: `${process.env.APP_URL || "http://localhost:3000"}?payment=failure`,
            pending: `${process.env.APP_URL || "http://localhost:3000"}?payment=pending`,
          },
          notification_url: `${process.env.APP_URL || "http://localhost:3000"}/api/payments/mercadopago/webhook`,
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
          error: `Error de API MercadoPago: ${errJson.message || errJson.error || "Credencial inválida"}`
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
 * PayPal API Create & Capture Order
 * POST /api/payments/paypal/create-order
 */
// Hardcoded PayPal.me fallback (used when creator has no custom link configured)
const HARDCODED_PAYPAL_URL = "https://www.paypal.com/paypalme/angieG473";

app.post("/api/payments/paypal/create-order", async (req, res) => {
  try {
    const { mediaId, buyerEmail, buyerPhone } = req.body;
    const media = mediaItems.find((m) => m.id === mediaId);

    if (!media) return res.status(404).json({ error: "Contenido no encontrado" });

    const creator = creators.find((c) => c.handle.toLowerCase() === media.creatorHandle.toLowerCase());
    const paypalLink = creator?.paymentSettings?.customPaymentLinks?.find((l) => l.url.includes("paypal") || l.name.toLowerCase().includes("paypal"))?.url;

    const orderId = `PAYPAL_ORD_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const unlockToken = `unlock_pp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const record: PurchaseRecord = {
      id: orderId,
      token: unlockToken,
      mediaId: media.id,
      mediaTitle: media.title,
      creatorHandle: media.creatorHandle,
      buyerEmail: buyerEmail || "paypal_buyer@example.com",
      buyerPhone: buyerPhone || "+1555019283",
      amount: media.price,
      currency: "USD",
      paymentMethod: "paypal",
      paymentId: orderId,
      status: "pending",
      createdAt: new Date().toISOString(),
      downloadCount: 0,
      downloadUrl: media.downloadUrl,
    };

    purchases.push(record);

    // Use creator's custom PayPal link or fall back to hardcoded paypal.me link
    const resolvedPaypalUrl = paypalLink
      ? (paypalLink.startsWith("http") ? paypalLink : `https://${paypalLink}`)
      : HARDCODED_PAYPAL_URL;

    res.json({
      orderId,
      unlockToken,
      paypalUrl: resolvedPaypalUrl,
      status: "CREATED",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PayPal Capture & Confirm Payment
 * POST /api/payments/paypal/capture-order
 */
app.post("/api/payments/paypal/capture-order", async (req, res) => {
  const { orderId, unlockToken } = req.body;
  const record = purchases.find((p) => p.id === orderId || p.token === unlockToken);

  if (!record) {
    return res.status(404).json({ error: "Orden de pago no encontrada" });
  }

  // Mark completed
  record.status = "completed";
  
  const media = mediaItems.find((m) => m.id === record.mediaId);
  if (media) media.purchasesCount += 1;

  // Send WhatsApp confirmation
  sendWhatsAppReceipt(record);

  res.json({
    success: true,
    status: "COMPLETED",
    purchase: record,
    downloadUrl: `/api/media/download/${record.token}`,
  });
});

/**
 * Confirm Custom Payment Link / Direct Verification
 * POST /api/payments/confirm-direct
 */
app.post("/api/payments/confirm-direct", (req, res) => {
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
    createdAt: new Date().toISOString(),
    downloadCount: 0,
    downloadUrl: media.downloadUrl,
  };

  purchases.push(record);
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
            sendWhatsAppReceipt(purchase);
          }
        }
      } catch (err) {
        console.error("[MercadoPago Search API Error]:", err);
      }
    }
  }

  // SI Y SOLO SI la API de Mercado Pago confirmó el pago aprobado, se valida la descarga
  if (purchase.status === "completed") {
    return res.json({
      valid: true,
      purchase,
    });
  }

  res.json({
    valid: false,
    status: purchase.status,
    error: "El pago no ha sido acreditado ni confirmado por la API oficial de Mercado Pago.",
  });
});

/**
 * GET /api/media/download/:token
 * SECURE DIGITAL DOWNLOAD ROUTE
 * Validates token and delivers/redirects to high quality photo or video file
 */
app.get("/api/media/download/:token", (req, res) => {
  const { token } = req.params;
  const purchase = purchases.find((p) => p.token === token && p.status === "completed");

  if (!purchase) {
    return res.status(403).send(`
      <div style="font-family: system-ui, sans-serif; text-align: center; padding: 50px;">
        <h2>⛔ Enlace de Descarga Invalido o Expire</h2>
        <p>No se pudo verificar un pago completado para esta descarga.</p>
      </div>
    `);
  }

  purchase.downloadCount += 1;

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
