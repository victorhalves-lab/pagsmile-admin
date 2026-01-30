import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptTranslations from './locales/pt';
import enTranslations from './locales/en';
import zhTranslations from './locales/zh';

// Get saved language or default to Portuguese
const savedLanguage = localStorage.getItem('app_language') || 'pt';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptTranslations },
      en: { translation: enTranslations },
      zh: { translation: zhTranslations }
    },
    lng: savedLanguage,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false
    }
  });

// Function to change language and persist
export const changeLanguage = (lang) => {
  localStorage.setItem('app_language', lang);
  i18n.changeLanguage(lang);
};

export const getCurrentLanguage = () => {
  return localStorage.getItem('app_language') || 'pt';
};

export const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

export default i18n;