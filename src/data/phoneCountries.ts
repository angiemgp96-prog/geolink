export interface PhoneCountry {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  digits: number | [number, number]; // Exact digit count or [min, max]
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴', digits: 10 },
  { code: 'US', name: 'Estados Unidos / Canadá', dialCode: '+1', flag: '🇺🇸', digits: 10 },
  { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸', digits: 9 },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽', digits: 10 },
  { code: 'PA', name: 'Panamá', dialCode: '+507', flag: '🇵🇦', digits: 8 },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷', digits: 10 },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱', digits: 9 },
  { code: 'PE', name: 'Perú', dialCode: '+51', flag: '🇵🇪', digits: 9 },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨', digits: 9 },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪', digits: 10 },
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷', digits: 11 },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾', digits: 8 },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾', digits: 9 },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴', digits: 8 },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', digits: 8 },
  { code: 'DO', name: 'República Dominicana', dialCode: '+1', flag: '🇩🇴', digits: 10 },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹', digits: 8 },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳', digits: 8 },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻', digits: 8 },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮', digits: 8 },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1', flag: '🇵🇷', digits: 10 },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺', digits: 8 },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧', digits: 10 },
  { code: 'FR', name: 'Francia', dialCode: '+33', flag: '🇫🇷', digits: 9 },
  { code: 'DE', name: 'Alemania', dialCode: '+49', flag: '🇩🇪', digits: 11 },
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹', digits: 10 },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹', digits: 9 },
  { code: 'NL', name: 'Países Bajos', dialCode: '+31', flag: '🇳🇱', digits: 9 },
  { code: 'BE', name: 'Bélgica', dialCode: '+32', flag: '🇧🇪', digits: 9 },
  { code: 'CH', name: 'Suiza', dialCode: '+41', flag: '🇨🇭', digits: 9 },
  { code: 'SE', name: 'Suecia', dialCode: '+46', flag: '🇸🇪', digits: 9 },
  { code: 'NO', name: 'Noruega', dialCode: '+47', flag: '🇳🇴', digits: 8 },
  { code: 'DK', name: 'Dinamarca', dialCode: '+45', flag: '🇩🇰', digits: 8 },
  { code: 'FI', name: 'Finlandia', dialCode: '+358', flag: '🇫🇮', digits: 9 },
  { code: 'IE', name: 'Irlanda', dialCode: '+353', flag: '🇮🇪', digits: 9 },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', digits: 9 },
  { code: 'NZ', name: 'Nueva Zelanda', dialCode: '+64', flag: '🇳🇿', digits: 9 },
  { code: 'JP', name: 'Japón', dialCode: '+81', flag: '🇯🇵', digits: 10 },
  { code: 'KR', name: 'Corea del Sur', dialCode: '+82', flag: '🇰🇷', digits: 10 },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', digits: 11 },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', digits: 10 },
  { code: 'RU', name: 'Rusia', dialCode: '+7', flag: '🇷🇺', digits: 10 },
  { code: 'ZA', name: 'Sudáfrica', dialCode: '+27', flag: '🇿🇦', digits: 9 },
  { code: 'AE', name: 'Emiratos Árabes Unidos', dialCode: '+971', flag: '🇦🇪', digits: 9 },
  { code: 'SA', name: 'Arabia Saudita', dialCode: '+966', flag: '🇸🇦', digits: 9 },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱', digits: 9 },
  { code: 'TR', name: 'Turquía', dialCode: '+90', flag: '🇹🇷', digits: 10 },
  { code: 'GR', name: 'Grecia', dialCode: '+30', flag: '🇬🇷', digits: 10 },
  { code: 'PL', name: 'Polonia', dialCode: '+48', flag: '🇵🇱', digits: 9 },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹', digits: 10 },
  { code: 'CZ', name: 'República Checa', dialCode: '+420', flag: '🇨🇿', digits: 9 },
  { code: 'HU', name: 'Hungría', dialCode: '+36', flag: '🇭🇺', digits: 9 },
  { code: 'RO', name: 'Rumania', dialCode: '+40', flag: '🇷🇴', digits: 9 },
  { code: 'UA', name: 'Ucrania', dialCode: '+380', flag: '🇺🇦', digits: 9 },
  { code: 'SG', name: 'Singapur', dialCode: '+65', flag: '🇸🇬', digits: 8 },
  { code: 'MY', name: 'Malasia', dialCode: '+60', flag: '🇲🇾', digits: 9 },
  { code: 'TH', name: 'Tailandia', dialCode: '+66', flag: '🇹🇭', digits: 9 },
  { code: 'PH', name: 'Filipinas', dialCode: '+63', flag: '🇵🇭', digits: 10 },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', digits: 10 },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', digits: 9 },
  { code: 'EG', name: 'Egipto', dialCode: '+20', flag: '🇪🇬', digits: 10 },
  { code: 'MA', name: 'Marruecos', dialCode: '+212', flag: '🇲🇦', digits: 9 },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬', digits: 10 },
  { code: 'KE', name: 'Kenia', dialCode: '+254', flag: '🇰🇪', digits: 9 },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭', digits: 9 },
  { code: 'JM', name: 'Jamaica', dialCode: '+1', flag: '🇯🇲', digits: 10 },
  { code: 'TT', name: 'Trinidad y Tobago', dialCode: '+1', flag: '🇹🇹', digits: 10 },
  { code: 'BZ', name: 'Belice', dialCode: '+501', flag: '🇧🇿', digits: 7 },
  { code: 'HT', name: 'Haití', dialCode: '+509', flag: '🇭🇹', digits: 8 },
  { code: 'BA', name: 'Bosnia y Herzegovina', dialCode: '+387', flag: '🇧🇦', digits: 8 },
  { code: 'HR', name: 'Croacia', dialCode: '+385', flag: '🇭🇷', digits: 8 },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸', digits: 8 },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬', digits: 9 },
  { code: 'SK', name: 'Eslovaquia', dialCode: '+421', flag: '🇸🇰', digits: 9 },
  { code: 'SI', name: 'Eslovenia', dialCode: '+386', flag: '🇸🇮', digits: 8 },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪', digits: 8 },
  { code: 'LV', name: 'Letonia', dialCode: '+371', flag: '🇱🇻', digits: 8 },
  { code: 'LT', name: 'Lituania', dialCode: '+370', flag: '🇱🇹', digits: 8 },
  { code: 'CY', name: 'Chipre', dialCode: '+357', flag: '🇨🇾', digits: 8 },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹', digits: 8 },
  { code: 'LU', name: 'Luxemburgo', dialCode: '+352', flag: '🇱🇺', digits: 9 },
  { code: 'IS', name: 'Islandia', dialCode: '+354', flag: '🇮🇸', digits: 7 },
  { code: 'GLOBAL', name: 'Otro País Internacional', dialCode: '+', flag: '🌐', digits: [7, 15] }
];

export function findPhoneCountry(codeOrPrefix?: string): PhoneCountry {
  if (!codeOrPrefix) return PHONE_COUNTRIES[0]; // CO default
  const upper = codeOrPrefix.trim().toUpperCase();
  
  // Try by ISO code
  const byCode = PHONE_COUNTRIES.find(c => c.code === upper);
  if (byCode) return byCode;

  // Try by dial code
  const cleanDial = upper.replace(/[^0-9+]/g, '');
  const byDial = PHONE_COUNTRIES.find(c => c.dialCode === cleanDial || c.dialCode === `+${cleanDial}`);
  if (byDial) return byDial;

  return PHONE_COUNTRIES[0];
}
