import { renderHook, act } from '@testing-library/react';

const saveMock = jest.fn();

jest.mock('@/store/api/marketResearchBmcApi', () => ({
  useSaveBmcMutation: () => [
    saveMock, { isLoading: false },
  ],
}));

import { useBmcAutosave } from '../useBmcAutosave';
import type { BmcCanvas } from '@/types/marketResearch';

const CANVAS: BmcCanvas = {
  problem: 'p', solution: 's', uvp: 'u',
  channels: 'c', customerSegments: 'cs',
  costStructure: 'co', revenueStreams: 'r',
  keyMetrics: 'km', unfairAdvantage: 'ua',
};

describe('useBmcAutosave', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    saveMock.mockReset();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not call save before timer fires', () => {
    const { result } = renderHook(() => useBmcAutosave());
    act(() => { result.current.scheduleAutosave(CANVAS); });
    expect(saveMock).not.toHaveBeenCalled();
  });

  it('calls save after 1000ms', () => {
    const { result } = renderHook(() => useBmcAutosave());
    act(() => { result.current.scheduleAutosave(CANVAS); });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(saveMock).toHaveBeenCalledWith(CANVAS);
  });

  it('debounces: only saves once on rapid calls', () => {
    const { result } = renderHook(() => useBmcAutosave());
    act(() => {
      result.current.scheduleAutosave(CANVAS);
      result.current.scheduleAutosave(CANVAS);
      result.current.scheduleAutosave(CANVAS);
    });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  it('uses latest canvas when debouncing', () => {
    const canvas2: BmcCanvas = { ...CANVAS, problem: 'new' };
    const { result } = renderHook(() => useBmcAutosave());
    act(() => { result.current.scheduleAutosave(CANVAS); });
    act(() => { jest.advanceTimersByTime(500); });
    act(() => { result.current.scheduleAutosave(canvas2); });
    act(() => { jest.advanceTimersByTime(1000); });
    expect(saveMock).toHaveBeenCalledWith(canvas2);
  });

  it('exposes isSaving as false', () => {
    const { result } = renderHook(() => useBmcAutosave());
    expect(result.current.isSaving).toBe(false);
  });
});
