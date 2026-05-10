// Mock de merchants com branding white-label aplicado.
// Em produção, isso seria carregado via base44.entities.MerchantBranding.filter({ subaccount_id })
// usando o merchant_id da querystring.

export const mockWhiteLabelMerchants = {
  m_techmart: {
    id: 'm_techmart',
    branding_id: 'br_techmart',
    merchant_name: 'TechMart Marketplace',
    business_name_display: 'TechMart',
    tagline: 'O marketplace dos seus parceiros',
    logo_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/2cf8bf7b4_Logo-modo-claro.png',
    favicon_url: null,
    brand_color_primary: '#7C3AED',
    brand_color_secondary: '#1E1B4B',
    brand_color_accent: '#F59E0B',
    background_color: '#FFFFFF',
    text_color: '#171717',
    support_email: 'suporte@techmart.com.br',
    support_phone: '(11) 4000-1000',
    support_whatsapp: '5511940001000',
    website_url: 'https://techmart.com.br',
    privacy_policy_url: 'https://techmart.com.br/privacidade',
    terms_url: 'https://techmart.com.br/termos',
    show_powered_by: true,
  },
  m_paycorp: {
    id: 'm_paycorp',
    branding_id: 'br_paycorp',
    merchant_name: 'PayCorp Solutions',
    business_name_display: 'PayCorp',
    tagline: 'Pagamentos sem fronteiras',
    logo_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/2cf8bf7b4_Logo-modo-claro.png',
    favicon_url: null,
    brand_color_primary: '#0891B2',
    brand_color_secondary: '#0E7490',
    brand_color_accent: '#06B6D4',
    background_color: '#FFFFFF',
    text_color: '#0F172A',
    support_email: 'compliance@paycorp.io',
    support_phone: '(11) 3000-2000',
    support_whatsapp: '5511930002000',
    website_url: 'https://paycorp.io',
    privacy_policy_url: 'https://paycorp.io/privacy',
    terms_url: 'https://paycorp.io/terms',
    show_powered_by: true,
  },
  // Branding default (PagSmile) — usado quando merchant_id não é fornecido
  pagsmile: {
    id: 'pagsmile',
    branding_id: null,
    merchant_name: 'PagSmile',
    business_name_display: 'PagSmile',
    tagline: 'Pagamentos inteligentes',
    logo_url: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6979104cafd6b02cfed66766/2cf8bf7b4_Logo-modo-claro.png',
    favicon_url: null,
    brand_color_primary: '#2bc196',
    brand_color_secondary: '#002443',
    brand_color_accent: '#5cf7cf',
    background_color: '#FFFFFF',
    text_color: '#171717',
    support_email: 'suporte@pagsmile.com',
    support_phone: '(11) 3000-1000',
    support_whatsapp: null,
    website_url: 'https://pagsmile.com',
    privacy_policy_url: 'https://pagsmile.com/privacidade',
    terms_url: 'https://pagsmile.com/termos',
    show_powered_by: false,
  },
};

/**
 * Resolve o branding white-label a ser aplicado.
 * Em produção: substituir o lookup do mock por:
 *   const branding = await base44.entities.MerchantBranding.filter({ subaccount_id: merchantId, is_active: true });
 */
export function resolveBranding(merchantId) {
  if (!merchantId) return mockWhiteLabelMerchants.pagsmile;
  return mockWhiteLabelMerchants[merchantId] || mockWhiteLabelMerchants.pagsmile;
}

/**
 * Hook leve para extrair merchant_id da URL e devolver o branding resolvido.
 */
export function getBrandingFromUrl() {
  if (typeof window === 'undefined') return mockWhiteLabelMerchants.pagsmile;
  const params = new URLSearchParams(window.location.search);
  const merchantId = params.get('merchant_id') || params.get('merchant');
  return resolveBranding(merchantId);
}