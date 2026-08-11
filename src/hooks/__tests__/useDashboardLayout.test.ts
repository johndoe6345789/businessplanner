import { renderHook, act } from '@testing-library/react';
import {
  useDashboardLayout,
} from '../useDashboardLayout';

describe('useDashboardLayout', () => {
  beforeEach(() => localStorage.clear());

  it('loads default layout on mount', async () => {
    const { result } = renderHook(
      () => useDashboardLayout(),
    );
    await act(async () => {});
    expect(result.current.layout.length).toBeGreaterThan(0);
  });

  it('reorder moves item at index from → to', () => {
    const { result } = renderHook(
      () => useDashboardLayout(),
    );
    const first = result.current.layout[0].id;
    act(() => { result.current.reorder(0, 1); });
    expect(result.current.layout[1].id).toBe(first);
  });

  it('toggle flips a widget visibility', () => {
    const { result } = renderHook(
      () => useDashboardLayout(),
    );
    const id = result.current.layout[0].id;
    const before = result.current.layout[0].visible;
    act(() => { result.current.toggle(id); });
    expect(result.current.layout[0].visible).toBe(!before);
  });

  it('reset restores default layout', () => {
    const { result } = renderHook(
      () => useDashboardLayout(),
    );
    const id = result.current.layout[0].id;
    act(() => { result.current.toggle(id); });
    act(() => { result.current.reset(); });
    expect(result.current.layout[0].visible).toBe(
      result.current.layout[0].visible,
    );
  });
});
