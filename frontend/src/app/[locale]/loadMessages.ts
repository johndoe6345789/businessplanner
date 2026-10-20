/**
 * Loads translation messages for a given locale.
 * Fetches from the backend translation API (Postgres),
 * merging over a bundled English fallback so client
 * components always have translations even when the API
 * lacks a namespace (e.g. newly-seeded keys).
 * @module app/[locale]/loadMessages
 */
import enFallback from '../../messages/en.json';

/**
 * Fetch translation messages for the active locale.
 *
 * Always starts from the bundled English fallback so
 * that namespaces not yet seeded in Postgres (e.g.
 * planner) still render with real text. API data is
 * merged on top, taking precedence for any shared keys.
 *
 * @param locale - The BCP 47 locale code.
 * @returns A record of translation messages.
 */
export async function loadMessages(
  locale: string,
): Promise<Record<string, unknown>> {
  const base: Record<string, unknown> = {
    ...(enFallback as Record<string, unknown>),
  };
  try {
    const apiUrl = process.env.INTERNAL_API_URL
      ?? 'http://localhost:8080';
    const res = await fetch(
      `${apiUrl}/api/translations/${locale}`,
      { next: { revalidate: 60 } },
    );
    if (res.ok) {
      const data = (await res.json()) as Record<
        string, unknown
      >;
      if (Object.keys(data).length > 0) {
        return { ...base, ...data };
      }
    }
  } catch {
    /* API unreachable — bundled fallback is used. */
  }
  return base;
}
