import { renderHook, act } from '@testing-library/react';
import { useContactForm } from '../useContactForm';

describe('useContactForm state', () => {
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
});
