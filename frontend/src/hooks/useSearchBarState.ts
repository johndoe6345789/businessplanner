'use client';

/**
 * @brief Keyboard/focus state for the SearchBar molecule.
 * @module hooks/useSearchBarState
 */
import { useState, useCallback } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useGlobalSearch }
  from '@/hooks/useGlobalSearch';
import { useSearchKeyboardNav }
  from '@/hooks/useSearchKeyboardNav';
import type { SearchSuggestItem }
  from '@/types/search';

/**
 * Owns query/suggestion state from useGlobalSearch
 * and the keyboard-navigation state (active index,
 * open flag) for the search bar dropdown.
 *
 * @returns Search bar interaction state and handlers.
 */
export function useSearchBarState() {
  const router = useRouter();
  const {
    query, setQuery, suggest,
    isLoading, submit, clear,
  } = useGlobalSearch();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const showDrop =
    open && query.trim().length >= 2;

  const onPick = useCallback(
    (it: SearchSuggestItem) => {
      router.push(it.url);
      clear();
      setOpen(false);
    },
    [router, clear],
  );

  const onKeyDown = useSearchKeyboardNav({
    suggest, active, setActive, setOpen, clear,
    submit: () => submit(), onPick,
  });

  return {
    query, setQuery, suggest, isLoading, clear,
    submit, active, setActive, open, setOpen,
    showDrop, onPick, onKeyDown,
  };
}
