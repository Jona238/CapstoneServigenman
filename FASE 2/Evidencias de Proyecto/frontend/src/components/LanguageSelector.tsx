'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <button
        onClick={() => setLocale('es')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          locale === 'es'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="Español"
      >
        <span className="text-lg">🇪🇸</span>
        <span className="ml-2">ES</span>
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          locale === 'en'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="English"
      >
        <span className="text-lg">🇺🇸</span>
        <span className="ml-2">EN</span>
      </button>
    </div>
  )
}
