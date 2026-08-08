export interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon: string; // lucide icon name or emoji
  active: boolean;
  clicks?: number;
}

export interface PaymentSettings {
  mercadoPagoAccessToken: string;
  mercadoPagoPublicKey: string;
  payPalClientId: string;
  payPalClientSecret: string;
  payPalMode: 'sandbox' | 'live';
  customPaymentLinks: {
    id: string;
    name: string;
    url: string;
    currency: string;
  }[];
}

export interface CreatorProfile {
  id: string;
  handle: string; // e.g., 'valeria_vip'
  name: string;
  title: string;
  bio: string;
  avatar: string;
  banner: string;
  themeColor: string;
  badge?: string;
  blockedCountries: string[]; // ISO country codes e.g. ['ES', 'AR', 'US']
  blockedMessage: string;
  whatsappNumber: string;
  links: CustomLink[];
  paymentSettings: PaymentSettings;
  createdAt: string;
}

export type MediaType = 'photo' | 'video' | 'bundle';

export interface MediaItem {
  id: string;
  creatorId: string;
  creatorHandle: string;
  title: string;
  description: string;
  type: MediaType;
  price: number;
  currency: string;
  previewUrl: string; // blurred/watermarked preview image or clip
  downloadUrl: string; // actual full resolution photo/video file
  fileSize: string;
  duration?: string; // e.g. "14:20 min" for video
  itemCount?: number; // for bundles
  purchasesCount: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface PurchaseRecord {
  id: string;
  token: string;
  mediaId: string;
  mediaTitle: string;
  creatorHandle: string;
  buyerEmail: string;
  buyerPhone: string;
  amount: number;
  currency: string;
  paymentMethod: 'mercadopago' | 'paypal' | 'link';
  paymentId: string;
  status: 'completed' | 'pending' | 'failed';
  ipAddress?: string;
  createdAt: string;
  downloadCount: number;
  downloadUrl: string;
  whatsappSent?: boolean;
}

export interface VisitorLocation {
  ip: string;
  countryCode: string; // e.g. 'AR', 'ES', 'US', 'MX', 'CO'
  countryName: string;
  city: string;
  isSimulated?: boolean;
}

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}
