/** Lean DOM stubs for @shared/m3 used by toolbar tests. */
import React from 'react';

export const Box = ({
  children, component: C = 'div' as React.ElementType,
  ...r
}: { children?: React.ReactNode; component?: React.ElementType;
  [k: string]: unknown; }) => <C {...r}>{children}</C>;

export const Button = ({
  children, onClick, testId, type = 'button' as const,
  disabled, ...r
}: { children?: React.ReactNode; onClick?: () => void;
  testId?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean; [k: string]: unknown; }) => (
  <button type={type} onClick={onClick}
    disabled={disabled} data-testid={testId} {...r}>
    {children}
  </button>
);

export const Typography = ({
  children, component: C = 'span' as React.ElementType,
  ...r
}: { children?: React.ReactNode; component?: React.ElementType;
  [k: string]: unknown; }) => <C {...r}>{children}</C>;

export const TextField = ({
  label, value, onChange,
  'data-testid': tid, required,
}: { label?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  'data-testid'?: string; required?: boolean; }) => (
  <input aria-label={label} value={value}
    onChange={onChange} data-testid={tid}
    required={required} />
);
