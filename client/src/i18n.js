import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import thTranslations from './locales/th.json';

const savedLanguage = localStorage.getItem('preferredLanguage') || 'th';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      th: { translation: thTranslations }
    },
    lng: savedLanguage, 
    
    fallbackLng: 'th',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;