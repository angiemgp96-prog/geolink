-- ==============================================================
-- SCRIPT SQL DE RESTAURACION PARA NUEVO PROYECTO SUPABASE
-- ==============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS public.blocked_devices CASCADE;
CREATE TABLE public.blocked_devices (
    id text NOT NULL,
    device_hash text NOT NULL,
    creator_handle text DEFAULT 'angelina69'::text,
    reason text DEFAULT 'Bloqueo por huella digital de dispositivo / VPN'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

DROP TABLE IF EXISTS public.blocked_ips CASCADE;
CREATE TABLE public.blocked_ips (
    id text NOT NULL,
    ip_address text NOT NULL,
    creator_handle text DEFAULT 'angelina69'::text,
    reason text DEFAULT 'Bloqueo manual desde Historial de Ventas'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    device_hash text
);

DROP TABLE IF EXISTS public.colombia_page_access CASCADE;
CREATE TABLE public.colombia_page_access (
    id text NOT NULL,
    contact_info text NOT NULL,
    ip_address text,
    device_hash text,
    payment_method text DEFAULT 'nequi'::text,
    status text DEFAULT 'approved'::text,
    custom_code text,
    created_at timestamp with time zone DEFAULT now(),
    approved_at timestamp with time zone DEFAULT now()
);

DROP TABLE IF EXISTS public.creator_links CASCADE;
CREATE TABLE public.creator_links (
    id text NOT NULL,
    creator_handle text NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    icon text DEFAULT 'Link'::text,
    active boolean DEFAULT true,
    clicks integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

DROP TABLE IF EXISTS public.creators CASCADE;
CREATE TABLE public.creators (
    id text NOT NULL,
    handle text NOT NULL,
    name text NOT NULL,
    title text,
    bio text,
    avatar text,
    banner text,
    badge text,
    blocked_countries jsonb DEFAULT '[]'::jsonb,
    blocked_message text,
    whatsapp_number text,
    links jsonb DEFAULT '[]'::jsonb,
    payment_settings jsonb DEFAULT '{}'::jsonb,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    store_mode text DEFAULT 'subscription'::text
);

DROP TABLE IF EXISTS public.global_discounts CASCADE;
CREATE TABLE public.global_discounts (
    creator_handle text NOT NULL,
    discount_percentage numeric DEFAULT 0,
    is_active boolean DEFAULT true,
    updated_at timestamp with time zone DEFAULT now(),
    colombia_multiplier numeric DEFAULT 7
);

DROP TABLE IF EXISTS public.lead_capture_settings CASCADE;
CREATE TABLE public.lead_capture_settings (
    id text DEFAULT 'default'::text NOT NULL,
    require_lead_capture boolean DEFAULT true,
    updated_at timestamp with time zone DEFAULT now()
);

DROP TABLE IF EXISTS public.media_items CASCADE;
CREATE TABLE public.media_items (
    id text NOT NULL,
    creator_id text,
    creator_handle text NOT NULL,
    title text NOT NULL,
    description text,
    type text NOT NULL,
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text,
    preview_url text,
    content_url text,
    duration text,
    file_size text,
    is_active boolean DEFAULT true,
    sales_count integer DEFAULT 0,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    is_extra_premium boolean DEFAULT false
);

DROP TABLE IF EXISTS public.payment_methods_visibility CASCADE;
CREATE TABLE public.payment_methods_visibility (
    id text DEFAULT 'default'::text NOT NULL,
    mercadopago boolean DEFAULT true,
    paypal boolean DEFAULT true,
    paypal_telegram boolean DEFAULT true,
    nequi_usa boolean DEFAULT true,
    updated_at timestamp with time zone DEFAULT now(),
    direct_telegram_mode boolean DEFAULT false
);

DROP TABLE IF EXISTS public.purchases CASCADE;
CREATE TABLE public.purchases (
    id text NOT NULL,
    token text NOT NULL,
    media_id text NOT NULL,
    media_title text NOT NULL,
    creator_handle text NOT NULL,
    buyer_email text,
    buyer_phone text,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text,
    payment_method text NOT NULL,
    payment_id text,
    status text DEFAULT 'pending'::text NOT NULL,
    ip_address text,
    download_count integer DEFAULT 0,
    download_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    expires_at timestamp with time zone
);

DROP TABLE IF EXISTS public.visitor_leads CASCADE;
CREATE TABLE public.visitor_leads (
    id text NOT NULL,
    contact_info text NOT NULL,
    ip_address text,
    country_code text,
    device_hash text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Datos para colombia_page_access (32 registros)
INSERT INTO public.colombia_page_access (id, contact_info, ip_address, device_hash, payment_method, status, custom_code, created_at, approved_at) VALUES
  ('co_link_1789038816575_klci', 'asff', '191.156.156.137', 'dev_wxmi7n', 'manual', 'approved', 'fe33r', '2026-09-10 11:13:36.577+00', '2026-09-10 11:16:05.237+00'),
  ('co_link_1788878444146_l4kg', '3222078937', '191.156.227.246', 'dev_7dei1h', 'manual', 'approved', 'adfff', '2026-09-08 14:40:44.146+00', '2026-09-22 17:06:08.273+00'),
  ('co_link_1787954980647_bpqd', '3132320534', NULL, 'dev_auhof7', 'manual', 'approved', 'axvk', '2026-08-28 22:09:40.647+00', '2026-08-28 22:13:46.402+00'),
  ('co_link_1789010495483_te8x', '3133833218', '191.106.210.127', 'dev_omm0pq', 'manual', 'approved', 'asff', '2026-09-10 03:21:35.483+00', '2026-09-10 03:57:49.825+00'),
  ('co_link_1788911259782_2ome', 'JUNIOR07', NULL, 'dev_ys42yp', 'manual', 'approved', 'wert', '2026-09-08 23:47:39.782+00', '2026-09-08 23:54:47.686+00'),
  ('co_link_1788008684969_eyz3', '3225822027', NULL, 'dev_xu010l', 'manual', 'approved', 'frg5', '2026-08-29 13:04:44.969+00', '2026-08-29 13:36:47.627+00'),
  ('co_link_1788316051220_jo5w', '@antonioz24', '191.156.60.254', 'dev_lpepf6', 'manual', 'approved', 'asdasd', '2026-09-02 02:27:31.22+00', '2026-09-02 02:34:32.524+00'),
  ('co_link_1789351337615_9kbx', 'amortiguador', '186.81.58.215', 'dev_5x6xdq', 'manual', 'approved', 'asdccc', '2026-09-14 02:02:17.615+00', '2026-09-14 14:02:28.87+00'),
  ('co_link_1789330270077_rp7p', '3225822027', '191.156.48.189', 'dev_mhqs80', 'manual', 'approved', 'aceesss', '2026-09-13 20:11:10.077+00', '2026-09-13 20:11:38.145+00'),
  ('co_link_1788526555708_twws', '3214212482', NULL, 'dev_o5toe7', 'manual', 'approved', 'jjyss', '2026-09-04 12:55:55.708+00', '2026-09-04 12:56:31.914+00'),
  ('co_acc_1789009929660_7yfn', '3133833218', NULL, 'dev_sykfwu', 'nequi', 'approved', NULL, '2026-09-10 03:12:09.661+00', '2026-09-10 03:15:50.536+00'),
  ('co_link_1788526676972_nmoi', '3214212482', NULL, 'dev_hsnsh5', 'manual', 'approved', 'dmki', '2026-09-04 12:57:56.972+00', '2026-09-04 13:11:38.262+00'),
  ('co_link_1788557473968_le2n', 'Anyelo', NULL, 'dev_3q5fxt', 'manual', 'approved', 'asddd', '2026-09-04 21:31:13.968+00', '2026-09-04 21:37:40.34+00'),
  ('co_acc_1788837587205_p8r7', '3192771890', NULL, 'dev_3jsx44', 'nequi', 'approved', NULL, '2026-09-08 03:19:47.207+00', '2026-09-08 03:26:35.033+00'),
  ('co_link_1788908639982_u339', '+57 302 395 3241', '181.118.146.196', 'dev_y5lu19', 'manual', 'approved', 'acfrr', '2026-09-08 23:03:59.982+00', '2026-09-20 19:40:37.331+00'),
  ('co_acc_1788877004714_up8c', '3222078937', NULL, 'dev_y5z1dr', 'nequi', 'approved', NULL, '2026-09-08 14:16:44.714+00', '2026-09-08 14:25:57.183+00'),
  ('co_link_1789794932551_kx1d', '317paco', '45.179.246.14', 'dev_oglf4h', 'manual', 'approved', 'Abdd', '2026-09-19 05:15:32.551+00', '2026-09-21 04:04:01.401+00'),
  ('co_link_1789238916010_sl32', 'jb col', '130.250.230.161', 'dev_bqllxt', 'manual', 'approved', 'ajjuyr', '2026-09-12 18:48:36.01+00', '2026-09-18 21:24:15.162+00'),
  ('co_link_1789080928096_885i', 'access', NULL, 'dev_p8hyu1', 'manual', 'approved', 'dfff', '2026-09-10 22:55:28.097+00', '2026-09-12 20:25:15.131+00'),
  ('co_acc_1789002122137_6syk', '3116401029', NULL, 'dev_nmt53o', 'nequi', 'approved', NULL, '2026-09-10 01:02:02.141+00', '2026-09-10 03:49:38.067+00'),
  ('co_acc_1789014239748_s0fo', '3208912570', NULL, 'dev_qkdj2d', 'nequi', 'approved', NULL, '2026-09-10 04:23:59.748+00', '2026-09-10 09:17:46.787+00'),
  ('mp_auto_co_1789079963392_jtfu', 'Pago MercadoPago Automático', NULL, 'dev_had61n', 'mercadopago', 'approved', NULL, '2026-09-10 22:39:23.392+00', '2026-09-10 22:39:23.392+00'),
  ('co_link_1789072809990_qme0', 'Olmedys Alzate', NULL, 'dev_47e1p4', 'manual', 'approved', 'sftt', '2026-09-10 20:40:09.99+00', '2026-09-10 23:06:53.903+00'),
  ('mp_auto_co_1789084099145_yjkp', 'Pago MercadoPago Automático', NULL, 'dev_x6uty5', 'mercadopago', 'approved', NULL, '2026-09-10 23:48:19.145+00', '2026-09-10 23:50:41.326+00'),
  ('co_link_1789180946190_dqj8', '0787', NULL, 'dev_ists5d', 'manual', 'approved', 'access', '2026-09-12 02:42:26.19+00', '2026-09-13 14:42:04.428+00'),
  ('co_link_1789178205641_0h4z', 'gerardo', NULL, NULL, 'manual', 'approved', 'telles', '2026-09-12 01:56:45.641+00', '2026-09-12 01:56:45.641+00'),
  ('co_acc_1789230333674_w5h4', '3163359673', NULL, 'dev_1lyo1z', 'nequi', 'approved', NULL, '2026-09-12 16:25:33.674+00', '2026-09-12 17:09:03.584+00'),
  ('co_link_1789351330015_ctqj', 'Cliente Telegram', NULL, NULL, 'manual', 'approved', 'zo4d7r', '2026-09-14 02:02:10.015+00', '2026-09-14 02:02:10.015+00'),
  ('co_acc_1789064088699_um8j', '3163120228', '190.84.88.164', 'dev_3ba2sy', 'nequi', 'approved', NULL, '2026-09-10 18:14:48.703+00', '2026-09-10 20:28:59.274+00'),
  ('co_link_1789919654442_3dxx', 'mauricio barrios', '181.118.146.221', 'dev_6beofm', 'manual', 'approved', 'adnjuu', '2026-09-20 15:54:14.442+00', '2026-09-20 23:06:20.872+00'),
  ('co_link_1790097930233_t12p', 'omar llanos', '177.253.70.98', 'dev_nk37cr', 'manual', 'approved', 'annhdd', '2026-09-22 17:25:30.233+00', '2026-09-22 17:31:50.62+00'),
  ('co_link_1789580112712_8wga', 'Hemerson', '191.156.125.178', 'dev_cemq10', 'manual', 'approved', '55sdf', '2026-09-16 17:35:12.712+00', '2026-09-22 17:18:53.916+00');

-- Datos para creator_links (5 registros)
INSERT INTO public.creator_links (id, creator_handle, title, url, icon, active, clicks, created_at) VALUES
  ('l1', 'angelina69', 'Instagram Oficial 📸 (@angiemgp69)', 'https://instagram.com/angiemgp69', 'Instagram', 't', '3410', '2026-08-09 22:19:52.307404+00'),
  ('l2', 'angelina69', 'Link.me Oficial 🔗', 'https://link.me/angelina69', 'Globe', 't', '1850', '2026-08-09 22:19:52.307404+00'),
  ('l0', 'angelina69', 'Comunidad VIP Oficial 🔥 (@angelinax)', 'https://onlyfans.com/angelinax69', 'OnlyFans', 't', '4920', '2026-08-09 22:19:52.307404+00'),
  ('l3', 'angelina69', 'Telegram VIP Gratis 💬', 'https://t.me/example_channel', 'Telegram', 't', '1240', '2026-09-13 00:11:08.279173+00'),
  ('l4', 'angelina69', 'TikTok Oficial 🎵', 'https://tiktok.com', 'TikTok', 't', '2150', '2026-09-13 00:11:08.279173+00');

-- Datos para creators (1 registros)
INSERT INTO public.creators (id, handle, name, title, bio, avatar, banner, badge, blocked_countries, blocked_message, whatsapp_number, links, payment_settings, data, created_at, store_mode) VALUES
  ('creator_angelina69', 'angelina69', 'Angelina69 🔥', 'Model & Digital Content Creator', 'Bienvenido a mi espacio exclusivo 💋', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/magnific_quita-el-tatuaje-dela-esp_Pi72JNz42C.png', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/Captura%20de%20pantalla%202026-09-06%20050057%20(1).jpg', 'VIP CREATOR', '["VE", "MA", "SA", "AE", "QA", "BH", "KW", "OM", "EG", "IQ", "IR", "JO", "LB", "BR"]', '⛔ ERROR', '+573142881717', '[{"id": "l1", "url": "https://instagram.com/angiemgp69", "icon": "Instagram", "title": "Instagram Oficial 📸 (@angiemgp69)", "active": true, "clicks": 3410}, {"id": "l2", "url": "https://link.me/angelina69", "icon": "Globe", "title": "Link.me Oficial 🔗", "active": true, "clicks": 1850}, {"id": "l0", "url": "https://onlyfans.com/angelinax69", "icon": "OnlyFans", "title": "Comunidad VIP Oficial 🔥 (@angelinax)", "active": true, "clicks": 4920}, {"id": "l3", "url": "https://t.me/example_channel", "icon": "Telegram", "title": "Telegram VIP Gratis 💬", "active": true, "clicks": 1240}, {"id": "l4", "url": "https://tiktok.com", "icon": "TikTok", "title": "TikTok Oficial 🎵", "active": true, "clicks": 2150}]', '{"payPalMode": "live", "payPalClientId": "BAA8Frtu5JFlsHO30PzjEf0J23mdxSEfhSCZbeZrGfcskv7jBXDkYQR5U4Tv3sUApF5z64ONWtUdGfwf44", "customPaymentLinks": [{"id": "c2", "url": "https://payoneer.com/angelina69", "name": "Payoneer Direct", "currency": "USD"}], "payPalClientSecret": "EBQBiVbmbih6qKanhmwkI0RwbiHWKolXovHRMu2DSGcigFTkwHS5J5AafOqMMXJO46goCK2sWZjQNFDw", "mercadoPagoPublicKey": "", "mercadoPagoAccessToken": "APP_USR-7257482411293311-080712-ada9bb187061cb3d57c277c19d3916bc-3553496952"}', '{"id": "creator_angelina69", "bio": "Bienvenido a mi espacio exclusivo 💋", "name": "Angelina69 🔥", "badge": "VIP CREATOR", "links": [{"id": "l1", "url": "https://instagram.com/angiemgp69", "icon": "Instagram", "title": "Instagram Oficial 📸 (@angiemgp69)", "active": true, "clicks": 3410}, {"id": "l2", "url": "https://link.me/angelina69", "icon": "Globe", "title": "Link.me Oficial 🔗", "active": true, "clicks": 1850}, {"id": "l0", "url": "https://onlyfans.com/angelinax69", "icon": "OnlyFans", "title": "Comunidad VIP Oficial 🔥 (@angelinax)", "active": true, "clicks": 4920}, {"id": "l3", "url": "https://t.me/example_channel", "icon": "Telegram", "title": "Telegram VIP Gratis 💬", "active": true, "clicks": 1240}, {"id": "l4", "url": "https://tiktok.com", "icon": "TikTok", "title": "TikTok Oficial 🎵", "active": true, "clicks": 2150}], "title": "Model & Digital Content Creator", "avatar": "https://i.postimg.cc/ZYGVK9h0/magnific-quita-el-tatuaje-dela-esp-Pi72JNz42C.png", "banner": "https://i.postimg.cc/xC9NFRvT/Captura-de-pantalla-2026-09-06-050057-(1).jpg", "handle": "angelina69", "createdAt": "2026-08-07T17:10:41.581308+00:00", "storeMode": "subscription", "themeColor": "from-pink-600 via-purple-600 to-indigo-700", "blockedMessage": "⛔ ERROR", "whatsappNumber": "+573142881717", "paymentSettings": {"payPalMode": "live", "payPalClientId": "BAA8Frtu5JFlsHO30PzjEf0J23mdxSEfhSCZbeZrGfcskv7jBXDkYQR5U4Tv3sUApF5z64ONWtUdGfwf44", "customPaymentLinks": [{"id": "c2", "url": "https://payoneer.com/angelina69", "name": "Payoneer Direct", "currency": "USD"}], "payPalClientSecret": "EBQBiVbmbih6qKanhmwkI0RwbiHWKolXovHRMu2DSGcigFTkwHS5J5AafOqMMXJO46goCK2sWZjQNFDw", "mercadoPagoPublicKey": "", "mercadoPagoAccessToken": "APP_USR-7257482411293311-080712-ada9bb187061cb3d57c277c19d3916bc-3553496952"}, "blockedCountries": ["VE", "MA", "SA", "AE", "QA", "BH", "KW", "OM", "EG", "IQ", "IR", "JO", "LB", "BR"], "paymentMethodsVisibility": {"paypal": false, "stripe": false, "nequi_usa": false, "mercadopago": false, "paypal_telegram": true, "direct_telegram_mode": true}}', '2026-08-07 17:10:41.581308+00', 'subscription');

-- Datos para global_discounts (1 registros)
INSERT INTO public.global_discounts (creator_handle, discount_percentage, is_active, updated_at, colombia_multiplier) VALUES
  ('angelina69', '0', 'f', '2026-09-08 01:51:44.683+00', '2');

-- Datos para lead_capture_settings (1 registros)
INSERT INTO public.lead_capture_settings (id, require_lead_capture, updated_at) VALUES
  ('default', 'f', '2026-09-05 18:48:18.465+00');

-- Datos para media_items (16 registros)
INSERT INTO public.media_items (id, creator_id, creator_handle, title, description, type, price, currency, preview_url, content_url, duration, file_size, is_active, sales_count, data, created_at, is_extra_premium) VALUES
  ('media_1786139686398', 'creator_angelina69', 'angelina69', 'con mi juguete favorito', 'montada sobre esta rica verga de juguete ', 'video', '10.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348703728-56aq1cv.png', 'https://t.me/+wNMNi7kV8X1jYTkx', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348703728-56aq1cv.png", "downloadUrl": "https://t.me/+wNMNi7kV8X1jYTkx", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-14 01:18:30.392+00', 'f'),
  ('media_1786193399803', 'creator_angelina69', 'angelina69', 'Quieres verla?', '', 'video', '5.00', 'USD', '', 'https://t.me/+z3H9Mrxxlcg4MTA5', '', '', 't', '2', '{"isFeatured": false, "previewUrl": "https://i.postimg.cc/PqdDQ20h/Captura-de-pantalla-2026-08-08-074919.png", "downloadUrl": "https://t.me/+z3H9Mrxxlcg4MTA5", "isExtraPremium": false, "purchasesCount": 2}', '2026-09-08 01:42:54.114+00', 'f'),
  ('media_1786193279456', 'creator_angelina69', 'angelina69', 'Couple ', '', 'video', '20.00', 'USD', '', 'https://t.me/+rI46xHIMqRJiZWQ5', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://i.postimg.cc/cH4Q0XcX/Captura-de-pantalla-2026-08-08-074735.png", "downloadUrl": "https://t.me/+rI46xHIMqRJiZWQ5", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-09 02:44:32.205+00', 'f'),
  ('media_1786139499820', 'creator_angelina69', 'angelina69', 'Masturbanción', 'Tocándome delicioso', 'video', '10.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348430665-ihq1n15.png', 'https://t.me/+k_67iDhcl2JkNGNh', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348430665-ihq1n15.png", "downloadUrl": "https://t.me/+k_67iDhcl2JkNGNh", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-14 01:13:56.698+00', 'f'),
  ('media_1787798435018', 'creator_angelina69', 'angelina69', 'Montando Verga ', '', 'video', '20.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348768336-512ljtv.png', 'https://t.me/+ncTggpt9RPtiZDgx', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348768336-512ljtv.png", "downloadUrl": "https://t.me/+ncTggpt9RPtiZDgx", "isExtraPremium": true, "purchasesCount": 0}', '2026-09-14 01:19:33.775+00', 't'),
  ('media_1788360145934', 'creator_angelina69', 'angelina69', 'anal ', '', 'video', '10.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348504960-9s4xkck.png', 'https://t.me/+IksFc0SdR4k5MTA5', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348504960-9s4xkck.png", "downloadUrl": "https://t.me/+IksFc0SdR4k5MTA5", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-14 01:20:01.97+00', 'f'),
  ('media_1788007984824', 'creator_angelina69', 'angelina69', 'Masturbanción 2', '', 'video', '10.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348485582-mazdbo7.png', 'https://t.me/+Rz298tnSgvo4ZTgx', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348485582-mazdbo7.png", "downloadUrl": "https://t.me/+Rz298tnSgvo4ZTgx", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-14 01:14:51.104+00', 'f'),
  ('media_1788638697559', 'creator_angelina69', 'angelina69', 'Sobre mi gran juguete', '', 'video', '20.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348679966-zg2zjya.png', 'https://t.me/+W1Pf5r9NaVRmMmUx', ' ', ' ', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348679966-zg2zjya.png", "downloadUrl": "https://t.me/+W1Pf5r9NaVRmMmUx", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-14 01:18:05.933+00', 'f'),
  ('media_1789321394895', 'creator_angelina69', 'angelina69', 'Un poco de ejercicio', '', 'video', '5.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348371433-q5uo5d5.jpg', 'https://t.me/+bL8sX21Srm0xNzE5', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348371433-q5uo5d5.jpg", "downloadUrl": "https://t.me/+bL8sX21Srm0xNzE5", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-19 04:25:40.96+00', 'f'),
  ('media_1786470365967', 'creator_angelina69', 'angelina69', 'Te gustan mis pies?', '', 'video', '5.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348456085-ykc7vzm.png', 'https://t.me/+jq-i_pPsqXRmZDNh', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348456085-ykc7vzm.png", "downloadUrl": "https://t.me/+jq-i_pPsqXRmZDNh", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-14 01:14:21.7+00', 'f'),
  ('media_1789319543796', 'creator_angelina69', 'angelina69', 'Rico en 4 en el sofá', '', 'video', '20.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348392409-d3y4r3l.jpg', 'https://t.me/+_Dmy6kg5Uu5lMWQx', '12:00 min', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348392409-d3y4r3l.jpg", "downloadUrl": "https://t.me/+_Dmy6kg5Uu5lMWQx", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-14 02:51:18.282+00', 'f'),
  ('media_1788094364764', 'creator_angelina69', 'angelina69', ' me vengo con mi pareja (squirt)', '', 'video', '30.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348746222-j9g4a5w.png', 'https://t.me/+HINA6u2kotg0MjQx', '', '', 't', '1', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348746222-j9g4a5w.png", "downloadUrl": "https://t.me/+HINA6u2kotg0MjQx", "isExtraPremium": true, "purchasesCount": 1}', '2026-09-14 01:19:12.572+00', 't'),
  ('media_1786470016517', 'creator_angelina69', 'angelina69', 'Me encanta jugar con mi Vibrador', '', 'video', '20.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348717527-0mu7nta.png', 'https://t.me/+NEz63SS-o0c3ZDdh', '03:41 min', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348717527-0mu7nta.png", "downloadUrl": "https://t.me/+NEz63SS-o0c3ZDdh", "isExtraPremium": true, "purchasesCount": 0}', '2026-09-14 01:18:44.305+00', 't'),
  ('media_1788438475594', 'creator_angelina69', 'angelina69', 'te va a encantar mi culote rebotando ', '', 'video', '5.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348666457-yf9syjn.png', 'https://t.me/+dv8PLXcXDYc2ZjYx', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348666457-yf9syjn.png", "downloadUrl": "https://t.me/+dv8PLXcXDYc2ZjYx", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-14 01:17:54.044+00', 'f'),
  ('media_1787968790580', 'creator_angelina69', 'angelina69', 'Correa Couple', '', 'video', '20.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348731643-sqnhkcp.png', 'https://t.me/+oqfXtQgDxm8zNzUx', '', '', 't', '0', '{"isFeatured": false, "previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789348731643-sqnhkcp.png", "downloadUrl": "https://t.me/+oqfXtQgDxm8zNzUx", "isExtraPremium": true, "purchasesCount": 0}', '2026-09-14 01:18:58.699+00', 't'),
  ('media_1789948815305', 'creator_angelina69', 'angelina69', 'anal largo', '', 'video', '20.00', 'USD', 'https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789948807793-wjr2jez.png', 'https://t.me/+EaLeuN_gpd00NDIx', '', '', 't', '0', '{"previewUrl": "https://eqpabbrmdssgoaaqtkgu.supabase.co/storage/v1/object/public/media-store/public/1789948807793-wjr2jez.png", "downloadUrl": "https://t.me/+EaLeuN_gpd00NDIx", "isExtraPremium": false, "purchasesCount": 0}', '2026-09-21 00:59:56.634+00', 'f');

-- Datos para payment_methods_visibility (1 registros)
INSERT INTO public.payment_methods_visibility (id, mercadopago, paypal, paypal_telegram, nequi_usa, updated_at, direct_telegram_mode) VALUES
  ('default', 'f', 'f', 't', 'f', '2026-09-14 00:51:22.04+00', 't');

-- Datos para purchases (26 registros)
INSERT INTO public.purchases (id, token, media_id, media_title, creator_handle, buyer_email, buyer_phone, amount, currency, payment_method, payment_id, status, ip_address, download_count, download_url, created_at, updated_at, expires_at) VALUES
  ('dir_purch_1790194866880_wz56t', 'unlock_dir_1790194866880_0fz3hpz', 'media_1789319543796', 'Rico en 4 en el sofá', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '20.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+_Dmy6kg5Uu5lMWQx', '2026-09-23 20:21:06.881+00', '2026-09-23 20:21:07.160926+00', NULL),
  ('dir_purch_1790195699942_5wsav', 'unlock_dir_1790195699942_3pr0qot', 'media_1788094364764', ' me vengo con mi pareja (squirt)', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '30.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+HINA6u2kotg0MjQx', '2026-09-23 20:34:59.942+00', '2026-09-23 20:35:00.255057+00', NULL),
  ('dir_purch_1790195728008_e2g8a', 'unlock_dir_1790195728008_eftgibb', 'media_1786193399803', 'Quieres verla?', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '5.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+z3H9Mrxxlcg4MTA5', '2026-09-23 20:35:28.008+00', '2026-09-23 20:35:29.988967+00', NULL),
  ('dir_purch_1790195736647_x4939', 'unlock_dir_1790195736647_x33vb3m', 'media_1786139686398', 'con mi juguete favorito', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '10.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+wNMNi7kV8X1jYTkx', '2026-09-23 20:35:36.647+00', '2026-09-23 20:35:36.695312+00', NULL),
  ('dir_purch_1790196658599_5jdcc', 'unlock_dir_1790196658599_yqpdanx', 'media_1789948815305', 'anal largo', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '20.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+EaLeuN_gpd00NDIx', '2026-09-23 20:50:58.6+00', '2026-09-23 20:50:59.328166+00', NULL),
  ('dir_purch_1790198143488_xena1', 'unlock_dir_1790198143488_202dys3', 'media_1788094364764', ' me vengo con mi pareja (squirt)', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '30.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+HINA6u2kotg0MjQx', '2026-09-23 21:15:43.488+00', '2026-09-23 21:15:41.673933+00', NULL),
  ('dir_purch_1790198175749_nmgck', 'unlock_dir_1790198175749_uzqo0m2', 'media_1786139499820', 'Masturbanción', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '10.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+k_67iDhcl2JkNGNh', '2026-09-23 21:16:15.749+00', '2026-09-23 21:16:13.935213+00', NULL),
  ('dir_purch_1790198187900_ipy5g', 'unlock_dir_1790198187900_6pa1m36', 'media_1786139499820', 'Masturbanción', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '10.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+k_67iDhcl2JkNGNh', '2026-09-23 21:16:27.9+00', '2026-09-23 21:16:26.08421+00', NULL),
  ('dir_purch_1790198197071_7shfd', 'unlock_dir_1790198197071_n41161g', 'media_1786193399803', 'Quieres verla?', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '5.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+z3H9Mrxxlcg4MTA5', '2026-09-23 21:16:37.072+00', '2026-09-23 21:16:35.263109+00', NULL),
  ('dir_purch_1790198970071_jb5re', 'unlock_dir_1790198970071_i9xu108', 'media_1789948815305', 'anal largo', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '20.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+EaLeuN_gpd00NDIx', '2026-09-23 21:29:30.071+00', '2026-09-23 21:29:31.148573+00', NULL),
  ('dir_purch_1790199828119_7qd9l', 'unlock_dir_1790199828119_i5gplfp', 'media_1786139686398', 'con mi juguete favorito', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '10.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+wNMNi7kV8X1jYTkx', '2026-09-23 21:43:48.119+00', '2026-09-23 21:43:47.942775+00', NULL),
  ('dir_purch_1790200598972_ebibc', 'unlock_dir_1790200598972_3uuf3zh', 'media_1787798435018', 'Montando Verga ', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '20.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+ncTggpt9RPtiZDgx', '2026-09-23 21:56:38.973+00', '2026-09-23 21:56:39.439212+00', NULL),
  ('mp_purch_1789002203906_vmguu', 'unlock_1789002203906_ix6amrl', 'acceso_pagina_colombia', '🇨🇴 Pase de Entrada a la Página Web', 'angelina69', '', '3116401029', '30.00', 'USD', 'mercadopago', 'mp_purch_1789002203906_vmguu', 'completed', '181.78.177.160', '0', 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg', '2026-09-10 01:03:24.06488+00', '2026-09-10 01:08:38.907+00', NULL),
  ('mp_purch_1789012412387_sb9ly', 'unlock_1789012412387_8bshegn', 'media_1788438475594', 'te va a encantar mi culote rebotando ', 'angelina69', '', '3133833218', '5.00', 'USD', 'mercadopago', 'mp_purch_1789012412387_sb9ly', 'completed', '38.19.41.124', '0', 'https://t.me/+dv8PLXcXDYc2ZjYx', '2026-09-10 03:53:32.468198+00', '2026-09-10 03:56:29.836+00', NULL),
  ('dir_purch_1789074904254_qmoat', 'unlock_dir_1789074904254_3jffzm7', 'media_1788007984824', 'Masturbanción 2', 'angelina69', '', '', '70000.00', 'COP', 'PAYPAL_TELEGRAM', NULL, 'completed', '191.156.237.197', '0', NULL, '2026-09-10 21:15:04.254+00', '2026-09-10 21:23:24.536+00', NULL),
  ('mp_purch_1789079635884_uv6wy', 'unlock_1789079635884_9qw3mqz', 'acceso_pagina_colombia', '🇨🇴 Pase de Entrada a la Página Web', 'angelina69', '', 'Pagina Colombia', '30.00', 'USD', 'mercadopago', 'mp_purch_1789079635884_uv6wy', 'completed', '186.155.70.97', '0', 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg', '2026-09-10 22:33:56.130406+00', '2026-09-10 22:39:25.031+00', NULL),
  ('dir_purch_1790194906815_tzlwq', 'unlock_dir_1790194906815_7tepb99', 'media_1788094364764', ' me vengo con mi pareja (squirt)', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '30.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+HINA6u2kotg0MjQx', '2026-09-23 20:21:46.815+00', '2026-09-23 20:21:47.742504+00', NULL),
  ('dir_purch_1790195710561_2yt83', 'unlock_dir_1790195710561_xfkijow', 'media_1789321394895', 'Un poco de ejercicio', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '5.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+bL8sX21Srm0xNzE5', '2026-09-23 20:35:10.561+00', '2026-09-23 20:35:10.745114+00', NULL),
  ('mp_purch_1789084070757_w93ix', 'unlock_1789084070757_ctxn686', 'acceso_pagina_colombia', '🇨🇴 Pase de Entrada a la Página Web', 'angelina69', '', 'Pagina Colombia', '30.00', 'USD', 'mercadopago', 'mp_purch_1789084070757_w93ix', 'completed', '191.156.234.103', '0', 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg', '2026-09-10 23:47:50.805792+00', '2026-09-10 23:50:42.32+00', NULL),
  ('dir_purch_1790195746862_trfli', 'unlock_dir_1790195746862_trm5c7d', 'media_1788094364764', ' me vengo con mi pareja (squirt)', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '30.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+HINA6u2kotg0MjQx', '2026-09-23 20:35:46.863+00', '2026-09-23 20:35:48.57538+00', NULL),
  ('dir_purch_1790197987562_8kwfq', 'unlock_dir_1790197987562_s0z7wj7', 'media_1786193399803', 'Quieres verla?', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '5.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+z3H9Mrxxlcg4MTA5', '2026-09-23 21:13:07.562+00', '2026-09-23 21:13:05.788416+00', NULL),
  ('dir_purch_1790198162028_mtigx', 'unlock_dir_1790198162028_pasjsdb', 'media_1786139686398', 'con mi juguete favorito', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '10.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+wNMNi7kV8X1jYTkx', '2026-09-23 21:16:02.028+00', '2026-09-23 21:16:00.207663+00', NULL),
  ('dir_purch_1790198732485_xahjw', 'unlock_dir_1790198732485_7nvipb5', 'media_1789948815305', 'anal largo', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '20.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+EaLeuN_gpd00NDIx', '2026-09-23 21:25:32.485+00', '2026-09-23 21:25:32.733875+00', NULL),
  ('dir_purch_1790199063938_hgiug', 'unlock_dir_1790199063938_k65e55u', 'media_1789948815305', 'anal largo', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '20.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+EaLeuN_gpd00NDIx', '2026-09-23 21:31:03.938+00', '2026-09-23 21:31:04.375646+00', NULL),
  ('dir_purch_1790200230019_vhuvk', 'unlock_dir_1790200230019_2bq4pox', 'media_1786139686398', 'con mi juguete favorito', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '10.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+wNMNi7kV8X1jYTkx', '2026-09-23 21:50:30.019+00', '2026-09-23 21:50:30.388447+00', NULL),
  ('dir_purch_1790200609925_3ogxh', 'unlock_dir_1790200609925_31ra09z', 'media_1787968790580', 'Correa Couple', 'angelina69', 'Cliente Stripe ➔ Telegram', 'Cliente Stripe ➔ Telegram', '20.00', 'USD', 'STRIPE', NULL, 'pending', NULL, '0', 'https://t.me/+oqfXtQgDxm8zNzUx', '2026-09-23 21:56:49.926+00', '2026-09-23 21:56:50.330486+00', NULL);


-- -------------------------------------------------------------
-- DESACTIVAR ROW LEVEL SECURITY PARA ACCESO COMPLETO CON ANON KEY
-- -------------------------------------------------------------
ALTER TABLE IF EXISTS public.creators DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.creator_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.purchases DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.colombia_page_access DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blocked_ips DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blocked_devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_methods_visibility DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.global_discounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lead_capture_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.visitor_leads DISABLE ROW LEVEL SECURITY;
