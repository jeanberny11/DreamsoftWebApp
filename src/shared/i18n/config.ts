import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import English translations
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enValidation from './locales/en/validation.json';

// Import Spanish translations
import esCommon from './locales/es/common.json';
import esAuth from './locales/es/auth.json';
import esValidation from './locales/es/validation.json';

// Define resources
export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    validation: enValidation,
  },
  es: {
    common: esCommon,
    auth: esAuth,
    validation: esValidation,
  },
} as const;

// Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: 'es', // Default language
    fallbackLng: 'es', // Fallback language if translation is missing
    defaultNS: 'common', // Default namespace
    ns: ['common', 'auth', 'validation'], // Available namespaces

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Optional: Save user's language preference
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    // React options
    react: {
      useSuspense: false, // Set to true if you want to use Suspense
    },
  });

export default i18n;
