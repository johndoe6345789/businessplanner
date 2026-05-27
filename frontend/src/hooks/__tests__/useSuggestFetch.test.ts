import { renderHook, act } from '@testing-library/react';
import { useSuggestFetch } from '../useSuggestFetch';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useSuggestFetch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        items: [
          {
            id: '1', title: 'React',
            url: '/react', type: 'page', snippet: '',
          },
        ],
      }),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    mockFetch.mockReset();
  });

  it('starts with empty suggestions and not loading', () => {
    const { result } = renderHook(
      () => useSuggestFetch(''),
    );
    expect(result.current.suggest).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not fetch for an empty query', () => {
    renderHook(() => useSuggestFetch(''));
    act(() => { jest.advanceTimersByTime(400); });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('debounces and fires fetch after 300ms', async () => {
    renderHook(() => useSuggestFetch('react'));
    expect(mockFetch).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(350);
    });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('react'),
      expect.any(Object),
    );
  });

  it('reset clears suggestions', async () => {
    const { result } = renderHook(
      () => useSuggestFetch('react'),
    );
    await act(async () => {
      jest.advanceTimersByTime(350);
    });
    act(() => { result.current.reset(); });
    expect(result.current.suggest).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
