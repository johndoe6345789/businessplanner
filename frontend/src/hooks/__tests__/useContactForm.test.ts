import { renderHook, act } from '@testing-library/react';
import { useContactForm } from '../useContactForm';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('useContactForm', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    mockFetch.mockReset();
  });

  it('initialises with empty fields and idle status', () => {
    const { result } = renderHook(() => useContactForm());
    expect(result.current.name).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.message).toBe('');
    expect(result.current.status).toBe('idle');
  });

  it('setName updates name field', () => {
    const { result } = renderHook(() => useContactForm());
    act(() => { result.current.setName('Alice'); });
    expect(result.current.name).toBe('Alice');
  });

  it('setEmail updates email field', () => {
    const { result } = renderHook(() => useContactForm());
    act(() => { result.current.setEmail('a@b.com'); });
    expect(result.current.email).toBe('a@b.com');
  });

  it('setMessage updates message field', () => {
    const { result } = renderHook(() => useContactForm());
    act(() => {
      result.current.setMessage('Hello there');
    });
    expect(result.current.message).toBe('Hello there');
  });

  it('handleSubmit transitions status to sent', async () => {
    const { result } = renderHook(() => useContactForm());
    const fakeEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(result.current.status).toBe('sent');
  });

  it('handleSubmit calls preventDefault', async () => {
    const { result } = renderHook(() => useContactForm());
    const fakeEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it('handleSubmit POSTs name, email, message', async () => {
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
          name: 'Bob', email: 'bob@x.com', message: 'Hi',
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
