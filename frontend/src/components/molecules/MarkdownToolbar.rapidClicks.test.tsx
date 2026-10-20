/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
jest.mock('@shared/m3', () =>
  require('./markdownToolbarMocks'));
import { Harness, setSel } from './markdownToolbarHarness';

describe('MarkdownToolbar rapid clicks', () => {
  it('Code: two rapid clicks toggle off (no stacking)',
    () => {
      render(<Harness />);
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      setSel(ta, 0, 0);
      const btn = screen.getByTestId('md-tb-Code');
      fireEvent.click(btn); fireEvent.click(btn);
      expect(ta.value).toBe('');
    });

  it('Bold: three rapid clicks land at ****', () => {
    render(<Harness />);
    const ta = screen.getByTestId(
      'ta') as HTMLTextAreaElement;
    setSel(ta, 0, 0);
    const btn = screen.getByTestId('md-tb-B');
    fireEvent.click(btn); fireEvent.click(btn);
    fireEvent.click(btn);
    expect(ta.value).toBe('****');
  });

  it('Bold on selected text: rapid clicks toggle', () => {
    render(<Harness initial="hi" />);
    const ta = screen.getByTestId(
      'ta') as HTMLTextAreaElement;
    setSel(ta, 0, 2);
    const btn = screen.getByTestId('md-tb-B');
    fireEvent.click(btn);
    expect(ta.value).toBe('**hi**');
    fireEvent.click(btn);
    expect(ta.value).toBe('hi');
  });

  it('Italic: rapid clicks toggle from empty', () => {
    render(<Harness />);
    const ta = screen.getByTestId(
      'ta') as HTMLTextAreaElement;
    setSel(ta, 0, 0);
    const btn = screen.getByTestId('md-tb-I');
    fireEvent.click(btn); fireEvent.click(btn);
    expect(ta.value).toBe('');
  });

  it('• List: rapid clicks toggle on a single line',
    () => {
      render(<Harness initial="item" />);
      const ta = screen.getByTestId(
        'ta') as HTMLTextAreaElement;
      setSel(ta, 0, 4);
      const btn = screen.getByTestId('md-tb-• List');
      fireEvent.click(btn);
      expect(ta.value).toBe('- item');
      fireEvent.click(btn);
      expect(ta.value).toBe('item');
    });

  it('Code: 6 rapid clicks oscillate, never stack', () => {
    render(<Harness />);
    const ta = screen.getByTestId(
      'ta') as HTMLTextAreaElement;
    setSel(ta, 0, 0);
    const btn = screen.getByTestId('md-tb-Code');
    for (let i = 0; i < 6; i++) fireEvent.click(btn);
    expect(ta.value).toBe('');
  });

  it('Inline code: 6 rapid clicks never stack', () => {
    render(<Harness />);
    const ta = screen.getByTestId(
      'ta') as HTMLTextAreaElement;
    setSel(ta, 0, 0);
    const btn = screen.getByTestId('md-tb-</>');
    for (let i = 0; i < 6; i++) fireEvent.click(btn);
    expect(ta.value).toBe('');
    expect(ta.value.includes('``````')).toBe(false);
  });
});
