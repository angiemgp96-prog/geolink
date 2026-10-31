import React, { useState, useEffect } from 'react';
import { CreatorProfile } from '../types';
import { api } from '../services/api';
import { getStripePaymentUrl } from '../utils/stripeLinks';
import { detectLanguage, SupportedLanguage } from '../data/translations';
import { CreditCard, Send, CheckCircle, ExternalLink, ShieldCheck, MessageCircle } from 'lucide-react';

interface InternationalAccessGateProps {
  creator: CreatorProfile;
  visitorCountryCode?: string;
  onUnlocked: () => void;
  onOpenAdminLogin?: () => void;
}

const TELEGRAM_USER = 'Angelinaguzman69';

const GATE_TEXTS: Record<SupportedLanguage, {
  onlineBadge: string;
  heroTitle: string;
  heroHook: string;
  ofProfileLabel: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  priceLabel: string;
  contactPlaceholder: string;
  payBtn: string;
  instantNote: string;
  sendReceiptBtn: string;
  sentNotice: string;
  footerChat: string;
}> = {
  es: {
    onlineBadge: 'En línea ahora 💬',
    heroTitle: 'Entra a mi Nuevo OnlyFans y Chatea Conmigo en Privado 💋',
    heroHook: 'Descubre mi lado más explícito y sin censura — el que jamás puedo mostrar en redes 🔥',
    ofProfileLabel: 'Nuevo OnlyFans Oficial: Angie Ly · Chat Exclusivo',
    benefit1: '💙 Acceso a mi nuevo OnlyFans "Angie Ly" incluido por pagar tus $5 USD',
    benefit2: '💬 Chat Exclusivo 1 a 1 conmigo en OnlyFans: allí podremos chatear solitos y sin filtros',
    benefit3: '🔞 Desbloqueas la entrada a mi archivo privado de videos y fotos explícitas',
    priceLabel: 'Pago único 100% discreto por todo el acceso:',
    contactPlaceholder: 'Tu WhatsApp o @Telegram (opcional)',
    payBtn: 'Pagar $5.00 USD — Entrar a OnlyFans & Chatear',
    instantNote: '🔒 Pago 100% seguro y confidencial · Al volver te espero en mi Telegram para darte acceso inmediato a mi OnlyFans "Angie Ly" y a la web',
    sendReceiptBtn: 'Ya pagué — Recibir mi Acceso a OnlyFans en Telegram',
    sentNotice: '¡Perfecto! Al volver del pago se abrirá mi Telegram privado para darte tu entrada a OnlyFans "Angie Ly".',
    footerChat: 'Atención personal en Telegram',
  },
  en: {
    onlineBadge: 'Online now 💬',
    heroTitle: 'Get Access to My New OnlyFans & Chat With Me Privately 💋',
    heroHook: 'See my most explicit, uncensored side — everything I can never post on social media 🔥',
    ofProfileLabel: 'New Official OnlyFans: Angie Ly · Exclusive Chat',
    benefit1: '💙 Access to my new OnlyFans "Angie Ly" included with your $5 payment',
    benefit2: '💬 Exclusive 1-on-1 Chat with me on OnlyFans: let\'s talk privately & unfiltered right there',
    benefit3: '🔞 Full entry to my private vault of explicit videos & uncensored galleries',
    priceLabel: '100% discreet one-time payment for everything:',
    contactPlaceholder: 'Your WhatsApp or @Telegram (optional)',
    payBtn: 'Pay $5.00 USD — Enter OnlyFans & Chat Now',
    instantNote: '🔒 100% discreet & secure billing · Return here to open Telegram and get instant access to my OnlyFans "Angie Ly" & website',
    sendReceiptBtn: 'I already paid — Get My OnlyFans Access on Telegram',
    sentNotice: 'Return here after paying to open my private Telegram and claim your OnlyFans "Angie Ly" access.',
    footerChat: 'Personal chat on Telegram',
  },
  pt: {
    onlineBadge: 'Online agora 💬',
    heroTitle: 'Entre Grátis no Meu Novo OnlyFans e Converse Comigo no Privado 💋',
    heroHook: 'Veja meu lado mais explícito e sem censura — tudo o que nunca mostro nas redes 🔥',
    ofProfileLabel: 'Novo OnlyFans Oficial: Angie Ly · Chat Exclusivo',
    benefit1: '💙 ACESSO ao meu novo OnlyFans "Angie Ly" incluído pelos seus $5 USD',
    benefit2: '💬 Chat Exclusivo 1 a 1 comigo no OnlyFans: lá vamos conversar a sós e sem filtros',
    benefit3: '🔞 Entrada liberada no meu arquivo privado de vídeos e fotos explícitas',
    priceLabel: 'Pagamento único 100% discreto por tudo:',
    contactPlaceholder: 'Seu WhatsApp ou @Telegram (opcional)',
    payBtn: 'Pagar $5.00 USD — Entrar no OnlyFans & Chat',
    instantNote: '🔒 Pagamento 100% seguro e discreto · Ao voltar você fala comigo no Telegram para receber seu acesso ao OnlyFans "Angie Ly"',
    sendReceiptBtn: 'Já paguei — Receber Meu Acesso OnlyFans no Telegram',
    sentNotice: 'Ao voltar do pagamento, meu Telegram abrirá para te entregar o acesso ao OnlyFans "Angie Ly".',
    footerChat: 'Atendimento pessoal no Telegram',
  },
  fr: {
    onlineBadge: 'En ligne 💬',
    heroTitle: 'Accès GRATUIT à Mon Nouveau OnlyFans & Chat Privé Avec Moi 💋',
    heroHook: 'Découvre mon côté le plus explicite et sans censure — jamais publié sur les réseaux 🔥',
    ofProfileLabel: 'Nouveau OnlyFans Officiel : Angie Ly · Chat Exclusif',
    benefit1: '💙 ACCÈS à mon nouveau OnlyFans "Angie Ly" inclus pour vos 5 $ USD',
    benefit2: '💬 Chat Exclusif 1-à-1 avec moi sur OnlyFans : parlons ensemble en privé sans filtre',
    benefit3: '🔞 Entrée complète dans mes archives privées de vidéos et photos explicites',
    priceLabel: 'Paiement unique 100% discret pour tout :',
    contactPlaceholder: 'Votre WhatsApp ou @Telegram (optionnel)',
    payBtn: 'Payer 5,00 $ USD — Accéder à OnlyFans & Chat',
    instantNote: '🔒 Paiement 100% discret et sécurisé · Au retour, ouverture de mon Telegram privé pour votre accès OnlyFans "Angie Ly"',
    sendReceiptBtn: 'J\'ai payé — Recevoir mon accès OnlyFans sur Telegram',
    sentNotice: 'Revenez ici après le paiement pour recevoir votre accès gratuit à OnlyFans "Angie Ly" sur Telegram.',
    footerChat: 'Contact personnel sur Telegram',
  },
  de: {
    onlineBadge: 'Jetzt online 💬',
    heroTitle: 'Zugang zu Meinem Neuen OnlyFans & Privater Chat Mit Mir 💋',
    heroHook: 'Erlebe meine expliziteste, unzensierte Seite — nichts davon zeige ich auf Social Media 🔥',
    ofProfileLabel: 'Neues Offizielles OnlyFans: Angie Ly · Exklusiver Chat',
    benefit1: '💙 Zugang zu meinem neuen OnlyFans "Angie Ly" bei deiner 5 $ Zahlung inklusive',
    benefit2: '💬 Exklusiver 1-zu-1 Chat mit mir auf OnlyFans: dort schreiben wir privat & ungefiltert',
    benefit3: '🔞 Voller Eintritt in mein privates Archiv mit expliziten Videos & Fotos',
    priceLabel: '100% diskrete Einmalzahlung für den vollen Zugang:',
    contactPlaceholder: 'Dein WhatsApp oder @Telegram (optional)',
    payBtn: '5,00 $ USD zahlen — Zu OnlyFans & Jetzt Chatten',
    instantNote: '🔒 100% diskrete & sichere Zahlung · Nach Rückkehr erhältst du auf Telegram sofort deinen OnlyFans "Angie Ly" Zugang',
    sendReceiptBtn: 'Bereits bezahlt — OnlyFans-Zugang auf Telegram erhalten',
    sentNotice: 'Kehre nach der Zahlung hierher zurück, um deinen OnlyFans "Angie Ly" Zugang auf Telegram zu erhalten.',
    footerChat: 'Persönlicher Kontakt auf Telegram',
  },
  it: {
    onlineBadge: 'Online ora 💬',
    heroTitle: 'Entra nel Mio Nuovo OnlyFans e Chatta Con Me in Privato 💋',
    heroHook: 'Scopri il mio lato più esplicito e senza censura — quello che non mostro mai sui social 🔥',
    ofProfileLabel: 'Nuovo OnlyFans Ufficiale: Angie Ly · Chat Esclusiva',
    benefit1: '💙 ACCESSO al mio nuovo OnlyFans "Angie Ly" incluso pagando i $5 USD',
    benefit2: '💬 Chat Esclusiva 1-a-1 con me su OnlyFans: lì potremo chattare da soli senza filtri',
    benefit3: '🔞 Ingresso completo al mio archivio privato di video e foto esplicite',
    priceLabel: 'Pagamento unico 100% discreto per tutto:',
    contactPlaceholder: 'Il tuo WhatsApp o @Telegram (opzionale)',
    payBtn: 'Paga $5.00 USD — Entra su OnlyFans & Chatta',
    instantNote: '🔒 Pagamento 100% sicuro e riservato · Al ritorno ti aspetto su Telegram per darti accesso a OnlyFans "Angie Ly"',
    sendReceiptBtn: 'Ho già pagato — Ricevi Accesso OnlyFans su Telegram',
    sentNotice: 'Torna qui dopo il pagamento per ricevere subito il tuo ACCESSO a OnlyFans "Angie Ly" su Telegram.',
    footerChat: 'Contatto personale su Telegram',
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
      cleanContact || `Visitante ${visitorCountryCode || 'INT'} ($5 USD OnlyFans + Web)`,
      'stripe_5usd'
    ).catch(() => {});

    // Guardar estado pendiente para redirigir automáticamente a Telegram cuando regrese de Stripe
    try {
      localStorage.setItem('geolink_pending_telegram_payment', JSON.stringify({
        mediaId: 'acceso_pagina_internacional',
        mediaTitle: '💙 Acceso OnlyFans "Angie Ly" + Chat Exclusivo + Web ($5.00 USD)',
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
      `¡Hola Angelina! 💋 Acabo de realizar el pago de $5.00 USD por Stripe para recibir mi Acceso a tu nuevo OnlyFans "Angie Ly" + Chat Exclusivo y entrar a tu web 💙🔥.${contactLine}\n\nAquí te adjunto mi comprobante de pago 📎`
    );
    window.location.href = `https://t.me/${TELEGRAM_USER}?text=${msg}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-[#071324] to-slate-950 border-2 border-[#00AFF0]/60 rounded-3xl shadow-[0_0_55px_rgba(0,175,240,0.3)] overflow-hidden my-auto text-center">

        {/* Encabezado Principal Enfocado en OnlyFans "Angie Ly" + Chat Exclusivo */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-[#00AFF0]/25 via-slate-900/95 to-slate-950 border-b border-[#00AFF0]/30 text-center space-y-2.5 relative">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{tx.onlineBadge}</span>
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-slate-900/90 text-[10px] font-bold text-sky-300 border border-[#00AFF0]/40 rounded-lg px-1.5 py-0.5 outline-none cursor-pointer"
            >
              <option value="es">🇪🇸 ES</option>
              <option value="en">🇺🇸 EN</option>
              <option value="pt">🇧🇷 PT</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="de">🇩🇪 DE</option>
              <option value="it">🇮🇹 IT</option>
            </select>
          </div>

          {/* Avatar + Logo Oficial OnlyFans "Angie Ly" */}
          <div className="flex flex-col items-center justify-center pt-1 space-y-2">
            <div className="flex items-center justify-center gap-3">
              <img
                src={creator.avatar || '/previews/avatar.webp'}
                alt={creator.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://i.postimg.cc/ZYGVK9h0/magnific-quita-el-tatuaje-dela-esp-Pi72JNz42C.png';
                }}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#00AFF0] shadow-lg shadow-[#00AFF0]/30 select-none pointer-events-none"
              />
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#00AFF0] shadow-lg shadow-[#00AFF0]/45 border border-white/30">
                <svg viewBox="0 0 36 36" className="w-7 h-7 shrink-0" fill="none" aria-hidden="true">
                  <circle cx="18" cy="18" r="16.5" fill="white" />
                  <path
                    d="M18 9.5C13.86 9.5 10.5 12.86 10.5 17C10.5 21.14 13.86 24.5 18 24.5C22.14 24.5 25.5 21.14 25.5 17C25.5 12.86 22.14 9.5 18 9.5ZM18 14.2C19.55 14.2 20.8 15.45 20.8 17C20.8 18.2 20.04 19.22 18.97 19.62L19.7 22.3H16.3L17.03 19.62C15.96 19.22 15.2 18.2 15.2 17C15.2 15.45 16.45 14.2 18 14.2Z"
                    fill="#00AFF0"
                  />
                </svg>
                <div className="text-left leading-none">
                  <div className="text-white font-black text-base sm:text-lg tracking-tight">
                    OnlyFans
                  </div>
                  <div className="text-[10px] font-extrabold text-sky-100 uppercase tracking-wider">
                    Angie Ly · Chat 1 a 1
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-black text-white leading-tight px-1">
              {tx.heroTitle}
            </h2>
            <p className="text-[11px] text-pink-200/90 font-semibold leading-snug px-2">
              {tx.heroHook}
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00AFF0]/20 border border-[#00AFF0]/50 text-sky-200 text-[11px] font-extrabold">
              <MessageCircle className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span>{tx.ofProfileLabel}</span>
            </div>
          </div>

          {/* Lista clara y directa de lo que incluye pagar los $5 USD */}
          <div className="bg-black/55 border border-[#00AFF0]/35 rounded-2xl p-3 text-left space-y-1.5 mt-1">
            <div className="text-xs font-extrabold text-white leading-snug">
              {tx.benefit1}
            </div>
            <div className="text-xs font-bold text-sky-200 leading-snug">
              {tx.benefit2}
            </div>
            <div className="text-[11px] font-medium text-pink-200/90 leading-snug">
              {tx.benefit3}
            </div>
          </div>

          <div className="pt-1">
            <div className="text-[10px] uppercase tracking-wider font-bold text-sky-300/90">
              {tx.priceLabel}
            </div>
            <div className="text-3xl font-black text-amber-300 drop-shadow">
              $5.00 USD
            </div>
          </div>
        </div>

        {/* Cuerpo de Pago Directo $5 USD */}
        <div className="p-4 space-y-3 text-left">
          <div>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder={tx.contactPlaceholder}
              className="w-full bg-black/60 border border-[#00AFF0]/35 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#00AFF0]"
            />
          </div>

          <a
            id="pay-5usd-entry-button"
            href={stripe5Url}
            target="_blank"
            rel="noreferrer"
            onClick={handlePay5UsdClick}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00AFF0] via-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-xl shadow-[#00AFF0]/35 flex items-center justify-center gap-2 transition-all cursor-pointer border border-sky-200/50 hover:scale-[1.02]"
          >
            <CreditCard className="w-4 h-4 text-white shrink-0" />
            <span className="text-center">{tx.payBtn}</span>
            <ExternalLink className="w-3.5 h-3.5 text-white shrink-0" />
          </a>

          <p className="text-[10px] text-center text-sky-100/85 font-medium leading-snug flex items-start justify-center gap-1.5 px-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
