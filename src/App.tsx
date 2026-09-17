import React, { useState, useEffect, useRef } from 'react';
import { CreatorProfile, MediaItem, VisitorLocation, PurchaseRecord } from './types';
import { api } from './services/api';
import { HeaderBar } from './components/HeaderBar';
import { GeoBlockingBanner } from './components/GeoBlockingBanner';
import { PublicCreatorView } from './components/PublicCreatorView';
import { CleanStripeProfileView } from './components/CleanStripeProfileView';
import { CreatorDashboard } from './components/CreatorDashboard';
import { PurchaseModal } from './components/PurchaseModal';
import { NewCreatorModal } from './components/NewCreatorModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { VisitorLeadModal } from './components/VisitorLeadModal';
import { ColombiaAccessGate } from './components/ColombiaAccessGate';
import { StripePendingReceiptModal, PendingStripePayment } from './components/StripePendingReceiptModal';
import { INITIAL_CREATORS, INITIAL_MEDIA_ITEMS } from './data/mockData';
import { Lock } from 'lucide-react';
import { isColombianVisitor, markVisitorAsColombian } from './utils/colombiaDetection';

export default function App() {
  const [isAppReady, setIsAppReady] = useState<boolean>(false);

  const [creators, setCreators] = useState<CreatorProfile[]>(INITIAL_CREATORS);
  const [currentCreator, setCurrentCreator] = useState<CreatorProfile>(INITIAL_CREATORS[0]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [isVisitorLeadModalOpen, setIsVisitorLeadModalOpen] = useState<boolean>(false);
  const [visitorContact, setVisitorContact] = useState<string>('');

  const [visitorLocation, setVisitorLocation] = useState<VisitorLocation>(() => {
    const isCo = isColombianVisitor();
    return {
      ip: '181.16.2.44',
      countryCode: isCo ? 'CO' : 'US',
      countryName: isCo ? 'Colombia' : 'Estados Unidos',
      city: isCo ? 'Colombia' : 'Detected Location',
    };
  });

  const [simulatedCountry, setSimulatedCountry] = useState<string>('');
  const [accessAllowed, setAccessAllowed] = useState<boolean>(true);
  const [accessInfo, setAccessInfo] = useState<{
    visitorCountry: string;
    visitorCountryName: string;
    blockedMessage?: string;
  }>(() => {
    const isCo = isColombianVisitor();
    return {
      visitorCountry: isCo ? 'CO' : 'US',
      visitorCountryName: isCo ? 'Colombia' : 'Estados Unidos',
    };
  });

  // Admin Mode Controls (Public visitors do NOT see internal controls by default)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'public' | 'dashboard'>('public');
  const [selectedMediaForPurchase, setSelectedMediaForPurchase] = useState<MediaItem | null>(null);
  const [pendingStripePayment, setPendingStripePayment] = useState<PendingStripePayment | null>(null);

  const checkAndOpenPendingStripePayment = async () => {
    // Si la persona ya cerró o descartó el modal en esta sesión, no volver a abrir hasta recargar
    try {
      if (sessionStorage.getItem('geolink_stripe_modal_dismissed') === 'true') {
        return;
      }
    } catch {}

    // Exclusivo del dispositivo específico que inició el pago
    try {
      const saved = localStorage.getItem('geolink_pending_stripe_payment');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.status === 'pending') {
          // Verificar en la base de datos si la compra sigue pendiente o si ya fue borrada/aprobada por el admin
          if (parsed.id) {
            const isStillPending = await api.checkPurchaseStillPending(parsed.id);
            if (!isStillPending) {
              try {
                localStorage.removeItem('geolink_pending_stripe_payment');
              } catch {}
              setPendingStripePayment(null);
              return;
            }
          }
          setPendingStripePayment(parsed);
        }
      }
    } catch {}
  };

  const checkAndRedirectPendingTelegramPayment = () => {
    try {
      const raw = localStorage.getItem('geolink_pending_telegram_payment');
      if (!raw) return;

      const data = JSON.parse(raw);
      if (!data || !data.mediaTitle) return;

      const elapsed = Date.now() - (data.timestamp || 0);
      // Wait at least 2.5 seconds to avoid accidental immediate focus shifts, and expire after 24h
      if (elapsed < 2500 || elapsed > 24 * 60 * 60 * 1000) return;

      // Clean up storage immediately so it never repeats or causes a loop
      localStorage.removeItem('geolink_pending_telegram_payment');

      const formattedAmount = data.amount ? `$${Number(data.amount).toFixed(2)} ${data.currency || 'USD'}` : '';
      const msg = encodeURIComponent(
        `¡Hola Angelina! Acabo de realizar el pago por Stripe (${formattedAmount}) para el contenido: "${data.mediaTitle}".\n\nAquí te adjunto mi comprobante de pago para recibir mi contenido 📎`
      );
      const telegramUrl = `https://t.me/Angelinaguzman69?text=${msg}`;
      window.location.href = telegramUrl;
    } catch (err) {
      console.warn('Error checking pending telegram redirect:', err);
    }
  };

  // Manejo de scroll para efecto glassmorphism
  useEffect(() => {
    checkAndRedirectPendingTelegramPayment();
    checkAndOpenPendingStripePayment();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndRedirectPendingTelegramPayment();
        checkAndOpenPendingStripePayment();
        // Force refresh of unlocked items and creator data to prevent stale views (e.g. old mock products)
        checkUnlockedItems();
        if (currentCreator?.handle) {
          loadCreatorDetails(currentCreator.handle);
        } else {
          initAppData();
        }
      }
    };

    const handleFocus = () => {
      checkAndRedirectPendingTelegramPayment();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  const [isNewCreatorModalOpen, setIsNewCreatorModalOpen] = useState<boolean>(false);
  const [requireLeadCapture, setRequireLeadCapture] = useState<boolean>(true);

  const [isColombiaPageUnlocked, setIsColombiaPageUnlocked] = useState<boolean>(false);
  const [isCleanHomeMode, setIsCleanHomeMode] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.has('home') || params.has('clean') || params.get('mode') === 'clean';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const savedContact = localStorage.getItem('geolink_visitor_contact');
      if (savedContact) {
        setVisitorContact(savedContact);
      }
    } catch {}

    api.getLeadCaptureSetting().then(setRequireLeadCapture).catch(() => {});
  }, []);

  // Check if Colombia page access has been approved for this device
  useEffect(() => {
    const isCo = (visitorLocation.countryCode === 'CO' || simulatedCountry === 'CO' || (!simulatedCountry && isColombianVisitor()));
    if (isCo) {
      api.checkColombiaAccessApproved().then(setIsColombiaPageUnlocked).catch(() => {});
    }
  }, [visitorLocation.countryCode, simulatedCountry]);

  // Reactively trigger lead modal or perform silent IP capture
  useEffect(() => {
    if (accessAllowed && !isAdminLoggedIn) {
      if (!requireLeadCapture) {
        // OFF MODE: Silent IP & Location logging in Supabase
        setIsVisitorLeadModalOpen(false);
        api.saveVisitorLead('Captura Silenciosa por IP', visitorLocation.countryCode).catch(() => {});
        return;
      }

      // ON MODE: Modal popup requirement
      try {
        const savedContact = localStorage.getItem('geolink_visitor_contact');
        if (!savedContact) {
          const timer = setTimeout(() => {
            setIsVisitorLeadModalOpen(true);
          }, 800);
          return () => clearTimeout(timer);
        }
      } catch {}
    }
  }, [accessAllowed, isAdminLoggedIn, requireLeadCapture, visitorLocation.countryCode]);

  const [unlockedMediaIds, setUnlockedMediaIds] = useState<string[]>([]);
  const [unlockedTokensMap, setUnlockedTokensMap] = useState<Record<string, string>>({});

  // Secret PIN 0777 Key Sequence Listener (Active only when typed dynamically)
  const [isBypassedWith0777, setIsBypassedWith0777] = useState<boolean>(false);
  const isBypassedRef = useRef<boolean>(false); // ref to avoid stale closure in checkGeoAccess
  const [showBypassToast, setShowBypassToast] = useState<boolean>(false);

  // Clear any old sessionStorage flags on startup
  useEffect(() => {
    sessionStorage.removeItem('bypass_0777');
  }, []);

  const checkUnlockedItems = async () => {
    try {
      const savedTokensRaw = localStorage.getItem('geolink_unlocked_tokens');
      const savedTokens: string[] = savedTokensRaw ? JSON.parse(savedTokensRaw) : [];
      const res = await api.getUnlockedItems(savedTokens);
      const mediaIds = res.unlockedMediaIds || [];
      setUnlockedMediaIds(mediaIds);
      setUnlockedTokensMap(res.unlockedTokensMap || {});

      if (mediaIds.includes('acceso_pagina_colombia')) {
        setIsColombiaPageUnlocked(true);
      }
    } catch (e) {
      console.warn('Error fetching unlocked items:', e);
    }
  };

  const addUnlockedToken = (token: string) => {
    try {
      const savedTokensRaw = localStorage.getItem('geolink_unlocked_tokens');
      const savedTokens: string[] = savedTokensRaw ? JSON.parse(savedTokensRaw) : [];
      if (!savedTokens.includes(token)) {
        savedTokens.push(token);
        localStorage.setItem('geolink_unlocked_tokens', JSON.stringify(savedTokens));
      }
      checkUnlockedItems();
    } catch (e) {
      console.warn('Error saving unlocked token:', e);
    }
  };

  // Global keypress listener for typing '0777' anywhere on the page
  useEffect(() => {
    let keyBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside text input fields or textareas
      const targetTag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

      if (e.key && e.key.length === 1) {
        keyBuffer = (keyBuffer + e.key).slice(-4);
        if (keyBuffer === '0777') {
          isBypassedRef.current = true; // update ref immediately
          setIsBypassedWith0777(true);
          setAccessAllowed(true);
          setIsColombiaPageUnlocked(true);
          setIsAdminLoggedIn(true);
          setActiveTab('dashboard');
          setShowBypassToast(true);
          setTimeout(() => setShowBypassToast(false), 4000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Initial Data Fetching & GeoIP Lookup
  useEffect(() => {
    initAppData();
    checkUnlockedItems();
  }, []);

  const initAppData = async () => {
    try {
      const allCreators = await api.getCreators();
      if (allCreators && allCreators.length > 0) {
        setCreators(allCreators);
        await loadCreatorDetails(allCreators[0].handle);
      } else {
        await loadCreatorDetails(INITIAL_CREATORS[0].handle);
      }

      const loc = await api.getVisitorLocation(simulatedCountry);
      const isCo = (loc.countryCode === 'CO' || (!simulatedCountry && isColombianVisitor()));
      if (isCo && !simulatedCountry) {
        loc.countryCode = 'CO';
        loc.countryName = 'Colombia';
        markVisitorAsColombian();
      }
      setVisitorLocation(loc);
      if (isCo) {
        api.checkColombiaAccessApproved().then(approved => {
          if (approved) setIsColombiaPageUnlocked(true);
        }).catch(() => {});
      }
      if (loc.hasApprovedPurchaseByIp) {
        setIsColombiaPageUnlocked(true);
      }

      // Check for returning payment redirect parameters or direct VIP access codes (?access=Axwkjl)
      const params = new URLSearchParams(window.location.search);
      const accessCode = params.get('access') || params.get('code') || params.get('pass');
      if (accessCode) {
        try {
          const isValidCode = await api.checkColombiaCustomCode(accessCode);
          if (isValidCode) {
            setIsColombiaPageUnlocked(true);
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch {}
          }
        } catch {}
      }

      const token = params.get('token') || params.get('unlock') || params.get('external_reference');
      const isMpReturn = params.get('payment') === 'success' || params.get('collection_status') === 'approved' || params.get('status') === 'approved';
      const isPpReturn = params.get('payment') === 'paypal_success';

      if (isMpReturn) {
        if (token) {
          try {
            // This verification call also tells the server to check MP API and mark the purchase as "completed" in Supabase
            const verifyRes = await api.verifyPurchase(token, true);
            if (verifyRes.valid && verifyRes.purchase) {
              if (verifyRes.purchase.mediaId === 'acceso_pagina_colombia') {
                await api.autoApproveMercadoPagoColombiaAccess();
                setIsColombiaPageUnlocked(true);
              } else {
                addUnlockedToken(token);
              }
              // Force clean reload so the user sees the store fully unlocked
              window.location.href = window.location.pathname;
              return;
            }
          } catch {}
        }
        
        // Fallback for old links or if token is missing
        try {
          await api.autoApproveMercadoPagoColombiaAccess();
          setIsColombiaPageUnlocked(true);
          window.location.href = window.location.pathname;
        } catch {}
      } else if (token && isPpReturn) {
        try {
          const captureRes = await api.capturePayPalOrder('', token);
          if (captureRes.valid && captureRes.purchase) {
            addUnlockedToken(token);
            const foundMedia = mediaItems.find(m => m.id === captureRes.purchase.mediaId);
            if (foundMedia) {
              setSelectedMediaForPurchase(foundMedia);
            }
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Init error, using defaults:', e);
    } finally {
      setIsAppReady(true);
    }
  };

  // 2. Load details for a selected creator handle
  const loadCreatorDetails = async (handle: string) => {
    try {
      const data = await api.getCreator(handle);
      setCurrentCreator(data.creator);
      setMediaItems(data.mediaItems);
      checkGeoAccess(handle, simulatedCountry);
    } catch (e) {
      console.warn('Creator fetch fallback:', e);
    }
  };

  // 3. Perform Geo-blocking Check
  const checkGeoAccess = async (handle: string, countryCode?: string) => {
    const res = await api.checkAccess(handle, countryCode);
    setAccessInfo({
      visitorCountry: res.visitorCountry,
      visitorCountryName: res.visitorCountryName,
      blockedMessage: res.blockedMessage,
    });

    // Use ref so we always read the latest bypass value (avoids stale closure)
    if (isBypassedRef.current || isAdminLoggedIn) {
      setAccessAllowed(true);
    } else {
      setAccessAllowed(res.allowed);
    }
  };

  // 4. Handle Creator Selection
  const handleSelectCreator = (handle: string) => {
    const found = creators.find(c => c.handle === handle);
    if (found) {
      setCurrentCreator(found);
      loadCreatorDetails(found.handle);
    }
  };

  // 5. Handle Geo Simulation Country Change
  const handleSimulateCountryChange = (countryCode: string) => {
    setSimulatedCountry(countryCode);
    checkGeoAccess(currentCreator.handle, countryCode);
  };

  // 6. Handle Profile Updates from Dashboard
  const handleUpdateCreator = (updated: CreatorProfile) => {
    setCurrentCreator(updated);
    setCreators(prev => prev.map(c => c.handle === updated.handle ? updated : c));
    checkGeoAccess(updated.handle, simulatedCountry);
  };

  const handleRefreshData = () => {
    loadCreatorDetails(currentCreator.handle);
  };

  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-[#030712] font-sans flex items-center justify-center relative overflow-hidden">
        {/* Background Ambient Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="fixed top-[40%] right-[30%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
        
        <div className="relative z-10 flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin" />
          <div className="text-zinc-300 font-semibold tracking-widest text-sm uppercase">Preparando experiencia...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] font-sans text-zinc-100 antialiased relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">

      {/* Background Glowing Ambient Orbs for Frosted Glass Theme */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[30%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Navigation Header ONLY visible when Model / Admin is logged in */}
      {isAdminLoggedIn && (
        <div className="relative z-10">
          <HeaderBar
            creators={creators}
            currentCreator={currentCreator}
            onSelectCreator={handleSelectCreator}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            visitorLocation={visitorLocation}
            simulatedCountry={simulatedCountry}
            onSimulateCountryChange={handleSimulateCountryChange}
            onOpenNewCreatorModal={() => setIsNewCreatorModalOpen(true)}
            onLogoutAdmin={() => {
              setIsAdminLoggedIn(false);
              setActiveTab('public');
            }}
          />
        </div>
      )}

      {/* Main Content Render */}
      <main className="relative z-10">
        {!isAdminLoggedIn || activeTab === 'public' ? (
          !accessAllowed ? (
            /* Geo-blocked Notice */
            <GeoBlockingBanner
              creator={currentCreator}
              visitorCountryCode={accessInfo.visitorCountry}
              visitorCountryName={accessInfo.visitorCountryName}
              onBypassSimulation={() => {
                setIsAdminLoginModalOpen(true);
              }}
            />
          ) : (
            /* Clean Public Link.me Profile & Photo/Video Store */
            ((visitorLocation.countryCode === 'CO' || simulatedCountry === 'CO' || (!simulatedCountry && isColombianVisitor())) && !isColombiaPageUnlocked && !isAdminLoggedIn && !isBypassedWith0777) ? (
              <ColombiaAccessGate
                creator={currentCreator}
                onUnlocked={() => setIsColombiaPageUnlocked(true)}
              />
            ) : (
              isCleanHomeMode ? (
                <CleanStripeProfileView
                  creator={currentCreator}
                  onOpenPurchaseModal={(item) => setSelectedMediaForPurchase(item)}
                />
              ) : (
                <PublicCreatorView
                  creator={currentCreator}
                  mediaItems={mediaItems}
                  unlockedMediaIds={unlockedMediaIds}
                  unlockedTokensMap={unlockedTokensMap}
                  onOpenPurchaseModal={(item) => setSelectedMediaForPurchase(item)}
                />
              )
            )
          )
        ) : (
          /* SaaS Admin Dashboard for Model */
          <CreatorDashboard
            creator={currentCreator}
            mediaItems={mediaItems}
            onUpdateCreator={handleUpdateCreator}
            onRefreshData={handleRefreshData}
            onTestLeadModal={() => {
              localStorage.removeItem('geolink_visitor_contact');
              setVisitorContact('');
              setIsVisitorLeadModalOpen(true);
              setActiveTab('public');
            }}
          />
        )}
      </main>

      {/* Purchase Modal with Real Payment Verification */}
      {selectedMediaForPurchase && (
        <PurchaseModal
          item={selectedMediaForPurchase}
          onClose={() => setSelectedMediaForPurchase(null)}
          onPurchaseSuccess={(record) => {
            if (record && record.token) {
              addUnlockedToken(record.token);
            }
            handleRefreshData();
          }}
        />
      )}

      {/* New Model Registration Modal */}
      {isNewCreatorModalOpen && (
        <NewCreatorModal
          onClose={() => setIsNewCreatorModalOpen(false)}
          onCreatorCreated={(newCreator) => {
            setCreators(prev => [...prev, newCreator]);
            setCurrentCreator(newCreator);
            loadCreatorDetails(newCreator.handle);
          }}
        />
      )}

      {/* PIN Unlock Toast Notification */}
      {showBypassToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/90 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/50 backdrop-blur-md flex items-center gap-3 animate-bounce">
          <span className="text-xl">🔓</span>
          <div>
            <div className="font-bold">Acceso Especial Activado</div>
            <div className="text-xs text-emerald-100 font-normal">Geobloqueo omitido para esta sesión</div>
          </div>
        </div>
      )}

      {/* Secret Admin Login Modal */}
      {isAdminLoginModalOpen && (
        <AdminLoginModal
          onClose={() => setIsAdminLoginModalOpen(false)}
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setIsAdminLoginModalOpen(false);
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* Footer with Discreet Model Access Button (Oculto cuando el Gate de Colombia está activo) */}
      {!((visitorLocation.countryCode === 'CO' || simulatedCountry === 'CO') && !isColombiaPageUnlocked && !isAdminLoggedIn && !isBypassedWith0777) && (
        <footer className="relative z-10 py-6 px-8 bg-black/60 border-t border-white/5 text-[11px] text-zinc-500 uppercase tracking-widest flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>Link.me VIP • {currentCreator.name}</div>
          
          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-indigo-300 text-xs font-medium transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isAdminLoggedIn ? 'Panel Creadora (Activo)' : '🔑 Acceso Exclusivo Creadora'}</span>
          </button>
        </footer>
      )}

      {/* Stripe Pending Receipt Modal */}
      {pendingStripePayment && (
        <StripePendingReceiptModal
          payment={pendingStripePayment}
          onClose={() => setPendingStripePayment(null)}
          onMarkSent={() => {
            if (pendingStripePayment.id) {
              api.markStripePaymentSent(pendingStripePayment.id).catch(() => {});
            }
            try {
              localStorage.removeItem('geolink_pending_stripe_payment');
            } catch {}
            setPendingStripePayment(null);
          }}
        />
      )}

      {/* Visitor Lead Capture Modal (Only for allowed countries and non-admins) */}
      {accessAllowed && !isAdminLoggedIn && (
        <VisitorLeadModal
          isOpen={isVisitorLeadModalOpen}
          onClose={(contact) => {
            setVisitorContact(contact);
            setIsVisitorLeadModalOpen(false);
            if (contact && contact.trim()) {
              api.saveVisitorLead(contact.trim(), visitorLocation.countryCode).catch(() => {});
            }
          }}
        />
      )}
    </div>
  );
}
