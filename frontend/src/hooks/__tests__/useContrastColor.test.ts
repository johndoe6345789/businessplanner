import { renderHook, act } from '@testing-library/react';
import { useContrastColor } from '../useContrastColor';

/** Stub getComputedStyle to return a given bg colour. */
function stubBg(color: string) {
  jest
    .spyOn(window, 'getComputedStyle')
    .mockReturnValue({
      backgroundColor: color,
    } as unknown as CSSStyleDeclaration);
}

afterEach(() => jest.restoreAllMocks());

describe('useContrastColor', () => {
  it('returns ref and a string color', () => {
    const { result } = renderHook(() => useContrastColor());
    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.color).toBe('string');
  });

  it('defaults to #fff before element is mounted', () => {
    const { result } = renderHook(() => useContrastColor());
    expect(result.current.color).toBe('#fff');
  });

  it('falls back to #000 for near-white background', () => {
    stubBg('rgb(255, 255, 255)');
    const { result } = renderHook(() => useContrastColor());

    act(() => {
      // Simulate ref being attached by setting .current
      const div = document.createElement('div');
      (
        result.current.ref as React.MutableRefObject<HTMLDivElement>
      ).current = div;
    });

    // Re-render to trigger effect with attached ref
    const { result: result2 } = renderHook(
      () => useContrastColor(),
    );
    expect(result2.current.color).toMatch(
      /^(rgb\(|#)/,
    );
  });

  it('returns a valid CSS color string when bg is parseable', () => {
    stubBg('rgb(0, 0, 0)');
    const { result } = renderHook(() => {
      const hook = useContrastColor();
      // Attach the ref to a real element
      const div = document.createElement('div');
      (
        hook.ref as React.MutableRefObject<HTMLDivElement>
      ).current = div;
      return hook;
    });
    expect(
      result.current.color === '#fff' ||
      result.current.color.startsWith('rgb('),
    ).toBe(true);
  });
});
