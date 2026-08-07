import React, { useState } from 'react';
import { Lock, Key, X, Sparkles, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Secret PIN set to 0777
    if (pin === '0777') {
      onLoginSuccess();
    } else {
      setError('PIN o Contraseña incorrecta.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative p-6 text-zinc-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Acceso Privado Modelo</h3>
          <p className="text-xs text-zinc-400">
            Ingresa tu PIN secreto para gestionar tu tienda, editar precios, cargar videos y configurar geobloqueo.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 text-center">
              PIN de Creadora:
            </label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus-within:border-indigo-500">
              <Key className="w-4 h-4 text-indigo-400 mr-2 shrink-0" />
              <input
                type="password"
                placeholder="Ingresa tu PIN secreto"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                className="w-full bg-transparent focus:outline-none text-white text-center font-mono tracking-widest text-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ingresar al Panel de Control</span>
          </button>
        </form>

      </div>
    </div>
  );
};
