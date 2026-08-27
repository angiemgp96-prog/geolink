import React, { useState } from 'react';
import { CreatorProfile } from '../types';
import { api } from '../services/api';
import { Lock, ShieldCheck, CheckCircle, Send, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface ColombiaAccessGateProps {
  creator: CreatorProfile;
  onUnlocked: () => void;
}

const TELEGRAM_USER = 'Angelinaguzman69';

export const ColombiaAccessGate: React.FC<ColombiaAccessGateProps> = ({ creator, onUnlocked }) => {
  const [copiedField, setCopiedField]   = useState<string | null>(null);
  const [contactInfo, setContactInfo]   = useState(() => {
    try {
      return localStorage.getItem('geolink_visitor_contact') || '';
    } catch {
      return '';
    }
  });
  const [contactError, setContactError] = useState('');
  const [isLoadingMp, setIsLoadingMp]   = useState(false);
  const [submittedNequi, setSubmittedNequi] = useState(false);

  const handleCopy = (text: string, fieldId: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {}
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleMercadoPagoPay = async () => {
    setIsLoadingMp(true);
    try {
      const data = await api.createMercadoPagoPreference('acceso_pagina_colombia', '', contactInfo || 'Pagina Colombia', 30);
      if (data.init_point) {
        try {
          localStorage.setItem('geolink_colombia_page_unlocked', 'true');
        } catch {}
        window.location.href = data.init_point;
      } else {
        alert('No se pudo abrir Mercado Pago. Intenta nuevamente.');
      }
    } catch {
      alert('Error de conexión con Mercado Pago.');
    } finally {
      setIsLoadingMp(false);
    }
  };

  const handleNequiTelegramSubmit = async () => {
    if (!contactInfo || contactInfo.trim().length < 3) {
      setContactError('Ingresa tu WhatsApp o usuario de Telegram');
      return;
    }
    setContactError('');

    try {
      localStorage.setItem('geolink_visitor_contact', contactInfo.trim());
    } catch {}

    await api.saveColombiaAccessRequest(contactInfo.trim(), 'nequi');
    setSubmittedNequi(true);

    const msg = encodeURIComponent(
      `¡Hola! Ya realicé el pago de $105.000 COP por Nequi Llave Bre-B (@NEQUIANG05606) para solicitar el Acceso VIP a la página web.\n\nMi contacto: ${contactInfo.trim()}\n\nAquí te adjunto mi comprobante para la aprobación de mi acceso 📎`
    );

    window.open(`https://t.me/${TELEGRAM_USER}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-zinc-900 to-slate-950 border-2 border-purple-500/50 rounded-3xl shadow-2xl shadow-purple-950/60 overflow-hidden text-center my-auto">
        
        {/* Banner Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-purple-500/30 text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/20 animate-pulse">
            🇨🇴
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-purple-300" />
            Acceso VIP Colombia
          </div>
          <h2 className="text-xl font-black text-white">Entrada al Perfil de @{creator.handle}</h2>
          <div className="text-2xl font-black text-amber-300">
            $30.00 <span className="text-sm font-bold text-amber-400/80">USD</span> • <span className="text-purple-300 font-extrabold">$105.000 COP</span>
          </div>
        </div>

        {/* Conciso Aviso de Claridad */}
        <div className="p-5 space-y-4 text-left">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-bold block mb-0.5">🔒 Pase de Entrada al Sitio Web</strong>
              Este pago es exclusivo para ingresar y explorar la página de la creadora. No desbloquea contenidos individuales del catálogo.
            </div>
          </div>

          {/* Opciones de Pago */}
          <div className="space-y-3">
            {/* Opción 1: Mercado Pago */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Opción 1: Mercado Pago</span>
                <span className="bg-sky-500/20 text-sky-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-sky-400/30">Auto-Desbloqueo</span>
              </div>
              <button
                onClick={handleMercadoPagoPay}
                disabled={isLoadingMp}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoadingMp ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCardIcon />}
                <span>Pagar $105.000 COP con Mercado Pago</span>
              </button>
            </div>

            {/* Opción 2: Nequi Llave Bre-B */}
            <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-200">Opción 2: Nequi / Llave Bre-B</span>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-400/30">Telegram</span>
              </div>

              {/* Datos Nequi Bre-B */}
              <div className="space-y-2">
                <div className="bg-black/40 border border-purple-500/20 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="text-left overflow-hidden">
                    <div className="text-[9px] font-bold text-purple-300 uppercase">Llave Nequi / Bre-B</div>
                    <div className="text-xs font-mono font-bold text-amber-300 truncate">@NEQUIANG05606</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('@NEQUIANG05606', 'gate_breb')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${copiedField === 'gate_breb' ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white hover:bg-purple-500'}`}
                  >
                    {copiedField === 'gate_breb' ? '¡Copiado!' : 'Copiar 📋'}
                  </button>
                </div>

                <div className="bg-black/40 border border-purple-500/20 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="text-left overflow-hidden">
                    <div className="text-[9px] font-bold text-zinc-400 uppercase">Beneficiario</div>
                    <div className="text-xs font-mono font-bold text-white truncate">Angie milena Guzman Patiño</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('Angie milena Guzman Patiño', 'gate_name')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ${copiedField === 'gate_name' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-zinc-200 hover:text-white'}`}
                  >
                    {copiedField === 'gate_name' ? '¡Copiado!' : 'Copiar 📋'}
                  </button>
                </div>
              </div>

              {/* Input Contacto */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-purple-200 block">
                  Tu WhatsApp o usuario de Telegram <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={e => { setContactInfo(e.target.value); setContactError(''); }}
                  placeholder="Ej: +57 300 123 4567 o @miusuario"
                  className="w-full bg-black/50 border border-purple-500/30 focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                />
                {contactError && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" /> {contactError}
                  </p>
                )}
              </div>

              <button
                onClick={handleNequiTelegramSubmit}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-white animate-pulse" />
                <span>Enviar Comprobante Nequi a Telegram</span>
              </button>

              {submittedNequi && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold text-center flex items-center justify-center gap-1.5 mt-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Solicitud enviada a Telegram. En breve la creadora aprobará tu acceso.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="py-3 px-6 bg-black/50 border-t border-white/5 text-[10px] text-zinc-500">
          🔒 Acceso verificado para Colombia • Chat directo @{TELEGRAM_USER}
        </div>
      </div>
    </div>
  );
};

const CreditCardIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2"/>
    <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2"/>
  </svg>
);
