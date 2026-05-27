const pushMock = jest.fn();
const toggleModeMock = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));
jest.mock('../useThemeMode', () => ({
  useThemeMode: () => ({
    toggleMode: toggleModeMock,
    mode: 'light', setMode: jest.fn(),
  }),
}));
jest.mock('@/constants/routes.json', () => ({
  dashboard: '/dashboard',
  notifications: '/notifications',
  chat: '/chat',
}), { virtual: true });

import { renderHook } from '@testing-library/react';
import { useGlobalShortcuts } from '../useGlobalShortcuts';

const fire = (key: string, opts: KeyboardEventInit = {}) =>
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key, ...opts }),
  );

describe('useGlobalShortcuts', () => {
  beforeEach(() => {
    pushMock.mockClear();
    toggleModeMock.mockClear();
  });

  it('toggles theme mode on ctrl+shift+d', () => {
    renderHook(() => useGlobalShortcuts());
    fire('d', { ctrlKey: true, shiftKey: true });
    expect(toggleModeMock).toHaveBeenCalled();
  });

  it('navigates to dashboard on ctrl+h', () => {
    renderHook(() => useGlobalShortcuts());
    fire('h', { ctrlKey: true });
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to chat on ctrl+j', () => {
    renderHook(() => useGlobalShortcuts());
    fire('j', { ctrlKey: true });
    expect(pushMock).toHaveBeenCalledWith('/chat');
  });

  it('calls onFocusSearch when / is pressed', () => {
    const onFocusSearch = jest.fn();
    renderHook(() =>
      useGlobalShortcuts({ onFocusSearch }),
    );
    fire('/');
    expect(onFocusSearch).toHaveBeenCalled();
  });
});
