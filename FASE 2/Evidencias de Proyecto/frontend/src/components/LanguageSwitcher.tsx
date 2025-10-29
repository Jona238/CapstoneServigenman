'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function LanguageSwitcher() {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (nextLocale: string) => {
    startTransition(() => {
      // Remove current locale from pathname and add new locale
      const pathnameWithoutLocale = pathname.replace(/^\/(es|en)/, '')
      router.replace(`/${nextLocale}${pathnameWithoutLocale}`)
    })
  }

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <button
        onClick={() => switchLocale('es')}
        disabled={isPending || locale === 'es'}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
          locale === 'es'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100'
        } disabled:cursor-not-allowed`}
        title={t('spanish')}
      >
        <span className="text-lg">🇪🇸</span>
        <span className="ml-2 hidden sm:inline">ES</span>
      </button>
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending || locale === 'en'}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
          locale === 'en'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100'
        } disabled:cursor-not-allowed`}
        title={t('english')}
      >
        <span className="text-lg">🇺🇸</span>
        <span className="ml-2 hidden sm:inline">EN</span>
      </button>
    </div>
  )
}
