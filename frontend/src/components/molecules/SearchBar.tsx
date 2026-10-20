/**
 * SearchBar — navbar search with autocomplete
 * dropdown. Owns query state; delegates visuals
 * to SearchInput atom.
 *
 * @module components/molecules/SearchBar
 */
'use client';

import React from 'react';
import { useSearchBarState }
  from '@/hooks/useSearchBarState';
import { SearchInput }
  from '@/components/atoms/SearchInput';
import {
  SearchSuggestDropdown,
} from './SearchSuggestDropdown';
import { useTranslations } from 'next-intl';

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
  const vm = useSearchBarState();

  return (
    <div
      data-testid={testId}
      onKeyDown={vm.onKeyDown}
      onFocus={() => vm.setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(
          e.relatedTarget,
        )) vm.setOpen(false);
      }}
      style={ROOT}
    >
      <SearchInput
        value={vm.query}
        onChange={(e) => {
          vm.setQuery(e.target.value);
          vm.setActive(0);
          vm.setOpen(true);
        }}
        onClear={() => {
          vm.clear(); vm.setOpen(false);
        }}
        isLoading={vm.isLoading}
        focused={vm.open}
        placeholder={
          placeholder ?? `${t('search')}…`
        }
        testId={`${testId}-input`}
      />
      {vm.showDrop && (
        <SearchSuggestDropdown
          query={vm.query}
          items={vm.suggest}
          isLoading={vm.isLoading}
          activeIndex={vm.active}
          onHover={vm.setActive}
          onPick={vm.onPick}
          onViewAll={() => {
            vm.submit(); vm.setOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;
