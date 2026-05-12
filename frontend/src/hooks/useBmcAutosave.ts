/**
 * Auto-save hook for the Business Model Canvas.
 * Debounces saves by 1 second after the last blur event.
 * @module hooks/useBmcAutosave
 */
import { useCallback, useRef } from 'react';
import { useSaveBmcMutation }
  from '@/store/api/marketResearchBmcApi';
import type { BmcCanvas } from '@/types/marketResearch';

/** Return type of useBmcAutosave. */
export interface BmcAutosaveResult {
  /**
   * Call this on a text field's onBlur event.
   * Schedules a save 1 second after the call.
   */
  scheduleAutosave: (canvas: BmcCanvas) => void;
  /** True while a save request is in flight. */
  isSaving: boolean;
}

/**
 * Debounced auto-save for BmcCanvas.
 * The latest canvas state is saved 1 second after the
 * last scheduleAutosave call, cancelling any pending
 * timer.
 *
 * @returns Object containing scheduleAutosave and
 *   isSaving.
 */
export function useBmcAutosave(): BmcAutosaveResult {
  const [saveBmc, { isLoading: isSaving }] =
    useSaveBmcMutation();
  const timerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const scheduleAutosave = useCallback(
    (canvas: BmcCanvas) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        void saveBmc(canvas);
        timerRef.current = null;
      }, 1000);
    },
    [saveBmc],
  );

  return { scheduleAutosave, isSaving };
}
