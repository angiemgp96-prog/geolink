import React, { useState, useEffect } from 'react';
import { ShieldAlert, CreditCard, ShoppingBag, Link as LinkIcon, MessageSquare, History, Plus, Trash2, Edit, Save, CheckCircle, AlertCircle, RefreshCw, Send, DollarSign, Globe, Lock, UserCheck, Sparkles } from 'lucide-react';
import { CreatorProfile, MediaItem, PurchaseRecord, CustomLink, VisitorLead } from '../types';
import { COUNTRIES_LIST } from '../data/countries';
import { api } from '../services/api';

interface CreatorDashboardProps {
  creator: CreatorProfile;
  mediaItems: MediaItem[];
  onUpdateCreator: (updated: CreatorProfile) => void;
  onRefreshData: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  creator,
  mediaItems,
  onUpdateCreator,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'geoblock' | 'store' | 'payments' | 'whatsapp' | 'links' | 'sales' | 'leads'>('geoblock');
  
  // Profile edit state
  const [profile, setProfile] = useState<CreatorProfile>({ ...creator });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [visitorLeads, setVisitorLeads] = useState<VisitorLead[]>([]);

  // New Media Item Form State
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [newMedia, setNewMedia] = useState<Partial<MediaItem>>({
    title: '',
    description: '',
    type: 'video',
    price: 10,
    currency: 'USD',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fileSize: '500 MB',
    duration: '10:00 min',
  });

  // New Link Form State
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('Instagram');

  // Sales History
  const [purchasesHistory, setPurchasesHistory] = useState<PurchaseRecord[]>([]);
  const [testPhone, setTestPhone] = useState('');
  const [waTestResponse, setWaTestResponse] = useState<string | null>(null);

  useEffect(() => {
    if (creator) {
      setProfile({
        ...creator,
        blockedCountries: Array.isArray(creator.blockedCountries) ? creator.blockedCountries : ['CO'],
        links: Array.isArray(creator.links) ? creator.links : [],
        paymentSettings: creator.paymentSettings || {
          mercadoPagoAccessToken: '',
          mercadoPagoPublicKey: '',
          payPalClientId: '',
          payPalClientSecret: '',
          payPalMode: 'live',
          customPaymentLinks: []
        }
      });
    }
    loadPurchases();
    loadVisitorLeads();
  }, [creator]);

  const loadPurchases = async () => {
    try {
      const data = await api.getPurchases(creator.handle);
      setPurchasesHistory(Array.isArray(data) ? data : []);
    } catch {
      setPurchasesHistory([]);
    }
  };

  const loadVisitorLeads = async () => {
    try {
      const data = await api.getVisitorLeads();
      setVisitorLeads(Array.isArray(data) ? data : []);
    } catch {
      setVisitorLeads([]);
    }
  };

  const handleApprovePurchase = async (tokenOrId: string) => {
    try {
      const res = await api.approvePurchaseManual(tokenOrId);
      if (res.success) {
        await loadPurchases();
        if (onRefreshData) onRefreshData();
      } else {
        alert(res.error || 'Error al aprobar la venta');
      }
    } catch {
      alert('Error de conexión al aprobar la venta');
    }
  };

  const handleBlockIp = async (ipAddress: string) => {
    if (!ipAddress || ipAddress === 'Detected') {
      alert('Dirección IP no válida para bloquear');
      return;
    }
    let deviceHash = '';
    try {
      deviceHash = localStorage.getItem('geolink_device_fingerprint') || '';
    } catch {}

    if (confirm(`¿Estás seguro de que deseas bloquear la IP ${ipAddress}? Este comprador y su dispositivo quedarán bloqueados en Supabase.`)) {
      try {
        const res = await api.blockIp(creator.handle, ipAddress, deviceHash);
        alert(res.message || `IP ${ipAddress} y Dispositivo bloqueados exitosamente.`);
        await loadPurchases();
        if (onRefreshData) onRefreshData();
      } catch {
        alert('Error al bloquear la IP y dispositivo');
      }
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updated = await api.saveCreator(profile);
      onUpdateCreator(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Country in Geo-Block list
  const toggleCountryBlock = (countryCode: string) => {
    const exists = profile.blockedCountries.includes(countryCode);
    let updatedList: string[];
    if (exists) {
      updatedList = profile.blockedCountries.filter(c => c !== countryCode);
    } else {
      updatedList = [...profile.blockedCountries, countryCode];
    }
    setProfile({ ...profile, blockedCountries: updatedList });
  };

  // Add new media item
  const handleSaveMediaItem = async () => {
    if (!newMedia.title || !newMedia.price) return;
    const itemToSave: MediaItem = {
      id: `media_${Date.now()}`,
      creatorId: profile.id,
      creatorHandle: profile.handle,
      title: newMedia.title || 'Contenido Exclusivo',
      description: newMedia.description || '',
      type: newMedia.type as any || 'video',
      price: Number(newMedia.price) || 9.99,
      currency: newMedia.currency || 'USD',
      previewUrl: newMedia.previewUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      downloadUrl: newMedia.downloadUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      fileSize: newMedia.fileSize || '350 MB',
      duration: newMedia.duration || '12:00 min',
      purchasesCount: 0,
      createdAt: new Date().toISOString()
    };

    await api.saveMediaItem(itemToSave);
    setIsAddingMedia(false);
    onRefreshData();
  };

  const handleDeleteMedia = async (id: string) => {
    if (confirm('¿Eliminar este contenido de la tienda?')) {
      await api.deleteMediaItem(id);
      onRefreshData();
    }
  };

  // Update existing media item
  const handleUpdateMediaItem = async () => {
    if (!editingMedia || !editingMedia.title || !editingMedia.price) return;
    await api.saveMediaItem(editingMedia);
    setEditingMedia(null);
    onRefreshData();
  };

  // Add Custom Link
  const handleAddLink = () => {
    if (!newLinkTitle || !newLinkUrl) return;
    const link: CustomLink = {
      id: `link_${Date.now()}`,
      title: newLinkTitle,
      url: newLinkUrl,
      icon: newLinkIcon,
      active: true,
      clicks: 0
    };
    setProfile({
      ...profile,
      links: [...profile.links, link]
    });
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleToggleLinkActive = (id: string) => {
    const updated = profile.links.map(l => l.id === id ? { ...l, active: !l.active } : l);
    setProfile({ ...profile, links: updated });
  };

  const handleDeleteLink = (id: string) => {
    const updated = profile.links.filter(l => l.id !== id);
    setProfile({ ...profile, links: updated });
  };

  // Send WhatsApp Test
  const handleSendWaTest = async () => {
    if (!testPhone) return;
    setWaTestResponse('Enviando...');
    const res = await api.sendWhatsAppConfirmation(testPhone, 'Video Demo Exclusivo 4K', 'unlock_demo_123');
    setWaTestResponse(JSON.stringify(res, null, 2));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-300 font-bold px-3 py-1 rounded-full border border-purple-500/30">
              PANEL CREADOR / MODELO
            </span>
            <span className="text-xs text-slate-400">@{profile.handle}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Configuración y Gestión de @{profile.handle}</h1>
        </div>

        <button
          id="save-profile-changes-button"
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>¡Cambios Guardados!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Guardar Todos los Cambios</span>
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-8">
        
        <button
          id="tab-geoblock"
          onClick={() => setActiveTab('geoblock')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs md:text-sm transition-all ${
            activeTab === 'geoblock'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Bloqueo Geográfico IP ({(profile.blockedCountries || []).length})</span>
        </button>

        <button
          id="tab-store"
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs md:text-sm transition-all ${
            activeTab === 'store'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-purple-400" />
          <span>Tienda Fotos/Videos ({(mediaItems || []).length})</span>
        </button>

        <button
          id="tab-payments"
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs md:text-sm transition-all ${
            activeTab === 'payments'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4 text-sky-400" />
          <span>Pasarelas de Pago API</span>
        </button>

        <button
          id="tab-whatsapp"
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs md:text-sm transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>WhatsApp Notificaciones</span>
        </button>

        <button
          id="tab-links"
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs md:text-sm transition-all ${
            activeTab === 'links'
              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <LinkIcon className="w-4 h-4 text-pink-400" />
          <span>Perfil & Enlaces ({(profile.links || []).length})</span>
        </button>

        <button
          id="tab-sales"
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs md:text-sm transition-all ${
            activeTab === 'sales'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <History className="w-4 h-4 text-indigo-400" />
          <span>Ventas & Descargas ({(purchasesHistory || []).length})</span>
        </button>

        <button
          id="tab-leads"
          onClick={() => { setActiveTab('leads'); loadVisitorLeads(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs md:text-sm transition-all ${
            activeTab === 'leads'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4 text-purple-400" />
          <span>Prospectos / Leads ({(visitorLeads || []).length})</span>
        </button>

      </div>

      {/* TAB 1: GEO-BLOCKING MANAGER */}
      {activeTab === 'geoblock' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Bloqueo Geográfico por Dirección IP</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona los países donde NO quieres que tu perfil y tienda sean visibles.
                </p>
              </div>
            </div>

            {/* Blocked Countries Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {COUNTRIES_LIST.map((country) => {
                const isBlocked = profile.blockedCountries.includes(country.code);
                return (
                  <button
                    key={country.code}
                    id={`toggle-country-${country.code}`}
                    onClick={() => toggleCountryBlock(country.code)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isBlocked
                        ? 'bg-red-950/60 border-red-500/80 text-red-300 shadow-md'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-xs font-semibold">{country.name}</span>
                    </div>
                    {isBlocked ? (
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                        BLOQUEADO
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        Visible
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Blocked Message Input */}
            <div className="pt-4 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Mensaje personalizado para visitantes bloqueados:
              </label>
              <textarea
                id="custom-blocked-message-input"
                rows={2}
                value={profile.blockedMessage}
                onChange={(e) => setProfile({ ...profile, blockedMessage: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="Escribe el motivo o advertencia cuando ingresen desde un país bloqueado..."
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STORE MANAGER (Fotos y Videos) */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Gestión de Contenido Exclusivo</h3>
            <button
              id="add-media-item-button"
              onClick={() => setIsAddingMedia(!isAddingMedia)}
              className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Nuevo Foto/Video</span>
            </button>
          </div>

          {/* Add Media Item Form */}
          {isAddingMedia && (
            <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 space-y-4">
              <h4 className="font-bold text-base text-purple-300">Añadir Nuevo Producto Digital</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Título del Contenido:</label>
                  <input
                    id="new-media-title-input"
                    type="text"
                    placeholder="ej. 🔥 Video Exclusivo Beach Uncut 4K"
                    value={newMedia.title}
                    onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tipo de Contenido:</label>
                  <select
                    id="new-media-type-select"
                    value={newMedia.type}
                    onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  >
                    <option value="video">🎥 Video Full HD / 4K</option>
                    <option value="photo">📸 Sesión / Set de Fotos</option>
                    <option value="bundle">📦 Pack Especial VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Precio:</label>
                  <input
                    id="new-media-price-input"
                    type="number"
                    step="0.5"
                    value={newMedia.price}
                    onChange={(e) => setNewMedia({ ...newMedia, price: parseFloat(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Moneda:</label>
                  <select
                    id="new-media-currency-select"
                    value={newMedia.currency}
                    onChange={(e) => setNewMedia({ ...newMedia, currency: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  >
                    <option value="USD">USD ($ Dólares)</option>
                    <option value="ARS">ARS ($ Pesos Argentinos)</option>
                    <option value="EUR">EUR (€ Euros)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">URL de Vista Previa (Blur/Portada):</label>
                  <input
                    id="new-media-preview-url-input"
                    type="text"
                    value={newMedia.previewUrl}
                    onChange={(e) => setNewMedia({ ...newMedia, previewUrl: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">URL de Descarga Directa (Archivo Real):</label>
                  <input
                    id="new-media-download-url-input"
                    type="text"
                    value={newMedia.downloadUrl}
                    onChange={(e) => setNewMedia({ ...newMedia, downloadUrl: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Duración (ej. 10:00 min):</label>
                  <input
                    id="new-media-duration-input"
                    type="text"
                    placeholder="ej. 10:00 min"
                    value={newMedia.duration || ''}
                    onChange={(e) => setNewMedia({ ...newMedia, duration: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tamaño / Peso del Archivo:</label>
                  <input
                    id="new-media-filesize-input"
                    type="text"
                    placeholder="ej. 350 MB o 15 Fotos HD"
                    value={newMedia.fileSize || ''}
                    onChange={(e) => setNewMedia({ ...newMedia, fileSize: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Descripción corta:</label>
                <textarea
                  id="new-media-desc-input"
                  rows={2}
                  value={newMedia.description}
                  onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  id="cancel-add-media-button"
                  onClick={() => setIsAddingMedia(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancelar
                </button>
                <button
                  id="save-new-media-button"
                  onClick={handleSaveMediaItem}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Guardar en Tienda
                </button>
              </div>
            </div>
          )}

          {/* Edit Media Item Form */}
          {editingMedia && (
            <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-indigo-300">Editar Producto Digital</h4>
                <span className="text-xs text-slate-400 font-mono">ID: {editingMedia.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Título del Contenido:</label>
                  <input
                    id="edit-media-title-input"
                    type="text"
                    value={editingMedia.title}
                    onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tipo de Contenido:</label>
                  <select
                    id="edit-media-type-select"
                    value={editingMedia.type}
                    onChange={(e) => setEditingMedia({ ...editingMedia, type: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  >
                    <option value="video">🎥 Video Full HD / 4K</option>
                    <option value="photo">📸 Sesión / Set de Fotos</option>
                    <option value="bundle">📦 Pack Especial VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Precio:</label>
                  <input
                    id="edit-media-price-input"
                    type="number"
                    step="0.5"
                    value={editingMedia.price}
                    onChange={(e) => setEditingMedia({ ...editingMedia, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Moneda:</label>
                  <select
                    id="edit-media-currency-select"
                    value={editingMedia.currency}
                    onChange={(e) => setEditingMedia({ ...editingMedia, currency: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  >
                    <option value="USD">USD ($ Dólares)</option>
                    <option value="ARS">ARS ($ Pesos Argentinos)</option>
                    <option value="EUR">EUR (€ Euros)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">URL de Vista Previa (Blur/Portada):</label>
                  <input
                    id="edit-media-preview-url-input"
                    type="text"
                    value={editingMedia.previewUrl}
                    onChange={(e) => setEditingMedia({ ...editingMedia, previewUrl: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">URL de Descarga Directa (Archivo Real):</label>
                  <input
                    id="edit-media-download-url-input"
                    type="text"
                    value={editingMedia.downloadUrl}
                    onChange={(e) => setEditingMedia({ ...editingMedia, downloadUrl: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Duración (ej. 10:00 min):</label>
                  <input
                    id="edit-media-duration-input"
                    type="text"
                    placeholder="ej. 10:00 min"
                    value={editingMedia.duration || ''}
                    onChange={(e) => setEditingMedia({ ...editingMedia, duration: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tamaño / Peso del Archivo:</label>
                  <input
                    id="edit-media-filesize-input"
                    type="text"
                    placeholder="ej. 350 MB o 15 Fotos HD"
                    value={editingMedia.fileSize || ''}
                    onChange={(e) => setEditingMedia({ ...editingMedia, fileSize: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Descripción corta:</label>
                <textarea
                  id="edit-media-desc-input"
                  rows={2}
                  value={editingMedia.description}
                  onChange={(e) => setEditingMedia({ ...editingMedia, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  id="cancel-edit-media-button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="save-edit-media-button"
                  onClick={handleUpdateMediaItem}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
                >
                  Guardar Cambios en Supabase & Tienda
                </button>
              </div>
            </div>
          )}

          {/* List of Store Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaItems.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 items-center">
                <img
                  src={item.previewUrl}
                  alt={item.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-700"
                />
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                  <p className="text-xs text-purple-400 font-semibold mt-0.5">
                    ${item.price.toFixed(2)} {item.currency}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Compras acumuladas: <span className="text-emerald-400">{item.purchasesCount}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    id={`edit-media-${item.id}`}
                    onClick={() => setEditingMedia({ ...item })}
                    className="p-2 bg-purple-950/60 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-900 transition-colors"
                    title="Editar contenido"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    id={`delete-media-${item.id}`}
                    onClick={() => handleDeleteMedia(item.id)}
                    className="p-2 bg-red-950/60 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-900 transition-colors"
                    title="Eliminar contenido"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS API CONFIGURATION */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-sky-400" />
              <span>Configuración de Pasarelas de Pago API</span>
            </h3>

            {/* Mercado Pago */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-sky-300">Mercado Pago API Credentials</h4>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded font-semibold">
                  Mercado Pago Direct
                </span>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Mercado Pago Access Token:</label>
                <input
                  id="mp-access-token-input"
                  type="password"
                  placeholder="APP_USR-xxxxxx-xxxxxx-xxxxxx"
                  value={profile.paymentSettings?.mercadoPagoAccessToken || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    paymentSettings: {
                      mercadoPagoPublicKey: profile.paymentSettings?.mercadoPagoPublicKey || '',
                      payPalClientId: profile.paymentSettings?.payPalClientId || '',
                      payPalClientSecret: profile.paymentSettings?.payPalClientSecret || '',
                      payPalMode: profile.paymentSettings?.payPalMode || 'live',
                      customPaymentLinks: profile.paymentSettings?.customPaymentLinks || [],
                      mercadoPagoAccessToken: e.target.value
                    }
                  })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-mono"
                />
              </div>
            </div>

            {/* PayPal */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-blue-300">PayPal REST API Credentials</h4>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-semibold">
                  PayPal REST v2
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">PayPal Client ID:</label>
                  <input
                    id="paypal-client-id-input"
                    type="text"
                    placeholder="AXXXXXX..."
                    value={profile.paymentSettings?.payPalClientId || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      paymentSettings: {
                        mercadoPagoAccessToken: profile.paymentSettings?.mercadoPagoAccessToken || '',
                        mercadoPagoPublicKey: profile.paymentSettings?.mercadoPagoPublicKey || '',
                        payPalClientSecret: profile.paymentSettings?.payPalClientSecret || '',
                        payPalMode: profile.paymentSettings?.payPalMode || 'live',
                        customPaymentLinks: profile.paymentSettings?.customPaymentLinks || [],
                        payPalClientId: e.target.value
                      }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">PayPal Client Secret:</label>
                  <input
                    id="paypal-secret-input"
                    type="password"
                    placeholder="EXXXXXX..."
                    value={profile.paymentSettings?.payPalClientSecret || ''}
                    onChange={(e) => setProfile({
                      ...profile,
                      paymentSettings: {
                        mercadoPagoAccessToken: profile.paymentSettings?.mercadoPagoAccessToken || '',
                        mercadoPagoPublicKey: profile.paymentSettings?.mercadoPagoPublicKey || '',
                        payPalClientId: profile.paymentSettings?.payPalClientId || '',
                        payPalMode: profile.paymentSettings?.payPalMode || 'live',
                        customPaymentLinks: profile.paymentSettings?.customPaymentLinks || [],
                        payPalClientSecret: e.target.value
                      }
                    })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ULTRAMSG WHATSAPP SERVICE */}
      {activeTab === 'whatsapp' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Servicio de Notificaciones de WhatsApp (UltraMsg API)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Envía automáticamente comprobantes y enlaces de descarga a WhatsApp al confirmar el pago.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Número de WhatsApp de la creadora:</label>
            <input
              id="creator-whatsapp-number-input"
              type="tel"
              placeholder="+5491155443322"
              value={profile.whatsappNumber}
              onChange={(e) => setProfile({ ...profile, whatsappNumber: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
            />
          </div>

          {/* Test WhatsApp Message Tool */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-emerald-300">Prueba de Envío de Mensaje WhatsApp</h4>
            <div className="flex gap-2">
              <input
                id="test-phone-input"
                type="tel"
                placeholder="Número destino (+549...)"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
              />
              <button
                id="send-test-whatsapp-button"
                onClick={handleSendWaTest}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Probador
              </button>
            </div>

            {waTestResponse && (
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-emerald-300 overflow-x-auto">
                {waTestResponse}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: LINKS & PROFILE BRANDING */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-xl font-bold text-white">Información de Perfil & Enlaces Estilo Link.me</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nombre Público:</label>
                <input
                  id="creator-name-input"
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Handle / Usuario:</label>
                <input
                  id="creator-handle-input"
                  type="text"
                  value={profile.handle}
                  onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">URL de Foto de Perfil:</label>
                <input
                  id="creator-avatar-input"
                  type="text"
                  value={profile.avatar}
                  onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">URL de Portada Banner:</label>
                <input
                  id="creator-banner-input"
                  type="text"
                  value={profile.banner}
                  onChange={(e) => setProfile({ ...profile, banner: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Biografía / Presentación:</label>
              <textarea
                id="creator-bio-input"
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
              />
            </div>

            {/* Custom Links Management */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <h4 className="font-bold text-sm text-pink-300">Añadir Enlace Personalizado</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  id="new-link-title-input"
                  type="text"
                  placeholder="Título (ej. Telegram VIP)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                />
                <input
                  id="new-link-url-input"
                  type="text"
                  placeholder="URL Destino"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                />
                <button
                  id="add-custom-link-button"
                  onClick={handleAddLink}
                  className="py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Añadir Enlace
                </button>
              </div>

              {/* List of Custom Links */}
              <div className="space-y-2 pt-2">
                {profile.links.map((link) => (
                  <div key={link.id} className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={link.active}
                        onChange={() => handleToggleLinkActive(link.id)}
                        className="w-4 h-4 rounded text-purple-600 bg-slate-900 border-slate-700 cursor-pointer"
                      />
                      <span className={`text-sm font-semibold ${link.active ? 'text-white' : 'text-slate-500 line-through'}`}>
                        {link.title}
                      </span>
                      <span className="text-xs text-slate-400 truncate max-w-xs">({link.url})</span>
                    </div>

                    <button
                      id={`delete-link-${link.id}`}
                      onClick={() => handleDeleteLink(link.id)}
                      className="text-red-400 p-1 hover:bg-slate-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SALES & DOWNLOADS HISTORY */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Historial de Ventas Verificadas</h3>
              <button
                id="refresh-sales-history-button"
                onClick={loadPurchases}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Actualizar
              </button>
            </div>

            {purchasesHistory.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aún no hay compras registradas para esta modelo.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 uppercase">
                    <tr>
                      <th className="p-3 rounded-l-xl">Fecha</th>
                      <th className="p-3">Contenido</th>
                      <th className="p-3">Comprador (WhatsApp/Email)</th>
                      <th className="p-3">Método</th>
                      <th className="p-3">Monto</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3 rounded-r-xl">Descargas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {purchasesHistory.map((p) => (
                      <tr key={p.id}>
                        <td className="p-3 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-semibold text-white">{p.mediaTitle}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{p.buyerPhone || 'Sin teléfono'}</div>
                          <div className="text-slate-400 text-[10px]">{p.buyerEmail}</div>
                          {p.ipAddress && (
                            <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-700/50 px-1.5 py-0.5 rounded">
                                🌐 {p.ipAddress}
                              </span>
                              <button
                                onClick={() => handleBlockIp(p.ipAddress)}
                                title={`Bloquear IP ${p.ipAddress} permanentemente`}
                                className="px-2 py-0.5 bg-red-950 hover:bg-red-800 text-red-200 border border-red-500/50 rounded text-[10px] font-bold transition-all cursor-pointer shadow flex items-center gap-1"
                              >
                                🚫 Bloquear IP
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-3 uppercase font-mono text-purple-300">{p.paymentMethod}</td>
                        <td className="p-3 font-bold text-emerald-400">${p.amount} {p.currency}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                              {p.status}
                            </span>
                            {p.status !== 'completed' && (
                              <button
                                onClick={() => handleApprovePurchase(p.token || p.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold shadow-md transition-all cursor-pointer flex items-center gap-1 shrink-0"
                              >
                                <CheckCircle className="w-3 h-3" /> Aprobar Manual
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono">
                          {p.downloadCount >= 1 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-950/80 border border-red-500/50 text-red-300 rounded text-[11px] font-bold">
                              {p.downloadCount} / 1 descarga (Límite)
                            </span>
                          ) : (
                            <span className="text-purple-300 text-xs">
                              {p.downloadCount} descargas
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: PROSPECTOS / LEADS CAPTURADOS */}
      {activeTab === 'leads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-400" />
                <span>Registro de Visitantes (Leads WhatsApp / Telegram)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Lista de usuarios que han ingresado su contacto al visitar tu sitio web.</p>
            </div>
            <button
              onClick={loadVisitorLeads}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Recargar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Fecha / Hora</th>
                  <th className="p-3">Contacto (WhatsApp / Telegram)</th>
                  <th className="p-3">País por Indicativo (+57)</th>
                  <th className="p-3">País por IP Origen</th>
                  <th className="p-3">Estado VPN</th>
                  <th className="p-3 rounded-r-xl">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(visitorLeads || []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No hay registros de visitantes aún.
                    </td>
                  </tr>
                ) : (
                  visitorLeads.map((lead) => {
                    const contactStr = (lead.contactInfo || (lead as any).contact_info || '').trim();
                    
                    // Helper phone country prefix mapping
                    const cleanPhone = contactStr.replace(/[^0-9+]/g, '');
                    let phoneCountry = { code: 'GLOBAL', name: 'Internacional', flag: '🌐' };
                    if (cleanPhone.startsWith('+57') || cleanPhone.startsWith('57') || (cleanPhone.length >= 10 && cleanPhone.startsWith('3'))) {
                      phoneCountry = { code: 'CO', name: 'Colombia (+57)', flag: '🇨🇴' };
                    } else if (cleanPhone.startsWith('+1') || cleanPhone.startsWith('1')) {
                      phoneCountry = { code: 'US', name: 'EE.UU. / Canadá (+1)', flag: '🇺🇸' };
                    } else if (cleanPhone.startsWith('+34') || cleanPhone.startsWith('34')) {
                      phoneCountry = { code: 'ES', name: 'España (+34)', flag: '🇪🇸' };
                    } else if (cleanPhone.startsWith('+52') || cleanPhone.startsWith('52')) {
                      phoneCountry = { code: 'MX', name: 'México (+52)', flag: '🇲🇽' };
                    } else if (cleanPhone.startsWith('+507') || cleanPhone.startsWith('507')) {
                      phoneCountry = { code: 'PA', name: 'Panamá (+507)', flag: '🇵🇦' };
                    } else if (cleanPhone.startsWith('+54') || cleanPhone.startsWith('54')) {
                      phoneCountry = { code: 'AR', name: 'Argentina (+54)', flag: '🇦🇷' };
                    } else if (cleanPhone.startsWith('+56') || cleanPhone.startsWith('56')) {
                      phoneCountry = { code: 'CL', name: 'Chile (+56)', flag: '🇨🇱' };
                    } else if (cleanPhone.startsWith('+51') || cleanPhone.startsWith('51')) {
                      phoneCountry = { code: 'PE', name: 'Perú (+51)', flag: '🇵🇪' };
                    } else if (cleanPhone.startsWith('+593') || cleanPhone.startsWith('593')) {
                      phoneCountry = { code: 'EC', name: 'Ecuador (+593)', flag: '🇪🇨' };
                    } else if (cleanPhone.startsWith('+58') || cleanPhone.startsWith('58')) {
                      phoneCountry = { code: 'VE', name: 'Venezuela (+58)', flag: '🇻🇪' };
                    }

                    const ipCountry = lead.countryCode || 'DESCONOCIDO';
                    const isMismatchedVpn = phoneCountry.code === 'CO' && ipCountry !== 'CO' && ipCountry !== 'DESCONOCIDO';

                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-medium text-slate-300">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : 'Reciente'}
                        </td>
                        <td className="p-3 font-bold text-amber-300 text-sm">
                          {contactStr || 'No especificado'}
                        </td>
                        <td className="p-3 text-slate-300 font-semibold">
                          {phoneCountry.flag} {phoneCountry.name}
                        </td>
                        <td className="p-3 text-slate-400 font-mono">
                          {lead.countryCode ? `🌐 ${lead.countryCode}` : '🌐 Global'} ({lead.ipAddress || 'Protegida'})
                        </td>
                        <td className="p-3">
                          {isMismatchedVpn ? (
                            <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-red-500/20 text-red-400 border border-red-500/40">
                              ⚠️ POSIBLE VPN (Tel +57 vs IP {ipCountry})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              🟢 Normal
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <a
                            href={contactStr.startsWith('@') ? `https://t.me/${contactStr.replace('@', '')}` : `https://wa.me/${contactStr.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold border border-emerald-500/40 inline-flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Contactar
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
