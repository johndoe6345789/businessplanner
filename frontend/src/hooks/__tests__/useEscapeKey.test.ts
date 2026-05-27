import { renderHook } from '@testing-library/react';
import { useEscapeKey } from '../useEscapeKey';

const fireEscape = () =>
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Escape' }),
  );

describe('useEscapeKey', () => {
  it('calls handler when Escape is pressed and active', () => {
    const handler = jest.fn();
    renderHook(() => useEscapeKey(true, handler));
    fireEscape();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when inactive', () => {
    const handler = jest.fn();
    renderHook(() => useEscapeKey(false, handler));
    fireEscape();
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes listener on unmount', () => {
    const handler = jest.fn();
    const { unmount } = renderHook(
      () => useEscapeKey(true, handler),
    );
    unmount();
    fireEscape();
    expect(handler).not.toHaveBeenCalled();
  });

  it('ignores non-Escape keys', () => {
    const handler = jest.fn();
    renderHook(() => useEscapeKey(true, handler));
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter' }),
    );
    expect(handler).not.toHaveBeenCalled();
  });
});
