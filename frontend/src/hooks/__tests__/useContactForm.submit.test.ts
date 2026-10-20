import { renderHook, act } from '@testing-library/react';
import { useContactForm } from '../useContactForm';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useContactForm submit', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    mockFetch.mockReset();
  });

  it('transitions status to sent on submit', async () => {
    const { result } = renderHook(() => useContactForm());
    const fakeEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.status).toBe('sent');
  });

  it('POSTs name, email and message', async () => {
    const { result } = renderHook(() => useContactForm());
    act(() => {
      result.current.setName('Bob');
      result.current.setEmail('bob@x.com');
      result.current.setMessage('Hi');
    });
    const fakeEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          name: 'Bob',
          email: 'bob@x.com',
          message: 'Hi',
        }),
      }),
    );
  });

  it('sets sent even when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('network'));
    const { result } = renderHook(() => useContactForm());
    const fakeEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.status).toBe('sent');
  });
});
