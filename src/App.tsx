import React, { useState, useEffect, useRef } from 'react';
import { CreatorProfile, MediaItem, VisitorLocation, PurchaseRecord } from './types';
import { api } from './services/api';
import { HeaderBar } from './components/HeaderBar';
import { GeoBlockingBanner } from './components/GeoBlockingBanner';
import { PublicCreatorView } from './components/PublicCreatorView';
import { CreatorDashboard } from './components/CreatorDashboard';
import { PurchaseModal } from './components/PurchaseModal';
import { NewCreatorModal } from './components/NewCreatorModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { VisitorLeadModal } from './components/VisitorLeadModal';
import { INITIAL_CREATORS, INITIAL_MEDIA_ITEMS } from './data/mockData';
import { Lock } from 'lucide-react';

export default function App() {
  const [creators, setCreators] = useState<CreatorProfile[]>(INITIAL_CREATORS);
  const [currentCreator, setCurrentCreator] = useState<CreatorProfile>(INITIAL_CREATORS[0]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [isVisitorLeadModalOpen, setIsVisitorLeadModalOpen] = useState<boolean>(false);
  const [visitorContact, setVisitorContact] = useState<string>('');

  useEffect(() => {
    try {
      const savedContact = localStorage.getItem('geolink_visitor_contact');
      if (savedContact) {
        setVisitorContact(savedContact);
      } else {
        const timer = setTimeout(() => {
          setIsVisitorLeadModalOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);
  
  const [visitorLocation, setVisitorLocation] = useState<VisitorLocation>({
    ip: '181.16.2.44',
    countryCode: 'US',
    countryName: 'Estados Unidos',
    city: 'Detected Location',
  });

  const [simulatedCountry, setSimulatedCountry] = useState<string>('');
  const [accessAllowed, setAccessAllowed] = useState<boolean>(true);
  const [accessInfo, setAccessInfo] = useState<{
    visitorCountry: string;
    visitorCountryName: string;
    blockedMessage?: string;
  }>({
    visitorCountry: 'US',
    visitorCountryName: 'Estados Unidos',
  });

  // Admin Mode Controls (Public visitors do NOT see internal controls by default)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'public' | 'dashboard'>('public');
  const [selectedMediaForPurchase, setSelectedMediaForPurchase] = useState<MediaItem | null>(null);
  const [isNewCreatorModalOpen, setIsNewCreatorModalOpen] = useState<boolean>(false);

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
      setUnlockedMediaIds(res.unlockedMediaIds || []);
      setUnlockedTokensMap(res.unlockedTokensMap || {});
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
        loadCreatorDetails(allCreators[0].handle);
      } else {
        loadCreatorDetails(INITIAL_CREATORS[0].handle);
      }

      const loc = await api.getVisitorLocation();
      setVisitorLocation(loc);

      // Check for returning payment redirect parameters (Mercado Pago or PayPal)
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token') || params.get('unlock');
      const isMpReturn = params.get('payment') === 'success' || params.get('collection_status') === 'approved' || params.get('status') === 'approved';
      const isPpReturn = params.get('payment') === 'paypal_success';

      if (token && isMpReturn) {
        try {
          const verifyRes = await api.verifyPurchase(token, true);
          if (verifyRes.valid && verifyRes.purchase) {
            addUnlockedToken(token);
            const foundMedia = mediaItems.find(m => m.id === verifyRes.purchase.mediaId);
            if (foundMedia) {
              setSelectedMediaForPurchase(foundMedia);
            }
          }
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
            <PublicCreatorView
              creator={currentCreator}
              mediaItems={mediaItems}
              unlockedMediaIds={unlockedMediaIds}
              unlockedTokensMap={unlockedTokensMap}
              onOpenPurchaseModal={(item) => setSelectedMediaForPurchase(item)}
            />
          )
        ) : (
          /* SaaS Admin Dashboard for Model */
          <CreatorDashboard
            creator={currentCreator}
            mediaItems={mediaItems}
            onUpdateCreator={handleUpdateCreator}
            onRefreshData={handleRefreshData}
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

      {/* Footer with Discreet Model Access Button */}
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

      {/* Visitor Lead Capture Modal (Only for allowed countries and non-admins) */}
      {accessAllowed && !isAdminLoggedIn && (
        <VisitorLeadModal
          isOpen={isVisitorLeadModalOpen}
          onClose={(contact) => {
            setVisitorContact(contact);
            setIsVisitorLeadModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
