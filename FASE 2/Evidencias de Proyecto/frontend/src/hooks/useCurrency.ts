'use client';

import { useEffect, useState } from 'react';

type Currency = 'CLP' | 'USD' | 'EUR';

export function useCurrency() {
  const [currency, setCurrencyState] = useState<Currency>('CLP');
  const [decimals, setDecimals] = useState<number>(0);

  useEffect(() => {
    // Load initial currency from localStorage
    try {
      const savedCurrency = localStorage.getItem('ajustes_currency') as Currency;
      const savedDecimals = localStorage.getItem('ajustes_currency_decimals');

      if (savedCurrency) {
        setCurrencyState(savedCurrency);
      }
      if (savedDecimals) {
        setDecimals(parseInt(savedDecimals, 10));
      }
    } catch {}

    // Listen for currency changes from other parts of the app
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ajustes_currency' && e.newValue) {
        setCurrencyState(e.newValue as Currency);
        const newDecimals = e.newValue === 'CLP' ? 0 : 2;
        setDecimals(newDecimals);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatCurrency = (amount: number): string => {
    const currencyConfig: Record<Currency, { locale: string; currencyCode: string }> = {
      CLP: { locale: 'es-CL', currencyCode: 'CLP' },
      USD: { locale: 'en-US', currencyCode: 'USD' },
      EUR: { locale: 'de-DE', currencyCode: 'EUR' },
    };

    const config = currencyConfig[currency];

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currencyCode,
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(amount);
  };

  return {
    currency,
    decimals,
    formatCurrency,
  };
}
