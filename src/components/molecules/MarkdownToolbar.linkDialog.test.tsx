/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
jest.mock('@shared/m3', () =>
  require('./markdownToolbarMocks'));
import { Harness, setSel } from './markdownToolbarHarness';

describe('MarkdownToolbar Link dialog', () => {
  it('opens a dialog and cancel leaves textarea '
    + 'unchanged', () => {
      render(<Harness />);
      fireEvent.click(screen.getByTestId('md-tb-Link'));
      expect(
        screen.getByTestId('link-dialog'),
      ).toBeInTheDocument();
      fireEvent.click(
        screen.getByTestId('link-dialog-cancel'));
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      expect(ta.value).toBe('');
    });

  it('inserts [text](url) at the cursor', () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId('md-tb-Link'));
    fireEvent.change(
      screen.getByTestId('link-dialog-text'),
      { target: { value: 'click' } });
    fireEvent.change(
      screen.getByTestId('link-dialog-url'),
      { target: { value: 'https://example.com' } });
    fireEvent.click(
      screen.getByTestId('link-dialog-insert'));
    const ta = screen.getByTestId(
      'ta') as HTMLTextAreaElement;
    expect(ta.value).toBe('[click](https://example.com)');
  });

  it('pre-fills text field with the current selection',
    () => {
      render(<Harness initial="hello" />);
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      setSel(ta, 0, 5);
      fireEvent.click(screen.getByTestId('md-tb-Link'));
      expect(
        (screen.getByTestId(
          'link-dialog-text') as HTMLInputElement).value,
      ).toBe('hello');
    });

  it('insert button is disabled when URL is empty', () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId('md-tb-Link'));
    const submit = screen.getByTestId(
      'link-dialog-insert') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
  });
});
