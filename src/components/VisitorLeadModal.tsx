import React, { useState } from 'react';
import { Lock, Phone, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface VisitorLeadModalProps {
  isOpen: boolean;
  onClose: (contact: string) => void;
}

export const VisitorLeadModal: React.FC<VisitorLeadModalProps> = ({ isOpen, onClose }) => {
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || contact.trim().length < 3) {
      setError('Ingresa tu WhatsApp o usuario de Telegram');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const cleanContact = contact.trim();
      localStorage.setItem('geolink_visitor_contact', cleanContact);
      await api.saveVisitorLead(cleanContact);
      onClose(cleanContact);
    } catch {
      localStorage.setItem('geolink_visitor_contact', contact.trim());
      onClose(contact.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0d0f1a] border border-indigo-500/40 backdrop-blur-2xl rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative text-zinc-100 text-center space-y-5 animate-in fade-in zoom-in duration-300">
        
        {/* VIP Lock Badge */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
          <Lock className="w-7 h-7 text-white" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-[11px] uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil Exclusivo VIP</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Acceso al Contenido Privado</h2>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            Por favor ingresa tu número de WhatsApp o usuario de Telegram para identificarte y acceder a las fotos y videos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tu WhatsApp o Telegram (@usuario)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={contact}
                onChange={(e) => { setContact(e.target.value); setError(''); }}
                placeholder="Ej. +573001234567 o @miusuario"
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 outline-none transition-colors pr-10"
                autoFocus
              />
              <Send className="w-4 h-4 text-indigo-400 absolute right-3.5 top-3.5" />
            </div>
            {error && <p className="text-red-400 text-[11px] font-semibold mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>Continuar al Perfil VIP ⚡</span>
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Acceso Privado Encriptado · Privacidad Garantizada</span>
        </div>
      </div>
    </div>
  );
};
