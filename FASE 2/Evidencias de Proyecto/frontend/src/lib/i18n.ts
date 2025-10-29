import es from '@/messages/es.json'
import en from '@/messages/en.json'

export type Locale = 'es' | 'en'

const translations = { es, en }

export function getTranslations(locale: Locale = 'es') {
  return translations[locale] || translations.es
}

export function useClientTranslations(locale: Locale = 'es') {
  return getTranslations(locale)
}
