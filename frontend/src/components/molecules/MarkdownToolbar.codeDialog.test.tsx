/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
jest.mock('@shared/m3', () =>
  require('./markdownToolbarMocks'));
import { Harness, setSel } from './markdownToolbarHarness';

describe('MarkdownToolbar Code ambiguity dialog', () => {
  it('opens a dialog on non-empty content with no '
    + 'selection', () => {
      render(<Harness initial="hello" />);
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      setSel(ta, 5, 5);
      fireEvent.click(screen.getByTestId('md-tb-Code'));
      expect(ta.value).toBe('hello');
      expect(
        screen.getByTestId('md-action-dialog'),
      ).toBeInTheDocument();
    });

  it('"Wrap current line" wraps the word', () => {
    render(<Harness initial="hello" />);
    const ta = screen.getByTestId(
      'ta') as HTMLTextAreaElement;
    setSel(ta, 5, 5);
    fireEvent.click(screen.getByTestId('md-tb-Code'));
    fireEvent.click(
      screen.getByTestId('md-action-dialog-wrap'));
    expect(ta.value).toBe('```\nhello\n```');
  });

  it('"Insert empty block" keeps content and adds '
    + 'a new block', () => {
      render(<Harness initial="hello" />);
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      setSel(ta, 5, 5);
      fireEvent.click(screen.getByTestId('md-tb-Code'));
      fireEvent.click(
        screen.getByTestId('md-action-dialog-insert'));
      expect(ta.value).toBe('hello\n```\n\n```');
    });

  it('Cancel leaves textarea unchanged', () => {
    render(<Harness initial="hello" />);
    const ta = screen.getByTestId(
      'ta') as HTMLTextAreaElement;
    setSel(ta, 5, 5);
    fireEvent.click(screen.getByTestId('md-tb-Code'));
    fireEvent.click(
      screen.getByTestId('md-action-dialog-cancel'));
    expect(ta.value).toBe('hello');
    expect(
      screen.queryByTestId('md-action-dialog'),
    ).toBeNull();
  });

  it('does NOT open the dialog inside an existing '
    + 'fenced block', () => {
      render(<Harness initial={'```\nhi\n```'} />);
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      setSel(ta, 5, 5);
      fireEvent.click(screen.getByTestId('md-tb-Code'));
      expect(
        screen.queryByTestId('md-action-dialog'),
      ).toBeNull();
      expect(ta.value).toBe('hi');
    });
});
