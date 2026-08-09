import { CreatorProfile, MediaItem } from '../types';

export const INITIAL_CREATORS: CreatorProfile[] = [
  {
    id: 'creator_1',
    handle: 'angelina69',
    name: 'Angelina69 🔥',
    title: 'Model & Digital Creator',
    bio: 'Bienvenido a mi espacio exclusivo 💋 Contenido diario, fotos HD y videos 4K sin censura.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'from-pink-600 via-purple-600 to-indigo-700',
    badge: 'TOP 0.1% CREATOR',
    blockedCountries: ['ES'], // Blocks Spain by default for demonstration
    blockedMessage: '⛔ Contenido no disponible en tu ubicación geográfica por privacidad de la creadora.',
    whatsappNumber: '+5491155443322',
    createdAt: new Date().toISOString(),
    links: [
      { id: 'l0', title: 'OnlyFans Oficial 🔥 (@angelinax69)', url: 'https://onlyfans.com/angelinax69', icon: 'OnlyFans', active: true, clicks: 4920 },
      { id: 'l1', title: 'Instagram Oficial 📸 (@angiemgp69)', url: 'https://instagram.com/angiemgp69', icon: 'Instagram', active: true, clicks: 3410 },
      { id: 'l2', title: 'Link.me Oficial 🔗', url: 'https://link.me/angelina69', icon: 'Globe', active: true, clicks: 1850 },
      { id: 'l3', title: 'Telegram VIP Gratis 💬', url: 'https://t.me/example_channel', icon: 'Telegram', active: true, clicks: 1240 },
      { id: 'l4', title: 'TikTok Oficial 🎵', url: 'https://tiktok.com', icon: 'TikTok', active: true, clicks: 2150 },
    ],
    paymentSettings: {
      mercadoPagoAccessToken: 'APP_USR-7257482411293311-080712-ada9bb187061cb3d57c277c19d3916bc-3553496952',
      mercadoPagoPublicKey: '',
      payPalClientId: 'BAA8Frtu5JFlsHO30PzjEf0J23mdxSEfhSCZbeZrGfcskv7jBXDkYQR5U4Tv3sUApF5z64ONWtUdGfwf44',
      payPalClientSecret: 'EBQBiVbmbih6qKanhmwkI0RwbiHWKolXovHRMu2DSGcigFTkwHS5J5AafOqMMXJO46goCK2sWZjQNFDw',
      payPalMode: 'live',
      customPaymentLinks: [
        { id: 'c2', name: 'Payoneer Direct', url: 'https://payoneer.com/angelina69', currency: 'USD' }
      ]
    }
  },
  {
    id: 'creator_2',
    handle: 'sofia_creator',
    name: 'Sofia Fitness & Glam 🖤',
    title: 'Fitness Model & Lifestyle',
    bio: 'Rutinas exclusivas, backstage de sesiones fotográficas y contenido no publicado en redes.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    banner: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    themeColor: 'from-amber-500 via-rose-600 to-red-700',
    badge: 'FITNESS VIP',
    blockedCountries: ['AR'], // Blocks Argentina by default
    blockedMessage: '⚠️ Este perfil no está disponible en Argentina según las preferencias del usuario.',
    whatsappNumber: '+573009988776',
    createdAt: new Date().toISOString(),
    links: [
      { id: 'l5', title: 'Plan de Entrenamiento PDF 🏋️‍♀️', url: 'https://example.com/fit', icon: 'Dumbbell', active: true, clicks: 620 },
      { id: 'l6', title: 'Instagram Personal 🌟', url: 'https://instagram.com', icon: 'Instagram', active: true, clicks: 1890 },
    ],
    paymentSettings: {
      mercadoPagoAccessToken: '',
      mercadoPagoPublicKey: '',
      payPalClientId: 'sb-sofia-paypal',
      payPalClientSecret: 'sb-secret',
      payPalMode: 'sandbox',
      customPaymentLinks: []
    }
  }
];

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media_101',
    creatorId: 'creator_1',
    creatorHandle: 'angelina69',
    title: '🔥 Video Exclusivo Beach Session 4K (Full Uncut)',
    description: 'Video completo de 15 minutos grabado en alta definición 4K en la playa sin censura. Incluye descarga directa inmediata.',
    type: 'video',
    price: 15.00,
    currency: 'USD',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fileSize: '1.2 GB',
    duration: '15:20 min',
    purchasesCount: 84,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'media_102',
    creatorId: 'creator_1',
    creatorHandle: 'angelina69',
    title: '📸 Set de Fotos Boudoir Lingerie (35 Fotos HD)',
    description: 'Colección de 35 fotografías exclusivas en resolución ultra alta 8K. Desbloquea el paquete completo en ZIP.',
    type: 'photo',
    price: 9.99,
    currency: 'USD',
    previewUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1920&q=90',
    fileSize: '180 MB',
    itemCount: 35,
    purchasesCount: 142,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'media_103',
    creatorId: 'creator_1',
    creatorHandle: 'angelina69',
    title: '🎥 Backstage VIP Private Shoot + Chat Exclusivo',
    description: 'Detrás de escena inédito de la sesión privada + acceso directo a chat de WhatsApp de la creadora.',
    type: 'bundle',
    price: 24.99,
    currency: 'USD',
    previewUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    fileSize: '2.4 GB',
    duration: '22:10 min',
    itemCount: 2,
    purchasesCount: 57,
    createdAt: new Date().toISOString()
  },
  {
    id: 'media_201',
    creatorId: 'creator_2',
    creatorHandle: 'sofia_creator',
    title: '⚡ Workout Routine Video & Photobook High Res',
    description: 'Video guiado de 30 minutos + libro digital interactivo con ejercicios de tonificación.',
    type: 'video',
    price: 12.50,
    currency: 'USD',
    previewUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    fileSize: '850 MB',
    duration: '28:45 min',
    purchasesCount: 39,
    createdAt: new Date().toISOString()
  }
];
