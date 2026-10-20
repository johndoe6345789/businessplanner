'use client';

/**
 * @brief Scrolls the active list item into view.
 * @module hooks/useScrollActiveIntoView
 */
import { useRef, useEffect } from 'react';

/**
 * Returns a ref to attach to a `<ul>` element.
 * Scrolls the `li` at `activeIndex` into view
 * whenever `activeIndex` changes.
 *
 * @param activeIndex - Currently highlighted index.
 * @returns Ref for the list container element.
 */
export function useScrollActiveIntoView(
  activeIndex: number,
) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = listRef.current
      ?.querySelectorAll('li')[activeIndex];
    (el as HTMLElement | undefined)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return listRef;
}
