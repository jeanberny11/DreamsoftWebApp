import 'react-i18next';
import { resources } from './config';

// Extend the react-i18next module to provide type safety
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof resources.en;
  }
}

// Export supported languages
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
} as const;

export type Language = keyof typeof SUPPORTED_LANGUAGES;
