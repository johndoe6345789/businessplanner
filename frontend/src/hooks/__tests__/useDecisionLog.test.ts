import { renderHook, act } from
  '@testing-library/react';

const listMock = jest.fn();
const createMock = jest.fn();
const updateMock = jest.fn();
const removeMock = jest.fn();

jest.mock('@/store/api/decisionsApi', () => ({
  useListDecisionsQuery: (a: unknown) => listMock(a),
  useCreateDecisionMutation: () => [createMock],
  useUpdateDecisionMutation: () => [updateMock],
  useDeleteDecisionMutation: () => [removeMock],
}));

import { useDecisionLog } from '../useDecisionLog';

const DECISION = {
  id: '1', title: 'Use React', context: 'ctx',
  options_considered: 'Vue, Angular',
  decision: 'React', rationale: 'ecosystem',
  planner_step_id: 'step-1', outcome: 'good',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

describe('useDecisionLog', () => {
  beforeEach(() => {
    listMock.mockReturnValue({
      data: [], isLoading: false,
    });
    createMock.mockReset();
    updateMock.mockReset();
    removeMock.mockReset();
  });

  it('openAdd opens dialog and clears editing', () => {
    const { result } =
      renderHook(() => useDecisionLog());
    act(() => { result.current.openAdd(); });
    expect(result.current.dialogOpen).toBe(true);
    expect(result.current.editing).toBeUndefined();
  });

  it('openEdit sets editing and populates form', () => {
    const { result } =
      renderHook(() => useDecisionLog());
    act(() => {
      result.current.openEdit(DECISION);
    });
    expect(result.current.editing).toBe(DECISION);
    expect(result.current.form.title)
      .toBe('Use React');
    expect(result.current.dialogOpen).toBe(true);
  });

  it('handleSave create calls create', () => {
    const { result } =
      renderHook(() => useDecisionLog());
    act(() => { result.current.openAdd(); });
    act(() => { result.current.handleSave(); });
    expect(createMock).toHaveBeenCalled();
    expect(result.current.dialogOpen).toBe(false);
  });

  it('handleSave update calls update with id', () => {
    const { result } =
      renderHook(() => useDecisionLog());
    act(() => {
      result.current.openEdit(DECISION);
    });
    act(() => { result.current.handleSave(); });
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
    );
    expect(result.current.dialogOpen).toBe(false);
  });

  it('handleDelete calls remove with id', () => {
    const { result } =
      renderHook(() => useDecisionLog());
    act(() => {
      result.current.handleDelete('1');
    });
    expect(removeMock).toHaveBeenCalledWith('1');
  });

  it('setSearch updates search state', () => {
    const { result } =
      renderHook(() => useDecisionLog());
    act(() => {
      result.current.setSearch('foo');
    });
    expect(result.current.search).toBe('foo');
  });
});
