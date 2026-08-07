import React from 'react';
import { WifiOff, RefreshCw, Lock } from 'lucide-react';
import { CreatorProfile } from '../types';

interface GeoBlockingBannerProps {
  creator: CreatorProfile;
  visitorCountryCode: string;
  visitorCountryName: string;
  onBypassSimulation: () => void;
}

export const GeoBlockingBanner: React.FC<GeoBlockingBannerProps> = ({
  creator,
  onBypassSimulation,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0c14] relative overflow-hidden font-sans text-zinc-300">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-950/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        {/* Connection Error Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-zinc-900/80 border border-white/10 flex items-center justify-center shadow-xl">
          <WifiOff className="w-9 h-9 text-zinc-500" />
        </div>

        {/* Status code & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-medium text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            ERR_CONNECTION_TIMED_OUT
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Error de conexión con el servidor
          </h1>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            No se pudo establecer respuesta del servidor remoto. Comprueba tu conexión a red o intenta cargar la página nuevamente.
          </p>
        </div>

        {/* Retry Box (looks like browser network retry) */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 text-left space-y-3 shadow-inner">
          <div className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Diagnóstico del sistema</span>
            <span className="font-mono text-[10px] text-zinc-600">502 BAD GATEWAY</span>
          </div>
          <div className="space-y-1.5 text-xs text-zinc-500 font-mono">
            <p>• Host: <span className="text-zinc-400">{window.location.hostname}</span></p>
            <p>• Estado: <span className="text-amber-500/90">Sin respuesta del host</span></p>
            <p>• Latencia: <span className="text-zinc-600">Timeout (&gt; 5000ms)</span></p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar conexión
          </button>
        </div>

        {/* Hidden bypass link for 0777 or creator entry */}
        <div className="pt-2">
          <button
            onClick={onBypassSimulation}
            className="flex items-center gap-1.5 mx-auto text-[11px] text-zinc-700 hover:text-zinc-500 transition-colors cursor-pointer"
            title="Código de acceso"
          >
            <Lock className="w-3 h-3 opacity-40" />
            <span className="opacity-60">¿Eres la creadora? Código de acceso</span>
          </button>
        </div>
      </div>
    </div>
  );
};
