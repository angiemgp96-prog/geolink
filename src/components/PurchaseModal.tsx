import React, { useState, useEffect } from 'react';
import {
  X, Lock, Download, CheckCircle, CreditCard, ExternalLink,
  AlertCircle, Sparkles, ShieldCheck, ArrowRight, Phone, Send,
  Loader2, RefreshCw,
} from 'lucide-react';
import { MediaItem, PurchaseRecord, PaymentMethodsVisibility } from '../types';
import { api } from '../services/api';

// ─── Configuración de enlaces estáticos ──────────────────────────────
const PAYPAL_LINK    = 'https://www.paypal.com/paypalme/angieG473';
const NEQUI_USA_LINK = 'https://giros.nequi.com.co/l/Cc1Sv9Bz';
const TELEGRAM_USER  = 'Angelinaguzman69'; // sin @
// ─────────────────────────────────────────────────────────────────────

type Screen = 'select' | 'contact_paypal' | 'contact_nequi' | 'bank_mexico' | 'bank_usa' | 'bank_europe' | 'bank_colombia' | 'mp_pending' | 'mp_success' | 'paypal_pending' | 'paypal_success';

interface PurchaseModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onPurchaseSuccess?: (record: PurchaseRecord) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ item, onClose, onPurchaseSuccess }) => {
  const [screen, setScreen]             = useState<Screen>('select');
  const [isLoading, setIsLoading]       = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [contactInfo, setContactInfo]   = useState(() => {
    try {
      return localStorage.getItem('geolink_visitor_contact') || '';
    } catch {
      return '';
    }
  });
  const [contactError, setContactError] = useState('');
  const [copiedField, setCopiedField]   = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {}
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const buildTransferTelegramLink = (methodName: string) => {
    const contactText = contactInfo ? `\n\nMi contacto: ${contactInfo}` : '';
    const msg = encodeURIComponent(
      `¡Hola! Realizaré el pago por ${methodName} para comprar el contenido: "${item?.title || ''}" ($${item?.price.toFixed(2) || '0.00'} ${item?.currency || 'USD'}).${contactText}\n\nAquí te adjunto mi comprobante para la entrega 📎`
    );
    return `https://t.me/${TELEGRAM_USER}?text=${msg}`;
  };

  // MercadoPago API state
  const [mpUnlockToken, setMpUnlockToken]         = useState<string | null>(null);
  const [completedPurchase, setCompletedPurchase] = useState<PurchaseRecord | null>(null);

  // PayPal Live API state
  const [paypalUnlockToken, setPaypalUnlockToken] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId]         = useState<string | null>(null);

  // Visibilidad de métodos de pago desde Supabase/API
  const [paymentVisibility, setPaymentVisibility] = useState<PaymentMethodsVisibility>({
    mercadopago: true,
    paypal: true,
    paypal_telegram: true,
    nequi_usa: true,
  });

  const [visitorCountry, setVisitorCountry] = useState<string>('');

  useEffect(() => {
    if (!item) return;
    api.getVisitorLocation().then(loc => {
      if (loc && loc.countryCode) {
        setVisitorCountry(loc.countryCode.toUpperCase());
      }
    }).catch(() => {});
  }, [item]);

  const getDetectedRegion = (code: string) => {
    const c = (code || '').toUpperCase();
    if (c === 'MX') return 'MX';
    if (c === 'US') return 'US';
    if (['ES', 'FR', 'DE', 'IT', 'NL', 'PT', 'BE', 'AT', 'IE', 'FI', 'GR', 'EU'].includes(c)) return 'EU';
    if (c === 'CO') return 'CO';
    return 'OTHER';
  };

  const detectedRegion = getDetectedRegion(visitorCountry);

  useEffect(() => {
    if (!item) return;
    api.getPaymentMethodsVisibility()
      .then((vis) => {
        if (vis) setPaymentVisibility(vis);
      })
      .catch(() => {});
  }, [item]);

  if (!item) return null;

  // ── Polling de verificación para Mercado Pago ──────────────────────
  useEffect(() => {
    if (screen !== 'mp_pending' || !mpUnlockToken) return;
    const id = setInterval(async () => {
      try {
        const res = await api.verifyPurchase(mpUnlockToken, true);
        if (res.valid && res.purchase) {
          setCompletedPurchase(res.purchase);
          setScreen('mp_success');
          if (onPurchaseSuccess) onPurchaseSuccess(res.purchase);
          clearInterval(id);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(id);
  }, [screen, mpUnlockToken]);

  // ── Polling de verificación para PayPal Live API ───────────────────
  useEffect(() => {
    if (screen !== 'paypal_pending' || !paypalOrderId || !paypalUnlockToken) return;
    const id = setInterval(async () => {
      try {
        const res = await api.capturePayPalOrder(paypalOrderId, paypalUnlockToken);
        if (res.valid && res.purchase) {
          setCompletedPurchase(res.purchase);
          setScreen('paypal_success');
          if (onPurchaseSuccess) onPurchaseSuccess(res.purchase);
          clearInterval(id);
        }
      } catch {}
    }, 3000);
    return () => clearInterval(id);
  }, [screen, paypalOrderId, paypalUnlockToken]);

  // ── Validar contacto obligatorio ─────────────────────────────────
  const validateContact = () => {
    if (!contactInfo || !contactInfo.trim()) {
      setErrorMessage('⚠️ Debes ingresar tu WhatsApp o usuario de Telegram antes de continuar con la compra.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // ── Telegram: link con mensaje pre-llenado ────────────────────────
  const telegramLink = (method: string) => {
    const msg = encodeURIComponent(
      `Hola! Acabo de pagar "${item.title}" ($${item.price.toFixed(2)} ${item.currency}) vía ${method}.\n\nMi contacto: ${contactInfo}\n\nTe envío mi comprobante 📎`
    );
    return `https://t.me/${TELEGRAM_USER}?text=${msg}`;
  };

  // ════════════════════════════════════════════════════════════════
  // MERCADO PAGO — Redirección Directa a Checkout Oficial API
  // ════════════════════════════════════════════════════════════════
  const handleMercadoPagoDirect = async () => {
    if (!validateContact()) return;
    setErrorMessage('');
    setIsLoading(true);
    try {
      const data = await api.createMercadoPagoPreference(item.id, '', contactInfo);
      if (data.error) {
        setErrorMessage(data.error);
        return;
      }
      if (data.init_point) {
        window.open(data.init_point, '_blank');
        setMpUnlockToken(data.unlockToken);
        setScreen('mp_pending');
      } else {
        setErrorMessage('No se pudo generar el enlace de Mercado Pago. Intenta nuevamente.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al conectar con Mercado Pago.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMpManualCheck = async () => {
    if (!mpUnlockToken) return;
    setIsLoading(true);
    try {
      const res = await api.verifyPurchase(mpUnlockToken, true);
      if (res.valid && res.purchase) {
        setCompletedPurchase(res.purchase);
        setScreen('mp_success');
        if (onPurchaseSuccess) onPurchaseSuccess(res.purchase);
      } else {
        setErrorMessage('El pago aún no se ha reflejado. Completa el pago en Mercado Pago e intenta de nuevo.');
      }
    } catch {
      setErrorMessage('No se pudo verificar el pago en este momento. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // PAYPAL — Redirección Directa a Checkout Oficial PayPal Live API
  // ════════════════════════════════════════════════════════════════
  const handlePayPalDirect = async () => {
    if (!validateContact()) return;
    setErrorMessage('');
    setIsLoading(true);
    try {
      const data = await api.createPayPalOrder(item.id, '', contactInfo);
      if (data.error) {
        setErrorMessage(data.error);
        return;
      }
      if (data.approveUrl) {
        window.open(data.approveUrl, '_blank');
        setPaypalUnlockToken(data.unlockToken);
        setPaypalOrderId(data.orderId);
        setScreen('paypal_pending');
      } else {
        setErrorMessage('No se pudo generar el checkout de PayPal Live. Intenta nuevamente.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al conectar con la API de PayPal Live.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalManualCheck = async () => {
    if (!paypalOrderId || !paypalUnlockToken) return;
    setIsLoading(true);
    try {
      const res = await api.capturePayPalOrder(paypalOrderId, paypalUnlockToken);
      if (res.valid && res.purchase) {
        setCompletedPurchase(res.purchase);
        setScreen('paypal_success');
        if (onPurchaseSuccess) onPurchaseSuccess(res.purchase);
      } else {
        setErrorMessage('El pago aún no ha sido capturado o completado en PayPal. Revisa la ventana de PayPal e intenta de nuevo.');
      }
    } catch {
      setErrorMessage('No se pudo verificar la transacción con la API de PayPal Live.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Pagar vía Telegram: construye enlace directo y abre chat @Angelinaguzman69
  const buildPayPalTelegramLink = () => {
    const contactText = contactInfo ? `\n\nMi contacto: ${contactInfo}` : '';
    const msg = encodeURIComponent(
      `¡Hola! Quiero comprar el contenido: "${item.title}" ($${item.price.toFixed(2)} ${item.currency}).${contactText}`
    );
    return `https://t.me/${TELEGRAM_USER}?text=${msg}`;
  };

  const handlePayPalTelegramClick = (e: React.MouseEvent) => {
    if (!validateContact()) {
      e.preventDefault();
    }
  };

  // ════════════════════════════════════════════════════════════════
  // NEQUI USA — abre Nequi + redirige esta ventana a Telegram
  // ════════════════════════════════════════════════════════════════
  const handleNequiConfirm = () => {
    if (!validateContact()) return;
    window.open(NEQUI_USA_LINK, '_blank');
    window.location.href = telegramLink('Nequi Giro USA');
  };

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0d0f1a] border border-white/10 backdrop-blur-2xl rounded-3xl w-full max-w-lg shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto text-zinc-100">

        {/* Close */}
        <button id="close-purchase-modal" onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-zinc-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-white/10 backdrop-blur-md">
          <X className="w-5 h-5" />
        </button>

        {/* ══════════════════════════════════════════════════════
            PANTALLA 1: Selección de método
        ═══════════════════════════════════════════════════════*/}
        {screen === 'select' && (
          <div className="p-5 sm:p-6 pr-12">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5" /><span>Desbloqueo de Contenido Exclusivo</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 line-clamp-2">{item.title}</h3>

            {/* Preview blur */}
            <div className="relative rounded-2xl overflow-hidden mb-4 border border-slate-700/60 bg-slate-900 h-28 sm:h-32">
              <img src={item.previewUrl} alt={item.title} className="w-full h-full object-cover blur-sm opacity-50 scale-105" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-400/60 flex items-center justify-center backdrop-blur-md">
                  <Lock className="w-5 h-5 text-indigo-300" />
                </div>
                <div className="text-2xl font-black text-amber-300 drop-shadow-lg">
                  ${item.price.toFixed(2)} <span className="text-base font-semibold text-amber-400/80">{item.currency}</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
              </div>
            )}

            {/* Campo para ingresar WhatsApp / Telegram del comprador */}
            <div className="mb-4 text-left bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
              <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tu WhatsApp o usuario Telegram (Opcional)</span>
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => { setContactInfo(e.target.value); setContactError(''); }}
                placeholder="Ej. +573001234567 o @miusuario"
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-indigo-500 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
              />
              <p className="text-[10px] text-zinc-400">Se guardará en tu compra para que la creadora pueda contactarte.</p>
            </div>

            {/* General Security Tag */}
            <div className="mb-4 text-center bg-emerald-950/40 border border-emerald-500/30 rounded-xl py-2 px-3 flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pago Seguro directamente con las plataformas</span>
            </div>

            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Selecciona método de pago:</p>

            {(!paymentVisibility.mercadopago && !paymentVisibility.paypal && !paymentVisibility.paypal_telegram && !paymentVisibility.nequi_usa) ? (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs text-center font-medium my-3">
                ⚠️ No hay métodos de pago habilitados visualmente en este momento.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Mercado Pago — Redirección Directa */}
                {paymentVisibility.mercadopago && (
                  <button
                    id="pay-mercadopago-button"
                    disabled={isLoading}
                    onClick={handleMercadoPagoDirect}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 flex items-center justify-between transition-all cursor-pointer disabled:opacity-50 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div>Mercado Pago</div>
                        <div className="text-[11px] font-normal text-sky-100">Tarjetas · Nequi · PSE · Débito</div>
                      </div>
                    </div>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />}
                  </button>
                )}

                {/* PayPal Live API Direct */}
                {paymentVisibility.paypal && (
                  <button
                    id="pay-paypal-button"
                    disabled={isLoading}
                    onClick={handlePayPalDirect}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#003087] to-[#009cde] hover:from-[#00256a] hover:to-[#0082c2] text-white font-bold text-sm shadow-lg shadow-blue-900/30 flex items-center justify-between transition-all cursor-pointer disabled:opacity-50 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <span className="font-extrabold italic text-base leading-none">P</span>
                      </div>
                      <div className="text-left">
                        <div>PayPal (Oficial Live API)</div>
                        <div className="text-[11px] font-normal text-blue-200">Tarjetas internacionales · USD (Verificación Directa)</div>
                      </div>
                    </div>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />}
                  </button>
                )}

                {/* Pagar vía Telegram Directo */}
                {paymentVisibility.paypal_telegram && (
                  <a
                    id="pay-paypal-telegram-button"
                    href={buildPayPalTelegramLink()}
                    onClick={handlePayPalTelegramClick}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                        <Send className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div>Pagar vía Telegram</div>
                        <div className="text-[11px] font-normal text-emerald-100">Contacto directo · Chat @{TELEGRAM_USER}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}

                {/* Transferencia Bancaria por País Detectado por IP */}
                {detectedRegion === 'CO' && (
                  <button
                    id="pay-bank-colombia-button"
                    onClick={() => { setErrorMessage(''); setScreen('bank_colombia'); }}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#6a0dad] to-[#9b30d9] hover:from-[#5a0b99] hover:to-[#8525c5] text-white font-bold text-sm shadow-xl shadow-purple-950/40 flex items-center justify-between transition-all cursor-pointer group border-2 border-purple-400/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-lg">🇨🇴</div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span>Colombia — Nequi / Llave Bre-B</span>
                          <span className="bg-purple-400/20 text-purple-300 border border-purple-400/40 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded">DIRECTO</span>
                        </div>
                        <div className="text-[11px] font-normal text-purple-200">Llave: @NEQUIANG05606</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                {detectedRegion === 'MX' && (
                  <button
                    id="pay-bank-mexico-button"
                    onClick={() => { setErrorMessage(''); setScreen('bank_mexico'); }}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-green-800 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-between transition-all cursor-pointer group border-2 border-emerald-400/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-lg">🇲🇽</div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span>México — Transferencia CLABE</span>
                          <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded">DIRECTO</span>
                        </div>
                        <div className="text-[11px] font-normal text-emerald-100">Depósito en Pesos MXN · NVIO Pagos</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                {detectedRegion === 'US' && (
                  <button
                    id="pay-bank-usa-button"
                    onClick={() => { setErrorMessage(''); setScreen('bank_usa'); }}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-blue-800 via-indigo-800 to-sky-800 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-sm shadow-xl shadow-blue-950/40 flex items-center justify-between transition-all cursor-pointer group border-2 border-sky-400/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-lg">🇺🇸</div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span>Estados Unidos — Direct USD</span>
                          <span className="bg-sky-400/20 text-sky-300 border border-sky-400/40 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded">ACH / Wire</span>
                        </div>
                        <div className="text-[11px] font-normal text-blue-100">Cuenta de Cheques · Lead Bank</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                {detectedRegion === 'EU' && (
                  <button
                    id="pay-bank-europe-button"
                    onClick={() => { setErrorMessage(''); setScreen('bank_europe'); }}
                    className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-700 via-indigo-900 to-blue-900 hover:from-amber-600 hover:to-blue-800 text-white font-bold text-sm shadow-xl shadow-indigo-950/40 flex items-center justify-between transition-all cursor-pointer group border-2 border-amber-400/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-lg">🇪🇺</div>
                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span>Europa — Transferencia SEPA (EUR)</span>
                          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded">IBAN</span>
                        </div>
                        <div className="text-[11px] font-normal text-indigo-200">ClearBank Europe N.V. · Euros</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                {detectedRegion === 'OTHER' && (
                  <div className="space-y-2 pt-1 border-t border-white/10">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-left">Transferencias Directas por País:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => { setErrorMessage(''); setScreen('bank_mexico'); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                        <span>🇲🇽</span> <span>México</span>
                      </button>
                      <button onClick={() => { setErrorMessage(''); setScreen('bank_usa'); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                        <span>🇺🇸</span> <span>EE.UU.</span>
                      </button>
                      <button onClick={() => { setErrorMessage(''); setScreen('bank_europe'); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                        <span>🇪🇺</span> <span>Europa</span>
                      </button>
                      <button onClick={() => { setErrorMessage(''); setScreen('bank_colombia'); }} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                        <span>🇨🇴</span> <span>Colombia</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Comprobante por Telegram: <span className="text-sky-500">@{TELEGRAM_USER}</span></span>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PANTALLA: Transferencia Nequi Bre-B Colombia
        ═══════════════════════════════════════════════════════*/}
        {screen === 'bank_colombia' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <button onClick={() => setScreen('select')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2.5 cursor-pointer transition-colors">
                ← Volver a métodos de pago
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold mb-1.5">
                <span>🇨🇴 Colombia — Nequi / Llave Bre-B Directa</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xl font-black text-amber-300 mt-0.5">
                ${item.price.toFixed(2)} <span className="text-sm font-semibold text-amber-400/70">{item.currency}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs text-left leading-relaxed">
              🇨🇴 <strong className="text-white">Envía dinero en Colombia utilizando esta Llave Nequi / Bre-B.</strong> Usa el botón <span className="text-purple-300 font-bold">Copiar 📋</span> en la llave y envíame el comprobante por Telegram.
            </div>

            <div className="space-y-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nombre del beneficiario</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">Angie milena Guzman Patiño</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('Angie milena Guzman Patiño', 'co_name')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'co_name' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'co_name' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Llave Nequi / Bre-B</div>
                  <div className="text-sm font-mono font-bold text-amber-300 truncate select-all mt-0.5">@NEQUIANG05606</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('@NEQUIANG05606', 'co_breb')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'co_breb' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/40'}`}
                >
                  {copiedField === 'co_breb' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Plataforma / App</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">Nequi / Bre-B Colombia</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('Nequi / Bre-B Colombia', 'co_platform')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'co_platform' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'co_platform' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>
            </div>

            <a
              href={buildTransferTelegramLink('Nequi Llave Bre-B Colombia')}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <Send className="w-4 h-4 text-white animate-pulse" />
              <span>Enviar pantallazo a Telegram (@{TELEGRAM_USER})</span>
            </a>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PANTALLA 2: Contacto (PayPal / Nequi)
        ═══════════════════════════════════════════════════════*/}
        {(screen === 'contact_paypal' || screen === 'contact_nequi') && (
          <div className="p-6 md:p-7 space-y-5">
            <div>
              <button onClick={() => setScreen('select')}
                className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 mb-3 cursor-pointer transition-colors">
                ← Volver
              </button>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-bold mb-2 ${screen === 'contact_paypal' ? 'bg-gradient-to-r from-[#003087] to-[#009cde]' : 'bg-gradient-to-r from-[#6a0dad] to-[#9b30d9]'}`}>
                {screen === 'contact_paypal' ? '💳 PayPal' : '🇨🇴 Nequi Giro USA'}
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-2xl font-black text-amber-300 mt-1">
                ${item.price.toFixed(2)} <span className="text-base font-semibold text-amber-400/70">{item.currency}</span>
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-zinc-400 space-y-2">
              <p className="font-bold text-white text-sm">📋 ¿Cómo funciona?</p>
              <p>1. Ingresa tu WhatsApp o Telegram.</p>
              <p>2. Haz clic en <strong className="text-white">Ir a pagar</strong> — se abrirá el pago en una pestaña.</p>
              <p>3. Serás redirigido a nuestro chat de Telegram para enviarnos el comprobante.</p>
              <p>4. Te enviaremos el contenido de inmediato ✓</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                Tu WhatsApp o usuario de Telegram <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={e => { setContactInfo(e.target.value); setContactError(''); }}
                placeholder="Ej: +57 300 123 4567  o  @miusuario"
                className="w-full bg-white/5 border border-white/15 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                autoFocus
              />
              {contactError && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {contactError}
                </p>
              )}
            </div>

            <button
              onClick={screen === 'contact_paypal' ? handlePayPalConfirm : handleNequiConfirm}
              className={`w-full py-4 px-5 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all hover:opacity-90 cursor-pointer ${screen === 'contact_paypal' ? 'bg-gradient-to-r from-[#003087] to-[#009cde]' : 'bg-gradient-to-r from-[#6a0dad] to-[#9b30d9]'}`}
            >
              <Send className="w-4 h-4" />
              Ir a pagar — me redirige a Telegram
            </button>

            <p className="text-[10px] text-zinc-600 text-center">
              Se abrirá el link de pago y serás redirigido a nuestro chat de Telegram automáticamente.
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PANTALLA: Transferencia Bancaria México (CLABE)
        ═══════════════════════════════════════════════════════*/}
        {screen === 'bank_mexico' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <button onClick={() => setScreen('select')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2.5 cursor-pointer transition-colors">
                ← Volver a métodos de pago
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-1.5">
                <span>🇲🇽 México — Transferencia CLABE Directa</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xl font-black text-amber-300 mt-0.5">
                ${item.price.toFixed(2)} <span className="text-sm font-semibold text-amber-400/70">{item.currency}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs text-left leading-relaxed">
              🇲🇽 <strong className="text-white">Envía dinero en México utilizando estos detalles.</strong> Usa el botón <span className="text-emerald-300 font-bold">Copiar 📋</span> en cada dato y envíame el comprobante por Telegram.
            </div>

            <div className="space-y-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nombre del beneficiario</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">Angie milena Guzman Patiño</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('Angie milena Guzman Patiño', 'mx_name')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'mx_name' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'mx_name' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">CLABE Interbancaria</div>
                  <div className="text-xs font-mono font-bold text-amber-300 truncate select-all mt-0.5">710969000402393283</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('710969000402393283', 'mx_clabe')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'mx_clabe' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'mx_clabe' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nombre de la institución</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">NVIO Pagos México</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('NVIO Pagos México', 'mx_bank')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'mx_bank' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'mx_bank' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>
            </div>

            <a
              href={buildTransferTelegramLink('Transferencia México CLABE')}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <Send className="w-4 h-4 text-white animate-pulse" />
              <span>Enviar pantallazo a Telegram (@{TELEGRAM_USER})</span>
            </a>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PANTALLA: Transferencia Bancaria USA (Dollar)
        ═══════════════════════════════════════════════════════*/}
        {screen === 'bank_usa' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <button onClick={() => setScreen('select')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2.5 cursor-pointer transition-colors">
                ← Volver a métodos de pago
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-sky-500/40 text-sky-300 text-xs font-bold mb-1.5">
                <span>🇺🇸 Estados Unidos — Direct USD (ACH / Wire)</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xl font-black text-amber-300 mt-0.5">
                ${item.price.toFixed(2)} <span className="text-sm font-semibold text-amber-400/70">{item.currency}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-blue-950/40 border border-sky-500/30 text-sky-200 text-xs text-left leading-relaxed">
              💵 <strong className="text-white">Envía Dollar utilizando estos detalles.</strong> Copia los datos requeridos y envíame el comprobante por Telegram.
            </div>

            <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nombre del beneficiario</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">Angie milena Guzman Patino</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('Angie milena Guzman Patino', 'us_name')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'us_name' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'us_name' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tipo de cuenta</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">Cuenta de cheques</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('Cuenta de cheques', 'us_type')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'us_type' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'us_type' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Número de cuenta</div>
                  <div className="text-xs font-mono font-bold text-amber-300 truncate select-all mt-0.5">214880812209</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('214880812209', 'us_acc')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'us_acc' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'us_acc' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Número de ruta (Routing)</div>
                  <div className="text-xs font-mono font-bold text-amber-300 truncate select-all mt-0.5">101019644</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('101019644', 'us_route')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'us_route' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'us_route' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nombre del banco</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">Lead Bank</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('Lead Bank', 'us_bank')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'us_bank' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'us_bank' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Dirección del banco</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">1801 Main St., Kansas City, MO 64108</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('1801 Main St., Kansas City, MO 64108', 'us_addr')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'us_addr' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'us_addr' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>
            </div>

            <a
              href={buildTransferTelegramLink('Transferencia USA Dollar')}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <Send className="w-4 h-4 text-white animate-pulse" />
              <span>Enviar pantallazo a Telegram (@{TELEGRAM_USER})</span>
            </a>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PANTALLA: Transferencia Bancaria Europa (EUR - SEPA)
        ═══════════════════════════════════════════════════════*/}
        {screen === 'bank_europe' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <button onClick={() => setScreen('select')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2.5 cursor-pointer transition-colors">
                ← Volver a métodos de pago
              </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold mb-1.5">
                <span>🇪🇺 Europa — Transferencia SEPA (Euros)</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xl font-black text-amber-300 mt-0.5">
                ${item.price.toFixed(2)} <span className="text-sm font-semibold text-amber-400/70">{item.currency}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-amber-500/30 text-amber-200 text-xs text-left leading-relaxed">
              💶 <strong className="text-white">Envía dinero utilizando estos detalles.</strong> Usa el botón <span className="text-amber-300 font-bold">Copiar 📋</span> en cada dato y envíame el comprobante por Telegram.
            </div>

            <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nombre del beneficiario</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">Angie milena Guzman Patiño</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('Angie milena Guzman Patiño', 'eu_name')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'eu_name' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'eu_name' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">IBAN</div>
                  <div className="text-xs font-mono font-bold text-amber-300 truncate select-all mt-0.5">NL21CLRB0044881567</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('NL21CLRB0044881567', 'eu_iban')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'eu_iban' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'eu_iban' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">BIC / SWIFT</div>
                  <div className="text-xs font-mono font-bold text-amber-300 truncate select-all mt-0.5">CLRBNL2A053</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('CLRBNL2A053', 'eu_bic')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'eu_bic' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'eu_bic' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nombre del banco</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">ClearBank Europe N.V.</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('ClearBank Europe N.V.', 'eu_bank')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'eu_bank' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'eu_bank' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="text-left overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Dirección del banco</div>
                  <div className="text-xs font-mono font-bold text-white truncate select-all mt-0.5">Stadhouderskade 85, Amsterdam, 1073 AT</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('Stadhouderskade 85, Amsterdam, 1073 AT', 'eu_addr')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copiedField === 'eu_addr' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/10'}`}
                >
                  {copiedField === 'eu_addr' ? <><CheckCircle className="w-3.5 h-3.5 text-white" /><span>¡Copiado!</span></> : <><span>Copiar</span><span className="text-[10px]">📋</span></>}
                </button>
              </div>
            </div>

            <a
              href={buildTransferTelegramLink('Transferencia Europa SEPA')}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-indigo-700 to-blue-700 hover:from-amber-500 hover:to-blue-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <Send className="w-4 h-4 text-white animate-pulse" />
              <span>Enviar pantallazo a Telegram (@{TELEGRAM_USER})</span>
            </a>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PANTALLA 3: Mercado Pago — esperando confirmación API
        ═══════════════════════════════════════════════════════*/}
        {screen === 'mp_pending' && (
          <div className="p-7 space-y-5 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-sky-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Verificando pago en Mercado Pago...</h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Completa el pago en la ventana de Mercado Pago y vuelve aquí.<br />
                El contenido se liberará automáticamente al detectarse el pago.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Producto</span>
                <span className="font-semibold truncate max-w-[180px]">{item.title}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Monto</span>
                <span className="text-amber-400 font-bold">${item.price.toFixed(2)} {item.currency}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Estado</span>
                <span className="text-sky-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping inline-block" />
                  Consultando API Mercado Pago
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-2.5">
              <button onClick={handleMpManualCheck} disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Ya pagué — Verificar ahora
              </button>
              <button onClick={() => { setScreen('select'); setErrorMessage(''); }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs transition-all cursor-pointer">
                ← Volver a métodos de pago
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PANTALLA 4: Mercado Pago — pago confirmado ✓
        ═══════════════════════════════════════════════════════*/}
        {screen === 'mp_success' && completedPurchase && (
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Pago Acreditado en Mercado Pago
              </div>
              <h3 className="text-2xl font-bold text-white">¡Contenido Desbloqueado!</h3>
              <p className="text-sm text-slate-400 mt-1">Pago confirmado para <span className="text-purple-400 font-semibold">@{item.creatorHandle}</span></p>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 text-left flex items-center gap-4">
              <img src={item.previewUrl} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-600" />
              <div className="overflow-hidden">
                <h4 className="font-semibold text-sm text-white truncate">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.duration ? `Duración: ${item.duration}` : `Tamaño: ${item.fileSize}`}</p>
                <span className="text-xs text-emerald-400 font-medium">Confirmado — MERCADOPAGO</span>
              </div>
            </div>
            <a id="download-media-button"
              href={`/api/media/download/${completedPurchase.token}`}
              target="_blank" rel="noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all">
              <Download className="w-5 h-5" />
              Descargar {item.type === 'video' ? 'Video HD' : 'Galería HD'}
            </a>
            <div className="text-xs text-slate-600 border-t border-slate-800 pt-2">
              Token: <code className="text-purple-400 font-mono">{completedPurchase.token}</code>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PANTALLA 5: PayPal Live — esperando verificación API
        ═══════════════════════════════════════════════════════*/}
        {screen === 'paypal_pending' && (
          <div className="p-7 space-y-5 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Verificando pago en PayPal Live...</h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Completa el pago en la ventana oficial de PayPal y vuelve aquí.<br />
                Tu contenido se liberará automáticamente al capturar la orden.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm space-y-2">
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Producto</span>
                <span className="font-semibold truncate max-w-[180px]">{item.title}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Monto</span>
                <span className="text-amber-400 font-bold">${item.price.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Estado</span>
                <span className="text-blue-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping inline-block" />
                  Conectando API PayPal Live
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-2.5">
              <button onClick={handlePayPalManualCheck} disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Ya pagué — Capturar y Verificar PayPal
              </button>
              <button onClick={() => { setScreen('select'); setErrorMessage(''); }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs transition-all cursor-pointer">
                ← Volver a métodos de pago
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PANTALLA 6: PayPal Live — pago confirmado ✓
        ═══════════════════════════════════════════════════════*/}
        {screen === 'paypal_success' && completedPurchase && (
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Pago Capturado en PayPal Live API
              </div>
              <h3 className="text-2xl font-bold text-white">¡Contenido Desbloqueado!</h3>
              <p className="text-sm text-slate-400 mt-1">Pago verificado para <span className="text-purple-400 font-semibold">@{item.creatorHandle}</span></p>
            </div>
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 text-left flex items-center gap-4">
              <img src={item.previewUrl} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-600" />
              <div className="overflow-hidden">
                <h4 className="font-semibold text-sm text-white truncate">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.duration ? `Duración: ${item.duration}` : `Tamaño: ${item.fileSize}`}</p>
                <span className="text-xs text-emerald-400 font-medium">Orden Capturada — PAYPAL LIVE API</span>
              </div>
            </div>
            <a id="download-media-button"
              href={`/api/media/download/${completedPurchase.token}`}
              target="_blank" rel="noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all">
              <Download className="w-5 h-5" />
              Descargar {item.type === 'video' ? 'Video HD' : 'Galería HD'}
            </a>
            <div className="text-xs text-slate-600 border-t border-slate-800 pt-2">
              Token: <code className="text-purple-400 font-mono">{completedPurchase.token}</code>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
