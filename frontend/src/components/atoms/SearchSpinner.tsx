'use client';

/**
 * Animated SVG spinner used inside SearchInput.
 * @module components/atoms/SearchSpinner
 */
import React from 'react';

const STYLE: React.CSSProperties = {
  flexShrink: 0, opacity: 0.5,
};

/**
 * Small circular loading indicator for the search bar.
 * @returns SearchSpinner SVG element.
 */
export const SearchSpinner: React.FC = () => (
  <svg
    width="14" height="14" viewBox="0 0 14 14"
    style={STYLE}
    aria-hidden
  >
    <circle
      cx="7" cy="7" r="5" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeDasharray="12 8" strokeLinecap="round"
    >
      <animateTransform
        attributeName="transform" type="rotate"
        from="0 7 7" to="360 7 7"
        dur="0.7s" repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default SearchSpinner;
