import { renderHook } from '@testing-library/react';
import {
  useKeyboardShortcuts,
} from '../useKeyboardShortcuts';

const fire = (key: string, opts: KeyboardEventInit = {}) =>
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key, ...opts }),
  );

describe('useKeyboardShortcuts', () => {
  it('invokes handler for a matching plain key', () => {
    const fn = jest.fn();
    renderHook(() => useKeyboardShortcuts({ '/': fn }));
    fire('/');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('invokes handler for a ctrl+key combo', () => {
    const fn = jest.fn();
    renderHook(() =>
      useKeyboardShortcuts({ 'ctrl+k': fn }),
    );
    fire('k', { ctrlKey: true });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not fire for a different key', () => {
    const fn = jest.fn();
    renderHook(() =>
      useKeyboardShortcuts({ 'ctrl+s': fn }),
    );
    fire('k', { ctrlKey: true });
    expect(fn).not.toHaveBeenCalled();
  });

  it('removes listener on unmount', () => {
    const fn = jest.fn();
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ '/': fn }),
    );
    unmount();
    fire('/');
    expect(fn).not.toHaveBeenCalled();
  });

  it('suppresses shortcuts while typing in an input', () => {
    const fn = jest.fn();
    renderHook(() => useKeyboardShortcuts({ '/': fn }));
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: '/', bubbles: true,
      }),
    );
    document.body.removeChild(input);
    expect(fn).not.toHaveBeenCalled();
  });
});
