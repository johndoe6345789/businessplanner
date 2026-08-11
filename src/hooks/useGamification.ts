'use client';

/**
 * Hook for accessing the current user's gamification
 * progress and syncing it to the Redux store.
 * @module hooks/useGamification
 */
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { useGetMyProgressQuery } from '@/store/api/gamificationApi';
import { setProgress } from '@/store/slices/gamificationSlice';
import type { GamificationProgress } from '@/types/gamification';

/** Return shape of {@link useGamification}. */
export interface UseGamificationReturn {
  /** Latest progress snapshot, or null while loading. */
  progress: GamificationProgress | undefined;
  /** True while the initial fetch is in flight. */
  isLoading: boolean;
  /** True if the fetch resulted in an error. */
  isError: boolean;
  /** Manually re-trigger the progress fetch. */
  refetch: () => void;
}

/**
 * Fetches the current user's gamification progress and
 * keeps the Redux gamification slice in sync.
 *
 * @returns Progress data, loading/error flags, and a
 *   refetch callback.
 */
export function useGamification(): UseGamificationReturn {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, refetch } =
    useGetMyProgressQuery();

  useEffect(() => {
    if (data) {
      dispatch(setProgress(data));
    }
  }, [data, dispatch]);

  return {
    progress: data,
    isLoading,
    isError,
    refetch,
  };
}
