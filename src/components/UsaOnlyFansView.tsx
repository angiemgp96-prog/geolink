import React from 'react';
import { CreatorProfile } from '../types';
import { CheckCircle2, ExternalLink, MessageCircle, Flame, Lock, Eye, Heart, Sparkles, Instagram } from 'lucide-react';
import { detectLanguage, SupportedLanguage } from '../data/translations';

interface UsaOnlyFansViewProps {
  creator: CreatorProfile;
  visitorCountryCode?: string;
  onOpenAdminLogin?: () => void;
  onUnlockStore?: () => void;
}

const ONLYFANS_URL = 'https://onlyfans.com/angeline_le';
const INSTAGRAM_CHAT_URL = 'https://www.instagram.com/angelinecutet';
const INSTAGRAM_AVATAR = 'https://i.ibb.co/wng9HkK/live3d-1d1911c20cbf04541acc46efc8173148.jpg';

const TEXTS: Record<SupportedLanguage, {
  onlineBadge: string;
  badgeTag: string;
  storyP1: string;
  storyP2: string;
  igBadge1: string;
  igBadge2: string;
  igSubtitle: string;
  igFollowBtn: string;
  ofBadge1: string;
  ofBadge2: string;
  ofTitle: string;
  ofSub: string;
  ofEnterBtn: string;
  featuresDMs: string;
  featuresPosts: string;
  sneakPeekTitle: string;
  sneakPeekInside: string;
  sneakPeekFooter: string;
  t1: string;
  t2: string;
  t3: string;
  whyTitle: string;
  whyPoint1: string;
  whyPoint2: string;
  whyCta: string;
}> = {
  en: {
    onlineBadge: 'Online now · Send me a DM 💬',
    badgeTag: '🇨🇴 Colombian Girl',
    storyP1: 'Colombian girl with a sweet smile and a wild, mischievous side 🔥',
    storyP2: 'Follow my new Instagram to chat and get all my updates 💬. Want us to talk dirty and see my uncensored side? Step into my OnlyFans 💋',
    igBadge1: '🔥 NEW · FOLLOW ME',
    igBadge2: 'CHAT & MORE INFO 💬',
    igSubtitle: 'Chat with me in private DMs & stay updated with my stories',
    igFollowBtn: 'FOLLOW',
    ofBadge1: '🔞 100% UNCENSORED',
    ofBadge2: 'DIRTY TALK & NAUGHTY CHAT 💋',
    ofTitle: 'ENTER MY EXCLUSIVE ONLYFANS 💙',
    ofSub: 'Let’s talk dirty, share wild fantasies & see everything 👀🔥',
    ofEnterBtn: 'ENTER NOW',
    featuresDMs: 'Direct DMs & private chat',
    featuresPosts: 'Uncensored daily posts',
    sneakPeekTitle: 'Sneak Peek · What I Can’t Post on IG 👀',
    sneakPeekInside: 'See Inside →',
    sneakPeekFooter: 'Tap anywhere to see everything uncensored & message me privately on',
    t1: 'My Mischievous Side 👀',
    t2: 'Too Wild for Socials 🔥',
    t3: 'Let’s Talk Naughty 💋',
    whyTitle: 'Why one look is all it takes…',
    whyPoint1: 'Let’s talk dirty & connect: Tell me about your day or your wildest fantasies — let\'s chat in private.',
    whyPoint2: 'Sweet Colombian charm + naughty side: Exclusive videos & intimate sets you won’t find anywhere else on the internet.',
    whyCta: 'Come Meet Me on OnlyFans 💋',
  },
  es: {
    onlineBadge: 'En línea ahora · Escríbeme por DM 💬',
    badgeTag: '🇨🇴 Chica Colombiana',
    storyP1: 'Chica colombiana con una sonrisa dulce y un lado salvaje y travieso 🔥',
    storyP2: 'Sigue mi nuevo Instagram para chatear y tener más info 💬. ¿Quieres que hablemos rico y veas mi lado sin censura? Entra a mi OnlyFans 💋',
    igBadge1: '🔥 NUEVO · SÍGUEME',
    igBadge2: 'CHAT Y MÁS INFO 💬',
    igSubtitle: 'Chatea conmigo en privado por DM y entérate de mis historias',
    igFollowBtn: 'SEGUIR',
    ofBadge1: '🔞 100% SIN CENSURA',
    ofBadge2: 'HABLEMOS RICO & CHAT CALIENTE 💋',
    ofTitle: 'ENTRA A MI ONLYFANS EXCLUSIVO 💙',
    ofSub: 'Hablemos rico, compartamos fantasías ardientes y mira todo 👀🔥',
    ofEnterBtn: 'ENTRAR AHORA',
    featuresDMs: 'DMs directos & chat privado',
    featuresPosts: 'Contenido diario sin censura',
    sneakPeekTitle: 'Vistazo · Lo que jamás muestro en redes 👀',
    sneakPeekInside: 'Ver Dentro →',
    sneakPeekFooter: 'Toca en cualquier parte para ver todo sin censura y escribirme en privado en',
    t1: 'Mi Lado Travieso 👀',
    t2: 'Demasiado Ardiente 🔥',
    t3: 'Hablemos Rico 💋',
    whyTitle: 'Por qué una sola mirada basta…',
    whyPoint1: 'Hablemos rico y conectemos: Cuéntame tu día o tus fantasías más calientes — hablemos en privado.',
    whyPoint2: 'Dulce encanto colombiano + lado travieso: Videos exclusivos y sesiones íntimas que no verás en ningún otro lugar.',
    whyCta: 'Ven a Conocerme a OnlyFans 💋',
  },
  fr: {
    onlineBadge: 'En ligne maintenant · Envoie-moi un DM 💬',
    badgeTag: '🇨🇴 Fille Colombienne',
    storyP1: 'Fille colombienne au sourire doux avec un côté sauvage et coquin 🔥',
    storyP2: 'Suis mon nouvel Instagram pour chatter et avoir plus d\'infos 💬. Envie qu\'on parle chaudement et de voir mon côté non censuré ? Rejoins mon OnlyFans 💋',
    igBadge1: '🔥 NOUVEAU · SUIS-MOI',
    igBadge2: 'CHAT & INFOS 💬',
    igSubtitle: 'Chatte avec moi en privé par DM et suis mes stories',
    igFollowBtn: 'SUIVRE',
    ofBadge1: '🔞 100% NON CENSURÉ',
    ofBadge2: 'PARLONS CHAUD & CHAT COQUIN 💋',
    ofTitle: 'REJOINS MON ONLYFANS EXCLUSIF 💙',
    ofSub: 'Parlons chaudement, partageons nos fantasmes et découvre tout 👀🔥',
    ofEnterBtn: 'ENTRER',
    featuresDMs: 'DMs directs & chat privé',
    featuresPosts: 'Contenu quotidien sans censure',
    sneakPeekTitle: 'Aperçu · Ce que je ne peux pas poster sur IG 👀',
    sneakPeekInside: 'Voir →',
    sneakPeekFooter: 'Touche n\'importe où pour tout voir sans censure et m\'écrire sur',
    t1: 'Mon Côté Coquin 👀',
    t2: 'Trop Chaud pour Insta 🔥',
    t3: 'Parlons Chaudement 💋',
    whyTitle: 'Pourquoi un seul regard suffit…',
    whyPoint1: 'Parlons chaudement : Raconte-moi ta journée ou tes fantasmes les plus fous — discutons en privé.',
    whyPoint2: 'Douceur colombienne + côté coquin : Vidéos exclusives et séances intimes introuvables ailleurs.',
    whyCta: 'Rejoins-moi sur OnlyFans 💋',
  },
  de: {
    onlineBadge: 'Jetzt online · Schreib mir eine DM 💬',
    badgeTag: '🇨🇴 Kolumbianisches Girl',
    storyP1: 'Kolumbianisches Girl mit süßem Lächeln und einer heißen, frechen Seite 🔥',
    storyP2: 'Folge meinem neuen Instagram, um zu chatten und mehr Infos zu bekommen 💬. Willst du dirty talken und meine unzensierte Seite sehen? Komm auf mein OnlyFans 💋',
    igBadge1: '🔥 NEU · FOLGE MIR',
    igBadge2: 'CHAT & INFOS 💬',
    igSubtitle: 'Chatte mit mir privat per DM und sieh meine Stories',
    igFollowBtn: 'FOLGEN',
    ofBadge1: '🔞 100% UNZENSIERT',
    ofBadge2: 'DIRTY TALK & HEISSER CHAT 💋',
    ofTitle: 'MEIN EXKLUSIVES ONLYFANS 💙',
    ofSub: 'Lass uns dirty talken, Fantasien teilen und alles sehen 👀🔥',
    ofEnterBtn: 'BEITRETEN',
    featuresDMs: 'Direkte DMs & privater Chat',
    featuresPosts: 'Tägliche unzensierte Posts',
    sneakPeekTitle: 'Sneak Peek · Was ich auf IG nicht zeigen darf 👀',
    sneakPeekInside: 'Ansehen →',
    sneakPeekFooter: 'Tippe irgendwohin, um alles unzensiert zu sehen und mir zu schreiben auf',
    t1: 'Meine Freche Seite 👀',
    t2: 'Zu Heiß für Social Media 🔥',
    t3: 'Lass uns Dirty Talken 💋',
    whyTitle: 'Warum ein einziger Blick reicht…',
    whyPoint1: 'Dirty Talk & Verbindung: Erzähl mir von deinem Tag oder deinen heißesten Träumen — lass uns privat chatten.',
    whyPoint2: 'Süßer kolumbianischer Charme + freche Seite: Exklusive Videos und intime Sets.',
    whyCta: 'Komm zu mir auf OnlyFans 💋',
  },
  it: {
    onlineBadge: 'Online adesso · Inviami un DM 💬',
    badgeTag: '🇨🇴 Ragazza Colombiana',
    storyP1: 'Ragazza colombiana con un dolce sorriso e un lato selvaggio e malizioso 🔥',
    storyP2: 'Segui il mio nuovo Instagram per chattare e avere più info 💬. Vuoi parlare piccante e vedere il mio lato senza censura? Entra nel mio OnlyFans 💋',
    igBadge1: '🔥 NUOVO · SEGUIMI',
    igBadge2: 'CHAT & PIÙ INFO 💬',
    igSubtitle: 'Chatta con me in privato tramite DM e segui le mie storie',
    igFollowBtn: 'SEGUI',
    ofBadge1: '🔞 100% SENZA CENSURA',
    ofBadge2: 'PARLIAMO PICCANTE & CHAT CALDA 💋',
    ofTitle: 'ENTRA NEL MIO ONLYFANS ESCLUSIVO 💙',
    ofSub: 'Parliamo piccante, condividiamo fantasie e guarda tutto 👀🔥',
    ofEnterBtn: 'ENTRA ORA',
    featuresDMs: 'DM diretti & chat privata',
    featuresPosts: 'Post quotidiani senza censura',
    sneakPeekTitle: 'Anteprima · Ciò che non posso postare su IG 👀',
    sneakPeekInside: 'Guarda →',
    sneakPeekFooter: 'Tocca ovunque per vedere tutto senza censura e scrivermi su',
    t1: 'Il Mio Lato Malizioso 👀',
    t2: 'Troppo Caldo per i Social 🔥',
    t3: 'Parliamo Piccante 💋',
    whyTitle: 'Perché basta un solo sguardo…',
    whyPoint1: 'Parliamo piccante: Raccontami la tua giornata o le tue fantasie più ardenti — parliamo in privato.',
    whyPoint2: 'Dolce fascino colombiano + lato malizioso: Video esclusivi e set intimi unici.',
    whyCta: 'Vieni a conoscermi su OnlyFans 💋',
  },
  pt: {
    onlineBadge: 'Online agora · Me mande uma DM 💬',
    badgeTag: '🇨🇴 Garota Colombiana',
    storyP1: 'Garota colombiana com sorriso doce e um lado selvagem e travesso 🔥',
    storyP2: 'Siga meu novo Instagram para conversar e ter mais novidades 💬. Quer conversar picante e ver meu lado sem censura? Entre no meu OnlyFans 💋',
    igBadge1: '🔥 NOVO · ME SIGA',
    igBadge2: 'CHAT & MAIS INFOS 💬',
    igSubtitle: 'Converse comigo no privado por DM e acompanhe meus stories',
    igFollowBtn: 'SEGUIR',
    ofBadge1: '🔞 100% SEM CENSURA',
    ofBadge2: 'CONVERSA QUENTE & CHAT PICANTE 💋',
    ofTitle: 'ENTRE NO MEU ONLYFANS EXCLUSIVO 💙',
    ofSub: 'Vamos conversar picante, compartilhar fantasias e ver tudo 👀🔥',
    ofEnterBtn: 'ENTRAR AGORA',
    featuresDMs: 'DMs diretas & chat privado',
    featuresPosts: 'Conteúdo diário sem censura',
    sneakPeekTitle: 'Espiadinha · O que não posso postar no IG 👀',
    sneakPeekInside: 'Ver Dentro →',
    sneakPeekFooter: 'Toque em qualquer lugar para ver tudo sem censura e me chamar no',
    t1: 'Meu Lado Travesso 👀',
    t2: 'Quente Demais pras Redes 🔥',
    t3: 'Vamos Conversar Picante 💋',
    whyTitle: 'Por que apenas um olhar é suficiente…',
    whyPoint1: 'Conversa picante & conexão: Me conte sobre o seu dia ou suas fantasias mais loucas — vamos conversar em privado.',
    whyPoint2: 'Doce charme colombiano + lado travesso: Vídeos exclusivos e ensaios íntimos inéditos.',
    whyCta: 'Venha me Conhecer no OnlyFans 💋',
  },
};

export const UsaOnlyFansView: React.FC<UsaOnlyFansViewProps> = ({
  creator,
  visitorCountryCode,
  onOpenAdminLogin,
  onUnlockStore,
}) => {
  const [accessCodeInput, setAccessCodeInput] = React.useState('');
  const [isVerifyingCode, setIsVerifyingCode] = React.useState(false);
  const [codeError, setCodeError] = React.useState('');
  const [showCodeBox, setShowCodeBox] = React.useState(false);

  const lang: SupportedLanguage = React.useMemo(() => {
    try {
      return detectLanguage(visitorCountryCode);
    } catch {
      return 'en';
    }
  }, [visitorCountryCode]);

  const t = TEXTS[lang] || TEXTS.en;

  const handleVerifyAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCodeInput.trim()) return;
    setIsVerifyingCode(true);
    setCodeError('');
    try {
      const isValid = await (await import('../services/api')).api.checkColombiaCustomCode(accessCodeInput.trim());
      if (isValid) {
        if (onUnlockStore) onUnlockStore();
      } else {
        setCodeError('Access code invalid or expired');
      }
    } catch {
      setCodeError('Error verifying code');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const TEASER_CARDS = [
    {
      id: 't1',
      localSrc: '/previews/media_1789948815305.webp',
      fallbackSrc: 'https://i.postimg.cc/d7hgDzWd/Captura-de-pantalla-2026-09-23-231444.png',
      tag: t.t1,
    },
    {
      id: 't2',
      localSrc: '/previews/media_1789321394895.webp',
      fallbackSrc: 'https://i.postimg.cc/1fyFDyLN/0912-(4)-Cover.jpg',
      tag: t.t2,
    },
    {
      id: 't3',
      localSrc: '/previews/media_1788438475594.webp',
      fallbackSrc: 'https://i.postimg.cc/JzPmPmbk/Captura-de-pantalla-2026-09-13-201710.png',
      tag: t.t3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans pb-16 selection:bg-[#00AFF0] selection:text-white relative overflow-hidden">
      {/* Sutil resplandor de fondo muy suave y limpio */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#00AFF0]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Cover Banner (Ajustado para no perder espacio arriba) */}
      <div className="relative h-36 sm:h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={creator.banner || '/previews/banner.webp'}
          alt="Angeline"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.src !== 'https://i.postimg.cc/xC9NFRvT/Captura-de-pantalla-2026-09-06-050057-(1).jpg') {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://i.postimg.cc/xC9NFRvT/Captura-de-pantalla-2026-09-06-050057-(1).jpg';
            }
          }}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-[#030712]" />

        {/* Live Online Badge */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20">
          <a
            href={ONLYFANS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[10px] sm:text-xs font-bold shadow-lg whitespace-nowrap hover:scale-105 transition-transform"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>{t.onlineBadge}</span>
          </a>
        </div>
      </div>

      {/* Main Container superpuesto pegado a la margen para aprovechar todo el espacio */}
      <div className="max-w-lg mx-auto px-3.5 sm:px-5 relative z-10 -mt-16 sm:-mt-20 space-y-3.5">
        
        {/* Profile Card Principal */}
        <div className="bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 text-center shadow-2xl space-y-3">
          
          {/* Avatar superpuesto */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-[#00AFF0] via-sky-400 to-pink-500 shadow-xl shadow-[#00AFF0]/25 -mt-12 sm:-mt-14 select-none">
            <img
              src={creator.avatar || '/previews/avatar.webp'}
              alt="Angeline"
              draggable="false"
              fetchPriority="high"
              loading="eager"
              onError={(e) => {
                if (e.currentTarget.src !== 'https://i.postimg.cc/ZYGVK9h0/magnific-quita-el-tatuaje-dela-esp-Pi72JNz42C.png') {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://i.postimg.cc/ZYGVK9h0/magnific-quita-el-tatuaje-dela-esp-Pi72JNz42C.png';
                }
              }}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-cover rounded-full border-2 border-[#030712] pointer-events-none select-none"
            />
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#00AFF0] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/30">
              {t.badgeTag}
            </span>
          </div>

          {/* Name & Handle */}
          <div>
            <div className="flex items-center justify-center gap-1.5 text-lg sm:text-2xl font-black text-white">
              <span>Angeline</span>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#00AFF0] shrink-0 fill-[#00AFF0]/20" />
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-sky-400 mt-0.5">@angeline_le · Official OnlyFans</p>
          </div>

          {/* Seductive, Direct & Contextual Bio (Texto resumido y limpio) */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 sm:p-3.5 text-left space-y-1.5 text-xs sm:text-[13px] text-zinc-300 leading-snug font-normal">
            <p className="text-white font-medium">
              {t.storyP1}
            </p>
            <p className="text-pink-200/95 font-medium">
              {t.storyP2}
            </p>
          </div>

          {/* 🌟 BOTÓN 1: INSTAGRAM (@angelinecutet) — PARA CHAT & MÁS INFO */}
          <a
            id="instagram-chat-exclusive-hero"
            href={INSTAGRAM_CHAT_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full block p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 via-pink-900/60 to-rose-900/60 hover:from-purple-800/80 hover:via-pink-800/80 hover:to-rose-800/80 border-2 border-pink-400/80 shadow-[0_0_30px_rgba(236,72,153,0.35)] hover:shadow-[0_0_40px_rgba(236,72,153,0.55)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-left relative overflow-hidden group"
          >
            {/* Badges superiores */}
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow">
                <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>{t.igBadge1}</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-black text-emerald-300 uppercase tracking-wide bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                {t.igBadge2}
              </span>
            </div>

            {/* Perfil Instagram */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md">
                  <img
                    src={INSTAGRAM_AVATAR}
                    alt="Angeline Cute"
                    className="w-full h-full object-cover rounded-full border-2 border-black"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-base text-white truncate">@angelinecutet</span>
                  <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                </div>
                <p className="text-[11px] sm:text-xs text-pink-100 font-medium leading-tight line-clamp-1 mt-0.5">
                  {t.igSubtitle}
                </p>
              </div>

              {/* Botón Seguir */}
              <div className="shrink-0 pl-1">
                <span className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 group-hover:from-pink-400 group-hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/30">
                  <span>{t.igFollowBtn}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </span>
              </div>
            </div>
          </a>

          {/* 💙 BOTÓN 2: ONLYFANS (@angeline_le) — EXACTAMENTE DEL MISMO TAMAÑO Y ESTRUCTURA — PARA HABLAR RICO */}
          <a
            id="usa-onlyfans-primary-cta"
            href={ONLYFANS_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full block p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#003859] via-[#005580] to-[#0077b3] hover:from-[#00446b] hover:via-[#006699] hover:to-[#0088cc] border-2 border-[#00AFF0] shadow-[0_0_35px_rgba(0,175,240,0.45)] hover:shadow-[0_0_45px_rgba(0,175,240,0.65)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-left relative overflow-hidden group"
          >
            {/* Badges superiores */}
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#00AFF0] to-sky-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow">
                <span>{t.ofBadge1}</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-black text-amber-300 uppercase tracking-wide bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded-full">
                {t.ofBadge2}
              </span>
            </div>

            {/* Perfil OnlyFans con el mismo tamaño y layout que Instagram */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full p-[2px] bg-gradient-to-tr from-[#00AFF0] via-sky-300 to-white shadow-md flex items-center justify-center bg-white">
                  <svg viewBox="0 0 36 36" className="w-8 h-8 sm:w-9 sm:h-9" fill="none" aria-hidden="true">
                    <path
                      d="M18 7.5C12.2 7.5 7.5 12.2 7.5 18C7.5 23.8 12.2 28.5 18 28.5C23.8 28.5 28.5 23.8 28.5 18C28.5 12.2 23.8 7.5 18 7.5ZM18 14C20.21 14 22 15.79 22 18C22 19.68 20.96 21.11 19.5 21.7L20.5 25.5H15.5L16.5 21.7C15.04 21.11 14 19.68 14 18C14 15.79 15.79 14 18 14Z"
                      fill="#00AFF0"
                    />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-base text-white truncate">{t.ofTitle}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-sky-100 font-medium leading-tight line-clamp-1 mt-0.5">
                  {t.ofSub}
                </p>
              </div>

              {/* Botón Entrar */}
              <div className="shrink-0 pl-1">
                <span className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#00AFF0] to-sky-500 group-hover:from-sky-400 group-hover:to-sky-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00AFF0]/40">
                  <span>{t.ofEnterBtn}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </span>
              </div>
            </div>
          </a>

          {/* Subfeatures */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-zinc-400 font-semibold pt-0.5">
            <span className="flex items-center gap-1 text-sky-300">
              <MessageCircle className="w-3.5 h-3.5 text-[#00AFF0]" /> {t.featuresDMs}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-pink-300">
              <Flame className="w-3.5 h-3.5 text-pink-400" /> {t.featuresPosts}
            </span>
          </div>
        </div>

        {/* Sneak Peek Curiosity Strip — Every tap leads directly to OnlyFans */}
        <a
          href={ONLYFANS_URL}
          target="_blank"
          rel="noreferrer"
          className="block bg-slate-950/85 backdrop-blur-xl border border-white/10 hover:border-[#00AFF0]/50 rounded-3xl p-4 sm:p-5 space-y-3 transition-all group cursor-pointer shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-white">
              <Eye className="w-4 h-4 text-[#00AFF0]" />
              <span>{t.sneakPeekTitle}</span>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#00AFF0]/20 border border-[#00AFF0]/40 text-sky-300">
              {t.sneakPeekInside}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {TEASER_CARDS.map((card) => (
              <div
                key={card.id}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10"
              >
                <img
                  src={card.localSrc}
                  alt={card.tag}
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src !== card.fallbackSrc) {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = card.fallbackSrc;
                    }
                  }}
                  className="w-full h-full object-cover blur-[11px] scale-110 opacity-75 group-hover:scale-115 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col items-center justify-between p-2 text-center">
                  <span className="mt-auto mb-auto w-8 h-8 rounded-full bg-[#00AFF0]/85 border border-white/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Lock className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-white leading-tight">
                    {card.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-sky-200/90 font-semibold pt-0.5">
            {t.sneakPeekFooter} <strong className="text-white">OnlyFans (@angeline_le)</strong> 💙
          </p>
        </a>

        {/* Why Guys Stay Hooked Card */}
        <div className="bg-slate-950/85 backdrop-blur-xl border border-pink-500/20 rounded-3xl p-4 sm:p-5 space-y-3 text-left shadow-xl">
          <div className="flex items-center gap-2 text-sm font-black text-white">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span>{t.whyTitle}</span>
          </div>

          <ul className="space-y-2 text-xs sm:text-[13px] text-zinc-300 font-medium">
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#00AFF0] shrink-0 mt-0.5" />
              <span>{t.whyPoint1}</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <span>{t.whyPoint2}</span>
            </li>
          </ul>

          <a
            href={ONLYFANS_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-[#00AFF0] hover:brightness-110 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <span>{t.whyCta}</span>
            <ExternalLink className="w-4 h-4 text-white shrink-0" />
          </a>
        </div>

        {/* VIP Access Code Entry */}
        <div className="pt-1 text-center">
          {!showCodeBox ? (
            <button
              type="button"
              onClick={() => setShowCodeBox(true)}
              className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer bg-transparent border-0 py-1 px-3"
            >
              Have a VIP access code? Enter here
            </button>
          ) : (
            <form onSubmit={handleVerifyAccessCode} className="max-w-xs mx-auto space-y-2 p-3 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="text-xs text-zinc-400 font-medium text-left">
                VIP Store Access Code:
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#00AFF0]"
                />
                <button
                  type="submit"
                  disabled={isVerifyingCode}
                  className="px-3 py-1.5 rounded-xl bg-[#00AFF0] text-white text-xs font-bold hover:brightness-110 disabled:opacity-50 cursor-pointer"
                >
                  {isVerifyingCode ? '...' : 'Unlock'}
                </button>
              </div>
              {codeError && (
                <p className="text-[10px] text-rose-400 text-left">{codeError}</p>
              )}
            </form>
          )}
        </div>

        {/* Discreet Admin Login */}
        {onOpenAdminLogin && (
          <div className="pt-3 text-center">
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer bg-transparent border-0 py-1 px-2 select-none"
            >
              © All rights reserved
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
