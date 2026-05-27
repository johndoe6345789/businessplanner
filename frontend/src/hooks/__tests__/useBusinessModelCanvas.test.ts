import { renderHook, act } from '@testing-library/react';

const getBmcMock = jest.fn();
const scheduleMock = jest.fn();

jest.mock('@/store/api/marketResearchBmcApi', () => ({
  useGetBmcQuery: () => getBmcMock(),
  useSaveBmcMutation: () => [
    jest.fn(), { isLoading: false },
  ],
}));

jest.mock('@/hooks/useBmcAutosave', () => ({
  useBmcAutosave: () => ({
    scheduleAutosave: scheduleMock,
    isSaving: false,
  }),
}));

import {
  useBusinessModelCanvas,
} from '../useBusinessModelCanvas';
import type { BmcCanvas } from '@/types/marketResearch';

const SERVER_CANVAS: BmcCanvas = {
  problem: 'prob', solution: 'sol', uvp: 'val',
  channels: 'ch', customerSegments: 'seg',
  costStructure: 'cost', revenueStreams: 'rev',
  keyMetrics: 'km', unfairAdvantage: 'ua',
};

describe('useBusinessModelCanvas', () => {
  beforeEach(() => {
    getBmcMock.mockReturnValue({
      data: undefined, isLoading: false,
    });
    scheduleMock.mockReset();
  });

  it('starts with empty canvas', () => {
    const { result } = renderHook(
      () => useBusinessModelCanvas());
    expect(result.current.canvas.problem).toBe('');
  });

  it('populates canvas when data arrives', () => {
    getBmcMock.mockReturnValue({
      data: SERVER_CANVAS, isLoading: false,
    });
    const { result } = renderHook(
      () => useBusinessModelCanvas());
    expect(result.current.canvas.problem).toBe('prob');
  });

  it('handleChange updates the canvas field', () => {
    const { result } = renderHook(
      () => useBusinessModelCanvas());
    act(() => {
      result.current.handleChange('problem', 'new');
    });
    expect(result.current.canvas.problem).toBe('new');
  });

  it('handleChange does not mutate other fields', () => {
    getBmcMock.mockReturnValue({
      data: SERVER_CANVAS, isLoading: false,
    });
    const { result } = renderHook(
      () => useBusinessModelCanvas());
    act(() => {
      result.current.handleChange('solution', 'x');
    });
    expect(result.current.canvas.problem).toBe('prob');
    expect(result.current.canvas.solution).toBe('x');
  });

  it('exposes scheduleAutosave from useBmcAutosave', () => {
    const { result } = renderHook(
      () => useBusinessModelCanvas());
    expect(result.current.scheduleAutosave)
      .toBe(scheduleMock);
  });

  it('forwards isLoading from the query', () => {
    getBmcMock.mockReturnValue({
      data: undefined, isLoading: true,
    });
    const { result } = renderHook(
      () => useBusinessModelCanvas());
    expect(result.current.isLoading).toBe(true);
  });
});
