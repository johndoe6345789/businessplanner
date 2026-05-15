import { renderHook, act } from
  '@testing-library/react';

const listMock = jest.fn();
const createMock = jest.fn();
const updateMock = jest.fn();
const removeMock = jest.fn();

jest.mock('@/store/api/pivotApi', () => ({
  useListPivotsQuery: () => listMock(),
  useCreatePivotMutation: () => [createMock],
  useUpdatePivotMutation: () => [updateMock],
  useDeletePivotMutation: () => [removeMock],
}));

import { usePivotTracker } from '../usePivotTracker';

const ok = <T,>(v: T) =>
  ({ unwrap: () => Promise.resolve(v) });

const PIVOT = {
  id: '1', original_idea: 'A',
  new_direction: 'B', trigger_event: 'C',
  rationale: 'D', plan_impact: 'E',
  pivoted_at: '2024-01-01',
  created_at: '2024-01-01',
};

describe('usePivotTracker', () => {
  beforeEach(() => {
    listMock.mockReturnValue({
      data: [], isLoading: false, isError: false,
    });
    createMock.mockReset();
    updateMock.mockReset();
    removeMock.mockReset();
  });

  it('openAdd sets open and clears editing', () => {
    const { result } =
      renderHook(() => usePivotTracker());
    act(() => { result.current.openAdd(); });
    expect(result.current.open).toBe(true);
    expect(result.current.editing).toBeNull();
  });

  it('openEdit populates form from pivot', () => {
    const { result } =
      renderHook(() => usePivotTracker());
    act(() => { result.current.openEdit(PIVOT); });
    expect(result.current.editing).toBe(PIVOT);
    expect(result.current.form.original_idea).toBe('A');
  });

  it('handleSave create calls create().unwrap', async () => {
    createMock.mockReturnValue(ok({}));
    const { result } =
      renderHook(() => usePivotTracker());
    act(() => { result.current.openAdd(); });
    await act(async () => {
      await result.current.handleSave();
    });
    expect(createMock).toHaveBeenCalled();
    expect(result.current.open).toBe(false);
  });

  it('handleSave update calls update().unwrap', async () => {
    updateMock.mockReturnValue(ok({}));
    const { result } =
      renderHook(() => usePivotTracker());
    act(() => { result.current.openEdit(PIVOT); });
    await act(async () => {
      await result.current.handleSave();
    });
    expect(updateMock).toHaveBeenCalled();
    expect(result.current.open).toBe(false);
  });

  it('handleSave error sets saveError', async () => {
    createMock.mockReturnValue({
      unwrap: () =>
        Promise.reject(new Error('fail')),
    });
    const { result } =
      renderHook(() => usePivotTracker());
    act(() => { result.current.openAdd(); });
    await act(async () => {
      await result.current.handleSave();
    });
    expect(result.current.saveError).not.toBeNull();
  });

  it('handleDelete calls remove with id', () => {
    removeMock.mockReturnValue({});
    const { result } =
      renderHook(() => usePivotTracker());
    act(() => { result.current.handleDelete('1'); });
    expect(removeMock).toHaveBeenCalledWith('1');
  });
});
