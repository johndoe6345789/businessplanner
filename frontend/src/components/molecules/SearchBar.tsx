/**
 * SearchBar — navbar search with autocomplete
 * dropdown. Owns query state; delegates visuals
 * to SearchInput atom.
 *
 * @module components/molecules/SearchBar
 */
'use client';

import React, { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import {
  useSearchKeyboardNav,
} from '@/hooks/useSearchKeyboardNav';
import { SearchInput } from '@/components/atoms/SearchInput';
import {
  SearchSuggestDropdown,
} from './SearchSuggestDropdown';
import type { SearchSuggestItem } from '@/types/search';

/** Public props for SearchBar. */
export interface SearchBarProps {
  placeholder?: string;
  testId?: string;
}

const ROOT: React.CSSProperties = {
  position: 'relative',
};

/** Self-contained search bar with autocomplete. */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder, testId = 'search-bar',
}) => {
  const t = useTranslations('common');
  const router = useRouter();
  const {
    query, setQuery, suggest,
    isLoading, submit, clear,
  } = useGlobalSearch();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const showDrop = open && query.trim().length >= 2;

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

  return (
    <div
      data-testid={testId}
      onKeyDown={onKeyDown}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget))
          setOpen(false);
      }}
      style={ROOT}
    >
      <SearchInput
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onClear={() => { clear(); setOpen(false); }}
        isLoading={isLoading}
        focused={open}
        placeholder={
          placeholder ?? `${t('search')}…`
        }
        testId={`${testId}-input`}
      />
      {showDrop && (
        <SearchSuggestDropdown
          query={query}
          items={suggest}
          isLoading={isLoading}
          activeIndex={active}
          onHover={setActive}
          onPick={onPick}
          onViewAll={() => {
            submit(); setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;
