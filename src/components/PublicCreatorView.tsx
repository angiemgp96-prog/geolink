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

  React.useEffect(() => {
    api.getVisitorLocation().then(loc => {
      if (loc && loc.countryCode) {
        setLang(detectLanguage(loc.countryCode));
      }
    }).catch(() => {
      setLang(detectLanguage());
    });
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = mediaItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  // Helper icon renderer con íconos distintivos por plataforma
  const renderLinkIcon = (iconName: string, linkTitle: string = '') => {
    const combined = (iconName + ' ' + linkTitle).toLowerCase();
    if (combined.includes('onlyfans') || combined.includes('of')) {
      return <Flame className="w-5 h-5 text-sky-400 fill-sky-400/20 animate-pulse" />;
    }
    if (combined.includes('instagram')) {
      return <Instagram className="w-5 h-5 text-pink-400" />;
    }
    if (combined.includes('youtube')) {
      return <Youtube className="w-5 h-5 text-red-500" />;
    }
    if (combined.includes('tiktok') || combined.includes('video')) {
      return <Video className="w-5 h-5 text-cyan-400" />;
    }
    if (combined.includes('telegram') || combined.includes('messagecircle')) {
      return <Send className="w-5 h-5 text-sky-400" />;
    }
    if (combined.includes('link.me') || combined.includes('globe') || combined.includes('web')) {
      return <Globe className="w-5 h-5 text-purple-400" />;
    }
    if (combined.includes('dumbbell') || combined.includes('fit')) {
      return <Dumbbell className="w-5 h-5 text-amber-400" />;
    }
    return <LinkIcon className="w-5 h-5 text-indigo-400" />;
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin flex items-center justify-center">
            <div className="w-full h-full bg-[#030712] rounded-full" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="text-xl font-bold text-white tracking-wide">Cargando perfil exclusivo...</h2>
          <p className="text-xs text-zinc-400">Verificando enlaces oficiales y catálogo de @{creator.handle}</p>
        </div>
        <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-100 pb-20 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Banner & Header */}
      <div className="relative w-full h-56 md:h-72 bg-zinc-900/60 overflow-hidden">
        <img
          src={creator.banner}
          alt={creator.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
      </div>

      {/* Profile Card Container */}
      <div className="max-w-3xl mx-auto px-4 -mt-24 relative z-10 space-y-8">
        
        {/* Creator Info Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-4 relative">
          
          {/* Floating Language Switcher Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg z-20">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-bold uppercase text-[10px]"
            >
              <option value="es" className="bg-zinc-900 text-white">🇪🇸 ES</option>
              <option value="en" className="bg-zinc-900 text-white">🇺🇸 EN</option>
              <option value="pt" className="bg-zinc-900 text-white">🇧🇷 PT</option>
              <option value="fr" className="bg-zinc-900 text-white">🇫🇷 FR</option>
              <option value="de" className="bg-zinc-900 text-white">🇩🇪 DE</option>
              <option value="it" className="bg-zinc-900 text-white">🇮🇹 IT</option>
            </select>
          </div>

          {/* Avatar with Gradient Rim */}
          <div className="relative mx-auto w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/20 -mt-20 md:-mt-24">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-full h-full object-cover rounded-full border-2 border-[#030712]"
            />
            {creator.badge && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md whitespace-nowrap border border-indigo-400/30">
                {creator.badge}
              </span>
            )}
          </div>

          {/* Name & Handle */}
          <div>
            <div className="flex items-center justify-center gap-1.5 text-2xl md:text-3xl font-extrabold text-white">
              <span>{creator.name}</span>
              <CheckCircle2 className="w-6 h-6 text-indigo-400 shrink-0 fill-indigo-400/20" />
            </div>
            <p className="text-sm text-indigo-400 font-medium mt-0.5">@{creator.handle}</p>
          </div>

          {/* Bio */}
          <p className="text-xs md:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
            {creator.bio}
          </p>

          {/* Quick VIP Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              id="telegram-vip-direct-button"
              href="https://t.me/Angelinaguzman69"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-extrabold text-xs uppercase tracking-wide transition-all border border-sky-500/40 hover:scale-105"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Contacto Directo Telegram VIP</span>
            </a>

            <a
              id="telegram-hot-group-button"
              href="https://t.me/+vREXeP2U7Kw3ZTJh"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wide transition-all shadow-lg shadow-rose-600/30 border border-pink-400/40 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>🔥 Grupo Hot Telegram</span>
            </a>
          </div>

          {/* Custom Links (Compact Section) */}
          <div className="space-y-2 pt-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-left">
              Enlaces Directos
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {creator.links.filter(l => l.active).map((link: CustomLink) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 px-3 py-2 rounded-xl flex items-center justify-between transition-all group shadow-sm text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-zinc-900/80 border border-white/10 flex items-center justify-center shrink-0">
                      {renderLinkIcon(link.icon, link.title)}
                    </div>
                    <span className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors truncate">
                      {link.title}
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-white transition-colors shrink-0 ml-1" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Botón Acceso Full ($50 USD) — Desbloquear Catálogo Actual */}
        <div className="bg-gradient-to-r from-amber-950/40 via-indigo-950/40 to-purple-950/40 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl transition-all hover:border-amber-400/60">
          <div className="flex items-center gap-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xl shrink-0 shadow-lg shadow-amber-500/20">
              👑
            </div>
            <div>
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <span>{t.fullAccessTitle}</span>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">$50 USD</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">{t.fullAccessDesc}</p>
            </div>
          </div>

          <button
            id="acceso-full-button"
            onClick={() => onOpenPurchaseModal({
              id: 'acceso_full_cat_actual',
              creatorId: creator.id,
              creatorHandle: creator.handle,
              title: `👑 ${t.fullAccessTitle}`,
              description: t.fullAccessDesc,
              type: 'bundle',
              price: 50,
              currency: 'USD',
              previewUrl: creator.avatar,
              downloadUrl: creator.avatar,
              fileSize: 'COMPLETO',
              duration: 'ILIMITADO',
              purchasesCount: 920,
              isFeatured: true,
              createdAt: new Date().toISOString()
            })}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 uppercase tracking-wider"
          >
            <span>{t.fullAccessBtn}</span>
          </button>
        </div>

        {/* Digital Store Section (Fotos & Videos Exclusivos) */}
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4" />
                <span>{t.storeSectionTitle}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">{t.storeSectionSub}</h2>
            </div>

            {/* Content Filters */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                id="filter-all-button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t.filterAll} ({mediaItems.length})
              </button>
              <button
                id="filter-video-button"
                onClick={() => setFilterType('video')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === 'video' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" /> {t.filterVideos}
              </button>
              <button
                id="filter-photo-button"
                onClick={() => setFilterType('photo')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === 'photo' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> {t.filterPhotos}
              </button>
            </div>
          </div>

          {/* Media Store Items Grid (Vertical Aspect Ratio for Portrait Photos/Videos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredItems.map((item) => {
              const isUnlocked = unlockedMediaIds.includes(item.id);
              const downloadToken = unlockedTokensMap[item.id];

              return (
                <div
                  key={item.id}
                  className={`bg-white/5 backdrop-blur-md border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group ${
                    isUnlocked ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-white/10 hover:border-indigo-500/50'
                  }`}
                >
                  {/* Media Preview Card with Vertical Portrait Aspect Ratio */}
                  <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-zinc-900/80 overflow-hidden">
                    <img
                      src={item.previewUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    
                    {/* Lock or Unlocked Overlay */}
                    {isUnlocked ? (
                      <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                        <div className="px-4 py-2 rounded-full border border-emerald-400/60 bg-emerald-600/40 backdrop-blur-md flex items-center gap-2 text-white font-extrabold text-xs shadow-2xl uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{t.purchasedBadge}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                          {item.type === 'video' ? (
                            <Play className="w-6 h-6 text-white fill-white/30 ml-0.5" />
                          ) : (
                            <Lock className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Type Badge & Extra Premium Tag */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-1.5">
                        {item.type === 'video' && <Film className="w-3.5 h-3.5 text-indigo-400" />}
                        {item.type === 'photo' && <ImageIcon className="w-3.5 h-3.5 text-indigo-300" />}
                        {item.type === 'bundle' && <Layers className="w-3.5 h-3.5 text-amber-400" />}
                        <span className="capitalize">{item.type}</span>
                      </div>

                      {item.isExtraPremium && (
                        <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 border border-amber-300/80 px-2.5 py-1 rounded-full text-[10px] font-black text-white flex items-center gap-1 shadow-lg shadow-amber-500/30 uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
                          <span>{t.extraPremiumBadge}</span>
                        </div>
                      )}
                    </div>

                    {/* Price Tag (Clean Backdrop Blur Label - NO Button Background) */}
                    <div className="absolute bottom-3 right-3 text-white font-extrabold text-sm px-3 py-1 rounded-xl backdrop-blur-md bg-black/70 border border-white/15 shadow-xl">
                      {isUnlocked ? (
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">✅ {t.purchasedBadge}</span>
                      ) : (
                        <span className="text-amber-300 font-extrabold text-sm drop-shadow-md">
                          ${item.price.toFixed(2)} <span className="text-[10px] text-zinc-300 font-bold">{item.currency}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content & Action */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                      <span>
                        {item.duration ? `⏳ ${item.duration}` : `📦 ${item.fileSize}`}
                      </span>
                      <span className="text-emerald-400 font-medium">
                        🔥 {item.purchasesCount} {t.purchasesCountLabel}
                      </span>
                    </div>

                    {/* Buy / Unlock OR Download Button */}
                    {isUnlocked ? (
                      downloadedMediaIds.includes(item.id) || Boolean(localStorage.getItem(`geolink_downloaded_${item.id}`)) ? (
                        <div className="w-full py-3 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed">
                          <Lock className="w-4 h-4 text-zinc-500" />
                          <span>{t.downloadedLimit}</span>
                        </div>
                      ) : (
                        <a
                          id={`download-media-${item.id}`}
                          href={downloadToken ? `/api/media/download/${downloadToken}` : item.downloadUrl}
                          onClick={() => {
                            setDownloadedMediaIds((prev) => [...prev, item.id]);
                            try {
                              localStorage.setItem(`geolink_downloaded_${item.id}`, 'true');
                            } catch {}
                          }}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-400/40"
                        >
                          <Download className="w-4 h-4 animate-bounce" />
                          <span>{t.downloadNowBtn}</span>
                        </a>
                      )
                    ) : (
                      <button
                        id={`buy-media-${item.id}`}
                        onClick={() => onOpenPurchaseModal(item)}
                        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        <span>{t.unlockNowBtn} (${item.price.toFixed(2)})</span>
                      </button>
                    )}

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
