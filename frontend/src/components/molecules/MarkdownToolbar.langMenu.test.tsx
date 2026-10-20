/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
jest.mock('@shared/m3', () =>
  require('./markdownToolbarMocks'));
import { Harness, setSel } from './markdownToolbarHarness';

describe('MarkdownToolbar Code language menu', () => {
  it('chevron opens a language menu with supported '
    + 'languages', () => {
      render(<Harness />);
      fireEvent.click(
        screen.getByTestId('md-tb-Code-lang'));
      expect(
        screen.getByTestId('code-lang-menu'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('code-lang-typescript'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('code-lang-python'),
      ).toBeInTheDocument();
    });

  it('picking a language inserts a fenced block '
    + 'with that tag', () => {
      render(<Harness />);
      fireEvent.click(
        screen.getByTestId('md-tb-Code-lang'));
      fireEvent.click(
        screen.getByTestId('code-lang-python'));
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      expect(ta.value).toBe('```python\n\n```');
    });

  it('picking "Plain" inserts a language-less block',
    () => {
      render(<Harness />);
      fireEvent.click(
        screen.getByTestId('md-tb-Code-lang'));
      fireEvent.click(
        screen.getByTestId('code-lang-plain'));
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      expect(ta.value).toBe('```\n\n```');
    });

  it('picking a language wraps the current selection',
    () => {
      render(<Harness initial="print('hi')" />);
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      setSel(ta, 0, ta.value.length);
      fireEvent.click(
        screen.getByTestId('md-tb-Code-lang'));
      fireEvent.click(
        screen.getByTestId('code-lang-python'));
      expect(ta.value).toBe(
        "```python\nprint('hi')\n```");
    });
});
