import React from 'react';
import { ShieldX, Globe, Lock } from 'lucide-react';
import { CreatorProfile } from '../types';

interface GeoBlockingBannerProps {
  creator: CreatorProfile;
  visitorCountryCode: string;
  visitorCountryName: string;
  onBypassSimulation: () => void;
}

export const GeoBlockingBanner: React.FC<GeoBlockingBannerProps> = ({
  creator,
  visitorCountryCode,
  visitorCountryName,
  onBypassSimulation,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#030712] relative overflow-hidden font-sans">
      {/* Ambient background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-red-700/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-900/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        {/* Lock Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Acceso Restringido
          </h1>
          <div className="h-0.5 w-16 bg-red-500/40 mx-auto rounded-full mb-4" />
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
            {creator.blockedMessage || 'Este contenido no está disponible en tu región.'}
          </p>
        </div>

        {/* Visitor Country Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-sm text-left space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Tu Ubicación Detectada
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {/* Country flag emoji using Unicode */}
              {visitorCountryCode
                ? visitorCountryCode
                    .toUpperCase()
                    .replace(/./g, (c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
                : '🌐'}
            </span>
            <div>
              <div className="text-white font-bold text-base">{visitorCountryName || visitorCountryCode}</div>
              <div className="text-zinc-500 text-xs font-mono">{visitorCountryCode.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Creator info */}
        <div className="flex items-center justify-center gap-3 text-sm text-zinc-500">
          {creator.avatar && (
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-7 h-7 rounded-full object-cover border border-white/10"
            />
          )}
          <span>
            Contenido de <span className="text-zinc-300 font-semibold">@{creator.handle}</span>
          </span>
        </div>

        {/* Subtle hint for the 0777 bypass – no explicit explanation, just a keyboard icon */}
        <button
          onClick={onBypassSimulation}
          className="flex items-center gap-1.5 mx-auto text-[11px] text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer"
          title="Acceso Exclusivo"
        >
          <Lock className="w-3 h-3" />
          <span>¿Eres la creadora? Introduce tu código de acceso.</span>
        </button>
      </div>
    </div>
  );
};
