'use client';

/**
 * "View all results" footer item for the
 * search suggest dropdown.
 * @module components/molecules/SearchViewAllItem
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { viewAllStyle }
  from './searchSuggestStyles';

/** Props for SearchViewAllItem. */
export interface SearchViewAllItemProps {
  /** Search query displayed in the label. */
  query: string;
  /** Whether this item is keyboard-focused. */
  isActive: boolean;
  /** Called when the item is clicked. */
  onViewAll: () => void;
  /** Called on mouse enter for keyboard sync. */
  onHover: () => void;
}

/**
 * Footer list item that navigates to the full
 * search results page when activated.
 *
 * @param props - Component props.
 * @returns SearchViewAllItem UI.
 */
export const SearchViewAllItem: React.FC<
  SearchViewAllItemProps
> = ({ query, isActive, onViewAll, onHover }) => {
  const t = useTranslations('search');
  return (
    <li
      role="option"
      aria-selected={isActive}
      onClick={onViewAll}
      onMouseEnter={onHover}
      style={viewAllStyle(isActive)}
      data-testid="search-suggest-view-all"
    >
      {t('viewAll', { query })}
    </li>
  );
};

export default SearchViewAllItem;
