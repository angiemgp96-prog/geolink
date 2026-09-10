import React, { useEffect, useState } from 'react';
import { Send, CreditCard, X, CheckCircle2, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

const TELEGRAM_USER = 'Angelinaguzman69';

export interface PendingStripePayment {
  id: string;
  mediaId: string;
  mediaTitle: string;
  amount: number;
  currency?: string;
  stripeUrl: string;
  contactInfo?: string;
  status: 'pending' | 'sent' | 'cancelled';
  createdAt: string;
}

interface StripePendingReceiptModalProps {
  payment: PendingStripePayment;
  onClose: () => void;
  onMarkSent: () => void;
}

export const StripePendingReceiptModal: React.FC<StripePendingReceiptModalProps> = ({
  payment,
  onClose,
  onMarkSent
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(7);
  const formattedAmount = payment.amount ? `$${payment.amount.toFixed(2)} ${payment.currency || 'USD'}` : '$10.00 USD';

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('geolink_stripe_modal_dismissed', 'true');
    } catch {}
    onClose();
  };

  // Auto-minimize after 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSendTelegramReceipt = () => {
    const contactText = payment.contactInfo ? `\n\nMi contacto: ${payment.contactInfo}` : '';
    const msg = encodeURIComponent(
      `¡Hola! Realicé el pago por Stripe (${formattedAmount}) para el contenido: "${payment.mediaTitle}".${contactText}\n\nAquí te adjunto mi comprobante para la entrega 📎`
    );
    const telegramUrl = `https://t.me/${TELEGRAM_USER}?text=${msg}`;
    window.open(telegramUrl, '_blank');
    onMarkSent();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-zinc-900 to-slate-950 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-left cursor-default"
      >
        {/* 7-Second Progress Bar */}
        <div className="w-full bg-white/10 h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 7) * 100}%` }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
          title="Cerrar (o haz clic afuera)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border-b border-indigo-500/20 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/20">
            <CreditCard className="w-7 h-7 text-white" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Pago por Stripe Registrar
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold">
              <Clock className="w-3 h-3 text-amber-400" /> {timeLeft}s
            </span>
          </div>

          <h3 className="text-xl font-black text-white">Comprobante Pendiente</h3>
          <p className="text-xs text-zinc-300 mt-1 max-w-xs mx-auto leading-relaxed">
            Iniciaste un proceso de pago con <strong className="text-white">Stripe</strong>. Envíanos tu comprobante para activar tu entrega.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Details Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs text-zinc-400">Contenido / Producto:</span>
              <span className="text-xs font-extrabold text-white max-w-[200px] truncate text-right">
                {payment.mediaTitle}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs text-zinc-400">Monto del Pago:</span>
              <span className="text-sm font-black text-amber-300">
                {formattedAmount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Plataforma de Pago:</span>
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Stripe Official Link
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-snug text-[11px]">
              Al hacer clic en <strong className="text-white">Enviar Comprobante a Telegram</strong> se abrirá tu chat directo con la información lista para ser procesada.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSendTelegramReceipt}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer border border-sky-400/30 hover:scale-[1.01]"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Enviar Comprobante a Telegram</span>
            </button>

            <button
              onClick={handleDismiss}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>Ya envié el comprobante / Descartar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
