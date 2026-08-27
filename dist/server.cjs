var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_supabase_js = require("@supabase/supabase-js");

// src/data/mockData.ts
var INITIAL_CREATORS = [
  {
    id: "creator_1",
    handle: "angelina69",
    name: "Angelina69 \u{1F525}",
    title: "Model & Digital Creator",
    bio: "Bienvenido a mi espacio exclusivo \u{1F48B} Contenido diario, fotos HD y videos 4K sin censura.",
    avatar: "https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg",
    banner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    themeColor: "from-pink-600 via-purple-600 to-indigo-700",
    badge: "TOP 0.1% CREATOR",
    blockedCountries: ["ES"],
    // Blocks Spain by default for demonstration
    blockedMessage: "\u26D4 Contenido no disponible en tu ubicaci\xF3n geogr\xE1fica por privacidad de la creadora.",
    whatsappNumber: "+5491155443322",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    links: [
      { id: "l0", title: "OnlyFans Oficial \u{1F525} (@angelinax69)", url: "https://onlyfans.com/angelinax69", icon: "OnlyFans", active: true, clicks: 4920 },
      { id: "l1", title: "Instagram Oficial \u{1F4F8} (@angiemgp69)", url: "https://instagram.com/angiemgp69", icon: "Instagram", active: true, clicks: 3410 },
      { id: "l2", title: "Link.me Oficial \u{1F517}", url: "https://link.me/angelina69", icon: "Globe", active: true, clicks: 1850 },
      { id: "l3", title: "Telegram VIP Gratis \u{1F4AC}", url: "https://t.me/example_channel", icon: "Telegram", active: true, clicks: 1240 },
      { id: "l4", title: "TikTok Oficial \u{1F3B5}", url: "https://tiktok.com", icon: "TikTok", active: true, clicks: 2150 }
    ],
    paymentSettings: {
      mercadoPagoAccessToken: "APP_USR-7257482411293311-080712-ada9bb187061cb3d57c277c19d3916bc-3553496952",
      mercadoPagoPublicKey: "",
      payPalClientId: "BAA8Frtu5JFlsHO30PzjEf0J23mdxSEfhSCZbeZrGfcskv7jBXDkYQR5U4Tv3sUApF5z64ONWtUdGfwf44",
      payPalClientSecret: "EBQBiVbmbih6qKanhmwkI0RwbiHWKolXovHRMu2DSGcigFTkwHS5J5AafOqMMXJO46goCK2sWZjQNFDw",
      payPalMode: "live",
      customPaymentLinks: [
        { id: "c2", name: "Payoneer Direct", url: "https://payoneer.com/angelina69", currency: "USD" }
      ]
    }
  },
  {
    id: "creator_2",
    handle: "sofia_creator",
    name: "Sofia Fitness & Glam \u{1F5A4}",
    title: "Fitness Model & Lifestyle",
    bio: "Rutinas exclusivas, backstage de sesiones fotogr\xE1ficas y contenido no publicado en redes.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    themeColor: "from-amber-500 via-rose-600 to-red-700",
    badge: "FITNESS VIP",
    blockedCountries: ["AR"],
    // Blocks Argentina by default
    blockedMessage: "\u26A0\uFE0F Este perfil no est\xE1 disponible en Argentina seg\xFAn las preferencias del usuario.",
    whatsappNumber: "+573009988776",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    links: [
      { id: "l5", title: "Plan de Entrenamiento PDF \u{1F3CB}\uFE0F\u200D\u2640\uFE0F", url: "https://example.com/fit", icon: "Dumbbell", active: true, clicks: 620 },
      { id: "l6", title: "Instagram Personal \u{1F31F}", url: "https://instagram.com", icon: "Instagram", active: true, clicks: 1890 }
    ],
    paymentSettings: {
      mercadoPagoAccessToken: "",
      mercadoPagoPublicKey: "",
      payPalClientId: "sb-sofia-paypal",
      payPalClientSecret: "sb-secret",
      payPalMode: "sandbox",
      customPaymentLinks: []
    }
  }
];
var INITIAL_MEDIA_ITEMS = [
  {
    id: "acceso_full_cat_actual",
    creatorId: "creator_1",
    creatorHandle: "angelina69",
    title: "\u{1F451} ACCESO FULL \u2014 Desbloquear Cat\xE1logo Actual",
    description: "Acceso inmediato a todas las fotos y videos publicados hasta la fecha.",
    type: "bundle",
    price: 50,
    currency: "USD",
    previewUrl: "https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg",
    downloadUrl: "https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg",
    fileSize: "COMPLETO",
    duration: "ILIMITADO",
    purchasesCount: 920,
    isFeatured: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "media_101",
    creatorId: "creator_1",
    creatorHandle: "angelina69",
    title: "\u{1F525} Video Exclusivo Beach Session 4K (Full Uncut)",
    description: "Video completo de 15 minutos grabado en alta definici\xF3n 4K en la playa sin censura. Incluye descarga directa inmediata.",
    type: "video",
    price: 15,
    currency: "USD",
    previewUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    fileSize: "1.2 GB",
    duration: "15:20 min",
    purchasesCount: 84,
    isFeatured: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "media_102",
    creatorId: "creator_1",
    creatorHandle: "angelina69",
    title: "\u{1F4F8} Set de Fotos Boudoir Lingerie (35 Fotos HD)",
    description: "Colecci\xF3n de 35 fotograf\xEDas exclusivas en resoluci\xF3n ultra alta 8K. Desbloquea el paquete completo en ZIP.",
    type: "photo",
    price: 9.99,
    currency: "USD",
    previewUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    downloadUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1920&q=90",
    fileSize: "180 MB",
    itemCount: 35,
    purchasesCount: 142,
    isFeatured: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "media_103",
    creatorId: "creator_1",
    creatorHandle: "angelina69",
    title: "\u{1F3A5} Backstage VIP Private Shoot + Chat Exclusivo",
    description: "Detr\xE1s de escena in\xE9dito de la sesi\xF3n privada + acceso directo a chat de WhatsApp de la creadora.",
    type: "bundle",
    price: 24.99,
    currency: "USD",
    previewUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    fileSize: "2.4 GB",
    duration: "22:10 min",
    itemCount: 2,
    purchasesCount: 57,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "media_201",
    creatorId: "creator_2",
    creatorHandle: "sofia_creator",
    title: "\u26A1 Workout Routine Video & Photobook High Res",
    description: "Video guiado de 30 minutos + libro digital interactivo con ejercicios de tonificaci\xF3n.",
    type: "video",
    price: 12.5,
    currency: "USD",
    previewUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    fileSize: "850 MB",
    duration: "28:45 min",
    purchasesCount: 39,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];

// src/data/countries.ts
var COUNTRIES_LIST = [
  { code: "AR", name: "Argentina", flag: "\u{1F1E6}\u{1F1F7}" },
  { code: "ES", name: "Espa\xF1a", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "MX", name: "M\xE9xico", flag: "\u{1F1F2}\u{1F1FD}" },
  { code: "CO", name: "Colombia", flag: "\u{1F1E8}\u{1F1F4}" },
  { code: "CL", name: "Chile", flag: "\u{1F1E8}\u{1F1F1}" },
  { code: "PE", name: "Per\xFA", flag: "\u{1F1F5}\u{1F1EA}" },
  { code: "US", name: "Estados Unidos", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "BR", name: "Brasil", flag: "\u{1F1E7}\u{1F1F7}" },
  { code: "UY", name: "Uruguay", flag: "\u{1F1FA}\u{1F1FE}" },
  { code: "EC", name: "Ecuador", flag: "\u{1F1EA}\u{1F1E8}" },
  { code: "VE", name: "Venezuela", flag: "\u{1F1FB}\u{1F1EA}" },
  { code: "BO", name: "Bolivia", flag: "\u{1F1E7}\u{1F1F4}" },
  { code: "PY", name: "Paraguay", flag: "\u{1F1F5}\u{1F1FE}" },
  { code: "CR", name: "Costa Rica", flag: "\u{1F1E8}\u{1F1F7}" },
  { code: "PA", name: "Panam\xE1", flag: "\u{1F1F5}\u{1F1E6}" },
  { code: "DO", name: "Rep\xFAblica Dominicana", flag: "\u{1F1E9}\u{1F1F4}" },
  { code: "GB", name: "Reino Unido", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "DE", name: "Alemania", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "FR", name: "Francia", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "IT", name: "Italia", flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "CA", name: "Canad\xE1", flag: "\u{1F1E8}\u{1F1E6}" }
];

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://eqpabbrmdssgoaaqtkgu.supabase.co";
var SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxcGFiYnJtZHNzZ29hYXF0a2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDk2NTMsImV4cCI6MjEwMTY4NTY1M30.K09vvdfxkuBxd64RuQey9KV13Yz20fBBPkbWQOGGodQ";
var supabase = (0, import_supabase_js.createClient)(SUPABASE_URL, SUPABASE_KEY);
var creators = [...INITIAL_CREATORS];
var mediaItems = [...INITIAL_MEDIA_ITEMS];
var purchases = [];
var paymentMethodsVisibility = {
  mercadopago: true,
  paypal: true,
  paypal_telegram: true,
  nequi_usa: true
};
function fromSupabaseCreator(row) {
  const initial = INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === row.handle?.toLowerCase());
  const initialSettings = initial?.paymentSettings || {};
  return {
    id: row.id || "creator_1",
    handle: row.handle || "angelina69",
    name: row.name || initial?.name || "Angelina VIP",
    title: row.title || initial?.title || "Contenido Exclusivo \u{1F51E}",
    bio: row.bio || initial?.bio || "",
    avatar: row.avatar || initial?.avatar || "",
    banner: row.banner || initial?.banner || "",
    themeColor: row.theme_color || initial?.themeColor || "from-purple-600 via-pink-600 to-amber-500",
    badge: row.badge || initial?.badge || "CREADOR OFICIAL",
    blockedCountries: row.blocked_countries || initial?.blockedCountries || ["CO"],
    blockedMessage: row.blocked_message || initial?.blockedMessage || "Este perfil no est\xE1 disponible en tu regi\xF3n.",
    whatsappNumber: row.whatsapp_number || initial?.whatsappNumber || "",
    storeMode: row.store_mode || row.data?.storeMode || initial?.storeMode || "subscription",
    links: row.links ? typeof row.links === "string" ? JSON.parse(row.links) : row.links : initial?.links || [],
    paymentSettings: {
      mercadoPagoAccessToken: row.mercadopago_access_token || initialSettings.mercadoPagoAccessToken || "",
      mercadoPagoPublicKey: row.mercadopago_public_key || initialSettings.mercadoPagoPublicKey || "",
      payPalClientId: row.paypal_client_id || initialSettings.payPalClientId || "",
      payPalClientSecret: row.paypal_client_secret || initialSettings.payPalClientSecret || "",
      payPalMode: row.paypal_mode || initialSettings.payPalMode || "live",
      customPaymentLinks: row.custom_payment_links ? typeof row.custom_payment_links === "string" ? JSON.parse(row.custom_payment_links) : row.custom_payment_links : initialSettings.customPaymentLinks || []
    },
    createdAt: row.created_at || (/* @__PURE__ */ new Date()).toISOString()
  };
}
function toSupabaseCreator(creator) {
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
    blocked_message: creator.blockedMessage || "Contenido no disponible en tu regi\xF3n.",
    whatsapp_number: creator.whatsappNumber || "",
    links: creator.links || [],
    payment_settings: creator.paymentSettings || {},
    data: {
      themeColor: creator.themeColor,
      blockedCountries: creator.blockedCountries,
      blockedMessage: creator.blockedMessage
    }
  };
}
function fromSupabaseMedia(row) {
  return {
    id: row.id,
    creatorId: row.creator_id,
    creatorHandle: row.creator_handle,
    title: row.title,
    description: row.description || "",
    type: row.type || "video",
    price: Number(row.price),
    currency: row.currency || "USD",
    previewUrl: row.preview_url || row.data?.previewUrl || "",
    downloadUrl: row.content_url || row.download_url || row.data?.downloadUrl || "",
    fileSize: row.file_size || "",
    duration: row.duration || "",
    purchasesCount: row.sales_count || row.data?.purchasesCount || 0,
    isFeatured: row.data?.isFeatured || false,
    createdAt: row.created_at || (/* @__PURE__ */ new Date()).toISOString()
  };
}
function toSupabaseMedia(item) {
  return {
    id: item.id,
    creator_id: item.creatorId || "creator_1",
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
function fromSupabasePurchase(row) {
  return {
    id: row.id,
    token: row.token,
    mediaId: row.media_id,
    mediaTitle: row.media_title || "",
    creatorHandle: row.creator_handle || "",
    buyerEmail: row.buyer_email || "",
    buyerPhone: row.buyer_phone || "",
    amount: Number(row.amount || 0),
    currency: row.currency || "USD",
    paymentMethod: row.payment_method || "link",
    paymentId: row.payment_id || "",
    status: row.status || "pending",
    ipAddress: row.ip_address || "",
    createdAt: row.created_at || (/* @__PURE__ */ new Date()).toISOString(),
    downloadCount: row.download_count || 0,
    downloadUrl: row.download_url || ""
  };
}
function toSupabasePurchase(record) {
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
    ip_address: record.ipAddress || "",
    download_count: record.downloadCount || 0,
    download_url: record.downloadUrl,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function savePurchase(record) {
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
function getClientIp(req) {
  const rawIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";
  return rawIp.replace(/^::ffff:/, "").trim();
}
async function syncFromSupabase() {
  try {
    const { data: dbCreators, error: cErr } = await supabase.from("creators").select("*");
    if (!cErr && dbCreators && dbCreators.length > 0) {
      creators = dbCreators.map(fromSupabaseCreator);
      console.log(`[Supabase DB] Loaded ${creators.length} creator profiles.`);
    }
    try {
      const { data: dbLinks, error: lErr } = await supabase.from("creator_links").select("*");
      if (!lErr && dbLinks && dbLinks.length > 0) {
        dbLinks.forEach((row) => {
          const creator = creators.find((c) => c.handle.toLowerCase() === (row.creator_handle || "").toLowerCase());
          if (creator) {
            const existingIdx = creator.links.findIndex((l) => l.id === row.id);
            const mappedLink = {
              id: row.id,
              title: row.title,
              url: row.url,
              icon: row.icon || "Link",
              active: row.active !== false,
              clicks: row.clicks || 0
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
    try {
      const { data: dbBlockedIps, error: bErr } = await supabase.from("blocked_ips").select("*");
      if (!bErr && dbBlockedIps) {
        dbBlockedIps.forEach((b) => {
          if (b.ip_address) blockedIps.add(b.ip_address.trim());
        });
        console.log(`[Supabase DB] Loaded ${blockedIps.size} blocked IPs.`);
      }
    } catch (_err) {
    }
    try {
      const { data: dbBlockedDevices, error: dErr } = await supabase.from("blocked_devices").select("*");
      if (!dErr && dbBlockedDevices) {
        dbBlockedDevices.forEach((d) => {
          if (d.device_hash) blockedDevices.add(d.device_hash.trim());
        });
        console.log(`[Supabase DB] Loaded ${blockedDevices.size} blocked devices.`);
      }
    } catch (_err) {
    }
    try {
      const { data: dbSetting } = await supabase.from("lead_capture_settings").select("*").eq("id", "default").single();
      if (dbSetting && typeof dbSetting.require_lead_capture === "boolean") {
        requireLeadCapture = dbSetting.require_lead_capture;
        console.log(`[Supabase DB] Loaded requireLeadCapture: ${requireLeadCapture}`);
      }
    } catch (_err) {
    }
    try {
      const { data: dbVis } = await supabase.from("payment_methods_visibility").select("*").limit(1);
      if (dbVis && dbVis.length > 0) {
        const row = dbVis[0];
        paymentMethodsVisibility = {
          mercadopago: typeof row.mercadopago === "boolean" ? row.mercadopago : true,
          paypal: typeof row.paypal === "boolean" ? row.paypal : true,
          paypal_telegram: typeof row.paypal_telegram === "boolean" ? row.paypal_telegram : true,
          nequi_usa: typeof row.nequi_usa === "boolean" ? row.nequi_usa : true
        };
        console.log(`[Supabase DB] Loaded paymentMethodsVisibility:`, paymentMethodsVisibility);
      }
    } catch (_err) {
    }
    const { data: dbMedia, error: mErr } = await supabase.from("media_items").select("*");
    if (!mErr && dbMedia && dbMedia.length > 0) {
      mediaItems = dbMedia.map(fromSupabaseMedia);
      console.log(`[Supabase DB] Loaded ${mediaItems.length} media items from Supabase.`);
    }
    const { data: dbPurchases, error: pErr } = await supabase.from("purchases").select("*");
    if (!pErr && dbPurchases) {
      purchases = dbPurchases.map(fromSupabasePurchase);
      console.log(`[Supabase DB] Loaded ${purchases.length} purchase records.`);
    }
  } catch (err) {
    console.warn("[Supabase Sync Warning]", err);
  }
}
syncFromSupabase();
function getCountryDetails(code) {
  const match = COUNTRIES_LIST.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (match) return match;
  return { code: code.toUpperCase(), name: code.toUpperCase(), flag: "\u{1F310}" };
}
var ipCountryCache = /* @__PURE__ */ new Map();
async function detectCountryCode(req) {
  const simulatedCountry = req.query.simulate_country || req.query.country;
  if (simulatedCountry && simulatedCountry.trim() !== "") {
    return simulatedCountry.trim().toUpperCase();
  }
  const rawIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "";
  const clientIp = rawIp.replace(/^::ffff:/, "").trim();
  const isLocalIp = !clientIp || clientIp === "::1" || clientIp === "127.0.0.1" || clientIp.startsWith("192.168.") || clientIp.startsWith("10.") || clientIp.startsWith("172.");
  const cacheKey = isLocalIp ? "LOCAL_PUBLIC_IP" : clientIp;
  if (ipCountryCache.has(cacheKey)) {
    return ipCountryCache.get(cacheKey);
  }
  try {
    const lookupUrl = isLocalIp ? "https://api.country.is/" : `https://api.country.is/${clientIp}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2e3);
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
  if (clientIp.startsWith("181.") || clientIp.startsWith("190.") || clientIp.startsWith("191.") || clientIp.startsWith("186.")) return "CO";
  if (clientIp.startsWith("80.") || clientIp.startsWith("81.")) return "ES";
  if (clientIp.startsWith("187.")) return "MX";
  return "CO";
}
app.get("/api/geoip", async (req, res) => {
  const countryCode = await detectCountryCode(req);
  const details = getCountryDetails(countryCode);
  const simulatedCountry = req.query.simulate_country;
  res.json({
    ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "Detected",
    countryCode: details.code,
    countryName: details.name,
    city: simulatedCountry ? "Simulated Location" : "Detected Location",
    isSimulated: Boolean(simulatedCountry)
  });
});
var blockedIps = /* @__PURE__ */ new Set(["138.84.41.212"]);
var blockedDevices = /* @__PURE__ */ new Set();
app.get("/api/creators/:handle/check-access", async (req, res) => {
  const { handle } = req.params;
  let creator = creators.find((c) => c.handle.toLowerCase() === handle.toLowerCase());
  if (!creator) {
    try {
      const { data } = await supabase.from("creators").select("*").eq("handle", handle.toLowerCase()).single();
      if (data) {
        creator = fromSupabaseCreator(data);
      }
    } catch {
    }
  }
  if (!creator) {
    return res.status(404).json({ error: "Perfil de creador no encontrado" });
  }
  const countryCode = await detectCountryCode(req);
  const countryInfo = getCountryDetails(countryCode);
  const clientIp = getClientIp(req);
  const clientTz = req.query.tz || "";
  const deviceHash = req.query.dh || "";
  const isDeviceBlocked = Boolean(deviceHash && blockedDevices.has(deviceHash.trim()));
  const isColombiaBlocked = (creator.blockedCountries || []).some((c) => c.toUpperCase() === "CO");
  const isColombianTimezone = clientTz.includes("Bogota") || clientTz.includes("GMT-5") || clientTz.includes("America/Guayaquil") || clientTz.includes("America/Lima");
  const isVpnBypass = isColombiaBlocked && isColombianTimezone && countryCode !== "CO";
  const isIpExplicitlyBlocked = blockedIps.has(clientIp) || clientIp.startsWith("138.84.") || (creator.blockedIps || []).includes(clientIp);
  const isBlocked = isDeviceBlocked || isVpnBypass || isIpExplicitlyBlocked || (creator.blockedCountries || []).some(
    (code) => code.toUpperCase() === countryCode.toUpperCase()
  );
  res.json({
    allowed: !isBlocked,
    visitorCountry: countryInfo.code,
    visitorCountryName: countryInfo.name,
    visitorCountryFlag: countryInfo.flag,
    blockedCountries: creator.blockedCountries || [],
    blockedMessage: creator.blockedMessage || "Contenido no disponible en tu regi\xF3n.",
    vpnDetected: isVpnBypass
  });
});
app.post("/api/creators/block-ip", async (req, res) => {
  const { handle, ipAddress, deviceHash, reason } = req.body;
  if (!ipAddress && !deviceHash) {
    return res.status(400).json({ error: "La direcci\xF3n IP o Huella de dispositivo es obligatoria" });
  }
  if (ipAddress) {
    const cleanIp = ipAddress.trim();
    blockedIps.add(cleanIp);
    try {
      const payload = {
        id: `block_${cleanIp.replace(/[^a-z0-9]/gi, "_")}`,
        ip_address: cleanIp,
        creator_handle: handle || "angelina69",
        reason: reason || "Bloqueo manual desde Historial de Ventas",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
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
        id: `dev_${cleanHash.replace(/[^a-z0-9]/gi, "_")}`,
        device_hash: cleanHash,
        creator_handle: handle || "angelina69",
        reason: reason || "Bloqueo por huella digital de dispositivo / VPN",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      await supabase.from("blocked_devices").upsert(payload);
    } catch (err) {
      console.warn("[Supabase blocked_devices Save Warning]", err);
    }
  }
  console.log(`[Block Action] IP '${ipAddress || "none"}' and Device '${deviceHash || "none"}' have been blocked.`);
  res.json({ success: true, message: `IP y Dispositivo bloqueados exitosamente y guardados en Supabase.` });
});
app.get("/api/creators", (req, res) => {
  res.json(creators);
});
app.get("/api/creators/:handle", (req, res) => {
  const { handle } = req.params;
  const creator = creators.find((c) => c.handle.toLowerCase() === handle.toLowerCase());
  if (!creator) {
    return res.status(404).json({ error: "Creador no encontrado" });
  }
  const items = mediaItems.filter((m) => m.creatorHandle.toLowerCase() === handle.toLowerCase());
  res.json({
    creator,
    mediaItems: items
  });
});
app.post("/api/creators", async (req, res) => {
  const profileData = req.body;
  if (!profileData.handle || !profileData.name) {
    return res.status(400).json({ error: "El nombre y handle son obligatorios" });
  }
  profileData.handle = profileData.handle.toLowerCase().replace(/[^a-z0-9_]/g, "");
  const existingIndex = creators.findIndex((c) => c.handle === profileData.handle || c.id === profileData.id);
  if (existingIndex >= 0) {
    creators[existingIndex] = { ...creators[existingIndex], ...profileData };
  } else {
    profileData.id = profileData.id || `creator_${Date.now()}`;
    profileData.createdAt = (/* @__PURE__ */ new Date()).toISOString();
    creators.push(profileData);
  }
  try {
    const supabasePayload = toSupabaseCreator(profileData);
    if (Array.isArray(profileData.links) && profileData.links.length > 0) {
      try {
        const linksPayload = profileData.links.map((link) => ({
          id: link.id,
          creator_handle: profileData.handle,
          title: link.title,
          url: link.url,
          icon: link.icon,
          active: link.active !== false,
          clicks: link.clicks || 0
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
app.post("/api/media", async (req, res) => {
  const item = req.body;
  if (!item.title || !item.price || !item.creatorHandle) {
    return res.status(400).json({ error: "T\xEDtulo, precio y creador son requeridos" });
  }
  const existingIndex = mediaItems.findIndex((m) => m.id === item.id);
  if (existingIndex >= 0) {
    mediaItems[existingIndex] = { ...mediaItems[existingIndex], ...item };
  } else {
    item.id = item.id || `media_${Date.now()}`;
    item.purchasesCount = 0;
    item.createdAt = (/* @__PURE__ */ new Date()).toISOString();
    mediaItems.push(item);
  }
  try {
    const supabasePayload = toSupabaseMedia(item);
    await supabase.from("media_items").upsert(supabasePayload);
  } catch (err) {
    console.error("[Supabase Media Sync Error]", err);
  }
  res.json({ success: true, item });
});
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
app.post("/api/payments/mercadopago/create-preference", async (req, res) => {
  try {
    const { mediaId, buyerEmail, buyerPhone, price: customPrice } = req.body;
    let media = mediaItems.find((m) => m.id === mediaId);
    if (!media && (mediaId === "acceso_full_cat_actual" || mediaId?.includes("acceso_full"))) {
      media = INITIAL_MEDIA_ITEMS.find((m) => m.id === "acceso_full_cat_actual") || {
        id: "acceso_full_cat_actual",
        creatorId: "creator_1",
        creatorHandle: "angelina69",
        title: "\u{1F451} ACCESO FULL \u2014 Desbloquear Cat\xE1logo Actual",
        description: "Acceso inmediato a todas las fotos y videos publicados hasta la fecha.",
        type: "bundle",
        price: 50,
        currency: "USD",
        previewUrl: "https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg",
        downloadUrl: "https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg",
        fileSize: "COMPLETO",
        duration: "ILIMITADO",
        purchasesCount: 920,
        isFeatured: true,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    if (!media) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }
    const creator = creators.find((c) => c.handle.toLowerCase() === media.creatorHandle.toLowerCase()) || INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === media.creatorHandle.toLowerCase());
    let accessToken = creator?.paymentSettings?.mercadoPagoAccessToken?.trim();
    if (!accessToken || accessToken.includes("xxxxxx") || accessToken.length < 15) {
      accessToken = "APP_USR-7257482411293311-080712-ada9bb187061cb3d57c277c19d3916bc-3553496952";
    }
    const purchaseId = `mp_purch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const unlockToken = `unlock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const effectivePrice = customPrice && Number(customPrice) > 0 ? Number(customPrice) : Number(media.price);
    const record = {
      id: purchaseId,
      token: unlockToken,
      mediaId: media.id,
      mediaTitle: media.title,
      creatorHandle: media.creatorHandle,
      buyerEmail: buyerEmail || "",
      buyerPhone: buyerPhone || "",
      amount: effectivePrice,
      currency: media.currency,
      paymentMethod: "mercadopago",
      paymentId: purchaseId,
      status: "pending",
      ipAddress: getClientIp(req),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      downloadCount: 0,
      downloadUrl: media.downloadUrl
    };
    await savePurchase(record);
    const validEmail = buyerEmail && buyerEmail.trim().includes("@") ? buyerEmail.trim() : null;
    const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "https";
    const host = req.headers.host || "geolink-3tze.onrender.com";
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const isUsd = media.currency === "USD";
    const copUnitPrice = isUsd ? Math.round(effectivePrice * 3500) : Math.round(effectivePrice);
    try {
      const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          items: [
            {
              id: String(media.id),
              title: String(media.title),
              quantity: 1,
              currency_id: "COP",
              unit_price: copUnitPrice
            }
          ],
          ...validEmail ? { payer: { email: validEmail } } : {},
          auto_return: "approved",
          back_urls: {
            success: `${baseUrl}?payment=success&token=${unlockToken}`,
            failure: `${baseUrl}?payment=failure`,
            pending: `${baseUrl}?payment=pending`
          },
          ...baseUrl.startsWith("https") ? { notification_url: `${baseUrl}/api/payments/mercadopago/webhook` } : {},
          external_reference: purchaseId
        })
      });
      if (mpResponse.ok) {
        const mpData = await mpResponse.json();
        return res.json({
          init_point: mpData.init_point || mpData.sandbox_init_point,
          preferenceId: mpData.id,
          purchaseId,
          unlockToken
        });
      } else {
        const errJson = await mpResponse.json().catch(() => ({}));
        console.error("[MercadoPago API Error]:", errJson);
        return res.status(400).json({
          error: `Error de API MercadoPago: ${errJson.message || errJson.error || "Preferencias inv\xE1lidas"}`
        });
      }
    } catch (err) {
      console.error("Error conectando con API MercadoPago:", err);
      return res.status(500).json({ error: "No se pudo conectar con la API de Mercado Pago." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Error procesando Mercado Pago" });
  }
});
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
          } catch {
          }
        }
      }
    }
  } catch (err) {
    console.error("[MercadoPago Webhook Error]", err);
  }
  res.status(200).send("OK");
});
async function getPayPalAccessToken(clientId, clientSecret) {
  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`
      },
      body: "grant_type=client_credentials"
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
app.post("/api/payments/paypal/create-order", async (req, res) => {
  try {
    const { mediaId, buyerEmail, buyerPhone } = req.body;
    let media = mediaItems.find((m) => m.id === mediaId);
    if (!media && (mediaId === "acceso_full_cat_actual" || mediaId?.includes("acceso_full"))) {
      media = INITIAL_MEDIA_ITEMS.find((m) => m.id === "acceso_full_cat_actual") || {
        id: "acceso_full_cat_actual",
        creatorId: "creator_1",
        creatorHandle: "angelina69",
        title: "\u{1F451} ACCESO FULL \u2014 Desbloquear Cat\xE1logo Actual",
        description: "Acceso inmediato a todas las fotos y videos publicados hasta la fecha.",
        type: "bundle",
        price: 50,
        currency: "USD",
        previewUrl: "https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg",
        downloadUrl: "https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg",
        fileSize: "COMPLETO",
        duration: "ILIMITADO",
        purchasesCount: 920,
        isFeatured: true,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    if (!media) return res.status(404).json({ error: "Contenido no encontrado" });
    const creator = creators.find((c) => c.handle.toLowerCase() === media.creatorHandle.toLowerCase()) || INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === media.creatorHandle.toLowerCase());
    const clientId = creator?.paymentSettings?.payPalClientId?.trim() || "BAA8Frtu5JFlsHO30PzjEf0J23mdxSEfhSCZbeZrGfcskv7jBXDkYQR5U4Tv3sUApF5z64ONWtUdGfwf44";
    const clientSecret = creator?.paymentSettings?.payPalClientSecret?.trim() || "EBQBiVbmbih6qKanhmwkI0RwbiHWKolXovHRMu2DSGcigFTkwHS5J5AafOqMMXJO46goCK2sWZjQNFDw";
    const protocol = req.headers["x-forwarded-proto"] === "https" ? "https" : "https";
    const host = req.headers.host || "geolink-3tze.onrender.com";
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const purchaseId = `pp_purch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const unlockToken = `unlock_pp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const record = {
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
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      downloadCount: 0,
      downloadUrl: media.downloadUrl
    };
    await savePurchase(record);
    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    if (accessToken) {
      try {
        const orderResponse = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
              {
                reference_id: purchaseId,
                description: media.title,
                amount: {
                  currency_code: "USD",
                  value: Number(media.price).toFixed(2)
                }
              }
            ],
            application_context: {
              brand_name: creator?.name || "Geolink Store",
              landing_page: "LOGIN",
              user_action: "PAY_NOW",
              return_url: `${baseUrl}?payment=paypal_success&token=${unlockToken}`,
              cancel_url: `${baseUrl}?payment=paypal_cancel`
            }
          })
        });
        if (orderResponse.ok) {
          const paypalOrder = await orderResponse.json();
          const approveLink = paypalOrder.links?.find((l) => l.rel === "approve")?.href;
          record.paymentId = paypalOrder.id;
          await savePurchase(record);
          return res.json({
            orderId: paypalOrder.id,
            approveUrl: approveLink || `https://www.paypal.com/checkoutnow?token=${paypalOrder.id}`,
            unlockToken,
            purchaseId,
            status: "CREATED"
          });
        } else {
          const errJson = await orderResponse.json().catch(() => ({}));
          console.error("[PayPal Create Order API Error]:", errJson);
        }
      } catch (err) {
        console.error("[PayPal API Call Error]:", err);
      }
    }
    const paypalLink = creator?.paymentSettings?.customPaymentLinks?.find((l) => l.url.includes("paypal") || l.name.toLowerCase().includes("paypal"))?.url || "https://www.paypal.com/paypalme/angieG473";
    const resolvedPaypalUrl = paypalLink.startsWith("http") ? paypalLink : `https://${paypalLink}`;
    res.json({
      orderId: purchaseId,
      approveUrl: resolvedPaypalUrl,
      unlockToken,
      purchaseId,
      status: "CREATED"
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error procesando PayPal" });
  }
});
app.post("/api/payments/paypal/capture-order", async (req, res) => {
  try {
    const { orderId, unlockToken } = req.body;
    let record = purchases.find((p) => p.token === unlockToken || p.id === orderId || p.paymentId === orderId);
    if (!record && (unlockToken || orderId)) {
      try {
        const { data } = await supabase.from("purchases").select("*").or(`token.eq.${unlockToken || ""},id.eq.${orderId || ""},payment_id.eq.${orderId || ""}`).single();
        if (data) record = fromSupabasePurchase(data);
      } catch {
      }
    }
    if (!record) {
      return res.status(404).json({ error: "Orden de pago no encontrada" });
    }
    if (record.status === "completed") {
      await savePurchase(record);
      return res.json({
        success: true,
        valid: true,
        status: "COMPLETED",
        purchase: record
      });
    }
    const creator = creators.find((c) => c.handle.toLowerCase() === record.creatorHandle.toLowerCase()) || INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === record.creatorHandle.toLowerCase());
    const clientId = creator?.paymentSettings?.payPalClientId?.trim() || "BAA8Frtu5JFlsHO30PzjEf0J23mdxSEfhSCZbeZrGfcskv7jBXDkYQR5U4Tv3sUApF5z64ONWtUdGfwf44";
    const clientSecret = creator?.paymentSettings?.payPalClientSecret?.trim() || "EBQBiVbmbih6qKanhmwkI0RwbiHWKolXovHRMu2DSGcigFTkwHS5J5AafOqMMXJO46goCK2sWZjQNFDw";
    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    const targetOrderId = record.paymentId || orderId;
    if (accessToken && targetOrderId && targetOrderId.length > 5 && !targetOrderId.startsWith("pp_purch_")) {
      try {
        const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${targetOrderId}/capture`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
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
              purchase: record
            });
          }
        } else {
          const orderDetailRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${targetOrderId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
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
                purchase: record
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
      error: "El pago no ha sido confirmado ni completado en la API oficial de PayPal."
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error verificando orden PayPal" });
  }
});
app.post("/api/payments/confirm-direct", async (req, res) => {
  const { mediaId, paymentMethod, referenceNumber, buyerEmail, buyerPhone } = req.body;
  const media = mediaItems.find((m) => m.id === mediaId);
  if (!media) return res.status(404).json({ error: "Contenido no encontrado" });
  const purchaseId = `direct_${Date.now()}`;
  const unlockToken = `unlock_dir_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const record = {
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    downloadCount: 0,
    downloadUrl: media.downloadUrl
  };
  await savePurchase(record);
  media.purchasesCount += 1;
  sendWhatsAppReceipt(record);
  res.json({
    success: true,
    purchase: record,
    downloadUrl: `/api/media/download/${unlockToken}`
  });
});
app.get("/api/purchases/verify/:token", async (req, res) => {
  const { token } = req.params;
  let purchase = purchases.find((p) => p.token === token || p.id === token);
  if (!purchase && token) {
    try {
      const { data } = await supabase.from("purchases").select("*").or(`token.eq.${token},id.eq.${token}`).single();
      if (data) purchase = fromSupabasePurchase(data);
    } catch {
    }
  }
  if (!purchase) {
    return res.status(404).json({
      valid: false,
      error: "Token de descarga inv\xE1lido o compra no encontrada"
    });
  }
  if (purchase.status !== "completed" && purchase.paymentMethod === "mercadopago") {
    const creator = creators.find((c) => c.handle.toLowerCase() === purchase.creatorHandle.toLowerCase()) || INITIAL_CREATORS.find((c) => c.handle.toLowerCase() === purchase.creatorHandle.toLowerCase());
    const accessToken = creator?.paymentSettings?.mercadoPagoAccessToken?.trim() || process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || "APP_USR-7257482411293311-080712-ada9bb187061cb3d57c277c19d3916bc-3553496952";
    if (accessToken && accessToken.length > 5) {
      try {
        const mpSearchRes = await fetch(`https://api.mercadopago.com/v1/payments/search?external_reference=${encodeURIComponent(purchase.id)}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (mpSearchRes.ok) {
          const searchData = await mpSearchRes.json();
          const approvedPayment = searchData.results?.find((p) => p.status === "approved" || p.status === "accredited");
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
  if (purchase.status === "completed") {
    await savePurchase(purchase);
    return res.json({
      valid: true,
      purchase
    });
  }
  res.json({
    valid: false,
    status: purchase.status,
    error: "El pago no ha sido acreditado ni confirmado por la API oficial."
  });
});
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
    try {
      const { data: dbRecord } = await supabase.from("purchases").select("*").or(`token.eq.${targetKey},id.eq.${targetKey},payment_id.eq.${targetKey}`).single();
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
  } catch (err) {
    res.status(500).json({ error: err.message || "Error al aprobar la compra manualmente." });
  }
});
app.get("/api/purchases/unlocked-items", async (req, res) => {
  try {
    const clientIp = getClientIp(req);
    const tokensParam = (req.query.tokens || "").split(",").filter(Boolean);
    let dbMatches = [];
    try {
      const { data: dbData, error } = await supabase.from("purchases").select("*").eq("status", "completed");
      if (!error && dbData && dbData.length > 0) {
        const mapped = dbData.map(fromSupabasePurchase);
        dbMatches = mapped.filter(
          (p) => p.status === "completed" && (clientIp && p.ipAddress === clientIp || clientIp && p.ipAddress && clientIp.includes(p.ipAddress) || tokensParam.includes(p.token) || tokensParam.includes(p.id))
        );
      }
    } catch (dbErr) {
      console.warn("[Supabase Unlocked Items Warning]", dbErr);
    }
    const memMatches = purchases.filter(
      (p) => p.status === "completed" && (clientIp && p.ipAddress === clientIp || tokensParam.includes(p.token) || tokensParam.includes(p.id))
    );
    const map = /* @__PURE__ */ new Map();
    [...dbMatches, ...memMatches].forEach((p) => map.set(p.id, p));
    const allMatches = Array.from(map.values());
    const validFullAccessPurchase = allMatches.find((p) => {
      if (p.mediaId !== "acceso_full_cat_actual" && !p.mediaId?.includes("acceso_full") && p.mediaId !== "vip_membership_monthly") return false;
      if (p.expiresAt) {
        const expTime = new Date(p.expiresAt).getTime();
        if (Date.now() > expTime) return false;
      } else if (p.createdAt) {
        const purchaseTime = new Date(p.createdAt).getTime();
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1e3;
        if (Date.now() > purchaseTime + thirtyDaysMs) return false;
      }
      return true;
    });
    let unlockedMediaIds = Array.from(new Set(allMatches.map((p) => p.mediaId)));
    const unlockedTokensMap = {};
    if (validFullAccessPurchase) {
      const fullAccessToken = validFullAccessPurchase.token || "full_access";
      const purchaseTime = validFullAccessPurchase.createdAt ? new Date(validFullAccessPurchase.createdAt).getTime() : Date.now();
      mediaItems.forEach((item) => {
        const itemTime = item.createdAt ? new Date(item.createdAt).getTime() : 0;
        if (!item.isExtraPremium && itemTime <= purchaseTime) {
          if (!unlockedMediaIds.includes(item.id)) {
            unlockedMediaIds.push(item.id);
          }
          unlockedTokensMap[item.id] = fullAccessToken;
        }
      });
    } else {
      allMatches.forEach((p) => {
        unlockedTokensMap[p.mediaId] = p.token;
      });
    }
    res.json({
      clientIp,
      unlockedMediaIds,
      unlockedTokensMap,
      purchases: allMatches
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error al verificar compras por IP" });
  }
});
var visitorLeads = [];
app.post("/api/visitor-leads", async (req, res) => {
  try {
    const { contactInfo, countryCode, deviceHash } = req.body;
    const finalContact = contactInfo && contactInfo.trim().length >= 3 ? contactInfo.trim() : "Captura Silenciosa por IP";
    const clientIp = getClientIp(req);
    const detectIpCountry = countryCode || await detectCountryCode(req);
    const cleanPhone = (finalContact || "").replace(/[^0-9+]/g, "");
    const isColombiaPhone = cleanPhone.startsWith("+57") || cleanPhone.startsWith("57") || cleanPhone.length >= 10 && cleanPhone.startsWith("3");
    if (isColombiaPhone && detectIpCountry !== "CO") {
      console.warn(`[Anti-VPN Phone Evasion] Phone ${cleanPhone} (CO) vs IP ${detectIpCountry} (${clientIp}). Auto-blocking.`);
      blockedIps.add(clientIp);
      if (deviceHash) blockedDevices.add(deviceHash.trim());
      try {
        await supabase.from("blocked_ips").upsert({
          id: `block_${clientIp.replace(/[^a-z0-9]/gi, "_")}`,
          ip_address: clientIp,
          creator_handle: "angelina69",
          reason: `Bloqueo automatico: Inconsistencia VPN (Telefono +57 Colombia vs IP ${detectIpCountry})`,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (deviceHash) {
          await supabase.from("blocked_devices").upsert({
            id: `dev_${deviceHash.replace(/[^a-z0-9]/gi, "_")}`,
            device_hash: deviceHash.trim(),
            creator_handle: "angelina69",
            reason: `Bloqueo automatico: Inconsistencia VPN (Telefono +57 Colombia vs IP ${detectIpCountry})`,
            created_at: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      } catch (bErr) {
        console.warn("[Auto Block Lead VPN Error]", bErr);
      }
    }
    const leadObj = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      contact_info: finalContact,
      ip_address: clientIp,
      country_code: detectIpCountry || "",
      device_hash: deviceHash || "",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    visitorLeads.push(leadObj);
    try {
      const { error } = await supabase.from("visitor_leads").upsert(leadObj);
      if (error) console.warn("[Supabase Lead Sync Error]", error);
    } catch {
    }
    res.json({ success: true, lead: leadObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/visitor-leads", async (req, res) => {
  try {
    const { data, error } = await supabase.from("visitor_leads").select("*").order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped = data.map((row) => ({
        id: row.id,
        contactInfo: row.contact_info || row.contactInfo || "",
        contact_info: row.contact_info || row.contactInfo || "",
        ipAddress: row.ip_address || row.ipAddress || "",
        countryCode: row.country_code || row.countryCode || "",
        deviceHash: row.device_hash || row.deviceHash || "",
        createdAt: row.created_at || (/* @__PURE__ */ new Date()).toISOString()
      }));
      return res.json(mapped);
    }
  } catch {
  }
  const mappedMem = visitorLeads.map((row) => ({
    id: row.id,
    contactInfo: row.contact_info || row.contactInfo || "",
    contact_info: row.contact_info || row.contactInfo || "",
    ipAddress: row.ip_address || row.ipAddress || "",
    countryCode: row.country_code || row.countryCode || "",
    deviceHash: row.device_hash || row.deviceHash || "",
    createdAt: row.created_at || (/* @__PURE__ */ new Date()).toISOString()
  }));
  res.json(mappedMem);
});
app.get("/api/settings/lead-capture", (req, res) => {
  res.json({ requireLeadCapture });
});
app.post("/api/settings/lead-capture", async (req, res) => {
  try {
    const { requireLeadCapture: enabled } = req.body;
    requireLeadCapture = Boolean(enabled);
    try {
      const { error: sErr } = await supabase.from("lead_capture_settings").upsert({
        id: "default",
        require_lead_capture: requireLeadCapture,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }, { onConflict: "id" });
      if (sErr) console.warn("[Supabase lead_capture_settings Upsert Error]", sErr);
    } catch (sErr) {
      console.warn("[Supabase lead_capture_settings Upsert Exception]", sErr);
    }
    res.json({ success: true, requireLeadCapture });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/settings/payment-methods-visibility", (req, res) => {
  res.json({ visibility: paymentMethodsVisibility });
});
app.post("/api/settings/payment-methods-visibility", async (req, res) => {
  try {
    const { visibility } = req.body;
    if (visibility && typeof visibility === "object") {
      paymentMethodsVisibility = {
        mercadopago: Boolean(visibility.mercadopago),
        paypal: Boolean(visibility.paypal),
        paypal_telegram: Boolean(visibility.paypal_telegram),
        nequi_usa: Boolean(visibility.nequi_usa)
      };
      try {
        const { error: vErr } = await supabase.from("payment_methods_visibility").upsert({
          id: "default",
          mercadopago: paymentMethodsVisibility.mercadopago,
          paypal: paymentMethodsVisibility.paypal,
          paypal_telegram: paymentMethodsVisibility.paypal_telegram,
          nequi_usa: paymentMethodsVisibility.nequi_usa,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }, { onConflict: "id" });
        if (vErr) console.warn("[Supabase payment_methods_visibility Upsert Error]", vErr);
      } catch (sErr) {
        console.warn("[Supabase payment_methods_visibility Upsert Exception]", sErr);
      }
    }
    res.json({ success: true, visibility: paymentMethodsVisibility });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/media/download/:token", async (req, res) => {
  const { token } = req.params;
  let purchase = purchases.find((p) => (p.token === token || p.id === token) && p.status === "completed");
  if (!purchase && token) {
    try {
      const { data } = await supabase.from("purchases").select("*").or(`token.eq.${token},id.eq.${token}`).single();
      if (data && data.status === "completed") {
        purchase = fromSupabasePurchase(data);
      }
    } catch {
    }
  }
  if (!purchase || purchase.status !== "completed") {
    return res.status(403).send(`
      <div style="font-family: system-ui, sans-serif; text-align: center; padding: 50px; background: #030712; color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h2 style="color: #ef4444;">\u26D4 Enlace de Descarga Inv\xE1lido o Pago No Confirmado</h2>
        <p style="color: #9ca3af;">No se pudo verificar un pago completado para esta descarga.</p>
        <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4f46e5; color: white; border-radius: 8px; text-decoration: none;">Volver a la Tienda</a>
      </div>
    `);
  }
  if (purchase.downloadCount >= 1) {
    return res.status(403).send(`
      <div style="font-family: system-ui, sans-serif; text-align: center; padding: 50px; background: #030712; color: #fff; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="font-size: 54px; margin-bottom: 20px;">\u{1F512}</div>
        <h2 style="color: #ef4444; margin-bottom: 12px; font-size: 24px;">L\xEDmite de Descarga Alcanzado</h2>
        <p style="color: #9ca3af; max-width: 440px; line-height: 1.6; font-size: 14px;">Este enlace ya ha sido utilizado para descargar el archivo previamente. Por razones de seguridad, cada compra autoriza <strong>m\xE1ximo 1 descarga \xFAnica</strong>.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">ID de Compra: ${purchase.id} \xB7 IP Comprador: ${purchase.ipAddress || "Registrada"} \xB7 Descargas efectuadas: ${purchase.downloadCount}</p>
        <a href="/" style="display: inline-block; margin-top: 25px; padding: 12px 24px; background: #4f46e5; color: white; border-radius: 12px; text-decoration: none; font-weight: bold;">Volver a la Tienda</a>
      </div>
    `);
  }
  purchase.downloadCount += 1;
  await savePurchase(purchase);
  res.redirect(purchase.downloadUrl);
});
async function sendWhatsAppReceipt(record) {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;
  if (!instanceId || !token || !record.buyerPhone) {
    console.log(`[WhatsApp Simulated Log] Confirmation message queued for ${record.buyerPhone}`);
    record.whatsappSent = true;
    return;
  }
  const downloadLink = `${process.env.APP_URL || "http://localhost:3000"}?unlock=${record.token}`;
  const message = `\u{1F389} \xA1Pago Confirmado con \xC9xito!

Hola, tu compra de "*${record.mediaTitle}*" ha sido verificada con \xE9xito.

\u{1F447} Haz clic en el enlace para descargar tu contenido en alta resoluci\xF3n:
${downloadLink}

\xA1Gracias por tu compra!`;
  try {
    const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        token,
        to: record.buyerPhone,
        body: message
      })
    });
    if (response.ok) {
      record.whatsappSent = true;
      console.log(`[UltraMsg WhatsApp] Message delivered successfully to ${record.buyerPhone}`);
    }
  } catch (err) {
    console.error("[UltraMsg WhatsApp Error]", err);
  }
}
app.post("/api/whatsapp/send-confirmation", async (req, res) => {
  const { phone, mediaTitle, downloadToken } = req.body;
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;
  const downloadLink = `${process.env.APP_URL || "http://localhost:3000"}?unlock=${downloadToken}`;
  const messageText = `\u{1F389} *\xA1Contenido Desbloqueado!*

Se ha confirmado la compra de "${mediaTitle}".

\u{1F4E5} Enlace directo de descarga:
${downloadLink}`;
  if (instanceId && token) {
    try {
      const response = await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token, to: phone, body: messageText })
      });
      const data = await response.json();
      return res.json({ success: true, provider: "UltraMsg API", response: data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  res.json({
    success: true,
    provider: "Simulated WhatsApp Service",
    message: `Mensaje enviado virtualmente a ${phone}`,
    preview: messageText
  });
});
app.get("/api/purchases", (req, res) => {
  const creatorHandle = req.query.creator;
  let result = purchases;
  if (creatorHandle) {
    result = purchases.filter((p) => p.creatorHandle.toLowerCase() === creatorHandle.toLowerCase());
  }
  res.json(result);
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} GeoLink App Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
