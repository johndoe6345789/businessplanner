/**
 * @file withoutLocale.ts
 * @brief Normalise hrefs for the locale-aware Link.
 */
import { routing } from '@/i18n/routing';

/**
 * The locale-aware Link adds the locale itself, so an href that
 * already starts with one ("/en/financials/burn") would end up
 * as "/en/en/financials/burn" and 404. Drop a leading segment
 * only when it is a configured locale.
 *
 * @param href - path that may start with a locale segment
 * @returns the path without that locale segment
 */
export function withoutLocale(href: string): string {
  const [, first] = href.split('/');
  return (routing.locales as readonly string[]).includes(first)
    ? href.slice(first.length + 1) || '/'
    : href;
}
