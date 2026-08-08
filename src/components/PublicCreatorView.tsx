import React, { useState } from 'react';
import { Play, Lock, CheckCircle2, Instagram, Youtube, Video, Dumbbell, MessageCircle, ExternalLink, Sparkles, Image as ImageIcon, Film, Layers, ShoppingBag, Send, Download } from 'lucide-react';
import { CreatorProfile, MediaItem, CustomLink } from '../types';

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

  const filteredItems = mediaItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  // Helper icon renderer
  const renderLinkIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-400" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'video': case 'tiktok': return <Video className="w-5 h-5 text-cyan-400" />;
      case 'dumbbell': return <Dumbbell className="w-5 h-5 text-amber-400" />;
      case 'messagecircle': case 'telegram': return <MessageCircle className="w-5 h-5 text-sky-400" />;
      default: return <ExternalLink className="w-5 h-5 text-purple-400" />;
    }
  };

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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-center space-y-4">
          
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
          <p className="text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
            {creator.bio}
          </p>

          {/* Action Buttons: Contacto VIP & Grupo Hot Telegram */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              id="telegram-vip-direct-button"
              href="https://t.me/Angelinaguzman69"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold text-xs transition-all shadow-sm"
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

          {/* Custom Links (Link.me Section) */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-left">
              Mis Enlaces Oficiales
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {creator.links.filter(l => l.active).map((link: CustomLink) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 p-4 rounded-2xl flex items-center justify-between transition-all group shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                      {renderLinkIcon(link.icon)}
                    </div>
                    <span className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                      {link.title}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Digital Store Section (Fotos & Videos Exclusivos) */}
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4" />
                <span>Tienda Exclusiva</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">Fotos & Videos Desbloqueables</h2>
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
                Todos ({mediaItems.length})
              </button>
              <button
                id="filter-video-button"
                onClick={() => setFilterType('video')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === 'video' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" /> Videos
              </button>
              <button
                id="filter-photo-button"
                onClick={() => setFilterType('photo')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterType === 'photo' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Fotos
              </button>
            </div>
          </div>

          {/* Media Store Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {/* Media Preview Card */}
                  <div className="relative h-56 bg-zinc-900/80 overflow-hidden">
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
                          <span>Adquirido</span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                          {item.type === 'video' ? (
                            <Play className="w-6 h-6 text-white fill-white/30 ml-0.5" />
                          ) : (
                            <Lock className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-1.5">
                      {item.type === 'video' && <Film className="w-3.5 h-3.5 text-indigo-400" />}
                      {item.type === 'photo' && <ImageIcon className="w-3.5 h-3.5 text-indigo-300" />}
                      {item.type === 'bundle' && <Layers className="w-3.5 h-3.5 text-amber-400" />}
                      <span className="capitalize">{item.type}</span>
                    </div>

                    {/* Price Tag or Unlocked Tag */}
                    <div className={`absolute bottom-3 right-3 text-white font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow-lg border ${
                      isUnlocked ? 'bg-emerald-600 border-emerald-400/40' : 'bg-indigo-600 border-indigo-400/30'
                    }`}>
                      {isUnlocked ? '✅ Pagado' : `$${item.price.toFixed(2)} ${item.currency}`}
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
                        🔥 {item.purchasesCount} Compras
                      </span>
                    </div>

                    {/* Buy / Unlock OR Download Button */}
                    {isUnlocked ? (
                      <a
                        id={`download-media-${item.id}`}
                        href={downloadToken ? `/api/media/download/${downloadToken}` : item.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-400/40"
                      >
                        <Download className="w-4 h-4 animate-bounce" />
                        <span>Descargar</span>
                      </a>
                    ) : (
                      <button
                        id={`buy-media-${item.id}`}
                        onClick={() => onOpenPurchaseModal(item)}
                        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Desbloquear (${item.price.toFixed(2)})</span>
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
