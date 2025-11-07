'use client';

import { useEffect, useState } from "react";
import {
  DEFAULT_LOW_STOCK_THRESHOLD,
  getStoredLowStockThreshold,
  sanitizeLowStockThreshold,
  setStoredLowStockThreshold,
  subscribeToLowStockThreshold,
} from "@/lib/stockAlerts";

export function useLowStockThreshold() {
  const [threshold, setThresholdState] = useState<number>(DEFAULT_LOW_STOCK_THRESHOLD);

  useEffect(() => {
    setThresholdState(getStoredLowStockThreshold());
    const unsubscribe = subscribeToLowStockThreshold(setThresholdState);
    return () => {
      unsubscribe();
    };
  }, []);

  const updateThreshold = (value: number) => {
    const sanitized = setStoredLowStockThreshold(sanitizeLowStockThreshold(value));
    setThresholdState(sanitized);
    return sanitized;
  };

  return {
    threshold,
    setThreshold: updateThreshold,
  };
}

