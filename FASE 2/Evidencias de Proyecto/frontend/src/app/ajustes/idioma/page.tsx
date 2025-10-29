'use client'

import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'
import LanguageSelector from '@/components/LanguageSelector'

function IdiomaContent() {
  const { t, locale } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {t.settings.language}
          </h1>
          <LanguageSelector />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {t.common.welcome}
            </h2>
            <p className="text-gray-600">
              {locale === 'es'
                ? 'Selecciona tu idioma preferido usando los botones de arriba.'
                : 'Select your preferred language using the buttons above.'}
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {t.common.language}
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>• {t.common.home}: {t.common.home}</p>
              <p>• {t.common.inventory}: {t.common.inventory}</p>
              <p>• {t.common.settings}: {t.common.settings}</p>
              <p>• {t.common.logout}: {t.common.logout}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {locale === 'es' ? 'Información' : 'Information'}
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                {locale === 'es'
                  ? 'El idioma por defecto es Español'
                  : 'Default language is Spanish'}
              </li>
              <li>
                {locale === 'es'
                  ? 'Los cambios se aplican inmediatamente'
                  : 'Changes apply immediately'}
              </li>
              <li>
                {locale === 'es'
                  ? 'Tu preferencia se guarda en una cookie'
                  : 'Your preference is saved in a cookie'}
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              {locale === 'es'
                ? '✓ Sistema de idiomas funcionando correctamente'
                : '✓ Language system working correctly'}
            </p>
            <p className="text-blue-600 text-sm mt-1">
              {locale === 'es'
                ? `Idioma actual: Español (${locale})`
                : `Current language: English (${locale})`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IdiomaPage() {
  return (
    <LanguageProvider>
      <IdiomaContent />
    </LanguageProvider>
  )
}
