import React, { useState, useEffect } from 'react';
import { CreatorProfile } from '../types';
import { api } from '../services/api';
import { getStripePaymentUrl } from '../utils/stripeLinks';
import { detectLanguage, SupportedLanguage } from '../data/translations';
import { Lock, CreditCard, Send, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface InternationalAccessGateProps {
  creator: CreatorProfile;
  visitorCountryCode?: string;
  onUnlocked: () => void;
  onOpenAdminLogin?: () => void;
}

const TELEGRAM_USER = 'Angelinaguzman69';

const GATE_TEXTS: Record<SupportedLanguage, {
  badge: string;
  subtitle: string;
  note: string;
  contactPlaceholder: string;
  payBtn: string;
  instantNote: string;
  sendReceiptBtn: string;
  sentNotice: string;
  footerChat: string;
}> = {
  es: {
    badge: 'Acceso a la Página Web',
    subtitle: 'Entrada única para explorar el perfil exclusivo y catálogo de',
    note: '⚠️ Pase de entrada a la web · No desbloquea contenidos individuales.',
    contactPlaceholder: 'Tu WhatsApp o @Telegram (opcional)',
    payBtn: 'Pagar $5.00 USD para Ingresar',
    instantNote: '🔒 Pago seguro con Stripe · Al volver te llevará a Telegram para activar tu entrada',
    sendReceiptBtn: 'Ya pagué — Enviar Comprobante a Telegram',
    sentNotice: 'Redirigiendo a Telegram al volver del pago. En breve se activará tu acceso.',
    footerChat: 'Soporte directo en Telegram',
  },
  en: {
    badge: 'Website Entry Pass',
    subtitle: 'Entry pass to explore the exclusive profile & store of',
    note: '⚠️ Website entry pass · Does not unlock individual store items.',
    contactPlaceholder: 'Your WhatsApp or @Telegram (optional)',
    payBtn: 'Pay $5.00 USD to Enter',
    instantNote: '🔒 Secure payment via Stripe · Returning here redirects you to Telegram to activate access',
    sendReceiptBtn: 'I already paid — Send Receipt on Telegram',
    sentNotice: 'Return here after paying to open Telegram and activate your access.',
    footerChat: 'Direct support on Telegram',
  },
  pt: {
    badge: 'Acesso ao Site Exclusivo',
    subtitle: 'Entrada para explorar o perfil exclusivo e catálogo de',
    note: '⚠️ Passe de entrada no site · Não desbloqueia conteúdos individuais.',
    contactPlaceholder: 'Seu WhatsApp ou @Telegram (opcional)',
    payBtn: 'Pagar $5.00 USD para Entrar',
    instantNote: '🔒 Pagamento seguro via Stripe · Ao voltar você será levado ao Telegram para ativar o acesso',
    sendReceiptBtn: 'Já paguei — Enviar Comprovante no Telegram',
    sentNotice: 'Ao concluir o pagamento e voltar, seu acesso será ativado via Telegram.',
    footerChat: 'Suporte direto no Telegram',
  },
  fr: {
    badge: 'Accès au Site Exclusif',
    subtitle: 'Accès pour explorer le profil exclusif et la boutique de',
    note: '⚠️ Pass d\'entrée au site · Ne débloque pas les contenus individuels.',
    contactPlaceholder: 'Votre WhatsApp ou @Telegram (optionnel)',
    payBtn: 'Payer 5,00 $ USD pour Entrer',
    instantNote: '🔒 Paiement sécurisé Stripe · Au retour, redirection vers Telegram pour activer l\'accès',
    sendReceiptBtn: 'J\'ai payé — Envoyer le reçu sur Telegram',
    sentNotice: 'Revenez ici après le paiement pour activer votre accès sur Telegram.',
    footerChat: 'Support direct sur Telegram',
  },
  de: {
    badge: 'Zugang zur Exklusiven Webseite',
    subtitle: 'Zugangspass zum exklusiven Profil und Shop von',
    note: '⚠️ Webseiten-Eintrittspass · Schaltet keine Einzelinhalte frei.',
    contactPlaceholder: 'Dein WhatsApp oder @Telegram (optional)',
    payBtn: '5,00 $ USD zahlen & Eintreten',
    instantNote: '🔒 Sichere Zahlung über Stripe · Nach Rückkehr Weiterleitung zu Telegram zur Aktivierung',
    sendReceiptBtn: 'Bereits bezahlt — Beleg auf Telegram senden',
    sentNotice: 'Kehre nach der Zahlung hierher zurück, um deinen Zugang über Telegram zu aktivieren.',
    footerChat: 'Direkter Support auf Telegram',
  },
  it: {
    badge: 'Accesso al Sito Esclusivo',
    subtitle: 'Ingresso per esplorare il profilo esclusivo e il catalogo di',
    note: '⚠️ Pass d\'ingresso al sito · Non sblocca i singoli contenuti.',
    contactPlaceholder: 'Il tuo WhatsApp o @Telegram (opzionale)',
    payBtn: 'Paga $5.00 USD per Entrare',
    instantNote: '🔒 Pagamento sicuro con Stripe · Al ritorno verrai reindirizzato su Telegram per l\'accesso',
    sendReceiptBtn: 'Ho già pagato — Invia ricevuta su Telegram',
    sentNotice: 'Torna qui dopo il pagamento per attivare subito il tuo accesso su Telegram.',
    footerChat: 'Supporto diretto su Telegram',
  },
};

export const InternationalAccessGate: React.FC<InternationalAccessGateProps> = ({
  creator,
  visitorCountryCode,
  onUnlocked,
  onOpenAdminLogin,
}) => {
  const [lang, setLang] = useState<SupportedLanguage>(() => detectLanguage(visitorCountryCode));
  const [contactInfo, setContactInfo] = useState(() => {
    try {
      return localStorage.getItem('geolink_visitor_contact') || '';
    } catch {
      return '';
    }
  });
  const [hasClickedPay, setHasClickedPay] = useState(false);

  useEffect(() => {
    if (visitorCountryCode) {
      setLang(detectLanguage(visitorCountryCode));
    }
  }, [visitorCountryCode]);

  // Sync contact if VisitorLeadModal just saved it
  useEffect(() => {
    const syncSavedContact = () => {
      try {
        const saved = localStorage.getItem('geolink_visitor_contact') || '';
        if (saved && !contactInfo) {
          setContactInfo(saved);
        }
      } catch {}
    };
    const id = setInterval(syncSavedContact, 1500);
    return () => clearInterval(id);
  }, [contactInfo]);

  // Real-time polling so screen unlocks automatically as soon as admin approves device
  useEffect(() => {
    let isMounted = true;
    const pollCheck = async () => {
      try {
        const approved = await api.checkColombiaAccessApproved();
        if (approved && isMounted) {
          onUnlocked();
        }
      } catch {}
    };

    pollCheck();
    const interval = setInterval(pollCheck, 3500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [onUnlocked]);

  const tx = GATE_TEXTS[lang] || GATE_TEXTS.es;
  const stripe5Url = getStripePaymentUrl(5);

  const getEffectiveContact = () => {
    const typed = contactInfo.trim();
    if (typed) return typed;
    try {
      return (localStorage.getItem('geolink_visitor_contact') || '').trim();
    } catch {
      return '';
    }
  };

  const handlePay5UsdClick = () => {
    const cleanContact = getEffectiveContact();
    if (cleanContact) {
      try {
        localStorage.setItem('geolink_visitor_contact', cleanContact);
      } catch {}
    }

    // Registrar solicitud en Solicitudes de Acceso del Dashboard con huella de dispositivo e IP
    api.saveColombiaAccessRequest(
      cleanContact || `Visitante ${visitorCountryCode || 'INT'} ($5 USD)`,
      'stripe_5usd'
    ).catch(() => {});

    // Guardar estado pendiente para redirigir automáticamente a Telegram cuando regrese de Stripe
    try {
      localStorage.setItem('geolink_pending_telegram_payment', JSON.stringify({
        mediaId: 'acceso_pagina_internacional',
        mediaTitle: '🌍 Acceso Página Web Internacional ($5.00 USD)',
        amount: 5,
        currency: 'USD',
        stripeUrl: stripe5Url,
        isInternationalPageGate: true,
        timestamp: Date.now(),
      }));
    } catch {}

    setHasClickedPay(true);
  };

  const handleManualTelegramRedirect = () => {
    const cleanContact = getEffectiveContact();
    const contactLine = cleanContact ? `\n👤 Mi contacto: ${cleanContact}` : '';
    try {
      localStorage.removeItem('geolink_pending_telegram_payment');
    } catch {}
    const msg = encodeURIComponent(
      `¡Hola Angelina! Acabo de realizar el pago de $5.00 USD por Stripe para ingresar a tu Página Web 🌍.${contactLine}\n\nAquí te adjunto mi comprobante de pago para activar mi acceso 📎`
    );
    window.location.href = `https://t.me/${TELEGRAM_USER}?text=${msg}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-zinc-900 to-slate-950 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-center">

        {/* Encabezado Compacto */}
        <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border-b border-indigo-500/30 text-center space-y-1.5 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase">
              <span>🌍</span> {tx.badge}
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-slate-900/90 text-[10px] font-bold text-indigo-300 border border-indigo-500/30 rounded-lg px-1.5 py-0.5 outline-none cursor-pointer"
            >
              <option value="es">🇪🇸 ES</option>
              <option value="en">🇺🇸 EN</option>
              <option value="pt">🇧🇷 PT</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="de">🇩🇪 DE</option>
              <option value="it">🇮🇹 IT</option>
            </select>
          </div>

          <div className="mx-auto w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/15">
            <Lock className="w-5 h-5 text-white" />
          </div>

          <div className="text-2xl font-black text-amber-300 pt-0.5">
            $5.00 USD
          </div>

          <p className="text-[11px] text-zinc-300 leading-snug font-medium px-2">
            {tx.subtitle} <strong className="text-white">@{creator.handle}</strong>. <br />
            <span className="text-amber-400/90 text-[10px]">{tx.note}</span>
          </p>
        </div>

        {/* Cuerpo de Pago Directo $5 USD */}
        <div className="p-4 space-y-3 text-left">
          <div>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder={tx.contactPlaceholder}
              className="w-full bg-black/60 border border-indigo-500/30 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-indigo-400"
            />
          </div>

          <a
            id="pay-5usd-entry-button"
            href={stripe5Url}
            target="_blank"
            rel="noreferrer"
            onClick={handlePay5UsdClick}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer border border-indigo-400/40 hover:scale-[1.01]"
          >
            <CreditCard className="w-4 h-4 text-white shrink-0" />
            <span>{tx.payBtn}</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/90 shrink-0" />
          </a>

          <p className="text-[10px] text-center text-indigo-200/80 font-medium leading-snug flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{tx.instantNote}</span>
          </p>

          {hasClickedPay && (
            <div className="space-y-2 pt-1 border-t border-white/10">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold text-center flex items-center justify-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>{tx.sentNotice}</span>
              </div>

              <button
                type="button"
                onClick={handleManualTelegramRedirect}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-[11px] uppercase tracking-wide shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>{tx.sendReceiptBtn}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Discreto */}
        <div className="py-2 px-4 bg-black/60 border-t border-white/5 text-[9px] text-zinc-500 flex items-center justify-between">
          <span>{tx.footerChat}: @{TELEGRAM_USER}</span>
          {onOpenAdminLogin && (
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer px-1 select-none"
            >
              Derechos reservados
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
