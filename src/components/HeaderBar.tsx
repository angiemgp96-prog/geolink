import React from 'react';
import { ShieldAlert, Globe, User, LayoutDashboard, ExternalLink, PlusCircle, CheckCircle2, Zap } from 'lucide-react';
import { CreatorProfile, VisitorLocation } from '../types';
import { COUNTRIES_LIST } from '../data/countries';
import { isSupabaseConfigured } from '../../services/client';

interface HeaderBarProps {
  creators: CreatorProfile[];
  currentCreator: CreatorProfile;
  onSelectCreator: (handle: string) => void;
  activeTab: 'public' | 'dashboard';
  setActiveTab: (tab: 'public' | 'dashboard') => void;
  visitorLocation: VisitorLocation;
  simulatedCountry: string;
  onSimulateCountryChange: (countryCode: string) => void;
  onOpenNewCreatorModal: () => void;
  onLogoutAdmin?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  creators,
  currentCreator,
  onSelectCreator,
  activeTab,
  setActiveTab,
  visitorLocation,
  simulatedCountry,
  onSimulateCountryChange,
  onOpenNewCreatorModal,
  onLogoutAdmin,
}) => {
  const isSupabase = isSupabaseConfigured();

  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 text-zinc-100 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand & Profile Selector */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">
                  LINK<span className="text-indigo-400">PRO</span>
                </span>
                <span className="text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
                  VIP Link + Store
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Bloqueo Geográfico IP + Tienda de Fotos/Videos con Pago Verificado
              </p>
            </div>
          </div>

          {/* Model Switcher & View Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Select Model / Profile */}
            <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10">
              <User className="w-4 h-4 text-indigo-400 ml-2 mr-1" />
              <select
                id="model-profile-selector"
                value={currentCreator?.handle || ''}
                onChange={(e) => onSelectCreator(e.target.value)}
                className="bg-transparent text-sm text-white font-medium focus:outline-none pr-2 cursor-pointer"
              >
                {creators.map((c) => (
                  <option key={c.id} value={c.handle} className="bg-zinc-900 text-white">
                    @{c.handle} ({c.name})
                  </option>
                ))}
              </select>
              <button
                id="add-new-model-button"
                onClick={onOpenNewCreatorModal}
                title="Crear nuevo perfil de modelo"
                className="p-1 hover:bg-white/10 text-indigo-400 hover:text-indigo-300 rounded-lg transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
              <button
                id="view-public-profile-tab"
                onClick={() => setActiveTab('public')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'public'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Perfil Link.me</span>
              </button>
              <button
                id="view-dashboard-tab"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Panel Modelo</span>
              </button>
            </div>

            {/* Logout Admin */}
            {onLogoutAdmin && (
              <button
                onClick={onLogoutAdmin}
                title="Cerrar panel de administración y volver a vista de visitante"
                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all cursor-pointer"
              >
                Cerrar Sesión Admin
              </button>
            )}

          </div>

        </div>

        {/* IP Location & Geo-blocking Simulator Toolbar */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-zinc-300 gap-2">
          
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-zinc-400">IP Detectada:</span>
            <code className="bg-white/10 border border-white/10 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-mono">
              {visitorLocation.ip}
            </code>
            <span className="text-zinc-500 hidden sm:inline">|</span>
            <span className="font-medium text-white flex items-center gap-1">
              País Real: <span className="text-emerald-400">{visitorLocation.countryName} ({visitorLocation.countryCode})</span>
            </span>
          </div>

          {/* Geo Blocking Test Controls */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-zinc-200 font-medium hidden sm:inline">Simular IP / Ubicación:</span>
            <select
              id="geo-simulation-country-select"
              value={simulatedCountry}
              onChange={(e) => onSimulateCountryChange(e.target.value)}
              className="bg-zinc-900/90 border border-white/10 rounded-lg px-2 py-0.5 text-xs text-indigo-300 font-medium focus:outline-none focus:border-indigo-400 cursor-pointer"
            >
              <option value="">🌐 Detectar por IP Real</option>
              {COUNTRIES_LIST.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code})
                </option>
              ))}
            </select>
            {simulatedCountry && (
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                SIMULADO
              </span>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
