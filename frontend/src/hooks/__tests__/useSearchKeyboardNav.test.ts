import { renderHook } from '@testing-library/react';
import type { KeyboardEvent as ReactKeyboardEvent }
  from 'react';
import {
  useSearchKeyboardNav,
} from '../useSearchKeyboardNav';
import type {
  SearchSuggestItem,
} from '@/types/search';

const item: SearchSuggestItem = {
  type: 'page', id: '1',
  title: 'A', snippet: '', url: '/a',
};

function ev(key: string): ReactKeyboardEvent {
  const e = { key, preventDefault: jest.fn() };
  return e as unknown as ReactKeyboardEvent;
}

describe('useSearchKeyboardNav', () => {
  it('calls clear and setOpen(false) on Escape', () => {
    const clear = jest.fn();
    const setOpen = jest.fn();
    const { result } = renderHook(() =>
      useSearchKeyboardNav({
        suggest: [], active: 0,
        setActive: jest.fn(), setOpen, clear,
        submit: jest.fn(), onPick: jest.fn(),
      }),
    );
    result.current(ev('Escape'));
    expect(clear).toHaveBeenCalled();
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('calls setActive on ArrowDown', () => {
    const setActive = jest.fn();
    const { result } = renderHook(() =>
      useSearchKeyboardNav({
        suggest: [item], active: 0, setActive,
        setOpen: jest.fn(), clear: jest.fn(),
        submit: jest.fn(), onPick: jest.fn(),
      }),
    );
    result.current(ev('ArrowDown'));
    expect(setActive).toHaveBeenCalled();
  });

  it('calls setActive on ArrowUp', () => {
    const setActive = jest.fn();
    const { result } = renderHook(() =>
      useSearchKeyboardNav({
        suggest: [item], active: 1, setActive,
        setOpen: jest.fn(), clear: jest.fn(),
        submit: jest.fn(), onPick: jest.fn(),
      }),
    );
    result.current(ev('ArrowUp'));
    expect(setActive).toHaveBeenCalled();
  });

  it('calls onPick for the active item on Enter', () => {
    const onPick = jest.fn();
    const { result } = renderHook(() =>
      useSearchKeyboardNav({
        suggest: [item], active: 0,
        setActive: jest.fn(), setOpen: jest.fn(),
        clear: jest.fn(), submit: jest.fn(), onPick,
      }),
    );
    result.current(ev('Enter'));
    expect(onPick).toHaveBeenCalledWith(item);
  });

  it('calls submit when Enter with no item selected', () => {
    const submit = jest.fn();
    const setOpen = jest.fn();
    const { result } = renderHook(() =>
      useSearchKeyboardNav({
        suggest: [], active: 0,
        setActive: jest.fn(), setOpen,
        clear: jest.fn(), submit,
        onPick: jest.fn(),
      }),
    );
    result.current(ev('Enter'));
    expect(submit).toHaveBeenCalled();
  });
});
