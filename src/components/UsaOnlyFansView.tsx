import React from 'react';
import { CreatorProfile } from '../types';
import { CheckCircle2, ExternalLink, MessageCircle, Flame, Lock, Eye, Heart, Sparkles } from 'lucide-react';

interface UsaOnlyFansViewProps {
  creator: CreatorProfile;
  onOpenAdminLogin?: () => void;
  onUnlockStore?: () => void;
}

const ONLYFANS_URL = 'https://onlyfans.com/angeline_le';

const TEASER_CARDS = [
  {
    id: 't1',
    localSrc: '/previews/media_1789948815305.webp',
    fallbackSrc: 'https://i.postimg.cc/d7hgDzWd/Captura-de-pantalla-2026-09-23-231444.png',
    tag: 'My Mischievous Side 👀',
  },
  {
    id: 't2',
    localSrc: '/previews/media_1789321394895.webp',
    fallbackSrc: 'https://i.postimg.cc/1fyFDyLN/0912-(4)-Cover.jpg',
    tag: 'Too Wild for Socials 🔥',
  },
  {
    id: 't3',
    localSrc: '/previews/media_1788438475594.webp',
    fallbackSrc: 'https://i.postimg.cc/JzPmPmbk/Captura-de-pantalla-2026-09-13-201710.png',
    tag: 'Let’s Talk Naughty 💋',
  },
];

export const UsaOnlyFansView: React.FC<UsaOnlyFansViewProps> = ({
  creator,
  onOpenAdminLogin,
  onUnlockStore,
}) => {
  const [accessCodeInput, setAccessCodeInput] = React.useState('');
  const [isVerifyingCode, setIsVerifyingCode] = React.useState(false);
  const [codeError, setCodeError] = React.useState('');
  const [showCodeBox, setShowCodeBox] = React.useState(false);

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
  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans pb-14 selection:bg-[#00AFF0] selection:text-white relative overflow-hidden">
      {/* Ambient OnlyFans & Warm Sensual Glow */}
      <div className="fixed top-[-15%] left-[-10%] w-[480px] h-[480px] bg-[#00AFF0]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[480px] h-[480px] bg-pink-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Cover Banner */}
      <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900">
        <img
          src={creator.banner || '/previews/banner.webp'}
          alt="Angie"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          onError={(e) => {
            if (e.currentTarget.src !== 'https://i.postimg.cc/xC9NFRvT/Captura-de-pantalla-2026-09-06-050057-(1).jpg') {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://i.postimg.cc/xC9NFRvT/Captura-de-pantalla-2026-09-06-050057-(1).jpg';
            }
          }}
          className="w-full h-full object-cover opacity-70 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/20 to-[#030712]" />

        {/* Live Online Pill */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20">
          <a
            href={ONLYFANS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-emerald-400/50 text-emerald-300 text-[11px] sm:text-xs font-extrabold shadow-lg whitespace-nowrap"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span>Online right now · Send me a DM 💬</span>
          </a>
        </div>
      </div>

      {/* Main Profile & Story Card */}
      <div className="max-w-lg mx-auto px-3.5 sm:px-5 relative z-10 -mt-14 sm:-mt-16 space-y-5">
        <div className="bg-slate-950/90 backdrop-blur-2xl border border-[#00AFF0]/35 rounded-3xl p-5 sm:p-7 text-center shadow-[0_0_50px_rgba(0,175,240,0.18)] space-y-4">
          {/* Avatar */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[#00AFF0] via-sky-400 to-pink-500 shadow-xl shadow-[#00AFF0]/30 -mt-14 sm:-mt-16 select-none">
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
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#00AFF0] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white/30">
              🇨🇴 Colombian Girl
            </span>
          </div>

          {/* Name & Verified Handle */}
          <div className="pt-1">
            <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black text-white">
              <span>Angeline</span>
              <CheckCircle2 className="w-5 h-5 text-[#00AFF0] shrink-0 fill-[#00AFF0]/20" />
            </div>
            <p className="text-xs font-bold text-[#38bdf8] mt-0.5">@angeline_le · Official OnlyFans</p>
          </div>

          {/* Personal Story Copy (Exact Authentic Persona + Psychological Hook) */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-left space-y-3 text-[13px] sm:text-sm text-zinc-200 leading-relaxed">
            <p>
              I’m from <strong className="text-white">Colombia 🇨🇴</strong> I started on social media not too long ago and suddenly became famous, but the truth is that I’m still the same girl with big dreams of traveling the world and becoming independent 🌎✨
            </p>
            <p className="text-pink-100 font-medium">
              I have a little <strong className="text-pink-300">mischievous side</strong> too 👀 — this is the place to get to know <em className="text-white not-italic font-bold">all</em> my sides. I bet it’ll only take one look for you to get hooked 💋
            </p>
          </div>

          {/* PRIMARY ONLYFANS CTA BUTTON */}
          <div className="pt-1 space-y-2.5">
            <a
              id="usa-onlyfans-primary-cta"
              href={ONLYFANS_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#00AFF0] via-[#0099e5] to-[#0077cc] hover:from-[#1abaff] hover:to-[#0088e0] text-white font-black text-sm sm:text-base uppercase tracking-wide shadow-[0_0_35px_rgba(0,175,240,0.5)] hover:shadow-[0_0_50px_rgba(0,175,240,0.75)] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.99] cursor-pointer border-2 border-sky-200/60 group"
            >
              {/* Official OnlyFans Emblem */}
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow">
                <svg viewBox="0 0 36 36" className="w-6 h-6" fill="none" aria-hidden="true">
                  <path
                    d="M18 7.5C12.2 7.5 7.5 12.2 7.5 18C7.5 23.8 12.2 28.5 18 28.5C23.8 28.5 28.5 23.8 28.5 18C28.5 12.2 23.8 7.5 18 7.5ZM18 14C20.21 14 22 15.79 22 18C22 19.68 20.96 21.11 19.5 21.7L20.5 25.5H15.5L16.5 21.7C15.04 21.11 14 19.68 14 18C14 15.79 15.79 14 18 14Z"
                    fill="#00AFF0"
                  />
                </svg>
              </span>
              <div className="text-left leading-tight">
                <div className="text-sm sm:text-base font-black tracking-wide flex items-center gap-1.5">
                  <span>Enter My Exclusive OnlyFans</span>
                  <ExternalLink className="w-4 h-4 text-white shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[11px] font-bold text-sky-100 normal-case">
                  Let’s talk naughty & get to know each other 👀💋
                </div>
              </div>
            </a>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-zinc-400 font-semibold">
              <span className="flex items-center gap-1 text-sky-300">
                <MessageCircle className="w-3.5 h-3.5 text-[#00AFF0]" /> Direct DMs & private chat
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-pink-300">
                <Flame className="w-3.5 h-3.5 text-pink-400" /> Uncensored daily posts
              </span>
            </div>
          </div>
        </div>

        {/* Sneak Peek Curiosity Strip — Every tap leads directly to OnlyFans (No store, no prices) */}
        <a
          href={ONLYFANS_URL}
          target="_blank"
          rel="noreferrer"
          className="block bg-slate-950/80 border border-white/10 hover:border-[#00AFF0]/50 rounded-3xl p-4 sm:p-5 space-y-3 transition-all group cursor-pointer shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-white">
              <Eye className="w-4 h-4 text-[#00AFF0]" />
              <span>Sneak Peek · What I Can’t Post on IG 👀</span>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#00AFF0]/20 border border-[#00AFF0]/40 text-sky-300">
              See Inside →
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
            Tap anywhere to see everything uncensored & message me privately on <strong className="text-white">OnlyFans (@angeline_le)</strong> 💙
          </p>
        </a>

        {/* Why Guys Stay Hooked — Personal Connection Card + Second CTA */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-pink-500/25 rounded-3xl p-5 space-y-3.5 text-left shadow-xl">
          <div className="flex items-center gap-2 text-sm font-black text-white">
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            <span>Why one look is all it takes…</span>
          </div>

          <ul className="space-y-2 text-xs sm:text-[13px] text-zinc-300 font-medium">
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#00AFF0] shrink-0 mt-0.5" />
              <span><strong className="text-white">Let’s talk naughty & connect:</strong> Tell me about your day or your wildest fantasies — let's chat in private.</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Sweet Colombian charm + naughty side:</strong> Exclusive videos & intimate sets you won’t find anywhere else on the internet.</span>
            </li>
          </ul>

          <a
            href={ONLYFANS_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-[#00AFF0] hover:brightness-110 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
          >
            <span>Come Meet Me on OnlyFans 💋</span>
            <ExternalLink className="w-4 h-4 text-white shrink-0" />
          </a>
        </div>

        {/* VIP Access Code Entry for USA visitors with a private code */}
        <div className="pt-2 text-center">
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
                  onChange={(e) => {
                    setAccessCodeInput(e.target.value);
                    setCodeError('');
                  }}
                  placeholder="Enter code"
                  className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#00AFF0]"
                />
                <button
                  type="submit"
                  disabled={isVerifyingCode}
                  className="px-3 py-1.5 bg-[#00AFF0] hover:bg-[#0099e5] text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isVerifyingCode ? '...' : 'Unlock'}
                </button>
              </div>
              {codeError && (
                <div className="text-[10px] text-red-400 text-left font-medium">
                  {codeError}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Ultra-discreet Admin Access trigger (matches Colombia gate) */}
        <div className="pt-2 text-center">
          {onOpenAdminLogin ? (
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="text-[9px] text-zinc-700 hover:text-zinc-500 font-normal bg-transparent border-0 py-1 px-2 select-none"
            >
              © All rights reserved
            </button>
          ) : (
            <span className="text-[9px] text-zinc-700 select-none">© All rights reserved</span>
          )}
        </div>
      </div>
    </div>
  );
};
