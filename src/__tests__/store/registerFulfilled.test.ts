import { makeStore } from '@/store/store';

const fulfilled = (endpointName: string, payload: unknown) => ({
  type: 'api/executeMutation/fulfilled',
  payload,
  meta: { arg: { endpointName } },
});

describe('auth slice and registration', () => {
  it('registering (no tokens back) neither throws nor signs in', () => {
    const { store } = makeStore();
    expect(() => store.dispatch(
      fulfilled('register', { success: true, loginUrl: '/login' }),
    )).not.toThrow();
    const auth = store.getState().auth;
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.isLoading).toBe(false);
  });

  it('a successful login still stores the credentials', () => {
    const { store } = makeStore();
    store.dispatch(fulfilled('login', {
      user: { id: 'u1' }, tokens: { accessToken: 'a', refreshToken: 'r' },
    }));
    expect(store.getState().auth.isAuthenticated).toBe(true);
  });
});
