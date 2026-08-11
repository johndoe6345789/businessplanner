import { renderHook } from '@testing-library/react';
import { useScrollLock } from '../useScrollLock';

describe('useScrollLock', () => {
  afterEach(() => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
  });

  it('sets body to fixed/hidden when locked', () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.width).toBe('100%');
  });

  it('does not modify body when not locked', () => {
    renderHook(() => useScrollLock(false));
    expect(document.body.style.position).toBe('');
    expect(document.body.style.overflow).toBe('');
  });

  it('restores body styles on unmount', () => {
    const { unmount } = renderHook(
      () => useScrollLock(true),
    );
    unmount();
    expect(document.body.style.position).toBe('');
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.width).toBe('');
  });
});
