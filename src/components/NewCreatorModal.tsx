import React, { useState } from 'react';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { CreatorProfile } from '../types';
import { api } from '../services/api';

interface NewCreatorModalProps {
  onClose: () => void;
  onCreatorCreated: (creator: CreatorProfile) => void;
}

export const NewCreatorModal: React.FC<NewCreatorModalProps> = ({
  onClose,
  onCreatorCreated,
}) => {
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle || !name) {
      setError('Por favor ingresa un nombre y un usuario / handle');
      return;
    }
    setError('');
    setIsLoading(true);

    const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_]/g, '');

    const newProfile: CreatorProfile = {
      id: `creator_${Date.now()}`,
      handle: cleanHandle,
      name,
      title: 'Digital Creator & Model',
      bio: bio || '¡Bienvenido a mi espacio exclusivo! Fotos y videos diarios.',
      avatar: 'https://i.postimg.cc/mkX06xcN/imgi-59-rs-fit-57s5-8192.jpg',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      themeColor: 'from-pink-600 to-purple-600',
      badge: 'NUEVA MODELO',
      blockedCountries: [],
      blockedMessage: 'Contenido restringido en tu país por privacidad.',
      whatsappNumber: whatsapp || '+5491100000000',
      createdAt: new Date().toISOString(),
      links: [
        { id: 'l1', title: 'Instagram Oficial 📸', url: 'https://instagram.com', icon: 'Instagram', active: true, clicks: 0 },
        { id: 'l2', title: 'Telegram Exclusivo 💬', url: 'https://t.me', icon: 'MessageCircle', active: true, clicks: 0 }
      ],
      paymentSettings: {
        mercadoPagoAccessToken: '',
        mercadoPagoPublicKey: '',
        payPalClientId: '',
        payPalClientSecret: '',
        payPalMode: 'sandbox',
        customPaymentLinks: []
      }
    };

    try {
      const saved = await api.saveCreator(newProfile);
      onCreatorCreated(saved);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la modelo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 md:p-8 text-zinc-100">
        
        <button
          id="close-new-creator-modal"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Registrar Nueva Modelo</h3>
            <p className="text-xs text-zinc-400">Crea un nuevo perfil tipo Link.me con tienda propia</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Nombre Público de la Modelo:
            </label>
            <input
              id="new-creator-name"
              type="text"
              placeholder="ej. Elena Fitness 💫"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Usuario / Handle (para el link):
            </label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white">
              <span className="text-indigo-400 font-semibold mr-1">@</span>
              <input
                id="new-creator-handle"
                type="text"
                placeholder="elena_fit"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-white font-medium placeholder-zinc-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              WhatsApp para Recibir Pagos / Consultas:
            </label>
            <input
              id="new-creator-whatsapp"
              type="tel"
              placeholder="+5491155443322"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Biografía de Bienvenida:
            </label>
            <textarea
              id="new-creator-bio"
              rows={2}
              placeholder="Escribe una breve presentación..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            id="submit-new-creator-button"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Crear Perfil y Activar Tienda</span>
          </button>
        </form>

      </div>
    </div>
  );
};
