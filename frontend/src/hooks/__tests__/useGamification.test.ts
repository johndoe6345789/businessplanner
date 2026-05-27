const dispatchMock = jest.fn();
const refetchMock = jest.fn();
const queryMock = jest.fn();

jest.mock('@/store/hooks', () => ({
  useAppDispatch: () => dispatchMock,
}));
jest.mock('@/store/api/gamificationApi', () => ({
  useGetMyProgressQuery: () => queryMock(),
}));
jest.mock('@/store/slices/gamificationSlice', () => ({
  setProgress: (p: unknown) => ({
    type: 'gamification/setProgress', payload: p,
  }),
}));

import { renderHook } from '@testing-library/react';
import { useGamification } from '../useGamification';

describe('useGamification', () => {
  beforeEach(() => {
    dispatchMock.mockClear();
    queryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: refetchMock,
    });
  });

  it('returns loading state while fetching', () => {
    const { result } = renderHook(() => useGamification());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.progress).toBeUndefined();
  });

  it('dispatches setProgress when data arrives', () => {
    const progress = { xp: 100, level: 2, badges: [] };
    queryMock.mockReturnValue({
      data: progress,
      isLoading: false,
      isError: false,
      refetch: refetchMock,
    });
    renderHook(() => useGamification());
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({ payload: progress }),
    );
  });

  it('exposes isError flag', () => {
    queryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: refetchMock,
    });
    const { result } = renderHook(() => useGamification());
    expect(result.current.isError).toBe(true);
  });

  it('exposes refetch callback', () => {
    const { result } = renderHook(() => useGamification());
    result.current.refetch();
    expect(refetchMock).toHaveBeenCalled();
  });
});
