import { renderHook, act } from '@testing-library/react';
import { useNavSections } from '../useNavSections';

const STORAGE_KEY = 'businessplanner-nav-sections';

beforeEach(() => {
  localStorage.clear();
});

describe('useNavSections', () => {
  it('returns default open state from nav-groups config', () => {
    const { result } = renderHook(() => useNavSections());
    // "plan" is defaultOpen:true in nav-groups.json
    expect(result.current.open['plan']).toBe(true);
    // "discover" is defaultOpen:false
    expect(result.current.open['discover']).toBe(false);
  });

  it('toggles a section from true to false', () => {
    const { result } = renderHook(() => useNavSections());
    act(() => { result.current.toggle('plan'); });
    expect(result.current.open['plan']).toBe(false);
  });

  it('toggles a section from false to true', () => {
    const { result } = renderHook(() => useNavSections());
    act(() => { result.current.toggle('discover'); });
    expect(result.current.open['discover']).toBe(true);
  });

  it('persists state to localStorage on toggle', () => {
    const { result } = renderHook(() => useNavSections());
    act(() => { result.current.toggle('finance'); });
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '{}'
    ) as Record<string, boolean>;
    expect(stored['finance']).toBe(true);
  });

  it('restores state from localStorage on mount', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ plan: false, discover: true, finance: false }),
    );
    const { result } = renderHook(() => useNavSections());
    expect(result.current.open['plan']).toBe(false);
    expect(result.current.open['discover']).toBe(true);
  });

  it('falls back to defaults when localStorage value is invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    const { result } = renderHook(() => useNavSections());
    expect(result.current.open['plan']).toBe(true);
  });
});
