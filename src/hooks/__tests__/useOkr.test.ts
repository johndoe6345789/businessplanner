import { renderHook, act } from
  '@testing-library/react';

const listMock = jest.fn();
const createObjMock = jest.fn();
const deleteObjMock = jest.fn();
const addKrMock = jest.fn();
const updateKrMock = jest.fn();
const deleteKrMock = jest.fn();

jest.mock('@/store/api/okrApi', () => ({
  useListOkrObjectivesQuery: (a: unknown) =>
    listMock(a),
  useCreateOkrObjectiveMutation: () =>
    [createObjMock],
  useDeleteOkrObjectiveMutation: () =>
    [deleteObjMock],
  useAddKeyResultMutation: () => [addKrMock],
  useUpdateKeyResultMutation: () => [updateKrMock],
  useDeleteKeyResultMutation: () => [deleteKrMock],
}));

import { useOkr } from '../useOkr';

const now = new Date();
const currentQ = Math.ceil((now.getMonth() + 1) / 3);
const currentY = now.getFullYear();

describe('useOkr', () => {
  beforeEach(() => {
    listMock.mockReturnValue({
      data: [], isLoading: false,
    });
  });

  it('initialises with current quarter and year', () => {
    const { result } = renderHook(() => useOkr());
    expect(result.current.quarter).toBe(currentQ);
    expect(result.current.year).toBe(currentY);
  });

  it('setQuarter updates quarter state', () => {
    const { result } = renderHook(() => useOkr());
    act(() => { result.current.setQuarter(2); });
    expect(result.current.quarter).toBe(2);
  });

  it('setYear updates year state', () => {
    const { result } = renderHook(() => useOkr());
    act(() => { result.current.setYear(2025); });
    expect(result.current.year).toBe(2025);
  });

  it('objectives defaults to empty array', () => {
    const { result } = renderHook(() => useOkr());
    expect(result.current.objectives).toEqual([]);
  });

  it('exposes all mutation functions', () => {
    const { result } = renderHook(() => useOkr());
    expect(typeof result.current.createObjective)
      .toBe('function');
    expect(typeof result.current.deleteObjective)
      .toBe('function');
    expect(typeof result.current.addKeyResult)
      .toBe('function');
    expect(typeof result.current.updateKeyResult)
      .toBe('function');
    expect(typeof result.current.deleteKeyResult)
      .toBe('function');
  });

  it('passes quarter and year to list query', () => {
    const { result } = renderHook(() => useOkr());
    act(() => {
      result.current.setQuarter(3);
      result.current.setYear(2026);
    });
    expect(listMock).toHaveBeenCalledWith(
      expect.objectContaining(
        { quarter: 3, year: 2026 },
      ),
    );
  });
});
