import { renderHook, act } from
  '@testing-library/react';

const selectorMock = jest.fn();

jest.mock('@/store/hooks', () => ({
  useAppSelector: (fn: (s: unknown) => unknown) =>
    selectorMock(fn),
}));

jest.mock('@/constants/launch-checklists.json', () => ({
  default: [
    {
      id: 'item-1', category: 'product',
      title: 'Deploy MVP', desc: 'Ship it',
      priority: 'high',
    },
  ],
  saas: [
    {
      id: 'saas-1', category: 'marketing',
      title: 'Set up billing', desc: 'Stripe',
      priority: 'medium',
    },
  ],
}), { virtual: true });

import { useLaunchChecklist }
  from '../useLaunchChecklist';

describe('useLaunchChecklist', () => {
  beforeEach(() => {
    localStorage.clear();
    selectorMock.mockReturnValue(null);
  });

  it('returns default items when no slug set', () => {
    const { result } =
      renderHook(() => useLaunchChecklist());
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('item-1');
  });

  it('merges slug-specific items with defaults', () => {
    selectorMock.mockReturnValue('saas');
    const { result } =
      renderHook(() => useLaunchChecklist());
    expect(result.current.items).toHaveLength(2);
    const ids = result.current.items.map(i => i.id);
    expect(ids).toContain('item-1');
    expect(ids).toContain('saas-1');
  });

  it('completed starts empty', () => {
    const { result } =
      renderHook(() => useLaunchChecklist());
    expect(result.current.completed).toEqual({});
  });

  it('toggleItem marks item as completed', () => {
    const { result } =
      renderHook(() => useLaunchChecklist());
    act(() => {
      result.current.toggleItem('item-1');
    });
    expect(result.current.completed['item-1'])
      .toBe(true);
  });

  it('toggleItem twice reverts to false', () => {
    const { result } =
      renderHook(() => useLaunchChecklist());
    act(() => {
      result.current.toggleItem('item-1');
    });
    act(() => {
      result.current.toggleItem('item-1');
    });
    expect(result.current.completed['item-1'])
      .toBe(false);
  });

  it('persists completed state to localStorage', () => {
    const { result } =
      renderHook(() => useLaunchChecklist());
    act(() => {
      result.current.toggleItem('item-1');
    });
    const stored = localStorage.getItem(
      'launchChecklist-anon',
    );
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored as string)['item-1'])
      .toBe(true);
  });
});
