import React, { useState } from 'react';
import { CreatorProfile } from '../types';
import { api } from '../services/api';
import { Lock, ShieldCheck, CheckCircle, Send, Loader2, AlertCircle, CreditCard, Smartphone } from 'lucide-react';

interface ColombiaAccessGateProps {
  creator: CreatorProfile;
  onUnlocked: () => void;
}

const TELEGRAM_USER = 'Angelinaguzman69';

export const ColombiaAccessGate: React.FC<ColombiaAccessGateProps> = ({ creator }) => {
  const [activePaymentTab, setActivePaymentTab] = useState<'mercadopago' | 'nequi'>('mercadopago');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState(() => {
    try {
      return localStorage.getItem('geolink_visitor_contact') || '';
    } catch {
      return '';
    }
  });
  const [contactError, setContactError] = useState('');
  const [isLoadingMp, setIsLoadingMp] = useState(false);
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
      `¡Hola! Ya realicé el pago de $105.000 COP por Nequi Llave Bre-B (@NEQUIANG05606) para solicitar el Acceso a la página web.\n\nMi contacto: ${contactInfo.trim()}\n\nAquí te adjunto mi comprobante 📎`
    );

    window.open(`https://t.me/${TELEGRAM_USER}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-zinc-900 to-slate-950 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-center">
        
        {/* Encabezado Compacto */}
        <div className="p-4 bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border-b border-purple-500/30 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-black uppercase">
            <span>🇨🇴</span> Acceso a la Página Web
          </div>
          
          <div className="text-xl font-black text-amber-300">
            $105.000 COP <span className="text-xs font-bold text-slate-400">($30 USD)</span>
          </div>

          <p className="text-[11px] text-zinc-300 leading-snug font-medium px-2">
            Entrada para explorar la web de <strong className="text-white">@{creator.handle}</strong>. <br />
            <span className="text-amber-400/90 text-[10px]">⚠️ No desbloquea contenidos del catálogo.</span>
          </p>
        </div>

        {/* Selector Compacto de Pestañas de Pago */}
        <div className="p-4 space-y-3 text-left">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => setActivePaymentTab('mercadopago')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activePaymentTab === 'mercadopago'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Mercado Pago
            </button>
            <button
              type="button"
              onClick={() => setActivePaymentTab('nequi')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activePaymentTab === 'nequi'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Nequi Bre-B
            </button>
          </div>

          {/* Contenido Pestaña 1: Mercado Pago */}
          {activePaymentTab === 'mercadopago' && (
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleMercadoPagoPay}
                disabled={isLoadingMp}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoadingMp ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                <span>Pagar $105.000 COP con Mercado Pago</span>
              </button>
              <p className="text-[10px] text-center text-sky-300/80 font-medium">
                ⚡ Desbloqueo automático inmediato al pagar
              </p>
            </div>
          )}

          {/* Contenido Pestaña 2: Nequi / Bre-B */}
          {activePaymentTab === 'nequi' && (
            <div className="space-y-2.5 pt-1">
              {/* Datos Nequi Bre-B */}
              <div className="bg-black/50 border border-purple-500/30 rounded-xl p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-purple-300 uppercase">Llave Bre-B:</div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono font-bold text-amber-300">@NEQUIANG05606</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('@NEQUIANG05606', 'breb')}
                      className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded hover:bg-purple-500 transition-all"
                    >
                      {copiedField === 'breb' ? '¡Copiado!' : 'Copiar 📋'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] border-t border-white/5 pt-1.5">
                  <span className="text-zinc-400">Titular:</span>
                  <span className="font-semibold text-white">Angie milena Guzman Patiño</span>
                </div>
              </div>

              {/* Input Contacto */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={contactInfo}
                  onChange={e => { setContactInfo(e.target.value); setContactError(''); }}
                  placeholder="Tu WhatsApp o Telegram *"
                  className="w-full bg-black/60 border border-purple-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-400"
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
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Enviar Comprobante a Telegram</span>
              </button>

              {submittedNequi && (
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold text-center flex items-center justify-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>Enviado. En breve se aprobará tu acceso.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="py-2 px-4 bg-black/60 border-t border-white/5 text-[9px] text-zinc-500">
          Chat directo Telegram @{TELEGRAM_USER}
        </div>
      </div>
    </div>
  );
};
