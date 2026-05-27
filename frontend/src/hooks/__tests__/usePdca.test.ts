import { renderHook, act } from '@testing-library/react';

const listMock = jest.fn();
const createMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();

jest.mock('@/store/api/pdcaApi', () => ({
  useListPdcaCyclesQuery: () => listMock(),
  useCreatePdcaCycleMutation: () => [createMock],
  useUpdatePdcaPhaseMutation: () => [updateMock],
  useDeletePdcaCycleMutation: () => [deleteMock],
}));

import { usePdca } from '../usePdca';
import type { PdcaCycle } from '@/types/pdca';

const PHASE = {
  notes: '', completed: false, completed_at: null,
};
const CYCLE: PdcaCycle = {
  id: 'c1', user_id: 'u1', title: 'Cycle 1',
  description: '', current_phase: 'plan',
  status: 'in-progress',
  plan_phase: PHASE, do_phase: PHASE,
  check_phase: PHASE, act_phase: PHASE,
  created_at: '2024-01-01', updated_at: '2024-01-01',
};

describe('usePdca', () => {
  beforeEach(() => {
    listMock.mockReturnValue({
      data: [CYCLE], isLoading: false,
    });
  });

  it('returns cycles from the query', () => {
    const { result } = renderHook(() => usePdca());
    expect(result.current.cycles).toHaveLength(1);
    expect(result.current.cycles[0].id).toBe('c1');
  });

  it('activeCycleId starts as null', () => {
    const { result } = renderHook(() => usePdca());
    expect(result.current.activeCycleId).toBeNull();
  });

  it('setActiveCycleId updates activeCycleId', () => {
    const { result } = renderHook(() => usePdca());
    act(() => { result.current.setActiveCycleId('c1'); });
    expect(result.current.activeCycleId).toBe('c1');
  });

  it('activeCycle resolves to matching cycle', () => {
    const { result } = renderHook(() => usePdca());
    act(() => { result.current.setActiveCycleId('c1'); });
    expect(result.current.activeCycle).toBe(CYCLE);
  });

  it('activeCycle is undefined for unknown id', () => {
    const { result } = renderHook(() => usePdca());
    act(() => { result.current.setActiveCycleId('x'); });
    expect(result.current.activeCycle).toBeUndefined();
  });

  it('exposes createCycle, updatePhase, deleteCycle', () => {
    const { result } = renderHook(() => usePdca());
    expect(result.current.createCycle).toBe(createMock);
    expect(result.current.updatePhase).toBe(updateMock);
    expect(result.current.deleteCycle).toBe(deleteMock);
  });

  it('forwards isLoading from the query', () => {
    listMock.mockReturnValue({
      data: [], isLoading: true,
    });
    const { result } = renderHook(() => usePdca());
    expect(result.current.isLoading).toBe(true);
  });
});
