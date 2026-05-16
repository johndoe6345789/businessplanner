'use client';

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'nextra-welcomed';

/**
 * Detects whether this is the user's first visit
 * by checking localStorage. Returns a dismiss function
 * that persists the welcomed state.
 *
 * @returns isFirstVisit flag and dismiss callback.
 */
export function useFirstVisit(): {
  isFirstVisit: boolean;
  dismiss: () => void;
} {
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'true';
    } catch {
      return false;
    }
  });

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch { /* quota exceeded */ }
    setIsFirstVisit(false);
  }, []);

  return { isFirstVisit, dismiss };
}
