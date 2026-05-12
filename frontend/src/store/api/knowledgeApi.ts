/**
 * Knowledge-base RTK Query endpoints.
 * @module store/api/knowledgeApi
 */
import { baseApi } from './baseApi';
import type { KbArticle } from '@/types/knowledge';
import apiConstants from '@/constants/api.json';

/** Query args for the KB article list endpoint. */
export interface ListKbArticlesArgs {
  /** Filter by startup archetype slug. */
  startupType?: string;
  /** Filter by lifecycle stage slug. */
  stage?: string;
  /** Filter by KB content category. */
  kbType?: string;
}

/** Build a query string from defined args. */
function kbParams(args: ListKbArticlesArgs): string {
  const p = new URLSearchParams();
  if (args.startupType) p.set('startup_type', args.startupType);
  if (args.stage) p.set('stage', args.stage);
  if (args.kbType) p.set('kb_type', args.kbType);
  const qs = p.toString();
  return qs ? `?${qs}` : '';
}

/** Knowledge-base API endpoints injected into baseApi. */
export const knowledgeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * List KB articles, optionally filtered.
     * @param args - Optional filter parameters.
     * @returns Array of matching KB articles.
     */
    listKbArticles: build.query<
      KbArticle[],
      ListKbArticlesArgs
    >({
      query: (args) =>
        `${apiConstants.knowledge}${kbParams(args)}`,
      providesTags: ['Knowledge'],
    }),
  }),
  overrideExisting: false,
});

export const { useListKbArticlesQuery } = knowledgeApi;
