import React, { useState, useEffect, useMemo } from 'react';
import { Lock, Phone, Sparkles, Send, ShieldCheck, Search, ChevronDown, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { PHONE_COUNTRIES, PhoneCountry, findPhoneCountry } from '../data/phoneCountries';

interface VisitorLeadModalProps {
  isOpen: boolean;
  onClose: (contact: string) => void;
}

export const VisitorLeadModal: React.FC<VisitorLeadModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'phone' | 'telegram'>('phone');
  const [selectedCountry, setSelectedCountry] = useState<PhoneCountry>(() => findPhoneCountry('CO'));
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Auto-detect visitor country on load
  useEffect(() => {
    if (isOpen) {
      api.getVisitorLocation().then(loc => {
        if (loc && loc.countryCode) {
          const detected = findPhoneCountry(loc.countryCode);
          if (detected) setSelectedCountry(detected);
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  // Filter countries by search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return PHONE_COUNTRIES;
    const q = searchQuery.toLowerCase().trim();
    return PHONE_COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.dialCode.toLowerCase().includes(q) || 
      c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Calculate required digits for selected country
  const requiredDigits = useMemo(() => {
    if (Array.isArray(selectedCountry.digits)) {
      return selectedCountry.digits;
    }
    return selectedCountry.digits;
  }, [selectedCountry]);

  // Validate phone input
  const isPhoneValid = useMemo(() => {
    const clean = phoneNumber.replace(/[^0-9]/g, '');
    if (Array.isArray(requiredDigits)) {
      return clean.length >= requiredDigits[0] && clean.length <= requiredDigits[1];
    }
    return clean.length === requiredDigits;
  }, [phoneNumber, requiredDigits]);

  // Validate telegram input
  const isTelegramValid = useMemo(() => {
    const clean = telegramHandle.trim();
    const handle = clean.startsWith('@') ? clean.substring(1) : clean;
    return handle.length >= 5 && /^[a-zA-Z0-9_]+$/.test(handle);
  }, [telegramHandle]);

  const isValid = mode === 'phone' ? isPhoneValid : isTelegramValid;

  if (!isOpen) return null;

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric digits
    const clean = e.target.value.replace(/[^0-9]/g, '');
    const maxDigits = Array.isArray(requiredDigits) ? requiredDigits[1] : requiredDigits;
    setPhoneNumber(clean.slice(0, maxDigits));
    setError('');
  };

  const handleTelegramInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim();
    if (val && !val.startsWith('@')) val = `@${val}`;
    setTelegramHandle(val);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setError('');
    setIsSubmitting(true);

    let finalContact = '';
    if (mode === 'phone') {
      finalContact = `${selectedCountry.dialCode}${phoneNumber.replace(/[^0-9]/g, '')}`;
    } else {
      finalContact = telegramHandle.trim().startsWith('@') ? telegramHandle.trim() : `@${telegramHandle.trim()}`;
    }

    try {
      localStorage.setItem('geolink_visitor_contact', finalContact);
      await api.saveVisitorLead(finalContact, selectedCountry.code);
      onClose(finalContact);
    } catch {
      localStorage.setItem('geolink_visitor_contact', finalContact);
      onClose(finalContact);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#0d0f1a] border border-indigo-500/40 backdrop-blur-2xl rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative text-zinc-100 text-center space-y-5 animate-in fade-in zoom-in duration-300">
        
        {/* VIP Lock Badge */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
          <Lock className="w-7 h-7 text-white" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-[11px] uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perfil Exclusivo VIP</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Acceso al Contenido Privado</h2>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
            Ingresa tu WhatsApp o Telegram oficial para identificarte y acceder a todas las fotos y videos.
          </p>
        </div>

        {/* Mode Selector Toggle */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('phone'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'phone' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" /> WhatsApp / Teléfono
          </button>
          <button
            type="button"
            onClick={() => { setMode('telegram'); setError(''); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'telegram' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ✈️ Telegram (@usuario)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {mode === 'phone' ? (
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                Selecciona tu País y Número Móvil:
              </label>

              <div className="flex items-center gap-2">
                {/* Country Selector Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-xs font-bold text-white transition-colors cursor-pointer shrink-0 min-w-[110px]"
                  >
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span>{selectedCountry.dialCode}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                  </button>

                  {/* Dropdown Menu with Search */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-indigo-500/40 rounded-2xl p-2 shadow-2xl z-50 max-h-60 overflow-y-auto space-y-1">
                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar país o +57..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-8 pr-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                          autoFocus
                        />
                      </div>

                      {filteredCountries.map((country) => (
                        <button
                          key={`${country.code}_${country.dialCode}`}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            setPhoneNumber('');
                            setIsDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            selectedCountry.code === country.code ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40' : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span>{country.flag}</span>
                            <span className="truncate">{country.name}</span>
                          </div>
                          <span className="font-mono text-[11px] text-amber-300 shrink-0 ml-1">{country.dialCode}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone Number Digits Input (Numeric only) */}
                <div className="relative flex-1">
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phoneNumber}
                    onChange={handlePhoneInputChange}
                    placeholder={`Ej. ${selectedCountry.code === 'CO' ? '3001234567' : '123456789'}`}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-3 text-xs text-white placeholder-slate-500 font-mono outline-none transition-colors"
                    autoFocus
                  />
                  {isPhoneValid && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3.5" />
                  )}
                </div>
              </div>

              {/* Digit Counter & Validation Hint */}
              <div className="flex items-center justify-between text-[11px] font-semibold px-1">
                <span className="text-slate-400">
                  {selectedCountry.name}: Exige {Array.isArray(requiredDigits) ? `${requiredDigits[0]}-${requiredDigits[1]}` : requiredDigits} dígitos
                </span>
                <span className={isPhoneValid ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  Dígitos: {phoneNumber.length}/{Array.isArray(requiredDigits) ? requiredDigits[1] : requiredDigits} {isPhoneValid ? '✓' : ''}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1.5">
                Usuario de Telegram (Comienza con @):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={telegramHandle}
                  onChange={handleTelegramInputChange}
                  placeholder="@miusuario"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 outline-none transition-colors pr-10"
                  autoFocus
                />
                {isTelegramValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3.5 top-3.5" />
                ) : (
                  <Send className="w-4 h-4 text-indigo-400 absolute right-3.5 top-3.5" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Ingresa tu usuario de Telegram con la @ (Mínimo 5 caracteres).</p>
            </div>
          )}

          {error && <p className="text-red-400 text-[11px] font-semibold text-center">{error}</p>}

          {/* Submit Button (Disabled until strictly valid) */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
