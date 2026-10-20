/**
 * SearchSuggestDropdown — autocomplete panel under
 * the navbar search bar. Lists up to N suggestions
 * plus a "View all results" footer.
 *
 * @module components/molecules/SearchSuggestDropdown
 */
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import type { SearchSuggestItem } from '@/types/search';
import { TYPE_LABEL_KEY }
  from '@/constants/search-type-labels';
import {
  PANEL, LIST, ROW_TOP, BADGE, TITLE, SNIPPET,
  EMPTY_STATE, rowStyle,
} from './searchSuggestStyles';
import { useScrollActiveIntoView }
  from '@/hooks/useScrollActiveIntoView';
import { SearchViewAllItem }
  from './SearchViewAllItem';

/** Props for SearchSuggestDropdown. */
export interface SearchSuggestDropdownProps {
  query: string;
  items: SearchSuggestItem[];
  isLoading?: boolean;
  activeIndex: number;
  onHover: (i: number) => void;
  onPick: (item: SearchSuggestItem) => void;
  onViewAll: () => void;
}

/**
 * Autocomplete dropdown.
 *
 * @param props - Component props.
 */
export const SearchSuggestDropdown: React.FC<
  SearchSuggestDropdownProps
> = ({ query, items, isLoading = false,
  activeIndex, onHover, onPick, onViewAll }) => {
  const t = useTranslations('search');
  const listRef =
    useScrollActiveIntoView(activeIndex);
  const emptyMsg = isLoading
    ? t('searching')
    : items.length === 0
    ? t('noResultsFor', { query })
    : null;

  return (
    <div
      style={PANEL}
      data-testid="search-suggest-dropdown"
    >
      {emptyMsg && (
        <div style={EMPTY_STATE}>{emptyMsg}</div>
      )}
      {!isLoading && items.length > 0 && (
      <ul
        ref={listRef}
        role="listbox"
        aria-label={t('suggestions')}
        style={LIST}
      >
        {items.map((it, i) => (
          <li
            key={`${it.type}-${it.id}`}
            role="option"
            aria-selected={i === activeIndex}
            onMouseEnter={() => onHover(i)}
            onClick={() => onPick(it)}
            data-testid="search-suggest-item"
            style={rowStyle(i === activeIndex)}
          >
            <div style={ROW_TOP}>
              <span style={BADGE}>
                {t(TYPE_LABEL_KEY[it.type]
                  ?? 'tabs.all')}
              </span>
              <span style={TITLE}>{it.title}</span>
            </div>
            <div style={SNIPPET}>{it.snippet}</div>
          </li>
        ))}
        <SearchViewAllItem
          query={query}
          isActive={activeIndex === items.length}
          onViewAll={onViewAll}
          onHover={() => onHover(items.length)}
        />
      </ul>
      )}
    </div>
  );
};

export default SearchSuggestDropdown;
