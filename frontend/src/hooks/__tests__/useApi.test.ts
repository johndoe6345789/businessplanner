import { renderHook, act } from '@testing-library/react';
import { useApi } from '../useApi';

describe('useApi', () => {
  it('starts with null data and not loading', () => {
    const { result } = renderHook(() =>
      useApi(() => Promise.resolve('hello')),
    );
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('refetch loads data and clears error', async () => {
    const { result } = renderHook(() =>
      useApi(() => Promise.resolve('value')),
    );
    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.data).toBe('value');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('refetch sets error message on rejection', async () => {
    const { result } = renderHook(() =>
      useApi(() =>
        Promise.reject(new Error('network error')),
      ),
    );
    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.error).toBe('network error');
    expect(result.current.data).toBeNull();
  });

  it('returns generic error for non-Error rejections', async () => {
    const { result } = renderHook(() =>
      useApi(() => Promise.reject('fail')),
    );
    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.error).toBe('Unknown error');
  });
});
