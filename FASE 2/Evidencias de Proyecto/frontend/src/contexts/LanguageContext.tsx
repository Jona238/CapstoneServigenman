'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getTranslations, type Locale } from '@/lib/i18n'
import Cookies from 'js-cookie'

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')
  const [translations, setTranslations] = useState(getTranslations('es'))

  useEffect(() => {
    // Leer idioma de la cookie al iniciar
    const savedLocale = Cookies.get('locale') as Locale
    if (savedLocale && (savedLocale === 'es' || savedLocale === 'en')) {
      setLocaleState(savedLocale)
      setTranslations(getTranslations(savedLocale))
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    setTranslations(getTranslations(newLocale))
    Cookies.set('locale', newLocale, { expires: 365 })
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
