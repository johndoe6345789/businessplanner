/**
 * Relative-time formatting utility.
 * @module utils/relativeTime
 */

/** Translation function subset used for time labels. */
export type TimeTFn = (
  key: string,
  params?: Record<string, number>,
) => string;

/**
 * Returns a short human-readable relative-time
 * string for the given ISO-8601 timestamp.
 *
 * @param iso - ISO-8601 date string.
 * @param t - next-intl translation function.
 * @returns Localised relative time label.
 */
export function formatRelativeTime(
  iso: string,
  t: TimeTFn,
): string {
  const mins = Math.floor(
    (Date.now() - new Date(iso).getTime()) / 60_000,
  );
  if (mins < 1) return t('justNow');
  if (mins < 60) return t('minutesAgo', { n: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t('hoursAgo', { n: hrs });
  return t('daysAgo', { n: Math.floor(hrs / 24) });
}
