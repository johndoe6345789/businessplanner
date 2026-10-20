const queryMock = jest.fn();
const createMock = jest.fn();
const deleteMock = jest.fn();
const upsertMock = jest.fn();

jest.mock('@/store/api/bowlingApi', () => ({
  useListBowlingObjectivesQuery: (_y: number) =>
    queryMock(),
  useCreateBowlingObjectiveMutation: () => [createMock],
  useDeleteBowlingObjectiveMutation: () => [deleteMock],
  useUpsertBowlingMonthMutation: () => [upsertMock],
}));

import { renderHook, act } from '@testing-library/react';
import { useBowlingChart } from '../useBowlingChart';

describe('useBowlingChart', () => {
  beforeEach(() => {
    queryMock.mockReturnValue({
      data: [], isLoading: false,
    });
  });

  it('initialises year to the current year', () => {
    const { result } = renderHook(
      () => useBowlingChart(),
    );
    expect(result.current.year).toBe(
      new Date().getFullYear(),
    );
  });

  it('setYear updates the year', () => {
    const { result } = renderHook(
      () => useBowlingChart(),
    );
    act(() => { result.current.setYear(2025); });
    expect(result.current.year).toBe(2025);
  });

  it('exposes objective list and loading flag', () => {
    queryMock.mockReturnValue({
      data: [{ id: '1', title: 'Obj' }],
      isLoading: true,
    });
    const { result } = renderHook(
      () => useBowlingChart(),
    );
    expect(result.current.objectives).toHaveLength(1);
    expect(result.current.isLoading).toBe(true);
  });

  it('exposes mutation callbacks', () => {
    const { result } = renderHook(
      () => useBowlingChart(),
    );
    expect(result.current.createObjective).toBe(createMock);
    expect(result.current.deleteObjective).toBe(deleteMock);
    expect(result.current.upsertMonth).toBe(upsertMock);
  });
});
