import React, { useState } from 'react';
import { Play, Lock, Unlock, CheckCircle2, Instagram, Youtube, Video, Dumbbell, MessageCircle, ExternalLink, Sparkles, Image as ImageIcon, Film, Layers, ShoppingBag, Send, Download, Globe, Flame, Link as LinkIcon } from 'lucide-react';
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
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    api.getVisitorLocation().then(loc => {
      if (loc && loc.countryCode) {
        setVisitorCountry(loc.countryCode);
      }
    }).catch(() => {});
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

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-amber-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-white font-extrabold text-lg tracking-wider">
          <span>GEOLINK</span>
          <span className="text-xs bg-indigo-600 text-white font-black px-2 py-0.5 rounded-full">VIP</span>
        </div>
        <p className="text-xs text-indigo-300/70 font-medium mt-1">Cargando perfil exclusivo y tienda digital...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans pb-24 selection:bg-indigo-500 selection:text-white">
      {/* HEADER BANNER TOP */}
      <div className="relative h-44 sm:h-72 w-full overflow-hidden bg-slate-900">
        <img
          src={creator.banner}
          alt={creator.name}
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

          {/* Avatar creador */}
          <div className="relative mx-auto w-14 h-14 sm:w-28 sm:h-28 rounded-full p-0.5 sm:p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/20 -mt-10 sm:-mt-20">
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

          {/* 2. BOTONES DE TELEGRAM DESTACADOS */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            {/* Botón 1: Contacto Directo Telegram VIP */}
            <a
              id="telegram-direct-contact-button"
              href="https://t.me/Angelinaguzman69"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-3 rounded-full bg-sky-950/80 border border-sky-500/60 hover:bg-sky-900/80 hover:border-sky-400 text-sky-300 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 hover:scale-105 cursor-pointer"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>{t.telegramDirectContact}</span>
            </a>

            {/* Botón 2: Grupo Hot Telegram */}
            <a
              id="telegram-channel-button"
              href="https://t.me/+vREXeP2U7Kw3ZTJh"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{t.telegramHotGroup}</span>
            </a>
          </div>

          {/* 3. BOTÓN COMPACTO "DESBLOQUEAR TODO" ACCESO FULL */}
          {(() => {
            const fullPrices = getCalculatedPrices(fullAccessBasePrice, "acceso_full_cat_actual");
            const formattedDisplayPrice = fullPrices.hasDiscount ? fullPrices.discountedFormatted : fullPrices.originalFormatted;
            return (
              <div className="pt-1 sm:pt-2">
                <button
                  id="desbloquear-todo-button"
                  onClick={() => onOpenPurchaseModal(fullAccessItem)}
                  className="w-full py-2.5 px-3 sm:py-3.5 sm:px-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-pink-600 to-purple-700 hover:from-amber-400 hover:to-purple-600 text-white font-black shadow-xl shadow-purple-900/40 border sm:border-2 border-amber-300/50 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 text-center sm:text-left">
                    <div className="w-full">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                        <span className="font-black text-white uppercase tracking-wide text-[11px] sm:text-sm">
                          {t.fullAccessTitle} — ({formattedDisplayPrice})
                        </span>
                        {fullPrices.hasDiscount && (
                          <span className="bg-rose-500/30 text-amber-200 border border-amber-400/50 px-1.5 py-0.5 rounded text-[9px] uppercase font-black">
                            {fullPrices.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-amber-100/90 font-medium mt-0.5 leading-snug">
                        {t.fullAccessDesc}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                      <span className="text-xs sm:text-sm font-extrabold text-amber-200 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-300/30">
                        {formattedDisplayPrice}
                      </span>
                    </div>
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

          {/* GRID DE PRODUCTOS DE LA TIENDA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedMediaIds.includes(item.id);
              const prices = getCalculatedPrices(item.price, item.id);
              const isLatest = latest2VideoIds.includes(item.id);

              const handleCardClick = () => {
                if (isUnlocked) {
                  const targetUrl = item.downloadUrl || 'https://t.me/+KKTelchPdBhjOGVh';
                  window.open(targetUrl, '_blank');
                } else {
                  onOpenPurchaseModal(item);
                }
              };

              return (
                <div
                  key={item.id}
                  onClick={handleCardClick}
                  className={`rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group shadow-xl hover:-translate-y-1 cursor-pointer ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-sky-950/60 to-slate-950 border-2 border-sky-500/60 hover:border-sky-400 shadow-sky-500/25'
                      : 'bg-slate-900/80 border border-white/10 hover:border-indigo-500/40'
                  }`}
                >
                  {/* Image Preview */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-950">
                    <img
                      src={item.previewUrl}
                      alt={item.title}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                        !isUnlocked ? 'blur-[3px] scale-105 opacity-80' : 'opacity-100 blur-none'
                      }`}
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

                      {isUnlocked ? (
                        <span className="bg-sky-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                          <Send className="w-3 h-3 fill-slate-950" />
                          <span>{t.unlockedBadge}</span>
                        </span>
                      ) : (
                        isLatest && (
                          <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                            <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                            <span>{t.newBadge}</span>
                          </span>
                        )
                      )}
                    </div>

                    {/* Lock Overlay with Animated Open Lock & Unlock Badge on Hover */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none z-10">
                        <div className="flex flex-col items-center group-hover:scale-105 transition-all duration-300">
                          <div className="relative w-12 h-12 rounded-2xl bg-indigo-600/40 border border-indigo-400/60 flex items-center justify-center backdrop-blur-md shadow-lg shadow-indigo-600/30 group-hover:bg-gradient-to-br group-hover:from-amber-500/40 group-hover:to-indigo-600/60 group-hover:border-amber-400/80 group-hover:shadow-amber-500/40 transition-all duration-300">
                            {/* Closed Lock (Default state, shrinks & fades out on hover) */}
                            <Lock className="w-6 h-6 text-indigo-200 transition-all duration-300 group-hover:opacity-0 group-hover:scale-50 group-hover:-rotate-12 absolute" />
                            
                            {/* Open Lock (Pops open & glows amber on hover) */}
                            <Unlock className="w-6 h-6 text-amber-300 opacity-0 scale-50 rotate-12 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-0 transition-all duration-300 ease-out absolute" />
                          </div>

                          {/* "Unlock" Badge sliding up on hover */}
                          <span className="mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-amber-400/40 tracking-wider border border-amber-200/80 flex items-center gap-1">
                            <Unlock className="w-3 h-3 stroke-[2.5]" />
                            <span>Unlock</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className={`font-extrabold text-base line-clamp-1 transition-colors ${
                        isUnlocked ? 'text-sky-300 group-hover:text-sky-200' : 'text-white group-hover:text-indigo-300'
                      }`}>
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
                        <div className="text-[10px] text-zinc-400 font-medium">
                          {isUnlocked ? 'Estado del Ítem:' : 'Precio Exclusivo:'}
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          {isUnlocked ? (
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                              Comprado / Acceso Activo
                            </span>
                          ) : (
                            <>
                              <span className="text-lg font-black text-amber-300">
                                {prices.hasDiscount ? prices.discountedFormatted : prices.originalFormatted}
                              </span>
                              {prices.hasDiscount && (
                                <span className="line-through text-xs text-rose-400 opacity-80 font-bold">
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
                        className={`py-2.5 px-4 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 text-slate-950 shadow-sky-500/30 hover:scale-105'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30 hover:scale-105'
                        }`}
                      >
                        {isUnlocked ? (
                          <>
                            <Send className="w-4 h-4 fill-slate-950" />
                            <span>{t.viewTelegramBtn}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 group-hover:hidden transition-all duration-300" />
                            <Unlock className="w-4 h-4 text-amber-300 hidden group-hover:inline transition-all duration-300" />
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
