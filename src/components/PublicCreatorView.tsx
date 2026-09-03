import React, { useState } from 'react';
import { Play, Lock, CheckCircle2, Instagram, Youtube, Video, Dumbbell, MessageCircle, ExternalLink, Sparkles, Image as ImageIcon, Film, Layers, ShoppingBag, Send, Download, Globe, Flame, Link as LinkIcon } from 'lucide-react';
import { CreatorProfile, MediaItem, CustomLink } from '../types';
import { detectLanguage, TRANSLATIONS, SupportedLanguage } from '../data/translations';
import { api } from '../services/api';

interface PublicCreatorViewProps {
  creator: CreatorProfile;
  mediaItems: MediaItem[];
  unlockedMediaIds?: string[];
  unlockedTokensMap?: Record<string, string>;
  onOpenPurchaseModal: (item: MediaItem) => void;
}

export const PublicCreatorView: React.FC<PublicCreatorViewProps> = ({
  creator,
  mediaItems,
  unlockedMediaIds = [],
  unlockedTokensMap = {},
  onOpenPurchaseModal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'video' | 'photo' | 'bundle'>('all');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [downloadedMediaIds, setDownloadedMediaIds] = useState<string[]>([]);
  const [lang, setLang] = useState<SupportedLanguage>('es');

  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;

  const [visitorCountry, setVisitorCountry] = useState<string>('');

  React.useEffect(() => {
    api.getVisitorLocation().then(loc => {
      if (loc && loc.countryCode) {
        setVisitorCountry(loc.countryCode);
        setLang(detectLanguage(loc.countryCode));
      }
    }).catch(() => {
      setLang(detectLanguage());
    });
  }, []);

  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [colombiaMultiplier, setColombiaMultiplier] = useState<number>(7);

  React.useEffect(() => {
    api.getGlobalDiscount().then((res) => {
      setGlobalDiscount(res.discountPercentage);
      if (res.colombiaMultiplier !== undefined && res.colombiaMultiplier !== null) {
        setColombiaMultiplier(res.colombiaMultiplier);
      }
    }).catch(() => {});
  }, []);

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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const allVideos = mediaItems.filter((item) => item.type === 'video' && item.id !== 'acceso_full_cat_actual');
  const sortedVideos = [...allVideos].sort((a, b) => {
    const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    if (tA && tB && tA !== tB) return tB - tA;
    return mediaItems.indexOf(b) - mediaItems.indexOf(a);
  });
  const latest2VideoIds = sortedVideos.slice(0, 2).map((v) => v.id);

  const baseFiltered = mediaItems.filter((item) => {
    if (item.id === 'acceso_full_cat_actual') return false;
    if (filterType === 'photo') return item.type === 'photo';
    if (filterType === 'video') return item.type === 'video';
    return true;
  });

  const top2LatestVideos = baseFiltered.filter((item) => latest2VideoIds.includes(item.id));
  const remainingItems = baseFiltered.filter((item) => !latest2VideoIds.includes(item.id));
  const filteredItems = [...top2LatestVideos, ...remainingItems];

  const fullAccessItem: MediaItem = {
    id: 'acceso_full_cat_actual',
    creatorId: creator.id,
    creatorHandle: creator.handle,
    title: t.fullAccessTitle || 'Acceso Full — Catálogo Actual',
    description: 'Desbloquea instantáneamente todas las fotos y videos publicados hasta la fecha (No incluye contenidos etiquetados como Extra Premium ✨).',
    type: 'bundle',
    price: fullAccessBasePrice,
    currency: 'USD',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    downloadUrl: '',
    fileSize: 'Todas las Galerías',
    duration: 'VIP Pass',
    purchasesCount: 99
  };

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans pb-24 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-900/30 via-purple-900/20 to-transparent blur-3xl pointer-events-none" />

      {/* HEADER BANNER CON ONLYFANS FLOTANTE */}
      <div className="relative h-44 sm:h-52 md:h-60 overflow-hidden">
        <img
          src={creator.banner}
          alt={creator.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#030712]" />

        {/* 1. ONLYFANS CENTRADO FLOTANTE SOBRE LA FOTO DE PORTADA SUPERIOR */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 w-auto">
          <a
            id="onlyfans-header-badge"
            href="https://onlyfans.com/angelinax69"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2.5 py-2.5 px-5 sm:px-6 rounded-full bg-[#00AFF0]/95 hover:bg-[#00AFF0] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#00AFF0]/50 border-2 border-white/50 backdrop-blur-md transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <Flame className="w-4.5 h-4.5 text-amber-300 fill-amber-300 animate-pulse" />
            <span>OnlyFans Oficial 🔥 (@angelinax69)</span>
            <ExternalLink className="w-4 h-4 text-white ml-0.5" />
          </a>
        </div>
      </div>

      {/* CONTAINER PRINCIPAL (PRIORIDAD TIENDA AL INICIAR) */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 relative z-10 -mt-16 sm:-mt-20">
        <div className="bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 text-center space-y-4 shadow-2xl">
          
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

          {/* Avatar creador */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/20 -mt-16 sm:-mt-20">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-full h-full object-cover rounded-full border-2 border-[#030712]"
            />
            {creator.badge && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-md whitespace-nowrap border border-indigo-400/30">
                {creator.badge}
              </span>
            )}
          </div>

          {/* Nombre & Handle */}
          <div>
            <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black text-white">
              <span>{creator.name}</span>
              <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 fill-indigo-400/20" />
            </div>
            <p className="text-xs text-indigo-400 font-medium mt-0.5">@{creator.handle}</p>
          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
            {creator.bio}
          </p>

          {/* 2. BOTÓN TELEGRAM XXX SÚPER HOT Y DESTACADO */}
          <div className="flex justify-center pt-1">
            <a
              id="telegram-channel-button"
              href="https://t.me/+KKTelchPdBhjOGVh"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-rose-600/35 border-2 border-pink-300/40 hover:scale-105 cursor-pointer"
            >
              <Flame className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
              <span>🔥 CANAL XXX +18 TELEGRAM 🔞</span>
              <Sparkles className="w-4.5 h-4.5 text-amber-300 animate-bounce" />
            </a>
          </div>

          {/* 3. BOTÓN COMPACTO "DESBLOQUEAR TODO" ACCESO FULL */}
          {(() => {
            const fullPrices = getCalculatedPrices(fullAccessBasePrice, "acceso_full_cat_actual");
            return (
              <div className="pt-2">
                <button
                  id="desbloquear-todo-button"
                  onClick={() => onOpenPurchaseModal(fullAccessItem)}
                  className="w-full py-3.5 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-700 hover:from-amber-400 hover:to-purple-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-900/40 border-2 border-amber-300/50 flex items-center justify-between transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-md">
                      👑
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-white uppercase tracking-wide text-xs sm:text-sm">👑 DESBLOQUEAR TODO EL CATÁLOGO — (NO INCLUYE CONTENIDOS EXTRA PREMIUM)</span>
                        {fullPrices.hasDiscount && (
                          <span className="bg-rose-500/30 text-amber-200 border border-amber-400/50 px-1.5 py-0.5 rounded text-[9px] uppercase font-black">
                            {fullPrices.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-amber-100/90 font-medium">
                        Acceso instantáneo a fotos y videos sin censura (NO INCLUYE CONTENIDOS EXTRA PREMIUM)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-amber-200 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-300/30">
                      {fullPrices.hasDiscount ? fullPrices.discountedFormatted : fullPrices.originalFormatted}
                    </span>
                  </div>
                </button>
              </div>
            );
          })()}

        </div>

        {/* 4. TIENDA EXCLUSIVA (PRODUCTOS VISIBLES EN PRIMERA PANTALLA) */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <span>Tienda Exclusiva</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Fotos & Videos Desbloqueables</p>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-white/10 p-1 rounded-xl">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterType === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                Todos ({mediaItems.length - 1})
              </button>
              <button
                onClick={() => setFilterType('video')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterType === 'video' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                Videos
              </button>
              <button
                onClick={() => setFilterType('photo')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterType === 'photo' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                Fotos
              </button>
            </div>
          </div>

          {/* GRID DE PRODUCTOS DE LA TIENDA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedMediaIds.includes(item.id);
              const prices = getCalculatedPrices(item.price, item.id);
              const isLatest = latest2VideoIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group shadow-xl hover:-translate-y-1"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-950">
                    <img
                      src={item.previewUrl}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isUnlocked ? 'blur-[3px] scale-105 opacity-80' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                      <span className="bg-slate-950/80 border border-white/20 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                        {item.type === 'video' ? <Film className="w-3 h-3 text-indigo-400" /> : <ImageIcon className="w-3 h-3 text-pink-400" />}
                        <span>{item.type === 'video' ? 'Video HD' : 'Galería'}</span>
                      </span>

                      {item.isExtraPremium && (
                        <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
                          <span>💎 EXTRA PREMIUM</span>
                        </span>
                      )}

                      {isLatest && (
                        <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                          <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                          <span>¡NUEVO!</span>
                        </span>
                      )}
                    </div>

                    {/* Lock Overlay */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/40 border border-indigo-400/60 flex items-center justify-center backdrop-blur-md shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                          <Lock className="w-6 h-6 text-indigo-200" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-extrabold text-base text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Meta Info & Price */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="text-left">
                        <div className="text-[10px] text-zinc-400 font-medium">Precio Exclusivo:</div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-amber-300">
                            {prices.hasDiscount ? prices.discountedFormatted : prices.originalFormatted}
                          </span>
                          {prices.hasDiscount && (
                            <span className="line-through text-xs text-rose-400 opacity-80 font-bold">
                              {prices.originalFormatted}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Unlock Button */}
                      <button
                        onClick={() => onOpenPurchaseModal(item)}
                        className={`py-2.5 px-4 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
                          isUnlocked
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-105'
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Desbloqueado</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Desbloquear</span>
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
