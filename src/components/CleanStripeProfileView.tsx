import React, { useState } from 'react';
import { CreatorProfile, MediaItem } from '../types';
import { Camera, Sparkles, BookOpen, Film, Image as ImageIcon, ShieldCheck, CheckCircle2, Lock, ExternalLink, HelpCircle, FileText } from 'lucide-react';
import { PurchaseModal } from './PurchaseModal';

interface CleanStripeProfileViewProps {
  creator: CreatorProfile;
  onOpenPurchaseModal?: (item: MediaItem) => void;
}

export const CleanStripeProfileView: React.FC<CleanStripeProfileViewProps> = ({ creator }) => {
  const [selectedCleanItem, setSelectedCleanItem] = useState<MediaItem | null>(null);
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'refunds' | null>(null);

  const cleanMediaItems: MediaItem[] = [
    {
      id: 'clean_preset_pack',
      creatorId: creator.id,
      creatorHandle: creator.handle,
      title: 'Preset Pack Pro — Edición Fotográfica',
      description: 'Colección de 10 presets exclusivos para Lightroom & Photoshop. Diseñados para fotografía de retrato y colores vivos.',
      type: 'photo',
      price: 15,
      currency: 'USD',
      previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    },
    {
      id: 'clean_brand_ebook',
      creatorId: creator.id,
      creatorHandle: creator.handle,
      title: 'Guía Digital: Marca Personal & Posado',
      description: 'E-book en formato PDF con 45 páginas sobre técnicas de iluminación, posado frente a cámara y estética digital.',
      type: 'video',
      price: 25,
      currency: 'USD',
      previewUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    },
    {
      id: 'clean_portfolio_hd',
      creatorId: creator.id,
      creatorHandle: creator.handle,
      title: 'Portafolio HD — Fotografía Artística',
      description: 'Acceso a la galería fotográfica de estudio en ultra alta resolución y contenido conceptual exclusivo.',
      type: 'photo',
      price: 35,
      currency: 'USD',
      previewUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    },
    {
      id: 'clean_masterclass_video',
      creatorId: creator.id,
      creatorHandle: creator.handle,
      title: 'Masterclass: Edición & Composición',
      description: 'Video tutorial de 60 minutos con el paso a paso para retocar fotografías profesionales desde cero.',
      type: 'video',
      price: 49,
      currency: 'USD',
      previewUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans pb-16">
      {/* Banner Principal Clean */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900 border-b border-white/10">
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80"
          alt={creator.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/40 to-transparent" />
      </div>

      {/* Perfil & Encabezado */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 space-y-6 text-center">
        <div className="inline-block relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt={creator.name}
            className="w-32 h-32 rounded-full border-4 border-[#090d16] shadow-2xl object-cover mx-auto"
          />
          <span className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-[#090d16]" title="Perfil Verificado">
            <CheckCircle2 className="w-4 h-4" />
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
            <span>{creator.name}</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold px-2.5 py-0.5 rounded-full">
              Fotografía & Marca Digital
            </span>
          </h1>
          <p className="text-xs text-indigo-400 font-mono">@{creator.handle}</p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-normal pt-1">
            Contenidos digitales de fotografía artística, presets de edición y guías de estética visual. Productos digitales de entrega inmediata.
          </p>
        </div>

        {/* Garantías Clean Stripe */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-full shadow">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Facturación Discreta & Segura
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-full shadow">
            <Sparkles className="w-4 h-4 text-amber-400" /> Entrega Digital Inmediata
          </span>
        </div>

        {/* Catálogo de Productos Lícitos */}
        <div className="pt-8 space-y-6">
          <h2 className="text-lg font-extrabold text-white text-left flex items-center gap-2 border-b border-white/10 pb-3">
            <Camera className="w-5 h-5 text-indigo-400" />
            <span>Productos & Recursos Digitales Disponibles</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {cleanMediaItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-white/10 hover:border-indigo-500/50 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 border border-white/20 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                    {item.type === 'video' ? <Film className="w-3 h-3 text-indigo-400" /> : <ImageIcon className="w-3 h-3 text-pink-400" />}
                    <span>{item.type === 'video' ? 'Video Masterclass' : 'Recursos HD'}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Precio Digital:</div>
                      <div className="text-lg font-black text-amber-300">${item.price} USD</div>
                    </div>

                    <button
                      onClick={() => setSelectedCleanItem(item)}
                      className="py-2 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                    >
                      <span>Obtener Ahora</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Cumplimiento Stripe */}
        <footer className="pt-12 border-t border-white/10 text-xs text-slate-500 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors cursor-pointer">
              Términos de Servicio
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors cursor-pointer">
              Política de Privacidad
            </button>
            <span>•</span>
            <button onClick={() => setActiveModal('refunds')} className="hover:text-white transition-colors cursor-pointer">
              Política de Reembolsos
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} {creator.name} — Marca Registrada. Todos los derechos reservados. <br />
            Facturación segura procesada como contenido digital lícito en plataformas autorizadas.
          </p>
        </footer>
      </div>

      {/* Modal de Compra de Producto Clean */}
      {selectedCleanItem && (
        <PurchaseModal
          item={selectedCleanItem}
          onClose={() => setSelectedCleanItem(null)}
        />
      )}

      {/* Modales Legales Stripe */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 text-left shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm font-bold bg-slate-800 px-2.5 py-1 rounded-full"
            >
              ✕
            </button>

            {activeModal === 'terms' && (
              <>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" /> Términos de Servicio
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Todos los contenidos, presets y materiales digitales vendidos en este sitio son para uso personal exclusivo. La distribución o reproducción no autorizada está estrictamente prohibida.
                </p>
              </>
            )}

            {activeModal === 'privacy' && (
              <>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Política de Privacidad
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Respetamos su privacidad. Sus datos de facturación son procesados de forma encriptada y segura directamente por plataformas de pago certificadas (Stripe / Mercado Pago). No almacenamos números de tarjeta de crédito.
                </p>
              </>
            )}

            {activeModal === 'refunds' && (
              <>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" /> Política de Reembolsos
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Al tratarse de productos y recursos digitales de descarga o acceso inmediato, los reemplazos o soporte técnico están garantizados en caso de cualquier inconveniente con la descarga dentro de los 7 días posteriores a la compra.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
