import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Ressources de traduction
import en from './locales/en.json'
import fr from './locales/fr.json'
import rn from './locales/rn.json' // Kirundi

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  rn: { translation: rn },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr', // Français par défaut pour le Burundi
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React échappe déjà
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Namespace par défaut
    defaultNS: 'translation',
    
    // Configuration pour le développement
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (lng, ns, key) => {
      if (import.meta.env.DEV) {
        console.warn(`Missing translation key: ${key} for language: ${lng}`)
      }
    },
  })

export default i18n

// Types pour TypeScript
export type Language = 'en' | 'fr' | 'rn'

// Utilitaires
export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'rn', name: 'Kirundi', flag: '🇧🇮' },
]

export const getCurrentLanguage = (): Language => {
  return (i18n.language as Language) || 'fr'
}

export const changeLanguage = (lng: Language) => {
  i18n.changeLanguage(lng)
}
