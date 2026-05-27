import { renderHook, act } from '@testing-library/react';
import {
  useFormValidation,
  type ValidationRules,
} from '../useFormValidation';

const RULES: ValidationRules = {
  email: [
    { required: true, message: 'Email required' },
    { pattern: '^[^@]+@[^@]+$', message: 'Invalid email' },
  ],
  name: [
    { required: true, message: 'Name required' },
    { minLength: 2, message: 'Too short' },
    { maxLength: 50, message: 'Too long' },
  ],
};

describe('useFormValidation', () => {
  it('starts with no errors and isValid true', () => {
    const { result } = renderHook(() =>
      useFormValidation(RULES));
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('fails required rule, sets error, isValid false', () => {
    const { result } = renderHook(() =>
      useFormValidation(RULES));
    let ok: boolean;
    act(() => { ok = result.current.validate('email', ''); });
    expect(ok!).toBe(false);
    expect(result.current.errors.email).toBe('Email required');
    expect(result.current.isValid).toBe(false);
  });

  it('fails pattern rule on invalid format', () => {
    const { result } = renderHook(() =>
      useFormValidation(RULES));
    act(() => {
      result.current.validate('email', 'notanemail');
    });
    expect(result.current.errors.email).toBe('Invalid email');
  });

  it('passes and clears error when value is valid', () => {
    const { result } = renderHook(() =>
      useFormValidation(RULES));
    let ok: boolean;
    act(() => {
      ok = result.current.validate(
        'email', 'user@example.com');
    });
    expect(ok!).toBe(true);
    expect(result.current.errors.email).toBeUndefined();
  });

  it('fails minLength rule', () => {
    const { result } = renderHook(() =>
      useFormValidation(RULES));
    act(() => { result.current.validate('name', 'a'); });
    expect(result.current.errors.name).toBe('Too short');
  });

  it('fails maxLength rule', () => {
    const { result } = renderHook(() =>
      useFormValidation(RULES));
    act(() => {
      result.current.validate('name', 'a'.repeat(51));
    });
    expect(result.current.errors.name).toBe('Too long');
  });

  it('clearErrors resets all field errors', () => {
    const { result } = renderHook(() =>
      useFormValidation(RULES));
    act(() => {
      result.current.validate('email', '');
      result.current.validate('name', '');
    });
    act(() => { result.current.clearErrors(); });
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('returns true for unknown fields (no rules)', () => {
    const { result } = renderHook(() =>
      useFormValidation(RULES));
    let ok: boolean;
    act(() => {
      ok = result.current.validate('unknown', '');
    });
    expect(ok!).toBe(true);
  });
});
