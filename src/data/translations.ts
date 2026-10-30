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

  // Telegram & International Hero Buttons
  telegramDirectContact: string;
  telegramHotGroup: string;
  telegramVipGroup: string;
  vipGroupPassBtn: string;
  vipGroupPassSub: string;
  onlyfansBadge: string;
  onlyfansTitle: string;
  onlyfansSub: string;
  onlyfansCta: string;
  hotChatBadge: string;
  hotChatTitle: string;
  hotChatSub: string;

  // Store & Profile
  fullAccessTitle: string;
  fullAccessDesc: string;
  fullAccessBtn: string;
  storeSectionTitle: string;
  storeSectionSub: string;
  storeSectionTitleInt: string;
  storeSectionSubInt: string;
  filterAll: string;
  filterVideos: string;
  filterPhotos: string;
  filterPacks: string;
  howToBuyTitle: string;
  howToBuyStep1: string;
  howToBuyStep2: string;

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
  buyBtn: string;
  uncensoredTag: string;
  cardPrivateChatNote: string;
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
    telegramVipGroup: 'GRUPO VIP TELEGRAM',
    vipGroupPassBtn: '👑 Grupo VIP Secreto Sin Censura — $50 USD',
    vipGroupPassSub: '♾️ Pago único permanente (no vence) · 🔥 Subo contenido explícito nuevo 100% GRATIS cada vez que alguien nuevo se une',
    onlyfansBadge: '🟢 EN LÍNEA AHORA · ACCESO GRATIS INCLUIDO',
    onlyfansTitle: 'Angie Ly · Mi Nuevo OnlyFans & Chat Exclusivo',
    onlyfansSub: 'Todo lo explícito que jamás puedo subir a redes está aquí… Entra GRATIS ahora y chatea conmigo 1 a 1 en privado, te respondo yo misma solita 💙💋',
    onlyfansCta: 'Entrar Gratis a OnlyFans & Chatear Conmigo',
    hotChatBadge: '🔥 ATENCIÓN 1 A 1 EN PRIVADO · SOY YO MISMA',
    hotChatTitle: '💋 Chatea Conmigo · Chat Caliente & Conóceme — $10 USD',
    hotChatSub: '😈 ¿Quieres tenerme solo para ti? Cuéntame al oído qué te calienta y conóceme sin filtros en privado… Pago 100% discreto ➔ Al volver te espero solita en mi Telegram 💋',

    fullAccessTitle: '👑 DESBLOQUEAR TODO EL CATÁLOGO',
    fullAccessDesc: 'Acceso instantáneo a fotos y videos sin censura (NO INCLUYE CONTENIDOS EXTRA PREMIUM)',
    fullAccessBtn: 'Desbloquear Todo por',
    storeSectionTitle: 'Tienda Exclusiva',
    storeSectionSub: 'Fotos & Videos Desbloqueables',
    storeSectionTitleInt: '🔥 Mi Archivo Íntimo Sin Censura',
    storeSectionSubInt: 'Videos explícitos que no muestro en ningún otro lado · Cada compra incluye mi chat privado 1 a 1 💋',
    filterAll: 'Todos',
    filterVideos: 'Videos',
    filterPhotos: 'Fotos',
    filterPacks: 'Packs',
    howToBuyTitle: '💋 ¿Cómo comprar? 100% Discreto + Mi Chat Privado Incluido:',
    howToBuyStep1: '🔒 1. Toca "Comprar": Irás a Pago Seguro (100% confidencial y discreto en tu estado de cuenta).',
    howToBuyStep2: '💬 2. Hablamos tú y yo en Telegram: Una vez realizado el pago, nos vemos en mi chat privado de Telegram — allí te paso personalmente el contenido sin censura y nos quedamos chateando en privado para conocernos 🔥💋',

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
    buyBtn: 'Comprar',
    uncensoredTag: '🔞 Sin Censura',
    cardPrivateChatNote: '💋 Te lo paso yo misma en Telegram + incluye chatear conmigo en privado y conocernos',
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
    telegramVipGroup: 'TELEGRAM VIP GROUP',
    vipGroupPassBtn: '👑 Secret Uncensored VIP Group — $50 USD',
    vipGroupPassSub: '♾️ One-time lifetime access (never expires) · 🔥 Brand-new explicit content uploaded 100% FREE every time someone joins',
    onlyfansBadge: '🟢 ONLINE NOW · FREE ACCESS INCLUDED',
    onlyfansTitle: 'Angie Ly · My New OnlyFans & Exclusive Chat',
    onlyfansSub: 'Everything too explicit for social media is waiting inside… Enter FREE right now & chat 1-on-1 with me privately — it\'s really me replying 💙💋',
    onlyfansCta: 'Enter My OnlyFans Free & Chat With Me',
    hotChatBadge: '🔥 1-ON-1 PRIVATE ATTENTION · IT\'S REALLY ME',
    hotChatTitle: '💋 Chat With Me · Hot Private Chat & Get to Know Me — $10 USD',
    hotChatSub: '😈 Want me all to yourself? Tell me your fantasies & get to know me unfiltered in private… 100% discreet payment ➔ Return here to meet me in my personal Telegram 💋',

    fullAccessTitle: '👑 UNLOCK ENTIRE CATALOG',
    fullAccessDesc: 'Instant access to uncensored photos and videos (DOES NOT INCLUDE EXTRA PREMIUM CONTENT)',
    fullAccessBtn: 'Unlock Everything for',
    storeSectionTitle: 'Exclusive Store',
    storeSectionSub: 'Unlockable Photos & Videos',
    storeSectionTitleInt: '🔥 My Private Uncensored Vault',
    storeSectionSubInt: 'Explicit videos & intimate sets you won\'t see anywhere else · Every purchase includes private 1-on-1 chat with me 💋',
    filterAll: 'All',
    filterVideos: 'Videos',
    filterPhotos: 'Photos',
    filterPacks: 'Bundles',
    howToBuyTitle: '💋 How to Buy? 100% Discreet + My Private Chat Included:',
    howToBuyStep1: '🔒 1. Tap "Buy Now": Redirects to Secure Checkout (100% discreet billing on your statement).',
    howToBuyStep2: '💬 2. Private Chat on Telegram: Right after payment, we talk 1-on-1 on Telegram — I personally send you your uncensored content there + includes chatting privately with me to get to know each other 🔥💋',

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
    buyBtn: 'Buy Now',
    uncensoredTag: '🔞 Uncensored',
    cardPrivateChatNote: '💋 Sent personally by me on Telegram + includes private 1-on-1 chat to get to know me',
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
    telegramVipGroup: 'GRUPO VIP TELEGRAM',
    vipGroupPassBtn: '👑 Grupo VIP Secreto Sem Censura — $50 USD',
    vipGroupPassSub: '♾️ Pagamento único vitalício (não expira) · 🔥 Novo conteúdo explícito 100% GRÁTIS a cada novo membro',
    onlyfansBadge: '🟢 ONLINE AGORA · ACESSO GRÁTIS INCLUÍDO',
    onlyfansTitle: 'Angie Ly · Meu Novo OnlyFans & Chat Exclusivo',
    onlyfansSub: 'Tudo o que é explícito demais para as redes está aqui… Entre GRÁTIS agora e fale comigo a sós no privado — sou eu mesma respondendo 💙💋',
    onlyfansCta: 'Entrar Grátis no OnlyFans & Conversar Comigo',
    hotChatBadge: '🔥 ATENÇÃO 1 A 1 NO PRIVADO · SOU EU MESMA',
    hotChatTitle: '💋 Converse Comigo · Chat Quente & Me Conheça — $10 USD',
    hotChatSub: '😈 Quer minha atenção só para você? Me conte seus desejos sem filtros no privado… Pagamento 100% discreto ➔ Ao voltar te espero no meu Telegram pessoal 💋',

    fullAccessTitle: '👑 DESBLOQUEAR TODO O CATÁLOGO',
    fullAccessDesc: 'Acesso instantâneo a fotos e vídeos sem censura (NÃO INCLUI CONTEÚDOS EXTRA PREMIUM)',
    fullAccessBtn: 'Desbloquear Tudo por',
    storeSectionTitle: 'Loja Exclusiva',
    storeSectionSub: 'Fotos e Vídeos Desbloqueáveis',
    storeSectionTitleInt: '🔥 Meu Arquivo Íntimo Sem Censura',
    storeSectionSubInt: 'Vídeos explícitos que não mostro em nenhum outro lugar · Cada compra inclui meu chat privado 1 a 1 💋',
    filterAll: 'Todos',
    filterVideos: 'Vídeos',
    filterPhotos: 'Fotos',
    filterPacks: 'Packs',
    howToBuyTitle: '💋 Como comprar? 100% Discreto + Meu Chat Privado Incluído:',
    howToBuyStep1: '🔒 1. Toque em "Comprar": Você irá ao Pagamento Seguro e 100% discreto.',
    howToBuyStep2: '💬 2. Conversamos no Telegram: Assim que pagar, falamos no meu chat privado do Telegram — lá eu mesma te envio o conteúdo sem censura + inclui conversar comigo em privado para nos conhecermos 🔥💋',

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
    buyBtn: 'Comprar',
    uncensoredTag: '🔞 Sem Censura',
    cardPrivateChatNote: '💋 Eu mesma te envio no Telegram + inclui chat privado comigo para nos conhecermos',
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
    telegramVipGroup: 'GROUPE TELEGRAM VIP',
    vipGroupPassBtn: '👑 Groupe VIP Secret Non Censuré — $50 USD',
    vipGroupPassSub: '♾️ Paiement unique à vie · 🔥 Nouveau contenu explicite 100% GRATUIT à chaque nouveau membre',
    onlyfansBadge: '🟢 EN LIGNE · ACCÈS GRATUIT INCLUS',
    onlyfansTitle: 'Angie Ly · Mon Nouveau OnlyFans & Chat Exclusif',
    onlyfansSub: 'Tout ce qui est trop explicite pour les réseaux est ici… Entrez GRATUITEMENT et discutez en tête-à-tête avec moi — c\'est vraiment moi qui réponds 💙💋',
    onlyfansCta: 'Accéder Gratuitement à OnlyFans & Discuter',
    hotChatBadge: '🔥 ATTENTION PRIVÉE 1-À-1 · C\'EST VRAIMENT MOI',
    hotChatTitle: '💋 Discute Avec Moi · Chat Chaud & Faisons Connaissance — $10 USD',
    hotChatSub: '😈 Tu me veux rien que pour toi ? Dis-moi tes envies sans filtre en privé… Paiement 100% discret ➔ Je t\'attends sur mon Telegram privé 💋',

    fullAccessTitle: '👑 DÉBLOQUER TOUT LE CATALOGUE',
    fullAccessDesc: 'Accès instantané aux photos et vidéos non censurées (N\'INCLUT PAS LES CONTENUS EXTRA PREMIUM)',
    fullAccessBtn: 'Tout Débloquer pour',
    storeSectionTitle: 'Boutique Exclusive',
    storeSectionSub: 'Photos & Vidéos Déblocables',
    storeSectionTitleInt: '🔥 Mes Archives Intimes Non Censurées',
    storeSectionSubInt: 'Vidéos explicites introuvables ailleurs · Chaque achat inclut mon chat privé 1-à-1 💋',
    filterAll: 'Tous',
    filterVideos: 'Vidéos',
    filterPhotos: 'Photos',
    filterPacks: 'Packs',
    howToBuyTitle: '💋 Comment acheter ? 100% Discret + Mon Chat Privé Inclus :',
    howToBuyStep1: '🔒 1. Appuyez sur "Acheter" : Redirection vers le Paiement Sécurisé et discret.',
    howToBuyStep2: '💬 2. On se retrouve sur Telegram : Dès le paiement fait, on parle en privé sur Telegram — je vous envoie personnellement le contenu + chat privé inclus pour faire connaissance 🔥💋',

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
    buyBtn: 'Acheter',
    uncensoredTag: '🔞 Non Censuré',
    cardPrivateChatNote: '💋 Envoyé par moi-même sur Telegram + chat privé inclus pour faire connaissance',
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
    telegramVipGroup: 'TELEGRAM VIP GRUPPE',
    vipGroupPassBtn: '👑 Geheime Unzensierte VIP-Gruppe — $50 USD',
    vipGroupPassSub: '♾️ Einmalige lebenslange Zahlung · 🔥 Gratis neue explizite Inhalte bei jedem neuen Mitglied',
    onlyfansBadge: '🟢 JETZT ONLINE · GRATIS ZUGANG INKLUSIVE',
    onlyfansTitle: 'Angie Ly · Mein Neues OnlyFans & Exklusiver Chat',
    onlyfansSub: 'Alles Unzensierte, was ich sonst nirgendwo zeige… Komm GRATIS rein & schreibe privat 1-zu-1 mit mir persönlich 💙💋',
    onlyfansCta: 'Gratis zu OnlyFans & Mit Mir Chatten',
    hotChatBadge: '🔥 PRIVATE 1-ZU-1 AUFMERKSAMKEIT · ICH PERSÖNLICH',
    hotChatTitle: '💋 Chatte Mit Mir · Heißer Chat & Lern Mich Kennen — $10 USD',
    hotChatSub: '😈 Willst du mich ganz für dich allein? Schreib mir privat ohne Filter… 100% diskrete Zahlung ➔ Ich warte auf meinem privaten Telegram auf dich 💋',

    fullAccessTitle: '👑 GESAMTEN KATALOG FREISCHALTEN',
    fullAccessDesc: 'Sofortiger Zugriff auf unzensierte Fotos und Videos (ENTHÄLT KEINE EXTRA PREMIUM INHALTE)',
    fullAccessBtn: 'Alles Freischalten für',
    storeSectionTitle: 'Exklusiver Shop',
    storeSectionSub: 'Freischaltbare Fotos & Videos',
    storeSectionTitleInt: '🔥 Mein Privates Unzensiertes Archiv',
    storeSectionSubInt: 'Explizite Videos, die es nirgendwo sonst gibt · Jeder Kauf inklusive privatem 1-zu-1 Chat mit mir 💋',
    filterAll: 'Alle',
    filterVideos: 'Videos',
    filterPhotos: 'Fotos',
    filterPacks: 'Pakete',
    howToBuyTitle: '💋 Wie kaufen? 100% Diskret + Privater Chat Inklusive:',
    howToBuyStep1: '🔒 1. Auf "Kaufen" tippen: Weiterleitung zur Sicheren & diskreten Zahlung.',
    howToBuyStep2: '💬 2. Privater Telegram-Chat: Direkt nach der Zahlung schreiben wir privat auf Telegram — ich schicke dir persönlich die Inhalte + privater Chat zum Kennenlernen inklusive 🔥💋',

    purchasedBadge: 'Freigeschaltet',
    extraPremiumBadge: 'EXTRA PREMIUM',
    unlockNowBtn: '🔓 Jetzt Freischalten',
    downloadNowBtn: '⬇️ Jetzt Herunterladen',
    downloadedLimit: '🔒 Heruntergeladen (Limite 1/1)',
    durationLabel: 'Dauer',
    fileSizeLabel: 'Größe',
    purchasesCountLabel: 'Käufe',
    viewTelegramBtn: 'Auf Telegram ansehen 🚀',
    unlockBtn: 'Freischalten',
    buyBtn: 'Kaufen',
    uncensoredTag: '🔞 Unzensiert',
    cardPrivateChatNote: '💋 Persönlich von mir auf Telegram gesendet + privater 1-zu-1 Chat inklusive',
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
    telegramVipGroup: 'GRUPPO TELEGRAM VIP',
    vipGroupPassBtn: '👑 Gruppo VIP Segreto Senza Censura — $50 USD',
    vipGroupPassSub: '♾️ Pagamento unico a vita · 🔥 Nuovi contenuti espliciti 100% GRATIS a ogni nuovo iscritto',
    onlyfansBadge: '🟢 ONLINE ORA · ACCESSO GRATIS INCLUSO',
    onlyfansTitle: 'Angie Ly · Il Mio Nuovo OnlyFans & Chat Esclusiva',
    onlyfansSub: 'Tutto ciò che è troppo esplicito per i social è qui… Entra GRATIS ora e chatta 1-a-1 con me in privato — ti rispondo io in persona 💙💋',
    onlyfansCta: 'Entra Gratis su OnlyFans & Chatta Con Me',
    hotChatBadge: '🔥 ATTENZIONE 1-A-1 IN PRIVATO · SONO PROPRIO IO',
    hotChatTitle: '💋 Chatta Con Me · Chat Bollente & Conosciamoci — $10 USD',
    hotChatSub: '😈 Vuoi avermi tutta per te? Dimmi cosa ti piace senza filtri in privato… Pagamento 100% discreto ➔ Ti aspetto sul mio Telegram personale 💋',

    fullAccessTitle: '👑 SBLOCCA L\'INTERO CATALOGO',
    fullAccessDesc: 'Accesso istantaneo a foto e video senza censura (NON INCLUDE CONTENUTI EXTRA PREMIUM)',
    fullAccessBtn: 'Sblocca Tutto per',
    storeSectionTitle: 'Negozio Esclusivo',
    storeSectionSub: 'Foto & Video Sbloccabili',
    storeSectionTitleInt: '🔥 Il Mio Archivio Intimo Senza Censura',
    storeSectionSubInt: 'Video espliciti mai visti altrove · Ogni acquisto include la mia chat privata 1-a-1 💋',
    filterAll: 'Tutti',
    filterVideos: 'Video',
    filterPhotos: 'Foto',
    filterPacks: 'Pacchetti',
    howToBuyTitle: '💋 Come acquistare? 100% Discreto + Mia Chat Privata Inclusa:',
    howToBuyStep1: '🔒 1. Tocca "Acquista": Vai al Pagamento Sicuro e 100% riservato.',
    howToBuyStep2: '💬 2. Parliamo su Telegram: Subito dopo il pagamento ci scriviamo in privato su Telegram — lì ti invio io stessa il contenuto + include chattare con me in privato per conoscerci 🔥💋',

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
    buyBtn: 'Acquista',
    uncensoredTag: '🔞 Senza Censura',
    cardPrivateChatNote: '💋 Te lo invio io stessa su Telegram + include chat privata con me per conoscerci',
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
