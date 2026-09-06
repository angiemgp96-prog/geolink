export type SupportedLanguage = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it';

export interface Translations {
  vipBadge: string;
  modalTitle: string;
  modalDesc: string;
  modePhone: string;
  modeTelegram: string;
  selectCountryLabel: string;
  digitsRequired: string;
  telegramPlaceholder: string;
  telegramHint: string;
  continueBtn: string;
  encryptedNotice: string;

  // Telegram Buttons
  telegramDirectContact: string;
  telegramHotGroup: string;

  // Store & Profile
  fullAccessTitle: string;
  fullAccessDesc: string;
  fullAccessBtn: string;
  storeSectionTitle: string;
  storeSectionSub: string;
  filterAll: string;
  filterVideos: string;
  filterPhotos: string;
  filterPacks: string;

  // Media Card
  purchasedBadge: string;
  extraPremiumBadge: string;
  unlockNowBtn: string;
  downloadNowBtn: string;
  downloadedLimit: string;
  durationLabel: string;
  fileSizeLabel: string;
  purchasesCountLabel: string;
  viewTelegramBtn: string;
  unlockBtn: string;
  unlockedBadge: string;
  newBadge: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  es: {
    vipBadge: 'Perfil Exclusivo VIP',
    modalTitle: 'Acceso al Contenido Privado',
    modalDesc: 'Por favor ingresa tu número de WhatsApp o usuario de Telegram para identificarte y acceder a las fotos y videos.',
    modePhone: 'WhatsApp / Teléfono',
    modeTelegram: '✈️ Telegram (@usuario)',
    selectCountryLabel: 'Selecciona tu País y Número Móvil:',
    digitsRequired: 'Exige',
    telegramPlaceholder: '@miusuario',
    telegramHint: 'Ingresa tu usuario de Telegram con la @ (Mínimo 5 caracteres).',
    continueBtn: 'Continuar al Perfil VIP ⚡',
    encryptedNotice: 'Acceso Privado Encriptado · Privacidad Garantizada',

    telegramDirectContact: 'CONTACTO DIRECTO TELEGRAM VIP',
    telegramHotGroup: 'GRUPO HOT TELEGRAM',

    fullAccessTitle: '👑 DESBLOQUEAR TODO EL CATÁLOGO',
    fullAccessDesc: 'Acceso instantáneo a fotos y videos sin censura (NO INCLUYE CONTENIDOS EXTRA PREMIUM)',
    fullAccessBtn: 'Desbloquear Todo por',
    storeSectionTitle: 'Tienda Exclusiva',
    storeSectionSub: 'Fotos & Videos Desbloqueables',
    filterAll: 'Todos',
    filterVideos: 'Videos',
    filterPhotos: 'Fotos',
    filterPacks: 'Packs',

    purchasedBadge: 'Adquirido',
    extraPremiumBadge: 'EXTRA PREMIUM',
    unlockNowBtn: '🔓 Desbloquear Ahora',
    downloadNowBtn: '⬇️ Descargar Ahora',
    downloadedLimit: '🔒 Descargado (Límite 1/1)',
    durationLabel: 'Duración',
    fileSizeLabel: 'Peso',
    purchasesCountLabel: 'Compras',
    viewTelegramBtn: 'Ver en Telegram 🚀',
    unlockBtn: 'Desbloquear',
    unlockedBadge: '¡DESBLOQUEADO!',
    newBadge: '¡NUEVO!',
  },
  en: {
    vipBadge: 'Exclusive VIP Profile',
    modalTitle: 'Private Content Access',
    modalDesc: 'Please enter your WhatsApp phone number or Telegram handle to verify identity and access exclusive media.',
    modePhone: 'WhatsApp / Phone',
    modeTelegram: '✈️ Telegram (@user)',
    selectCountryLabel: 'Select Your Country & Mobile Number:',
    digitsRequired: 'Requires',
    telegramPlaceholder: '@myusername',
    telegramHint: 'Enter your Telegram handle with @ (Minimum 5 characters).',
    continueBtn: 'Continue to VIP Profile ⚡',
    encryptedNotice: 'Encrypted Private Access · Guaranteed Privacy',

    telegramDirectContact: 'VIP TELEGRAM DIRECT CONTACT',
    telegramHotGroup: 'HOT TELEGRAM GROUP',

    fullAccessTitle: '👑 UNLOCK ENTIRE CATALOG',
    fullAccessDesc: 'Instant access to uncensored photos and videos (DOES NOT INCLUDE EXTRA PREMIUM CONTENT)',
    fullAccessBtn: 'Unlock Everything for',
    storeSectionTitle: 'Exclusive Store',
    storeSectionSub: 'Unlockable Photos & Videos',
    filterAll: 'All',
    filterVideos: 'Videos',
    filterPhotos: 'Photos',
    filterPacks: 'Bundles',

    purchasedBadge: 'Unlocked',
    extraPremiumBadge: 'EXTRA PREMIUM',
    unlockNowBtn: '🔓 Unlock Now',
    downloadNowBtn: '⬇️ Download Now',
    downloadedLimit: '🔒 Downloaded (Limit 1/1)',
    durationLabel: 'Duration',
    fileSizeLabel: 'Size',
    purchasesCountLabel: 'Sales',
    viewTelegramBtn: 'View in Telegram 🚀',
    unlockBtn: 'Unlock',
    unlockedBadge: 'UNLOCKED!',
    newBadge: 'NEW!',
  },
  pt: {
    vipBadge: 'Perfil VIP Exclusivo',
    modalTitle: 'Acesso ao Conteúdo Privado',
    modalDesc: 'Por favor, insira seu número de WhatsApp ou usuário do Telegram para acessar as fotos e vídeos.',
    modePhone: 'WhatsApp / Telefone',
    modeTelegram: '✈️ Telegram (@usuario)',
    selectCountryLabel: 'Selecione seu País e Número Celular:',
    digitsRequired: 'Requer',
    telegramPlaceholder: '@meuusuario',
    telegramHint: 'Insira seu usuário do Telegram com @ (Mínimo 5 caracteres).',
    continueBtn: 'Continuar para o Perfil VIP ⚡',
    encryptedNotice: 'Acesso Privado Criptografado · Privacidade Garantida',

    telegramDirectContact: 'CONTATO DIRETO TELEGRAM VIP',
    telegramHotGroup: 'GRUPO HOT TELEGRAM',

    fullAccessTitle: '👑 DESBLOQUEAR TODO O CATÁLOGO',
    fullAccessDesc: 'Acesso instantâneo a fotos e vídeos sem censura (NÃO INCLUI CONTEÚDOS EXTRA PREMIUM)',
    fullAccessBtn: 'Desbloquear Tudo por',
    storeSectionTitle: 'Loja Exclusiva',
    storeSectionSub: 'Fotos e Vídeos Desbloqueáveis',
    filterAll: 'Todos',
    filterVideos: 'Vídeos',
    filterPhotos: 'Fotos',
    filterPacks: 'Packs',

    purchasedBadge: 'Adquirido',
    extraPremiumBadge: 'EXTRA PREMIUM',
    unlockNowBtn: '🔓 Desbloquear Agora',
    downloadNowBtn: '⬇️ Baixar Agora',
    downloadedLimit: '🔒 Baixado (Limite 1/1)',
    durationLabel: 'Duração',
    fileSizeLabel: 'Tamanho',
    purchasesCountLabel: 'Vendas',
    viewTelegramBtn: 'Ver no Telegram 🚀',
    unlockBtn: 'Desbloquear',
    unlockedBadge: 'DESBLOQUEADO!',
    newBadge: 'NOVO!',
  },
  fr: {
    vipBadge: 'Profil VIP Exclusif',
    modalTitle: 'Accès au Contenu Privé',
    modalDesc: 'Veuillez entrer votre numéro WhatsApp ou votre identifiant Telegram pour accéder aux médias.',
    modePhone: 'WhatsApp / Téléphone',
    modeTelegram: '✈️ Telegram (@utilisateur)',
    selectCountryLabel: 'Sélectionnez votre Pays et Numéro Mobile:',
    digitsRequired: 'Exige',
    telegramPlaceholder: '@monnom',
    telegramHint: 'Entrez votre nom Telegram avec @ (Minimum 5 caractères).',
    continueBtn: 'Continuer vers le Profil VIP ⚡',
    encryptedNotice: 'Accès Privé Chiffré · Confidentialité Garantie',

    telegramDirectContact: 'CONTACT DIRECT TELEGRAM VIP',
    telegramHotGroup: 'GROUPE HOT TELEGRAM',

    fullAccessTitle: '👑 DÉBLOQUER TOUT LE CATALOGUE',
    fullAccessDesc: 'Accès instantané aux photos et vidéos non censurées (N\'INCLUT PAS LES CONTENUS EXTRA PREMIUM)',
    fullAccessBtn: 'Tout Débloquer pour',
    storeSectionTitle: 'Boutique Exclusive',
    storeSectionSub: 'Photos & Vidéos Déblocables',
    filterAll: 'Tous',
    filterVideos: 'Vidéos',
    filterPhotos: 'Photos',
    filterPacks: 'Packs',

    purchasedBadge: 'Acquis',
    extraPremiumBadge: 'EXTRA PREMIUM',
    unlockNowBtn: '🔓 Débloquer Maintenant',
    downloadNowBtn: '⬇️ Télécharger Maintenant',
    downloadedLimit: '🔒 Téléchargé (Limite 1/1)',
    durationLabel: 'Durée',
    fileSizeLabel: 'Taille',
    purchasesCountLabel: 'Ventes',
    viewTelegramBtn: 'Voir sur Telegram 🚀',
    unlockBtn: 'Débloquer',
    unlockedBadge: 'DÉBLOQUÉ!',
    newBadge: 'NOUVEAU!',
  },
  de: {
    vipBadge: 'Exklusives VIP-Profil',
    modalTitle: 'Zugang zu Privaten Inhalten',
    modalDesc: 'Bitte geben Sie Ihre WhatsApp-Nummer oder Ihren Telegram-Benutzernamen ein.',
    modePhone: 'WhatsApp / Telefon',
    modeTelegram: '✈️ Telegram (@benutzer)',
    selectCountryLabel: 'Wählen Sie Ihr Land & Mobilnummer:',
    digitsRequired: 'Erfordert',
    telegramPlaceholder: '@meinname',
    telegramHint: 'Geben Sie Ihren Telegram-Namen mit @ ein (Mindestens 5 Zeichen).',
    continueBtn: 'Weiter zum VIP-Profil ⚡',
    encryptedNotice: 'Verschlüsselter Privater Zugang · Garantie',

    telegramDirectContact: 'VIP TELEGRAM DIREKTKONTAKT',
    telegramHotGroup: 'HOT TELEGRAM GRUPPE',

    fullAccessTitle: '👑 GESAMTEN KATALOG FREISCHALTEN',
    fullAccessDesc: 'Sofortiger Zugriff auf unzensierte Fotos und Videos (ENTHÄLT KEINE EXTRA PREMIUM INHALTE)',
    fullAccessBtn: 'Alles Freischalten für',
    storeSectionTitle: 'Exklusiver Shop',
    storeSectionSub: 'Freischaltbare Fotos & Videos',
    filterAll: 'Alle',
    filterVideos: 'Videos',
    filterPhotos: 'Fotos',
    filterPacks: 'Pakete',

    purchasedBadge: 'Freigeschaltet',
    extraPremiumBadge: 'EXTRA PREMIUM',
    unlockNowBtn: '🔓 Jetzt Freischalten',
    downloadNowBtn: '⬇️ Jetzt Herunterladen',
    downloadedLimit: '🔒 Heruntergeladen (Limit 1/1)',
    durationLabel: 'Dauer',
    fileSizeLabel: 'Größe',
    purchasesCountLabel: 'Käufe',
    viewTelegramBtn: 'Auf Telegram ansehen 🚀',
    unlockBtn: 'Freischalten',
    unlockedBadge: 'FREIGESCHALTET!',
    newBadge: 'NEU!',
  },
  it: {
    vipBadge: 'Profilo VIP Esclusivo',
    modalTitle: 'Accesso ai Contenuti Privati',
    modalDesc: 'Inserisci il tuo numero WhatsApp o nome utente Telegram per accedere alle foto e ai video.',
    modePhone: 'WhatsApp / Telefono',
    modeTelegram: '✈️ Telegram (@utente)',
    selectCountryLabel: 'Seleziona il tuo Paese e Numero di Cellulare:',
    digitsRequired: 'Richiede',
    telegramPlaceholder: '@mioutente',
    telegramHint: 'Inserisci il tuo utente Telegram con @ (Minimo 5 caratteri).',
    continueBtn: 'Continua al Profilo VIP ⚡',
    encryptedNotice: 'Accesso Privato Crittografato · Privacy Garantita',

    telegramDirectContact: 'CONTATTO DIRETTO TELEGRAM VIP',
    telegramHotGroup: 'GRUPPO HOT TELEGRAM',

    fullAccessTitle: '👑 SBLOCCA L\'INTERO CATALOGO',
    fullAccessDesc: 'Accesso istantaneo a foto e video senza censura (NON INCLUDE CONTENUTI EXTRA PREMIUM)',
    fullAccessBtn: 'Sblocca Tutto per',
    storeSectionTitle: 'Negozio Esclusivo',
    storeSectionSub: 'Foto & Video Sbloccabili',
    filterAll: 'Tutti',
    filterVideos: 'Video',
    filterPhotos: 'Foto',
    filterPacks: 'Pacchetti',

    purchasedBadge: 'Acquistato',
    extraPremiumBadge: 'EXTRA PREMIUM',
    unlockNowBtn: '🔓 Sblocca Ora',
    downloadNowBtn: '⬇️ Scarica Ora',
    downloadedLimit: '🔒 Scaricato (Limite 1/1)',
    durationLabel: 'Durata',
    fileSizeLabel: 'Dimensione',
    purchasesCountLabel: 'Vendite',
    viewTelegramBtn: 'Vedi su Telegram 🚀',
    unlockBtn: 'Sblocca',
    unlockedBadge: 'SBLOCCATO!',
    newBadge: 'NUOVO!',
  }
};

export function detectLanguage(countryCode?: string): SupportedLanguage {
  if (!countryCode) {
    const browserLang = (typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'es').toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    if (browserLang.startsWith('pt')) return 'pt';
    if (browserLang.startsWith('fr')) return 'fr';
    if (browserLang.startsWith('de')) return 'de';
    if (browserLang.startsWith('it')) return 'it';
    return 'es';
  }

  const code = countryCode.toUpperCase();

  // Spanish speaking countries
  if (['CO', 'ES', 'MX', 'PA', 'AR', 'CL', 'PE', 'EC', 'VE', 'UY', 'PY', 'BO', 'CR', 'DO', 'GT', 'HN', 'SV', 'NI', 'PR', 'CU'].includes(code)) {
    return 'es';
  }
  // English speaking countries
  if (['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA', 'SG', 'JM', 'TT'].includes(code)) {
    return 'en';
  }
  // Portuguese speaking countries
  if (['BR', 'PT'].includes(code)) {
    return 'pt';
  }
  // French speaking countries
  if (['FR', 'BE', 'LU', 'HT', 'MA'].includes(code)) {
    return 'fr';
  }
  // German speaking countries
  if (['DE', 'AT', 'CH'].includes(code)) {
    return 'de';
  }
  // Italian
  if (['IT'].includes(code)) {
    return 'it';
  }

  return 'en'; // Default international to English
}
