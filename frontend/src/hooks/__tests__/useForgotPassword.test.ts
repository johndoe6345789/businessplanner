const unwrapMock = jest.fn();
const forgotPwMock = jest.fn(() => ({ unwrap: unwrapMock }));
const isLoadingMock = { isLoading: false };

jest.mock('@/store/api/authApi', () => ({
  useForgotPasswordMutation: () =>
    [forgotPwMock, isLoadingMock],
}));

import { renderHook, act } from '@testing-library/react';
import {
  useForgotPassword,
} from '../useForgotPassword';

const fakeEvent = {
  preventDefault: jest.fn(),
} as unknown as React.FormEvent;

describe('useForgotPassword', () => {
  beforeEach(() => {
    forgotPwMock.mockClear();
    unwrapMock.mockResolvedValue({});
  });

  it('initialises with empty fields and no errors', () => {
    const { result } = renderHook(() => useForgotPassword());
    expect(result.current.email).toBe('');
    expect(result.current.success).toBe(false);
    expect(result.current.apiError).toBeNull();
  });

  it('setEmail updates email state', () => {
    const { result } = renderHook(() => useForgotPassword());
    act(() => { result.current.setEmail('a@b.com'); });
    expect(result.current.email).toBe('a@b.com');
  });

  it('submit calls mutation and sets success on ok', async () => {
    const { result } = renderHook(() => useForgotPassword());
    act(() => { result.current.setEmail('a@b.com'); });
    await act(async () => {
      await result.current.submit(fakeEvent);
    });
    expect(forgotPwMock).toHaveBeenCalledWith(
      { email: 'a@b.com' },
    );
    expect(result.current.success).toBe(true);
    expect(result.current.apiError).toBeNull();
  });

  it('sets apiError on mutation failure', async () => {
    unwrapMock.mockRejectedValue({
      data: { message: 'User not found' },
    });
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      await result.current.submit(fakeEvent);
    });
    expect(result.current.success).toBe(false);
    expect(result.current.apiError).toBe('User not found');
  });

  it('falls back to generic message on unknown error', async () => {
    unwrapMock.mockRejectedValue({});
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      await result.current.submit(fakeEvent);
    });
    expect(result.current.apiError).toBe(
      'Something went wrong.',
    );
  });
});
