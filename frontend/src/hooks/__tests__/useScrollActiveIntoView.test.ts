import { renderHook } from '@testing-library/react';
import {
  useScrollActiveIntoView,
} from '../useScrollActiveIntoView';

describe('useScrollActiveIntoView', () => {
  it('returns a ref object initially null', () => {
    const { result } = renderHook(
      () => useScrollActiveIntoView(0),
    );
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('current');
  });

  it('calls scrollIntoView when activeIndex changes', () => {
    const scrollIntoView = jest.fn();
    const ul = document.createElement('ul');
    for (let i = 0; i < 3; i++) {
      const li = document.createElement('li');
      li.scrollIntoView = scrollIntoView;
      ul.appendChild(li);
    }
    document.body.appendChild(ul);

    const { result, rerender } = renderHook(
      ({ idx }: { idx: number }) =>
        useScrollActiveIntoView(idx),
      { initialProps: { idx: 0 } },
    );

    Object.defineProperty(result.current, 'current', {
      value: ul, writable: true,
    });

    rerender({ idx: 2 });
    expect(scrollIntoView).toHaveBeenCalled();
    document.body.removeChild(ul);
  });
});
