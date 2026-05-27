/**
 * SearchInput — pill-shaped input with search icon,
 * loading spinner and clear button. Purely visual;
 * no search state logic.
 *
 * @module components/atoms/SearchInput
 */
'use client';

import React from 'react';
import {
  INPUT_WRAP, SEARCH_INPUT,
  ICON_WRAP, CLEAR_BTN,
} from '../molecules/searchSuggestStyles';
import { SearchSpinner }
  from '@/components/atoms/SearchSpinner';

/** Props for SearchInput. */
export interface SearchInputProps {
  /** Current input value. */
  value: string;
  /** Input change handler. */
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  /** Called when the clear × button is pressed. */
  onClear: () => void;
  /** Show spinning loader instead of clear button. */
  isLoading?: boolean;
  /** Highlights border in primary colour. */
  focused?: boolean;
  placeholder?: string;
  testId?: string;
}

/**
 * Pill input with icon, spinner, and clear button.
 *
 * @param props - Component props.
 */
export const SearchInput: React.FC<
  SearchInputProps
> = ({
  value, onChange, onClear,
  isLoading = false, focused = false,
  placeholder, testId,
}) => (
  <div style={{
    ...INPUT_WRAP,
    borderColor: focused
      ? 'var(--mat-sys-primary)' : undefined,
  }}>
    <span style={ICON_WRAP} aria-hidden>
      <svg
        viewBox="0 0 16 16" width="14" height="14"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round"
      >
        <circle cx="6.5" cy="6.5" r="4.5" />
        <line x1="10.5" y1="10.5"
          x2="15" y2="15" />
      </svg>
    </span>
    <input
      data-testid={testId}
      aria-label="Search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={SEARCH_INPUT}
    />
    {isLoading && <SearchSpinner />}
    {!isLoading && value && (
      <button
        aria-label="Clear search"
        style={CLEAR_BTN}
        tabIndex={-1}
        onMouseDown={(e) => {
          e.preventDefault();
          onClear();
        }}
      >✕</button>
    )}
  </div>
);

export default SearchInput;
