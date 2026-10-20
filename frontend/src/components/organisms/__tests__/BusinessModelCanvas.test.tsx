import React from 'react';
import { render, screen, fireEvent } from
  '@testing-library/react';
import BusinessModelCanvas from '../BusinessModelCanvas';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

const scheduleAutosave = jest.fn();
const handleChange = jest.fn();
const canvas = {
  problem: 'old problem', solution: '', uvp: '',
  channels: '', customerSegments: '', costStructure: '',
  revenueStreams: '', keyMetrics: '', unfairAdvantage: '',
};
jest.mock('@/hooks/useBusinessModelCanvas', () => ({
  useBusinessModelCanvas: () => ({
    canvas, isLoading: false, handleChange,
    scheduleAutosave,
  }),
}));

beforeEach(() => jest.clearAllMocks());

describe('BusinessModelCanvas', () => {
  it('saves as you type, with the new text included', () => {
    render(<BusinessModelCanvas />);
    const box = screen.getByLabelText('problem');
    fireEvent.change(box, { target: { value: 'new text' } });
    expect(handleChange)
      .toHaveBeenCalledWith('problem', 'new text');
    expect(scheduleAutosave).toHaveBeenCalledWith(
      expect.objectContaining({
        problem: 'new text', solution: '',
      }));
  });
});
