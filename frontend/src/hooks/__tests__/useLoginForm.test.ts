const loginMock = jest.fn();
const validateMock = jest.fn(() => true);
const pushMock = jest.fn();

jest.mock('@/hooks', () => ({
  useAuth: () => ({
    login: loginMock, isLoading: false,
  }),
  useFormValidation: () => ({
    validate: validateMock, errors: {},
  }),
}));
jest.mock('@/components/organisms/loginRules', () => ({
  LOGIN_RULES: {},
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

import { renderHook, act } from '@testing-library/react';
import { useLoginForm } from '../useLoginForm';

const fakeEvent = {
  preventDefault: jest.fn(),
} as unknown as React.FormEvent;

describe('useLoginForm', () => {
  beforeEach(() => {
    loginMock.mockResolvedValue({});
    validateMock.mockReturnValue(true);
    pushMock.mockClear();
  });

  it('initialises with empty fields', () => {
    const { result } = renderHook(
      () => useLoginForm(),
    );
    expect(result.current.email).toBe('');
    expect(result.current.pw).toBe('');
    expect(result.current.apiError).toBeNull();
  });

  it('setEmail and setPw update state', () => {
    const { result } = renderHook(
      () => useLoginForm(),
    );
    act(() => {
      result.current.setEmail('a@b.com');
      result.current.setPw('pass123');
    });
    expect(result.current.email).toBe('a@b.com');
    expect(result.current.pw).toBe('pass123');
  });

  it('submit calls login and navigates on success', async () => {
    const { result } = renderHook(
      () => useLoginForm(),
    );
    act(() => {
      result.current.setEmail('a@b.com');
      result.current.setPw('pass123');
    });
    await act(async () => {
      await result.current.submit(fakeEvent);
    });
    expect(loginMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('sets apiError on login failure', async () => {
    loginMock.mockRejectedValue({
      data: { error: 'Invalid credentials' },
    });
    const { result } = renderHook(
      () => useLoginForm(),
    );
    await act(async () => {
      await result.current.submit(fakeEvent);
    });
    expect(result.current.apiError).toBe(
      'Invalid credentials',
    );
  });
});
