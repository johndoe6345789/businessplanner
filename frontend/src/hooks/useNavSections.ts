'use client';

import { useState, useCallback } from 'react';
import navGroups from '@/constants/nav-groups.json';

const STORAGE_KEY = 'nextra-nav-sections';

type SectionState = Record<string, boolean>;

/** Build default open/closed state from nav-groups.json. */
function defaultState(): SectionState {
  return Object.fromEntries(
    navGroups.map((g) => [g.key, g.defaultOpen]),
  );
}

/** Read persisted state from localStorage, falling back to defaults. */
function readState(): SectionState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SectionState) : defaultState();
  } catch {
    return defaultState();
  }
}

/**
 * Manages collapsible nav section open/closed state,
 * persisted to localStorage so it survives page reloads.
 *
 * @returns open state map and toggle function.
 */
export function useNavSections(): {
  open: SectionState;
  toggle: (key: string) => void;
} {
  const [open, setOpen] = useState<SectionState>(readState);

  const toggle = useCallback((key: string) => {
    setOpen((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* quota exceeded — silently skip */ }
      return next;
    });
  }, []);

  return { open, toggle };
}
