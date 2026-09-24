import React, { useState } from 'react';
import { Play, Lock, Unlock, CheckCircle2, Instagram, Youtube, Video, Dumbbell, MessageCircle, ExternalLink, Sparkles, Image as ImageIcon, Film, Layers, ShoppingBag, Send, Download, Globe, Flame, Link as LinkIcon } from 'lucide-react';
import { CreatorProfile, MediaItem, CustomLink } from '../types';
import { detectLanguage, TRANSLATIONS, SupportedLanguage } from '../data/translations';
import { api } from '../services/api';
import { BigoHlsPlayer } from './BigoHlsPlayer';
import { getStripePaymentUrl } from '../utils/stripeLinks';

interface PublicCreatorViewProps {
  creator: CreatorProfile;
  mediaItems: MediaItem[];
  unlockedMediaIds?: string[];
  unlockedTokensMap?: Record<string, string>;
  onOpenPurchaseModal: (item: MediaItem) => void;
}

// =========================================================================
// ENLACES EXTERNOS FIJOS PARA IMÁGENES (Sin depender de Supabase Storage)
// Cuando desees reactivar la base de datos en el futuro, solo debes comentar este bloque.
// =========================================================================
const EXTERNAL_PREVIEW_MAP: Record<string, string> = {
  'media_1786139686398': 'https://i.postimg.cc/vxrJbf0r/Captura-de-pantalla-2026-08-07-165400.png',
  'media_1786193399803': 'https://i.postimg.cc/PqdDQ20h/Captura-de-pantalla-2026-08-08-074919.png',
  'media_1786193279456': 'https://i.postimg.cc/cH4Q0XcX/Captura-de-pantalla-2026-08-08-074735.png',
  'media_1786139499820': 'https://i.postimg.cc/cL8vzNTf/Captura-de-pantalla-2026-08-07-165034.png',
  'media_1787968790580': 'https://i.postimg.cc/hPcHw643/Captura-de-pantalla-2026-08-28-205656.png',
  'media_1787798435018': 'https://i.postimg.cc/cHfbkMVb/Captura-de-pantalla-2026-08-27-122552.png',
  'media_1788360145934': 'https://i.postimg.cc/hfMYsS6p/Captura-de-pantalla-2026-09-02-094437.png',
  'media_1788007984824': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  'media_1788638697559': 'https://i.postimg.cc/QVDsndYZ/Captura-de-pantalla-2026-09-05-150206.png',
  'media_1789321394895': 'https://i.postimg.cc/1fyFDyLN/0912-(4)-Cover.jpg',
  'media_1786470365967': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'media_1789319543796': 'https://i.postimg.cc/xJrp8qJw/0912-(4)(1)-Cover.jpg',
  'media_1788094364764': 'https://i.postimg.cc/hJxWpkV5/Captura-de-pantalla-2026-08-30-075041.png',
  'media_1786470016517': 'https://i.postimg.cc/FzBsW-vt6/Captura-de-pantalla-2026-08-11-123726.png',
  'media_1788438475594': 'https://i.postimg.cc/JzPmPmbk/Captura-de-pantalla-2026-09-13-201710.png',
  'media_1789948815305': 'https://i.postimg.cc/d7hgDzWd/Captura-de-pantalla-2026-09-23-231444.png',
  'acceso_full_cat_actual': 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg'
};

export const PublicCreatorView: React.FC<PublicCreatorViewProps> = ({
  creator,
  mediaItems,
  unlockedMediaIds = [],
  unlockedTokensMap = {},
  onOpenPurchaseModal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'video' | 'photo' | 'bundle'>('all');
  const [downloadedMediaIds, setDownloadedMediaIds] = useState<string[]>([]);
  const [lang, setLang] = useState<SupportedLanguage>('es');

  // Animacion del Beso con efecto Zoom al entrar a la tienda (0.5s)
  const [showKiss, setShowKiss] = useState(true);
  const [isKissFading, setIsKissFading] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsKissFading(true);
    }, 500);
    const removeTimer = setTimeout(() => {
      setShowKiss(false);
    }, 850);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const [visitorCountry, setVisitorCountry] = useState<string>('');

  React.useEffect(() => {
    api.getVisitorLocation().then(loc => {
      if (loc && loc.countryCode) {
        setVisitorCountry(loc.countryCode);
      }
    }).catch(() => {});
  }, []);

  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [colombiaMultiplier, setColombiaMultiplier] = useState<number>(7);
  const [paymentVisibility, setPaymentVisibility] = useState<any>(null);
  const [bigoSettings, setBigoSettings] = useState<{ isLive: boolean; streamUrl: string }>({
    isLive: false,
    streamUrl: 'https://www.bigo.tv/es/sid/2525959848_1493541244_1775323289?c=7&p=2&t=0&b=690015288&h=angelinaguzman'
  });

  React.useEffect(() => {
    api.getPaymentMethodsVisibility().then(setPaymentVisibility).catch(() => {});
    api.getGlobalDiscount().then((res) => {
      setGlobalDiscount(res.discountPercentage);
      if (res.colombiaMultiplier !== undefined && res.colombiaMultiplier !== null) {
        setColombiaMultiplier(res.colombiaMultiplier);
      }
    }).catch(() => {});

    api.getBigoLiveSettings().then(setBigoSettings).catch(() => {});
  }, []);

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const visibleCardsRef = React.useRef<Set<string>>(new Set());

  React.useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    let observer: IntersectionObserver | null = null;

    const initObserver = () => {
      const cardElements = document.querySelectorAll('[data-item-id]');
      if (!cardElements || cardElements.length === 0) return;

      visibleCardsRef.current.clear();

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const itemId = entry.target.getAttribute('data-item-id');
            if (!itemId) return;

            if (entry.isIntersecting) {
              visibleCardsRef.current.add(itemId);
            } else {
              visibleCardsRef.current.delete(itemId);
            }
          });

          // Ensure strictly ONE lock is animated at any given time (topmost visible card in order)
          const visibleList = Array.from(visibleCardsRef.current);
          if (visibleList.length > 0) {
            const firstVisible = mediaItems.find((item) => visibleCardsRef.current.has(item.id));
            if (firstVisible) {
              setActiveCardId(firstVisible.id);
            } else {
              setActiveCardId(visibleList[0]);
            }
          } else {
            setActiveCardId(null);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -5% 0px'
        }
      );

      cardElements.forEach((el) => observer?.observe(el));
    };

    initObserver();
    const timer = setTimeout(initObserver, 300);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [mediaItems, filterType]);

  const isColombia = visitorCountry === 'CO';
  const mostExpensiveItemPrice = mediaItems.reduce((max, item) => Number(item.price) > max ? Number(item.price) : max, 0);
  const fullAccessBasePrice = mostExpensiveItemPrice > 0 ? mostExpensiveItemPrice + 20 : 50;

  const getCalculatedPrices = (basePrice: number, itemId?: string) => {
    const activeMult = colombiaMultiplier > 0 ? colombiaMultiplier : 1;
    const isFullAccess = itemId === 'acceso_full_cat_actual' || itemId?.includes('acceso_full');

    if (isColombia) {
      let origCop = 0;
      let discCop = 0;

      if (isFullAccess) {
        const maxItemBase = mediaItems.reduce((max, item) => item.price > max ? item.price : max, 0) || basePrice;
        const maxOrigCop = Math.round(maxItemBase * activeMult * 3500);
        const maxRawDiscounted = globalDiscount > 0 ? Math.round(maxItemBase * (1 - globalDiscount / 100) * 100) / 100 : maxItemBase;
        const maxDiscCop = Math.round(maxRawDiscounted * activeMult * 3500);

        origCop = maxOrigCop * 2;
        discCop = maxDiscCop * 2;
      } else {
        origCop = Math.round(basePrice * activeMult * 3500);
        const rawDiscountedBase = globalDiscount > 0 ? Math.round(basePrice * (1 - globalDiscount / 100) * 100) / 100 : basePrice;
        discCop = Math.round(rawDiscountedBase * activeMult * 3500);
      }

      return {
        originalFormatted: `${origCop.toLocaleString('es-CO')} COP`,
        discountedFormatted: `${discCop.toLocaleString('es-CO')} COP`,
        hasDiscount: globalDiscount > 0,
        discountPercent: globalDiscount
      };
    } else {
      const origUsd = basePrice;
      const discUsd = globalDiscount > 0 ? Math.round(basePrice * (1 - globalDiscount / 100) * 100) / 100 : basePrice;
      return {
        originalFormatted: `${origUsd.toFixed(2)} USD`,
        discountedFormatted: `${discUsd.toFixed(2)} USD`,
        hasDiscount: globalDiscount > 0,
        discountPercent: globalDiscount
      };
    }
  };

  const getItemPrice = (basePrice: number) => {
    const rawDiscountedBase = globalDiscount > 0 ? Math.round(basePrice * (1 - globalDiscount / 100) * 100) / 100 : basePrice;
    const activeMult = colombiaMultiplier > 0 ? colombiaMultiplier : 1;
    return isColombia ? Math.round(rawDiscountedBase * activeMult) : rawDiscountedBase;
  };

  const sortedAllItems = [...mediaItems]
    .filter((item) => item.id !== 'acceso_full_cat_actual')
    .sort((a, b) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    });

  const latest2VideoIds = sortedAllItems
    .filter((item) => item.type === 'video')
    .slice(0, 2)
    .map((v) => v.id);

  const filteredItems = sortedAllItems.filter((item) => {
    if (filterType === 'photo') return item.type === 'photo';
    if (filterType === 'video') return item.type === 'video';
    return true;
  });

  const fullAccessItem: MediaItem = {
    id: 'acceso_full_cat_actual',
    creatorId: creator.id,
    creatorHandle: creator.handle,
    title: t.fullAccessTitle,
    description: t.fullAccessDesc,
    type: 'bundle',
    price: fullAccessBasePrice,
    currency: 'USD',
    previewUrl: creator.avatar,
    downloadUrl: creator.avatar,
    fileSize: 'COMPLETO',
    duration: 'ILIMITADO',
    purchasesCount: 950,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans pb-24 selection:bg-indigo-500 selection:text-white">
      {/* CUBIERTA DEL BESO CON EFECTO DE ZOOM (0.5s) */}
      {showKiss && (
        <div className={`fixed inset-0 z-50 bg-[#030712] flex items-center justify-center transition-opacity duration-350 ${isKissFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[150px] pointer-events-none" />
          <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="text-[120px] sm:text-[150px] drop-shadow-[0_0_40px_rgba(236,72,153,0.9)] animate-kiss-zoom filter select-none">
              💋
            </div>
          </div>
        </div>
      )}

      {/* HEADER BANNER TOP */}
      <div className="relative h-44 sm:h-72 w-full overflow-hidden bg-slate-900">
        <img
          src={(creator.banner && !creator.banner.includes('supabase.co')) ? creator.banner : 'https://i.postimg.cc/1z7CWwzT/live3d-d9e9ae69297f4334205b1f36d3a19dfc-(1).jpg'}
          alt={creator.name}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://i.postimg.cc/1z7CWwzT/live3d-d9e9ae69297f4334205b1f36d3a19dfc-(1).jpg';
          }}
          className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-[#030712]" />

        {/* Top Banner OnlyFans Link */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <a
            id="onlyfans-top-banner-link"
            href="https://onlyfans.com/angelinax69"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-sky-500/30 transition-all hover:scale-105 border border-sky-300/40"
          >
            <Flame className="w-4.5 h-4.5 text-amber-300 fill-amber-300 animate-pulse" />
            <span>OnlyFans Oficial 🔥 (@angelinax69)</span>
            <ExternalLink className="w-4 h-4 text-white ml-0.5" />
          </a>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL (PRIORIDAD TIENDA AL INICIAR) */}
      <div className="max-w-3xl mx-auto px-2.5 sm:px-6 relative z-10 -mt-10 sm:-mt-20">
        <div className="bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-2.5 sm:p-6 text-center space-y-2 sm:space-y-4 shadow-2xl">
          
          {/* Selector de Idioma */}
          <div className="flex justify-end">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-slate-900/90 text-xs font-bold text-indigo-300 border border-indigo-500/30 rounded-xl px-2.5 py-1 outline-none cursor-pointer"
            >
              <option value="es">🇪🇸 ES</option>
              <option value="en">🇺🇸 EN</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="pt">🇧🇷 PT</option>
              <option value="de">🇩🇪 DE</option>
              <option value="it">🇮🇹 IT</option>
            </select>
          </div>

          {/* TRANSMISIÓN EN VIVO BIGO LIVE (SUPERIOR SOBRE EL AVATAR CUANDO ESTÁ EN VIVO) */}
          {bigoSettings.isLive && (
            <div className="w-full mb-3 bg-gradient-to-b from-slate-900 via-zinc-900 to-slate-950 border-2 border-red-500/60 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-2xl shadow-red-500/20 text-left relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-red-500/20">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs sm:text-sm font-black text-red-400 tracking-wider uppercase flex items-center gap-1">
                    🔴 TRANSMISIÓN EN VIVO AHORA · BIGO LIVE
                  </span>
                </div>
                <a
                  href={bigoSettings.streamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-[10px] sm:text-xs border border-red-400/30 transition-all cursor-pointer"
                >
                  <span>Abrir en Bigo</span>
                  <ExternalLink className="w-3 h-3 text-red-300" />
                </a>
              </div>

              {/* Video Player Frame HLS Native (Solo el Video) */}
              <BigoHlsPlayer streamUrl={bigoSettings.streamUrl} />

              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  🔥 Transmitiendo en directo @{creator.handle}
                </span>
                <span className="text-zinc-500 text-[10px]">Transmisión en tiempo real</span>
              </div>
            </div>
          )}

          {/* Avatar creador (Protegido contra clics, arrastrado y descargas) */}
          <div
            className="relative mx-auto w-14 h-14 sm:w-28 sm:h-28 rounded-full p-0.5 sm:p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/20 -mt-10 sm:-mt-20 select-none overflow-hidden"
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              src={(creator.avatar && !creator.avatar.includes('supabase.co')) ? creator.avatar : 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg'}
              alt={creator.name}
              draggable="false"
              fetchPriority="high"
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg';
              }}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-cover rounded-full border-2 border-[#030712] pointer-events-none select-none"
            />
            {/* Capa protectora transparente e invisible sobre el avatar */}
            <div
              className="absolute inset-0 z-20 rounded-full bg-transparent select-none cursor-default"
              onContextMenu={(e) => e.preventDefault()}
            />
            {creator.badge && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-md whitespace-nowrap border border-indigo-400/30 z-30">
                {creator.badge}
              </span>
            )}
          </div>

          {/* Nombre & Handle */}
          <div>
            <div className="flex items-center justify-center gap-1 text-base sm:text-2xl font-black text-white">
              <span>{creator.name}</span>
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 fill-indigo-400/20" />
            </div>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">@{creator.handle}</p>
          </div>

          {/* Bio */}
          <p className="text-[10px] sm:text-sm text-zinc-300 max-w-lg mx-auto leading-tight line-clamp-1 sm:line-clamp-none">
            {creator.bio}
          </p>

          {/* 2. BOTÓN DE TELEGRAM VIP HOT */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              id="telegram-vip-hot-button"
              href="https://t.me/angelinaguz69"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-sky-500/30 hover:scale-105 cursor-pointer border border-sky-300/40"
            >
              <Send className="w-4 h-4 text-white fill-white shrink-0" />
              <span>🔥 Telegram VIP Hot</span>
            </a>
          </div>

          {/* 3. BOTÓN COMPACTO "DESBLOQUEAR TODO" ACCESO FULL (OCULTO) */}
          {/* Hidden as requested */}

        </div>

        {/* 4. TIENDA EXCLUSIVA (PRODUCTOS VISIBLES EN PRIMERA PANTALLA) */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <span>{t.storeSectionTitle}</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">{t.storeSectionSub}</p>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterType === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                {t.filterAll} ({mediaItems.length - 1})
              </button>
              <button
                onClick={() => setFilterType('video')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterType === 'video' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                {t.filterVideos}
              </button>
              <button
                onClick={() => setFilterType('photo')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterType === 'photo' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                {t.filterPhotos}
              </button>
            </div>
          </div>

          {/* GRID DE PRODUCTOS DE LA TIENDA (2 POR LÍNEA EN CELULARES Y PC) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedMediaIds.includes(item.id);
              const prices = getCalculatedPrices(item.price, item.id);
              const isLatest = latest2VideoIds.includes(item.id);

              const handleCardClick = () => {
                if (isUnlocked) {
                  const targetUrl = item.downloadUrl || 'https://t.me/+vREXeP2U7Kw3ZTJh';
                  window.open(targetUrl, '_blank');
                } else if (paymentVisibility?.direct_telegram_mode) {
                  const finalPrice = globalDiscount > 0 ? (item.price * (1 - globalDiscount / 100)) : item.price;
                  const stripeUrl = getStripePaymentUrl(Number(finalPrice));
                  try {
                    localStorage.setItem('geolink_pending_telegram_payment', JSON.stringify({
                      mediaId: item.id,
                      mediaTitle: item.title,
                      amount: Number(finalPrice),
                      currency: item.currency || 'USD',
                      stripeUrl,
                      downloadUrl: item.downloadUrl || '',
                      timestamp: Date.now(),
                    }));
                  } catch {}
                  window.open(stripeUrl, '_blank');
                } else {
                  onOpenPurchaseModal(item);
                }
              };

              const isMobileFocused = activeCardId === item.id;

              return (
                <div
                  key={item.id}
                  data-item-id={item.id}
                  onClick={handleCardClick}
                  className={`rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group shadow-xl hover:-translate-y-1 cursor-pointer ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-sky-950/60 to-slate-950 border-2 border-sky-500/60 hover:border-sky-400 shadow-sky-500/25'
                      : 'bg-slate-900/80 border border-white/10 hover:border-indigo-500/40'
                  }`}
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-950">
                    <img
                      src={EXTERNAL_PREVIEW_MAP[item.id] || ((item.previewUrl && !item.previewUrl.includes('supabase.co')) ? item.previewUrl : 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg')}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg';
                      }}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        !isUnlocked ? 'blur-[3px] scale-105 opacity-80' : 'opacity-100 blur-none'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap items-center gap-1 sm:gap-1.5 z-10">
                      <span className="bg-slate-950/80 border border-white/20 text-white text-[8px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                        {item.type === 'video' ? <Film className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-400" /> : <ImageIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400" />}
                        <span>{item.type === 'video' ? 'Video HD' : 'Galería'}</span>
                      </span>

                      {item.isExtraPremium && (
                        <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 text-[8px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
                          <span>💎 EXTRA</span>
                        </span>
                      )}

                      {isUnlocked ? (
                        <span className="bg-sky-500 text-slate-950 text-[8px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg flex items-center gap-1">
                          <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-slate-950" />
                          <span>{t.unlockedBadge}</span>
                        </span>
                      ) : (
                        isLatest && (
                          <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[8px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                            <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 fill-amber-300" />
                            <span>{t.newBadge}</span>
                          </span>
                        )
                      )}
                    </div>

                    {/* Lock Overlay with Animated Open Lock & Unlock Badge on Hover & Single Focused Mobile Card */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4 text-center pointer-events-none z-10">
                        <div className="flex flex-col items-center group-hover:scale-105 transition-all duration-300">
                          <div className={`relative w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-600/40 border border-indigo-400/60 flex items-center justify-center backdrop-blur-md shadow-lg shadow-indigo-600/30 group-hover:bg-gradient-to-br group-hover:from-amber-500/40 group-hover:to-indigo-600/60 group-hover:border-amber-400/80 group-hover:shadow-amber-500/40 transition-all duration-300 ${
                            isMobileFocused ? 'mobile-active-box' : ''
                          }`}>
                            {/* Closed Lock */}
                            <Lock className={`w-4 h-4 sm:w-6 sm:h-6 text-indigo-200 transition-all duration-300 group-hover:opacity-0 group-hover:scale-50 group-hover:-rotate-12 absolute ${
                              isMobileFocused ? 'mobile-active-closed-lock' : ''
                            }`} />
                            
                            {/* Open Lock */}
                            <Unlock className={`w-4 h-4 sm:w-6 sm:h-6 text-amber-300 opacity-0 scale-50 rotate-12 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-0 transition-all duration-300 ease-out absolute ${
                              isMobileFocused ? 'mobile-active-open-lock' : ''
                            }`} />
                          </div>

                          {/* "Unlock" Badge sliding up on hover & mobile focus */}
                          <span className={`mt-1 sm:mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 text-[9px] sm:text-[11px] font-black uppercase px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg shadow-amber-400/40 tracking-wider border border-amber-200/80 flex items-center gap-1 ${
                            isMobileFocused ? 'mobile-active-badge' : ''
                          }`}>
                            <Unlock className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                            <span>Unlock</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                    <div>
                      <h3 className={`font-extrabold text-xs sm:text-base line-clamp-1 transition-colors ${
                        isUnlocked ? 'text-sky-300 group-hover:text-sky-200' : 'text-white group-hover:text-indigo-300'
                      }`}>
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-[10px] sm:text-xs text-zinc-400 line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Meta Info & Price */}
                    <div className="pt-1.5 sm:pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0">
                      <div className="text-left">
                        <div className="text-[9px] sm:text-[10px] text-zinc-400 font-medium">
                          {isUnlocked ? 'Estado:' : 'Precio:'}
                        </div>
                        <div className="flex items-baseline gap-1">
                          {isUnlocked ? (
                            <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-wide">
                              Comprado
                            </span>
                          ) : (
                            <>
                              <span className="text-sm sm:text-lg font-black text-amber-300">
                                {prices.hasDiscount ? prices.discountedFormatted : prices.originalFormatted}
                              </span>
                              {prices.hasDiscount && (
                                <span className="line-through text-[9px] sm:text-xs text-rose-400 opacity-80 font-bold">
                                  {prices.originalFormatted}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Unlock Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick();
                        }}
                        className={`w-full sm:w-auto justify-center py-1.5 sm:py-2.5 px-2.5 sm:px-4 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 transition-all shadow-lg cursor-pointer ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 text-slate-950 shadow-sky-500/30 hover:scale-105'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-105'
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            <Send className="w-3 h-3 sm:w-4 sm:h-4 fill-slate-950" />
                            <span>{t.viewTelegramBtn}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4 group-hover:hidden transition-all duration-300" />
                            <Unlock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300 hidden group-hover:inline transition-all duration-300" />
                            <span>{t.unlockBtn}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
